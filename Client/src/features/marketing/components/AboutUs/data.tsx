import { Users, Lightbulb, Target, Heart } from "lucide-react";

export const sections = [
	{
		id: "mission",
		title: "Our Mission",
		icon: <Target className="h-5 w-5" />,
		content:
			"Our mission is to create a space where the voices of emerging artists are amplified, giving them equal footing to showcase their craft. We want to build a world where artistic discovery is powered by real communities, where both creators and fans can thrive together.",
	},
	{
		id: "vision",
		title: "Our Vision",
		icon: <Lightbulb className="h-5 w-5" />,
		content:
			"At Talkeys, we believe in a future where every artist, established or emerging, has the freedom to create their own community. We envision a platform where celebrated artists can deepen their connections with their fans, while underrated talent gets the opportunity to rise and shine.",
	},
	{
		id: "values",
		title: "Our Values",
		icon: <Heart className="h-5 w-5" />,
		content:
			"We value authenticity, creativity, and community. We believe in giving voice to the underrepresented, fostering genuine connections, and celebrating the diversity of artistic expression. Our platform is built on the principles of inclusivity, transparency, and respect for all creators and fans.",
	},
	{
		id: "community",
		title: "Our Community",
		icon: <Users className="h-5 w-5" />,
		content:
			"Talkeys is home to diverse communities of passionate fans and creators. Whether you're a die-hard anime lover, a formula racing enthusiast, a desi hip-hop fan, or part of any niche community, Talkeys is where your world gets louder, more connected, and more exciting.",
	},
];
