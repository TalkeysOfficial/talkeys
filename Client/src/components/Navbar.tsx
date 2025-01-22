"use client"; // Import the signIn function from NextAuth for authentication.

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import image from "@/public/images/talkeyLogo.png";
import { useAuth } from "@/lib/authContext";

const navItems = [
	{ name: "Home", link: "/" },
	{ name: "Explore", link: "/underConstruct" },
	{ name: "Events", link: "/eventPage" },
	{ name: "Communities", link: "/underConstruct" },
];

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isSignedIn, setIsSignedIn } = useAuth();

	const isMobile = useMediaQuery({ query: "(max-width: 950px)" });

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		setIsSignedIn(false);
	};

	return (
		<div className="fixed top-0 w-full z-[1000] ">
			<div className="flex px-2.5 sm:px-5 justify-between bg-black items-center">
				<Link href="/">
					<Image
						src={image}
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
						variant="ghost"
						size="icon"
						className="text-white"
						onClick={toggleMenu}
					>
						{isMenuOpen ? <X size={28} /> : <Menu size={28} />}
					</Button>
				) : (
					<NavigationMenu>
						<NavigationMenuList className="flex gap-10">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.link}
									className="text-white"
								>
									{item.name}
								</Link>
							))}
							<Button
								asChild
								variant="outline"
								className="text-white hover:bg-white hover:text-black duration-300"
							>
								{isSignedIn ? (
									<Link
										href="/"
										onClick={handleLogout}
										className="bg-white text-black hover:bg-red-500 hover:text-white duration-300"
									>
										Logout
									</Link>
								) : (
									<Link href="/sign">Login</Link>
								)}
							</Button>
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
					<div className="p-4">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.link}
								onClick={toggleMenu}
								className="block text-white py-2 hover:text-gray-300 transition-colors duration-200"
							>
								{item.name}
							</Link>
						))}
						<Button
							asChild
							variant="outline"
							onClick={toggleMenu}
							className="w-full mt-4 text-white hover:bg-white hover:text-black duration-300"
						>
							{isSignedIn ? (
								<Link
									href="/"
									onClick={handleLogout}
									className="bg-white text-black hover:bg-red-500 hover:text-white duration-300"
								>
									Logout
								</Link>
							) : (
								<Link href="/sign">Login</Link>
							)}
						</Button>
					</div>
				</div>
			)}
			<div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
		</div>
	);
};

export default Navbar;
