import { Event } from "@/types/types"; // adjust path if needed

export default function EventJsonLd({ event }: { event: Event }) {
	const datePart = new Date(event.startDate).toISOString().split("T")[0]; // "2025-08-07"
	const startDateTime = `${datePart}T${event.startTime}:00+05:30`; // adjust TZ if needed
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.name,
		description: event.eventDescription || "",
		startDate: startDateTime,
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode:
			event.mode === "online"
				? "https://schema.org/OnlineEventAttendanceMode"
				: "https://schema.org/OfflineEventAttendanceMode",
		location:
			event.mode === "offline"
				? {
						"@type": "Place",
						name: event.location || "TBA",
						address: event.location || "TBA",
				  }
				: {
						"@type": "VirtualLocation",
						url: event.registrationLink || "",
				  },
		image: event.photographs || [],
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${event._id}`,
		offers: {
			"@type": "Offer",
			price: event.isPaid ? event.ticketPrice : 0,
			priceCurrency: "INR",
			availability:
				event.slots > 0
					? "https://schema.org/InStock"
					: "https://schema.org/SoldOut",
			url: event.registrationLink || "",
		},
		...(event.organizerName && {
			organizer: {
				"@type": "Organization",
				name: event.organizerName,
				...(event.organizerEmail && { email: event.organizerEmail }),
				...(event.organizerContact && {
					telephone: event.organizerContact,
				}),
				...(event.collegeName && { location: event.collegeName }),
			},
		}),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
