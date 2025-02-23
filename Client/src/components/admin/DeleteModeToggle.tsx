import type React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DeleteModeToggleProps {
	deleteMode: boolean;
	setDeleteMode: (mode: boolean) => void;
}

const DeleteModeToggle: React.FC<DeleteModeToggleProps> = ({
	deleteMode,
	setDeleteMode,
}) => {
	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="delete-mode"
				name="delete-mode"
				checked={deleteMode}
				onCheckedChange={() => setDeleteMode(!deleteMode)}
				className="bg-gray-400 border-gray-300 checked:bg-red-600 checked:border-red-700 focus:ring-2 focus:ring-red-500 hover:opacity-80"
			/>
			<Label htmlFor="delete-mode">Delete Mode</Label>
		</div>
	);
};

export default DeleteModeToggle;
