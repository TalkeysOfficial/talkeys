import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import bg from "@/public/images/Default.png";
import smallBg from "@/public/images/smallDefault.png";

const Hero = () => {
  return (
    <div className="relative w-full pt-16">
      {/* Mobile hero (no fixed height, no letterboxing) */}
      <div className="relative block sm:hidden w-full overflow-hidden bg-black">
        {/* Image scales down to fit, keeps aspect ratio, no crop */}
        <Image
          src={smallBg}
          alt="Events background"
          // Static import supplies width/height; using w-full h-auto prevents extra space
          className="w-full h-auto object-contain"
          sizes="100vw"
          priority
          quality={100}
        />

        {/* Overlay content centered */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-[360px] bg-black/60 backdrop-blur-sm rounded-[16px] p-4 text-center text-white">
            <h1 className="text-2xl font-bold mb-2">
              Explore shows and events with ease.
            </h1>
            <p className="text-sm mb-4">
              Connect with fellow enthusiasts in our chat rooms. Share
              experiences and ideas anonymously.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/underConstruct" className="w-full">
                <Button size="sm" className="w-full rounded-[8px] bg-purple-600 hover:bg-purple-700">
                  Explore Communities
                </Button>
              </Link>
              <Link href="/eventPage" className="w-full">
                <Button size="sm" className="w-full rounded-[8px] bg-purple-600 hover:bg-purple-700">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop hero (keeps cover + fixed height) */}
      <div className="relative hidden sm:block h-[75vh] w-full overflow-hidden bg-black">
        <Image
          src={bg}
          alt="Events background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full sm:w-1/2 max-w-[800px] bg-black/60 backdrop-blur-sm rounded-[16px] p-6 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Explore shows and events with ease.
            </h1>
            <p className="text-lg mb-6">
              Connect with fellow enthusiasts in our chat rooms. Share
              experiences and ideas anonymously.
            </p>
            <div className="flex flex-row justify-center gap-4">
              <Link href="/underConstruct">
                <Button className="rounded-[8px] bg-purple-600 hover:bg-purple-700">
                  Explore Communities
                </Button>
              </Link>
              <Link href="/eventPage">
                <Button className="rounded-[8px] bg-purple-600 hover:bg-purple-700">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;