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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      initial={false}
      animate="visible"
      variants={{
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
        }),
      }}
      className="h-full min-w-[160px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[280px] xl:min-w-[260px]"
    >
      <Link href={`/event/${event._id}`} scroll={false}>
        <CardContainer
          className="w-full h-full py-0 rounded-2xl border border-[#DCB6FF] hover:border-[#703CA0]"
          containerClassName="py-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardBody
            className={cn(
              "h-full w-full rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/80",
              isHovered ? "shadow-md shadow-purple-500/20" : "",
            )}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* event image */}
              <CardItem
                translateZ={40}
                className="relative w-full aspect-square overflow-hidden"
              >
                <Image
                  src={event.photographs?.[0] || "/images/placeholder.jpg"}
                  alt={event.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover object-center transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70" />
              </CardItem>

              {/* event content */}
              <CardItem
                translateZ={30}
                className="p-2 sm:p-4 flex flex-col flex-grow"
              >
                <h3 className="text-sm sm:text-xl font-normal mb-4 sm:mb-8 line-clamp-2 text-white">
                  {event.name}
                </h3>

                <div className="text-gray-400 mb-1 line-clamp-1 flex gap-1 sm:gap-2 items-center text-xs sm:text-sm">
                  <div className="h-3 w-3 sm:h-5 sm:w-5 flex-shrink-0">
                    <Image alt="location" src={locationSvg} />
                  </div>
                  <span className="truncate flex-1">
                    {event.location ?? "Location not specified"}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-6 flex gap-1 sm:gap-2 items-center">
                  <div className="h-3 w-3 sm:h-5 sm:w-5 flex-shrink-0">
                    <Image alt="calendar" src={calendarSvg} />
                  </div>
                  <div className="truncate">{formatDate(event.startDate)}</div>
                  <div className="hidden sm:block"></div>
                  {/*<div className="hidden sm:block">
                    {formatTime(event.startTime)}
                  </div>*/}
                </div>

                {/* footer row */}
                <div className="mt-auto flex gap-2 sm:gap-4 mb-2">
                  <div className="text-gray-400 border border-[#DCB6FF] rounded-3xl pt-1 pb-1 px-2 sm:px-3 text-xs sm:text-sm">
                    ₹{" "}
                    {event._id == "6941834009f38cd886cb1aa0"
                      ? "300"
                      : event.ticketPrice - 9}
                  </div>
                  <div className="text-gray-400 border border-[#DCB6FF] rounded-3xl pt-1 pb-1 px-2 sm:px-3 text-xs sm:text-sm truncate">
                    {event.category ?? "--"}
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
  const rawIsMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isMobile = mounted ? rawIsMobile : false;

  const sortedEvents = [...ev]
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .reverse();

  return (
    <div className="mb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-transparent text-white py-6">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              {category ?? "Upcoming Events"}
            </h2>
          </motion.div>
        </div>

        {mounted ? (
          sortedEvents.length > 0 ? (
            <div
              className={cn(
                "flex gap-6 overflow-x-auto pb-4 scrollbar-hide",
                sortedEvents.length > 5 ? "pr-4" : "",
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
            <div className="pl-2 md:pl-4 basis-full">
              <div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
                <p className="text-gray-400">No Upcoming Events Currently</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
            <p className="text-gray-400">Loading events…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EventCarousel);
