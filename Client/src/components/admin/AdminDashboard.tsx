"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Event } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Calendar,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import shared components
import PageHeader from "@/components/ui/shared/PageHeader";
import StatsCard from "@/components/ui/shared/StatsCard";
import TabsContainer from "@/components/ui/shared/TabsContainer";
import EventsGrid from "@/components/ui/shared/EventsGrid";
import SearchInput from "@/components/ui/shared/SearchInput";

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[] | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    liveEvents: 0,
  });
  const [passes, setPasses] = useState({
    totalPasses: 0,
    y2kPasses: 0,
    amount: 0,
  });

  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch(
        `${process.env.BACKEND_URL}/admin/events?limit=200&sortBy=createdAt&order=desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch events");

      const { data } = (await response.json()) as {
        data: {
          events: Event[];
        };
      };
      const fetchedEvents = data.events || [];
      setEvents(fetchedEvents);
      setStats({
        totalEvents: fetchedEvents.length,
        liveEvents: fetchedEvents.filter((event) => event.isLive).length,
      });
    }

    async function fetchAdmDetails() {
      const response = await fetch(
        `${process.env.BACKEND_URL}/regisDetails`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch admin details");

      const data = await response.json();
      setPasses({
        totalPasses: data.passes || 0,
        y2kPasses: data.y2kPasses || 0,
        amount: data.amount || 0,
      });
    }

    async function loadDashboard() {
      setIsLoading(true);
      const results = await Promise.allSettled([fetchEvents(), fetchAdmDetails()]);
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Admin dashboard load failed:", result.reason);
        }
      });
      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Create tab content components
  const createTabContent = (events: Event[] | undefined, title: string) => (
    <Card className="bg-gray-900/60 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Search events..."
          />
        </div>
      </CardHeader>
      <CardContent>
        <EventsGrid
          events={events}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );

  // Define tabs
  const tabs = [
    {
      value: "all",
      label: "All Events",
      content: createTabContent(filteredEvents, "All Events"),
    },
    {
      value: "live",
      label: "Live Events",
      content: createTabContent(
        filteredEvents?.filter((event) => event.isLive),
        "Live Events",
      ),
    },
    {
      value: "past",
      label: "Past Events",
      content: createTabContent(
        filteredEvents?.filter((event) => !event.isLive),
        "Past Events",
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        rightContent={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="bg-purple-700 text-white hover:bg-purple-600"
            >
              <Link href="/admin/addEvent">
                <PlusCircle className="h-4 w-4" />
                Add Event
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          description="Manage all your events"
          icon={<CalendarDays className="h-6 w-6" />}
          className="bg-gradient-to-br from-purple-900/80 to-purple-700/50 border-purple-500/30"
          iconClassName="text-purple-300"
          index={0}
        />

        <StatsCard
          title="Live Events"
          value={stats.liveEvents}
          description="Currently active events"
          icon={<TrendingUp className="h-6 w-6" />}
          className="bg-gradient-to-br from-blue-900/80 to-blue-700/50 border-blue-500/30"
          iconClassName="text-blue-300"
          index={1}
        />

        <StatsCard
          title="Total Passes Issued"
          value={passes.totalPasses}
          description={"Y2kPasses: " + passes.y2kPasses + ""}
          icon={<Calendar className="h-6 w-6" />}
          className="bg-gradient-to-br from-amber-900/80 to-amber-700/50 border-amber-500/30"
          iconClassName="text-amber-300"
          index={2}
        />

        <StatsCard
          title="Amount Collected"
          value={passes.amount}
          description="Live from DB"
          icon={<Users className="h-6 w-6" />}
          className="bg-gradient-to-br from-emerald-900/80 to-emerald-700/50 border-emerald-500/30"
          iconClassName="text-emerald-300"
          index={3}
        />
      </div>

      <TabsContainer tabs={tabs} defaultValue="all" />

    </div>
  );
};

export default AdminDashboard;
