"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { ChevronUp, Send, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import contactImage from "@/public/images/contact.png";
import { urbanist } from "@/components/fonts/fonts";

const formSchema = z.object({
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

export default function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [scrollPosition, setScrollPosition] = useState(0);

	React.useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};

		document.documentElement.style.scrollBehavior = "smooth";
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		setError(null);

		// Simulate API call
		setTimeout(() => {
			console.log(values);
			setIsSubmitting(false);
			setIsSubmitted(true);
		}, 1500);
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white ${urbanist.className}`}
		>
			{/* Animated background elements */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				{[...Array(15)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full bg-purple-500/10"
						style={{
							width: Math.random() * 300 + 50,
							height: Math.random() * 300 + 50,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						initial={{ opacity: 0.1 }}
						animate={{
							opacity: [0.1, 0.2, 0.1],
							scale: [1, 1.1, 1],
							x: [0, Math.random() * 20 - 10, 0],
							y: [0, Math.random() * 20 - 10, 0],
						}}
						transition={{
							duration: Math.random() * 8 + 5,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
				))}
			</div>

			{/* Main content */}
			<div className="relative z-10 container mx-auto px-4 py-16 pt-32 md:py-40">
				<motion.div
					initial={{ y: -30, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-500">
							Contact Us
						</span>
					</h1>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-300 mx-auto mb-8 rounded-full"
					/>
					<p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
						We'd love to hear from you! Fill out the form below and we'll
						get back to you as soon as possible.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="hidden lg:block"
					>
						<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20 overflow-hidden">
							<CardContent className="p-8 flex flex-col items-center">
								<motion.div
									whileHover={{ scale: 1.05, rotate: -2 }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 15,
									}}
									className="relative w-full max-w-md aspect-square"
								>
									<Image
										src={contactImage || "/placeholder.svg"}
										alt="Contact Us"
										layout="fill"
										objectFit="contain"
										priority
									/>
								</motion.div>
								<div className="mt-8 text-center">
									<h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
										Connect With Us
									</h3>
									<p className="text-gray-300 mb-2">
										Email:{" "}
										<span className="text-purple-300">
											talkeys11@gmail.com
										</span>
									</p>
									<p className="text-gray-300">
										Location:{" "}
										<span className="text-purple-300">
											Patiala, Punjab, India
										</span>
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						<AnimatePresence mode="wait">
							{isSubmitted ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.5 }}
								>
									<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20">
										<CardContent className="p-8 flex flex-col items-center text-center">
											<motion.div
												initial={{ scale: 0, rotate: 180 }}
												animate={{ scale: 1, rotate: 0 }}
												transition={{
													type: "spring",
													stiffness: 200,
													damping: 20,
												}}
												className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
											>
												<CheckCircle className="w-10 h-10 text-green-500" />
											</motion.div>
											<h3 className="text-2xl font-bold mb-4">
												Message Sent!
											</h3>
											<p className="text-gray-300 mb-6">
												Thank you for reaching out. We'll get back
												to you as soon as possible.
											</p>
											<Button
												onClick={() => setIsSubmitted(false)}
												className="bg-purple-600 hover:bg-purple-700"
											>
												Send Another Message
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.5 }}
								>
									<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20">
										<CardHeader>
											<CardTitle>Send Us a Message</CardTitle>
											<CardDescription className="text-gray-400">
												Fill out the form below to get in touch with
												our team.
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(onSubmit)}
													className="space-y-6"
												>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
														<FormField
															control={form.control}
															name="name"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Your Name
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Enter your name"
																			{...field}
																			className="bg-gray-800 border-gray-700 focus:border-purple-500"
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
																	<FormLabel>
																		Your Email
																	</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Enter your email"
																			{...field}
																			className="bg-gray-800 border-gray-700 focus:border-purple-500"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name="subject"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Subject</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Enter message subject"
																		{...field}
																		className="bg-gray-800 border-gray-700 focus:border-purple-500"
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
																<FormLabel>
																	Your Message
																</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Type your message here"
																		{...field}
																		className="bg-gray-800 border-gray-700 focus:border-purple-500 min-h-[150px]"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													{error && (
														<div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-center gap-2">
															<AlertCircle className="h-5 w-5 text-red-500" />
															<p className="text-red-500 text-sm">
																{error}
															</p>
														</div>
													)}

													<motion.div
														whileHover={{ scale: 1.03 }}
														whileTap={{ scale: 0.97 }}
													>
														<Button
															type="submit"
															className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
															disabled={isSubmitting}
														>
															{isSubmitting ? (
																<>
																	<motion.div
																		animate={{ rotate: 360 }}
																		transition={{
																			duration: 1,
																			repeat:
																				Number.POSITIVE_INFINITY,
																			ease: "linear",
																		}}
																		className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
																	/>
																	<span>Sending...</span>
																</>
															) : (
																<>
																	<Send className="h-4 w-4" />
																	<span>Send Message</span>
																</>
															)}
														</Button>
													</motion.div>
												</form>
											</Form>
										</CardContent>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>

			{/* Scroll to top button */}
			<AnimatePresence>
				{scrollPosition > 300 && (
					<motion.div
						className="fixed bottom-8 right-8 z-50"
						initial={{ opacity: 0, scale: 0.5, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.5, y: 20 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 15,
						}}
					>
						<Button
							onClick={scrollToTop}
							size="icon"
							className="rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-600/40"
							aria-label="Scroll to top"
						>
							<motion.div
								animate={{ y: [0, -3, 0] }}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "loop",
								}}
							>
								<ChevronUp className="h-5 w-5" />
							</motion.div>
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
