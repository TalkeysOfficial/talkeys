"use client";

import "@/app/t&c/terms.css";

import { useState, useEffect, useRef } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";
import { urbanist } from "@/components/fonts/fonts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ChevronUp,
	ChevronDown,
	FileText,
	Shield,
	Users,
	FileCode,
	Calendar,
	Copyright,
	Lock,
	AlertTriangle,
	AlertCircle,
	XCircle,
	RefreshCw,
	Mail,
	IndianRupee
} from "lucide-react";

export default function TermsPage() {
	const [activeSection, setActiveSection] = useState<string | null>(null);
	const [scrollPosition, setScrollPosition] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
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

	const sections = [
		{
			id: "introduction",
			title: "1. Introduction",
			icon: <FileText className="h-5 w-5" />,
			description: "Platform overview and terms acceptance",
			content: (
				<>
					<p className="mb-4">
						Talkeys is a platform that connects people through communities
						and events. Our mission is to help users discover, engage, and
						participate in various communities while offering a space for
						event creators to host their events with a global audience.
						These Terms of Service govern your use of our platform. By
						using Talkeys, you agree to comply with these terms. If you
						don't agree, please refrain from using our services.
					</p>
					<p>
						Note: Talkeys is solely a ticketing platform. We do not
						organize or manage events listed on our platform.
					</p>
				</>
			),
		},
		{
			id: "eligibility",
			title: "2. Eligibility",
			icon: <Shield className="h-5 w-5" />,
			description: "Age requirements and account responsibilities",
			content: (
				<>
					<p className="mb-4">
						To use Talkeys, you must be at least 13 years old (or older,
						depending on your local laws). By using the platform, you
						represent that you are legally permitted to use Talkeys and
						are responsible for complying with all applicable laws and
						regulations.
					</p>
					<p className="mb-4">
						To access certain features of Talkeys, you'll need to create
						an account. When you sign up, please provide accurate
						information and keep your account secure. You are responsible
						for all activity that happens through your account, so please
						choose a strong password and keep it private.
					</p>
					<p>
						We reserve the right to suspend or terminate your account if
						we detect any breach of these terms.
					</p>
				</>
			),
		},
		{
			id: "community",
			title: "3. Community Guidelines",
			icon: <Users className="h-5 w-5" />,
			description: "Rules for positive community interaction",
			content: (
				<>
					<p className="mb-4">
						We believe in fostering a positive and respectful environment
						for all users. As such, when participating in community chats,
						forums, or events, please abide by the following guidelines:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>
							Respect others. No harassment, hate speech, or abusive
							behavior will be tolerated.
						</li>
						<li>
							Keep it legal. Don't share any illegal content or engage in
							illegal activities.
						</li>
						<li>
							No spamming. Refrain from unsolicited promotions,
							advertising, or irrelevant content.
						</li>
						<li>
							Any violation of these guidelines may result in a
							suspension or ban from Talkeys.
						</li>
					</ul>
				</>
			),
		},
		{
			id: "content",
			title: "4. User-Generated Content",
			icon: <FileCode className="h-5 w-5" />,
			description: "Content ownership and platform rights",
			content: (
				<p>
					At Talkeys, you have the opportunity to create and share content
					(e.g., messages, event listings, posts). By doing so, you retain
					ownership of your content, but you also grant a license to use,
					display, and promote it on our platform. We are not responsible
					for the content shared by users, but we reserve the right to
					remove any content that violates these terms or our community
					guidelines.
				</p>
			),
		},
		{
			id: "events",
			title: "5. Event Hosting",
			icon: <Calendar className="h-5 w-5" />,
			description: "Event creation and hosting responsibilities",
			content: (
				<>
					<p className="mb-4">
						One of the most exciting features of Talkeys is the ability to
						create and host events. As an event host, you are responsible
						for the accuracy and content of your event listing. Please
						ensure your event follows our guidelines and complies with all
						applicable laws.
					</p>
					<p>
						Important: Talkeys does not promote alcohol consumption or
						endorse any specific activities at events. We solely provide a
						ticketing platform to connect users with events.
					</p>
				</>
			),
		},
		{
			id: "ip",
			title: "6. Intellectual Property",
			icon: <Copyright className="h-5 w-5" />,
			description: "Copyright and intellectual property rights",
			content: (
				<p>
					All content, design, branding, and features on Talkeys are the
					intellectual property of Talkeys or our licensors. You may not
					copy, reproduce, or distribute any part of Talkeys without our
					permission.<br></br>
					That said, any content you create on Talkeys remains yours, and
					we're excited to see what you build!
				</p>
			),
		},
		{
			id: "privacy",
			title: "7. Privacy",
			icon: <Lock className="h-5 w-5" />,
			description: "Data collection and privacy practices",
			content: (
				<p>
					Your privacy is incredibly important to us. Please refer to our
					Privacy Policy for details on how we collect, store, and use your
					personal data.
				</p>
			),
		},
		{
			id: "prohibited",
			title: "8. Prohibited Activities",
			icon: <AlertTriangle className="h-5 w-5" />,
			description: "Activities not allowed on the platform",
			content: (
				<>
					<p className="mb-4">
						We are committed to creating a safe, enjoyable experience for
						everyone. Certain behaviors are strictly prohibited on
						Talkeys, including:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>
							Engaging in unlawful activities or promoting illegal
							content.
						</li>
						<li>Using the platform for fraudulent purposes.</li>
						<li>
							Sharing offensive, obscene, or otherwise inappropriate
							content.
						</li>
						<li>
							Impersonating others or misrepresenting your identity.
						</li>
					</ul>
					<p>
						Failure to comply may result in account suspension or
						termination.
					</p>
				</>
			),
		},
		{
			id: "liability",
			title: "9. Liability Disclaimer",
			icon: <AlertCircle className="h-5 w-5" />,
			description: "Platform limitations and user responsibilities",
			content: (
				<>
					<p className="mb-4">
						While we strive to provide the best possible experience on
						Talkeys, we do not guarantee that everything will always
						function perfectly. We are not responsible for:
					</p>
					<ul className="list-disc pl-6 space-y-2 mb-4">
						<li>Downtime, interruptions, or data loss.</li>
						<li>
							Any issues arising from user-generated content or
							third-party events.
						</li>
						<li>
							The success or outcome of any event hosted on our platform.
						</li>
					</ul>
					<p>You use Talkeys at your own risk.</p>
				</>
			),
		},
		{
			id: "termination",
			title: "10. Termination of Services",
			icon: <XCircle className="h-5 w-5" />,
			description: "Account closure and termination policies",
			content: (
				<p>
					You may close your account at any time. We also reserve the right
					to terminate or suspend accounts that violate our terms or pose
					risks to the community. We will notify you if your account is at
					risk of termination unless you've engaged in serious violations
					that require immediate action.
				</p>
			),
		},
		{
			id: "changes",
			title: "11. Changes to the Terms",
			icon: <RefreshCw className="h-5 w-5" />,
			description: "Updates to terms and notification process",
			content: (
				<p>
					We may update these terms periodically. If we make changes, we
					will notify you through the platform or via email. Your continued
					use of Talkeys following any changes means that you accept the
					new terms.
				</p>
			),
		},
		{
			id: "refund",
			title: "12. Refund Policy",
			icon: <IndianRupee className="h-5 w-5" />,
			description: "Our refund policy",
			content: (
				<>
				<p>Talkeys serves solely as a ticketing platform and does not directly manage or organize the events listed on the platform. As such, the refund policy for each event is determined by the individual event organizer. Talkeys does not guarantee refunds for ticket purchases.
				</p>
				<p>Users are advised to review the specific event's refund terms prior to completing a booking. If an event is canceled or rescheduled, any refund (partial or full) will be subject to the event organizer’s refund guidelines.
				</p>
				<p>Talkeys will facilitate the refund process only as per instructions received from the event organizer and is not liable for the outcome of refund claims.</p>
				<p>
				For refund-related inquiries, please contact the respective event organizer directly. In case of technical issues related to payment processing, users can reach out to Talkeys at:<br></br> talkeys11@gmail.com.</p>
				</>
			),
		},
		{
			id: "contact",
			title: "13. Contact Us",
			icon: <Mail className="h-5 w-5" />,
			description: "How to reach our support team",
			content: (
				<p>
					If you have any questions about these Terms of Service, please
					contact us at: Talkeys@gmail.com
				</p>
			),
		},
	];

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
					initial={{ y: -30, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.8 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-500">
							Terms of Service
						</span>
					</h1>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-300 mx-auto mb-8 rounded-full"
					/>
					<p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
						Welcome to Talkeys! Before you dive in, it's important to
						understand the terms and conditions under which we operate. By
						using Talkeys, you agree to the following terms. Let's work
						together to make this platform a great space for everyone.
					</p>
				</motion.div>

				{/* Terms sections */}
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
											{/* Card title is now explicitly white */}
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
							Thank you for being a part of the Talkeys community. We
							can't wait to see what you create, and we're thrilled to
							have you on board!
						</p>
						<p className="text-gray-400">
							Sincerely,
							<br />
							<span className="text-purple-400 font-semibold">
								Team Talkeys
							</span>
						</p>
					</div>
				</motion.div>
			</div>

			{/* Enhanced Scroll to top button with smoother animation */}
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
