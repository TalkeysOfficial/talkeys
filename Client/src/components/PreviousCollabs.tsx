"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

// 1. Updated data structure for creators with name, image placeholder, and description.
const creators = [
    {
        id: 1,
        name: "Alice Johnson",
        imageUrl: "https://placehold.co/180x180/a78bfa/ffffff?text=AJ",
        description: "Expert in Web Development with over 10 years of experience.",
    },
    {
        id: 2,
        name: "Bob Williams",
        imageUrl: "https://placehold.co/180x180/f472b6/ffffff?text=BW",
        description: "Award-winning graphic designer and UI/UX specialist.",
    },
    {
        id: 3,
        name: "Charlie Brown",
        imageUrl: "https://placehold.co/180x180/60a5fa/ffffff?text=CB",
        description: "Data scientist passionate about machine learning and AI.",
    },
    {
        id: 4,
        name: "Diana Miller",
        imageUrl: "https://placehold.co/180x180/34d399/ffffff?text=DM",
        description: "Digital marketing guru who helps brands grow online.",
    },
    {
        id: 5,
        name: "Ethan Davis",
        imageUrl: "https://placehold.co/180x180/fbbf24/ffffff?text=ED",
        description: "Full-stack engineer and open-source contributor.",
    },
    {
        id: 6,
        name: "Fiona Garcia",
        imageUrl: "https://placehold.co/180x180/f87171/ffffff?text=FG",
        description: "Mobile app developer for both iOS and Android platforms.",
    },
];

// Renamed component for clarity
export default function TopCreatorsCarousel() {
    return (
        <div className="w-full bg-transparent mt-3 py-8 px-4 sm:px-6 md:px-8">
            {/* 2. Changed the title of the section */}
            <div className="mb-6 flex items-center justify-start">
                <div className="mr-3 h-5 w-1 rounded-full bg-purple-500"></div>
                <h2 className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
                    Top Creators
                </h2>
            </div>

            <div className="relative overflow-hidden">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    speed={3000}
                    slidesPerView="auto"
                    spaceBetween={30} // Increased space for better readability
                    freeMode={true}
                    grabCursor={true}
                    // 3. Renamed the Swiper class for semantic correctness
                    className="creators-swiper"
                >
                    {/* Mapping through the new creators array */}
                    {[...creators, ...creators].map((creator, index) => (
                        <SwiperSlide
                            key={`${creator.id}-${index}`}
                            // Set a fixed width for slides to hold the card content
                            className="!w-[220px] sm:!w-[250px]"
                        >
                            <div className="creator-item flex flex-col items-center group pt-1 text-center">
                                <div className="creator-container relative">
                                    {/* The metallic border effect is now applied to a circular shape */}
                                    <div className="metallic-border rounded-full relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden sm:h-[140px] sm:w-[140px] md:h-[160px] md:w-[160px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300/30">
                                        <div className="relative h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-hidden">
                                            <div className="absolute inset-0 rounded-full">
                                                <Image
                                                    src={creator.imageUrl}
                                                    alt={`${creator.name}'s profile picture`}
                                                    className="h-full w-full object-cover grayscale filter-transition group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 group-hover:saturate-150"
                                                    fill
                                                    sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Creator's Name */}
                                <p className="mt-4 text-center text-sm sm:text-base font-bold text-white transition-all duration-300 group-hover:text-purple-400">
                                    {creator.name}
                                </p>
                                {/* 4. Added the description text */}
                                <p className="mt-1 text-center text-xs sm:text-sm text-gray-400">
                                    {creator.description}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 5. Updated CSS selector from .sponsors-swiper to .creators-swiper */}
            <style jsx global>{`
                .creators-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                    will-change: transform;
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
                        #71717a 25%,
                        #e4e4e7 50%,
                        #71717a 75%
                    );
                    background-size: 200% 200%;
                    animation: shimmer 3s linear infinite;
                    z-index: -1;
                    border-radius: 50%; /* Ensuring the border is always a circle */
                }

                .group:hover .metallic-border::before {
                    background: linear-gradient(
                        45deg,
                        #9333ea 25%,
                        #e879f9 50%,
                        #9333ea 75%
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