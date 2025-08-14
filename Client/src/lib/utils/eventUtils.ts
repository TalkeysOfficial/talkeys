// utils/eventUtils.ts
import type { Event } from "@/types/types";

export function groupEventsByCategory(events: Event[], showPast: boolean) {
	const filtered = events.filter((event) =>
		showPast ? !event.isLive : event.isLive,
	);

	return filtered.reduce((acc: Record<string, Event[]>, ev) => {
		(acc[ev.category] = acc[ev.category] || []).push(ev);
		return acc;
	}, {});
}
