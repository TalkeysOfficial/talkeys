// Event likes API.
import { apiUrl, authHeaders, parseJson, throwApiError, type ApiError } from "@/lib/api";

export async function likeEvent(eventId: string) {
	const res = await fetch(apiUrl(`/likeEvent/${eventId}`), {
		method: "POST",
		headers: authHeaders(),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { status: string; liked: boolean; likes: number };
}
export async function unlikeEvent(eventId: string) {
	const res = await fetch(apiUrl(`/unlikeEvent/${eventId}`), {
		method: "POST",
		headers: authHeaders(),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { status: string; liked: boolean; likes: number };
}
