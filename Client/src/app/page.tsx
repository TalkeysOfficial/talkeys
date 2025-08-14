"use client";

import EventCarousel from "@/components/EventCarousel";
import Hero from "@/components/Hero";
import CommunityCarousel from "@/components/CommunityCarousal";
import InfluencerCarousal from "@/components/InfluencerCarousal";
import HostEventSection from "@/components/HostEventSection";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import type { Event } from "@/types/types";
import PreviusCollabs from "@/components/PreviousCollabs";

export default function Home() {
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
	const [pastEvents, setPastEvents] = useState<Event[]>([]);
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

				const now = new Date();
				const upcoming = events.filter(
					(event) => new Date(event.startRegistrationDate) >= now,
				);
				const past = events.filter(
					(event) => new Date(event.startRegistrationDate) < now,
				);

				setUpcomingEvents(upcoming);
				setPastEvents(past);
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

			{!loading && upcomingEvents.length > 0 && (
				<EventCarousel
					ev={upcomingEvents}
					category="Upcoming Events"
				/>
			)}

			{!loading && pastEvents.length > 0 && (
				<EventCarousel
					ev={pastEvents}
					category="Past Events"
				/>
			)}

			<PreviusCollabs />
			<CommunityCarousel />
			<InfluencerCarousal />
			<HostEventSection />
		</GoogleOAuthProvider>
	);
}
