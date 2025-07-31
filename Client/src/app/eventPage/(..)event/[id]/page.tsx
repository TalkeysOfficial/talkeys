"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ParticularEventPage from "@/components/ParticularEventPage";
import type { Event } from "@/types/types";

export default function InterceptedEventPage() {
	const params = useParams();
	const router = useRouter();
	const eventId = params.id as string;
	const [event, setEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		async function fetchEventDetails() {
			try {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEventById/${eventId}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch event");
				}

				const data = await response.json();
				setEvent(data.data);
				setIsLoading(false);
			} catch (error: any) {
				console.error("Failed to fetch event details", error);
				setError(error.message);
				setIsLoading(false);
			}
		}

		if (eventId) {
			fetchEventDetails();
		}
	}, [eventId]);

	const handleClose = () => {
		setIsOpen(false);
		setTimeout(() => {
			router.back();
		}, 300); // Small delay to allow the closing animation to play
	};

	if (isLoading) {
		return (
			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none mt-6 p-0 bg-transparent">
					<div className="flex items-center justify-center h-40">
						<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error || !event) {
		return (
			<Dialog
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none mt-6 p-0 bg-transparent">
					<div className="bg-gray-900/80 rounded-lg p-8 text-center">
						<div className="text-red-500 text-xl mb-6">
							{error ?? "Event not found"}
						</div>
						<Button
							className="bg-purple-600 hover:bg-purple-700"
							onClick={handleClose}
						>
							Go Back
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => !open && handleClose()}
		>
			<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none mt-6 scrollbar-hide custom-scrollbar p-0 bg-transparent">
				<ParticularEventPage
					event={event}
					onClose={handleClose}
				/>
			</DialogContent>
		</Dialog>
	);
}
