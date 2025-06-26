"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

import brocode from "@/public/images/1.png";
import gamebox from "@/public/images/7.png";
import stripes from "@/public/images/3.png";
import bragfit from "@/public/images/4.png";
import cosmo from "@/public/images/5.png";
import handa_mobile_care from "@/public/images/2.png";
import mentor_labs from "@/public/images/6.png";
import olivia from "@/public/images/8.png";
import la_club from "@/public/images/333478817_933094361461009_7782895981002195868_n.jpg";

const sponsors = [
	{ id: 1, name: "Bro Code.", src: brocode, shape: "rectangle" },
	{ id: 2, name: "Immersive Gamebox", src: gamebox, shape: "rectangle" },
	{ id: 3, name: "Stripes", src: stripes, shape: "rectangle" },
	{ id: 4, name: "Brag Fit", src: bragfit, shape: "rectangle" },
	{ id: 5, name: "CosmoGen Students Society", src: cosmo, shape: "rectangle" },
	{
		id: 8,
		name: "Handa Mobile Care",
		src: handa_mobile_care,
		shape: "circle",
	},
	{ id: 9, name: "Mentor Labs", src: mentor_labs, shape: "rectangle" },
	{ id: 10, name: "Olivia", src: olivia, shape: "rectangle" },
	{ id: 11, name: "La Club", src: la_club, shape: "rectangle" },
];

export default function SponsorCarousel() {
	return (
		<div className="w-full bg-transparent mt-3 py-8 px-4 sm:px-6 md:px-8">
			<div className="mb-6 flex items-center justify-start">
				<div className="mr-3 h-5 w-1 rounded-full bg-purple-500"></div>
				<h2 className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-lg font-bold text-transparent sm:text-xl md:text-2xl">
					Previous Collaborations
				</h2>
			</div>

			<div className="relative overflow-hidden">
				<Swiper
					modules={[Autoplay]}
					autoplay={{
						delay: 0, // No delay for continuous movement
						disableOnInteraction: false,
					}}
					loop={true}
					speed={3000} // Faster speed (lower value = faster in Swiper)
					slidesPerView="auto"
					spaceBetween={20}
					freeMode={true} // Allows free movement
					grabCursor={true}
					className="sponsors-swiper"
				>
					{[...sponsors, ...sponsors].map((sponsor, index) => (
						<SwiperSlide
							key={`${sponsor.id}-${index}`}
							className="!w-auto"
						>
							<div className="sponsor-item flex flex-col items-center group pt-1">
								<div
									className={`sponsor-container relative ${
										sponsor.shape === "circle"
											? "rounded-full"
											: "rounded-lg"
									}`}
								>
									<div
										className={`metallic-border ${
											sponsor.shape === "circle"
												? "rounded-full"
												: "rounded-lg"
										} relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden sm:h-[150px] sm:w-[150px] md:h-[180px] md:w-[180px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300/30`}
									>
										<div className="relative h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-hidden">
											<div
												className={`absolute inset-0 ${
													sponsor.shape === "circle"
														? "rounded-full"
														: "rounded-lg"
												}`}
											>
												<Image
													src={sponsor.src || "/placeholder.svg"}
													alt={`${sponsor.name} logo`}
													className="h-full w-full object-cover grayscale filter-transition group-hover:grayscale-0 group-hover:brightness-110 group-hover:contrast-110 group-hover:saturate-150"
													fill
													sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
												/>
											</div>
										</div>
									</div>
								</div>
								<p className="mt-2 text-center text-xs sm:text-sm font-medium opacity-80 group-hover:opacity-100 group-hover:text-purple-400 transition-all duration-300">
									{sponsor.name}
								</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<style
				jsx
				global
			>{`
				.sponsors-swiper .swiper-wrapper {
					transition-timing-function: linear !important;
					will-change: transform;
				}

				.filter-transition {
					transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
					will-change: filter;
				}

				.metallic-border::before {
					content: "";
					position: absolute;
					inset: 0;
					background: linear-gradient(
						45deg,
						#71717a 25%,
						#e4e4e7 50%,
						#71717a 75%
					);
					background-size: 200% 200%;
					animation: shimmer 3s linear infinite;
					z-index: -1;
				}

				.metallic-border.rounded-full::before {
					border-radius: 50%;
				}

				.metallic-border.rounded-lg::before {
					border-radius: 0.5rem;
				}

				.group:hover .metallic-border::before {
					background: linear-gradient(
						45deg,
						#9333ea 25%,
						#e879f9 50%,
						#9333ea 75%
					);
					animation: shimmer 2s linear infinite;
				}

				@keyframes shimmer {
					0% {
						background-position: 200% 0;
					}
					100% {
						background-position: -200% 0;
					}
				}
			`}</style>
		</div>
	);
}
