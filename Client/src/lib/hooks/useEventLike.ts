// hooks/useEventLike.ts
import { useState } from "react";
import { likeEvent, unlikeEvent } from "@/lib/services/eventApi";

export function useEventLike(
	eventId: string,
	initialLike?: boolean | null,
	initialLikes?: number,
) {
	const [isLike, setIsLike] = useState<boolean | null>(!!initialLike);
	const [likes, setLikes] = useState<number>(initialLikes ?? 0);
	const [loading, setLoading] = useState(false);

	async function toggle() {
		if (loading) return;
		setLoading(true);
		try {
			if (isLike) await unlikeEvent(eventId);
			else await likeEvent(eventId);
			setIsLike((p) => !p);
			setLikes((p) => (isLike ? p - 1 : p + 1));
		} finally {
			setLoading(false);
		}
	}

	return { isLike, likes, loading, toggle };
}
