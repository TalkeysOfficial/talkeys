import useSWR from "swr";

type Range = "1m" | "6m" | "1y";

export function useActivity(range: Range) {
  const url = `/dashboard/activity?range=${range}`;

  const { data, error } = useSWR(url, (u) =>
    fetch(u, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
      },
    }).then((r) => r.json()),
  );

  return {
    data:
      data ?? { eventsAttended: [] as any[], communitiesJoined: [] as any[] },
    isLoading: !data && !error,
    error,
  };
}
