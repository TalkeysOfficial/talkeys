// components/event/EventHeader.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import heartImg from "@/public/images/heart.png";
import vectorImg from "@/public/images/Vector.png";
import lineImg from "@/public/images/Line 4.png";
import locationImg from "@/public/images/location.png";
import dateImg from "@/public/images/Date.png";

type HeaderProps = {
	event: any;
	formatTime: (t: string) => string;
	isLike: boolean | null;
	likes: number;
	toggleLike: () => void;
	onClose?: () => void;
	children?: React.ReactNode; // Add children prop for controls
};

export default function EventHeader({
	event,
	formatTime,
	isLike,
	likes,
	toggleLike,
	onClose,
	children,
}: HeaderProps) {
	return (
		<>
			{onClose && (
				<div className="flex justify-start px-2 sm:px-4 mt-2">
					<button
						onClick={onClose}
						className="text-white text-lg sm:text-xl font-bold hover:text-red-400 transition-all"
						aria-label="Close"
					>
						✖
					</button>
				</div>
			)}

			<div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 mt-6 sm:mt-10 mb-10 sm:mb-20 w-full max-w-full overflow-hidden px-2 pl-8">
				<Image
					src={event.photographs?.[0] || "/images/placeholder.jpg"}
					alt={`${event.name}-banner`}
					width={253}
					height={320}
					className="object-cover rounded-xl w-auto max-w-full h-auto flex-shrink-0"
				/>

				<div className="flex flex-col gap-4 sm:gap-6 w-full max-w-md lg:max-w-lg text-[32px] sm:text-[54px] font-urbanist leading-none font-semibold mt-4 lg:mt-0 min-w-0">
					<span className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-urbanist leading-tight break-words">
						{event.name}
					</span>

					<div className="flex flex-col gap-2 sm:gap-4 text-white font-urbanist min-w-0">
						<div className="flex items-start gap-2 min-w-0">
							<Image
								src={locationImg}
								alt="location"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain flex-shrink-0 mt-1"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal break-words overflow-wrap-anywhere min-w-0 flex-1 leading-snug">
								{event.location ?? "To Be Decided"}
							</span>
						</div>

						<div className="flex items-start gap-2 min-w-0">
							<Image
								src={dateImg}
								alt="date"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain flex-shrink-0 mt-1"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal break-words min-w-0 flex-1">
								{new Date(event.startDate).toLocaleDateString("en-IN")}{" "}
								at {formatTime(event.startTime)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-center items-end gap-[25px] px-4 sm:px-8 py-4 bg-neutral-900 rounded-2xl mt-6 sm:mt-10 w-full max-w-md lg:max-w-lg flex-shrink-0">
					<div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-2 sm:gap-4">
						<span className="text-white font-urbanist text-base sm:text-xl md:text-[22px] font-normal leading-none">
							Cost for Event
						</span>
						<div className="w-full sm:w-auto">{children}</div>
					</div>

					<div className="flex justify-end items-center gap-2 w-full">
						<div className="flex items-center gap-2">
							<motion.img
								src={heartImg.src}
								alt="likes"
								className="w-12 h-5 object-contain cursor-pointer transition-transform hover:scale-105"
								onClick={toggleLike}
								animate={{ scale: isLike ? 1.1 : 1 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 12,
								}}
							/>
							<img
								src={vectorImg.src}
								alt="vector"
								className="w-6 h-6 object-contain"
							/>
						</div>
						<span className="block text-white text-sm font-urbanist">
							{likes} likes
						</span>
					</div>

					<Image
						src={lineImg}
						alt="line"
						width={300}
						height={8}
						className="w-full h-2 object-contain"
					/>

					<div className="flex flex-col gap-4 w-full">
						<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								{event.category}
							</span>
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								{event.mode}
							</span>
						</div>

						<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[396px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								{event.visibility}
							</span>
							<span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
								{event.type ?? "Event Type"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
