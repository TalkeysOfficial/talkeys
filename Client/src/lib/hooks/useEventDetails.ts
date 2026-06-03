// hooks/useEventDetails.ts
import { useState, useEffect } from "react";
import type { Event } from "@/types/types";
import { getStoredAccessToken } from "@/lib/utils/authToken";

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
				const eventData = {
					...data.data,
					isLiked: false,
					likes: Number(data.data?.likes || 0),
				};
				const token = getStoredAccessToken();

				if (token) {
					try {
						const likedResponse = await fetch(
							`${process.env.BACKEND_URL}/getAllLikedEvents`,
							{
								headers: {
									Authorization: `Bearer ${token}`,
								},
							},
						);

						if (likedResponse.ok) {
							const likedData = await likedResponse.json();
							eventData.isLiked = Boolean(
								likedData.likedEvents?.includes(eventData._id),
							);
						}
					} catch (likeError) {
						console.error("Failed to fetch liked state", likeError);
					}
				}

				setEvent(eventData);
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
