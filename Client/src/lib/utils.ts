import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// utils.ts
export function isTimePassed(dateString: string) {
	return new Date(dateString).getTime() <= Date.now();
}

const ALLOWED_REMOTE_IMAGE_HOSTS = new Set([
	"res.cloudinary.com",
	"api.dicebear.com",
	"encrypted-tbn0.gstatic.com",
	"localhost",
	"127.0.0.1",
]);

const BLOCKED_IMAGE_HOSTS = new Set([
	"google.com",
	"www.google.com",
	"images.google.com",
	"pinterest.com",
	"www.pinterest.com",
]);

export function getSafeImageSrc(
	src?: string | null,
	fallback = "/images/placeholder.jpg",
) {
	if (!src) return fallback;

	const trimmedSrc = src.trim();
	if (!trimmedSrc) return fallback;

	if (trimmedSrc.startsWith("/")) return trimmedSrc;

	try {
		const url = new URL(trimmedSrc);
		const hostname = url.hostname.toLowerCase();
		const pathname = url.pathname.toLowerCase();

		if (url.protocol !== "https:") return fallback;
		if (BLOCKED_IMAGE_HOSTS.has(hostname)) return fallback;
		if (!ALLOWED_REMOTE_IMAGE_HOSTS.has(hostname)) return fallback;
		if (pathname === "/url" || pathname.includes("/search")) return fallback;

		return trimmedSrc;
	} catch {
		return fallback;
	}
}
