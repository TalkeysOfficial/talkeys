"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "./EventCard";
import type { Event } from "@/types/types";

interface EventListProps {
	events?: Event[];
	onDelete: (id: string) => void;
	deleteMode: boolean;
}

const EventList: React.FC<EventListProps> = ({
	events,
	onDelete,
	deleteMode,
}) => {
	if (!events || events.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="text-white text-center py-12"
			>
				No events found
			</motion.div>
		);
	}

	return (
		<motion.div
			layout
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<AnimatePresence>
				{events.map((event, index) => (
					<motion.div
						key={event._id}
						layout
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { delay: index * 0.05, duration: 0.3 },
						}}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						<EventCard
							event={event}
							onDelete={onDelete}
							deleteMode={deleteMode}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
};

export default EventList;
