const express = require("express");
const crypto = require("crypto");
const { verifyToken } = require("../middleware/oauth.js");
const bookTicket = require("../controllers/passes.controller.js");
const router = express.Router();

const { Payment } = require("../models/payment.model.js");
// const { generatePassQR, sendPassConfirmationEmail } = require("../util/");

const BASE_URLS = {
	production: "https://api.phonepe.com",
	sandbox: "https://sandbox.phonepe.com",
};

const merchantId = process.env.MERCHANT_ID;
const saltKey = process.env.SALT_KEY;
const saltIndex = process.env.SALT_INDEX;
const env = process.env.ENV;
const phonePeCallbackUrl = process.env.PHONEPE_CALLBACK_URL;
const phonePeReturnUrl = process.env.PHONEPE_RETURN_URL;




// const bookTicket = async (req, res) => {
//     // Validate input
//     if (!req.body.teamCode || !req.body.eventId) {
//         return res.status(400).json({ error: "Invalid request parameters" });
//     }

//     const { teamCode, eventId } = req.body;
//     const userId = req.user._id;

//     try {
//         // Find team and populate team members and team leader
//         const team = await TeamSchema.findOne({ teamCode: teamCode })
//             .populate('teamMembers')
//             .populate('teamLeader');

//         if (!team) {
//             return res.status(404).json({ error: "Team not found" });
//         }

//         // Check if teamLeader is populated and is a valid ObjectId
//         if (!team.teamLeader || !mongoose.Types.ObjectId.isValid(team.teamLeader._id)) {
//             return res.status(404).json({ error: "Team leader not found or invalid" });
//         }
//         console.log("===================")
//         console.log(team)

//         // Check if the user is the team leader
//         // if (userId != team.teamLeader) {
//         //     return res.status(403).json({ error: "Only team leader can book tickets" });
//         // }

//         // Find event
//         const event = await Event.findOne({
//             _id: eventId,
//             isLive: true,
//         });

//         if (!event) {
//             return res.status(404).json({ error: "Event not found" });
//         }
// console.log("Debug: Event found")
//         // Check ticket availability
//         if (event.totalSeats < 0) {
//             return res.status(400).json({ error: "Insufficient tickets available" });
//         }

//         // Check if any team member already has a pass
//         const existingPasses = await Pass.find({
//             userId,
//             eventId: event._id,
//         });

//         if (existingPasses.length > 0) {
//             return res.status(400).json({
//                 error: "Some team members already have passes for this event",
//             });
//         }
//         // Create pass for entire team
//         const teamPasses = team.teamMembers.map((member) => ({
//             userId: member._id,
//             eventId: event._id,
//             passType: "General",
//         }));
        
//         await Promise.all(teamPasses.map(pass => Pass.create(pass)));
//         console.log("fuck!!!")

//         // Update event tickets
//         const updatedEvent = await Event.findByIdAndUpdate(
//             event._id,
//             {
//                 $inc: { totalSeats: -team.teamMembers.length },
//             },
//             { new: true },
//         );

//         return res.status(200).json({
//             message: "Team tickets booked successfully",
//             teamMembers: team.teamMembers.length,
//             remainingTickets: updatedEvent.totalSeats,
//         });
//     } catch (error) {
//         console.error("Ticket booking error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };






const initiatePayment = async (req, res) => {
	const userId = req.user.id;
	const { bookingId } = req.params;
	try {
		/* The line `const booking = await bookTicket.findOne()` is attempting to find a single booking
		record using the `findOne()` method from the `bookTicket` model or collection. This operation is
		typically used to retrieve a specific document from a database based on certain criteria specified
		in the query. */
		// const booking= await bookTicket.findOne({userId: userId,eventId: eventId});
		const booking = await PassBooking.findOne({
			where: { id: bookingId, userId },
			include: [{ model: Pass }],
		});		
		if (!booking)
			return res.status(404).json({ detail: "Booking not found." });

		const uniqueTransactionId = `${booking.id}${Date.now()}`;
		const uiRedirectUrl = `${phonePeReturnUrl}${uniqueTransactionId}/`;

		const payload = {
			merchantId,
			merchantTransactionId: uniqueTransactionId,
			merchantUserId: userId,
			amount: booking.pass.price * 100,
			redirectUrl: uiRedirectUrl,
			redirectMode: "REDIRECT",
			callbackUrl: phonePeCallbackUrl,
			paymentInstrument: { type: "PAY_PAGE" },
		};

		const jsonPayload = JSON.stringify(payload);
		const base64Payload = base64.encode(jsonPayload);
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
					const payPageUrl =
						response.data?.data?.instrumentResponse?.redirectInfo?.url;
					await Payment.create({
						bookingId: booking.id,
						transactionId: uniqueTransactionId,
						paidAmount: booking.pass.price,
						status: "pending",
					});
					return res.status(200).json({ pay_page_url: payPageUrl });
				}
			} catch (error) {
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
	const b64Payload = req.body.response;
	const payload = JSON.parse(base64.decode(b64Payload));

	if (!payload) return res.status(400).json({ detail: "Invalid payload." });

	try {
		const { merchantTransactionId, transactionId, state, code } =
			payload.data;
		const payment = await Payment.findOne({
			where: { transactionId: merchantTransactionId,userId: req.user.id },
			include: [{ model: PassBooking, include: [Pass] }],
		});
		
		payment.status = code;
		payment.paymentId = transactionId;
		payment.reason = state;
		await payment.save();

		if (code === "PAYMENT_SUCCESS") {
			payment.booking.isActive = true;
			payment.booking.activatedAt = new Date();
			await payment.booking.save();

			// const qrData = await generatePassQR({
			// 	bookingId: payment.booking.id,
			// 	passType: payment.booking.pass.type,
			// 	validUntil: payment.booking.validUntil,
			// });

			// await sendPassConfirmationEmail({
			// 	transactionId: payment.transactionId,
			// 	amount: payment.paidAmount,
			// 	passDetails: {
			// 		type: payment.booking.pass.type,
			// 		validUntil: payment.booking.validUntil,
			// 	},
			// 	userName: payment.booking.user.name,
			// 	qrCode: qrData,
			// 	userEmail: payment.booking.user.email,
			// });

			return res.status(200).json({ detail: "Payment successful." });
		} else {
			payment.booking.isActive = false;
			await payment.booking.save();
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
