"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Heart, Send } from "lucide-react";
import Image from "next/image";
import placeholderImage from "@/public/images/events.jpg";
import { Event } from "@/app/eventPage/page";

export default function EventPage({ event }: { readonly event: Event }) {
	return (
		<main
			className="bg-black text-white"
			role="main"
		>
			<div className="container mx-auto p-4 sm:p-6 max-w-[1200px]">
				{/* Header Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
					{/* Left Column - Event Image */}
					<div className="relative aspect-[4/3] md:aspect-auto">
						<Image
							src={event.photographs?.[0] ?? placeholderImage}
							alt={`${event.name}-banner`}
							className="rounded-lg object-scale-down object-center"
							fill
							priority
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>

					{/* Right Column - Event Details */}
					<div className="space-y-4 md:space-y-6">
						<div>
							<h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
								{event.name}
							</h1>
							<div className="space-y-1.5 md:space-y-2 text-gray-400 text-sm md:text-base">
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									<span>{event.location ?? "Online Event"}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<span>
										{new Date(event.startDate).toLocaleDateString()}{" "}
										{event.startTime}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<User className="w-4 h-4" />
									<span>
										{event.mode === "offline"
											? "In-person Event"
											: "Online Event"}
									</span>
								</div>
							</div>
						</div>

						{/* Cost Section */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div className="text-base md:text-lg">
								Cost: ₹{event.ticketPrice}
							</div>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
								aria-label="Register for event"
							>
								Coming Soon
							</Button>
						</div>

						{/* Tags */}
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">{event.category}</Badge>
								<Badge variant="secondary">{event.mode}</Badge>
								<Badge variant="secondary">{event.visibility}</Badge>
							</div>
							<div className="flex gap-4">
								<button
									aria-label="Like event"
									className="hover:text-purple-400 transition-colors"
								>
									<Heart className="w-5 h-5 text-gray-400" />
								</button>
								<button
									aria-label="Share event"
									className="hover:text-purple-400 transition-colors"
								>
									<Send className="w-5 h-5 text-gray-400" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<Tabs
					defaultValue="details"
					className="w-full"
					aria-label="Event information tabs"
				>
					<TabsList className="bg-gray-900 border-b border-gray-800 w-full overflow-x-auto flex-nowrap overflow-y-hidden">
						<TabsTrigger
							value="details"
							className="text-sm sm:text-base"
						>
							Details
						</TabsTrigger>
						<TabsTrigger
							value="dates"
							className="text-sm sm:text-base"
						>
							Dates & Deadlines
						</TabsTrigger>
						<TabsTrigger
							value="prizes"
							className="text-sm sm:text-base"
						>
							Prizes
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="details"
						className="py-4"
					>
						<div className="bg-gray-900 p-6 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">
								Details for the Event
							</h3>
							<p className="text-gray-400">{event.eventDescription}</p>
						</div>
					</TabsContent>

					<TabsContent
						value="dates"
						className="py-4"
					>
						<div className="bg-gray-900 p-6 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">
								Dates & Deadlines
							</h3>
							<p className="text-gray-400">
								Start Date:{" "}
								{new Date(event.startDate).toLocaleDateString()}
								<br />
								Start Time: {event.startTime}
								<br />
								Duration: {event.duration}
								<br />
								Registration Deadline:{" "}
								{new Date(
									event.endRegistrationDate,
								).toLocaleDateString()}
							</p>
						</div>
					</TabsContent>

					<TabsContent
						value="prizes"
						className="py-4"
					>
						<div className="bg-gray-900 p-6 rounded-lg">
							<h3 className="text-xl font-semibold mb-4">Prizes</h3>
							<p className="text-gray-400">
								{event.prizes ?? "No prize information available."}
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
