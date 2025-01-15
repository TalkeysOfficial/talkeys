import EventCarousel from "@/components/eventCarousel";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import CommunityCarousel from "@/components/communityCarousel";
import InfluencerCarousel from "@/components/influencerCarousel";
import HostSection from "@/components/hostSection";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Home() {
	return (
		<>
		<GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com" >
			<Hero />
			<EventCarousel />
			<CommunityCarousel />
			<InfluencerCarousel />
			<HostSection />
		</GoogleOAuthProvider>
		</>
	);
}
