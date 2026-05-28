const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const passSchema = new mongoose.Schema({
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
	passStatus: {	
		type: String,
		enum: ["active", "inactive", "expired", "revoked"],
		default: "inactive",
	},
	status: {
		type: String,
		enum: ["pending", "active", "payment_failed", "expired", "revoked"],
		default: "pending",
	},
	paymentStatus: {
		type: String,
		enum: ["completed", "pending", "failed", "refunded"],
		default: "pending",
	},
	merchantOrderId: {
		type: String,
		unique: true,
		sparse: true, 
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
	ticketCount: {
		type: Number,
		required: true,
		default: 1,
		min: 1,
	},
	seatsReserved: {
		type: Boolean,
		default: false,
	},
	expiresAt: {
		type: Date,
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
		reason: String, 
	},
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

	qrStrings: [{
		id: {
			type: String,
			unique: true,
		},
		personType: {
			type: String,
			enum: ["user", "friend"],
			
		},
		personIndex: {
			type: Number,
		},
		personName: {
			type: String,
		},
		qrScanned: {
			type: Boolean,
			default: false,
		},
		scannedAt: {
			type: Date,
			default: null,
		}
	}],

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
	createdAt: {
		type: Date,
		default: Date.now,
	},

	confirmedAt: {
		type: Date,
	},
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

passSchema.pre('save', function(next) {
	const isConfirmed = this.paymentStatus === 'completed' || this.status === 'active' || this.passStatus === 'active';

	if (!this.passUUID && isConfirmed) {
		this.passUUID = uuidv4();
	}
	if (isConfirmed && (!this.qrStrings || this.qrStrings.length === 0)) {
		this.qrStrings = [];
		this.qrStrings.push({
			id: uuidv4(),
			personType: "user",
			personIndex: 0,
			personName: "Main User",
			qrScanned: false,
			scannedAt: null
		});
		
		const maxFriends = Math.min(this.friends.length, 9);//9 people at max
		for (let i = 0; i < maxFriends; i++) {
			this.qrStrings.push({
				id: uuidv4(),
				personType: "friend",
				personIndex: i + 1,
				personName: this.friends[i]?.name || `Friend ${i + 1}`,
				qrScanned: false,
				scannedAt: null
			});
		}
	}
	
	next();
});

passSchema.methods.getQRData = function() {
	return this.qrStrings.map(qr => ({
		id: qr.id,
		personType: qr.personType,
		personName: qr.personType === "user" ? "Main User" : 
					this.friends[qr.personIndex - 1]?.name || `Friend ${qr.personIndex}`,
		qrScanned: qr.qrScanned,
		scannedAt: qr.scannedAt,
		qrContent: `${this.eventId}_${this.passUUID}_${qr.id}_${qr.personName}`
	}));
};

passSchema.methods.markQRScanned = function(qrId) {
	const qrString = this.qrStrings.find(qr => qr.id === qrId || qr._id?.toString() === qrId);
	if (qrString && !qrString.qrScanned) {
		qrString.qrScanned = true;
		qrString.scannedAt = new Date();

		const allScanned = this.qrStrings.every(qr => qr.qrScanned);
		if (!this.isScanned && allScanned) {
			this.isScanned = true;
			this.timeScanned = new Date();
		}
		
		return this.save();
	}
	return Promise.resolve(this);
};

passSchema.statics.validateQRString = async function(qrId) {
	const query = mongoose.Types.ObjectId.isValid(qrId)
		? { $or: [{ "qrStrings._id": qrId }, { "qrStrings.id": qrId }] }
		: { "qrStrings.id": qrId };
	const pass = await this.findOne(query);
	if (!pass) {
		return { valid: false, message: "Invalid QR code" };
	}
	const qrString = pass.qrStrings.find(qr => qr.id === qrId || qr._id?.toString() === qrId);
	if (qrString.qrScanned) {
		return { valid: false, message: "QR code already scanned" };
	}
	if (pass.paymentStatus !== 'completed' || (pass.status && pass.status !== 'active')) {
		return { valid: false, message: "Pass is not active" };
	}
	return { valid: true, pass, qrString };
};

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
