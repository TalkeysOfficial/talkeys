"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Image from "next/image";
import communityImage from "@/public/images/community.png";

// Interface now includes subtitle and tags to match the new design
interface CommunityCard {
    title: string;
    subtitle: string;
    tags: string[];
    image: any;
    price?: number;
}

// Updated data to include new fields
const communityCards: CommunityCard[] = [
    {
        title: "Tech Innovators",
        subtitle: "Hosted by John Dev",
        tags: ["Web3", "AI", "SaaS"],
        price: 2500,
        image: communityImage,
    },
    {
        title: "Art & Culture Hub",
        subtitle: "Curated by Priya Singh",
        tags: ["Art", "History"],
        price: 1000,
        image: communityImage,
    },
    {
        title: "Startup Founders",
        subtitle: "Mentored by Industry Vets",
        tags: ["Startups", "VC", "Growth"],
        price: 5000,
        image: communityImage,
    },
    {
        title: "Music Producers",
        subtitle: "A place for creators",
        tags: ["Music", "Production"],
        image: communityImage,
    },
];

export default function CommunityCarousel() {
    return (
        <div
            className="w-full p-4 sm:p-6 lg:p-8"
            style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)",
            }}
        >
            <div className="w-full bg-transparent">
                <div className="flex items-center mb-8">
                    <div className="w-1.5 h-8 bg-[#F87060] mr-4 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#102542]">
                        Courses Trending Right Now
                    </h2>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3.5 },
                    }}
                    className="pb-4"
                >
                    {communityCards.map((card, index) => (
                        <SwiperSlide key={index} className="h-auto">
                            <Card className="bg-white border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="relative w-full aspect-[4/3]">
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            className="object-cover object-center"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-4 sm:p-5 flex flex-col flex-grow">
                                        <div className="flex gap-2 mb-3">
                                            {card.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-bold text-[#102542]">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {card.subtitle}
                                        </p>

                                        <div className="text-2xl font-bold text-[#102542] my-2">
                                            {card.price && card.price > 0
                                                ? `₹ ${card.price} / ${card.price / 100} Credits`
                                                : "Free to Join"}
                                        </div>

                                        {/* MODIFICATION START */}
                                        <a
                                            href="https://talkeys.xyz/event/68bcbb9e3510fed8b67fc83f"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto" // Ensures the link wrapper takes up the available space
                                        >
                                            <Button
                                                className="w-full bg-[#F87060] text-white font-bold rounded-lg hover:bg-[#F87060]/90"
                                            >
                                                Join Now
                                            </Button>
                                        </a>
                                        {/* MODIFICATION END */}

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