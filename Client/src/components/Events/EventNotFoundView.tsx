// components/events/EventNotFoundView.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EventNotFoundView({ returnOrigin }: { returnOrigin: string }) {
	return (
		<div className="min-h-screen pt-24 flex items-center justify-center bg-black/80 text-white">
			<div className="bg-gray-900/80 rounded-lg p-8 max-w-md w-full text-center">
				<div className="text-red-500 text-xl">Event not found</div>
				<Link
					href={returnOrigin}
					className="mt-6 inline-block"
				>
					<Button className="bg-purple-600 hover:bg-purple-700">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to {returnOrigin === "/eventPage" ? "Events" : "Home"}
					</Button>
				</Link>
			</div>
		</div>
	);
}
