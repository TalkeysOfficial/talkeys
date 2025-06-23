"use client";
import EventCarousel from "@/components/EventCarousel";
import { useEvents } from "@/lib/hooks/useEvents";

export default function BookmarksPage() {
  const { events } = useEvents({ type: "bookmarked" });
  return <EventCarousel category="Bookmarked Events" ev={events} />;
}
