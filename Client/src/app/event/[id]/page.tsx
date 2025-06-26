"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ParticularEventPage from "@/components/ParticularEventPage";
import type { Event } from "@/types/types";

export default function EventPage() {
	const params = useParams();
	const router = useRouter();
	const eventId = params.id as string;
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [originPage, setOriginPage] = useState<string>("/eventPage");

	useEffect(() => {
		// Scroll to top when component mounts
		window.scrollTo(0, 0);

		// Get the origin page from localStorage
		const storedOrigin = localStorage.getItem("eventOrigin");
		if (storedOrigin) {
			setOriginPage(storedOrigin);
		}

		async function fetchEventDetails() {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEventById/${eventId}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch event");
				}

				const data = await response.json();
				setEvent(data.data);
				setLoading(false);
			} catch (error: any) {
				console.error("Failed to fetch event details", error);
				setError(error.message);
				setLoading(false);
			}
		}

		if (eventId) {
			fetchEventDetails();
		}
	}, [eventId]);

	const handleClose = () => {
		router.push(originPage);
	};

	if (loading) {
		return (
			<div className="min-h-screen pt-16 sm:pt-24 flex items-center justify-center bg-black/80 text-white">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-12 w-12 animate-spin text-purple-500" />
					<div className="loader"></div>
					<p className="text-lg">Loading event details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen pt-16 sm:pt-24 flex flex-col items-center justify-center bg-black/80 text-white p-4">
				<div className="bg-gray-900/80 rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
					<div className="text-red-500 text-xl mb-6">Error: {error}</div>
					<Button
						className="bg-purple-600 hover:bg-purple-700"
						onClick={() => window.location.reload()}
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="min-h-screen pt-16 sm:pt-24 flex items-center justify-center bg-black/80 text-white">
				<div className="bg-gray-900/80 rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
					<div className="text-red-500 text-xl">Event not found</div>
					<Link
						href={originPage}
						className="mt-6 inline-block"
					>
						<Button className="bg-purple-600 hover:bg-purple-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to {originPage === "/" ? "Home" : "Events"}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			className="min-h-screen pt-16 sm:pt-24 pb-12 px-3 sm:px-4 md:px-8 bg-black/80 text-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="max-w-6xl mx-auto">
				{/* Back button */}
				<div className="mb-4 sm:mb-6">
					<Link href={originPage}>
						<Button
							variant="ghost"
							className="text-white hover:bg-gray-800"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to {originPage === "/" ? "Home" : "Events"}
						</Button>
					</Link>
				</div>

				{/* Main content */}
				<div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
					<ParticularEventPage
						event={event}
						onClose={handleClose}
					/>
				</div>
			</div>
		</motion.div>
	);
}

