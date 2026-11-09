// components/events/EventToggleButton.tsx
import { Button } from "@/components/ui/button";

export function EventToggleButton({
	showPast,
	onToggle,
}: {
	showPast: boolean;
	onToggle: () => void;
}) {
	return (
		<Button
			variant="outline"
			className="bg-gray-900 hover:bg-black hover:text-white duration-300 text-white font-medium py-2 px-4 rounded-lg border border-purple-500"
			onClick={onToggle}
		>
			{showPast ? "Switch to Live Events" : "Switch to Past Events"}
		</Button>
	);
}
