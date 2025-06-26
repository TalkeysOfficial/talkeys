"use client";

import { useState, useEffect, useRef } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
} from "framer-motion";
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
	Users,
	MessageSquare,
	Globe,
	Zap,
	Bell,
	Shield,
	Calendar,
	Heart,
	HelpCircle,
	ChevronRight,
	CheckCircle,
	Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import communityImage from "@/public/images/community.png";

export default function ExploreCommunities() {
	const [activeSection, setActiveSection] = useState<string | null>(
		"what-are-communities",
	);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [activeMobileTab, setActiveMobileTab] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
	const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

	// Define which sections are in the main tab view vs card view
	const mainTabSections = [
		"what-are-communities",
		"community-features",
		"community-types",
		"community-guidelines",
	];
	const cardSections = ["launch-timeline", "stay-updated", "faq"];

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

	// Handle section activation to prevent duplication
	const handleSectionChange = (sectionId: string) => {
		// If clicking a section that's already active, deactivate it
		if (activeSection === sectionId) {
			setActiveSection(null);
			setActiveMobileTab(0); // Reset mobile tab to first tab
			return;
		}

		// Set the new active section
		setActiveSection(sectionId);

		// Update mobile tab index if it's a main tab section
		const tabIndex = sections.findIndex(
			(section) => section.id === sectionId,
		);
		if (tabIndex !== -1) {
			setActiveMobileTab(tabIndex);
		}
	};

	const sections = [
		{
			id: "what-are-communities",
			title: "What are Talkeys Communities?",
			icon: <Users className="h-5 w-5" />,
			description: "Understanding the concept of communities",
			content: (
				<div className="space-y-4">
					<p>
						Talkeys Communities are dedicated spaces where people with
						shared interests, passions, or goals can connect, interact,
						and build relationships. These digital gathering places are
						designed to bring together like-minded individuals from around
						the world, creating vibrant ecosystems of engagement and
						collaboration.
					</p>
					<p>
						Each community on Talkeys will be centered around a specific
						interest, hobby, genre, or topic - from music genres and
						artistic pursuits to professional fields and lifestyle
						choices. Within these communities, members will be able to
						share content, discuss ideas, organize events, and form
						meaningful connections.
					</p>
					<p>
						Our communities feature is currently under development and
						will be launched soon, bringing a new dimension to how you
						connect with others who share your interests on Talkeys.
					</p>
				</div>
			),
		},
		{
			id: "community-features",
			title: "Upcoming Features",
			icon: <Zap className="h-5 w-5" />,
			description: "What to expect from our communities",
			content: (
				<div className="space-y-4">
					<p>
						When our Communities feature launches, you can look forward to
						a rich set of tools and capabilities designed to enhance your
						experience:
					</p>
					<ul className="space-y-2 list-disc pl-5">
						<li>
							<span className="font-medium">Discussion Forums:</span>{" "}
							Engage in threaded conversations about topics that matter
							to your community
						</li>
						<li>
							<span className="font-medium">Live Chat Rooms:</span>{" "}
							Connect in real-time with community members through
							text-based chat
						</li>
						<li>
							<span className="font-medium">Content Sharing:</span> Share
							photos, videos, links, and other media relevant to your
							community's interests
						</li>
						<li>
							<span className="font-medium">Event Organization:</span>{" "}
							Create, promote, and manage community events, both virtual
							and in-person
						</li>
						<li>
							<span className="font-medium">Community Polls:</span>{" "}
							Gather opinions and make collective decisions through
							built-in polling
						</li>
						<li>
							<span className="font-medium">Resource Libraries:</span>{" "}
							Access and contribute to collections of valuable resources
							for your community
						</li>
						<li>
							<span className="font-medium">Member Profiles:</span>{" "}
							Customize your presence within each community you join
						</li>
					</ul>
					<p>
						These features are being carefully designed to create
						engaging, interactive, and valuable community experiences for
						all Talkeys users.
					</p>
				</div>
			),
		},
		{
			id: "community-types",
			title: "Types of Communities",
			icon: <Globe className="h-5 w-5" />,
			description: "Diverse communities for every interest",
			content: (
				<div className="space-y-4">
					<p>
						Talkeys will host a wide variety of community types to cater
						to diverse interests and needs:
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
						<div className="bg-gray-800/50 p-4 rounded-lg">
							<h4 className="font-semibold text-purple-300 mb-2 flex items-center">
								<MessageSquare className="h-4 w-4 mr-2" />{" "}
								Interest-Based
							</h4>
							<p className="text-sm">
								Communities centered around hobbies, activities, and
								subjects like photography, cooking, gaming, literature,
								and more.
							</p>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg">
							<h4 className="font-semibold text-purple-300 mb-2 flex items-center">
								<Heart className="h-4 w-4 mr-2" /> Fan Communities
							</h4>
							<p className="text-sm">
								Spaces for fans of artists, bands, celebrities, sports
								teams, TV shows, movies, and other entertainment.
							</p>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg">
							<h4 className="font-semibold text-purple-300 mb-2 flex items-center">
								<Calendar className="h-4 w-4 mr-2" /> Event-Focused
							</h4>
							<p className="text-sm">
								Communities built around specific events, festivals,
								conferences, or recurring gatherings.
							</p>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg">
							<h4 className="font-semibold text-purple-300 mb-2 flex items-center">
								<Users className="h-4 w-4 mr-2" /> Local Communities
							</h4>
							<p className="text-sm">
								Geographically-based groups connecting people in the
								same city, neighborhood, or region.
							</p>
						</div>
					</div>
					<p className="mt-4">
						Each community type will have customized features and layouts
						designed to best serve its specific purpose and audience.
					</p>
				</div>
			),
		},
		{
			id: "community-guidelines",
			title: "Community Guidelines",
			icon: <Shield className="h-5 w-5" />,
			description: "Creating safe and inclusive spaces",
			content: (
				<div className="space-y-4">
					<p>
						At Talkeys, we're committed to creating safe, inclusive, and
						positive community spaces. Our comprehensive Community
						Guidelines will ensure that all members can participate
						comfortably and respectfully.
					</p>
					<div className="space-y-3 mt-4">
						<div className="flex items-start gap-3">
							<div className="bg-purple-600/30 p-2 rounded-full flex-shrink-0">
								<Shield className="h-4 w-4 text-purple-300" />
							</div>
							<div>
								<h4 className="font-medium text-white">
									Respect and Inclusivity
								</h4>
								<p className="text-sm text-gray-300">
									All community members are expected to treat others
									with respect, regardless of background, identity, or
									beliefs.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="bg-purple-600/30 p-2 rounded-full flex-shrink-0">
								<Shield className="h-4 w-4 text-purple-300" />
							</div>
							<div>
								<h4 className="font-medium text-white">
									Content Moderation
								</h4>
								<p className="text-sm text-gray-300">
									Clear standards for appropriate content, with
									community moderators and automated tools to maintain
									these standards.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="bg-purple-600/30 p-2 rounded-full flex-shrink-0">
								<Shield className="h-4 w-4 text-purple-300" />
							</div>
							<div>
								<h4 className="font-medium text-white">
									Anti-Harassment Policies
								</h4>
								<p className="text-sm text-gray-300">
									Zero tolerance for harassment, hate speech, bullying,
									or threatening behavior.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="bg-purple-600/30 p-2 rounded-full flex-shrink-0">
								<Shield className="h-4 w-4 text-purple-300" />
							</div>
							<div>
								<h4 className="font-medium text-white">
									Privacy Protections
								</h4>
								<p className="text-sm text-gray-300">
									Robust privacy controls allowing users to manage
									their visibility and data within communities.
								</p>
							</div>
						</div>
					</div>
					<p className="mt-4">
						These guidelines will be regularly updated based on community
						feedback and evolving best practices to ensure Talkeys remains
						a positive platform for connection and collaboration.
					</p>
				</div>
			),
		},
		{
			id: "launch-timeline",
			title: "Launch Timeline",
			icon: <Calendar className="h-5 w-5" />,
			description: "When to expect our communities feature",
			content: (
				<div className="space-y-4">
					<p>
						We're working diligently to bring the Communities feature to
						Talkeys. Here's our current development timeline:
					</p>

					<div className="mt-6 space-y-6">
						<div className="flex flex-col sm:flex-row gap-4 items-start">
							<div className="flex-shrink-0 bg-purple-600 rounded-full p-3 flex items-center justify-center">
								<CheckCircle className="h-5 w-5 text-white" />
							</div>
							<div>
								<div className="flex items-center">
									<h4 className="font-bold text-white text-lg">
										Phase 1: Design and Planning
									</h4>
									<span className="ml-3 px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
										Completed
									</span>
								</div>
								<p className="mt-2 text-gray-300">
									We've finalized the core design, feature set, and
									technical architecture for Communities. This phase
									included extensive user research, competitive
									analysis, and prototyping to ensure we're building
									the right solution.
								</p>
								<ul className="mt-2 space-y-1 text-sm text-gray-400">
									<li className="flex items-center">
										<CheckCircle className="h-3 w-3 mr-2 text-purple-400" />
										User research and needs analysis
									</li>
									<li className="flex items-center">
										<CheckCircle className="h-3 w-3 mr-2 text-purple-400" />
										Feature prioritization
									</li>
									<li className="flex items-center">
										<CheckCircle className="h-3 w-3 mr-2 text-purple-400" />
										Technical architecture design
									</li>
								</ul>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 items-start">
							<div className="flex-shrink-0 bg-purple-600 rounded-full p-3 flex items-center justify-center">
								<Clock className="h-5 w-5 text-white" />
							</div>
							<div>
								<div className="flex items-center">
									<h4 className="font-bold text-white text-lg">
										Phase 2: Development
									</h4>
									<span className="ml-3 px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
										In Progress
									</span>
								</div>
								<p className="mt-2 text-gray-300">
									Our engineering team is currently building the
									Communities feature, implementing the core
									functionality and user interface. We're focusing on
									creating a seamless, intuitive experience.
								</p>
								<div className="mt-3 w-full bg-gray-700 rounded-full h-2.5">
									<div
										className="bg-purple-600 h-2.5 rounded-full"
										style={{ width: "65%" }}
									></div>
								</div>
								<p className="text-right text-xs text-gray-400 mt-1">
									65% complete
								</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 items-start">
							<div className="flex-shrink-0 bg-gray-700 rounded-full p-3 flex items-center justify-center">
								<Users className="h-5 w-5 text-gray-400" />
							</div>
							<div>
								<div className="flex items-center">
									<h4 className="font-bold text-white text-lg">
										Phase 3: Beta Testing
									</h4>
									<span className="ml-3 px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
										Q2 2025
									</span>
								</div>
								<p className="mt-2 text-gray-300">
									Limited release to select users for feedback and
									refinement. This phase will help us identify any
									issues and make improvements before the public
									launch.
								</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 items-start">
							<div className="flex-shrink-0 bg-gray-700 rounded-full p-3 flex items-center justify-center">
								<Globe className="h-5 w-5 text-gray-400" />
							</div>
							<div>
								<div className="flex items-center">
									<h4 className="font-bold text-white text-lg">
										Phase 4: Public Launch
									</h4>
									<span className="ml-3 px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
										Q3 2025
									</span>
								</div>
								<p className="mt-2 text-gray-300">
									Full release of the Communities feature to all
									Talkeys users, with ongoing updates and improvements
									based on user feedback.
								</p>
							</div>
						</div>
					</div>

					<p className="mt-6 text-sm text-gray-400 italic">
						This timeline is subject to change as development progresses.
						We're committed to delivering a high-quality experience rather
						than rushing to meet specific dates.
					</p>
				</div>
			),
		},
		{
			id: "stay-updated",
			title: "Stay Updated",
			icon: <Bell className="h-5 w-5" />,
			description: "How to get notified when communities launch",
			content: (
				<div className="space-y-4">
					<p>
						Want to be among the first to know when Talkeys Communities
						launches? Here's how you can stay informed:
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
							<h4 className="font-semibold text-purple-300 mb-2">
								Follow Our Social Media
							</h4>
							<p className="text-sm mb-4">
								We regularly post updates, sneak peeks, and
								announcements on our social media channels.
							</p>
							<div className="mt-auto">
								<Link
									href="https://www.instagram.com/talkeys_?igsh=MWsxZHk0bTQyYmlyag=="
									className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
								>
									Follow us on Instagram
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
							<h4 className="font-semibold text-purple-300 mb-2">
								Join Our Mailing List
							</h4>
							<p className="text-sm mb-4">
								Subscribe to our newsletter to receive direct updates
								about Communities and other Talkeys features.
							</p>
							<div className="mt-auto">
								<Link
									href="/contactUs"
									className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
								>
									Contact us to subscribe
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
							<h4 className="font-semibold text-purple-300 mb-2">
								Beta Testing Program
							</h4>
							<p className="text-sm mb-4">
								Sign up for our beta testing program for a chance to try
								Communities before the public launch.
							</p>
							<div className="mt-auto">
								<Link
									href="/contactUs"
									className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
								>
									Express interest in beta testing
									<ChevronRight className="ml-1 h-4 w-4" />
								</Link>
							</div>
						</div>
						<div className="bg-gray-800/50 p-4 rounded-lg flex flex-col h-full">
							<h4 className="font-semibold text-purple-300 mb-2">
								Check This Page
							</h4>
							<p className="text-sm mb-4">
								We'll update this page with the latest information about
								our Communities feature as development progresses.
							</p>
							<div className="mt-auto">
								<span className="text-sm text-gray-400">
									Bookmark this page for easy access
								</span>
							</div>
						</div>
					</div>
				</div>
			),
		},
		{
			id: "faq",
			title: "Frequently Asked Questions",
			icon: <HelpCircle className="h-5 w-5" />,
			description: "Common questions about communities",
			content: (
				<div className="space-y-6">
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							Will communities be free to join?
						</h4>
						<p>
							Yes, basic community membership will be free for all
							Talkeys users. Some communities may offer premium features
							or content in the future, but the core functionality will
							always be accessible without charge.
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							Can I create my own community?
						</h4>
						<p>
							Yes! Once the feature launches, users will be able to
							create and manage their own communities around topics
							they're passionate about, subject to our community
							guidelines.
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							How will community moderation work?
						</h4>
						<p>
							Communities will be moderated by a combination of community
							creators, appointed moderators, automated tools, and
							Talkeys staff oversight to ensure a positive environment
							for all members.
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							Will there be private communities?
						</h4>
						<p>
							Yes, community creators will have options to make their
							communities public, private (invitation-only), or unlisted
							(discoverable only with a direct link).
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							How will communities integrate with events?
						</h4>
						<p>
							Communities will have built-in tools to create, promote,
							and manage events specifically for their members, with
							seamless integration to the main Talkeys events platform.
						</p>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold text-white">
							Can I suggest features for communities?
						</h4>
						<p>
							We welcome user input on the Communities feature. You can
							share your ideas and suggestions through our{" "}
							<Link
								href="/contactUs"
								className="text-purple-400 hover:text-purple-300"
							>
								Contact Us
							</Link>{" "}
							page.
						</p>
					</div>
				</div>
			),
		},
	];

	// Mobile tab navigation
	const handleMobileTabChange = (index: number) => {
		const newSection = sections[index].id;

		// If selecting a card section that's already active, deactivate it
		if (cardSections.includes(newSection) && activeSection === newSection) {
			setActiveSection(null);
			setActiveMobileTab(0); // Reset to first tab
			return;
		}

		setActiveMobileTab(index);
		setActiveSection(newSection);
	};

	// Check if a section should be shown in the main content area
	const shouldShowInMainContent = (sectionId: string) => {
		// Only show in main content if it's a main tab section AND it's the active section
		return mainTabSections.includes(sectionId) && activeSection === sectionId;
	};

	// Check if a card should be expanded
	const isCardExpanded = (sectionId: string) => {
		// Only expand if it's a card section AND it's the active section
		return cardSections.includes(sectionId) && activeSection === sectionId;
	};

	return (
		<div
			ref={containerRef}
			className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white"
		>
			{/* Main content */}
			<div className="relative z-10 container mx-auto px-4 py-12 pt-24 md:py-24 md:pt-32">
				<motion.div
					style={{ opacity: headerOpacity, scale: headerScale }}
					className="text-center mb-12"
				>
					<motion.h1
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-500">
							Explore Communities
						</span>
					</motion.h1>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.4 }}
						className="w-20 h-1 bg-gradient-to-r from-purple-500 to-purple-300 mx-auto mb-6 rounded-full"
					/>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
					>
						Connect with like-minded people, share your passions, and
						build meaningful relationships in our upcoming communities
						feature.
					</motion.p>
				</motion.div>

				{/* Mobile tab navigation - visible only on small screens */}
				<div className="md:hidden mb-6 overflow-x-auto no-scrollbar">
					<div className="flex space-x-2 pb-2">
						{sections.map((section, index) => (
							<Button
								key={section.id}
								variant="ghost"
								size="sm"
								className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 ${
									activeMobileTab === index
										? "bg-purple-900/30 text-white border border-purple-500/30"
										: "text-gray-400 border border-transparent"
								} rounded-full`}
								onClick={() => handleMobileTabChange(index)}
							>
								{section.icon}
								<span className="text-xs">{section.title}</span>
							</Button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-6"
					>
						<div className="bg-gradient-to-br from-gray-900/80 to-purple-900/30 p-5 rounded-xl border border-purple-500/20">
							<p className="mb-3">
								<span className="text-purple-300 font-semibold">
									Coming Soon:
								</span>{" "}
								We're excited to announce that Talkeys Communities is
								currently under development and will be launching in the
								near future.
							</p>
							<p className="mb-3">
								Our Communities feature will transform how you connect
								with others who share your interests, passions, and
								goals. Whether you're a music enthusiast, an art lover,
								a sports fan, or part of any other interest group,
								you'll soon have a dedicated space to engage, share, and
								grow together.
							</p>
							<p>
								While we put the finishing touches on this exciting new
								feature, we invite you to explore this page to learn
								more about what's coming and how you can stay updated on
								our progress.
							</p>
						</div>

						{/* Section tabs - hidden on mobile */}
						<div className="hidden md:block bg-black/40 backdrop-blur-sm rounded-xl border border-purple-900/30 overflow-hidden">
							<div className="flex overflow-x-auto no-scrollbar">
								{sections
									.filter((section) =>
										mainTabSections.includes(section.id),
									)
									.map((section) => (
										<Button
											key={section.id}
											variant="ghost"
											className={`flex items-center gap-2 px-4 py-3 rounded-none border-b-2 transition-all ${
												activeSection === section.id
													? "border-purple-500 text-white bg-purple-900/20"
													: "border-transparent text-gray-400 hover:text-white hover:bg-purple-900/10"
											}`}
											onClick={() => handleSectionChange(section.id)}
										>
											{section.icon}
											<span className="whitespace-nowrap text-sm">
												{section.title}
											</span>
										</Button>
									))}
							</div>

							<div className="p-5">
								<AnimatePresence mode="wait">
									{sections.map(
										(section) =>
											shouldShowInMainContent(section.id) && (
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
													<div className="text-gray-300">
														{section.content}
													</div>
												</motion.div>
											),
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex flex-col items-center gap-6"
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
										src={communityImage || "/placeholder.svg"}
										alt="Communities"
										layout="fill"
										objectFit="contain"
										priority
										className="p-4"
									/>
								</motion.div>
							</CardContent>
						</Card>

						{/* Content for mobile view */}
						<div className="md:hidden w-full">
							{activeSection && (
								<div className="bg-black/40 backdrop-blur-sm rounded-xl border border-purple-900/30 p-5">
									<div className="flex items-center gap-3 mb-4">
										<div className="bg-purple-600 p-2 rounded-full">
											{
												sections.find((s) => s.id === activeSection)
													?.icon
											}
										</div>
										<h3 className="text-xl font-bold">
											{
												sections.find((s) => s.id === activeSection)
													?.title
											}
										</h3>
									</div>
									<div className="text-gray-300">
										{
											sections.find((s) => s.id === activeSection)
												?.content
										}
									</div>
								</div>
							)}
						</div>

						{/* Additional sections in cards - visible on all screens */}
						<div className="space-y-5 w-full">
							{sections
								.filter((section) => cardSections.includes(section.id))
								.map((section) => (
									<motion.div
										key={section.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1, duration: 0.5 }}
									>
										<Card
											className={`border border-purple-900/30 ${
												isCardExpanded(section.id)
													? "bg-gradient-to-br from-gray-900 to-purple-950/50"
													: "bg-black/40"
											} backdrop-blur-sm transition-all duration-300 overflow-hidden`}
										>
											<CardHeader
												className="cursor-pointer relative z-10 p-5"
												onClick={() =>
													handleSectionChange(section.id)
												}
											>
												<div className="flex items-center gap-4">
													<motion.div
														className={`flex items-center justify-center h-10 w-10 rounded-full ${
															isCardExpanded(section.id)
																? "bg-purple-600"
																: "bg-gray-800"
														} transition-colors duration-300`}
														whileHover={{ scale: 1.05 }}
														transition={{
															type: "spring",
															stiffness: 400,
															damping: 10,
														}}
													>
														{section.icon}
													</motion.div>
													<div className="flex-1">
														<CardTitle className="text-lg md:text-xl text-white">
															{section.title}
														</CardTitle>
														<CardDescription className="text-gray-400 text-sm">
															{section.description}
														</CardDescription>
													</div>
													<motion.div
														animate={{
															rotate: isCardExpanded(section.id)
																? 180
																: 0,
														}}
														transition={{ duration: 0.3 }}
														className={`h-8 w-8 rounded-full flex items-center justify-center ${
															isCardExpanded(section.id)
																? "bg-purple-600 text-white"
																: "bg-gray-800 text-gray-400"
														}`}
													>
														<ChevronDown className="h-5 w-5" />
													</motion.div>
												</div>
											</CardHeader>

											<AnimatePresence>
												{isCardExpanded(section.id) && (
													<motion.div
														initial={{ height: 0, opacity: 0 }}
														animate={{
															height: "auto",
															opacity: 1,
														}}
														exit={{ height: 0, opacity: 0 }}
														transition={{
															duration: 0.4,
															ease: [0.04, 0.62, 0.23, 0.98],
														}}
													>
														<CardContent className="text-gray-300 pb-5 relative">
															{/* Decorative elements */}
															<div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>

															{/* Content */}
															<motion.div
																initial={{ opacity: 0, y: 10 }}
																animate={{ opacity: 1, y: 0 }}
																transition={{
																	duration: 0.3,
																	delay: 0.2,
																}}
																className="pl-6 sm:pl-14"
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
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8, duration: 0.6 }}
					className="mt-12 text-center"
				>
					<div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm border border-purple-900/30">
						<p className="mb-3 text-gray-300">
							Thank you for your interest in Talkeys Communities. We're
							working hard to create a space where you can connect with
							others who share your passions and interests.
						</p>
						<p className="text-gray-400">Stay tuned for updates!</p>
					</div>
				</motion.div>
			</div>

			{/* Scroll to top button */}
			<AnimatePresence>
				{scrollPosition > 300 && (
					<motion.div
						className="fixed bottom-6 right-6 z-50"
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
							<ChevronUp className="h-5 w-5" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
