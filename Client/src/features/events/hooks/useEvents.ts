//@ts-nocheck
//@ts-ignore

import useSWR from "swr";
import type { Event } from "@/types/types";

interface Opts {
	type: "registered" | "bookmarked" | "hosted";
	status?: "upcoming" | "past";
	period?: "1m" | "6m" | "1y";
}
const API_BASE_URL = process.env.BACKEND_URL;
const buildUrl = ({ type, status, period }: Opts) => {
	const p = new URLSearchParams({ type });
	if (status) p.set("status", status);
	if (period) p.set("period", period);
	return `${API_BASE_URL}/dashboard/events?${p.toString()}`;
};

export function useEvents(opts: Opts) {
	const url = buildUrl(opts);

	const { data, error, mutate } = useSWR<{ events: Event[] }>(url, (u) =>
		fetch(u, {
			headers: {
				Authorization: `Bearer ${
					localStorage.getItem("accessToken") ?? ""
				}`,
			},
		}).then((r) => r.json()),
	);

	return {
		events: data?.events ?? [],
		isLoading: !data && !error,
		error,
		mutate,
	};
}
