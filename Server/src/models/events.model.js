const mongoose = require("mongoose");

const passTypeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		default: "General Pass",
	},
	price: {
		type: Number,
		default: 0,
		min: [0, "Pass price must be a non-negative number"],
	},
	description: {
		type: String,
		default: "",
	},
	totalQuantity: {
		type: Number,
		default: 0,
		min: [0, "Total pass quantity must not be negative"],
	},
	maxAvailable: {
		type: Number,
		default: 0,
		min: [0, "Max available pass quantity must not be negative"],
	},
	soldQuantity: {
		type: Number,
		default: 0,
		min: [0, "Sold pass quantity must not be negative"],
	},
	bookedQuantity: {
		type: Number,
		default: 0,
		min: [0, "Booked pass quantity must not be negative"],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
	isTeamEvent: { type: Boolean, required: true, default: false },
	isPaid: { type: Boolean, required: true, default: false },
	isLive: { type: Boolean, default: false },

	name: { type: String, required: true, default: "<NONE>" },
	category: { type: String, required: true, default: "other" },
	ticketPrice: {
		type: Number,
		validate: { validator: val => val >= 0, message: "Ticket price must be positive" },
		default: 0,
	},
	passTypes: {
		type: [passTypeSchema],
		default: [],
	},

	mode: { type: String, enum: ["offline", "online"], required: true },
	location: {
		type: String,
		validate: {
			validator(val) {
				return this.mode !== "offline" || !!val;
			},
			message: "Location is required for offline events",
		},
	},

	duration: { type: String, required: true },
	slots: { type: Number, required: true, default: 1 },
	visibility: { type: String, enum: ["public", "private"], required: true },

	startDate: { type: Date, required: true },
	endDate: { type: Date, default: null },
	startTime: {
		type: String,
		required: true,
		validate: {
			validator: val => /^([01]\d|2[0-3]):[0-5]\d$/.test(val),
			message: "Invalid time format (HH:MM)",
		},
	},
	isRegistrationOpen: {
		type: Boolean,
		default: false
	},
	startRegistrationDate: {
		type: Date,
		required: true,
	},

	totalSeats: {
		type: Number,
		required: true,
		default: 0,
		validate: { validator: val => val >= 0, message: "Total Seats must not be negative" },
	},
	registrationCount: {
		type: Number,
		default: 0,
		validate: {
			validator(val) {
				return val <= this.totalSeats;
			},
			message: "Registration count cannot exceed total seats",
		},
	},

	photographs: { type: [String], default: [] },
	prizes: { type: String, default: "" },
	eventDescription: { type: String, default: "" },
	paymentQRcode: { type: String, default: "" },
	registrationLink: { type: String, default: "" },
	sponserImages: { type: [String], default: [] },

	organizerName: { type: String, default: "" },
	organizerEmail: {
		type: String,
		default: "achatrath@thapar.edu",
		validate: {
			validator: val => !val || /.+@.+\..+/.test(val),
			message: "Invalid email",
		},
	},
	organizerContact: { type: String, default: "" },
	organiserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

	// Future-proofing
	tags: { type: [String], default: [] },
	ageRestriction: { type: Number, default: null },
	status: { type: String, enum: ["draft", "published", "cancelled"], default: "published" },

}, { timestamps: true });

eventSchema.pre("validate", function (next) {
	if (!this.passTypes || this.passTypes.length === 0) {
		const quantity = Number(this.totalSeats || 0);
		const booked = Number(this.registrationCount || 0);

		this.passTypes = [{
			name: "General Pass",
			price: Number(this.ticketPrice || 0),
			description: "",
			totalQuantity: quantity,
			maxAvailable: quantity,
			soldQuantity: booked,
			bookedQuantity: booked,
			isActive: true,
		}];
	}

	this.passTypes.forEach((passType) => {
		if (!passType.maxAvailable && passType.totalQuantity) {
			passType.maxAvailable = passType.totalQuantity;
		}
		if (!passType.totalQuantity && passType.maxAvailable) {
			passType.totalQuantity = passType.maxAvailable;
		}
	});

	next();
});

eventSchema.methods.getStatus = function () {
	const now = new Date();

	if (!this.isRegistrationOpen) {
		return "registration_closed";
	}
	if (now < new Date(this.startRegistrationDate)) {
		return "coming_soon";
	}
	if (now >= new Date(this.startRegistrationDate) && this.isLive) {
		return "live";
	}
	return "ended";
};


const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
