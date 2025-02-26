// @ts-nocheck
// @ts-ignore
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import placeholderImage from "@/public/images/events.jpg";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ParticularEventPage from "@/components/ParticularEventPage";
import type { Event } from "@/types/types";

export default function EventCarousel({
	category = "ALL Events",
	ev = [],
}: Readonly<{
	category?: string;
	ev?: Event[];
}>) {
	const swiperRef = useRef<any>(null);
	const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		async function fetchEvents() {
			const now = new Date();
			const upcomingEvents = ev?.filter(
				(event) => new Date(event.startDate) >= now,
			);

			upcomingEvents.sort((a, b) => {
				return (
					new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
				);
			});

			const pastEvents = ev?.filter(
				(event) => new Date(event.startDate) < now,
			);

			pastEvents.sort((a, b) => {
				return (
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
				);
			});

			setFetchedEvents([...upcomingEvents, ...pastEvents]);
		}
		fetchEvents();
		console.log("ev", ev);
	}, []);

	const handleNext = () => {
		swiperRef.current?.slideNext();
	};

	const handlePrev = () => {
		swiperRef.current?.slidePrev();
	};

	return (
		<div className={`mb-[-80px] ${isDialogOpen ? "blur-xl" : ""}`}>
			<div className="event w-full bg-transparent text-white max-sm:p-5 p-10 overflow-hidden">
				<div className="w-full bg-transparent text-white p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">
							{category ?? "Upcoming Events"}
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
						modules={[Autoplay, EffectFade]}
						autoplay={{
							delay: 2500,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						effect="slide"
						speed={300}
						spaceBetween={30}
						slidesPerView={2}
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
											width={350}
											height={450}
											priority={index < 3}
											loading={index < 3 ? "eager" : "lazy"}
											className="w-full max-w-72 mx-auto aspect-square object-contain object-center"
										/>
										<div className="p-4">
											<div className="text-sm text-purple-400 mb-2 max-sm:hidden">
												{new Date(
													event.startDate,
												).toLocaleDateString("en-IN", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
												{" at "}
												{event.startTime}
											</div>
											<h3 className="text-xl font-bold mb-2 max-sm:text-base">
												{event.name}
											</h3>
											<h4 className="text-lg mb-4 max-sm:text-sm">
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
												<DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto border-none mt-6 scrollbar-hide custom-scrollbar">
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
