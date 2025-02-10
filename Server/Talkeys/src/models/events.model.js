const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	//paramerters for event
	isTeamEvent: {
		type: Boolean,
		required: true,
	},
	isPaid: {
		type: Boolean,
		required: true,
	},
	isLive: {
		type: Boolean,
		default: false,
	},
	
	//event details
	name: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
		enum: ["esports", "music", "arts", "food", "tech", "other"],
	},
	ticketPrice: {
		type: Number,
		required: function () {
			return this.isPaid;
		}
	},
	mode: {
		type: String,
		enum: ["offline", "online"],
		required: true,
	},
	location: {
		type: String,
		required: function () {
			return this.mode === "offline";
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
	},
	
	
	//additional media and information
	photographs: {
		type: [String],
	},
	prizes: {
		type: String,
	},
	eventDescription: {
		type: String,
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
	regisrationCount: {
		type: Number,
		default: 0,
	},

	//organizer details
	organizerName: {
		type: String,
		required: false,
	},
	organizerEmail: {
		type: String,
		required: false,
	},
	organizerContact: {
		type: String,
		required: false,
	},

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
