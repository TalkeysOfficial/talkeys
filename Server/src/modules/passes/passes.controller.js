const Pass = require("./passes.model.js");
const User = require("../auth/users.model.js");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const {
  cleanEnvValue,
  getPhonePeConfig,
  getPhonePeCredentials,
  normalizePhonePeStatus,
  getPhonePeAccessToken,
  validateWebhookSignature,
} = require("./phonepe.service.js");
const {
  reserveSeats,
  releaseReservedSeats,
} = require("./inventory.service.js");

const { basicPassRequiredEventIds, sanitizeFriends, buildQRStrings, createBooking } = require("./booking.service.js");

const findQRString = (pass, qrId) => {
  return pass?.qrStrings?.find(
    (qr) => qr.id === qrId || qr._id?.toString() === qrId,
  );
};

const getQRPersonName = (pass, qrString) =>
  qrString?.personName ||
  (qrString?.personType === "user"
    ? pass.userId?.name
    : pass.attendees?.find(
        (attendee) => attendee.personIndex === qrString?.personIndex,
      )?.name) ||
  "Unknown attendee";

const serializeScannerMembers = (pass, activeQrString) =>
  (pass.qrStrings || []).map((qrString) => ({
    id: qrString.id || qrString._id?.toString(),
    name: getQRPersonName(pass, qrString),
    personType: qrString.personType,
    passTypeName:
      qrString.passTypeName || pass.passTypeName || pass.passType || "General Pass",
    passPrice: Number(qrString.passPrice ?? pass.passPrice ?? 0),
    checkedIn: Boolean(qrString.qrScanned),
    isCurrent:
      (activeQrString?.id && qrString.id === activeQrString.id) ||
      (activeQrString?._id &&
        qrString._id?.toString() === activeQrString._id.toString()),
  }));

const serializeScannerPass = (pass, qrString) => {
  const attendeeName = getQRPersonName(pass, qrString);
  const eventName = pass.eventId?.name || "Unknown event";
  const passTypeName =
    qrString?.passTypeName || pass.passTypeName || pass.passType || "General Pass";
  const passPrice = Number(qrString?.passPrice ?? pass.passPrice ?? 0);
  const checkInStatus = qrString?.qrScanned ? "checked_in" : "not_checked_in";

  return {
    passUUID: pass.passUUID,
    qrId: qrString?.id || qrString?._id?.toString() || null,
    attendeeName,
    passTypeName,
    passPrice,
    eventName,
    eventDate: pass.eventId?.startDate || null,
    eventLocation: pass.eventId?.location || "",
    checkInStatus,
    bookingStatus: pass.status,
    passStatus: pass.passStatus,
    paymentStatus: pass.paymentStatus,
    alreadyScanned: Boolean(qrString?.qrScanned),
    scannedAt: qrString?.scannedAt || null,
    buyer: pass.userId?.name || "Unknown buyer",
    buyerEmail: pass.userId?.email || "",
    buyerPhoneNumber: pass.userId?.phoneNumber || "",
    event: eventName,
    person: qrString,
    amount: pass.amount,
    ticketCount: pass.ticketCount || 1 + (pass.friends?.length || 0),
    bookingMembers: serializeScannerMembers(pass, qrString),
    bookedAt: pass.createdAt || null,
    confirmedAt: pass.confirmedAt || pass.paymentDetails?.completedAt || null,
    isScanned: Boolean(qrString?.qrScanned),
    timeScanned: qrString?.scannedAt || null,
  };
};

const bookTicket = async (req, res) => {
  try {
    const { message, data } = await createBooking(req.user?._id, req.body);
    return res.status(200).json({ success: true, message, data });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
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
        pass.qrStrings = buildQRStrings(user, pass.friends, pass.attendees);
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
      pass.qrStrings = buildQRStrings(user, pass.friends, pass.attendees);
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
    const reason = "callback_error"; // details stay in the server log
    return res
      .status(200)
      .send(
        htmlRedirect(
          `${process.env.FRONTEND_URL}/ticket/error?reason=${reason}`,
        ),
      );
  }
};

// Enhanced Webhook Handler
const handlePaymentWebhook = async (req, res) => {
  try {
    const webhookBody = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString("utf8"))
      : req.body;

    // Fail closed: without credentials anyone could confirm a payment.
    if (
      !process.env.PHONEPE_WEBHOOK_USERNAME ||
      !process.env.PHONEPE_WEBHOOK_PASSWORD
    ) {
      console.error("PhonePe webhook credentials are not configured");
      return res.status(503).json({ error: "Webhook not configured" });
    }

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

    const { event, payload } = webhookBody || {};
    if (!event || !payload?.merchantOrderId) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    if (event === "checkout.order.completed") {
      // PhonePe amounts are in paise; reject a confirmation that does not match the booking.
      const pass = await Pass.findOne({ merchantOrderId: payload.merchantOrderId }).select("amount");
      // Only a definite mismatch is rejected: a payload without a top-level amount must not fail a real payment.
      if (pass && payload.amount != null && Number(payload.amount) !== Math.round((pass.amount || 0) * 100)) {
        console.error("Webhook amount mismatch for", payload.merchantOrderId);
        return res.status(400).json({ error: "Amount mismatch" });
      }
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

    const ownerId = String(pass.userId?._id ?? pass.userId);
    if (ownerId !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
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
        "eventId userId paymentStatus status createdAt amount friends attendees passUUID passType passTypeName passSelections ticketCount qrStrings",
      );

    if (!pass) {
      return res.status(404).json({ error: "Pass not found" });
    }

    if (!pass.qrStrings?.length) {
      pass.qrStrings = buildQRStrings(
        pass.userId,
        pass.friends || [],
        pass.attendees || [],
      );
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
      passType: pass.passTypeName || pass.passType || "General Pass",
      passSelections: pass.passSelections || [],
      passEnteries: pass.ticketCount || pass.friends.length + 1,
      eventId: pass.eventId?._id || "Unknown Event ID",
      qrStrings: (pass.qrStrings || []).map((qrString) => ({
        id: qrString.id,
        personName: qrString.personName,
        personType: qrString.personType,
        passTypeName:
          qrString.passTypeName || pass.passTypeName || pass.passType || "General Pass",
        passPrice: qrString.passPrice ?? 0,
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
        passType: pass.passTypeName || pass.passType,
        passTypeName: pass.passTypeName || pass.passType,
        passSelections: pass.passSelections || [],
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
      .populate("eventId", "name startDate location")
      .populate("userId", "name email phoneNumber");

    if (!pass) {
      return res.status(404).json({ error: "Valid pass not found" });
    }

    const person = findQRString(pass, req.body.qrId);
    if (!person) {
      return res.status(404).json({ error: "QR code not found" });
    }

    return res.status(200).json({
      success: true,
      data: serializeScannerPass(pass, person),
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

    const pass = await Pass.findOne({ passUUID })
      .populate("eventId", "name startDate location")
      .populate("userId", "name email phoneNumber");
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
      return res.status(409).json({
        success: false,
        error: "QR code already scanned",
        data: serializeScannerPass(pass, qrString),
      });
    }

    qrString.scannedAt = new Date();
    qrString.qrScanned = true;
    if (pass.qrStrings.every((qr) => qr.qrScanned || qr._id.toString() === qrString._id.toString())) {
      pass.isScanned = true;
      pass.timeScanned = qrString.scannedAt;
    }
    await pass.save();
    return res.status(200).json({
      success: true,
      message: "Pass scanned successfully",
      scannedAt: qrString.scannedAt,
      data: serializeScannerPass(pass, qrString),
    });
  } catch (error) {
    console.error("Accept pass error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


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
