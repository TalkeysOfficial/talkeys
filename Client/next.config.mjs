import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		// ignoreBuildErrors: true,
	},
	env: {
		// You can add your environment variables here
		// Example: CUSTOM_VAR: process.env.CUSTOM_VAR
		BACKEND_URL: process.env.BACKEND_URL,
	},
	images: {
		domains: ["res.cloudinary.com", "api.dicebear.com"],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; img-src * data:blob:;",
	},

};

export default nextConfig;
