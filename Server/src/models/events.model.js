const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	isTeamEvent: {
		type: Boolean,
		required: true,
		default: false,
	},
	isPaid: {
		type: Boolean,
		required: true,
		default: false,
	},
	isLive: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		required: true,
		default: "<NONE>",
	},
	category: {
		type: String,
		required: true,
		default: "other",
	},
	ticketPrice: {
		type: Number,
		validate: {
			validator(val) {
				return val >= 0;
			},
			message: "Ticket price must be a positive number",
		},
		default: 0,
	},
	mode: {
		type: String,
		enum: ["offline", "online"],
		required: true,
	},
	location: {
		type: String,
		validate: {
			validator(val) {
				return this.mode !== "offline" || !!val;
			},
			message: "Location is required for offline events",
		},
	},
	duration: {
		type: String,
		required: true,
	},
	slots: {
		type: Number,
		required: true,
		default: 1,
	},
	visibility: {
		type: String,
		enum: ["public", "private"],
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endRegistrationDate: {
		type: Date,
		required: true,
	},
	totalSeats: {
		type: Number,
		required: true,
		default: 0,
		validate: {
			validator(val) {
				return val >= 0;
			},
			message: "Total Seats must NOT be negative number",
		},
	},
	photographs: {
		type: [String],
	},
	prizes: {
		type: String,
		default: "",
	},
	eventDescription: {
		type: String,
		default: "",
	},
	paymentQRcode: {
		type: String,
		default: "",
	},
	registrationLink: {
		type: String,
		default: "",
	},
	sponserImages: {
		type: [String],
	},
	registrationCount: {
		type: Number,
		default: 0,
	},
	organizerName: {
		type: String,
		default: "",
	},
	organizerEmail: {
		type: String,
		validate: {
			validator(val) {
				return /.+@.+\..+/.test(val);
			},
			message: "Invalid email",
		},
		default: "achatrath@thapar.edu",
	},
	organizerContact: {
		type: String,
		default: "",
	},
	organiserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
