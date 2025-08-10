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
	},
	images: {
		domains: ["res.cloudinary.com", "api.dicebear.com"],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; img-src * data:blob:;",
	},
};

// Wrap config with analyzer
export default withBundleAnalyzer(nextConfig);
