"use client";

import { useState } from "react";
import RangePills      from "@/features/dashboard/components/RangePills";
import EventCarousel   from "@/features/events/components/EventCarousel";
import { useEvents }   from "@/features/events/hooks/useEvents";

export default function HostedPage() {
  const [period, setPeriod] = useState<"1m" | "6m" | "1y">("1m");
  const { events } = useEvents({ type: "hosted", period });

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 space-y-10">
      <RangePills value={period} onChange={setPeriod} />
      <EventCarousel category="Hosted Events" ev={events} />
    </div>
  );
}
