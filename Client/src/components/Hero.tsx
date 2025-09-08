"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArcaneBook from "./ArcaneBook"; // Import our new 3D component
import { Suspense } from 'react';

const Hero = () => {
    return (
        <div 
            className="w-full"
            style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)' }}
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center" style={{ minHeight: 'calc(100vh - 80px)'}}>
                
                {/* Left Column: 3D Model */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-[80vh]">
                  <Suspense fallback={<div className="w-full h-full flex justify-center items-center">Loading 3D Model...</div>}>
                    <ArcaneBook />
                  </Suspense>
                </div>

                {/* Right Column: Text Content */}
                <div className="w-full md:w-1/2 text-center md:text-left p-8">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-[#2c3e50]">
                        Unlock a New Chapter in Education.
                    </h1>
                    
                    <p className="text-lg md:text-xl mb-8 text-[#555555]">
                        Connect with fellow enthusiasts in our chat rooms. Share
                        experiences and ideas anonymously.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                        <Link href="/underConstruct">
                            <Button className="rounded-[8px] bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-6 text-lg">
                                Explore Communities
                            </Button>
                        </Link>
                        <Link href="/eventPage">
                            <Button className="rounded-[8px] bg-transparent text-[#FF6600] border-2 border-[#FF6600] hover:bg-[#FF6600] hover:text-white px-8 py-6 text-lg transition-colors duration-300">
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