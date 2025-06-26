"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
	Facebook,
	Instagram,
	Linkedin,
	Youtube,
	Mail,
	Phone,
	MapPin,
	ExternalLink,
	ChevronUp,
	Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import image from "@/public/images/Logo.png";

export default function Footer() {
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
	const [expandedSection, setExpandedSection] = useState<string | null>(null);

	const toggleSection = (section: string) => {
		setExpandedSection(expandedSection === section ? null : section);
	};

	const socialLinks = [
		{
			name: "Facebook",
			icon: <Facebook size={24} />,
			href: "/underConstruct",
			ariaLabel: "Facebook",
		},
		{
			name: "Instagram",
			icon: <Instagram size={24} />,
			href: "https://www.instagram.com/talkeys_?igsh=MWsxZHk0bTQyYmlyag==",
			ariaLabel: "Instagram",
		},
		{
			name: "LinkedIn",
			icon: <Linkedin size={24} />,
			href: "/underConstruct",
			ariaLabel: "LinkedIn",
		},
		{
			name: "YouTube",
			icon: <Youtube size={24} />,
			href: "/underConstruct",
			ariaLabel: "YouTube",
		},
	];

	const navLinks = [
		{ name: "Contact us", href: "/contactUs" },
		{ name: "About us", href: "/aboutUs" },
		{ name: "Privacy Policy", href: "/privacyPolicy" },
		{ name: "Terms of Service", href: "/t&c" },
	];

	const footerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<TooltipProvider delayDuration={300}>
			<motion.footer
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				variants={footerVariants}
				className="relative z-[1000] w-full"
			>
				{/* Top wave decoration */}
				<div className="w-full overflow-hidden h-12 relative">
					<svg
						className="absolute bottom-0 w-full h-24 fill-black/60"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
					>
						<path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
					</svg>
				</div>

				{/* Main footer content */}
				<div className="bg-gradient-to-b from-black/60 via-gray-900/80 to-black/80 backdrop-blur-sm text-white py-6 px-2 sm:px-4 lg:px-6">
					<div className="container mx-auto">
						{/* Desktop layout */}
						<div className="hidden lg:grid grid-cols-4 gap-8">
							{/* Company Info */}
							<motion.div
								variants={itemVariants}
								className="space-y-4"
							>
								<h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
									Team Talkeys
								</h3>
								<div className="space-y-3 text-gray-300">
									<div className="flex items-center gap-2">
										<MapPin
											size={16}
											className="text-purple-400 flex-shrink-0"
										/>
										<p className="text-sm">Patiala, Punjab, India</p>
									</div>
									<div className="flex items-center gap-2">
										<Phone
											size={16}
											className="text-purple-400 flex-shrink-0"
										/>
										<Link
											href="tel:+919888230798"
											className="text-sm hover:text-purple-300 transition-colors"
										>
											+91 9888230798
										</Link>
									</div>
									<div className="flex items-center gap-2">
										<Mail
											size={16}
											className="text-purple-400 flex-shrink-0"
										/>
										<Link
											href="mailto:talkeys11@gmail.com"
											className="text-sm hover:text-purple-300 transition-colors"
										>
											talkeys11@gmail.com
										</Link>
									</div>
								</div>
							</motion.div>

							{/* Logo and Social */}
							<motion.div
								variants={itemVariants}
								className="flex flex-col items-center space-y-6 col-span-2"
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 10,
									}}
									className="relative w-32 h-32"
								>
									<Image
										src={image || "/placeholder.svg"}
										alt="Talkeys Logo"
										layout="fill"
										objectFit="contain"
										priority
									/>
								</motion.div>

								<div className="flex space-x-6">
									{socialLinks.map((link) => (
										<Tooltip key={link.name}>
											<TooltipTrigger asChild>
												<motion.div
													onMouseEnter={() =>
														setHoveredIcon(link.name)
													}
													onMouseLeave={() => setHoveredIcon(null)}
													whileHover={{ y: -5 }}
													whileTap={{ scale: 0.9 }}
												>
													<Link
														href={link.href}
														className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
														aria-label={link.ariaLabel}
														target={
															link.href.startsWith("http")
																? "_blank"
																: undefined
														}
														rel={
															link.href.startsWith("http")
																? "noopener noreferrer"
																: undefined
														}
													>
														<motion.div
															animate={
																hoveredIcon === link.name
																	? { rotate: [0, 15, -15, 0] }
																	: {}
															}
															transition={{ duration: 0.5 }}
															className="text-2xl"
														>
															{link.icon}
														</motion.div>
													</Link>
												</motion.div>
											</TooltipTrigger>
											<TooltipContent
												side="top"
												className="bg-gray-900 border-purple-500/50"
											>
												<p>{link.name}</p>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
							</motion.div>

							{/* Quick Links */}
							<motion.div
								variants={itemVariants}
								className="space-y-4"
							>
								<h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
									Quick Links
								</h3>
								<ul className="space-y-2">
									{navLinks.map((link) => (
										<motion.li
											key={link.name}
											whileHover={{ x: 5 }}
										>
											<Link
												href={link.href}
												className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-1"
											>
												<span>{link.name}</span>
												<ExternalLink
													size={12}
													className="opacity-70"
												/>
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>
						</div>

						{/* Mobile layout */}
						<div className="lg:hidden space-y-8">
							{/* Logo and Social */}
							<motion.div
								variants={itemVariants}
								className="flex flex-col items-center space-y-4"
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 10,
									}}
									className="relative w-24 h-24"
								>
									<Image
										src={image || "/placeholder.svg"}
										alt="Talkeys Logo"
										layout="fill"
										objectFit="contain"
										priority
									/>
								</motion.div>

								<div className="flex space-x-6">
									{socialLinks.map((link) => (
										<motion.div
											key={link.name}
											whileHover={{ y: -3 }}
											whileTap={{ scale: 0.9 }}
										>
											<Link
												href={link.href}
												className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
												aria-label={link.ariaLabel}
												target={
													link.href.startsWith("http")
														? "_blank"
														: undefined
												}
												rel={
													link.href.startsWith("http")
														? "noopener noreferrer"
														: undefined
												}
											>
												<div className="text-2xl">{link.icon}</div>
											</Link>
										</motion.div>
									))}
								</div>
							</motion.div>

							{/* Accordion sections for mobile */}
							<div className="space-y-2">
								{/* Company Info Section */}
								<motion.div
									variants={itemVariants}
									className="border border-gray-800 rounded-lg overflow-hidden"
								>
									<Button
										variant="ghost"
										className="w-full flex justify-between items-center p-4 text-left"
										onClick={() => toggleSection("company")}
									>
										<span className="font-bold">Team Talkeys</span>
										<ChevronUp
											className={`transition-transform duration-300 ${
												expandedSection === "company"
													? "rotate-0"
													: "rotate-180"
											}`}
											size={16}
										/>
									</Button>

									<AnimatePresence>
										{expandedSection === "company" && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="px-4 pb-4 text-gray-300"
											>
												<div className="space-y-3">
													<div className="flex items-center gap-2">
														<MapPin
															size={16}
															className="text-purple-400 flex-shrink-0"
														/>
														<p className="text-sm">
															Patiala, Punjab, India
														</p>
													</div>
													<div className="flex items-center gap-2">
														<Phone
															size={16}
															className="text-purple-400 flex-shrink-0"
														/>
														<Link
															href="tel:+919888230798"
															className="text-sm hover:text-purple-300 transition-colors"
														>
															+91 9888230798
														</Link>
													</div>
													<div className="flex items-center gap-2">
														<Mail
															size={16}
															className="text-purple-400 flex-shrink-0"
														/>
														<Link
															href="mailto:talkeys11@gmail.com"
															className="text-sm hover:text-purple-300 transition-colors"
														>
															talkeys11@gmail.com
														</Link>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>

								{/* Quick Links Section */}
								<motion.div
									variants={itemVariants}
									className="border border-gray-800 rounded-lg overflow-hidden"
								>
									<Button
										variant="ghost"
										className="w-full flex justify-between items-center p-4 text-left"
										onClick={() => toggleSection("links")}
									>
										<span className="font-bold">Quick Links</span>
										<ChevronUp
											className={`transition-transform duration-300 ${
												expandedSection === "links"
													? "rotate-0"
													: "rotate-180"
											}`}
											size={16}
										/>
									</Button>

									<AnimatePresence>
										{expandedSection === "links" && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="px-4 pb-4"
											>
												<ul className="space-y-2">
													{navLinks.map((link) => (
														<motion.li
															key={link.name}
															whileHover={{ x: 5 }}
														>
															<Link
																href={link.href}
																className="text-gray-300 hover:text-purple-300 transition-colors flex items-center gap-1"
															>
																<span>{link.name}</span>
																<ExternalLink
																	size={12}
																	className="opacity-70"
																/>
															</Link>
														</motion.li>
													))}
												</ul>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							</div>
						</div>

						{/* Copyright section */}
						<motion.div
							variants={itemVariants}
							className="mt-12 pt-6 border-t border-gray-800 text-center"
						>
							<div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-400">
								<p>
									© {new Date().getFullYear()} Talkeys. All rights
									reserved.
								</p>
								<span className="hidden sm:inline">•</span>
								<motion.p
									className="flex items-center gap-1"
									whileHover={{ scale: 1.05 }}
								>
									Made with
									<motion.span
										animate={{ scale: [1, 1.2, 1] }}
										transition={{
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
											duration: 1.5,
										}}
									>
										<Heart
											size={14}
											className="text-red-500"
										/>
									</motion.span>
									By Team Talkeys
								</motion.p>
							</div>
						</motion.div>
					</div>
				</div>
			</motion.footer>
		</TooltipProvider>
	);
}
