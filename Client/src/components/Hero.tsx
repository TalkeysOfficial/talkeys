import React from "react";
import image from "../public/images/Default.png";
import { Button } from "./ui/button";
import Link from "next/link";
const Hero = () => {
	return (
		<div
			className="hero h-[89.3vh] bg-center flex justify-center items-center "
			style={{
				backgroundImage: `url(${image.src})`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="w-[670px] h-[318px] bg-black/80 rounded-[20px]">
				<div className="text-center text-white p-8 max-w-2xl">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Explore shows and events with ease.
					</h1>
					<p className="text-lg md:text-xl mb-8">
						Connect with fellow enthusiasts in our chat rooms. Share
						experiences and ideas anonymously.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link href="/">
							<Button
								size="lg"
								className="bg-purple-600 hover:bg-purple-700 text-white"
							>
								Explore Communities
							</Button>
						</Link>
						<Link href="/">
							<Button
								size="lg"
								className="bg-purple-600 hover:bg-purple-700 text-white"
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
