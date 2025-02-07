import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";

// Constants
let salt_key = "96434309-7796-489d-8924-ab56988a6076";
let merchant_id = "PGTESTPAYUAT86";

export async function POST(req) {
  try {
    let reqData = await req.json(); // Parse the request data

    // Extract transaction details
    let merchantTransactionId = reqData.transactionId;

    // Prepare the payload
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      amount: reqData.amount * 100, // Convert to paise (smallest currency unit)
      redirectUrl: `http://localhost:3000/api/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/status?id=${merchantTransactionId}`,
      mobileNumber: reqData.mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode payload as Base64
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate checksum
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Define PhonePe API URL
    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    // API call options
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    // Make the API call
    const response = await axios(options);

    // Return the response from PhonePe
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    // Handle errors
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
