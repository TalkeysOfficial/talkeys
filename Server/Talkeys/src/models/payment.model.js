const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
	// user and pass and transaction details
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	passId: {
		type: Schema.Types.ObjectId,
		ref: "pass",
		required: true,
		unique: true,
	},
	transactionId: {
		type: String,
		unique: true,
		required: true,
	},
	
	
	// payment details
	paidAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["PAYMENT_SUCCESS", "PAYMENT_ERROR", "PAYMENT_PENDING"],
		required: true,
	},	
	paymentDate: {
		type: Date,
		default: Date.now,
	},
	paymentId: {
		type: String,
		unique: true,
		default: "",
	},
	reason: { // of failure
		type: String,
		default: "",
	},
});

module.exports = {

	Payment: mongoose.model("Payment", PaymentSchema),
};
