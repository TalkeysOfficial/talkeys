"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
	rightContent?: React.ReactNode;
	animation?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	description,
	className,
	rightContent,
	animation = true,
}) => {
	const headerVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	return (
		<motion.div
			className={cn(
				"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6",
				className,
			)}
			initial={animation ? "hidden" : false}
			animate={animation ? "visible" : false}
			variants={headerVariants}
		>
			<div>
				<h1 className="text-3xl font-bold text-white">{title}</h1>
				{description && <p className="text-gray-400 mt-1">{description}</p>}
			</div>
			{rightContent && (
				<div className="mt-2 sm:mt-0 w-full sm:w-auto">{rightContent}</div>
			)}
		</motion.div>
	);
};

export default PageHeader;
