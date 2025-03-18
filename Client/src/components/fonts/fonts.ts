import { Urbanist, Volkhov } from "next/font/google";

export const urbanist = Urbanist({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	style: "normal",
	subsets: ["latin", "latin-ext"],
	fallback: ["sans-serif"],
});

export const volkhov = Volkhov({
	weight: ["700"],
	style: "normal",
	subsets: ["latin"],
	fallback: ["sans-serif"],
});
