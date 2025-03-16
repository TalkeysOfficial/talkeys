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
import { Menu, X, Search, Calendar, Users, Globe, Inbox } from "lucide-react";
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
  { name: "Explore", link: "/underConstruct", icon: Search },
  { name: "Events", link: "/eventPage", icon: Calendar },
  { name: "Communities", link: "/underConstruct", icon: Users },
  { name: "Global", link: "/underConstruct", icon: Globe },
  { name: "Inbox", link: "/underConstruct", icon: Inbox },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, setIsSignedIn } = useAuth();
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
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
      
      // Get only the first name by splitting on spaces and taking the first part
      const firstNameOnly = storedName.split(' ')[0];
      setFirstName(firstNameOnly);

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
    setFirstName("");
    setAvatarUrl("");
  };

  const NavLinks = ({ isMobileView = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.link}
            className={`flex ${isMobileView ? "flex-row items-center gap-3" : "flex-col items-center justify-center"} text-white hover:text-gray-300 transition-colors p-2 ${
              pathname === item.link ? "font-bold" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon size={24} className={isMobileView ? "" : "mb-1"} />
            <span className={isMobileView ? "" : "text-xs"}>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  const AuthButton = ({ isMobileView = false }) =>
    isSignedIn ? (
      isMobileView ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="p-0 text-white border border-white px-4 hover:text-black hover:bg-white duration-300 rounded-xl"
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={avatarUrl}
                  alt={firstName}
                />
                <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{firstName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-[2000] text-white bg-black w-max"
          >
            <DropdownMenuItem className="font-bold underline">
              Logged in as {name}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">Edit Avatar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer hover:text-black hover:bg-white hover:underline"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-col items-center">
          <Avatar className="h-8 w-8 mb-1">
            <AvatarImage
              src={avatarUrl}
              alt={firstName}
            />
            <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-white">{firstName}</span>
        </div>
      )
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
            <NavigationMenuList className="flex items-center gap-6">
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
            <NavLinks isMobileView={true} />
            <AuthButton isMobileView={true} />
          </div>
        </div>
      )}
      <div className="absolute left-0 right-0 h-[50px] bottom-[-50px] bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default Navbar;