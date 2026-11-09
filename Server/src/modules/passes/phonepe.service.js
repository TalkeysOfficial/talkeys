// PhonePe Checkout v2 client: config, OAuth token, order creation, status normalisation, webhook auth.
const axios = require("axios");
const crypto = require("crypto");
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

module.exports = {
  CONFIG,
  cleanEnvValue,
  getPhonePeConfig,
  getPhonePeCredentials,
  normalizePhonePeStatus,
  getPhonePeAccessToken,
  createPhonePeOrder,
  validateWebhookSignature,
};
