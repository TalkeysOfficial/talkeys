"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import EventList from "./EventList";
import DeleteModeToggle from "./DeleteModeToggle";
import type { Event } from "@/types/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CalendarDays,
	Users,
	TrendingUp,
	Calendar,
	Trash2,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
	const [events, setEvents] = useState<Event[] | null>();
	const [deleteMode, setDeleteMode] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		totalEvents: 0,
		liveEvents: 0,
		pastEvents: 0,
		totalRegistrations: 0,
	});

	useEffect(() => {
		async function fetchEvents() {
			setIsLoading(true);
			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEvents`,
				);
				const { data } = (await response.json()) as {
					data: {
						events: Event[];
					};
				};
				const { events: fetchedEvents } = data;
				setEvents(fetchedEvents);

				// Calculate stats
				const now = new Date();
				const liveEvents = fetchedEvents.filter(
					(event) => event.isLive && new Date(event.startDate) >= now,
				);
				const pastEvents = fetchedEvents.filter(
					(event) => !event.isLive || new Date(event.startDate) < now,
				);
				const totalRegistrations = fetchedEvents.reduce(
					(sum, event) => sum + (event.registrationCount || 0),
					0,
				);

				setStats({
					totalEvents: fetchedEvents.length,
					liveEvents: liveEvents.length,
					pastEvents: pastEvents.length,
					totalRegistrations,
				});
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setIsLoading(false);
			}
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

					// Update stats
					setStats((prev) => ({
						...prev,
						totalEvents: prev.totalEvents - 1,
						liveEvents:
							updatedEvents?.filter((e) => e.isLive)?.length || 0,
						pastEvents:
							updatedEvents?.filter((e) => !e.isLive)?.length || 0,
					}));
				}
			} catch (error) {
				console.error("Failed to delete event:", error);
			}
		}
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.1,
				duration: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.5 },
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="container mx-auto px-4 py-8"
		>
			<motion.div
				variants={itemVariants}
				className="flex flex-col sm:flex-row justify-between items-center mb-8"
			>
				<h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
					Admin Dashboard
				</h1>
				<DeleteModeToggle
					deleteMode={deleteMode}
					setDeleteMode={setDeleteMode}
				/>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
			>
				<Card className="bg-gradient-to-br from-purple-900/80 to-purple-700/50 border-purple-500/30 text-white">
					<CardHeader className="pb-2">
						<CardDescription className="text-purple-200">
							Total Events
						</CardDescription>
						<CardTitle className="text-3xl flex items-center">
							{stats.totalEvents}
							<CalendarDays className="ml-auto h-6 w-6 text-purple-300" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-purple-200">
							Manage all your events
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-blue-900/80 to-blue-700/50 border-blue-500/30 text-white">
					<CardHeader className="pb-2">
						<CardDescription className="text-blue-200">
							Live Events
						</CardDescription>
						<CardTitle className="text-3xl flex items-center">
							{stats.liveEvents}
							<TrendingUp className="ml-auto h-6 w-6 text-blue-300" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-blue-200">
							Currently active events
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-amber-900/80 to-amber-700/50 border-amber-500/30 text-white">
					<CardHeader className="pb-2">
						<CardDescription className="text-amber-200">
							Past Events
						</CardDescription>
						<CardTitle className="text-3xl flex items-center">
							{stats.pastEvents}
							<Calendar className="ml-auto h-6 w-6 text-amber-300" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-amber-200">Completed events</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-emerald-900/80 to-emerald-700/50 border-emerald-500/30 text-white">
					<CardHeader className="pb-2">
						<CardDescription className="text-emerald-200">
							Total Registrations
						</CardDescription>
						<CardTitle className="text-3xl flex items-center">
							{stats.totalRegistrations}
							<Users className="ml-auto h-6 w-6 text-emerald-300" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-sm text-emerald-200">
							Total user sign-ups
						</div>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div
				variants={itemVariants}
				className="mb-8"
			>
				<Tabs
					defaultValue="all"
					className="w-full"
				>
					<TabsList className="bg-gray-800 w-full mb-6">
						<TabsTrigger
							value="all"
							className="data-[state=active]:bg-purple-600"
						>
							All Events
						</TabsTrigger>
						<TabsTrigger
							value="live"
							className="data-[state=active]:bg-purple-600"
						>
							Live Events
						</TabsTrigger>
						<TabsTrigger
							value="past"
							className="data-[state=active]:bg-purple-600"
						>
							Past Events
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="all"
						className="mt-0"
					>
						<Card className="bg-gray-900/60 border-gray-700">
							<CardHeader className="pb-3">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<CardTitle className="text-xl text-white">
										All Events
									</CardTitle>
									<SearchBar onSearch={setSearchTerm} />
								</div>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									<div className="flex justify-center py-12">
										<motion.div
											className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
										/>
									</div>
								) : (
									<AnimatePresence mode="wait">
										<EventList
											events={filteredEvents}
											onDelete={handleDelete}
											deleteMode={deleteMode}
										/>
									</AnimatePresence>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent
						value="live"
						className="mt-0"
					>
						<Card className="bg-gray-900/60 border-gray-700">
							<CardHeader className="pb-3">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<CardTitle className="text-xl text-white">
										Live Events
									</CardTitle>
									<SearchBar onSearch={setSearchTerm} />
								</div>
							</CardHeader>
							<CardContent>
								<EventList
									events={filteredEvents?.filter(
										(event) => event.isLive,
									)}
									onDelete={handleDelete}
									deleteMode={deleteMode}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent
						value="past"
						className="mt-0"
					>
						<Card className="bg-gray-900/60 border-gray-700">
							<CardHeader className="pb-3">
								<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
									<CardTitle className="text-xl text-white">
										Past Events
									</CardTitle>
									<SearchBar onSearch={setSearchTerm} />
								</div>
							</CardHeader>
							<CardContent>
								<EventList
									events={filteredEvents?.filter(
										(event) => !event.isLive,
									)}
									onDelete={handleDelete}
									deleteMode={deleteMode}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</motion.div>

			{deleteMode && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center"
				>
					<Trash2 className="mr-2 h-5 w-5" />
					<span>
						Delete mode is active. Click on an event to delete it.
					</span>
				</motion.div>
			)}
		</motion.div>
	);
};

export default AdminDashboard;
