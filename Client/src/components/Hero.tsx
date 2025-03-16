// import React from "react";
// import Image from "next/image";
// import { Button } from "./ui/button";
// import Link from "next/link";
// import bg from "@/public/images/Default.png";
// import smallBg from "@/public/images/smallDefault.png";
// // import new_bg from "@/public/images/new_bg.png";

// const Hero = () => {
// 	return (
// 		<div className="hero relative h-screen flex justify-center items-center">
// 			<div className="hidden sm:block">
// 				<Image
// 					src={bg}
// 					alt="Hero background"
// 					layout="fill"
// 					objectFit="cover"
// 					quality={100}
// 					priority
// 				/>
// 			</div>
// 			<div className="block sm:hidden">
// 				<Image
// 					src={smallBg}
// 					alt="Hero background"
// 					layout="fill"
// 					objectFit="cover"
// 					quality={100}
// 					priority
// 				/>
// 			</div>
// 			<div className="absolute inset-0 bg-black/30" />
// 			<div className="relative z-10 w-full max-w-[90%] sm:max-w-[670px] bg-black/80 rounded-[20px] p-6 sm:p-8">
// 				<div className="text-center text-white">
// 					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
// 						Explore shows and events with ease.
// 					</h1>
// 					<p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
// 						Connect with fellow enthusiasts in our chat rooms. Share
// 						experiences and ideas anonymously.
// 					</p>
// 					<div className="flex flex-col sm:flex-row justify-center gap-4">
// 						<Link
// 							href="/underConstruct"
// 							className="w-full sm:w-auto"
// 						>
// 							<Button
// 								size="lg"
// 								className="rounded-[8px] w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
// 							>
// 								Explore Communities
// 							</Button>
// 						</Link>
// 						<Link
// 							href="/eventPage"
// 							className="w-full sm:w-auto"
// 						>
// 							<Button
// 								size="lg"
// 								className="rounded-[8px] w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
// 							>
// 								Explore Events
// 							</Button>
// 						</Link>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Hero;



// import React from "react";
// import Image from "next/image";
// import { Button } from "./ui/button";
// import Link from "next/link";
// import bg from "@/public/images/Default.png";
// import smallBg from "@/public/images/smallDefault.png";

// const Hero = () => {
//   return (
//     <div className="hero relative h-screen flex justify-center items-center">
//       {/* Desktop Background */}
//       <div className="hidden sm:block">
//         <Image
//           src={bg}
//           alt="Hero background"
//           layout="fill"
//           objectFit="contain" // Change to "contain" if you want to see the whole image without cropping
// 		  quality={100}
//           priority
//         />
//       </div>
      
//       {/* Mobile Background */}
//       <div className="block sm:hidden">
//         <Image
//           src={smallBg}
//           alt="Hero background"
//           layout="fill"
//           objectFit="contain" // You can also change this to "contain" for mobile
//           quality={100}
//           priority
//         />
//       </div>
      
//       <div className="absolute inset-0 bg-black/30" />
      
//       {/* Desktop Content */}
//       <div className="relative z-10 w-full max-w-[90%] sm:max-w-[670px] bg-black/80 rounded-[20px] p-6 sm:p-8">
//         {/* Desktop Message */}
//         <div className="hidden sm:block text-center text-white">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             Explore shows and events with ease.
//           </h1>
//           <p className="text-lg md:text-xl mb-8">
//             Connect with fellow enthusiasts in our chat rooms. Share
//             experiences and ideas anonymously.
//           </p>
//           <div className="flex flex-row justify-center gap-4">
//             <Link href="/underConstruct" className="w-auto">
//               <Button
//                 size="lg"
//                 className="rounded-[8px] w-auto bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 Explore Communities
//               </Button>
//             </Link>
//             <Link href="/eventPage" className="w-auto">
//               <Button
//                 size="lg"
//                 className="rounded-[8px] w-auto bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 Explore Events
//               </Button>
//             </Link>
//           </div>
//         </div>
        
//         {/* Mobile Message - Different content for mobile */}
//         <div className="block sm:hidden text-center text-white">
//           <h1 className="text-3xl font-bold mb-3">
//             Discover Events on the Go
//           </h1>
//           <p className="text-base mb-6">
//             Find local events and connect with your community anywhere, anytime.
//           </p>
//           <div className="flex flex-col gap-3">
//             <Link href="/underConstruct" className="w-full">
//               <Button
//                 size="lg"
//                 className="rounded-[8px] w-full bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 Explore Communities
//               </Button>
//             </Link>
//             <Link href="/eventPage" className="w-full">
//               <Button
//                 size="lg"
//                 className="rounded-[8px] w-full bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 Browse Events
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;




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
          <div className="w-[50%] max-w-[800px] bg-black/60 backdrop-blur-sm rounded-[16px] p-4 sm:p-6 text-center">
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
                <Link href="/underConstruct">
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
                Discover Events on the Go
              </h1>
              <p className="text-sm mb-4">
                Find local events and connect with your community anywhere, anytime.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/underConstruct" className="w-full">
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
                    Browse Events
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