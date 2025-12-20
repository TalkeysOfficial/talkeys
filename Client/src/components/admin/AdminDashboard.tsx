"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Event } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Calendar,
  Trash2,
} from "lucide-react";

// Import shared components
import PageHeader from "@/components/ui/shared/PageHeader";
import StatsCard from "@/components/ui/shared/StatsCard";
import TabsContainer from "@/components/ui/shared/TabsContainer";
import EventsGrid from "@/components/ui/shared/EventsGrid";
import SearchInput from "@/components/ui/shared/SearchInput";
import DeleteModeToggle from "./DeleteModeToggle";

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[] | null>();
  const [deleteMode, setDeleteMode] = useState(false);
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
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
        const { data } = (await response.json()) as {
          data: {
            events: Event[];
          };
        };
        const { events: fetchedEvents } = data;
        setEvents(fetchedEvents);

        // Calculate stats
        const now = new Date();
        const liveEvents = fetchedEvents.filter((event) => event.isLive);

        setStats({
          totalEvents: fetchedEvents.length,
          liveEvents: liveEvents.length,
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchAdmDetails() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/regisDetails`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        const data = await response.json();
        const { passes, y2kPasses, amount } = data;
        setPasses({
          totalPasses: data.passes,
          y2kPasses,
          amount,
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
    fetchAdmDetails();
  }, []);

  const filteredEvents = events?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (deleteMode) {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/deleteSpecificEvent/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        if (response.ok) {
          const updatedEvents = events?.filter((event) => event._id !== id);
          setEvents(updatedEvents);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalEvents: prev.totalEvents - 1,
            liveEvents: updatedEvents?.filter((e) => e.isLive)?.length ?? 0,
            pastEvents: updatedEvents?.filter((e) => !e.isLive)?.length ?? 0,
          }));
        }
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

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
          onDelete={handleDelete}
          deleteMode={deleteMode}
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
          <DeleteModeToggle
            deleteMode={deleteMode}
            setDeleteMode={setDeleteMode}
          />
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

      {deleteMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center z-50"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          <span>Delete mode is active. Click on an event to delete it.</span>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
