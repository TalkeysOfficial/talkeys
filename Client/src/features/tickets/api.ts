import { apiUrl, authHeaders, parseJson, throwApiError, type ApiError } from "@/lib/api";

export async function getPass(eventId: string) {
	const res = await fetch(apiUrl("/getPass"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ eventId }),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data;
}

export async function bookPass(teamCode: string, eventId: string) {
	const res = await fetch(apiUrl("/bookPass"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ teamCode, eventId }),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data;
}

export function getPassByUuid(uuid: string) {
	return fetch(`${process.env.BACKEND_URL}/api/passbyuuid/${uuid}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
		},
	});
}
