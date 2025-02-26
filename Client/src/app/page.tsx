"use client";

import EventCarousel from "@/components/EventCarousel";
import Hero from "@/components/Hero";
import CommunityCarousel from "@/components/CommunityCarousal";
import InfluencerCarousal from "@/components/InfluencerCarousal";
import HostEventSection from "@/components/HostEventSection";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import type { Event } from "@/types/types";

export default function Home() {
	const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEvents`,
				);
				const { data } = (await response.json()) as {
					data: {
						events: Event[];
					};
				};
				const { events } = data;
				const upcomingEvents = events.filter(
					(event) => new Date(event.startDate) >= new Date(),
				);
				setFetchedEvents(upcomingEvents);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	return (
		<GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com">
			<Hero />
			{!loading && (
				<EventCarousel
					ev={fetchedEvents}
					category="Upcoming Events"
				/>
			)}
			<CommunityCarousel />
			<InfluencerCarousal />
			<HostEventSection />
		</GoogleOAuthProvider>
	);
}
