// Shared fetch helpers for the Talkeys API: base URL, auth header, JSON parsing and error shape.
import { getStoredAccessToken } from "@/features/auth/authToken";

export type ApiError = { message?: string; error?: string; status?: number };
const BASE = process.env.BACKEND_URL;

export const apiUrl = (path: string) => {
	if (!BASE) {
		throw new Error("BACKEND_URL is not configured");
	}
	return `${BASE}${path}`;
};

export const authHeaders = () => {
	const token = getStoredAccessToken();
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

export const parseJson = async (res: Response) => {
	try {
		return await res.json();
	} catch {
		return {};
	}
};

export const throwApiError = (res: Response, data: ApiError) => {
	throw { status: res.status, ...data } as ApiError;
};
