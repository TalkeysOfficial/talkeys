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
	LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

import talkey_logo from "@/public/images/talkeyLogo.png";

const baseNavItems = [
	{ name: "Explore", link: "/underConstruct", icon: Search },
	{ name: "Events", link: "/eventPage", icon: Calendar },
	{ name: "Communities", link: "/underConstruct", icon: Users },
	{ name: "Global", link: "/underConstruct", icon: Globe },
	{ name: "Inbox", link: "/underConstruct", icon: MessagesSquare },
];

interface NavLinksProps {
	navItems: typeof baseNavItems;
	pathname: string;
	isMobileView?: boolean;
	setIsMenuOpen: (value: boolean) => void;
}

const NavLinks = ({
	navItems,
	pathname,
	isMobileView = false,
	setIsMenuOpen,
}: NavLinksProps) => (
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

interface ProfileMenuProps {
	isProfileMenuOpen: boolean;
	profileMenuRef: React.RefObject<HTMLDivElement>;
	name: string;
	handleLogout: () => void;
	setIsProfileMenuOpen: (value: boolean) => void;
}

const ProfileMenu = ({
	isProfileMenuOpen,
	profileMenuRef,
	name,
	handleLogout,
	setIsProfileMenuOpen,
}: ProfileMenuProps) => (
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

interface AuthButtonProps {
	isSignedIn: boolean;
	isMobileView?: boolean;
	firstName: string;
	avatarUrl: string;
	name: string;
	isProfileMenuOpen: boolean;
	toggleProfileMenu: () => void;
	handleLogout: () => void;
	setIsMenuOpen: (value: boolean) => void;
	setIsProfileMenuOpen: (value: boolean) => void;
	profileMenuRef: React.RefObject<HTMLDivElement>;
}

const AuthButton = ({
	isSignedIn,
	isMobileView = false,
	firstName,
	avatarUrl,
	name,
	isProfileMenuOpen,
	toggleProfileMenu,
	handleLogout,
	setIsMenuOpen,
	setIsProfileMenuOpen,
	profileMenuRef,
}: AuthButtonProps) => {
	if (!isSignedIn) {
		return (
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
	}

	if (isMobileView) {
		return (
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
		);
	}

	return (
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
			<ProfileMenu
				isProfileMenuOpen={isProfileMenuOpen}
				profileMenuRef={profileMenuRef}
				name={name}
				handleLogout={handleLogout}
				setIsProfileMenuOpen={setIsProfileMenuOpen}
			/>
		</div>
	);
};

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

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobile && isMenuOpen) {
			// Store current scroll position
			const scrollY = window.scrollY;

			// Prevent body scroll
			document.body.style.overflow = "hidden";
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";

			// Store scroll position for restoration
			document.body.setAttribute("data-scroll-y", scrollY.toString());
		} else {
			// Restore body scroll
			const scrollY = document.body.getAttribute("data-scroll-y");
			document.body.style.overflow = "";
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";

			// Restore scroll position
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY));
				document.body.removeAttribute("data-scroll-y");
			}
		}

		// Cleanup on unmount
		return () => {
			const scrollY = document.body.getAttribute("data-scroll-y");
			document.body.style.overflow = "";
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			if (scrollY) {
				window.scrollTo(0, parseInt(scrollY));
				document.body.removeAttribute("data-scroll-y");
			}
		};
	}, [isMobile, isMenuOpen]);

	// Close menu on scroll attempt
	useEffect(() => {
		let startY = 0;
		let isScrolling = false;
		let menuOpenDelay: NodeJS.Timeout;

		const handleScroll = () => {
			// Only close menu if it's been open for at least 500ms
			if (isMobile && isMenuOpen && !isScrolling && !menuOpenDelay) {
				isScrolling = true;
				setIsMenuOpen(false);
				setTimeout(() => {
					isScrolling = false;
				}, 100);
			}
		};

		const handleTouchStart = (e: TouchEvent) => {
			if (isMobile && isMenuOpen && !menuOpenDelay) {
				startY = e.touches[0].clientY;
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (isMobile && isMenuOpen && !isScrolling && !menuOpenDelay) {
				const currentY = e.touches[0].clientY;
				const deltaY = Math.abs(currentY - startY);

				// If user scrolled more than 20px, close menu
				if (deltaY > 20) {
					isScrolling = true;
					setIsMenuOpen(false);
					setTimeout(() => {
						isScrolling = false;
					}, 100);
				}
			}
		};

		const handleWheel = (e: WheelEvent) => {
			// Only close menu if it's been open for at least 500ms
			if (isMobile && isMenuOpen && !isScrolling && !menuOpenDelay) {
				// Detect wheel/trackpad scroll
				if (Math.abs(e.deltaY) > 10) {
					isScrolling = true;
					setIsMenuOpen(false);
					setTimeout(() => {
						isScrolling = false;
					}, 100);
				}
			}
		};

		if (isMobile && isMenuOpen) {
			// Add a delay before scroll detection becomes active
			menuOpenDelay = setTimeout(() => {
				menuOpenDelay = null as any;
			}, 500); // 500ms delay before scroll-to-close becomes active

			// Listen for various scroll events
			window.addEventListener("scroll", handleScroll, { passive: true });
			document.addEventListener("touchstart", handleTouchStart, {
				passive: true,
			});
			document.addEventListener("touchmove", handleTouchMove, {
				passive: true,
			});
			document.addEventListener("wheel", handleWheel, { passive: true });
		}

		return () => {
			if (menuOpenDelay) {
				clearTimeout(menuOpenDelay);
			}
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("touchstart", handleTouchStart);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("wheel", handleWheel);
		};
	}, [isMobile, isMenuOpen]);

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

	const navItems = [...baseNavItems];

	if (isSignedIn) {
		navItems.unshift({
			name: "Dashboard",
			link: "/dashboard/profile",
			icon: LayoutDashboard,
		});
	}

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
							onClick={toggleMenu}
						>
							<AnimatePresence mode="wait">
								{isMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
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
							<NavLinks
								navItems={navItems}
								pathname={pathname}
								setIsMenuOpen={setIsMenuOpen}
							/>
							<AuthButton
								isSignedIn={isSignedIn}
								firstName={firstName}
								avatarUrl={avatarUrl}
								name={name}
								isProfileMenuOpen={isProfileMenuOpen}
								toggleProfileMenu={toggleProfileMenu}
								handleLogout={handleLogout}
								setIsMenuOpen={setIsMenuOpen}
								setIsProfileMenuOpen={setIsProfileMenuOpen}
								profileMenuRef={profileMenuRef}
							/>
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
								<AuthButton
									isSignedIn={isSignedIn}
									isMobileView={true}
									firstName={firstName}
									avatarUrl={avatarUrl}
									name={name}
									isProfileMenuOpen={isProfileMenuOpen}
									toggleProfileMenu={toggleProfileMenu}
									handleLogout={handleLogout}
									setIsMenuOpen={setIsMenuOpen}
									setIsProfileMenuOpen={setIsProfileMenuOpen}
									profileMenuRef={profileMenuRef}
								/>
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
