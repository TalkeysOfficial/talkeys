import React from "react";
import Image from "next/image";
import aboutUsImage from "@/public/images/aboutUs.png";
import { urbanist, volkhov } from "@/components/fonts/fonts";

function AboutPage() {
	return (
		<div
			className={`min-h-screen flex flex-col text-white p-6 sm:p-24 max-sm:pt-32 lg:p-40 ${urbanist.className} text-justify`}
		>
			<h1 className="font-bold text-3xl sm:text-4xl text-center mb-6">
				About Us
			</h1>

			<div className="flex flex-col lg:flex-row gap-10">
				<section className="flex flex-col gap-5 lg:w-1/2">
					<p>
						Welcome to Talkeys, the ultimate meeting ground for fandoms,
						communities, and creators! Whether you're a die-hard anime
						lover, a formula racing enthusiast, a desi hip-hop fan, or
						part of any niche community, Talkeys is where your world gets
						louder, more connected, and more exciting.
					</p>
					<p>
						Talkeys is a unique blend of a booking platform and anonymous
						chatroom designed to unite passionate people and give
						underrated artists the space they deserve. Dive into anonymous
						chatrooms curated for different interests and connect with
						others who share your passion. No matter how niche or
						mainstream, your community awaits you here.
					</p>
					<p>
						But we&apos;re not just about conversations—we&apos;re about
						action! Artists can post their gigs and events, and fans can
						easily book tickets right through our platform. Discover
						hidden talent, support emerging creators, and be part of
						something bigger.
					</p>
					<p>
						At Talkeys, we believe in a future where every artist,
						established or emerging, has the freedom to create their own
						community. We envision a platform where celebrated artists can
						deepen their connections with their fans, while underrated
						talent gets the opportunity to rise and shine.
					</p>
					<p>
						Our mission is to create a space where the voices of emerging
						artists are amplified, giving them equal footing to showcase
						their craft. We want to build a world where artistic discovery
						is powered by real communities, where both creators and fans
						can thrive together.
					</p>
				</section>

				<section className="flex flex-col items-center gap-6 lg:w-1/2">
					<div className="relative w-full aspect-square max-w-md">
						<Image
							src={aboutUsImage}
							alt="About Us"
							layout="fill"
							objectFit="contain"
							priority
						/>
					</div>
					<p
						className={`${volkhov.className} font-bold text-center text-xl sm:text-2xl w-full lg:w-3/4`}
					>
						Journey through the depths to find your next adventure
					</p>
				</section>
			</div>
		</div>
	);
}

export default AboutPage;
