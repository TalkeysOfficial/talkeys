"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import placeholderImage from "@/public/images/events.jpg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EventPage from "@/components/particularEventData";
import { Event } from "@/app/eventPage/page";

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
	},
];

export default function EventCarousel({
	title = "EVENT",
	events = sampleEvents,
}: Readonly<{
	title?: string;
	events?: Event[];
}>) {
	const [timer, setTimer] = useState(120);
	const swiperRef = useRef<any>(null);
	const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);

	useEffect(() => {
		const timerIntervalId = setInterval(() => {
			setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 120));
		}, 1000);

		return () => {
			clearInterval(timerIntervalId);
		};
	}, []);

	useEffect(() => {
		async function fetchEvents() {
			// console.log(process.env.BACKEND_URL);
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
		<div className="mb-[-80px]">
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
											className="w-full h-64 object-scale-down object-center"
										/>
										<div className="p-4">
											<div className="text-sm text-red-500 mb-2">
												{new Date(event.startDate).toDateString()}
												{" at "}
												{event.startTime}
											</div>
											<h3 className="text-xl font-bold mb-2">
												{event.name}
											</h3>
											<h4 className="text-lg mb-4">
												{event.location ?? "Location not specified"}
											</h4>
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														className="w-full"
													>
														More info
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
													<EventPage event={event} />
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
