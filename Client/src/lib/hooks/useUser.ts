"use client";
import useSWR from "swr";
import { redirect } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:8000";

const fetcher = async (path: string) => {
  const token = localStorage.getItem("accessToken") ?? "";

  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    redirect("/sign");
  }

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export function useUser() {
  const { data, error, mutate } = useSWR("/dashboard/profile", fetcher, {
    revalidateOnFocus: true,
  });

  return { user: data, isLoading: !data && !error, error, mutate };
}
