import dotenv from "dotenv";
import bundleAnalyzer from "@next/bundle-analyzer";

dotenv.config();

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
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
			// Local Server uploads are only needed in development.
			...(process.env.NODE_ENV === "production"
				? []
				: [
						{ protocol: "http", hostname: "localhost" },
						{ protocol: "http", hostname: "127.0.0.1" },
					]),
		],
		dangerouslyAllowSVG: true,
		// SVGs (dicebear avatars) are served sandboxed with scripts disabled.
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
				],
			},
		];
	},
};

// Wrap config with analyzer
export default withBundleAnalyzer(nextConfig);
