// utils/eventUtils.ts
import type { Event, EventPassType } from "@/types/types";

export function groupEventsByCategory(events: Event[], showPast: boolean) {
	const filtered = events.filter((event) =>
		showPast ? !event.isLive : event.isLive,
	);

	return filtered.reduce((acc: Record<string, Event[]>, ev) => {
		(acc[ev.category] = acc[ev.category] || []).push(ev);
		return acc;
	}, {});
}

export function getEventPassTypes(event: Event): EventPassType[] {
	const passTypes = event.passTypes?.filter((passType) => passType.isActive !== false) ?? [];

	if (passTypes.length) {
		return passTypes.map((passType) => ({
			...passType,
			id: passType.id || passType._id || "general",
			_id: passType._id || passType.id || "general",
			price: Number(passType.price || 0),
		}));
	}

	const totalQuantity = Number(event.totalSeats || 0);
	const soldQuantity = Number(event.registrationCount || 0);

	return [
		{
			id: "general",
			_id: "general",
			name: "General Pass",
			price: Number(event.ticketPrice || 0),
			description: "",
			totalQuantity,
			maxAvailable: totalQuantity,
			soldQuantity,
			bookedQuantity: soldQuantity,
			availableQuantity: Math.max(totalQuantity - soldQuantity, 0),
			isActive: true,
		},
	];
}

export function getEventDisplayPrice(event: Event) {
	const passTypes = getEventPassTypes(event);
	const activePrices = passTypes.map((passType) => passType.price);
	return activePrices.length ? Math.min(...activePrices) : Number(event.ticketPrice || 0);
}
