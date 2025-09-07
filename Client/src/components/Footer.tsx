"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    ChevronUp,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import image from "@/public/images/talkeyLogo.png";

export default function Footer() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const socialLinks = [
        { name: "Instagram", icon: <Instagram size={24} />, href: "https://www.instagram.com/aaryan_549", ariaLabel: "Instagram" },
        { name: "LinkedIn", icon: <Linkedin size={24} />, href: "https://www.linkedin.com/company/Aaryan", ariaLabel: "LinkedIn" },
    ];

    const navLinks = [
        { name: "Contact us", href: "/" },
        { name: "About us", href: "/" },
        { name: "Privacy Policy", href: "/" },
        { name: "Terms of Service", href: "/" },
    ];

    const footerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <TooltipProvider delayDuration={300}>
            <motion.footer
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={footerVariants}
                className="relative z-[1000] w-full"
            >
                {/* MODIFIED: Top wave now uses the dark theme background color */}
                <div className="w-full overflow-hidden h-12 relative bg-white">
                    
                </div>

                {/* MODIFIED: Main footer content now has a dark background and light text */}
                <div className="bg-[#102542] text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto">
                        {/* Desktop layout */}
                        <div className="hidden lg:grid grid-cols-4 gap-8">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h3 className="text-xl font-bold text-white">Team Hellfire Club</h3>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={16} className="text-[#F87060] flex-shrink-0" />
                                        <p className="text-sm">Patiala, Punjab, India</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-[#F87060] flex-shrink-0" />
                                        <Link href="tel:+916394075699" className="text-sm hover:text-[#F87060] transition-colors">
                                            +91 6394075699
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-[#F87060] flex-shrink-0" />
                                        <Link href="mailto:abeniwal_be23@thapar.edu" className="text-sm hover:text-[#F87060] transition-colors">
                                            abeniwal_be23@thapar.edu
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-col items-center space-y-6 col-span-2">
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="relative w-32 h-32">
                                    <Image src={image || "/talkeyLogo.png"} alt="CodeMe Logo" layout="fill" objectFit="contain" priority />
                                </motion.div>
                                <div className="flex space-x-6">
                                    {socialLinks.map((link) => (
                                        <Tooltip key={link.name}>
                                            <TooltipTrigger asChild>
                                                <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                                                    <Link href={link.href} className="text-gray-300 hover:text-[#F87060] transition-colors duration-300" aria-label={link.ariaLabel} target="_blank" rel="noopener noreferrer">
                                                        <div className="text-2xl">{link.icon}</div>
                                                    </Link>
                                                </motion.div>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-black text-white border-none">
                                                <p>{link.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-4">
                                <h3 className="text-xl font-bold text-white">Quick Links</h3>
                                <ul className="space-y-2">
                                    {navLinks.map((link) => (
                                        <motion.li key={link.name} whileHover={{ x: 5 }}>
                                            <Link href={link.href} className="text-gray-300 hover:text-[#F87060] transition-colors flex items-center gap-1.5">
                                                <span>{link.name}</span>
                                                <ExternalLink size={12} className="opacity-70" />
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Mobile layout */}
                        <div className="lg:hidden space-y-8">
                            <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4">
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="relative w-24 h-24">
                                    <Image src={image || "/placeholder.svg"} alt="CodeMe Logo" layout="fill" objectFit="contain" priority />
                                </motion.div>
                                <div className="flex space-x-6">
                                    {socialLinks.map((link) => (
                                        <motion.div key={link.name} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
                                            <Link href={link.href} className="text-gray-300 hover:text-[#F87060] transition-colors duration-300" aria-label={link.ariaLabel} target="_blank" rel="noopener noreferrer">
                                                <div className="text-2xl">{link.icon}</div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="space-y-2">
                                <motion.div variants={itemVariants} className="border border-white/20 bg-white/5 rounded-lg overflow-hidden">
                                    <Button variant="ghost" className="w-full flex justify-between items-center p-4 text-left text-white hover:bg-white/10 hover:text-white" onClick={() => toggleSection("company")}>
                                        <span className="font-bold text-lg">Team Hellfire Club</span>
                                        <ChevronUp className={`transition-transform duration-300 ${expandedSection === "company" ? "rotate-0" : "rotate-180"}`} size={18} />
                                    </Button>
                                    <AnimatePresence>
                                        {expandedSection === "company" && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="px-4 pb-4 text-gray-300">
                                                <div className="space-y-3 pt-2">
                                                    <div className="flex items-center gap-3"><MapPin size={16} className="text-[#F87060] flex-shrink-0" /><p className="text-sm">Patiala, Punjab, India</p></div>
                                                    <div className="flex items-center gap-3"><Phone size={16} className="text-[#F87060] flex-shrink-0" /><Link href="tel:+916394075699" className="text-sm hover:text-[#F87060] transition-colors">+91 6394075699</Link></div>
                                                    <div className="flex items-center gap-3"><Mail size={16} className="text-[#F87060] flex-shrink-0" /><Link href="mailto:abeniwal_be23@thapar.edu" className="text-sm hover:text-[#F87060] transition-colors">abeniwal_be23@thapar.edu</Link></div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <motion.div variants={itemVariants} className="border border-white/20 bg-white/5 rounded-lg overflow-hidden">
                                    <Button variant="ghost" className="w-full flex justify-between items-center p-4 text-left text-white hover:bg-white/10 hover:text-white" onClick={() => toggleSection("links")}>
                                        <span className="font-bold text-lg">Quick Links</span>
                                        <ChevronUp className={`transition-transform duration-300 ${expandedSection === "links" ? "rotate-0" : "rotate-180"}`} size={18} />
                                    </Button>
                                    <AnimatePresence>
                                        {expandedSection === "links" && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="px-4 pb-4">
                                                <ul className="space-y-2 pt-2">
                                                    {navLinks.map((link) => (
                                                        <motion.li key={link.name} whileHover={{ x: 5 }}>
                                                            <Link href={link.href} className="text-gray-300 hover:text-[#F87060] transition-colors flex items-center gap-1.5"><ExternalLink size={12} className="opacity-70" /><span>{link.name}</span></Link>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-white/20 text-center">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-400">
                                <p>© {new Date().getFullYear()} CodeMe. All rights reserved.</p>
                                <span className="hidden sm:inline">•</span>
                                <motion.p className="flex items-center gap-1.5" whileHover={{ scale: 1.05 }}>
                                    Made by Team Hellfire Club
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.footer>
        </TooltipProvider>
    );
}