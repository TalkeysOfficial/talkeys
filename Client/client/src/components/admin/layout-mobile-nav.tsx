"use client";

import type React from "react";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, PlusCircle, LayoutDashboard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
	isOpen: boolean;
	onToggle: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onToggle }) => {
	const pathname = usePathname();

	// Close menu when route changes
	useEffect(() => {
		if (isOpen) {
			onToggle();
		}
	}, [pathname]);

	const navItems = [
		{ href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
		{ href: "/admin/qrScanner", icon: QrCode, label: "QR Code Reader" },
		{ href: "/admin/addEvent", icon: PlusCircle, label: "Add Event" },
	];

	const menuVariants = {
		closed: {
			opacity: 0,
			height: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
		open: {
			opacity: 1,
			height: "auto",
			transition: {
				duration: 0.3,
				ease: "easeInOut",
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		closed: { opacity: 0, x: -20 },
		open: { opacity: 1, x: 0 },
	};

	return (
		<div className="pt-5 md:hidden">
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={onToggle}
				className="fixed top-[100px] left-2.5 z-50 bg-gray-800 border-gray-700 p-2 rounded-md text-white"
				aria-label={isOpen ? "Close menu" : "Open menu"}
			>
				<AnimatePresence mode="wait">
					{isOpen ? (
						<motion.div
							key="close"
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<X className="h-5 w-5 text-white" />
						</motion.div>
					) : (
						<motion.div
							key="menu"
							initial={{ rotate: 90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Menu className="h-5 w-5 text-white" />
						</motion.div>
					)}
				</AnimatePresence>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
						className="fixed left-0 top-[140px] z-40 w-64 bg-gray-900/95 backdrop-blur-sm p-4 shadow-lg rounded-r-lg border-r border-t border-b border-purple-500/30"
					>
						<nav className="space-y-2">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;

								return (
									<motion.div
										key={item.href}
										variants={itemVariants}
									>
										<Link
											href={item.href}
											className={cn(
												"flex items-center space-x-2 text-gray-300 hover:text-white transition-colors",
												"rounded-lg p-3 hover:bg-gray-800/70",
												isActive &&
													"bg-purple-800/50 text-white font-medium border-l-4 border-purple-500",
											)}
											onClick={onToggle}
										>
											<Icon className="h-5 w-5" />
											<span>{item.label}</span>
										</Link>
									</motion.div>
								);
							})}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MobileNav;
