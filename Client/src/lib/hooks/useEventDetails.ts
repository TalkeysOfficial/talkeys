// hooks/useEventDetails.ts
import { useState, useEffect } from "react";
import type { Event } from "@/types/types";

export function useEventDetails(eventId: string | undefined) {
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [returnOrigin, setReturnOrigin] = useState("/eventPage");

	useEffect(() => {
		window.scrollTo(0, 0);

		// Read origin from localStorage
		const storedOrigin = localStorage.getItem("eventOrigin");
		if (storedOrigin) {
			setReturnOrigin(storedOrigin);
		}

		async function fetchEventDetails() {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEventById/${eventId}`,
				);

				if (!response.ok) throw new Error("Failed to fetch event");

				const data = await response.json();
				setEvent(data.data);
			} catch (err: any) {
				console.error("Failed to fetch event details", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		if (eventId) fetchEventDetails();
	}, [eventId]);

	return { event, loading, error, returnOrigin };
}
