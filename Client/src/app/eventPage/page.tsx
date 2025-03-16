// @ts-nocheck
// @ts-ignore


"use client";

import EventCarousel from "@/components/EventCarousel";
import React, { useEffect, useState } from "react";
import type { Event } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";

function EventPage() {
	const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>(
		{},
	);

	useEffect(() => {
		async function fetchEvents() {
			const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
			const { data } = (await response.json()) as {
				data: {
					events: Event[];
				};
			};
			const { events } = data;

			events.forEach((event) => {
				event.isLiked = false;
			});

			const res = await fetch(
				`${process.env.BACKEND_URL}/getAllLikedEvents`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					},
				},
			);

			if (res.status !== 404 || res.status !== 401) {
				const resData = await res.json();
				events.forEach((event) => {
					if (resData.likedEvents?.includes(event._id)) {
						event.isLiked = true;
					}
				});
			}

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
	}, []);

	return (
		<AnimatePresence>
			<motion.div
				className="flex flex-col min-h-screen"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 1.05 }}
			>
				<div className="flex-grow py-36">
					<h1 className="text-white text-4xl px-10">Explore Events</h1>
					{Object.entries(groupedEvents).map(([category, ev]) => (
						<EventCarousel key={category} category={category} ev={ev} />
					))}
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default EventPage;
