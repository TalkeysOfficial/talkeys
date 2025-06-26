"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import image from "@/public/images/404.png";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Component() {
	return (
		<motion.div
			className="flex h-screen bg-transparent text-white p-8"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1.05 }}
		>
			<div className="flex-1 flex flex-col justify-center items-center">
				<h1 className="text-6xl font-bold mb-4">oops...</h1>
				<p className="text-4xl mb-8">page not found</p>
				<Link
					href="/"
					className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 w-48"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Homepage
				</Link>
			</div>
			<div className="flex-1 flex items-center justify-center">
				<div className="relative">
					<Image
						src={image}
						alt="404"
						width={400}
						height={400}
					/>
				</div>
			</div>
		</motion.div>
	);
}
