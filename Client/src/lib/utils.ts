import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// utils.ts
export function isTimePassed(dateString: string) {
	return new Date(dateString).getTime() <= Date.now();
}
