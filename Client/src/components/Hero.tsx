import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import bg from "../public/images/Default.png";

const Hero = () => {
	return (
		<div className="hero relative h-screen flex justify-center items-center">
			<Image
				src={bg}
				alt="Hero background"
				layout="fill"
				objectFit="cover"
				quality={100}
				priority
			/>
			<div className="absolute inset-0 bg-black/30" />
			<div className="relative z-10 w-full max-w-[90%] sm:max-w-[670px] bg-black/80 rounded-[20px] p-6 sm:p-8">
				<div className="text-center text-white">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
						Explore shows and events with ease.
					</h1>
					<p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
						Connect with fellow enthusiasts in our chat rooms. Share
						experiences and ideas anonymously.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link
							href="/"
							className="w-full sm:w-auto"
						>
							<Button
								size="lg"
								className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
							>
								Explore Communities
							</Button>
						</Link>
						<Link
							href="/"
							className="w-full sm:w-auto"
						>
							<Button
								size="lg"
								className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
							>
								Explore Events
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
