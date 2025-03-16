"use client";

import type React from "react";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import placeholderImage from "@/public/images/events.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ParticularEventPage from "@/components/ParticularEventPage";
import type { Event } from "@/types/types";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

interface EventCarouselProps {
	category?: string;
	ev?: Event[];
}

// Memoized EventCard component for better performance
const EventCard = memo(
	({
		event,
		index,
		onOpenDialog,
	}: {
		event: Event;
		index: number;
		onOpenDialog: (event: Event) => void;
	}) => {
		const cardVariants = {
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
			hover: {
				y: -10,
				boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
				transition: { duration: 0.3 },
			},
		};

		return (
			<motion.div
				custom={index}
				initial="hidden"
				animate="visible"
				whileHover="hover"
				variants={cardVariants}
			>
				<Card className="bg-gray-900/80 border-none overflow-hidden h-full">
					<CardContent className="p-0 flex flex-col h-full">
						<div className="relative w-full aspect-square overflow-hidden">
							<Image
								src={event.photographs?.[0] ?? placeholderImage}
								alt={event.name}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
								priority={index < 4}
								loading={index < 4 ? "eager" : "lazy"}
								className="object-cover object-center transition-transform duration-500 hover:scale-110"
							/>
						</div>
						<div className="p-4 flex flex-col flex-grow">
							<div className="text-sm text-purple-400 mb-2">
								{new Date(event.startDate).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
								{" • "}
								{event.startTime}
							</div>
							<h3 className="text-lg font-bold mb-2 line-clamp-2">
								{event.name}
							</h3>
							<p className="text-gray-400 mb-4 line-clamp-1">
								{event.location ?? "Location not specified"}
							</p>
							<div className="mt-auto">
								<Button
									variant="outline"
									className="w-full hover:bg-purple-600 hover:text-white transition-colors duration-300"
									onClick={() => onOpenDialog(event)}
								>
									More info
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	},
);

EventCard.displayName = "EventCard";

// Main component with performance optimizations
const EventCarousel: React.FC<EventCarouselProps> = ({
	category = "ALL Events",
	ev = [],
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	// Sort events by date - memoize if this becomes a performance issue
	const sortedEvents = [...ev].sort((a, b) => {
		const dateA = new Date(a.startDate).getTime();
		const dateB = new Date(b.startDate).getTime();
		return dateA - dateB;
	});

	const handleOpenDialog = useCallback((event: Event) => {
		setSelectedEvent(event);
		setIsDialogOpen(true);
	}, []);

	const handleCloseDialog = useCallback(() => {
		setIsDialogOpen(false);
	}, []);

	return (
		<div className="mb-16 px-4 sm:px-6 lg:px-8">
			<div className="w-full bg-transparent text-white py-6">
				<div className="flex justify-between items-center mb-6">
					<motion.h2
						className="text-xl sm:text-2xl font-bold"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						{category ?? "Upcoming Events"}
					</motion.h2>
				</div>

				<Carousel
					opts={{
						align: "start",
						loop: true,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{sortedEvents.length > 0 ? (
							sortedEvents.map((event, index) => (
								<CarouselItem
									key={event._id || index}
									className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
								>
									<EventCard
										event={event}
										index={index}
										onOpenDialog={handleOpenDialog}
									/>
								</CarouselItem>
							))
						) : (
							<CarouselItem className="pl-2 md:pl-4 basis-full">
								<div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
									<p className="text-gray-400">
										No Upcoming Events Currently
									</p>
								</div>
							</CarouselItem>
						)}
					</CarouselContent>
					<div className="flex justify-end mt-4 gap-2">
						<CarouselPrevious className="relative inset-0 translate-y-0 bg-purple-600 hover:bg-purple-700 text-white" />
						<CarouselNext className="relative inset-0 translate-y-0 bg-purple-600 hover:bg-purple-700 text-white" />
					</div>
				</Carousel>
			</div>

			<AnimatePresence>
				{selectedEvent && isDialogOpen && (
					<Dialog
						open={isDialogOpen}
						onOpenChange={setIsDialogOpen}
					>
						<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none mt-6 scrollbar-hide custom-scrollbar p-0 bg-transparent">
							<ParticularEventPage
								event={selectedEvent}
								onClose={handleCloseDialog}
							/>
						</DialogContent>
					</Dialog>
				)}
			</AnimatePresence>
		</div>
	);
};

export default memo(EventCarousel);
