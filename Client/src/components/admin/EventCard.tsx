"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import type { Event } from "@/types/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
	event: Event;
	onDelete?: (id: string) => void;
	deleteMode?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
	event,
	onDelete,
	deleteMode = false,
}) => {
	const [isLiked, setIsLiked] = useState(event.isLiked || false);
	const [isHovered, setIsHovered] = useState(false);

	const handleLikeUnlikeEvent = async (eventId: string) => {
		try {
			await fetch(
				`${process.env.BACKEND_URL}/${
					isLiked ? "unlikeEvent" : "likeEvent"
				}/${eventId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					},
				},
			);
			setIsLiked(!isLiked);
		} catch (error) {
			console.error("Error liking/unliking event:", error);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onDelete) {
			onDelete(event._id);
		}
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	return (
		<CardContainer
			className="w-full h-full py-0"
			containerClassName="py-0"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<CardBody
				className={cn(
					"w-full h-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900/80 transition-all duration-300",
					isHovered ? "shadow-lg shadow-purple-500/20" : "",
				)}
			>
				<Link
					href={`/event/${event._id}`}
					className="block h-full"
				>
					<div className="relative w-full h-full flex flex-col">
						{/* Image Container */}
						<CardItem
							translateZ="40"
							className="relative w-full h-48 overflow-hidden"
						>
							<Image
								src={
									event.photographs?.[0] ||
									"/placeholder.svg?height=400&width=600"
								}
								alt={event.name}
								fill
								className="object-cover transition-transform duration-500"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>

							{/* Overlay for status */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

							{/* Status Badge */}
							<CardItem
								translateZ="60"
								className={cn(
									"absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-md",
									event.isLive
										? "bg-green-500/80 text-white"
										: "bg-red-500/80 text-white",
								)}
							>
								{event.isLive ? "Live" : "Ended"}
							</CardItem>

							{/* Category Badge */}
							<CardItem
								translateZ="60"
								className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-md bg-purple-600/80 text-white"
							>
								{event.category}
							</CardItem>

							{/* Date */}
							<CardItem
								translateZ="50"
								className="absolute bottom-3 left-3 text-white text-sm font-medium"
							>
								{formatDate(event.startDate)}
							</CardItem>
						</CardItem>

						{/* Content */}
						<CardItem
							translateZ="30"
							className="flex-1 p-4 flex flex-col"
						>
							<h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
								{event.name}
							</h3>

							<div className="flex items-center text-gray-400 text-sm mb-2">
								<span className="line-clamp-1">
									{event.location || "Online Event"}
								</span>
							</div>

							<div className="mt-auto flex justify-between items-center">
								<CardItem
									translateZ="20"
									className={cn(
										"text-sm font-medium",
										event.isPaid
											? "text-yellow-400"
											: "text-green-400",
									)}
								>
									{event.isPaid ? `₹${event.ticketPrice}` : "Free"}
								</CardItem>

								{deleteMode ? (
									<CardItem translateZ="20">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={handleDelete}
											className="p-2 bg-red-500/20 rounded-full text-red-500 hover:bg-red-500/30 transition-colors"
											aria-label="Delete event"
										>
											<Trash2 size={16} />
										</motion.button>
									</CardItem>
								) : (
									<CardItem translateZ="20">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleLikeUnlikeEvent(event._id);
											}}
											className={cn(
												"p-2 rounded-full transition-colors",
												isLiked
													? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
													: "bg-gray-700/50 text-gray-400 hover:bg-gray-700",
											)}
											aria-label={
												isLiked ? "Unlike event" : "Like event"
											}
										>
											<Heart
												size={16}
												fill={isLiked ? "currentColor" : "none"}
											/>
										</motion.button>
									</CardItem>
								)}
							</div>
						</CardItem>
					</div>
				</Link>
			</CardBody>
		</CardContainer>
	);
};

export default EventCard;
