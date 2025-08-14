// components/events/EventErrorView.tsx
import { Button } from "@/components/ui/button";

export function EventErrorView({ error }: { error: string }) {
	return (
		<div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-black/80 text-white p-4">
			<div className="bg-gray-900/80 rounded-lg p-8 max-w-md w-full text-center">
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
