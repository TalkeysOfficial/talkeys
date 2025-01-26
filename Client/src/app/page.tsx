import EventCarousel from "@/components/EventCarousel";
import Hero from "@/components/Hero";
import CommunityCarousel from "@/components/CommunityCarousel";
import InfluencerCarousel from "@/components/InfluencerCarousel";
import HostSection from "@/components/HostSection";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Home() {
	return (
		<GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com">
			<Hero />
			<EventCarousel />
			<CommunityCarousel />
			<InfluencerCarousel />
			<HostSection />
		</GoogleOAuthProvider>
	);
}
