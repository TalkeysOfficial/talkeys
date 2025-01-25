"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import placeholderImage from "@/public/images/events.jpg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ParticularEventPage from "@/app/eventPage/ParticularEventPage";
import type { Event } from "@/types/types";

const sampleEvents: Event[] = [
	{
		_id: "678b9075f6deb135145b5636",
		name: "Kick-OFF 2025",
		category: "Gaming",
		mode: "offline",
		location: "Game Box, Patiala, Punjab",
		duration: "3 hours",
		ticketPrice: 0,
		totalSeats: 120,
		slots: 2,
		visibility: "public",
		prizes: "First Prize: $3000, Second Prize: $1500",
		photographs: [],
		startDate: new Date("2025-03-15T00:00:00.000Z"),
		startTime: "10:00 AM",
		endRegistrationDate: new Date("2025-03-10T00:00:00.000Z"),
		eventDescription:
			"A premier tech event featuring keynote speeches, workshops, and networking opportunities.",
		isLive: false,
	},
];

export default function EventCarousel({
	title = "EVENT",
	events = sampleEvents,
}: Readonly<{
	title?: string;
	events?: Event[];
}>) {
	const swiperRef = useRef<any>(null);
	const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		async function fetchEvents() {
			const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
			const { data } = (await response.json()) as {
				data: {
					events: Event[];
				};
			};
			const { events } = data;
			setFetchedEvents(events);
		}
		fetchEvents();
	}, []);

	const handleNext = () => {
		swiperRef.current?.slideNext();
	};

	const handlePrev = () => {
		swiperRef.current?.slidePrev();
	};

	return (
		<div className={`mb-[-80px] ${isDialogOpen ? "blur-xl" : ""}`}>
			<div className="event w-full bg-transparent text-white p-10 overflow-hidden">
				<div className="w-full bg-transparent text-white p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">
							{title ?? "Upcoming Events"}
						</h2>
						<div>
							<Button
								onClick={handlePrev}
								className="mr-2"
							>
								Previous
							</Button>
							<Button onClick={handleNext}>Next</Button>
						</div>
					</div>
					<Swiper
						onSwiper={(swiper) => (swiperRef.current = swiper)}
						modules={[Autoplay]}
						autoplay={{ delay: 3000, disableOnInteraction: false }}
						loop
						spaceBetween={30}
						slidesPerView={1}
						breakpoints={{
							640: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
						}}
					>
						{fetchedEvents.map((event, index) => (
							<SwiperSlide key={event.name}>
								<Card className="bg-gray-950 border-none">
									<CardContent className="p-0">
										<Image
											src={
												event.photographs?.[0] ?? placeholderImage
											}
											alt={event.name}
											width={300}
											height={400}
											priority
											className="w-full h-64 object-scale-down object-center"
										/>
										<div className="p-4">
											<div className="text-sm text-purple-400 mb-2">
												{new Date(
													event.startDate,
												).toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
												{" at "}
												{event.startTime}
											</div>
											<h3 className="text-xl font-bold mb-2">
												{event.name}
											</h3>
											<h4 className="text-lg mb-4">
												{event.location ?? "Location not specified"}
											</h4>
											<Dialog
												onOpenChange={(isOpen) =>
													setIsDialogOpen(isOpen)
												}
											>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														className="w-full hover:bg-purple-600 duration-500"
													>
														More info
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-none">
													<ParticularEventPage
														event={event}
														onClose={() => setIsDialogOpen(false)}
													/>
												</DialogContent>
											</Dialog>
										</div>
									</CardContent>
								</Card>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
}
