"use client";

import type React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface DeleteModeToggleProps {
	deleteMode: boolean;
	setDeleteMode: (mode: boolean) => void;
}

const DeleteModeToggle: React.FC<DeleteModeToggleProps> = ({
	deleteMode,
	setDeleteMode,
}) => {
	return (
		<motion.div
			className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ scale: 1.05 }}
		>
			<Switch
				id="delete-mode"
				checked={deleteMode}
				onCheckedChange={() => setDeleteMode(!deleteMode)}
				className="data-[state=checked]:bg-red-600"
			/>
			<Label
				htmlFor="delete-mode"
				className={`font-medium ${
					deleteMode ? "text-red-400" : "text-white"
				}`}
			>
				Delete Mode
			</Label>
		</motion.div>
	);
};

export default DeleteModeToggle;
