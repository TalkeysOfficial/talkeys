const mongoose = require("mongoose");

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
	endRegistrationDate: {
		type: Date,
		required: true,
		validate: {
			validator(val) {
				return this.startDate ? val <= this.startDate : true;
			},
			message: "End registration date must be before start date",
		},
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

eventSchema.methods.getStatus = function () {
	const now = new Date();

	if (now > this.endRegistrationDateTime) {
		return "registration_closed";
	}
	if (now < this.startDateTime) {
		return "coming_soon";
	}
	if (now >= this.startDateTime && this.isLive) {
		return "live";
	}
	return "ended";
};


const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
