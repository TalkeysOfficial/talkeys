"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Image from "next/image";
import image from "@/public/images/influencer.png";

interface InfluencerCard {
	date: string;
	title: string;
	performer: string;
	image: any;
}

const influencerCards: InfluencerCard[] = [
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
	{
		date: "",
		title: "",
		performer: "Coming Soon",
		image: image,
	},
];

export default function InfluencerCarousel() {
	return (
		<div className="influencer w-full bg-transparent text-white p-10 pb-3">
			<div className="w-full bg-transparent text-white p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">
						Influencers Shaping the Community
					</h2>
					{/* <Button variant="outline" onClick={handleShowAllInfluencers}>Show All Influencers</Button> */}
				</div>
				<Swiper
					modules={[Autoplay]}
					autoplay={{ delay: 3500, disableOnInteraction: false }}
					loop
					spaceBetween={30}
					slidesPerView={1}
					breakpoints={{
						640: { slidesPerView: 1 },
						768: { slidesPerView: 2 },
						1024: { slidesPerView: 3 },
					}}
				>
					{influencerCards.map((card, index) => (
						<SwiperSlide key={card.date + index}>
							<Card className="bg-gray-950 border-none">
								<CardContent className="p-0">
									<Image
										src={card.image}
										alt={card.title}
										width={300}
										height={400}
										className="w-full h-64 object-cover object-center rounded-xl"
									/>
									<div className="p-4">
										<div className="flex justify-between items-center">
											<h1 className="text-xl font-bold mb-2">
												{card.performer}
											</h1>
											<h4>{card.title}</h4>
										</div>
										<Button
											className="w-[100px] mt-3 bg-[#8A44CB] text-white font-bold rounded-[15px]"
											disabled
										>
											More Info
										</Button>
									</div>
								</CardContent>
							</Card>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
}
