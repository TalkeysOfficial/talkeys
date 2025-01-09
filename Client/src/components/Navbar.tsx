"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import image from "../public/images/Logo.png";
import { Button } from "./ui/button";

const navitem = [
	{
		name: "Home",
		link: "",
	},
	{
		name: "Explore",
		link: "",
	},
	{
		name: "Events",
		link: "",
	},
	{
		name: "Communities",
		link: "",
	},
];

const Navbar = () => {
	return (
		<div className="fixed top-0 w-full z-10">
			<div className="flex pt-[10px] justify-between bg-black h-[11.8vh] items-center">
				<div className="flex pl-10 items-center">
					<Link href="/">
						<Image
							src={image}
							alt="Logo"
							width={80}
							height={80}
						/>
					</Link>
					<span className="font-marykate text-white font-semibold text-3xl">
						Talkeys
					</span>
				</div>
				<div className="flex items-center pr-10">
					<NavigationMenu>
						<NavigationMenuList className="gap-6">
							{navitem.map((item) => (
								<NavigationMenuItem
									className="text-white"
									key={item.name}
								>
									<NavigationMenuTrigger className="text-white">
										{item.name}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<NavigationMenuLink
											className="text-white"
											href={item.link}
										>
											Link
										</NavigationMenuLink>
									</NavigationMenuContent>
								</NavigationMenuItem>
							))}

							<Button
								asChild
								variant="outline"
								className="text-white hover:bg-white hover:text-black duration-300"
							>
								<Link href="/sign">Sign Up/Login</Link>
							</Button>

							{/* <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>
			<div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
		</div>
	);
};

export default Navbar;
