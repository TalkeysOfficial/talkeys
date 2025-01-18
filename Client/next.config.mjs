import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		// You can add your environment variables here
		// Example: CUSTOM_VAR: process.env.CUSTOM_VAR
		BACKEND_URL: process.env.BACKEND_URL,
	},
	images: {
		domains: ["res.cloudinary.com"],
	},
};

export default nextConfig;
