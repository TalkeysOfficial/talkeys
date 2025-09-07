import React from "react";
import Link from "next/link";
import Image from "next/image";

// Using a more relevant and professional image for the theme of creating courses.
import courseCreationImage from "@/public/images/disco.png"; // You can replace this path with a more suitable image

export default function HostCourseSection() {
    return (
        <div
            className="w-full p-4 sm:p-6 lg:p-8"
            style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)",
            }}
        >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-white shadow-xl">
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Left side content */}
                    <div className="p-8 sm:p-12 lg:p-16 text-center lg:text-left lg:w-1/2">
                        {/* MODIFIED: Updated typography and copy for a professional feel */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#102542] leading-tight">
                            Launch Your Own Course
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
                            Share your expertise, build a community, and start earning. We provide the tools to create and manage your courses seamlessly.
                        </p>

                        {/* MODIFIED: Restyled button with brand colors and modern look */}
                        <Link
                            href="/createEvent" // This link now leads to the course creation page as requested
                            className="inline-block mt-10 px-8 py-4 bg-[#F87060] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#F87060]/90 transition-transform duration-300 transform hover:scale-105"
                        >
                            Create a Course
                        </Link>
                    </div>

                    {/* Right side image */}
                    <div className="relative w-full lg:w-1/2 h-64 lg:h-auto self-stretch">
                        <Image
                            src={courseCreationImage}
                            alt="A person creating and launching a digital course"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}