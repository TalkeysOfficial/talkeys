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
    BookOpen,
    Sparkles,
    MessagesSquare,
    Trophy,
    PenSquare,
    Menu,
    X,
    LogOut,
    User,
    ChevronDown,
    LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

import talkey_logo from "@/public/images/talkeyLogo.png";

// Color Palette:
// Oxford Blue: #102542
// Bittersweet: #F87060
// Aureolin: #F0E100

const baseNavItems = [
    { name: "Courses", link: "/eventPage", icon: BookOpen },
    { name: "AI Tutor", link: "http://localhost:8501/", icon: Sparkles },
    { name: "Discussions", link: "/discussions", icon: MessagesSquare },
    { name: "Leaderboards", link: "/leaderboards", icon: Trophy },
    { name: "For Educators", link: "/educators", icon: PenSquare },
];

interface NavLinksProps {
    pathname: string;
    isMobileView?: boolean;
    setIsMenuOpen: (value: boolean) => void;
}

const NavLinks = ({
    pathname,
    isMobileView = false,
    setIsMenuOpen,
}: NavLinksProps) => (
    <>
        {baseNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.link;

            return (
                <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative flex items-center gap-3 transition-colors px-3 py-2
                        ${ isMobileView ? "text-lg" : "text-sm font-medium" }
                        ${ isActive ? "text-white" : "text-white/70 hover:text-white" }
                    `}
                >
                    <Icon
                        size={isMobileView ? 24 : 20}
                        className={isActive ? "text-[#F0E100]" : ""}
                    />
                    <span>{item.name}</span>
                </Link>
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
                className="absolute right-0 mt-3 w-52 text-white bg-[#0A1A30]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
            >
                <div className="py-2 px-4 border-b border-white/10 font-semibold text-sm">
                    {name}
                </div>

                <div className="p-1">
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                    >
                        <User size={16} />
                        <span>Edit Avatar</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm w-full text-left rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
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
            <Button asChild className="bg-[#F87060] text-white hover:bg-[#E96A51] font-bold rounded-full">
                <Link href="/sign">Login / Sign Up</Link>
            </Button>
        );
    }

    if (isMobileView) { // Mobile signed-in view
        return (
            <div className="mt-6 border-t border-white/10 pt-6 text-white">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt={firstName} />
                        <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-lg">{firstName}</span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                    <Link href="/dashboard/profile" className="flex items-center gap-3 py-2 text-lg hover:text-[#F87060]" onClick={() => setIsMenuOpen(false)}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-3 py-2 text-lg hover:text-[#F87060]" onClick={() => setIsMenuOpen(false)}>
                        <User size={20} />
                        <span>Edit Avatar</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 py-2 text-lg text-left text-red-400 hover:text-red-300">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        );
    }

    return ( // Desktop signed-in view
        <div className="relative">
            <button
                className="flex items-center gap-2"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
            >
                <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={firstName} />
                    <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white/80 hidden md:inline">{firstName}</span>
                <motion.div
                    animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-white/70" />
                </motion.div>
            </button>
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
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const updateAvatar = () => {
            const storedName = localStorage.getItem("name") ?? "";
            const storedStyle = localStorage.getItem("avatarStyle") ?? "avataaars";
            const storedBg = localStorage.getItem("avatarBg") ?? "b6e3f4";
            setName(storedName);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isProfileMenuOpen]);
    
    useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMobile && isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMobile, isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 10) {
                setIsVisible(true);
                return;
            }

            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
                setIsProfileMenuOpen(false); 
            } else {
                setIsVisible(true);
            }
            
            lastScrollY.current = currentScrollY;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (event.clientY < 150) {
                setIsVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsSignedIn(false);
        setName("");
        setFirstName("");
        setAvatarUrl("");
        setIsProfileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: isVisible ? 0 : "-120%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-[1000]"
        >
            <div className="w-full h-20 px-4 sm:px-6 lg:px-8 flex justify-between items-center bg-[#102542]/80 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src={talkey_logo}
                        alt="Logo"
                        width={150}
                        height={40}
                        quality={100}
                        priority
                    />
                </Link>

                {isMobile ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10"
                        aria-label="Toggle menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X size={28} />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Menu size={28} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                ) : (
                    <div className="flex items-center gap-4">
                        <NavigationMenu className="relative">
                            <NavigationMenuList className="gap-2">
                                <NavLinks pathname={pathname} setIsMenuOpen={setIsMenuOpen} />
                            </NavigationMenuList>
                        </NavigationMenu>
                        {/* CHANGE: The vertical divider line below has been removed. */}
                        <AuthButton
                            isSignedIn={isSignedIn}
                            firstName={firstName}
                            avatarUrl={avatarUrl}
                            name={name}
                            isProfileMenuOpen={isProfileMenuOpen}
                            toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            handleLogout={handleLogout}
                            setIsMenuOpen={setIsMenuOpen}
                            setIsProfileMenuOpen={setIsProfileMenuOpen}
                            profileMenuRef={profileMenuRef}
                        />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isMobile && isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-20 z-40 bg-[#102542]/95 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="p-8 flex flex-col gap-6"
                        >
                            <NavLinks pathname={pathname} isMobileView={true} setIsMenuOpen={setIsMenuOpen} />
                            <AuthButton
                                isSignedIn={isSignedIn}
                                isMobileView={true}
                                firstName={firstName}
                                avatarUrl={avatarUrl}
                                name={name}
                                isProfileMenuOpen={isProfileMenuOpen}
                                toggleProfileMenu={() => {}}
                                handleLogout={handleLogout}
                                setIsMenuOpen={setIsMenuOpen}
                                setIsProfileMenuOpen={setIsProfileMenuOpen}
                                profileMenuRef={profileMenuRef}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;