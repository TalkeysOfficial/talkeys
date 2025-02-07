import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { amount } = await request.json()

  // TODO: Replace with actual PhonePe API integration
  const phonePeApiUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
  const merchantId = process.env.PHONEPE_MERCHANT_ID
  const merchantTransactionId = Date.now().toString()

  try {
    // This is a placeholder for the actual PhonePe API call
    // You'll need to implement the actual API call based on PhonePe's documentation
    const paymentUrl = `${phonePeApiUrl}?merchantId=${merchantId}&merchantTransactionId=${merchantTransactionId}&amount=${amount}`

    return NextResponse.json({ paymentUrl })
  } catch (error) {
    console.error("Error initiating payment:", error)
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
  }
}

