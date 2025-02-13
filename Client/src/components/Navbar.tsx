"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import talkey_logo from "@/public/images/talkeyLogo.png";

const navItems = [
	{ name: "Home", link: "/" },
	{ name: "Explore", link: "/underConstruct" },
	{ name: "Events", link: "/eventPage" },
	{ name: "Communities", link: "/underConstruct" },
];

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isSignedIn, setIsSignedIn } = useAuth();
	const [name, setName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [showAvatarModal, setShowAvatarModal] = useState(false); 
	const isMobile = useMediaQuery({ query: "(max-width: 950px)" });
	const pathname = usePathname();

	useEffect(() => {
		const updateAvatar = () => {
			const storedName = localStorage.getItem("name") ?? "";
			const storedStyle = localStorage.getItem("avatarStyle") ?? "avataaars";
			const storedBg = localStorage.getItem("avatarBg") ?? "b6e3f4";
			setName(storedName);

			const seed = storedName.toLowerCase().replace(/[^a-z0-9]/g, "");
			const newAvatarUrl = `https://api.dicebear.com/7.x/${storedStyle}/svg?seed=${seed}&backgroundColor=${storedBg}`;
			setAvatarUrl(newAvatarUrl);
		};

		updateAvatar();

		window.addEventListener("storage", updateAvatar);
		return () => window.removeEventListener("storage", updateAvatar);
	}, [isSignedIn]); 

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("name");
		setIsSignedIn(false);
		setName("");
		setAvatarUrl("");	
	};

	const NavLinks = () => (
		<>
			{navItems.map((item) => (
				<Link
					key={item.name}
					href={item.link}
					className={`text-white hover:text-gray-300 transition-colors hover:underline duration-200 ${
						pathname === item.link ? "font-bold" : ""
					}`}
					onClick={() => setIsMenuOpen(false)}
				>
					{item.name}
				</Link>
			))}
		</>
	);

	const AuthButton = () =>
		isSignedIn ? (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="default"
						className="p-0 text-white border border-white px-4 hover:text-black hover:bg-white duration-300 rounded-xl"
					>
						<Avatar className="h-8 w-8">
							<AvatarImage src={avatarUrl} alt={name} />
							<AvatarFallback>{name.charAt(0)}</AvatarFallback>
						</Avatar>
						<span>{name}</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="z-[2000] text-white bg-black w-max">
					<DropdownMenuItem className="font-bold underline">
						Logged in as {name}
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
					<Link href="/profile">Edit Avatar</Link>

					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-black hover:bg-white hover:underline">
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		) : (
			<Button
				asChild
				variant="outline"
				className="text-white hover:text-black hover:bg-white"
			>
				<Link href="/sign">Login</Link>
			</Button>
		);

	return (
		<>
			<div className="fixed top-0 w-full z-[1000]">
				<div className="flex px-2.5 sm:px-5 justify-between bg-black items-center">
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
					{isMobile ? (
						<Button
							variant="default"
							size="icon"
							className="text-white"
							onClick={toggleMenu}
						>
							{isMenuOpen ? <X size={28} /> : <Menu size={28} />}
						</Button>
					) : (
						<NavigationMenu>
							<NavigationMenuList className="flex items-center gap-10">
								<NavLinks />
								<AuthButton />
							</NavigationMenuList>
						</NavigationMenu>
					)}
				</div>
				{isMobile && (
					<div
						className={`absolute left-0 right-0 bg-black transition-all duration-300 ease-in-out overflow-hidden ${
							isMenuOpen ? "max-h-[400px]" : "max-h-0"
						}`}
					>
						<div className="p-4 flex flex-col gap-4">
							<NavLinks />
							<AuthButton />
						</div>
					</div>
				)}
				<div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
			</div>

		</>
	);
};

export default Navbar;
