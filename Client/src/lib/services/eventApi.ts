// services/eventApi.ts
import { getStoredAccessToken } from "@/lib/utils/authToken";

export type ApiError = { message?: string; error?: string; status?: number };
const BASE = process.env.BACKEND_URL;

const apiUrl = (path: string) => {
	if (!BASE) {
		throw new Error("BACKEND_URL is not configured");
	}
	return `${BASE}${path}`;
};

const authHeaders = () => {
	const token = getStoredAccessToken();
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

const parseJson = async (res: Response) => {
	try {
		return await res.json();
	} catch {
		return {};
	}
};

const throwApiError = (res: Response, data: ApiError) => {
	throw { status: res.status, ...data } as ApiError;
};

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

export async function joinTeam(teamCode: string, phoneNumber: string) {
	const res = await fetch(apiUrl("/joinTeam"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ teamCode, phoneNumber }),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { teamName: string };
}

export async function createTeamApi(opts: {
	phoneNumber: string;
	teamName: string;
	eventId: string;
}) {
	const res = await fetch(apiUrl("/createTeam"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({
			newPhoneNumber: opts.phoneNumber,
			teamName: opts.teamName,
			eventId: opts.eventId,
		}),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { team: { teamCode: string; teamName: string } };
}

export async function likeEvent(eventId: string) {
	const res = await fetch(apiUrl(`/likeEvent/${eventId}`), {
		method: "GET",
		headers: authHeaders(),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { status: string; liked: boolean; likes: number };
}
export async function unlikeEvent(eventId: string) {
	const res = await fetch(apiUrl(`/unlikeEvent/${eventId}`), {
		method: "GET",
		headers: authHeaders(),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as { status: string; liked: boolean; likes: number };
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

export async function bookTicket(opts: {
	eventId: string;
	passType?: string;
	passTypeId?: string;
	friends?: Array<{ name: string; email?: string; phone?: string }>;
	attendees?: Array<{
		name: string;
		email?: string;
		phone?: string;
		passTypeId?: string;
		passType?: string;
		passTypeName?: string;
	}>;
	passSelections?: Array<{
		passTypeId?: string;
		passType?: string;
		passTypeName?: string;
		quantity: number;
	}>;
	teamCode?: string;
}) {
	const res = await fetch(apiUrl("/api/book-ticket"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify(opts),
	});
	const data = await parseJson(res);
	if (!res.ok) throwApiError(res, data as ApiError);
	return data as {
		success: boolean;
		message: string;
		data: {
			paymentRequired?: boolean;
			paymentUrl: string | null;
			passId?: string;
			amount: number;
			amountInPaisa: number;
			totalTickets: number;
			qrStrings?: unknown[];
		};
	};
}
