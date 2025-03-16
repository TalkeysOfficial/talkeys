"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCarousel from "@/components/EventCarousel";
import PageHeader from "@/components/ui/shared/PageHeader";

function EventPage() {
	const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>(
		{},
	);
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	useEffect(() => {
		async function fetchEvents() {
			setIsLoading(true);
			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEvents`,
				);
				const { data } = (await response.json()) as {
					data: {
						events: Event[];
					};
				};
				const { events } = data;

				events.forEach((event) => {
					event.isLiked = false;
				});

				try {
					const res = await fetch(
						`${process.env.BACKEND_URL}/getAllLikedEvents`,
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									"accessToken",
								)}`,
							},
						},
					);

					if (res.status !== 404 && res.status !== 401) {
						const resData = await res.json();
						events.forEach((event) => {
							if (resData.likedEvents?.includes(event._id)) {
								event.isLiked = true;
							}
						});
					}
				} catch (error) {
					console.error("Error fetching liked events:", error);
				}

				setAllEvents(events);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchEvents();
	}, []);

	// Memoize filtered events to prevent unnecessary re-renders
	useEffect(() => {
		// Filter events based on the toggle state
		const filteredEvents = allEvents.filter((event) =>
			showPastEvents ? !event.isLive : event.isLive,
		);

		// Group the filtered events by category
		const grouped = filteredEvents.reduce(
			(acc: Record<string, Event[]>, ev) => {
				if (!acc[ev.category]) {
					acc[ev.category] = [];
				}
				acc[ev.category].push(ev);
				return acc;
			},
			{},
		);

		setGroupedEvents(grouped);
		setActiveCategory(null);
	}, [showPastEvents, allEvents]);

	const categories = Object.keys(groupedEvents);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
		exit: { opacity: 0 },
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
		exit: { y: -20, opacity: 0 },
	};

	// Toggle button for switching between live and past events
	const toggleButton = (
		<Button
			variant="outline"
			className="bg-gray-900 hover:bg-black hover:text-white duration-300 text-white font-medium py-2 px-4 rounded-lg border border-purple-500"
			onClick={() => setShowPastEvents(!showPastEvents)}
		>
			{showPastEvents ? "Switch to Live Events" : "Switch to Past Events"}
		</Button>
	);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="flex flex-col min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
				<PageHeader
					title={showPastEvents ? "Past Events" : "Live Events"}
					rightContent={toggleButton}
				/>

				{categories.length > 1 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.3 }}
						className="mb-6"
					>
						<Tabs
							defaultValue="all"
							className="w-full"
						>
							<TabsList className="p-1 rounded-lg overflow-x-auto flex w-full max-w-full no-scrollbar">
								<TabsTrigger
									value="all"
									onClick={() => setActiveCategory(null)}
									className="data-[state=active]:bg-purple-600 text-white"
								>
									All Categories
								</TabsTrigger>
								{categories.map((category) => (
									<TabsTrigger
										key={category}
										value={category}
										onClick={() => setActiveCategory(category)}
										className="data-[state=active]:bg-purple-600 text-white"
									>
										{category}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</motion.div>
				)}

				{isLoading ? (
					<div className="flex justify-center py-20">
						<motion.div
							className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					</div>
				) : Object.keys(groupedEvents).length > 0 ? (
					<AnimatePresence mode="wait">
						<motion.div
							key={showPastEvents ? "past" : "live"}
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{activeCategory ? (
								<motion.div
									key={activeCategory}
									variants={itemVariants}
								>
									<EventCarousel
										category={activeCategory}
										ev={groupedEvents[activeCategory]}
									/>
								</motion.div>
							) : (
								Object.entries(groupedEvents).map(([category, ev]) => (
									<motion.div
										key={category}
										variants={itemVariants}
									>
										<EventCarousel
											category={category}
											ev={ev}
										/>
									</motion.div>
								))
							)}
						</motion.div>
					</AnimatePresence>
				) : (
					<motion.p
						className="text-gray-400 text-center py-12 text-lg"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						No {showPastEvents ? "past" : "live"} events available.
					</motion.p>
				)}
			</motion.div>
		</AnimatePresence>
	);
}

export default EventPage;
