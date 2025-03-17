"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/types";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trash2 } from "lucide-react";

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
		deleteMode: {
			scale: 0.98,
			rotate: [-1, 1, -1, 0],
			transition: {
				rotate: {
					duration: 0.3,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
				},
			},
		},
		hover: {
			scale: 1.03,
			boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
			transition: { duration: 0.2 },
		},
	};

	const formattedDate = format(new Date(event.startDate), "dd MMM yyyy");
	const isLive = event.isLive;

	return (
		<motion.div
			variants={cardVariants}
			animate={deleteMode ? "deleteMode" : "normal"}
			whileHover={deleteMode ? "deleteMode" : "hover"}
			className={`group ${deleteMode ? "cursor-pointer" : ""}`}
		>
			<Card className="bg-gray-800/80 text-white border-gray-700 overflow-hidden h-full transition-all duration-300 hover:border-purple-500">
				<div className="relative">
					<div className="relative w-full h-40">
						<Image
							src={
								event.photographs?.[0] ||
								"/placeholder.svg?height=160&width=320" ||
								"/placeholder.svg"
							}
							alt={event.name}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70" />
					</div>

					<div className="absolute top-2 right-2">
						<Badge
							variant={isLive ? "default" : "secondary"}
							className={isLive ? "bg-green-600" : "bg-gray-600"}
						>
							{isLive ? "Live" : "Past"}
						</Badge>
					</div>

					{deleteMode && (
						<motion.div
							className="absolute top-2 left-2 bg-red-500 rounded-full p-1.5"
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0 }}
							transition={{ duration: 0.2 }}
							onClick={(e) => {
								e.stopPropagation();
								onDelete(event._id);
							}}
						>
							<Trash2 className="w-4 h-4 text-white" />
						</motion.div>
					)}
				</div>

				<CardHeader className="p-4 pb-2">
					<CardTitle className="text-lg font-semibold line-clamp-1">
						{event.name}
					</CardTitle>
				</CardHeader>

				<CardContent className="p-4 pt-0 space-y-2">
					<div className="flex items-center text-sm text-gray-300">
						<Calendar className="w-4 h-4 mr-2 text-purple-400" />
						<span>{formattedDate}</span>
					</div>

					<div className="flex items-center text-sm text-gray-300">
						<MapPin className="w-4 h-4 mr-2 text-purple-400" />
						<span className="line-clamp-1">
							{event.location || "No location specified"}
						</span>
					</div>

					<div className="flex items-center text-sm text-gray-300">
						<Users className="w-4 h-4 mr-2 text-purple-400" />
						<span>{event.registrationCount || 0} registrations</span>
					</div>

					<div className="flex flex-wrap gap-1 mt-2">
						<Badge
							variant="outline"
							className="bg-gray-700/50 text-xs"
						>
							{event.category}
						</Badge>
						<Badge
							variant="outline"
							className="bg-gray-700/50 text-xs"
						>
							{event.mode}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default EventCard;
