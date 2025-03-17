"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ResponsiveContainerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	padding?: "none" | "sm" | "md" | "lg";
	centered?: boolean;
	animate?: boolean;
}

const maxWidthClasses = {
	sm: "max-w-screen-sm",
	md: "max-w-screen-md",
	lg: "max-w-screen-lg",
	xl: "max-w-screen-xl",
	"2xl": "max-w-screen-2xl",
	full: "max-w-full",
};

const paddingClasses = {
	none: "px-0",
	sm: "px-4",
	md: "px-6 sm:px-8",
	lg: "px-4 sm:px-6 lg:px-8",
};

export function ResponsiveContainer({
	children,
	className,
	maxWidth = "lg",
	padding = "lg",
	centered = true,
	animate = true,
	...props
}: Readonly<ResponsiveContainerProps>) {
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	const Container = (animate ? motion.div : "div") as React.ElementType;
	const animationProps = animate
		? {
				initial: "hidden",
				animate: "visible",
				variants: containerVariants,
		  }
		: {};

	return (
		<Container
			className={cn(
				maxWidthClasses[maxWidth],
				paddingClasses[padding],
				centered && "mx-auto",
				"w-full",
				className,
			)}
			{...animationProps}
			{...props}
		>
			{children}
		</Container>
	);
}
