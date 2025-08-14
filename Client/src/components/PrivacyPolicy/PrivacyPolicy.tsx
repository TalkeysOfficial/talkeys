"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { urbanist } from "@/components/fonts/fonts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { sections } from "@/components/PrivacyPolicy/data";
import AnimatedBackgroundElements from "@/components/AnimatedBackgroundElements";

export default function PrivacyPolicyPage() {
	const [activeSection, setActiveSection] = useState<string | null>(null);
	const [scrollPosition, setScrollPosition] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};

		// Enable smooth scrolling for the entire page
		document.documentElement.style.scrollBehavior = "smooth";

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			// Reset scroll behavior when component unmounts
			document.documentElement.style.scrollBehavior = "";
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
			ref={containerRef}
			className={`min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white ${urbanist.className}`}
		>
			{/* Animated background elements */}
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
							Privacy Policy
						</span>
					</h1>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-300 mx-auto mb-8 rounded-full"
					/>
					<p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
						At Talkeys, we value your privacy and are committed to
						protecting your personal data. This policy outlines how we
						collect, use, and safeguard your information.
					</p>
				</motion.div>

				{/* Privacy Policy sections */}
				<div className="grid grid-cols-1 gap-8">
					{sections.map((section, index) => (
						<motion.div
							key={section.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 * index, duration: 0.5 }}
							layout
						>
							<Card
								className={`border border-purple-900/30 ${
									activeSection === section.id
										? "bg-gradient-to-br from-gray-900 to-purple-950/50"
										: "bg-black/40"
								} backdrop-blur-sm transition-all duration-500 overflow-hidden`}
							>
								<CardHeader
									className="cursor-pointer relative z-10 p-6"
									onClick={() =>
										setActiveSection(
											activeSection === section.id
												? null
												: section.id,
										)
									}
								>
									<div className="flex items-center gap-4">
										<motion.div
											className={`flex items-center justify-center h-10 w-10 rounded-full ${
												activeSection === section.id
													? "bg-purple-600"
													: "bg-gray-800"
											} transition-colors duration-300`}
											whileHover={{ scale: 1.1 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
										>
											{section.icon}
										</motion.div>
										<div className="flex-1">
											<CardTitle className="text-xl md:text-2xl text-white">
												{section.title}
											</CardTitle>
											<CardDescription className="text-gray-400">
												{section.description}
											</CardDescription>
										</div>
										<motion.div
											animate={{
												rotate:
													activeSection === section.id ? 180 : 0,
											}}
											transition={{ duration: 0.3 }}
											className={`h-8 w-8 rounded-full flex items-center justify-center ${
												activeSection === section.id
													? "bg-purple-600 text-white"
													: "bg-gray-800 text-gray-400"
											} transition-colors duration-300`}
										>
											<ChevronDown className="h-5 w-5" />
										</motion.div>
									</div>
								</CardHeader>

								<AnimatePresence>
									{activeSection === section.id && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												duration: 0.5,
												ease: [0.04, 0.62, 0.23, 0.98],
											}}
										>
											<CardContent className="text-gray-300 pb-6 relative">
												{/* Decorative elements */}
												<div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>

												{/* Content */}
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{
														duration: 0.3,
														delay: 0.2,
													}}
													className="pl-14"
												>
													{section.content}
												</motion.div>
											</CardContent>
										</motion.div>
									)}
								</AnimatePresence>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.8 }}
					className="mt-16 text-center"
				>
					<div className="p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm border border-purple-900/30">
						<p className="mb-4 text-gray-300">
							Thank you for trusting Talkeys with your personal
							information. We are committed to maintaining the highest
							standards of privacy and data protection.
						</p>
						<p className="text-gray-400">Last Updated: January 2025</p>
					</div>
				</motion.div>
			</div>

			{/* Scroll to top button with smoother animation */}
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
