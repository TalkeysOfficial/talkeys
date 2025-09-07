"use client";

import type React from "react";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Event } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import locationSvg from "@/public/images/location_on.svg";
import calendarSvg from "@/public/images/calendar_month.svg";

interface EventCarouselProps {
    category?: string;
    ev?: Event[];
}

interface EventCardProps {
    event: Event;
    index: number;
}

// Helper functions remain the same
function formatDate(dateString: string): string {
    const d = new Date(dateString);
    const day = d.getUTCDate();
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
}

export function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const EventCard = memo(function EventCard({ event, index }: EventCardProps) {
    return (
        <motion.div
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            animate="visible"
            variants={{
                visible: (i: number) => ({
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
                }),
            }}
            // MODIFIED: Increased card widths for a bigger, more modern feel
            className="h-full min-w-[280px] sm:min-w-[340px] md:min-w-[380px]"
        >
            <Link href={`/event/${event._id}`} scroll={false}>
                {/* MODIFIED: Updated border colors to match the new palette. Added a transition for a smoother hover effect. */}
                <CardContainer
                    className="w-full h-full p-0 rounded-2xl border border-gray-200 hover:border-[#F87060] transition-all duration-300"
                    containerClassName="py-0"
                >
                    <CardBody
                        // MODIFIED: Switched to a white background, removed old dark theme classes, and updated shadow for a modern "lift" effect on hover.
                        className={cn(
                            "h-full w-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-shadow duration-300"
                        )}
                    >
                        <div className="relative w-full h-full flex flex-col">
                            {/* event image */}
                            <CardItem
                                translateZ={40}
                                className="relative w-full aspect-[16/10] overflow-hidden" // MODIFIED: Changed aspect ratio for a wider look
                            >
                                <Image
                                    src={
                                        event.photographs?.[0] ||
                                        "/images/placeholder.jpg"
                                    }
                                    alt={event.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    priority={index < 4}
                                    loading={index < 4 ? "eager" : "lazy"}
                                    className="object-cover object-center"
                                />
                                {/* REMOVED: The dark gradient overlay to make images appear brighter and cleaner. */}
                            </CardItem>

                            {/* event content */}
                            <CardItem
                                translateZ={30}
                                // MODIFIED: Increased padding for better spacing
                                className="p-4 sm:p-5 flex flex-col flex-grow"
                            >
                                <h3 className="text-lg sm:text-2xl font-bold mb-4 line-clamp-2 text-[#102542]">
                                    {event.name}
                                </h3>

                                {/* MODIFIED: Updated text colors for readability on a light background. */}
                                <div className="text-gray-700 mb-2 line-clamp-1 flex gap-2 items-center text-sm sm:text-base">
                                    <div className="h-5 w-5 flex-shrink-0">
                                        <Image
                                            alt="location"
                                            src={locationSvg}
                                        />
                                    </div>
                                    <span className="truncate flex-1">
                                        {event.location ?? "Location not specified"}
                                    </span>
                                </div>

                                <div className="text-sm sm:text-base text-gray-700 mb-6 flex gap-2 items-center">
                                    <div className="h-5 w-5 flex-shrink-0">
                                        <Image
                                            alt="calendar"
                                            src={calendarSvg}
                                        />
                                    </div>
                                    <div className="truncate">
                                        {formatDate(event.startDate)}
                                    </div>
                                    <div className="hidden sm:block">|</div>
                                    <div className="hidden sm:block">
                                        {formatTime(event.startTime)}
                                    </div>
                                </div>

                                {/* footer row */}
                                {/* MODIFIED: Modernized tags with a subtle background and stronger text color. */}
                                <div className="mt-auto flex gap-3 mb-2">
                                    <div className="bg-[#F0E100]/50 text-[#102542] rounded-full py-1 px-4 text-xs sm:text-sm font-semibold">
                                        ₹ {event.ticketPrice ?? "Free"}
                                    </div>
                                    <div className="bg-gray-100 text-[#102542] rounded-full py-1 px-4 text-xs sm:text-sm font-semibold truncate">
                                        {event.category ?? "General"}
                                    </div>
                                </div>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            </Link>
        </motion.div>
    );
});

EventCard.displayName = "EventCard";

const EventCarousel: React.FC<EventCarouselProps> = ({
    category = "ALL Events",
    ev = [],
}) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Sorting logic remains the same
    const sortedEvents = [...ev]
        .sort(
            (a, b) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        .reverse();

    return (
        // MODIFIED: Applied the requested gradient background via inline style.
        <div
            className="mb-16 px-4 sm:px-6 lg:px-8"
            style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)",
            }}
        >
            <div className="w-full bg-transparent py-6">
                <div className="flex justify-between items-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        {/* MODIFIED: Updated accent bar to the new "Bittersweet" color */}
                        <div className="w-1.5 h-8 bg-[#F87060] mr-4 rounded-full"></div>
                        {/* MODIFIED: Removed text gradient and used the "Oxford Blue" for a clean, high-contrast title. */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#102542]">
                            {category ?? "Upcoming Events"}
                        </h2>
                    </motion.div>
                </div>

                {mounted ? (
                    sortedEvents.length > 0 ? (
                        <div
                            className={cn(
                                "flex gap-6 overflow-x-auto pb-6 scrollbar-hide", // MODIFIED: Increased gap and padding
                                sortedEvents.length > 5 ? "pr-4" : ""
                            )}
                        >
                            {sortedEvents.map((event, index) => (
                                <EventCard
                                    key={event._id || index}
                                    event={event}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        // MODIFIED: Updated the "No Events" message style to match the new theme.
                        <div className="pl-2 md:pl-4 basis-full">
                            <div className="flex justify-center items-center h-48 bg-white/60 rounded-lg border border-gray-200">
                                <p className="text-gray-600">
                                    No Upcoming Events Currently
                                </p>
                            </div>
                        </div>
                    )
                ) : (
                    // MODIFIED: Updated the loading state style.
                    <div className="flex justify-center items-center h-48 bg-white/60 rounded-lg">
                        <p className="text-gray-600">Loading events…</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(EventCarousel);