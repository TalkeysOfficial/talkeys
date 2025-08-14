// utils/validation.ts
import { z } from "zod";

export const friendSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be less than 50 characters")
		.regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
	email: z
		.string()
		.email("Please enter a valid email address")
		.min(1, "Email is required"),
	phone: z
		.string()
		.regex(
			/^[6-9]\d{9}$/,
			"Please enter a valid 10-digit Indian phone number",
		)
		.min(10, "Phone number must be 10 digits")
		.max(10, "Phone number must be 10 digits"),
});

export const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    subject: z.string().min(5, {
        message: "Subject must be at least 5 characters.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
});


export type Friend = z.infer<typeof friendSchema>;
