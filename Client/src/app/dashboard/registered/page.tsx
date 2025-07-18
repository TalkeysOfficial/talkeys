"use client";

import { useEffect, useState } from "react";
import EventCarousel from "@/components/EventCarousel";
import type { Event } from "@/types/types";

export default function RegisteredEvents() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [attended, setAttended] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.talkeys.xyz/getEvents");
        const json = await res.json() as {
          data: { events: Event[] };
        };

        const events = json.data.events;
        const now = new Date();

        setUpcoming(
          events.filter(e => new Date(e.startDate) >= now),
        );
        setPast(
          events.filter(e => new Date(e.startDate) < now),
        );
        const attendedRes = await fetch("/dashboard/attended-events", {
          credentials: "include",
        });
        const attendedJson = await attendedRes.json();
        setAttended(attendedJson.events || []);

      } catch (err) {
        console.error("registered/page - could not load events:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-[88px] px-4 sm:px-6 lg:px-8">

      {!loading && (
        <>
          {/* UPCOMING — identical styling to home page */}
          <EventCarousel
            category="Upcoming Events"
            ev={upcoming}
          />

          {/* ATTENDED */}
          {attended.length > 0 && (
            <EventCarousel
              category="You Recently Attended"
              ev={attended}
            />
          )}
          {/* PAST  */}
          <EventCarousel
            category="Past Events"
            ev={past}
          />
        </>
      )}
    </div>
  );
}
