const express = require("express");
const crypto = require("crypto");
const { verifyToken } = require("../middleware/oauth.js");
const bookTicket = require("../controllers/passes.controller.js");
const router = express.Router();

const Payment = require("../models/payment.model.js");
const Event = require("../models/events.model.js");
const Pass= require("../models/passes.model.js");
// const { generatePassQR, sendPassConfirmationEmail } = require("../util/");

const merchantId = process.env.PHONEPE_MERCHANT_ID;
const saltKey = process.env.PHONEPE_SALT_KEY;
const saltIndex = process.env.SALT_INDEX;
const env = process.env.ENV;
const phonePeCallbackUrl = process.env.PHONEPE_CALLBACK_URL;


BASE_URLS = {
    "UAT": "https://api-preprod.phonepe.com/apis/pg-sandbox",
    "PROD": "https://api.phonepe.com/apis/hermes",
}

const initiatePayment = async (req, res) => {
	const userId = req.user._id;
	const { eventId } = req.query;
	const {passType}=req.body;
	try {
		const event=await Event.findOne({ _id: eventId });
		if (!event)
			return res.status(404).json({ detail: "Event not found." });
		if(event.totalSeats<=0)
			return res.status(400).json({ detail: "Insufficient tickets available" });
		if (new Date(event.endRegistrationDate).getTime() < Date.now()){
			return res.status(400).json({ detail: "Registration date ended" });
		}
		if(event.isLive==false){
			return res.status(400).json({ detail: "Event is not live" });
		}
		var pass = await Pass.findOne({ eventId, userId });
		if (!pass) {
			pass = new Pass({
				userId,
				eventId,
				// passType: passType || "General", // Use provided passType if available
				passType: "General",
				status: "pending",
			});
			await pass.save();
		}
		const booking = await Pass.findOne({ eventId, userId });	
		if (!booking)
			return res.status(404).json({ detail: "Booking not found." });
		
		const uniqueTransactionId = `${booking._id}-${new Date().getTime()}`;
		const uiRedirectUrl = process.env.UI_REDIRECT_URL;
		const payload = {
			merchantId,
			merchantTransactionId: uniqueTransactionId,
			merchantUserId: userId,
			amount: event.ticketPrice*100,
			redirectUrl: uiRedirectUrl,
			redirectMode: "REDIRECT",
			callbackUrl: phonePeCallbackUrl,
			paymentInstrument: { type: "PAY_PAGE" },
		};
		
		const jsonPayload = JSON.stringify(payload);
		const base64Payload = Buffer.from(jsonPayload).toString("base64");
		const signatureString = base64Payload + "/pg/v1/pay" + saltKey;
		const checksum = crypto
		.createHash("sha256")
		.update(signatureString)
		.digest("hex");
		const xVerify = `${checksum}###${saltIndex}`;
		
		const headers = {
			"Content-Type": "application/json",
			"X-VERIFY": xVerify,
			"X-MERCHANT-ID": merchantId,
		};
		const baseUrl = BASE_URLS[env];
		for (let attempt = 0; attempt < 5; attempt++) {
			try {
				const response = await fetch(`${baseUrl}/pg/v1/pay`, {
					method: "POST",
					headers,
					body: JSON.stringify({ request: base64Payload }),
				});

				if (response.status === 200) {
					const responseJson = await response.json();
					const payPageUrl = responseJson?.data?.instrumentResponse?.redirectInfo?.url;

					console.log(payPageUrl)
					// create a new object of user


					const payment = new Payment({
						userId:req.user._id,
						passId: pass._id,
						transactionId: uniqueTransactionId,
						paidAmount: event.ticketPrice,
						status: "PAYMENT_PENDING",
					});
					await payment.save();
					// await Payment.create({
					// 	bookingId: booking.id,
					// 	transactionId: uniqueTransactionId,
					// 	paidAmount: event.price,
					// 	status: "PAYMENT_PENDING",
					// });
					return res.status(200).json({ pay_page_url: payPageUrl });
				}
			} catch (error) {
				console.log(error);
				if (error.response?.status === 429) {
					await new Promise((resolve) =>
						setTimeout(resolve, Math.pow(2, attempt) * 1000),
					);
				} else {
					break;
				}
			}
		}

		res.status(400).json({ detail: "Payment initiation failed." });
	} catch (error) {
		res.status(500).json({ detail: "Server error.", error: error.message });
	}
};

const verifyPayment = async (req, res) => {
    try {
        const b64Payload = req.body.response;
        const decodedPayload = JSON.parse(Buffer.from(b64Payload, "base64").toString("utf-8"));

        if (!decodedPayload) {
            return res.status(400).json({ detail: "Invalid payload." });
        }

        const { merchantTransactionId, transactionId, state, code } = decodedPayload.data;

        // Find the payment record
        const payment = await Payment.findOne({
            where: { transactionId: merchantTransactionId },
            include: [{ model: Pass }],
        });

        if (!payment) {
            return res.status(404).json({ detail: "Payment record not found." });
        }

        // Update payment details
        payment.status = code;
        payment.paymentId = transactionId;
        payment.reason = state;
        await payment.save();

        const pass = await Pass.findOne({ _id: payment.PassId });

        if (!pass) {
            return res.status(404).json({ detail: "Pass record not found." });
        }

        if (code === "PAYMENT_SUCCESS") {
            pass.status = "active";
            pass.activatedAt = new Date();
            await pass.save();

            // Send confirmation email & generate QR (Uncomment if needed)
            // const qrData = await generatePassQR({
            //     bookingId: pass.id,
            //     passType: pass.passType,
            //     validUntil: pass.validUntil,
            // });

            // await sendPassConfirmationEmail({
            //     transactionId: payment.transactionId,
            //     amount: payment.paidAmount,
            //     passDetails: {
            //         type: pass.passType,
            //         validUntil: pass.validUntil,
            //     },
            //     userName: req.user.name,
            //     qrCode: qrData,
            //     userEmail: req.user.email,
            // });

            return res.status(200).json({ detail: "Payment successful." });
        } else {
            pass.isActive = false;
            await pass.save();
            return res.status(400).json({ detail: "Payment failed." });
        }
    } catch (error) {
        res.status(500).json({ detail: "Server error.", error: error.message });
    }
};


const getPaymentResult = async (req, res) => {
	const txnId = req.body.txnid;
	const userId = req.user.id;

	try {
		const payment = await Payment.findOne({
			where: { transactionId: txnId },
			include: [{ model: PassBooking }],
		});

		if (payment.booking.userId !== userId) {
			return res
				.status(403)
				.json({
					detail: "You do not have permission to view this payment.",
				});
		}

		res.status(200).json(payment);
	} catch (error) {
		res.status(404).json({ detail: "Payment record not found." });
	}
};


module.exports = {
	initiatePayment,
	verifyPayment,
	getPaymentResult,
	
};
