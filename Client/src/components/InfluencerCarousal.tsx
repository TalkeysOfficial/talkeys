"use-client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Using Swiper for all views now
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

// Interface and data remain the same
interface CertificationCard {
    title: string;
    issuedBy: string;
    tags: string[];
    price?: number;
    questions: number;
    duration: number; // in minutes
    passingScore: number; // percentage
    providesBadge: boolean;
}

const certificationCards: CertificationCard[] = [
    {
        title: "Advanced React Developer",
        issuedBy: "Meta",
        tags: ["React", "Next.js", "Advanced"],
        price: 4999,
        questions: 60,
        duration: 90,
        passingScore: 75,
        providesBadge: true,
    },
    {
        title: "AWS Cloud Practitioner",
        issuedBy: "Amazon Web Services",
        tags: ["Cloud", "AWS", "Foundational"],
        price: 7500,
        questions: 65,
        duration: 90,
        passingScore: 72,
        providesBadge: true,
    },
    {
        title: "UX Design Principles",
        issuedBy: "Google",
        tags: ["UX/UI", "Design"],
        questions: 40,
        duration: 60,
        passingScore: 80,
        providesBadge: false,
    },
    {
        title: "Python for Data Science",
        issuedBy: "DataCamp",
        tags: ["Python", "Data", "AI/ML"],
        price: 3000,
        questions: 50,
        duration: 120,
        passingScore: 80,
        providesBadge: true,
    },
    {
        title: "Agile Project Management",
        issuedBy: "PMI",
        tags: ["Agile", "Scrum", "Management"],
        price: 6500,
        questions: 50,
        duration: 60,
        passingScore: 70,
        providesBadge: true,
    },
];

// Reusable Card Component to keep the main component clean
const CertificationCardComponent = ({ card }: { card: CertificationCard }) => (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
        <CardContent className="p-6 flex flex-col h-full">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{card.issuedBy}</p>
                <h3 className="text-xl font-bold text-[#102542] mb-4">
                    {card.title}
                </h3>
                <div className="space-y-3 text-sm text-gray-800 border-t border-gray-200 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-lg w-5 text-center text-[#F87060]">❓</span>
                        <span>{card.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg w-5 text-center">🕒</span>
                        <span>{card.duration} Minute Time Limit</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg w-5 text-center">🎯</span>
                        <span>{card.passingScore}% Passing Score</span>
                    </div>
                    {card.providesBadge && (
                        <div className="flex items-center gap-3">
                            <span className="text-lg w-5 text-center">🎖️</span>
                            <span>Official Badge on Completion</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow" />

            <div className="mt-4">
                <div className="flex flex-wrap gap-2 border-t border-gray-200 py-4">
                    {card.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4">
                    <div className="text-xl font-semibold text-[#102542]">
                        {card.price && card.price > 0
                            ? `₹ ${card.price} / ${card.price / 100} Credits`
                            : "Free"
                        }
                    </div>
                    <Button
                        className="w-full sm:w-auto bg-[#F87060] text-white font-bold rounded-lg hover:bg-[#F87060]/90 text-base py-3 px-5 shrink-0"
                    >
                        Take Test
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function CertificationsSection() {
    // REMOVED: Conditional rendering logic is no longer needed.
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
                        Validate Your Skills
                    </h2>
                </div>

                {/* MODIFIED: Using Swiper carousel for all screen sizes */}
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
                    spaceBetween={24}
                    slidesPerView={1.2} // Base for mobile
                    breakpoints={{
                        640: { slidesPerView: 2.2 },  // sm
                        768: { slidesPerView: 2.5 },  // md
                        1024: { slidesPerView: 3.5 }, // lg
                        1280: { slidesPerView: 4.5 }, // xl
                    }}
                    className="pb-4"
                >
                    {certificationCards.map((card, index) => (
                        <SwiperSlide key={index} className="h-full py-2">
                            <CertificationCardComponent card={card} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}