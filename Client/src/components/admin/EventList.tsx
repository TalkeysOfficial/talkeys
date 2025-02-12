import type React from "react";
import { motion } from "framer-motion";
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
	if (!events) {
		return <div className="text-white text-center">NO EVENTS</div>;
	}

	return (
		<motion.div
			layout
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
		>
			{events?.map((event) => (
				<EventCard
					key={event._id}
					event={event}
					onDelete={onDelete}
					deleteMode={deleteMode}
				/>
			))}
		</motion.div>
	);
};

export default EventList;
