import EventCarousel from "@/components/eventCarousel";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import CommunityCarousel from "@/components/communityCarousel";
import InfluencerCarousel from "@/components/influencerCarousel";
import HostSection from "@/components/hostSection";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<>
			<Hero />
			<EventCarousel />
			<CommunityCarousel />
			<InfluencerCarousel />
			<HostSection />
		</>
	);
}
