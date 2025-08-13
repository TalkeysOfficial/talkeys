"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import aboutUsImage from "@/public/images/aboutUs.png";
import { urbanist, volkhov } from "@/components/fonts/fonts";
import { ChevronUp, Sparkles } from "lucide-react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sections } from "@/components/AboutUs/data";

function AboutUsPage() {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [activeSection, setActiveSection] = useState<string>("mission");
	const containerRef = React.useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
	const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

	useEffect(() => {
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

	return (
		<div
			ref={containerRef}
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
					style={{ opacity: headerOpacity, scale: headerScale }}
					className="text-center mb-16"
				>
					<motion.h1
						initial={{ y: -30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-500">
							About Us
						</span>
					</motion.h1>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-300 mx-auto mb-8 rounded-full"
					/>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
					>
						Welcome to Talkeys, the ultimate meeting ground for fandoms,
						communities, and creators!
					</motion.p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="space-y-8"
					>
						<div className="bg-gradient-to-br from-gray-900/80 to-purple-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20">
							<p className="mb-4">
								Welcome to Talkeys, the ultimate meeting ground for
								fandoms, communities, and creators! Whether you're a
								die-hard anime lover, a formula racing enthusiast, a
								desi hip-hop fan, or part of any niche community,
								Talkeys is where your world gets louder, more connected,
								and more exciting.
							</p>
							<p className="mb-4">
								Talkeys is a unique blend of a booking platform and
								anonymous chatroom designed to unite passionate people
								and give underrated artists the space they deserve. Dive
								into anonymous chatrooms curated for different interests
								and connect with others who share your passion. No
								matter how niche or mainstream, your community awaits
								you here.
							</p>
							<p>
								But we&apos;re not just about conversations—we&apos;re
								about action! Artists can post their gigs and events,
								and fans can easily book tickets right through our
								platform. Discover hidden talent, support emerging
								creators, and be part of something bigger.
							</p>
						</div>

						{/* Section tabs */}
						<div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-900/30 overflow-hidden">
							<div className="flex overflow-x-auto no-scrollbar">
								{sections.map((section) => (
									<Button
										key={section.id}
										variant="ghost"
										className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 transition-all ${
											activeSection === section.id
												? "border-purple-500 text-white bg-purple-900/20"
												: "border-transparent text-gray-400 hover:text-white hover:bg-purple-900/10"
										}`}
										onClick={() => setActiveSection(section.id)}
									>
										{section.icon}
										<span>{section.title}</span>
									</Button>
								))}
							</div>

							<div className="p-6">
								<AnimatePresence mode="wait">
									{sections.map(
										(section) =>
											activeSection === section.id && (
												<motion.div
													key={section.id}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.3 }}
												>
													<div className="flex items-center gap-3 mb-4">
														<div className="bg-purple-600 p-2 rounded-full">
															{section.icon}
														</div>
														<h3 className="text-xl font-bold">
															{section.title}
														</h3>
													</div>
													<p className="text-gray-300">
														{section.content}
													</p>
												</motion.div>
											),
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="flex flex-col items-center gap-8"
					>
						<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20 overflow-hidden w-full max-w-md">
							<CardContent className="p-0">
								<motion.div
									className="relative w-full aspect-square"
									whileHover={{ scale: 1.02 }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 15,
									}}
								>
									<Image
										src={aboutUsImage}
										alt="About Us"
										layout="fill"
										objectFit="contain"
										priority
										className="p-4"
									/>
								</motion.div>
							</CardContent>
						</Card>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="text-center space-y-6"
						>
							<p
								className={`${volkhov.className} font-bold text-center text-xl sm:text-2xl w-full lg:w-3/4 mx-auto bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300`}
							>
								Journey through the depths to find your next adventure
							</p>

							<div className="flex justify-center">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										className="bg-purple-600 hover:bg-purple-700 gap-2"
										onClick={() =>
											(window.location.href = "/eventPage")
										}
									>
										<Sparkles className="h-4 w-4" />
										Explore Events
									</Button>
								</motion.div>
							</div>
						</motion.div>
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

export default AboutUsPage;
