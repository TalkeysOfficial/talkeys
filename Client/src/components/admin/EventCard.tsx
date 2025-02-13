import type React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/types";
import Image from "next/image";
import { format } from "date-fns";

interface EventCardProps {
	event: Event;
	onDelete: (id: string) => void;
	deleteMode: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
	event,
	onDelete,
	deleteMode,
}) => {
	const cardVariants = {
		normal: { scale: 1, rotate: 0 },
		deleteMode: { scale: 0.98, rotate: [-2, 2, -2, 0] },
	};

	const formattedDate = format(new Date(event.startDate), "dd MMM yyyy");

	return (
		<motion.div
			variants={cardVariants}
			animate={deleteMode ? "deleteMode" : "normal"}
			transition={{
				rotate: {
					duration: 0.2,
					repeat: deleteMode ? Number.POSITIVE_INFINITY : 0,
					repeatType: "reverse",
				},
			}}
			whileHover={{ scale: deleteMode ? 0.98 : 1.05 }}
			onClick={() => onDelete(event._id)}
			className="group"
		>
			<Card className="bg-gray-800 text-white cursor-pointer rounded-lg shadow-lg transition-transform transform hover:scale-105">
				<CardHeader className="p-4">
					<CardTitle className="text-xl font-semibold">
						{event.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<Image
						src={event.photographs?.[0] || "/default-image.jpg"}
						alt={event.name}
						width={150}
						height={350}
						loading="lazy"
						quality={45}
            className="self-center"
					/>
					<div className="bg-black bg-opacity-50 text-white p-2 rounded-md">
						<p className="text-sm">Date: {formattedDate}</p>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default EventCard;
