// components/event/EventHeader.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, CalendarDays, Heart, MapPin, X } from "lucide-react";
import { getSafeImageSrc } from "@/lib/utils";

type HeaderProps = {
	event: any;
	formatTime: (time: string) => string;
	isLike: boolean | null;
	likes: number;
	toggleLike: () => void;
	onClose?: () => void;
};

export default function EventHeader({
	event,
	formatTime,
	isLike,
	likes,
	toggleLike,
	onClose,
}: HeaderProps) {
	const organizer =
		event.organizerName || event.collegeName || event.festName || "Talkeys";

	return (
		<section className="relative overflow-hidden bg-[#0d0d10] px-5 py-5 sm:px-8 sm:py-7">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(138,68,203,0.45),transparent_34%),linear-gradient(90deg,rgba(29,7,48,0.9),rgba(8,8,10,0.92)_62%)]" />

			{onClose ? (
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/60 text-white transition hover:bg-red-500/80"
					aria-label="Close"
				>
					<X className="h-5 w-5" />
				</button>
			) : null}

			<div className="relative flex w-full max-w-full flex-col gap-5 md:flex-row md:items-center">
				<div className="relative mx-auto aspect-[4/5] w-full max-w-[210px] shrink-0 overflow-hidden rounded-lg bg-black shadow-xl shadow-black/50 md:mx-0 md:w-[178px]">
					<Image
						src={getSafeImageSrc(event.photographs?.[0])}
						alt={event.name}
						fill
						priority
						className="object-cover"
						sizes="(max-width: 768px) 210px, 178px"
					/>
				</div>

				<div className="min-w-0 max-w-full flex-1 text-center md:text-left">
					<h1 className="max-w-full break-words text-3xl font-semibold leading-tight text-white sm:text-4xl">
						{event.name}
					</h1>
					<p className="mx-auto mt-2 w-full max-w-full break-words text-sm leading-6 text-gray-300 md:mx-0 md:max-w-4xl md:text-base">
						{event.eventDescription || "Add a fun, exciting description or theme here"}
					</p>

					<div className="mt-5 grid gap-3 text-sm text-white sm:grid-cols-2">
						<div className="flex min-w-0 items-center justify-center gap-3 md:justify-start">
							<Building2 className="h-5 w-5 shrink-0 text-purple-400" />
							<span className="truncate">{organizer}</span>
						</div>
						<div className="flex min-w-0 items-center justify-center gap-3 md:justify-start">
							<MapPin className="h-5 w-5 shrink-0 text-purple-400" />
							<span className="truncate">{event.location || "Online Event"}</span>
						</div>
						<div className="flex min-w-0 items-center justify-center gap-3 sm:col-span-2 md:justify-start">
							<CalendarDays className="h-5 w-5 shrink-0 text-purple-400" />
							<span>
								{new Date(event.startDate).toLocaleDateString("en-IN")} at{" "}
								{formatTime(event.startTime)}
							</span>
						</div>
					</div>
				</div>

				<motion.button
					type="button"
					onClick={toggleLike}
					className="mt-2 inline-flex items-center gap-2 self-center rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm text-white transition hover:border-purple-300 md:absolute md:bottom-4 md:right-4 md:mt-0 md:self-auto"
					aria-label={isLike ? "Unlike event" : "Like event"}
					animate={{ scale: isLike ? 1.04 : 1 }}
					transition={{ type: "spring", stiffness: 300, damping: 18 }}
				>
					<Heart
						className={`h-4 w-4 ${isLike ? "fill-purple-300 text-purple-300" : "text-gray-300"}`}
					/>
					<span>{likes}</span>
				</motion.button>
			</div>
		</section>
	);
}
