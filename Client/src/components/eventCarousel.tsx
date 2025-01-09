"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import image from "../public/images/events.jpg";

interface EventCard {
	date: string;
	title: string;
	performer: string;
	image: any;
}

const eventCards: EventCard[] = [
	{
		date: "21 MAY",
		title: "Sunday Salsa",
		performer: "DEBORAH DE LUCA",
		image: image,
	},
	{
		date: "22 MAY",
		title: "Monday Blues",
		performer: "JOHN DOE",
		image: image,
	},
	{
		date: "23 MAY",
		title: "Tuesday Jazz",
		performer: "JANE SMITH",
		image: image,
	},
	{
		date: "24 MAY",
		title: "Wednesday Rock",
		performer: "ROCK BAND",
		image: image,
	},
	{
		date: "25 MAY",
		title: "Thursday Pop",
		performer: "POP STAR",
		image: image,
	},
	{
		date: "26 MAY",
		title: "Friday Funk",
		performer: "FUNK BAND",
		image: image,
	},
];

export default function EventCarousel() {
	const [timer, setTimer] = useState(120);
	const swiperRef = useRef<any>(null);

	useEffect(() => {
		const timerIntervalId = setInterval(() => {
			setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 120));
		}, 1000);

		return () => {
			clearInterval(timerIntervalId);
		};
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
						<h2 className="text-2xl font-bold">Upcoming Events</h2>
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
						onSwiper={(swiper) => (swiperRef.current = swiper)} // Capture the Swiper instance
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
						{eventCards.map((card, index) => (
							<SwiperSlide key={index}>
								<Card className="bg-gray-950 border-none">
									<CardContent className="p-0">
										<Image
											src={card.image}
											alt={card.title}
											width={300}
											height={400}
											className="w-full h-64 object-cover"
										/>
										<div className="p-4">
											<div className="text-sm text-red-500 mb-2">
												{card.date}
											</div>
											<h3 className="text-xl font-bold mb-2">
												{card.title}
											</h3>
											<h4 className="text-lg mb-4">
												{card.performer}
											</h4>
											<Button
												variant="outline"
												className="w-full"
											>
												More info
											</Button>
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
