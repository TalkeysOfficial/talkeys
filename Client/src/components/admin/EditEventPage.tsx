"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AdminEventForm from "@/components/admin/AdminEventForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Event } from "@/types/types";

export default function EditEventPage({ eventId }: { eventId: string }) {
	const [event, setEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		const fetchEvent = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/admin/events/${eventId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
						},
						signal: controller.signal,
					},
				);
				const payload = await response.json().catch(() => ({}));

				if (!response.ok) {
					throw new Error(payload.message || "Could not load event");
				}

				setEvent(payload.data);
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") return;
				setError(err instanceof Error ? err.message : "Could not load event");
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		fetchEvent();
		return () => controller.abort();
	}, [eventId]);

	if (isLoading) {
		return (
			<div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 py-8">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="mx-auto max-w-6xl space-y-6 px-4 py-8 text-white">
				<Link
					href="/admin"
					className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to admin
				</Link>
				<Alert className="border-red-500/30 bg-red-500/10 text-red-200">
					<AlertTitle>Event unavailable</AlertTitle>
					<AlertDescription>
						{error || "This event could not be loaded."}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<AdminEventForm
			mode="edit"
			eventId={eventId}
			initialEvent={event}
		/>
	);
}
