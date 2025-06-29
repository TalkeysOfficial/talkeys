"use client";

import EventCarousel from "@/components/EventCarousel";
import { useEvents } from "@/lib/hooks/useEvents";

export default function BookmarksPage() {
  const { events } = useEvents({ type: "bookmarked" });

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <EventCarousel category="Bookmarked Events" ev={events} />
    </div>
  );
}
