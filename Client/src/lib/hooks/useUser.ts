"use client";

import useSWR from "swr";

/* ---------- 1. HARD-CODE YOUR EXPRESS HOST HERE ------------ */
const API = "http://localhost:8000";          // ← change port if your server differs
/* ----------------------------------------------------------- */

const fetcher = (endpoint: string) =>
  fetch(`${API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
    },
    credentials: "include",
  }).then((r) => {
    if (!r.ok) throw new Error("unauthorised");
    return r.json();
  });

export function useUser() {
  const { data, error, mutate } = useSWR("/dashboard/profile", fetcher);
  return {
    user: data,
    isLoading: !data && !error,
    error,
    mutate,
  };
}