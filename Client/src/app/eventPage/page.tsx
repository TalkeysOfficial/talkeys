"use client";

import EventCarousel from "@/app/eventPage/EventCarousel";
import React, { useEffect, useState } from "react";
import type { Event } from "@/types/types";

const sampleData = {
	Gaming: [
		{
			_id: "678b9075f6deb135145b5636",
			name: "Kick-OFF 2025",
			category: "Gaming",
			mode: "offline",
			location: "Game Box, Patiala, Punjab",
			duration: "3 hours",
			ticketPrice: 0,
			totalSeats: 120,
			slots: 2,
			visibility: "public",
			prizes: "First Prize: $3000, Second Prize: $1500",
			photographs: [],
			startDate: new Date("2025-03-15T00:00:00.000Z"),
			startTime: "10:00 AM",
			endRegistrationDate: new Date("2025-03-10T00:00:00.000Z"),
			eventDescription:
				"A premier tech event featuring keynote speeches, workshops, and networking opportunities.",
			isLive: false,
		},
	],
} as Record<string, Event[]>;

function EventPage() {
	const [groupedEvents, setGroupedEvents] =
		useState<Record<string, Event[]>>(sampleData);

	useEffect(() => {
		async function fetchEvents() {
			const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
			const { data } = (await response.json()) as {
				data: {
					events: Event[];
				};
			};
			const { events } = data;
			const grouped = events.reduce((acc: Record<string, Event[]>, ev) => {
				if (!acc[ev.category]) {
					acc[ev.category] = [];
				}
				acc[ev.category].push(ev);
				return acc;
			}, {});
			setGroupedEvents(grouped);
		}
		fetchEvents();
		console.log("Fetching events", groupedEvents);
	}, []);

	return (
		<div className="py-36">
			<h1 className="text-white text-4xl px-10">Explore Events</h1>
			{Object.entries(groupedEvents).map(([category, events]) => (
				<EventCarousel
					key={category}
					title={category}
					events={events}
				/>
			))}
		</div>
	);
}

export default EventPage;
