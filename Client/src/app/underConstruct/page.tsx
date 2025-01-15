"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import image from "../../public/images/Finding.png";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UnderConstruction() {
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 0,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const isMobile = windowWidth <= 648;

	return (
		<div className="relative min-h-screen bg-transparent text-white p-4 sm:p-8 flex flex-row md:flex-row items-center justify-center">
			<div
				className={`z-10 flex flex-col justify-center items-center text-center ${
					isMobile ? "w-full" : "md:w-1/2"
				}`}
			>
				<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
					This page is still under construction
				</h1>
				<Link
					href="/"
					className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 w-48"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Homepage
				</Link>
			</div>
			<div
				className={`flex items-center justify-center ${
					isMobile ? "absolute inset-0 opacity-20 p-5" : "md:w-1/2"
				}`}
			>
				<div className="relative">
					<Image
						src={image || "/placeholder.svg"}
						alt="UnderConstruction"
						width={400}
						height={400}
						className="max-w-full h-auto"
					/>
				</div>
			</div>
		</div>
	);
}
