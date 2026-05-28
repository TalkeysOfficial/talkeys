// services/eventApi.ts
export type ApiError = { message: string };
const BASE = process.env.BACKEND_URL;

const apiUrl = (path: string) => {
	if (!BASE) {
		throw new Error("BACKEND_URL is not configured");
	}
	return `${BASE}${path}`;
};

const authHeaders = () => ({
	"Content-Type": "application/json",
	Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export async function getPass(eventId: string) {
	const res = await fetch(apiUrl("/getPass"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ eventId }),
	});
	const data = await res.json();
	if (!res.ok) throw data as ApiError;
	return data;
}

export async function joinTeam(teamCode: string, phoneNumber: string) {
	const res = await fetch(apiUrl("/joinTeam"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ teamCode, phoneNumber }),
	});
	const data = await res.json();
	if (!res.ok) throw { status: res.status, ...(data as ApiError) };
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
	const data = await res.json();
	if (!res.ok) throw { status: res.status, ...(data as ApiError) };
	return data as { team: { teamCode: string; teamName: string } };
}

export async function likeEvent(eventId: string) {
	return fetch(apiUrl(`/likeEvent/${eventId}`), {
		method: "GET",
		headers: authHeaders(),
	});
}
export async function unlikeEvent(eventId: string) {
	return fetch(apiUrl(`/unlikeEvent/${eventId}`), {
		method: "GET",
		headers: authHeaders(),
	});
}

export async function bookPass(teamCode: string, eventId: string) {
	const res = await fetch(apiUrl("/bookPass"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({ teamCode, eventId }),
	});
	const data = await res.json();
	if (!res.ok) throw data as ApiError;
	return data;
}

export async function bookTicket(opts: {
	eventId: string;
	passType: string;
	friends: Array<{ name: string; email: string; phone: string }>;
	teamCode?: string;
}) {
	const res = await fetch(apiUrl("/api/book-ticket"), {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify(opts),
	});
	const data = await res.json();
	if (!res.ok) throw data as ApiError;
	return data as { data: { paymentUrl: string } };
}
