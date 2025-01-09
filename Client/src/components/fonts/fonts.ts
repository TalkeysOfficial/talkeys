import { Urbanist, Volkhov } from "next/font/google";

export const urbanist = Urbanist({
	weight: ["400", "700"],
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
