"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArcaneBook from "./ArcaneBook"; // Your 3D component
import { Suspense } from 'react';

// Color Palette:
// Oxford Blue: #102542
// Bittersweet: #F87060
// White/Anti-flash white: #FFFFFF / #F0F2F5

const Hero = () => {
    return (
        <div 
            className="w-full"
            // The background gradient remains the same as you requested
            style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)' }}
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center" style={{ minHeight: 'calc(100vh - 80px)'}}>
                
                {/* Left Column: 3D Model */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh]">
                  <Suspense fallback={<div className="w-full h-full flex justify-center items-center text-[#102542]">Loading 3D Model...</div>}>
                    <ArcaneBook />
                  </Suspense>
                </div>

                {/* Right Column: Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left p-8">
                    {/* UPDATED: Headline with new text and Oxford Blue color */}
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-[#102542]">
                        AI-Powered Learning. Community-Forged Knowledge.
                    </h1>
                    
                    {/* UPDATED: Sub-headline with new text and a slightly muted Oxford Blue for hierarchy */}
                    <p className="text-lg md:text-xl mb-8 text-[#102542]/80">
                        Join a decentralized ecosystem where educators create with powerful AI tools and students shape the content they love. Learn, contribute, and earn in the next generation of online education.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                        {/* UPDATED: Primary Button for students, using Bittersweet color */}
                        <Link href="/courses">
                            <Button className="rounded-[8px] bg-[#F87060] hover:bg-[#E96A51] text-white px-8 py-6 text-lg transition-colors duration-300">
                                Browse Courses
                            </Button>
                        </Link>
                        {/* UPDATED: Secondary Button for educators, using Bittersweet outline */}
                        <Link href="/educators">
                            <Button className="rounded-[8px] bg-transparent text-[#F87060] border-2 border-[#F87060] hover:bg-[#F87060] hover:text-white px-8 py-6 text-lg transition-colors duration-300">
                                For Educators
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;