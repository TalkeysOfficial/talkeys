const asyncHandler = require("express-async-handler");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const Team = require("../models/teams.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const qs = require("qs");

const CONFIG = {
  production: {
    AUTH_URL: "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
    BASE_URL: "https://api.phonepe.com/apis/pg",
    CHECKOUT_SCRIPT: "https://mercury.phonepe.com/web/bundle/checkout.js",
  },
  sandbox: {
    AUTH_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    BASE_URL: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    CHECKOUT_SCRIPT: "https://mercury-uat.phonepe.com/web/bundle/checkout.js",
  },
  CLIENT_VERSION: "1",
};

const cleanEnvValue = (value) =>
  String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "");

const getPhonePeConfig = () => {
  const configuredEnv = cleanEnvValue(process.env.PHONEPE_ENV).toLowerCase();

  if (["production", "prod", "live"].includes(configuredEnv)) {
    return {
      AUTH_URL: cleanEnvValue(process.env.PHONEPE_AUTH_URL) || CONFIG.production.AUTH_URL,
      BASE_URL: cleanEnvValue(process.env.PHONEPE_BASE_URL) || CONFIG.production.BASE_URL,
      CHECKOUT_SCRIPT:
        cleanEnvValue(process.env.PHONEPE_CHECKOUT_SCRIPT) ||
        CONFIG.production.CHECKOUT_SCRIPT,
    };
  }

  if (["sandbox", "staging", "test", "preprod", "uat", "development"].includes(configuredEnv)) {
    return {
      AUTH_URL: cleanEnvValue(process.env.PHONEPE_AUTH_URL) || CONFIG.sandbox.AUTH_URL,
      BASE_URL: cleanEnvValue(process.env.PHONEPE_BASE_URL) || CONFIG.sandbox.BASE_URL,
      CHECKOUT_SCRIPT:
        cleanEnvValue(process.env.PHONEPE_CHECKOUT_SCRIPT) || CONFIG.sandbox.CHECKOUT_SCRIPT,
    };
  }

  const defaultConfig = cleanEnvValue(process.env.PHONEPE_CLIENT_ID).startsWith("TEST-")
    ? CONFIG.sandbox
    : CONFIG.production;

  return {
    AUTH_URL: cleanEnvValue(process.env.PHONEPE_AUTH_URL) || defaultConfig.AUTH_URL,
    BASE_URL: cleanEnvValue(process.env.PHONEPE_BASE_URL) || defaultConfig.BASE_URL,
    CHECKOUT_SCRIPT:
      cleanEnvValue(process.env.PHONEPE_CHECKOUT_SCRIPT) || defaultConfig.CHECKOUT_SCRIPT,
  };
};

const getPhonePeCredentials = () => {
  const clientId = cleanEnvValue(process.env.PHONEPE_CLIENT_ID);
  const clientVersion = cleanEnvValue(process.env.PHONEPE_CLIENT_VERSION) || CONFIG.CLIENT_VERSION;
  const secretEncoding = cleanEnvValue(process.env.PHONEPE_CLIENT_SECRET_ENCODING).toLowerCase();
  const rawClientSecret = cleanEnvValue(process.env.PHONEPE_CLIENT_SECRET);
  const clientSecret =
    secretEncoding === "base64"
      ? Buffer.from(rawClientSecret, "base64").toString("utf8").trim()
      : rawClientSecret;

  const missing = [];
  if (!clientId) missing.push("PHONEPE_CLIENT_ID");
  if (!clientSecret) missing.push("PHONEPE_CLIENT_SECRET");
  if (!clientVersion) missing.push("PHONEPE_CLIENT_VERSION");

  if (missing.length) {
    throw new Error(`Missing PhonePe configuration: ${missing.join(", ")}`);
  }

  return {
    clientId,
    clientSecret,
    clientVersion,
  };
};

const basicPassRequiredEventIds = () =>
  String(process.env.BASIC_PASS_REQUIRED_EVENT_IDS || "")
    .split(",")
    .map((eventId) => eventId.trim())
    .filter(Boolean);

const normalizePhonePeStatus = (paymentStatus = {}) => {
  const data = paymentStatus.data || paymentStatus;
  return {
    state: paymentStatus.state || data.state,
    orderId: paymentStatus.orderId || data.orderId,
    amount: paymentStatus.amount || data.amount,
    paymentDetails: paymentStatus.paymentDetails || data.paymentDetails || [],
    reason: paymentStatus.reason || data.reason,
  };
};

const sanitizeFriends = (friends = []) => {
  if (!Array.isArray(friends)) {
    return [];
  }

  return friends.slice(0, 9).map((friend) => ({
    name: String(friend?.name || "Friend").trim().slice(0, 80) || "Friend",
    email: friend?.email ? String(friend.email).trim().slice(0, 120) : undefined,
    phone: friend?.phone ? String(friend.phone).trim().slice(0, 20) : undefined,
  }));
};

const getTeamBooking = async (event, userId, teamCode) => {
  if (!event.isTeamEvent) {
    return null;
  }

  if (!teamCode) {
    throw Object.assign(new Error("Team code is required for this event"), {
      statusCode: 400,
    });
  }

  const team = await Team.findOne({
    eventId: event._id,
    teamCode: String(teamCode).trim().toUpperCase(),
  });

  if (!team) {
    throw Object.assign(new Error("Team not found"), { statusCode: 404 });
  }

  const isMember = team.teamMembers.some(
    (member) => member.userId.toString() === userId.toString(),
  );
  if (!isMember) {
    throw Object.assign(new Error("User is not a member of this team"), {
      statusCode: 403,
    });
  }

  return team;
};

const teamMembersToFriends = (team, userId) =>
  team.teamMembers
    .filter((member) => member.userId.toString() !== userId.toString())
    .map((member) => ({
      name: member.name,
      email: member.email,
      phone: member.phoneNumber,
    }));

const buildQRStrings = (user, friends = []) => {
  const qrStrings = [
    {
      id: uuidv4(),
      personType: "user",
      personIndex: 0,
      personName: user?.name || "Main User",
      qrScanned: false,
      scannedAt: null,
    },
  ];

  friends.slice(0, 9).forEach((friend, index) => {
    qrStrings.push({
      id: uuidv4(),
      personType: "friend",
      personIndex: index + 1,
      personName: friend.name || `Friend ${index + 1}`,
      qrScanned: false,
      scannedAt: null,
    });
  });

  return qrStrings;
};

const reserveSeats = async (eventId, ticketCount) => {
  return Event.findOneAndUpdate(
    {
      _id: eventId,
      $expr: {
        $lte: [
          { $add: [{ $ifNull: ["$registrationCount", 0] }, ticketCount] },
          "$totalSeats",
        ],
      },
    },
    { $inc: { registrationCount: ticketCount } },
    { new: true },
  );
};

const releaseReservedSeats = async (pass) => {
  if (!pass?.seatsReserved) {
    return;
  }

  const ticketCount = pass.ticketCount || 1 + (pass.friends?.length || 0);
  await Event.findByIdAndUpdate(pass.eventId, {
    $inc: { registrationCount: -ticketCount },
  });
  pass.seatsReserved = false;
};

const findQRString = (pass, qrId) => {
  return pass?.qrStrings?.find(
    (qr) => qr.id === qrId || qr._id?.toString() === qrId,
  );
};

const getPhonePeAccessToken = async () => {
  try {
    const config = getPhonePeConfig();
    const { clientId, clientSecret, clientVersion } = getPhonePeCredentials();

    const response = await axios.post(
      config.AUTH_URL,
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
        client_version: clientVersion,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        timeout: 15000,
      },
    );

    const accessToken = response.data?.access_token || response.data?.data?.access_token;
    if (!accessToken) {
      throw new Error("PhonePe auth response did not include an access token");
    }

    return accessToken;
  } catch (error) {
    if (error.response?.status === 401) {
      const config = getPhonePeConfig();
      const clientId = cleanEnvValue(process.env.PHONEPE_CLIENT_ID);
      const clientVersion = cleanEnvValue(process.env.PHONEPE_CLIENT_VERSION) || CONFIG.CLIENT_VERSION;
      throw new Error(
        [
          "PhonePe authentication failed with 401.",
          "Check PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, PHONEPE_CLIENT_VERSION, and PHONEPE_ENV.",
          `Using ${config.AUTH_URL} with client id prefix ${clientId.slice(0, 8)} and client version ${clientVersion}.`,
        ].join(" "),
      );
    }

    console.error(
      "[PhonePe] Auth Error:",
      error.response?.data || error.message,
    );
    throw new Error(
      `Authentication failed: ${error.response?.data?.message || error.message}`,
    );
  }
};

// Create Payment Order
const createPhonePeOrder = async (orderData) => {
  try {
    const config = getPhonePeConfig();
    console.log("Creating PhonePe order:", {
      merchantOrderId: orderData.merchantOrderId,
      amount: orderData.amount,
    });
    const accessToken = await getPhonePeAccessToken();

    const payload = {
      merchantOrderId: orderData.merchantOrderId,
      amount: orderData.amount,
      expireAfter: 1200,
      metaInfo: {
        udf1: orderData.userId,
        udf2: orderData.eventId,
        udf3: orderData.passType || "General",
        udf4: JSON.stringify(orderData.friends || []),
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Talkeys Ticket Booking",
        merchantUrls: {
          redirectUrl: `${process.env.BASE_URL}/api/payment/callback/${orderData.merchantOrderId}`,
        },
      },
    };

    const response = await axios.post(
      `${config.BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
        timeout: 15000,
      },
    );

    const paymentOrder = response.data;
    const paymentUrl = paymentOrder?.data?.redirectUrl || paymentOrder?.redirectUrl;
    if (!paymentUrl) {
      throw new Error("PhonePe order response did not include a payment URL");
    }

    return paymentOrder;
  } catch (error) {
    console.error("PhonePe order creation error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      `Order creation failed: ${error.response?.data?.message || error.message}`,
    );
  }
};

const bookTicket = async (req, res) => {
  let pass;
  try {
    if (!req.user?._id || !req.body.eventId) {
      return res.status(400).json({
        success: false,
        error: "User ID and Event ID are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.eventId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Event ID",
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const event = await Event.findById(req.body.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }
    if (basicPassRequiredEventIds().includes(req.body.eventId)) {
      const basicPass = await Pass.findOne({
        userId: req.user._id,
        paymentStatus: "completed",
      });

      if (!basicPass) {
        return res.status(404).json({
          success: false,
          error: "Can't Book Y2K Pass without Basic Registration Pass",
        });
      }
    }

    const team = await getTeamBooking(event, req.user._id, req.body.teamCode);
    const friends = team
      ? teamMembersToFriends(team, req.user._id)
      : sanitizeFriends(req.body.friends);
    const totalTicketsNeeded = 1 + friends.length;
    const ticketPrice = Number(event.ticketPrice || 0);
    const totalAmount = ticketPrice * totalTicketsNeeded;
    const amountInPaisa = Math.round(totalAmount * 100);
    const isPaidBooking = Boolean(event.isPaid && amountInPaisa > 0);

    const reservedEvent = await reserveSeats(event._id, totalTicketsNeeded);
    if (!reservedEvent) {
      return res.status(400).json({
        success: false,
        error: "Insufficient tickets available",
      });
    }

    // Generate unique merchant order ID with timestamp
    const merchantOrderId = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    pass = new Pass({
      userId: req.user?._id,
      eventId: req.body.eventId,
      passType: req.body.passType || "General",
      status: isPaidBooking ? "pending" : "active",
      passStatus: isPaidBooking ? "inactive" : "active",
      paymentStatus: isPaidBooking ? "pending" : "completed",
      merchantOrderId,
      amount: totalAmount,
      ticketCount: totalTicketsNeeded,
      seatsReserved: true,
      friends,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
    });

    if (!isPaidBooking) {
      pass.confirmedAt = new Date();
      pass.paymentDetails = {
        amount: 0,
        completedAt: new Date(),
        source: "free_registration",
        merchantOrderId,
      };
      pass.qrStrings = buildQRStrings(user, friends);
      await pass.save();

      return res.status(200).json({
        success: true,
        message: "Free pass created successfully",
        data: {
          passId: pass._id,
          passUUID: pass.passUUID,
          merchantOrderId,
          amount: totalAmount,
          amountInPaisa,
          totalTickets: totalTicketsNeeded,
          paymentRequired: false,
          paymentUrl: null,
          event: {
            id: event._id,
            title: event.name,
            date: event.startDate,
            venue: event.location,
          },
          qrStrings: pass.qrStrings,
          friends,
        },
      });
    }

    await pass.save();

    const orderData = {
      merchantOrderId,
      amount: amountInPaisa,
      userId: req.user._id.toString(),
      eventId: req.body.eventId,
      eventName: event.name,
      passType: req.body.passType || "General",
      friends,
      mobileNumber: user.phoneNumber,
    };

    let paymentOrder;
    try {
      paymentOrder = await createPhonePeOrder(orderData);
    } catch (error) {
      pass.status = "payment_failed";
      pass.passStatus = "inactive";
      pass.paymentStatus = "failed";
      pass.paymentDetails = {
        amount: amountInPaisa,
        failedAt: new Date(),
        source: "order_creation",
        reason: error.message,
        merchantOrderId,
      };
      await releaseReservedSeats(pass);
      await pass.save();
      throw error;
    }

    pass.phonePeOrderId = paymentOrder.data?.orderId || paymentOrder.orderId;
    pass.paymentUrl =
      paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl;
    await pass.save();

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully",
      data: {
        passId: pass._id,
        merchantOrderId: merchantOrderId,
        phonePeOrderId: paymentOrder.data?.orderId || paymentOrder.orderId,
        amount: totalAmount,
        amountInPaisa: amountInPaisa,
        totalTickets: totalTicketsNeeded,
        paymentUrl: paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl,
        expiresAt: pass.expiresAt,
        event: {
          id: event._id,
          title: event.name,
          date: event.startDate,
          venue: event.location,
        },
        qrStrings: [],
        friends,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    if (pass?.seatsReserved && pass.paymentStatus !== "completed") {
      try {
        await releaseReservedSeats(pass);
        if (!pass.isNew) {
          await pass.save();
        }
      } catch (releaseError) {
        console.error("Seat reservation release failed:", releaseError);
      }
    }
    console.error("Ticket booking error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create payment order",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Enhanced Payment Status Check with Integrated Processing
const checkPaymentStatus = async (merchantOrderId, shouldProcess = false) => {
  try {
    const config = getPhonePeConfig();
    const accessToken = await getPhonePeAccessToken();

    const url = `${config.BASE_URL}/checkout/v2/order/${merchantOrderId}/status`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`,
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const paymentData = response.data;

    // If shouldProcess is true, automatically process the payment based on status
    if (shouldProcess && paymentData) {
      const paymentState = normalizePhonePeStatus(paymentData).state;

      if (paymentState === "COMPLETED") {
        await processPaymentConfirmation(
          merchantOrderId,
          paymentData,
          "status_check",
        );
      } else if (paymentState === "FAILED") {
        await processPaymentFailure(
          merchantOrderId,
          paymentData,
          "status_check",
        );
      }
    }

    return paymentData;
  } catch (error) {
    console.error("[STATUS] Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      `Status check failed: ${error.response?.data?.message || error.message}`,
    );
  }
};

// Process Payment Confirmation
const processPaymentConfirmation = async (
  merchantOrderId,
  paymentStatus,
  source = "callback",
) => {
  try {
    const pass = await Pass.findOne({ merchantOrderId });

    if (!pass) {
      throw new Error(`Pass not found for merchantOrderId: ${merchantOrderId}`);
    }

    const user = await User.findById(pass.userId).select("name");

    if (pass.paymentStatus === "completed") {
      let repaired = false;
      if (!pass.passUUID) {
        pass.passUUID = uuidv4();
        repaired = true;
      }
      if (!pass.qrStrings?.length) {
        pass.qrStrings = buildQRStrings(user, pass.friends);
        repaired = true;
      }
      if (pass.status !== "active" || pass.passStatus !== "active") {
        pass.status = "active";
        pass.passStatus = "active";
        repaired = true;
      }
      if (repaired) {
        await pass.save();
      }

      return {
        passId: pass._id,
        passUUID: pass.passUUID,
        success: true,
        message: "Payment already confirmed",
        alreadyProcessed: true,
      };
    }

    if (!pass.seatsReserved) {
      const reservedEvent = await reserveSeats(
        pass.eventId,
        pass.ticketCount || 1 + (pass.friends?.length || 0),
      );
      if (!reservedEvent) {
        throw new Error("Payment completed but no seats are available");
      }
      pass.seatsReserved = true;
    }

    const normalizedPayment = normalizePhonePeStatus(paymentStatus);

    pass.status = "active";
    pass.passStatus = "active";
    pass.paymentStatus = "completed";
    pass.confirmedAt = new Date();
    pass.paymentDetails = {
      orderId: normalizedPayment.orderId,
      transactionId: normalizedPayment.paymentDetails?.[0]?.transactionId,
      amount: normalizedPayment.amount,
      paymentMode: normalizedPayment.paymentDetails?.[0]?.paymentMode,
      completedAt: new Date(),
      source: source,
      merchantOrderId: merchantOrderId,
    };

    // Generate UUID for confirmed pass
    if (!pass.passUUID) {
      pass.passUUID = uuidv4();
    }
    if (!pass.qrStrings?.length) {
      pass.qrStrings = buildQRStrings(user, pass.friends);
    }

    await pass.save();

    // Update user's pass count if needed
    await User.findByIdAndUpdate(pass.userId, {
      $inc: { activePasses: 1 },
    });

    return {
      passId: pass._id,
      passUUID: pass.passUUID,
      success: true,
      message: "Payment confirmed successfully",
    };
  } catch (error) {
    console.error(`[${source}] Error processing payment confirmation:`, error);
    throw error;
  }
};

// Process Payment Failure
const processPaymentFailure = async (
  merchantOrderId,
  paymentStatus,
  source = "callback",
) => {
  try {
    const pass = await Pass.findOne({
      merchantOrderId: merchantOrderId,
    });

    if (pass && pass.paymentStatus !== "completed") {
      const normalizedPayment = normalizePhonePeStatus(paymentStatus);
      pass.status = "payment_failed";
      pass.passStatus = "inactive";
      pass.paymentStatus = "failed";
      pass.paymentDetails = {
        orderId: normalizedPayment.orderId,
        amount: normalizedPayment.amount,
        failedAt: new Date(),
        source: source,
        reason: normalizedPayment.reason || "Payment failed",
        merchantOrderId: merchantOrderId,
      };
      await releaseReservedSeats(pass);

      await pass.save();
    }

    return {
      passId: pass?._id,
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    console.error(`[${source}] Error processing payment failure:`, error);
    throw error;
  }
};

// Validate Webhook Signature
const validateWebhookSignature = (username, password, receivedSignature) => {
  try {
    const credentials = `${username}:${password}`;
    const expectedSignature = crypto
      .createHash("sha256")
      .update(credentials)
      .digest("hex");
    if (!receivedSignature || receivedSignature.length !== expectedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature),
    );
  } catch (error) {
    console.error("Error validating webhook signature:", error);
    return false;
  }
};

// HTML Redirect Helper
const htmlRedirect = (url) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="refresh" content="0; URL='${url}'" />
      <title>Redirecting...</title>
    </head>
    <body>
      <p>Processing payment... <a href="${url}">Click here if not redirected</a></p>
    </body>
  </html>
`;

// Enhanced Payment Callback Handler
const handlePaymentCallback = async (req, res) => {
  try {
    const { merchantOrderId } = req.params;

    const paymentStatus = await checkPaymentStatus(merchantOrderId, true);

    if (!paymentStatus || typeof paymentStatus !== "object") {
      throw new Error("Invalid payment status response from PhonePe");
    }

    const paymentState = normalizePhonePeStatus(paymentStatus).state;
    if (!paymentState) {
      throw new Error("Missing 'state' in PhonePe response");
    }

    const pass = await Pass.findOne({ merchantOrderId: merchantOrderId });

    if (paymentState === "COMPLETED") {
      return res.redirect(
        302,
        `${process.env.FRONTEND_URL}/ticket/success?passId=${pass?._id}&uuid=${pass?.passUUID}`,
      );
    }

    if (paymentState === "FAILED") {
      return res.redirect(
        302,
        `${process.env.FRONTEND_URL}/ticket/failure?passId=${pass ? pass._id : ""}&orderId=${merchantOrderId}`,
      );
    }

    return res.redirect(
      302,
      `${process.env.FRONTEND_URL}/ticket/pending?orderId=${merchantOrderId}`,
    );
  } catch (error) {
    console.error("[CALLBACK] Unhandled error:", error);
    const reason = encodeURIComponent(error.message || "callback_error");
    return res
      .status(200)
      .send(
        htmlRedirect(
          `${process.env.FRONTEND_URL}/ticket/error?reason=${reason}`,
        ),
      );
  }
};

// Manual Payment Status Check Route
const handleManualStatusCheck = async (req, res) => {
  try {
    const { merchantOrderId } = req.params;

    const paymentStatus = await checkPaymentStatus(merchantOrderId, true);

    const paymentState = normalizePhonePeStatus(paymentStatus).state;

    return res.status(200).json({
      success: true,
      merchantOrderId,
      status: paymentState,
      data: paymentStatus,
      message: `Payment status: ${paymentState}`,
    });
  } catch (error) {
    console.error("[MANUAL_CHECK] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      merchantOrderId: req.params.merchantOrderId,
    });
  }
};

// Enhanced Webhook Handler
const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookBody = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString("utf8"))
      : req.body;

    // Validate webhook signature if configured
    if (
      process.env.PHONEPE_WEBHOOK_USERNAME &&
      process.env.PHONEPE_WEBHOOK_PASSWORD
    ) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
      }

      const signature = authHeader.replace("SHA256 ", "");
      const isValid = validateWebhookSignature(
        process.env.PHONEPE_WEBHOOK_USERNAME,
        process.env.PHONEPE_WEBHOOK_PASSWORD,
        signature,
      );

      if (!isValid) {
        console.log("Invalid webhook signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const { event, payload } = webhookBody || {};
    if (!event || !payload?.merchantOrderId) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    if (event === "checkout.order.completed") {
      await processPaymentConfirmation(
        payload.merchantOrderId,
        payload,
        "webhook",
      );
    } else if (event === "checkout.order.failed") {
      await processPaymentFailure(payload.merchantOrderId, payload, "webhook");
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Pass Status by Payment Order
const getPassByPaymentOrder = async (req, res) => {
  try {
    const { merchantOrderId } = req.params;

    // Find pass by merchantOrderId
    const pass = await Pass.findOne({
      merchantOrderId: merchantOrderId,
    }).populate("userId", "name email");

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Pass not found for this payment order",
      });
    }

    return res.status(200).json({
      success: true,
      pass: {
        id: pass._id,
        status: pass.status,
        paymentStatus: pass.paymentStatus,
        paymentDetails: pass.paymentDetails,
        createdAt: pass.createdAt,
        user: pass.userId,
      },
    });
  } catch (error) {
    console.error("Error fetching pass by payment order:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Retry Failed Payment Processing
const retryPaymentProcessing = async (req, res) => {
  try {
    const { merchantOrderId } = req.body;

    if (!merchantOrderId) {
      return res.status(400).json({
        success: false,
        error: "merchantOrderId is required",
      });
    }

    console.log("[RETRY] Retrying payment processing for:", merchantOrderId);

    // Force check and process payment status
    const paymentStatus = await checkPaymentStatus(merchantOrderId, true);

    return res.status(200).json({
      success: true,
      message: "Payment processing retried successfully",
      status: paymentStatus.state || paymentStatus.data?.state,
      merchantOrderId,
    });
  } catch (error) {
    console.error("[RETRY] Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to get pass details for QR code generation
const getPassForQR = async (req, res) => {
  try {
    const { passUUID } = req.params;

    const pass = await Pass.findOne({
      passUUID: passUUID,
      status: "active",
    })
      .populate("userId", "name email phone")
      .populate("eventId", "title date venue address");

    if (!pass) {
      return res.status(404).json({ error: "Valid pass not found" });
    }

    return res.json({
      success: true,
      data: {
        passUUID: pass.passUUID,
        passType: pass.passType,
        confirmedAt: pass.confirmedAt,
        user: pass.userId,
        event: pass.eventId,
        friends: pass.friends,
        amount: pass.amount,
      },
    });
  } catch (error) {
    console.error("Get pass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get Ticket Status
const getTicketStatus = async (req, res) => {
  try {
    const { passId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(passId)) {
      return res.status(400).json({ error: "Invalid Pass ID" });
    }

    let pass = await Pass.findById(passId)
      .populate("userId", "name email phoneNumber")
      .populate("eventId", "name startDate location");

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    if (pass.paymentStatus === "pending" && pass.merchantOrderId) {
      try {
        await checkPaymentStatus(pass.merchantOrderId, true);
        pass = await Pass.findById(passId)
          .populate("userId", "name email phoneNumber")
          .populate("eventId", "name startDate location");
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        pass: pass,
        qrCode:
          pass.paymentStatus === "completed" && pass.passUUID
            ? generateQRCode(pass.passUUID || pass._id)
            : null,
      },
    });
  } catch (error) {
    console.error("Get ticket status error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Generate QR Code for ticket
const generateQRCode = (passIdentifier) => {
  return `${process.env.BASE_URL}/verify-ticket/${passIdentifier}`;
};

// Cleanup expired pending passes
const cleanupExpiredPasses = async () => {
  try {
    const expiredPasses = await Pass.find({
      paymentStatus: "pending",
      expiresAt: { $lt: new Date() },
    });

    for (const pass of expiredPasses) {
      pass.status = "expired";
      pass.passStatus = "expired";
      pass.paymentStatus = "failed";
      await releaseReservedSeats(pass);
      await pass.save();
    }

    console.log(`Cleaned up ${expiredPasses.length} expired passes`);
  } catch (error) {
    console.error("Cleanup error:", error);
  }
};
const getPassByUUID = async (req, res) => {
  try {
    const passUUID = req.params.passUUID;
    if (!passUUID) {
      return res.status(400).json({ error: "Pass UUID is required" });
    }

    const pass = await Pass.findOne({
      passUUID: passUUID,
      paymentStatus: "completed",
    })
      .populate("userId", "name")
      .populate("eventId", "name startDate")
      .select(
        "eventId userId paymentStatus status createdAt amount friends passUUID passType ticketCount qrStrings",
      );

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    if (!pass.qrStrings?.length) {
      pass.qrStrings = buildQRStrings(pass.userId, pass.friends || []);
      await pass.save();
    }

    const totalAmount = pass.amount;

    const responseData = {
      passAmount: totalAmount,
      passEventName: pass.eventId?.name || "Unknown Event",
      passEventDate: pass.eventId?.startDate || "Unknown Date",
      passPaymentStatus: pass.paymentStatus || "ERROR",
      passCreatedAt: pass.createdAt || "NO",
      passStatus: pass.status || pass.paymentStatus || "ERROR",
      passEnteries: pass.ticketCount || pass.friends.length + 1,
      eventId: pass.eventId?._id || "Unknown Event ID",
      qrStrings: (pass.qrStrings || []).map((qrString) => ({
        id: qrString.id,
        personName: qrString.personName,
        personType: qrString.personType,
        qrScanned: qrString.qrScanned,
        scannedAt: qrString.scannedAt,
        qrContent: `${pass.passUUID}+${qrString.id}`,
      })),
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get pass by UUID error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPassByUserAndEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.eventId)) {
      return res.status(400).json({ error: "Invalid Event ID" });
    }

    const passes = await Pass.find({
      userId: req.user._id,
      eventId: req.body.eventId,
      paymentStatus: "completed",
    });

    if (!passes || passes.length === 0) {
      return res.status(404).json({ error: "No passes found" });
    }

    // Map through all passes to create the response array
    const passesData = passes.map((pass) => {
      let qrStrings = pass.qrStrings || [];
      return {
        passUUID: pass.passUUID,
        qrStrings: qrStrings,
        passType: pass.passType,
        passId: pass._id,
        email: req.user.email,
        eventId: req.body.eventId,
      };
    });

    return res.status(200).json({
      passes: passesData,
      count: passesData.length,
      message: "Passes found successfully",
    });
  } catch (error) {
    console.error("Get passes error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getPassByQrStringsAndPassUUID = async (req, res) => {
  try {
    if (!req.body.passUUID || !req.body.qrId) {
      return res.status(400).json({ error: "Pass UUID and QR ID are required" });
    }

    const pass = await Pass.findOne({
      passUUID: req.body.passUUID,
      paymentStatus: "completed",
    })
      .populate("eventId", "name")
      .populate("userId", "name");

    if (!pass) {
      return res.status(404).json({ error: "Valid pass not found" });
    }

    const person = findQRString(pass, req.body.qrId);
    if (!person) {
      return res.status(404).json({ error: "QR code not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        buyer: pass.userId?.name || "Unknown buyer",
        event: pass.eventId?.name || "Unknown event",
        person,
        amount: pass.amount,
        paymentStatus: pass.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Get pass by UUID error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const Accept = async (req, res) => {
  try {
    const passUUID = req.body.uuid;
    if (!passUUID) {
      return res.status(400).json({ error: "Pass UUID is required" });
    }
    const qrId = req.body.qrId;
    if (!qrId) {
      return res.status(400).json({ error: "QR ID is required" });
    }

    const pass = await Pass.findOne({ passUUID });
    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    if (pass.paymentStatus !== "completed") {
      return res.status(400).json({ error: "Pass is not active" });
    }
    if (pass.status !== "active" || pass.passStatus !== "active") {
      pass.status = "active";
      pass.passStatus = "active";
    }

    const qrString = findQRString(pass, qrId);
    if (!qrString) {
      return res.status(404).json({ error: "QR code not found" });
    }

    if (qrString.qrScanned) {
      return res.status(400).json({ error: "QR code already scanned" });
    }

    qrString.scannedAt = new Date();
    qrString.qrScanned = true;
    if (pass.qrStrings.every((qr) => qr.qrScanned || qr._id.toString() === qrString._id.toString())) {
      pass.isScanned = true;
      pass.timeScanned = qrString.scannedAt;
    }
    await pass.save();
    return res.status(200).json({
      message: "Pass scanned successfully",
      scannedAt: qrString.scannedAt,
    });
  } catch (error) {
    console.error("Accept pass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const Reject = async (req, res) => {
//   try{
//   let passUUID= req.params.uuid;
//   if (!passUUID) {
//     return res.status(400).json({ error: "Pass UUID is required" });
//   }
//   qrId = req.params.qrId;
//   if (!qrId) {
//     return res.status(400).json({ error: "QR ID is required" });
//   }
//     const pass = await Pass.findById(uuid);
//     if (!pass) {
//       return res.status(404).json({ error: "Pass not found" });
//     }
//     const qrString = pass.qrStrings.find(qr => qr.id === qrId);
//     if (!qrString) {
//       return res.status(404).json({ error: "QR code not found" });
//     }
//     if (qrString.isScanned) {
//       return res.status(400).json({ error: "QR code already scanned" });
//     }
//     qrString.isScanned = ;
//     qrString.scannedAt = new Date();
//     await pass.save();
//     return res.status(200).json({ message: "Pass scanned successfully" });
//   }
//   catch (error) {
//     console.error('Accept pass error:', error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const canScan = async (req, res) => {
  let user = req.user;
  try {
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Invalid role" });
    }

    return res.status(200).json({ message: "User can scan passes" });
  } catch (error) {
    console.error("Get pass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const admnDetails = async (req, res) => {
  let user = req.user;
  try {
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Invalid role" });
    }
    const query = { paymentStatus: "completed" };
    if (req.query.eventId && mongoose.Types.ObjectId.isValid(req.query.eventId)) {
      query.eventId = req.query.eventId;
    }

    const passes = await Pass.find(query);
    const totalOrders = passes.length;
    const totalTickets = passes.reduce(
      (acc, pass) => acc + (pass.ticketCount || 1 + (pass.friends?.length || 0)),
      0,
    );
    const totalAmount = passes.reduce((acc, pass) => acc + pass.amount, 0);

    const y2kPasses = await Pass.find({
      paymentStatus: "completed",
      amount: 209,
    });
    const y2kPassesCount = y2kPasses.length;

    return res.status(200).json({
      message: "Details fetched successfully",
      orders: totalOrders,
      passes: totalTickets,
      amount: totalAmount,
      y2kPasses: y2kPassesCount,
    });
  } catch (error) {
    console.error("Get pass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getPassByUserAndEvent,
  bookTicket,
  canScan,
  Accept,
  handlePaymentWebhook,
  getTicketStatus,
  checkPaymentStatus,
  handlePaymentCallback,
  getPassByQrStringsAndPassUUID,
  cleanupExpiredPasses,
  getPassByUUID,
  admnDetails,
  _test: {
    buildQRStrings,
    basicPassRequiredEventIds,
    cleanEnvValue,
    getPhonePeCredentials,
    getPhonePeConfig,
    normalizePhonePeStatus,
    sanitizeFriends,
    validateWebhookSignature,
  },
};
