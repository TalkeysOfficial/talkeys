"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useEvents } from "@/lib/hooks/useEvent";
import { groupEventsByCategory } from "@/lib/utils/eventUtils";
import PageHeader from "@/components/ui/shared/PageHeader";
import EventCarousel from "@/components/EventCarousel";
import { EventToggleButton } from "@/components/Events/EventToggleButton";
import { CategoryTabs } from "@/components/Events/CategoryTabs";

export default function EventPage() {
	const { allEvents, isLoading } = useEvents();
	const [showPastEvents, setShowPastEvents] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);

	const groupedEvents = groupEventsByCategory(allEvents, showPastEvents);
	const categories = Object.keys(groupedEvents);

	useEffect(() => setActiveCategory(null), [showPastEvents, allEvents]);

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
					rightContent={
						<EventToggleButton
							showPast={showPastEvents}
							onToggle={() => setShowPastEvents(!showPastEvents)}
						/>
					}
				/>

				<CategoryTabs
					categories={categories}
					activeCategory={activeCategory}
					setActiveCategory={setActiveCategory}
				/>

				{isLoading ? (
					<div className="flex justify-center py-20">
						<motion.div
							className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								repeat: Infinity,
								ease: "linear",
							}}
						/>
					</div>
				) : categories.length > 0 ? (
					activeCategory ? (
						<EventCarousel
							category={activeCategory}
							ev={groupedEvents[activeCategory]}
						/>
					) : (
						categories.map((category) => (
							<EventCarousel
								key={category}
								category={category}
								ev={groupedEvents[category]}
							/>
						))
					)
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
