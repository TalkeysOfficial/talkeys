import dotenv from "dotenv";
import bundleAnalyzer from "@next/bundle-analyzer";

dotenv.config();

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// ignoreDuringBuilds: true,
	},
	typescript: {
		// ignoreBuildErrors: true,
	},
	env: {
		BACKEND_URL: process.env.BACKEND_URL,
		GOOGLE_CLIENT_ID:
			process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
			{
				protocol: "https",
				hostname: "encrypted-tbn0.gstatic.com",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; img-src * data:blob:;",
	},
};

// Wrap config with analyzer
export default withBundleAnalyzer(nextConfig);
