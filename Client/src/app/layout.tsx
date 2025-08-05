import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import image from "@/public/images/bg.webp";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { urbanist } from "@/components/fonts/fonts";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/lib/authContext";

const geistSans = localFont({
	src: "./../components/fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./../components/fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Talkeys",
	description: "Talkeys",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased ${urbanist.className}`}
				style={{
					backgroundImage: `url(${image.src})`,
					backgroundAttachment: "fixed",
					width: "100%",
				}}
			>
				<AuthProvider>
					<Navbar />
					<ScrollProgress className="top-[85px] max-sm:top-[92.31px] h-0.5" />
					{children}
					<Analytics />
					<ConditionalFooter />
				</AuthProvider>
				<Toaster
					position="top-center"
					richColors
					theme="dark"
					closeButton
				/>
			</body>
		</html>
	);
}
