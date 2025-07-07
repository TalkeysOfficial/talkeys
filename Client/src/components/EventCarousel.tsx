"use client";

import type React from "react";
import { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import placeholderImage from "@/public/images/events.jpg";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/types";
import { useMediaQuery } from "react-responsive";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import collegeImg from "@/public/images/College.png";
import dateImg from "@/public/images/Date.png";
import eventImg from "@/public/images/eventimage.jpg";
import heartImg from "@/public/images/heart.png";
import locationImg from "@/public/images/location.png";
import trophyImg from "@/public/images/trophy.png";
import vectorImg from "@/public/images/Vector.png";
import lineImg from "@/public/images/Line 4.png";

interface EventCarouselProps {
	category?: string;
	ev?: Event[];
}

interface EventCardProps {
	event: Event;
	index: number;
}

const EventCard = memo(function EventCard({ event, index }: EventCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="relative w-full h-full px-2 sm:px-4">
			
			<div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 mt-6 sm:mt-10 mb-10 sm:mb-20 w-full">
				
				<Image
					src={eventImg}
					alt="event"
					width={253}
					height={320}
					className="object-cover rounded-xl"
				/>

				
				<div className="flex flex-col gap-4 sm:gap-6 w-full text-[32px] sm:text-[54px] font-urbanist leading-none font-semibold mt-4 lg:mt-0">
					<span className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-urbanist leading-tight">
						Event Name
					</span>

					<div className="flex flex-col lg:flex-row flex-wrap justify-start gap-y-2 sm:gap-y-4 gap-x-4 sm:gap-x-6 text-white font-urbanist w-full">
						
						<div className="flex items-center gap-2 min-w-0 sm:min-w-[250px]">
							<Image
								src={collegeImg}
								alt="college"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate font-urbanist">
								The Name of the College
							</span>
						</div>

						{/* Location */}
						<div className="flex items-center gap-2 min-w-0 sm:min-w-[250px]">
							<Image
								src={locationImg}
								alt="location"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate font-urbanist">
								This Location. That City, XYZ State
							</span>
						</div>

						{/* Date */}
						<div className="flex items-center gap-2 min-w-0 sm:min-w-[250px]">
							<Image
								src={dateImg}
								alt="date"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate font-urbanist">
								Event Date
							</span>
						</div>

						{/* Fest Name */}
						<div className="flex items-center gap-2 min-w-0 sm:min-w-[250px]">
							<Image
								src={trophyImg}
								alt="fest"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate font-urbanist">
								Fest Name(optional)
							</span>
						</div>
					</div>
				</div>

				{/* Right Event Box */}
				<div className="flex flex-col justify-center items-end gap-4 sm:gap-6 bg-neutral-900 rounded-2xl w-full lg:w-[740px] px-3 sm:px-6 py-3 sm:py-4 mt-6 sm:mt-10 lg:mt-0 lg:ml-20">
					<div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 sm:gap-0">
						<span className="text-white font-urbanist text-base sm:text-xl md:text-[22px] font-normal leading-none">
							Cost for Event
						</span>
						<button className="text-white font-urbanist text-sm sm:text-base md:text-[22px] font-bold rounded-full bg-[#2F0457] px-4 sm:px-6 py-2 sm:py-3">
							Register Now
						</button>
					</div>

					<div className="flex items-center gap-2">
						<Image
							src={heartImg}
							alt="likes"
							width={48}
							height={20}
							className="w-12 h-5 object-contain"
						/>
						<Image
							src={vectorImg}
							alt="vector"
							width={24}
							height={24}
							className="w-6 h-6 object-contain"
						/>
					</div>
					<span className="text-neutral-300 text-sm font-urbanist">
						183 likes
					</span>
					<Image
						src={lineImg}
						alt="line"
						width={300}
						height={8}
						className="w-full h-2 object-contain"
					/>

					{/* Tags */}
					<div className="flex flex-col gap-4 w-full">
						<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								Event Tag
							</span>
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								Event Tag
							</span>
						</div>
						<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[396px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								Bigger Event Tag
							</span>
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								Event Tag
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Buttons */}
			<div className="w-full sm:w-[802px] h-[39px] bg-[#262626] rounded-full flex items-center justify-center mx-auto gap-[14px] sm:gap-[27px] overflow-x-auto scrollbar-hide px-2 sm:px-0">
				<div className="flex gap-[24px] sm:gap-[53px] min-w-max">
					<button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist">
						DETAILS
					</button>
					<button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist">
						DATE & DEADLINES
					</button>
					<button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist">
						SUBHEADING X
					</button>
					<button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist">
						PRIZES
					</button>
					<button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist">
						JOIN DISCUSSION COMMUNITY
					</button>
				</div>
			</div>

			{/* Sections Wrapper */}
			<div className="flex flex-col gap-[14px] sm:gap-[27px] w-full sm:w-[calc(100vw-122px)] mx-auto mt-[14px] sm:mt-[27px]">
				{/* Details Section */}
				<div className="flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px]">
					<div className="flex items-center gap-2">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Details for the Event
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
						nunc ut laoreet malesuada, nisl nunc laoreet justo, at porta nisi nulla
						in urna.
					</span>
				</div>

				{/* Dates & Deadlines Section */}
				<div className="flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px]">
					<div className="flex items-center gap-2">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Dates & Deadlines
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
						nunc ut laoreet malesuada, nisl nunc laoreet justo, at porta nisi nulla
						in urna.
					</span>
				</div>

				{/* SUBHEADING X */}
				<div className="flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px]">
					<div className="flex items-center gap-2">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Subheading X
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
						nunc ut laoreet malesuada, nisl nunc laoreet justo, at porta nisi nulla
						in urna.
					</span>
				</div>

				{/* Prizes Section */}
				<div className="flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3">
					<div className="flex items-center gap-3">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Prizes
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
						lacinia, augue sed suscipit fermentum, justo sapien pretium mi, ac
						facilisis purus orci sed nunc.
					</span>
				</div>

				{/* Join Discussion Community Section */}
				<div className="flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3">
					<div className="flex items-center gap-3">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Join Discussion Community
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Join our vibrant discussion community to connect with like-minded
						individuals, share ideas, and stay updated on the latest conversations
						and event updates.
					</span>
				</div>
			</div>
		</div>
	);
});

EventCard.displayName = "EventCard";

const EventCarousel: React.FC<EventCarouselProps> = ({
	category = "ALL Events",
	ev = [],
}) => {
	const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

	const sortedEvents = [...ev].sort((a, b) => {
		const dateA = new Date(a.startDate).getTime();
		const dateB = new Date(b.startDate).getTime();
		return dateA - dateB;
	});

	return (
		<div className="mb-16 px-4 sm:px-6 lg:px-8">
			<div className="w-full bg-transparent text-white py-6">
				<div className="flex justify-between items-center mb-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
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

				{sortedEvents.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{sortedEvents.map((event, index) => (
							<motion.div
								key={event._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="h-full"
							>
								<EventCard
									event={event}
									index={index}
								/>
							</motion.div>
						))}
					</div>
				) : (
					<div className="pl-2 md:pl-4 basis-full">
						<div className="flex justify-center items-center h-40 bg-purple-900/25 rounded-lg">
							<p className="text-gray-400">
								No Upcoming Events Currently
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(EventCarousel);
