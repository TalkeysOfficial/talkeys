"use client";

import { useState } from "react";
import EventCarousel from "@/components/EventCarousel";
import { useEvents } from "@/lib/hooks/useEvents";
import RangePills from "@/components/dashboard/RangePills";

export default function HostedPage() {
  const [period, setPeriod] = useState<"1m" | "6m" | "1y">("1m");
  const { events } = useEvents({ type: "hosted", period });

  return (
    <div className="space-y-10">
      <RangePills value={period} onChange={setPeriod} />
      <EventCarousel category="Hosted Events" ev={events} />
    </div>
  );
}
