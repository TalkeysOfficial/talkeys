const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
	order: {
		type: Schema.Types.ObjectId,
		ref: "Order",
		required: true,
		unique: true,
	},
	transactionId: {
		type: String,
		unique: true,
		required: true,
	},
	paidAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["success", "failure", "pending"],
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
