import React from "react";
import Image from "next/image";
import aboutUsImage from "@/public/images/aboutUs.png";
import { urbanist, volkhov } from "@/components/fonts/fonts";

function page() {
	return (
		<div
			className={`h-max min-h-screen flex text-white p-20 gap-10 ${urbanist.className} text-justify mt-10 max-md:p-10`}
		>
			<section className="flex flex-col gap-6 items-center justify-center">
				<h1 className="font-bold text-4xl">About Us</h1>
				<div className="flex flex-col gap-5 items-center justify-center font-normal text-[1.0625rem]">
					<p>
						Welcome to Talkeys, the ultimate meeting ground for fandoms,
						communities, and creators! Whether you're a die-hard anime
						lover, a formula racing enthusiast, a desi hip-hop fan, or
						part of any niche community, Talkeys is where your world gets
						louder, more connected, and more exciting.
					</p>{" "}
					<p>
						Talkeys is a unique blend of a booking platform and anonymous
						chatroom designed to unite passionate people and give
						underrated artists the space they deserve. Dive into anonymous
						chatrooms curated for different interests and connect with
						others who share your passion. No matter how niche or
						mainstream, your community awaits you here.
					</p>{" "}
					<p>
						But we&apos;re not just about conversations—we&apos;re about
						action! Artists can post their gigs and events, and fans can
						easily book tickets right through our platform. Discover
						hidden talent, support emerging creators, and be part of
						something bigger.
					</p>{" "}
					<p>
						At Talkeys, we believe in a future where every artist,
						established or emerging, has the freedom to create their own
						community. We envision a platform where celebrated artists can
						deepen their connections with their fans, while underrated
						talent gets the opportunity to rise and shine.
					</p>{" "}
					<p>
						Our mission is to create a space where the voices of emerging
						artists are amplified, giving them equal footing to showcase
						their craft. We want to build a world where artistic discovery
						is powered by real communities, where both creators and fans
						can thrive together.
					</p>
				</div>
			</section>
			<section className="hidden lg:flex flex-col gap-7 justify-center items-center">
				<Image
					src={aboutUsImage}
					alt="About Us"
					className="flex-grow-0 flex-shrink-0 max-w-[40dvw] min-w-[38dvw]"
				/>
				<p
					className={`${volkhov.className} font-bold text-center text-2xl w-3/4 text-wrap`}
				>
					Journey through the depths to find your next adventure
				</p>
			</section>
		</div>
	);
}

export default page;
