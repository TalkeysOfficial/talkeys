"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import contactImage from "@/public/images/contact.png";
import { urbanist } from "@/components/fonts/fonts";
import { formSchema } from "@/components/ContactUs/formvalidator";
import AnimatedBackgroundElements from "@/components/ContactUs/AnimatedBackgroundElements";
import SubmittedSuccess from "@/components/ContactUs/SubmittedSuccess";
import ContactUsForm from "@/components/ContactUs/ContactUsForm";

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
			<AnimatedBackgroundElements />

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
											Patalia, Punjab, India
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
								<SubmittedSuccess setIsSubmitted={setIsSubmitted} />
							) : (
								<ContactUsForm
									onSubmit={onSubmit}
									isSubmitting={isSubmitting}
									error={error}
								/>
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
