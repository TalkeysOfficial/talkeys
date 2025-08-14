const { z } = require("zod");

const eventSchema = z.object({
	isTeamEvent: z.boolean().default(false),
	isPaid: z.boolean().default(false),
	isLive: z.boolean().default(false),
	name: z.string(),
	category: z.string().default("other"),
	ticketPrice: z
		.number()
		.refine((val) => val >= 0, {
			message: "Ticket price must be a positive number",
		})
		.optional(),
	mode: z.enum(["offline", "online"]),
	location: z
		.string()
		.optional()
		.refine((val, ctx) => {
			// Use `ctx` to check the mode directly from the context, no parent reference needed
			const mode = ctx?.parent?.mode; // Get the `mode` directly from `ctx.parent`
			if (mode === "offline" && !val) {
				return ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Location is required for offline events",
				});
			}
			return true;
		}),
	duration: z.string(),
	slots: z.number().default(1),
	visibility: z.enum(["public", "private"]),
	startDate: z.date(),
	startTime: z.string(),
	startRegistrationDate: z.date(),
	totalSeats: z.number().refine((val) => val >= 0, {
		message: "Total Seats must NOT be negative number",
	}),
	photographs: z.array(z.string()).optional(),
	prizes: z.string().optional().default(""),
	eventDescription: z.string().optional().default(""),
	paymentQRcode: z.string().default(""),
	registrationLink: z.string().default(""),
	sponserImages: z.array(z.string()).optional(),
	registrationCount: z.number().default(0),
	organizerName: z.string().optional().default(""),
	organizerEmail: z
		.string()
		.email()
		.optional()
		.default("achatrath@thapar.edu")
		.refine((val) => val === undefined || /.+@.+\..+/.test(val), {
			message: "Invalid email",
		}),
	organizerContact: z.string().optional().default(""),
});

const validateEvent = (eventData) => {
	try {
		// Preprocess the data
		if (eventData.startDate) {
			eventData.startDate = new Date(eventData.startDate);
		}
		if (eventData.startRegistrationDate) {
			eventData.startRegistrationDate = new Date(
				eventData.startRegistrationDate,
			);
		}

		if (typeof eventData.totalSeats === "string") {
			eventData.totalSeats = parseInt(eventData.totalSeats, 10);
		}

		// Validate using Zod
		eventSchema.parse(eventData);
		return true;
	} catch (err) {
		console.error("Validation error:", err.errors); // Log validation errors
		return false;
	}
};

module.exports = {
	validateEvent,
};
