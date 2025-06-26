"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	User,
	Clock3,
	UserCheck2,
	Bookmark,
	FolderKanban,
	LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/authContext";

const NAV = {
	general: [
		{ label: "Profile", href: "/dashboard/profile", icon: User },
		{
			label: "Recent Activity",
			href: "/dashboard/recent-activity",
			icon: Clock3,
		},
	],
	events: [
		{ label: "Registered", href: "/dashboard/registered", icon: UserCheck2 },
		{ label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
		{ label: "Hosted", href: "/dashboard/hosted", icon: FolderKanban },
	],
};

export default function Sidebar() {
	const pathname = usePathname();
	const { isSignedIn } = useAuth();

	const name = localStorage.getItem("name")! ?? "Guest User";
	const seed = name.toLowerCase().replace(/[^a-z0-9]/g, "");
	const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
	const username = `@${name.toLowerCase().replace(/\s+/g, "")}`;

	return (
		<aside
			className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)]
                    bg-slate-900/90 backdrop-blur-sm flex flex-col z-40"
		>
			{/* header-card */}
			<header
				className="bg-gradient-to-r from-purple-700 to-purple-900
                            p-4 flex gap-3 items-center rounded-tr"
			>
				<Avatar className="h-14 w-14 ring-2 ring-purple-300 shrink-0">
					<AvatarImage src={avatar} />
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>

				<div className="truncate leading-tight">
					<p className="font-bold text-white truncate">{name}</p>
					<p className="text-sm text-gray-200 truncate">{username}</p>
					<p className="text-xs text-gray-300">he/him</p>
				</div>
			</header>

			{/* nav groups (scrolls if content exceeds viewport) */}
			<div className="flex-1 overflow-y-auto pt-4">
				<Group title="GENERAL">
					{NAV.general.map((i) => (
						<Item
							key={i.href}
							{...i}
							active={pathname === i.href}
						/>
					))}
				</Group>

				<Group title="EVENTS">
					{NAV.events.map((i) => (
						<Item
							key={i.href}
							{...i}
							active={pathname === i.href}
						/>
					))}
				</Group>
			</div>

			{/* sticky logout */}
			{isSignedIn && (
				<footer className="px-4 pb-4">
					<button
						onClick={() => {
							localStorage.clear();
							window.location.href = "/";
						}}
						className="w-full flex items-center justify-center gap-2 text-sm
                          rounded border border-gray-700 py-2 text-gray-200
                          hover:bg-red-600/20 hover:text-white transition-colors"
					>
						<LogOut size={16} /> Logout
					</button>
				</footer>
			)}
		</aside>
	);
}

function Group({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="px-5 mt-4 first:mt-0">
			<h3
				className="mb-2 text-[11px] font-semibold tracking-widest
                        uppercase text-gray-400"
			>
				{title}
			</h3>
			<ul className="space-y-1">{children}</ul>
		</section>
	);
}

interface ItemProps {
	label: string;
	href: string;
	icon: React.ElementType;
	active: boolean;
}
function Item({ label, href, icon: Icon, active }: ItemProps) {
	return (
		<li>
			<Link
				href={href}
				className={`relative flex items-center gap-3 py-2 pl-2 pr-3 rounded-md
                       transition-colors select-none
                       ${
									active
										? "text-white font-medium"
										: "text-gray-400 hover:text-gray-200"
								}`}
			>
				<AnimatePresence>
					{active && (
						<motion.span
							layoutId="sidebar-active"
							className="absolute inset-y-0 left-0 w-1 bg-purple-500 rounded-r"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>
					)}
				</AnimatePresence>

				<Icon size={18} />
				<span>{label}</span>
			</Link>
		</li>
	);
}
