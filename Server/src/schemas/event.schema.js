const { z } = require("zod");

const optionalNumber = (schema) =>
	z.preprocess((value) => {
		if (value === "" || value === null || value === undefined) return undefined;
		if (typeof value === "string") return Number(value);
		return value;
	}, schema);

const optionalBoolean = (defaultValue) =>
	z.preprocess((value) => {
		if (value === "" || value === null || value === undefined) return defaultValue;
		if (typeof value === "string") return value === "true";
		return value;
	}, z.boolean().default(defaultValue));

const requiredDate = z.preprocess((value) => {
	if (value instanceof Date) return value;
	if (typeof value === "string" || typeof value === "number") return new Date(value);
	return value;
}, z.date({ required_error: "Date is required" }));

const optionalDate = z.preprocess((value) => {
	if (value === "" || value === null || value === undefined) return undefined;
	if (value instanceof Date) return value;
	if (typeof value === "string" || typeof value === "number") return new Date(value);
	return value;
}, z.date().optional().nullable());

const stringArray = z.preprocess((value) => {
	if (value === "" || value === null || value === undefined) return [];
	if (Array.isArray(value)) return value.filter(Boolean);
	if (typeof value === "string") {
		return value
			.split(/[\n,]/)
			.map((item) => item.trim())
			.filter(Boolean);
	}
	return value;
}, z.array(z.string()).default([]));

const passTypeSchema = z
	.object({
		id: z.string().optional(),
		_id: z.string().optional(),
		name: z.string().trim().min(1, "Pass name is required"),
		price: optionalNumber(
			z.number().min(0, "Pass price must be a non-negative number").default(0),
		),
		description: z.string().default(""),
		totalQuantity: optionalNumber(
			z
				.number()
				.int("Pass quantity must be a whole number")
				.min(0, "Pass quantity cannot be negative")
				.default(0),
		),
		maxAvailable: optionalNumber(
			z
				.number()
				.int("Max available pass quantity must be a whole number")
				.min(0, "Max available pass quantity cannot be negative")
				.default(0),
		),
		soldQuantity: optionalNumber(
			z
				.number()
				.int("Sold pass quantity must be a whole number")
				.min(0, "Sold pass quantity cannot be negative")
				.default(0),
		),
		bookedQuantity: optionalNumber(
			z
				.number()
				.int("Booked pass quantity must be a whole number")
				.min(0, "Booked pass quantity cannot be negative")
				.default(0),
		),
		isActive: optionalBoolean(true),
	})
	.transform((passType) => {
		const totalQuantity = passType.totalQuantity || passType.maxAvailable || 0;
		const maxAvailable = passType.maxAvailable || passType.totalQuantity || 0;
		const id = passType._id || passType.id;

		return {
			...(id ? { _id: id } : {}),
			name: passType.name,
			price: passType.price,
			description: passType.description,
			totalQuantity,
			maxAvailable,
			soldQuantity: passType.soldQuantity,
			bookedQuantity: passType.bookedQuantity,
			isActive: passType.isActive,
		};
	});

const passTypesArray = z.preprocess((value) => {
	if (value === "" || value === null || value === undefined) return [];
	return value;
}, z.array(passTypeSchema).default([]));

const normalizedEnum = (values, options = {}) =>
	z.preprocess((value) => {
		if (typeof value === "string") return value.trim().toLowerCase();
		return value;
	}, z.enum(values, options));

const optionalEmail = z.preprocess((value) => {
	if (value === "" || value === null || value === undefined) return undefined;
	if (typeof value === "string") return value.trim();
	return value;
}, z.string().email("Organizer email must be valid").optional());

const eventShape = {
	isTeamEvent: optionalBoolean(false),
	isPaid: optionalBoolean(false),
	isLive: optionalBoolean(false),
	isRegistrationOpen: optionalBoolean(false),
	name: z.string().trim().min(1, "Event name is required"),
	category: z.string().trim().min(1, "Category is required").default("other"),
	ticketPrice: optionalNumber(
		z.number().min(0, "Ticket price must be a non-negative number").default(0),
	),
	passTypes: passTypesArray,
	mode: normalizedEnum(["offline", "online"], {
		required_error: "Mode is required",
		invalid_type_error: "Mode must be offline or online",
	}),
	location: z.string().trim().default(""),
	duration: z.string().trim().min(1, "Duration is required"),
	slots: optionalNumber(
		z.number().int("Slots must be a whole number").min(0, "Slots cannot be negative").default(1),
	),
	visibility: normalizedEnum(["public", "private"], {
		required_error: "Visibility is required",
		invalid_type_error: "Visibility must be public or private",
	}),
	startDate: requiredDate,
	endDate: optionalDate,
	startTime: z
		.string()
		.trim()
		.regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:MM format"),
	startRegistrationDate: requiredDate,
	totalSeats: optionalNumber(
		z
			.number()
			.int("Total seats must be a whole number")
			.min(0, "Total seats must be a non-negative number"),
	),
	registrationCount: optionalNumber(
		z
			.number()
			.int("Registration count must be a whole number")
			.min(0, "Registration count cannot be negative")
			.default(0),
	),
	photographs: stringArray,
	prizes: z.string().default(""),
	eventDescription: z.string().default(""),
	paymentQRcode: z.string().default(""),
	registrationLink: z.string().default(""),
	sponserImages: stringArray,
	organizerName: z.string().default(""),
	organizerEmail: optionalEmail,
	organizerContact: z.string().default(""),
	tags: stringArray,
	ageRestriction: optionalNumber(z.number().int().min(0).optional().nullable()),
	status: normalizedEnum(["draft", "published", "cancelled"]).default("published"),
};

const refineEvent = (event, ctx) => {
	if (event.mode === "offline" && !event.location) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["location"],
			message: "Location is required for offline events",
		});
	}

	if (
		typeof event.registrationCount === "number" &&
		typeof event.totalSeats === "number" &&
		event.registrationCount > event.totalSeats
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["registrationCount"],
			message: "Registration count cannot exceed total seats",
		});
	}

	if (Array.isArray(event.passTypes) && event.passTypes.length > 0) {
		event.passTypes.forEach((passType, index) => {
			if (
				typeof passType.soldQuantity === "number" &&
				typeof passType.totalQuantity === "number" &&
				passType.totalQuantity > 0 &&
				passType.soldQuantity > passType.totalQuantity
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["passTypes", index, "soldQuantity"],
					message: "Sold pass quantity cannot exceed total pass quantity",
				});
			}
		});
	}
};

const createEventSchema = z.object(eventShape).superRefine(refineEvent);
const updateEventSchema = z
	.object(eventShape)
	.partial()
	.superRefine((event, ctx) => {
		refineEvent(event, ctx);

		if (event.mode === "offline" && event.location === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["location"],
				message: "Location is required for offline events",
			});
		}
	});

const normalizeEventData = (eventData = {}) => {
	const normalized = { ...eventData };

	if (normalized.sponsorImages !== undefined && normalized.sponserImages === undefined) {
		normalized.sponserImages = normalized.sponsorImages;
	}

	delete normalized.sponsorImages;
	delete normalized._id;
	delete normalized.__v;
	delete normalized.createdAt;
	delete normalized.updatedAt;
	delete normalized.availableSeats;
	delete normalized.startDateTime;
	delete normalized.minTicketPrice;

	return normalized;
};

const formatZodError = (error) =>
	error.errors?.map((issue) => issue.message).join(", ") || "Invalid event data";

const validateEvent = (eventData, options = {}) => {
	const schema = options.partial ? updateEventSchema : createEventSchema;
	const result = schema.safeParse(normalizeEventData(eventData));

	if (!result.success) {
		return {
			success: false,
			message: formatZodError(result.error),
			errors: result.error.errors,
		};
	}

	return {
		success: true,
		data: result.data,
	};
};

module.exports = {
	validateEvent,
};
