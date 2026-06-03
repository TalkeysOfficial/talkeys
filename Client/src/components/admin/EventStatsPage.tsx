"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	ArrowLeft,
	CalendarDays,
	CheckCircle2,
	Clock3,
	Download,
	Pencil,
	IndianRupee,
	Search,
	TicketCheck,
	Users,
} from "lucide-react";
import StatsCard from "@/components/ui/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getSafeImageSrc } from "@/lib/utils";

interface AdminEventStatsResponse {
	data: AdminEventStats;
	message: string;
}

interface AdminEventStats {
	event: {
		id: string;
		name: string;
		category: string;
		mode: "offline" | "online";
		location: string;
		startDate: string;
		startTime: string;
		totalSeats: number;
		registrationCount: number;
		photograph: string;
		isPaid: boolean;
	ticketPrice: number;
	passTypes?: Array<{
		name: string;
		price: number;
		totalQuantity?: number;
		soldQuantity?: number;
		isActive?: boolean;
	}>;
	isLive: boolean;
	};
	stats: {
		totalOrders: number;
		totalTickets: number;
		checkedInCount: number;
		amountCollected: number;
		seatsRemaining: number;
	};
	bookings: AdminBooking[];
}

interface AdminBooking {
	id: string;
	passUUID: string | null;
	bookedAt: string;
	confirmedAt: string | null;
	buyer: {
		id: string | null;
		name: string;
		email: string;
		phoneNumber: string;
		image: string;
	};
	amount: number;
	ticketCount: number;
	passType: string;
	passTypeName?: string;
	passSelections?: Array<{
		passTypeName: string;
		passPrice: number;
		quantity: number;
	}>;
	passStatus: string;
	status: string;
	paymentStatus: string;
	merchantOrderId: string;
	phonePeOrderId: string;
	friends: Array<{
		name: string;
		email?: string;
		phone?: string;
	}>;
	attendees: AdminAttendee[];
	checkedInCount: number;
}

interface AdminAttendee {
	id: string;
	name: string;
	type: "user" | "friend";
	passTypeName?: string;
	passPrice?: number;
	checkedIn: boolean;
	checkedInAt: string | null;
}

const formatDateTime = (value?: string | null) => {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";

	return new Intl.DateTimeFormat("en-IN", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
};

const formatDate = (value?: string | null) => {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "-";

	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
};

const formatAmount = (amount: number) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount || 0);

const statusClassName = (status: string) =>
	cn(
		"inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize",
		status === "completed" || status === "active"
			? "bg-emerald-500/15 text-emerald-300"
			: "bg-amber-500/15 text-amber-300",
	);

const csvCell = (value: unknown) => {
	const rawText = value === null || value === undefined ? "" : String(value);
	const text = /^[=+\-@]/.test(rawText) ? `'${rawText}` : rawText;
	return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (filename: string, rows: Array<Array<unknown>>) => {
	const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

export default function EventStatsPage({ eventId }: { eventId: string }) {
	const [stats, setStats] = useState<AdminEventStats | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/admin/events/${eventId}/stats`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Could not load event stats");
				}

				const payload = (await response.json()) as AdminEventStatsResponse;
				setStats(payload.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Something went wrong");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [eventId]);

	const filteredBookings = useMemo(() => {
		if (!stats) return [];

		const query = searchTerm.trim().toLowerCase();
		if (!query) return stats.bookings;

		return stats.bookings.filter((booking) => {
			const haystack = [
				booking.buyer.name,
				booking.buyer.email,
				booking.buyer.phoneNumber,
				booking.passUUID,
				booking.merchantOrderId,
				...booking.attendees.map((attendee) => attendee.name),
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return haystack.includes(query);
		});
	}, [searchTerm, stats]);

	const handleExportBookings = () => {
		if (!stats?.bookings.length) return;

		const rows = [
			[
				"Event",
				"Booking ID",
				"Pass UUID",
				"Buyer Name",
				"Buyer Email",
				"Buyer Phone",
				"Booked At",
				"Confirmed At",
				"Ticket Count",
				"Amount",
				"Pass Type",
				"Pass Status",
				"Status",
				"Payment Status",
				"Merchant Order ID",
				"PhonePe Order ID",
				"Checked In Count",
				"Friends",
				"Attendees",
			],
			...stats.bookings.map((booking) => [
				stats.event.name,
				booking.id,
				booking.passUUID || "",
				booking.buyer.name,
				booking.buyer.email,
				booking.buyer.phoneNumber,
				booking.bookedAt,
				booking.confirmedAt || "",
				booking.ticketCount,
				booking.amount,
				booking.passTypeName || booking.passType,
				booking.passStatus,
				booking.status,
				booking.paymentStatus,
				booking.merchantOrderId,
				booking.phonePeOrderId,
				booking.checkedInCount,
				booking.friends
					.map((friend) =>
						[friend.name, friend.email, friend.phone].filter(Boolean).join(" / "),
					)
					.join("; "),
				booking.attendees
					.map(
						(attendee) =>
							`${attendee.name} - ${attendee.passTypeName || booking.passType} (${attendee.type}, ${
								attendee.checkedIn ? "checked in" : "not checked in"
							})`,
					)
					.join("; "),
			]),
		];

		const safeName = stats.event.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
		downloadCsv(`${safeName || "event"}-bookings.csv`, rows);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-950 px-4 py-8 text-white">
				<div className="mx-auto flex max-w-7xl items-center justify-center py-24">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
				</div>
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div className="min-h-screen bg-gray-950 px-4 py-8 text-white">
				<div className="mx-auto max-w-7xl">
					<Link
						href="/admin"
						className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to dashboard
					</Link>
					<div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-red-200">
						{error || "Event stats were not available."}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-950 px-4 py-8 text-white">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-4">
						<Link
							href="/admin"
							className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to dashboard
						</Link>
						<div>
							<div className="mb-3 flex flex-wrap items-center gap-2">
								<span className="rounded-md bg-purple-500/15 px-2 py-1 text-xs font-medium text-purple-200">
									{stats.event.category}
								</span>
								<span
									className={cn(
										"rounded-md px-2 py-1 text-xs font-medium",
										stats.event.isLive
											? "bg-emerald-500/15 text-emerald-300"
											: "bg-red-500/15 text-red-300",
									)}
								>
									{stats.event.isLive ? "Live" : "Ended"}
								</span>
							</div>
							<h1 className="text-3xl font-semibold tracking-normal text-white md:text-4xl">
								{stats.event.name}
							</h1>
							<div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-300">
								<span className="inline-flex items-center gap-2">
									<CalendarDays className="h-4 w-4 text-purple-300" />
									{formatDate(stats.event.startDate)}
								</span>
								<span className="inline-flex items-center gap-2">
									<Clock3 className="h-4 w-4 text-purple-300" />
									{stats.event.startTime}
								</span>
								<span>{stats.event.location || "Online Event"}</span>
							</div>
						</div>
					</div>

					{getSafeImageSrc(stats.event.photograph, "") ? (
						<div className="space-y-3">
							<Image
								src={getSafeImageSrc(stats.event.photograph)}
								alt={stats.event.name}
								width={320}
								height={160}
								className="h-32 w-full rounded-lg object-cover lg:w-64"
							/>
							<Button
								asChild
								className="w-full bg-purple-700 text-white hover:bg-purple-600"
							>
								<Link href={`/admin/events/${stats.event.id}/edit`}>
									<Pencil className="h-4 w-4" />
									Edit Event
								</Link>
							</Button>
						</div>
					) : (
						<Button
							asChild
							className="bg-purple-700 text-white hover:bg-purple-600"
						>
							<Link href={`/admin/events/${stats.event.id}/edit`}>
								<Pencil className="h-4 w-4" />
								Edit Event
							</Link>
						</Button>
					)}
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<StatsCard
						title="Bookings"
						value={stats.stats.totalOrders}
						description={`${stats.stats.totalTickets} passes issued`}
						icon={<Users className="h-6 w-6" />}
						className="border-purple-500/30 bg-gray-900"
						iconClassName="text-purple-300"
					/>
					<StatsCard
						title="Amount Collected"
						value={formatAmount(stats.stats.amountCollected)}
						description={stats.event.isPaid ? "Completed payments" : "Free event"}
						icon={<IndianRupee className="h-6 w-6" />}
						className="border-emerald-500/30 bg-gray-900"
						iconClassName="text-emerald-300"
						index={1}
					/>
					<StatsCard
						title="Checked In"
						value={stats.stats.checkedInCount}
						description={`${stats.stats.totalTickets} total attendees`}
						icon={<CheckCircle2 className="h-6 w-6" />}
						className="border-blue-500/30 bg-gray-900"
						iconClassName="text-blue-300"
						index={2}
					/>
					<StatsCard
						title="Seats Left"
						value={stats.stats.seatsRemaining}
						description={`${stats.event.totalSeats} total seats`}
						icon={<TicketCheck className="h-6 w-6" />}
						className="border-amber-500/30 bg-gray-900"
						iconClassName="text-amber-300"
						index={3}
					/>
				</div>

				<section className="rounded-lg border border-gray-800 bg-gray-900/70">
					<div className="flex flex-col gap-4 border-b border-gray-800 p-5 md:flex-row md:items-center md:justify-between">
						<div>
							<h2 className="text-xl font-semibold text-white">Bookings</h2>
							<p className="mt-1 text-sm text-gray-400">
								{filteredBookings.length} of {stats.bookings.length} shown
							</p>
						</div>
						<div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
							<Button
								type="button"
								disabled={!stats.bookings.length}
								onClick={handleExportBookings}
								className="bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-50"
							>
								<Download className="h-4 w-4" />
								Export Data
							</Button>
							<div className="relative w-full md:w-80">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									placeholder="Search bookings"
									className="border-gray-700 bg-gray-950 pl-9 text-white placeholder:text-gray-500"
								/>
							</div>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full min-w-[980px] text-left text-sm">
							<thead className="bg-gray-950/80 text-xs uppercase text-gray-400">
								<tr>
									<th className="px-5 py-3 font-medium">Booked By</th>
									<th className="px-5 py-3 font-medium">Booking Time</th>
									<th className="px-5 py-3 font-medium">Tickets</th>
									<th className="px-5 py-3 font-medium">Amount</th>
									<th className="px-5 py-3 font-medium">Payment</th>
									<th className="px-5 py-3 font-medium">Check-in</th>
									<th className="px-5 py-3 font-medium">Attendees</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-800">
								{filteredBookings.length ? (
									filteredBookings.map((booking) => (
										<tr
											key={booking.id}
											className="align-top text-gray-200 hover:bg-gray-800/45"
										>
											<td className="px-5 py-4">
												<div className="font-medium text-white">
													{booking.buyer.name}
												</div>
												<div className="mt-1 text-gray-400">
													{booking.buyer.email || "-"}
												</div>
												<div className="mt-1 text-gray-500">
													{booking.buyer.phoneNumber || "-"}
												</div>
											</td>
											<td className="px-5 py-4">
												<div>{formatDateTime(booking.bookedAt)}</div>
												<div className="mt-1 text-xs text-gray-500">
													Confirmed {formatDateTime(booking.confirmedAt)}
												</div>
											</td>
											<td className="px-5 py-4">
												<div className="font-medium text-white">
													{booking.ticketCount}
												</div>
												<div className="mt-1 text-xs text-gray-500">
													{booking.passTypeName || booking.passType}
												</div>
											</td>
											<td className="px-5 py-4 font-medium text-white">
												{formatAmount(booking.amount)}
											</td>
											<td className="px-5 py-4">
												<span className={statusClassName(booking.paymentStatus)}>
													{booking.paymentStatus}
												</span>
												<div className="mt-2 text-xs text-gray-500">
													{booking.merchantOrderId}
												</div>
											</td>
											<td className="px-5 py-4">
												<div className="font-medium text-white">
													{booking.checkedInCount}/{booking.ticketCount}
												</div>
												<div className="mt-1 text-xs text-gray-500">
													{booking.status}
												</div>
											</td>
											<td className="px-5 py-4">
												<div className="flex max-w-sm flex-wrap gap-2">
													{booking.attendees.map((attendee) => (
														<span
															key={attendee.id}
															className={cn(
																"rounded-md px-2 py-1 text-xs",
																attendee.checkedIn
																	? "bg-emerald-500/15 text-emerald-300"
																	: "bg-gray-800 text-gray-300",
															)}
															title={
																attendee.checkedInAt
																	? `Checked in ${formatDateTime(attendee.checkedInAt)}`
																	: "Not checked in"
															}
														>
															{attendee.name || "Attendee"} -{" "}
															{attendee.passTypeName || booking.passType}
														</span>
													))}
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={7}
											className="px-5 py-12 text-center text-gray-400"
										>
											No bookings found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	);
}
