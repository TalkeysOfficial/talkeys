import { apiUrl, authHeaders, parseJson, throwApiError, type ApiError } from "@/lib/api";

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
