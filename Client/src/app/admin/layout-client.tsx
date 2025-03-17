"use client";

import { useState, useEffect } from "react";
import MobileNav from "@/components/admin/layout-mobile-nav";

export default function AdminLayoutClient() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Close mobile menu when window is resized to desktop size
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsMobileMenuOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prevState) => !prevState);
	};

	return (
		<MobileNav
			isOpen={isMobileMenuOpen}
			onToggle={toggleMobileMenu}
		/>
	);
}
