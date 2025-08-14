// components/events/EventLoadingView.tsx
import { Loader2 } from "lucide-react";

export function EventLoadingView() {
	return (
		<div className="min-h-screen pt-24 flex items-center justify-center bg-black/80 text-white">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="h-12 w-12 animate-spin text-purple-500" />
				<p className="text-lg">Loading event details...</p>
			</div>
		</div>
	);
}
