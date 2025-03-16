"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteModeToggleProps {
	deleteMode: boolean;
	setDeleteMode: (mode: boolean) => void;
}

const DeleteModeToggle: React.FC<DeleteModeToggleProps> = ({
	deleteMode,
	setDeleteMode,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [showRipple, setShowRipple] = useState(false);
	const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

	// Reset animation state when delete mode changes
	useEffect(() => {
		if (deleteMode) {
			const timer = setTimeout(() => {
				setShowRipple(false);
			}, 600);
			return () => clearTimeout(timer);
		}
	}, [deleteMode]);

	const handleClick = (e: React.MouseEvent) => {
		// Calculate ripple position relative to button
		const rect = e.currentTarget.getBoundingClientRect();
		setRipplePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
		setShowRipple(true);
		setDeleteMode(!deleteMode);
	};

	return (
		<motion.div
			className={`relative flex items-center gap-3 px-4 py-3 rounded-lg ${
				deleteMode
					? "bg-gradient-to-r from-red-900/80 to-red-700/60 border border-red-500/50"
					: "bg-gray-800 border border-gray-700"
			} transition-colors duration-300`}
			initial={{ opacity: 0, x: 20 }}
			animate={{
				opacity: 1,
				x: 0,
				boxShadow: deleteMode
					? "0 0 15px rgba(239, 68, 68, 0.5)"
					: "0 0 0 rgba(0, 0, 0, 0)",
			}}
			transition={{
				duration: 0.3,
				boxShadow: { duration: 0.5 },
			}}
			whileHover={{
				scale: 1.03,
				boxShadow: deleteMode
					? "0 0 20px rgba(239, 68, 68, 0.6)"
					: "0 0 10px rgba(139, 92, 246, 0.3)",
			}}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			onClick={handleClick}
			role="button"
			aria-pressed={deleteMode}
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					setDeleteMode(!deleteMode);
					e.preventDefault();
				}
			}}
		>
			{/* Ripple effect */}
			<AnimatePresence>
				{showRipple && (
					<motion.div
						className={`absolute rounded-full ${
							deleteMode ? "bg-red-400/20" : "bg-purple-400/20"
						}`}
						initial={{
							width: 0,
							height: 0,
							x: ripplePosition.x,
							y: ripplePosition.y,
							opacity: 0.7,
						}}
						animate={{
							width: 300,
							height: 300,
							x: ripplePosition.x - 150,
							y: ripplePosition.y - 150,
							opacity: 0,
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6 }}
					/>
				)}
			</AnimatePresence>

			{/* Icon with animation */}
			<motion.div
				animate={{
					rotate: deleteMode ? [0, -10, 10, -10, 0] : 0,
					scale: deleteMode ? [1, 1.2, 1] : 1,
				}}
				transition={{
					duration: 0.5,
					times: [0, 0.2, 0.4, 0.6, 1],
					repeat: deleteMode ? 2 : 0,
					repeatDelay: 3,
				}}
				className={`p-1.5 rounded-full ${
					deleteMode ? "bg-red-500/30" : "bg-gray-700"
				}`}
			>
				{deleteMode ? (
					<AlertTriangle className="w-5 h-5 text-red-200" />
				) : (
					<Trash2 className="w-5 h-5 text-gray-300" />
				)}
			</motion.div>

			{/* Switch component */}
			<div className="flex items-center gap-3">
				<Switch
					id="delete-mode"
					checked={deleteMode}
					onCheckedChange={() => {}}
					className={`${
						deleteMode
							? "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-300"
							: "data-[state=unchecked]:bg-gray-700"
					} transition-colors duration-300`}
				/>

				<Label
					htmlFor="delete-mode"
					className={`font-medium select-none ${
						deleteMode ? "text-red-200" : "text-white"
					}`}
				>
					{deleteMode ? "Delete Mode Active" : "Delete Mode"}
				</Label>
			</div>

			{/* Pulse effect when active */}
			{deleteMode && (
				<motion.div
					className="absolute inset-0 rounded-lg bg-red-500/0 border border-red-500/0"
					animate={{
						boxShadow: [
							"0 0 0px rgba(239, 68, 68, 0)",
							"0 0 8px rgba(239, 68, 68, 0.5)",
							"0 0 0px rgba(239, 68, 68, 0)",
						],
						borderColor: [
							"rgba(239, 68, 68, 0)",
							"rgba(239, 68, 68, 0.5)",
							"rgba(239, 68, 68, 0)",
						],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
					}}
				/>
			)}
		</motion.div>
	);
};

export default DeleteModeToggle;
