"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useEventDetails } from "@/features/events/hooks/useEventDetails";
import { EventLoadingView } from "@/features/events/components/EventLoadingView";
import { EventErrorView } from "@/features/events/components/EventErrorView";
import { EventNotFoundView } from "@/features/events/components/EventNotFoundView";
import { Button } from "@/components/ui/button";
import ParticularEventPage from "@/features/events/components/ParticularEventPage";

export default function EventPage() {
	const params = useParams();
	const router = useRouter();
	const eventId = params.id as string;

	const { event, loading, error, returnOrigin } = useEventDetails(eventId);

	const handleClose = () => router.push(returnOrigin);

	if (loading) return <EventLoadingView />;
	if (error) return <EventErrorView error={error} />;
	if (!event) return <EventNotFoundView returnOrigin={returnOrigin} />;

	return (
		<motion.div
			className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black/80 text-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="max-w-6xl mx-auto">
				{/* Back button */}
				<div className="mb-6">
					<Link href={returnOrigin}>
						<Button
							variant="ghost"
							className="text-white hover:bg-gray-800"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to {returnOrigin === "/eventPage" ? "Events" : "Home"}
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
