// hooks/useEventLike.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { likeEvent, unlikeEvent } from "@/lib/services/eventApi";
import {
	clearStoredAuth,
	getStoredAccessToken,
	isAuthFailure,
} from "@/lib/utils/authToken";

export function useEventLike(
	eventId: string,
	initialLike?: boolean | null,
	initialLikes?: number,
) {
	const [isLike, setIsLike] = useState<boolean | null>(!!initialLike);
	const [likes, setLikes] = useState<number>(initialLikes ?? 0);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setIsLike(!!initialLike);
		setLikes(Math.max(Number(initialLikes || 0), 0));
	}, [eventId, initialLike, initialLikes]);

	async function toggle() {
		if (loading) return;
		if (!getStoredAccessToken()) {
			toast.error("Please log in to like events.");
			return;
		}

		const nextLiked = !isLike;
		const previousLiked = isLike;
		const previousLikes = likes;

		setLoading(true);
		setIsLike(nextLiked);
		setLikes((count) => Math.max(count + (nextLiked ? 1 : -1), 0));

		try {
			const response = nextLiked
				? await likeEvent(eventId)
				: await unlikeEvent(eventId);

			setIsLike(response.liked);
			setLikes(Math.max(Number(response.likes || 0), 0));
		} catch (error) {
			setIsLike(previousLiked);
			setLikes(previousLikes);

			if (isAuthFailure(error)) {
				clearStoredAuth();
				toast.error("Please log in again to like events.");
				return;
			}

			toast.error("Could not update like. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return { isLike, likes, loading, toggle };
}
