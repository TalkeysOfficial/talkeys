"use client";// Import the signIn function from NextAuth for authentication.

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
import image from "../public/images/Logo.png";

const navItems = [
	{ name: "Home", link: "" },
	{ name: "Explore", link: "" },
	{ name: "Events", link: "" },
	{ name: "Communities", link: "" },
];

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	
	const isMobile = useMediaQuery({ query: "(max-width: 950px)" });

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	
	return (
		<div className="fixed top-0 w-full z-[1000]">
			<div className="flex pt-[10px] justify-between bg-black h-[13.5vh] items-center px-4 md:px-10">
				<Link href="/">
					<div className="flex items-center">
						<Image
							src={image}
							alt="Logo"
							width={80}
							height={80}
						/>
						<span className="font-marykate text-white font-semibold text-3xl">
							Talkeys
						</span>
					</div>
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
								<button
									key={item.name}
									className="text-white"
								>
									{item.name}
								</button>
							))}
							<Button
								asChild
								variant="outline"
								className="text-white hover:bg-white hover:text-black duration-300"
							>
								<Link href="/sign">Sign Up/Login</Link>
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
								className="block text-white py-2 hover:text-gray-300 transition-colors duration-200"
							>
								{item.name}
							</Link>
						))}
						<Button
							asChild
							variant="outline"
							className="w-full mt-4 text-white hover:bg-white hover:text-black duration-300"
						>
							<Link href="/sign">Sign Up/Login</Link>
						</Button>
					</div>
				</div>
			)}
			<div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
		</div>
	);
};

export default Navbar;
