"use client";

import EventCarousel from "@/components/EventCarousel";
import { useEffect, useState } from "react";
import type { Event } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function EventPage() {
	const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>(
		{},
	);
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchEvents() {
			setIsLoading(true);
			const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
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
			setIsLoading(false);
		}
		fetchEvents();
	}, []);

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
	}, [showPastEvents, allEvents]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="flex flex-col min-h-screen"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 1.05 }}
			>
				<div className="flex-grow py-36">
					<div className="px-10 mb-8">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
							<h1 className="text-white text-4xl">
								{showPastEvents ? "Past Events" : "Live Events"}
							</h1>

							<div className="flex items-center space-x-4">
								{/* <Label
									htmlFor="event-mode"
									className="text-white"
								>
									{showPastEvents
										? "Showing Past Events"
										: "Showing Live Events"}
								</Label> */}
								<button
									className="bg-gray-900 hover:bg-black duration-500 text-white font-bold py-1 px-3 rounded"
									onClick={() => setShowPastEvents(!showPastEvents)}
								>
									{showPastEvents ? "Switch to Live Events" : "Switch to Past Events"}
								</button>
							</div>
						</div>

						{isLoading ? (
							<div className="flex justify-center py-20">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
							</div>
						) : Object.keys(groupedEvents).length > 0 ? (
							<AnimatePresence mode="wait">
								<motion.div
									key={showPastEvents ? "past" : "live"}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
								>
									{Object.entries(groupedEvents).map(
										([category, ev]) => (
											<EventCarousel
												key={category}
												category={category}
												ev={ev}
											/>
										),
									)}
								</motion.div>
							</AnimatePresence>
						) : (
							<p className="text-gray-400">
								No {showPastEvents ? "past" : "live"} events available.
							</p>
						)}
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default EventPage;
