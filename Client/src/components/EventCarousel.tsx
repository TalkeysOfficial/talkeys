"use client";

import type React from "react";
import { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Event } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import locationSvg from "@/public/images/location_on.svg";
import calendarSvg from "@/public/images/calendar_month.svg";

interface EventCarouselProps {
	category?: string;
	ev?: Event[];
}

interface EventCardProps {
	event: Event;
	index: number;
}

export function formatTime(timeString: string): string {
	const [hours, minutes] = timeString.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const hours12 = hours % 12 || 12;
	return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const EventCard = memo(function EventCard({ event, index }: EventCardProps) {
	const [isHovered, setIsHovered] = useState(false);

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
			className="h-full min-w-[260px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[280px] xl:min-w-[260px]"
		>
			<Link
				href={`/event/${event._id}`}
				scroll={false}
			>
				<CardContainer
					className="w-full h-full py-0 rounded-2xl border border-[#DCB6FF] hover:border-[#703CA0]"
					containerClassName="py-0"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<CardBody
						className={cn(
							"h-full w-full rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/80",
							isHovered ? "shadow-md shadow-purple-500/20" : "",
						)}
					>
						<div className="relative w-full h-full flex flex-col">
							<CardItem
								translateZ={40}
								className="relative w-full aspect-square overflow-hidden"
							>
								<Image
									src={
										event.photographs?.[0] ||
										"/images/placeholder.jpg"
									}
									alt={event.name}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
									priority={index < 4}
									loading={index < 4 ? "eager" : "lazy"}
									className="object-cover object-center transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
							</CardItem>

							<CardItem
								translateZ={30}
								className="p-4 flex flex-col flex-grow"
							>
								<h3 className="text-xl font-normal mb-8 line-clamp-2 text-white">
									{event.name}
								</h3>
								<p className="text-gray-400 mb-1 line-clamp-1 flex gap-2 items-center">
									<div className="h-5 w-5">
										<Image
											alt="location"
											src={locationSvg}
										/>
									</div>
									<p className="w-[70vw] sm:w-[35vw] md:w-[20vw] lg:w-[13vw] truncate">
										{event.location ?? "Location not specified"}
									</p>
								</p>
								<div className="text-sm text-gray-400 mb-6 flex gap-2 items-center truncate">
									<div className="h-5 w-5">
										<Image
											alt="calendar"
											src={calendarSvg}
										/>
									</div>
									<div>
										{new Date(
											event.endRegistrationDate,
										).toLocaleDateString("en-IN", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</div>
									<div>|</div>
									<div>{formatTime(event.startTime)}</div>
								</div>
								<div className="mt-auto flex gap-4 mb-2">
									<div className="text-gray-400 border border-[#DCB6FF] rounded-3xl pt-1 pb-1 px-3">
										₹ {event.ticketPrice ?? "--"}
									</div>
									<div className="text-gray-400 border border-[#DCB6FF] rounded-3xl pt-1 pb-1 px-3">
										{event.category ?? "--"}
									</div>
								</div>
							</CardItem>
						</div>
					</CardBody>
				</CardContainer>
			</Link>
		</motion.div>
	);
});

EventCard.displayName = "EventCard";

const EventCarousel: React.FC<EventCarouselProps> = ({
	category = "ALL Events",
	ev = [],
}) => {
	const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

	const sortedEvents = [...ev]
		.sort((a, b) => {
			const dateA = new Date(a.startDate).getTime();
			const dateB = new Date(b.startDate).getTime();
			return dateA - dateB;
		})
		.reverse();

	return (
		<div className="mb-16 px-4 sm:px-6 lg:px-8">
			<div className="w-full bg-transparent text-white py-6">
				<div className="flex justify-between items-center mb-6">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
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
					<div
						className={cn(
							"flex gap-6 overflow-x-auto pb-4 scrollbar-hide",
							sortedEvents.length > 5 ? "pr-4" : "",
						)}
					>
						{sortedEvents.map((event, index) => (
							<EventCard
								key={event._id || index}
								event={event}
								index={index}
							/>
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
