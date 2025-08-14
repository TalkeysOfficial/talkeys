// components/event/QRCodeDisplay.tsx
"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = { codes: string[] };

export default function QRCodeDisplay({ codes }: Props) {
	if (!codes.length) return null;

	return (
		<div className="relative w-full mt-4">
			<style
				dangerouslySetInnerHTML={{
					__html: `
        .qr-swiper .swiper-button-next, .qr-swiper .swiper-button-prev {
          background: rgba(138, 68, 203, 0.8);
          border-radius: 50%; width: 40px; height: 40px;
        }
        .qr-swiper .swiper-button-next:after, .qr-swiper .swiper-button-prev:after { font-size: 16px; font-weight: bold; }
        .qr-swiper .swiper-pagination-bullet { background: #666; }
        .qr-swiper .swiper-pagination-bullet-active { background: #8a44cb; }
      `,
				}}
			/>
			<Swiper
				modules={[Navigation, Pagination]}
				spaceBetween={20}
				slidesPerView={1}
				navigation={codes.length > 1}
				pagination={codes.length > 1 ? { clickable: true } : false}
				className="qr-swiper"
				style={
					{
						"--swiper-navigation-color": "#8A44CB",
						"--swiper-pagination-color": "#8A44CB",
					} as React.CSSProperties
				}
			>
				{codes.map((qrCode, index) => (
					<SwiperSlide key={`qr-${qrCode.substring(0, 8)}-${index}`}>
						<div className="flex flex-col items-center space-y-2 py-4">
							<div className="text-sm text-gray-400 mb-2">
								Pass {index + 1} of {codes.length}
							</div>
							<motion.div
								className="bg-white p-4 rounded-lg"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
							>
								<QRCode
									value={qrCode}
									size={150}
									level="M"
								/>
							</motion.div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
