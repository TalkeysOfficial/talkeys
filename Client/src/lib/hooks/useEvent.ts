// hooks/useEvents.ts
import { useEffect, useState } from "react";
import type { Event } from "@/types/types";

export function useEvents() {
	const [allEvents, setAllEvents] = useState<Event[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		document.title = "All Our Events";

		async function fetchEvents() {
			setIsLoading(true);
			try {
				const events = await getEventsWithLikes();
				setAllEvents(events);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchEvents();

		return () => {
			document.title = "Talkeys";
		};
	}, []);

	return { allEvents, isLoading, setAllEvents };
}

async function getEventsWithLikes() {
	const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
	const { data } = await response.json();
    interface EventsData {
        events: Event[];
    }

    const events: Event[] = (data as EventsData).events.map((e: Event): Event => ({ ...e, isLiked: false }));

	try {
		const res = await fetch(`${process.env.BACKEND_URL}/getAllLikedEvents`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		});
		if (res.ok) {
			const resData = await res.json();
			events.forEach((event) => {
				if (resData.likedEvents?.includes(event._id)) event.isLiked = true;
			});
		}
	} catch (error) {
		console.error("Error fetching liked events:", error);
	}

	return events;
}
