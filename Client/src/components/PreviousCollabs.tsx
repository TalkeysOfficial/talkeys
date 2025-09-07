"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// REMOVED: Autoplay module is no longer needed
import "swiper/css";
import Image from "next/image";

const creators = [
    {
        id: 1,
        name: "Alice Johnson",
        imageUrl: "https://placehold.co/180x180/F87060/FFFFFF?text=AJ",
        description: "Expert in Web Development with over 10 years of experience.",
    },
    {
        id: 2,
        name: "Bob Williams",
        imageUrl: "https://placehold.co/180x180/F0E100/102542?text=BW",
        description: "Award-winning graphic designer and UI/UX specialist.",
    },
    {
        id: 3,
        name: "Charlie Brown",
        imageUrl: "https://placehold.co/180x180/102542/FFFFFF?text=CB",
        description: "Data scientist passionate about machine learning and AI.",
    },
    {
        id: 4,
        name: "Diana Miller",
        imageUrl: "https://placehold.co/180x180/F87060/FFFFFF?text=DM",
        description: "Digital marketing guru who helps brands grow online.",
    },
    {
        id: 5,
        name: "Ethan Davis",
        imageUrl: "https://placehold.co/180x180/F0E100/102542?text=ED",
        description: "Full-stack engineer and open-source contributor.",
    },
    {
        id: 6,
        name: "Fiona Garcia",
        imageUrl: "https://placehold.co/180x180/102542/FFFFFF?text=FG",
        description: "Mobile app developer for both iOS and Android platforms.",
    },
];

export default function TopCreatorsCarousel() {
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
                        Top Creators
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    <Swiper
                        // MODIFIED: Removed autoplay, loop, and speed props to allow CSS to handle the animation
                        slidesPerView="auto"
                        spaceBetween={30}
                        grabCursor={true}
                        className="creators-swiper"
                    >
                        {/* The array is duplicated to provide enough content for the seamless loop */}
                        {[...creators, ...creators].map((creator, index) => (
                            <SwiperSlide
                                key={`${creator.id}-${index}`}
                                className="!w-[220px] sm:!w-[250px]"
                            >
                                <div className="creator-item flex flex-col items-center group pt-1 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 h-full justify-between">
                                    <div className="creator-container relative mb-4">
                                        <div
                                            className="metallic-border rounded-full relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-105"
                                        >
                                            <div className="relative h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-hidden rounded-full">
                                                <Image
                                                    src={creator.imageUrl}
                                                    alt={`${creator.name}'s profile picture`}
                                                    className="h-full w-full object-cover grayscale filter-transition group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 group-hover:saturate-150 rounded-full"
                                                    fill
                                                    sizes="(max-width: 640px) 120px, 120px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <p className="mt-2 text-center text-base sm:text-lg font-bold text-[#102542] transition-all duration-300 group-hover:text-[#F87060]">
                                            {creator.name}
                                        </p>
                                        <p className="mt-1 text-center text-xs sm:text-sm text-gray-500 line-clamp-2">
                                            {creator.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* MODIFIED: Replaced Swiper's JS animation with a smoother, more reliable CSS animation */}
            <style jsx global>{`
                .creators-swiper .swiper-wrapper {
                  animation: marquee 35s linear infinite;
                }

                .creators-swiper:hover .swiper-wrapper {
                  animation-play-state: paused;
                }

                @keyframes marquee {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                
                .filter-transition {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    will-change: filter;
                }

                .metallic-border::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        45deg,
                        #F0F2F5 25%,
                        #FFFFFF 50%,
                        #F0F2F5 75%
                    );
                    background-size: 200% 200%;
                    animation: shimmer 3s linear infinite;
                    z-index: -1;
                    border-radius: 50%;
                }

                .group:hover .metallic-border::before {
                    background: linear-gradient(
                        45deg,
                        #F87060 25%,
                        #F0E100 50%,
                        #F87060 75%
                    );
                    animation: shimmer 2s linear infinite;
                }

                @keyframes shimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </div>
    );
}