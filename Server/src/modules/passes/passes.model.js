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
	passSelections: [{
		passTypeId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		passTypeName: {
			type: String,
			default: "General Pass",
		},
		passPrice: {
			type: Number,
			default: 0,
			min: 0,
		},
		quantity: {
			type: Number,
			default: 1,
			min: 1,
		},
	}],
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
	attendees: [{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		personType: {
			type: String,
			enum: ["user", "friend"],
			default: "friend",
		},
		personIndex: {
			type: Number,
			default: 0,
		},
		passTypeId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		passTypeName: {
			type: String,
			default: "General Pass",
		},
		passPrice: {
			type: Number,
			default: 0,
			min: 0,
		},
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
		passTypeId: {
			type: mongoose.Schema.Types.ObjectId,
		},
		passTypeName: {
			type: String,
			default: "General Pass",
		},
		passPrice: {
			type: Number,
			default: 0,
			min: 0,
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
		default: "General",
	},
	passTypeId: {
		type: mongoose.Schema.Types.ObjectId,
	},
	passTypeName: {
		type: String,
		default: "General Pass",
	},
	passPrice: {
		type: Number,
		default: 0,
		min: 0,
	},
});

passSchema.pre('save', function(next) {
	const isConfirmed = this.paymentStatus === 'completed' || this.status === 'active' || this.passStatus === 'active';

	if (!this.passUUID && isConfirmed) {
		this.passUUID = uuidv4();
	}
	if (isConfirmed && (!this.qrStrings || this.qrStrings.length === 0)) {
		const attendeeDetails = this.attendees?.length
			? this.attendees
			: [
				{
					name: "Main User",
					personType: "user",
					personIndex: 0,
					passTypeId: this.passTypeId,
					passTypeName: this.passTypeName || this.passType || "General Pass",
					passPrice: this.passPrice || 0,
				},
				...(this.friends || []).slice(0, 9).map((friend, index) => ({
					name: friend?.name || `Friend ${index + 1}`,
					personType: "friend",
					personIndex: index + 1,
					passTypeId: this.passTypeId,
					passTypeName: this.passTypeName || this.passType || "General Pass",
					passPrice: this.passPrice || 0,
				})),
			];

		this.qrStrings = attendeeDetails.slice(0, 10).map((attendee, index) => ({
			id: uuidv4(),
			personType: attendee.personType || (index === 0 ? "user" : "friend"),
			personIndex: attendee.personIndex ?? index,
			personName: attendee.name || (index === 0 ? "Main User" : `Friend ${index}`),
			passTypeId: attendee.passTypeId || this.passTypeId,
			passTypeName: attendee.passTypeName || this.passTypeName || this.passType || "General Pass",
			passPrice: attendee.passPrice ?? this.passPrice ?? 0,
			qrScanned: false,
			scannedAt: null
		}));
	}
	
	next();
});

passSchema.methods.getQRData = function() {
	return this.qrStrings.map(qr => ({
		id: qr.id,
		personType: qr.personType,
		personName: qr.personType === "user" ? "Main User" : 
					this.friends[qr.personIndex - 1]?.name || `Friend ${qr.personIndex}`,
		passTypeName: qr.passTypeName || this.passTypeName || this.passType || "General Pass",
		passPrice: qr.passPrice ?? this.passPrice ?? 0,
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
