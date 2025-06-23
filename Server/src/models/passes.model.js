const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
	// User and event details
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	Team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TeamSchema",
	},
	
	// Pass status management
	status: {
		type: String,
		enum: ["active", "pending", "cancelled", "expired", "payment_failed"],
		default: "pending",
	},
	passStatus: {	
		type: String,
		enum: ["active", "inactive", "expired", "revoked"],
		default: "active",
	},
	paymentStatus: {
		type: String,
		enum: ["completed", "pending", "failed", "refunded"],
		default: "pending",
	},

	// Payment integration fields
	merchantOrderId: {
		type: String,
		unique: true,
		sparse: true, // Allows null values but ensures uniqueness when present
	},
	phonePeOrderId: {
		type: String,
		sparse: true,
	},
	paymentUrl: {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
		min: 0,
	},
	paymentDetails: {
		orderId: String,
		transactionId: String,
		amount: Number,
		paymentMode: String,
		completedAt: Date,
		failedAt: Date,
		source: String,
		merchantOrderId: String,
		reason: String, // For failure reasons
	},

	// Friends/companions for group bookings
	friends: [{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		}
	}],

	// Pass details
	isScanned: {
		type: Boolean,
		default: false,
	},
	timeScanned: {
		type: Date,
		default: null,
	},
	passUUID: {
		type: String,
		unique: true,
		sparse: true,
	},

	// Timestamps and expiry
	createdAt: {
		type: Date,
		default: Date.now,
	},
	expiresAt: {
		type: Date,
		// Default to 20 minutes from creation for pending payments
		default: function() {
			return new Date(Date.now() + 20 * 60 * 1000);
		}
	},
	confirmedAt: {
		type: Date,
	},

	// Event-specific details
	slotID: {
		type: Number,
		enum: {
			values: [1, 2, 3, 4, 5],
			message: "Slot ID must be between 1 and 5",
		},
		default: 1,
	},
	passType: {
		type: String,
		enum: ["VIP", "General", "Staff"],
		default: "General",
	},
});


// Pre-save middleware to generate UUID if not present
passSchema.pre('save', function(next) {
	if (!this.passUUID && this.status === 'active') {
		this.passUUID = require('uuid').v4();
	}
	next();
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;