// Restore the original styling and ensure responsiveness
// Replace the entire component with the optimized version

"use client";

import type React from "react";
import { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import placeholderImage from "@/public/images/events.jpg";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Heart } from "lucide-react";

interface EventCarouselProps {
	category?: string;
	ev?: Event[];
}

interface EventCardProps {
	event: Event;
	index: number;
}

const EventCard = memo(function EventCard({ event, index }: EventCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isLiked, setIsLiked] = useState(event.isLiked || false);

	const handleLikeUnlikeEvent = async (
		eventId: string,
		e: React.MouseEvent,
	) => {
		e.preventDefault();
		e.stopPropagation();

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

	return (
		<motion.div
			custom={index}
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: (i: number) => ({
					opacity: 1,
					y: 0,
					transition: {
						delay: i * 0.1,
						duration: 0.5,
						ease: "easeOut",
					},
				}),
			}}
			className="h-full"
		>
			<CardContainer
				className="w-full h-full py-0"
				containerClassName="py-0"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<CardBody
					className={cn(
						"w-full h-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900/80",
						isHovered ? "shadow-lg shadow-purple-500/20" : "",
					)}
				>
					<div className="relative w-full h-full flex flex-col">
						<CardItem
							translateZ={50}
							className="relative w-full aspect-square overflow-hidden"
						>
							<Image
								src={event.photographs?.[0] ?? placeholderImage}
								alt={event.name}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
								priority={index < 4}
								loading={index < 4 ? "eager" : "lazy"}
								className="object-cover object-center transition-transform duration-500"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />

							<CardItem
								translateZ="60"
								className="absolute bottom-0 left-0 right-0 p-3"
							>
								<div className="text-sm text-purple-300 font-medium">
									{new Date(event.startDate).toLocaleDateString(
										"en-IN",
										{
											day: "numeric",
											month: "short",
											year: "numeric",
										},
									)}
									{" • "}
									{event.startTime}
								</div>
							</CardItem>

							<CardItem
								translateZ="60"
								className={cn(
									"absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-md",
									event.isLive
										? "bg-green-500/80 text-white"
										: "bg-red-500/80 text-white",
								)}
							>
								{event.isLive ? "Live" : "Ended"}
							</CardItem>

							<CardItem
								translateZ="60"
								className="absolute top-3 left-3"
							>
								<button
									onClick={(e) => handleLikeUnlikeEvent(event._id, e)}
									className="p-1.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
									aria-label={isLiked ? "Unlike event" : "Like event"}
								>
									<Heart
										className={`h-4 w-4 ${
											isLiked
												? "fill-red-500 text-red-500"
												: "text-white"
										}`}
									/>
								</button>
							</CardItem>
						</CardItem>

						<CardItem
							translateZ={30}
							className="p-4 flex flex-col flex-grow"
						>
							<h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">
								{event.name}
							</h3>
							<p className="text-gray-400 mb-4 line-clamp-1">
								{event.location ?? "Location not specified"}
							</p>
							<div className="mt-auto">
								<CardItem translateZ="50">
									<Link
										href={`/event/${event._id}`}
										scroll={false}
										onClick={(e) => {
											e.preventDefault();
											// Store the origin page in localStorage
											localStorage.setItem(
												"eventOrigin",
												window.location.pathname,
											);
											// Navigate to the event detail page
											window.location.href = `/event/${event._id}`;
										}}
									>
										<Button
											variant="outline"
											className="w-full hover:bg-purple-600 hover:text-white transition-colors duration-300 border-purple-500/50"
										>
											More info
										</Button>
									</Link>
								</CardItem>
							</div>
						</CardItem>
					</div>
				</CardBody>
			</CardContainer>
		</motion.div>
	);
});

EventCard.displayName = "EventCard";

const EventCarousel: React.FC<EventCarouselProps> = ({
	category = "ALL Events",
	ev = [],
}) => {
	const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

	const sortedEvents = [...ev].sort((a, b) => {
		const dateA = new Date(a.startDate).getTime();
		const dateB = new Date(b.startDate).getTime();
		return dateA - dateB;
	});

	return (
		<div className="mb-16 px-4 sm:px-6 lg:px-8">
			<div className="w-full bg-transparent text-white py-6">
				<div className="flex justify-between items-center mb-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center"
					>
						<div className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></div>
						<h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
							{category ?? "Upcoming Events"}
						</h2>
					</motion.div>
				</div>

				{sortedEvents.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{sortedEvents.map((event, index) => (
							<motion.div
								key={event._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="h-full"
							>
								<EventCard
									event={event}
									index={index}
								/>
							</motion.div>
						))}
					</div>
				) : (
					<div className="pl-2 md:pl-4 basis-full">
						<div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
							<p className="text-gray-400">
								No Upcoming Events Currently
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(EventCarousel);
