"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import EventList from "./EventList";
import DeleteModeToggle from "./DeleteModeToggle";
import type { Event } from "@/types/types";

const AdminDashboard: React.FC = () => {
	const [events, setEvents] = useState<Event[] | null>();
	const [deleteMode, setDeleteMode] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		async function fetchEvents() {
			const response = await fetch(`${process.env.BACKEND_URL}/getEvents`);
			const { data } = (await response.json()) as {
				data: {
					events: Event[];
				};
			};
			const { events: fetchedEvents } = data;
			setEvents(fetchedEvents);
		}
		fetchEvents();
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
							Authorization: `Bearer ${localStorage.getItem(
								"accessToken",
							)}`,
						},
					},
				);
				if (response.ok) {
					const updatedEvents = events?.filter(
						(event) => event._id !== id,
					);
					setEvents(updatedEvents);
				}
			} catch (error) {
				alert("Failed to delete event");
				alert(error);
			}
		} else {
			alert("Delete mode is off");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="container mx-auto"
		>
			<h1 className="text-3xl font-bold mb-6 pt-10">Admin Dashboard</h1>
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
				<SearchBar onSearch={setSearchTerm} />
				<DeleteModeToggle
					deleteMode={deleteMode}
					setDeleteMode={setDeleteMode}
				/>
			</div>
			<EventList
				events={filteredEvents}
				onDelete={handleDelete}
				deleteMode={deleteMode}
			/>
		</motion.div>
	);
};

export default AdminDashboard;
