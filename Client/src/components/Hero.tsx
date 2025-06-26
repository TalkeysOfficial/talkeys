import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import bg from "@/public/images/Default.png";
import smallBg from "@/public/images/smallDefault.png";

const Hero = () => {
  return (
    <div className="relative w-full pt-16">
      {/* Background as a fixed height container */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        {/* Card Images Container - This is what gives the background card effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full">
            {/* Desktop Background */}
            <div className="hidden sm:block w-full h-full">
              <Image
                src={bg}
                alt="Events background"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
            </div>
            
            {/* Mobile Background */}
            <div className="block sm:hidden w-full h-full">
              <Image
                src={smallBg}
                alt="Events background"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content overlay - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90%] sm:w-[50%] max-w-[800px] bg-black/60 backdrop-blur-sm rounded-[16px] p-4 sm:p-6 text-center">
            {/* Desktop Content */}
            <div className="hidden sm:block text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Explore shows and events with ease.
              </h1>
              <p className="text-lg mb-6">
                Connect with fellow enthusiasts in our chat rooms. Share
                experiences and ideas anonymously.
              </p>
              <div className="flex flex-row justify-center gap-4">
                <Link href="/exploreCommunities">
                  <Button
                    className="rounded-[8px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Explore Communities
                  </Button>
                </Link>
                <Link href="/eventPage">
                  <Button
                    className="rounded-[8px] bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Explore Events
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Mobile Content */}
            <div className="block sm:hidden text-white">
              <h1 className="text-2xl font-bold mb-2">
                Explore shows and events with ease.
              </h1>
              <p className="text-sm mb-4">
			  Connect with fellow enthusiasts in our chat rooms. Share
			  experiences and ideas anonymously.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/exploreCommunities" className="w-full">
                  <Button
                    size="sm"
                    className="rounded-[8px] w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Explore Communities
                  </Button>
                </Link>
                <Link href="/eventPage" className="w-full">
                  <Button
                    size="sm"
                    className="rounded-[8px] w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Explore Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Hero;