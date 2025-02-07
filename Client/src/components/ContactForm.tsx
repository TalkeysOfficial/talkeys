"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import image from "@/public/images/contact.png";	
import Image from "next/image";
import { motion } from "framer-motion";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	message: z.string().min(10, {
		message: "Message must be at least 10 characters.",
	}),
});

export default function ContactForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Handle form submission
		console.log(values);
	}

	return (
		<motion.div
			className="min-h-screen bg-transparent text-white p-8 flex flex-col items-center justify-center"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1 }}
		>
			<div className="w-full max-w-md space-y-8">
				<div className="flex items-center justify-between">
					<h2 className="text-3xl font-bold">Contact Us</h2>
					<Image
						src={image}
						alt="Contact"
						width={200}
						height={200}
					/>
				</div>
				<p className="text-purple-400 text-center">
					We'd love to hear from you!
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your full name"
											{...field}
											className="bg-gray-800 border-gray-700"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your email address"
											{...field}
											className="bg-gray-800 border-gray-700"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Message</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Type your message here"
											{...field}
											className="bg-gray-800 border-gray-700"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-center">
							<Button
								type="submit"
								className="w-[120px] bg-purple-600 hover:bg-purple-700 rounded-3xl items-center justify-center"
							>
								Send Message
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</motion.div>
	);
}
