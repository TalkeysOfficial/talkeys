"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
	Menu,
	X,
	Search,
	Calendar,
	Users,
	Globe,
	MessagesSquare,
	LogOut,
	User,
	ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

import talkey_logo from "@/public/images/talkeyLogo.png";

const navItems = [
	{ name: "Explore", link: "/underConstruct", icon: Search },
	{ name: "Events", link: "/eventPage", icon: Calendar },
	{ name: "Communities", link: "/underConstruct", icon: Users },
	{ name: "Global", link: "/underConstruct", icon: Globe },
	{ name: "Inbox", link: "/underConstruct", icon: MessagesSquare },
];

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isSignedIn, setIsSignedIn } = useAuth();
	const [name, setName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const isMobile = useMediaQuery({ query: "(max-width: 950px)" });
	const pathname = usePathname();
	const menuRef = useRef<HTMLDivElement>(null);
	const profileMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateAvatar = () => {
			const storedName = localStorage.getItem("name") ?? "";
			const storedStyle = localStorage.getItem("avatarStyle") ?? "avataaars";
			const storedBg = localStorage.getItem("avatarBg") ?? "b6e3f4";
			setName(storedName);

			// Get only the first name by splitting on spaces and taking the first part
			const firstNameOnly = storedName.split(" ")[0];
			setFirstName(firstNameOnly);

			const seed = storedName.toLowerCase().replace(/[^a-z0-9]/g, "");
			const newAvatarUrl = `https://api.dicebear.com/7.x/${storedStyle}/svg?seed=${seed}&backgroundColor=${storedBg}`;
			setAvatarUrl(newAvatarUrl);
		};

		updateAvatar();

		window.addEventListener("storage", updateAvatar);
		return () => window.removeEventListener("storage", updateAvatar);
	}, [isSignedIn]);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target as Node)
			) {
				setIsProfileMenuOpen(false);
			}
		};

		if (isMenuOpen || isProfileMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen, isProfileMenuOpen]);

	// Close menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
		setIsProfileMenuOpen(false);
	}, [pathname]);

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);
	const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("name");
		setIsSignedIn(false);
		setName("");
		setFirstName("");
		setAvatarUrl("");
		setIsProfileMenuOpen(false);
	};

	const NavLinks = ({ isMobileView = false }) => (
		<>
			{navItems.map((item) => {
				const Icon = item.icon;
				const isActive = pathname === item.link;

				return (
					<motion.div
						key={item.name}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link
							href={item.link}
							className={`flex ${
								isMobileView
									? "flex-row items-center gap-3"
									: "flex-col items-center justify-center"
							} text-white hover:text-purple-300 transition-colors p-2 ${
								isActive ? "font-bold text-purple-400" : ""
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							<Icon
								size={24}
								className={`${isMobileView ? "" : "mb-1"} ${
									isActive ? "text-purple-400" : ""
								}`}
							/>
							<span className={isMobileView ? "" : "text-xs"}>
								{item.name}
							</span>
						</Link>
					</motion.div>
				);
			})}
		</>
	);

	const ProfileMenu = () => (
		<AnimatePresence>
			{isProfileMenuOpen && (
				<motion.div
					ref={profileMenuRef}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
					className="absolute right-0 mt-2 w-48 text-white bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
				>
					<div className="py-2 px-4 border-b border-gray-700 font-bold text-sm">
						Logged in as {name}
					</div>
					<Link
						href="/profile"
						className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-700 transition-colors"
						onClick={() => setIsProfileMenuOpen(false)}
					>
						<User size={16} />
						<span>Edit Avatar</span>
					</Link>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-red-700 transition-colors"
					>
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);

	const AuthButton = ({ isMobileView = false }) =>
		isSignedIn ? (
			isMobileView ? (
				<div className="mt-4 border-t border-gray-700 pt-4 text-white">
					<div className="flex items-center gap-3 px-2 mb-2">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={avatarUrl}
								alt={firstName}
							/>
							<AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
						</Avatar>
						<span className="font-medium">{firstName}</span>
					</div>
					<div className="flex flex-col gap-2 pl-2">
						<Link
							href="/profile"
							className="flex items-center gap-2 text-sm py-2 hover:text-purple-300 transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							<User size={16} />
							<span>Edit Avatar</span>
						</Link>
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 text-sm py-2 text-left hover:text-red-400 transition-colors"
						>
							<LogOut size={16} />
							<span>Logout</span>
						</button>
					</div>
				</div>
			) : (
				<div className="relative">
					<motion.button
						className="flex flex-col items-center"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={toggleProfileMenu}
						aria-expanded={isProfileMenuOpen}
						aria-haspopup="true"
					>
						<div className="relative">
							<Avatar className="h-8 w-8 mb-1 ring-2 ring-purple-500 ring-offset-2 ring-offset-black">
								<AvatarImage
									src={avatarUrl}
									alt={firstName}
								/>
								<AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
							</Avatar>
							<motion.div
								className="absolute -right-1 -bottom-1 bg-purple-600 rounded-full p-0.5"
								animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
								transition={{ duration: 0.2 }}
							>
								<ChevronDown size={12} />
							</motion.div>
						</div>
						<span className="text-xs text-white">{firstName}</span>
					</motion.button>
					<ProfileMenu />
				</div>
			)
		) : (
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Button
					asChild
					variant="outline"
					className="text-white hover:text-black hover:bg-white"
				>
					<Link href="/sign">Login</Link>
				</Button>
			</motion.div>
		);

	return (
		<div className="fixed top-0 w-full z-[1000]">
			<div className="flex px-2.5 sm:px-5 justify-between bg-black items-center">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Link href="/">
						<Image
							src={talkey_logo || "/placeholder.svg"}
							alt="Logo"
							width={180}
							height={180}
							quality={100}
							priority
							objectPosition="center"
							className="py-4 sm:py-3"
						/>
					</Link>
				</motion.div>

				{isMobile ? (
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<Button
							variant="default"
							size="icon"
							className="text-white bg-transparent hover:bg-gray-800"
							aria-label={isMenuOpen ? "Close menu" : "Open menu"}
						>
							<AnimatePresence mode="wait">
								{isMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
										onClick={() => setIsMenuOpen(false)}
									>
										<X size={28} />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
										onClick={() => setIsMenuOpen(true)}
									>
										<Menu size={28} />
									</motion.div>
								)}
							</AnimatePresence>
						</Button>
					</motion.div>
				) : (
					<NavigationMenu>
						<NavigationMenuList className="flex items-center gap-6">
							<NavLinks />
							<AuthButton />
						</NavigationMenuList>
					</NavigationMenu>
				)}
			</div>

			{/* Mobile Menu with Animation */}
			<AnimatePresence>
				{isMobile && isMenuOpen && (
					<motion.div
						ref={menuRef}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="absolute left-0 right-0 bg-black/95 backdrop-blur-sm overflow-hidden z-50 border-b border-purple-500/30"
					>
						<motion.div
							className="p-4 flex flex-col gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1, duration: 0.3 }}
						>
							{navItems.map((item, index) => {
								const Icon = item.icon;
								const isActive = pathname === item.link;

								return (
									<motion.div
										key={item.name}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: index * 0.05 + 0.1,
											duration: 0.3,
										}}
									>
										<Link
											href={item.link}
											className={`flex items-center gap-3 text-white hover:text-purple-300 transition-colors p-2 ${
												isActive ? "font-bold text-purple-400" : ""
											}`}
											onClick={() => setIsMenuOpen(false)}
										>
											<Icon
												size={24}
												className={
													isActive ? "text-purple-400" : ""
												}
											/>
											<span>{item.name}</span>
										</Link>
									</motion.div>
								);
							})}

							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									delay: navItems.length * 0.05 + 0.1,
									duration: 0.3,
								}}
							>
								<AuthButton isMobileView={true} />
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
		</div>
	);
};

export default Navbar;
