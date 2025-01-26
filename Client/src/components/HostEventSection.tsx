import React from "react";
import Link from "next/link";
import Image from "next/image";
import image from "@/public/images/disco.png";

export default function HostEventSection() {
	return (
		<div className="bg-transparent w-full text-white min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
			<div className="header bg-transparent text-center mb-8 sm:mb-12">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
					Host your own EVENT!!!
				</h1>
			</div>
			<div className="content flex flex-col sm:flex-row gap-8 sm:gap-12 items-center justify-center w-full max-w-6xl">
				<div className="left text-center space-y-6 order-2 sm:order-1 w-full sm:w-2/3 md:w-1/2">
					<p className="text-xl sm:text-2xl font-light mb-8">
						Create an event, invite your community,
						<br className="hidden sm:inline" /> and manage everything in
						one place.
					</p>
					<Link
						href="/underConstruct"
						className="rounded-[8px] px-6 py-3 bg-purple-500 text-white  hover:bg-purple-600 transition-colors duration-300"
					>
						Create Event
					</Link>
				</div>
				<div className="right flex justify-center items-center order-1 sm:order-2 w-full sm:w-1/3 md:w-1/2">
					<Image
						src={image}
						alt="Disco Ball"
						className="max-w-full w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]"
					/>
				</div>
			</div>
		</div>
	);
}
