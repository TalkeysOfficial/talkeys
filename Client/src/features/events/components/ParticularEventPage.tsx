// components/event/ParticularEventPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventJsonLd from "@/features/events/components/EventJsonLd";
import EventHeader from "./EventHeader";
import EventDescription from "./EventDescription";
import QRCodeDisplay from "@/features/tickets/components/QRCodeDisplay";
import { useAuth } from "@/features/auth/authContext";
import { usePassManagement } from "@/features/tickets/hooks/usePassManagement";
import { useEventLike } from "@/features/events/hooks/useEventLike";
import { bookTicket } from "@/features/booking/api";
import {
	createAttendee,
	PassTypesPanel,
	RegistrationPage,
	type AttendeeForm,
} from "@/features/booking/components/BookingForm";
import {
	clearStoredAuth,
	getStoredAccessToken,
	isAuthFailure,
} from "@/features/auth/authToken";
import { getEventPassTypes } from "@/features/events/eventUtils";
import { formatTime } from "@/features/events/components/EventCarousel";
import type { EventPageProps } from "@/types/types";


export default function ParticularEventPage({
	event,
	onClose,
}: Readonly<EventPageProps>) {
	const { isSignedIn, setIsSignedIn } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const fromHome = searchParams.get("from") === "home";
	const passTypes = useMemo(() => getEventPassTypes(event), [event]);
	const firstPassTypeId = passTypes[0]?.id || "general";
	const [selectedPassTypeId, setSelectedPassTypeId] = useState(firstPassTypeId);
	const [isRegistrationPageOpen, setIsRegistrationPageOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [teamCode, setTeamCode] = useState("");
	const [attendees, setAttendees] = useState<AttendeeForm[]>([
		createAttendee(0, firstPassTypeId),
	]);

	const { codes: passQRCodes, refresh: refreshPasses } = usePassManagement(event._id);
	const { isLike, likes, toggle } = useEventLike(
		event._id,
		event.isLiked,
		event.likes ?? 0,
	);

	useEffect(() => {
		setSelectedPassTypeId(firstPassTypeId);
		setAttendees((current) =>
			current.length
				? current.map((attendee) => ({
						...attendee,
						passTypeId: attendee.passTypeId || firstPassTypeId,
				  }))
				: [createAttendee(0, firstPassTypeId)],
		);
	}, [firstPassTypeId]);

	const handleClose = () => {
		if (onClose) {
			onClose();
			return;
		}
		if (fromHome) router.push("/");
		else router.back();
	};

	const isRegistrationDisabled =
		event.status === "registration_closed" ||
		event.status === "coming_soon" ||
		event.status === "ended" ||
		!event.isLive;

	const registrationButtonText =
		event.status === "registration_closed"
			? "Closed"
			: event.status === "coming_soon"
			? "Coming Soon"
			: event.status === "ended"
			? "Ended"
			: "Register";

	const requireValidSession = () => {
		if (isSignedIn && getStoredAccessToken()) {
			return true;
		}

		clearStoredAuth();
		setIsSignedIn(false);
		toast.error("Please log in first to register.");
		router.push("/sign");
		return false;
	};

	const openRegistrationPage = (passTypeId: string) => {
		if (!requireValidSession()) return;

		setSelectedPassTypeId(passTypeId);
		setAttendees((current) =>
			(current.length ? current : [createAttendee(0, passTypeId)]).map(
				(attendee) => ({
					...attendee,
					passTypeId,
				}),
			),
		);
		setIsRegistrationPageOpen(true);
	};

	const handleRegistrationAuthFailure = () => {
		clearStoredAuth();
		setIsSignedIn(false);
		setIsRegistrationPageOpen(false);
		toast.error("Your session expired. Please log in again to register.");
		router.push("/sign");
	};

	const validateRegistration = () => {
		if (attendees.length < 1) {
			toast.error("Add at least 1 person to register.");
			return false;
		}

		if (event.isTeamEvent && !teamCode.trim()) {
			toast.error("Team code is required for this event.");
			return false;
		}

		for (let index = 0; index < attendees.length; index += 1) {
			const attendee = attendees[index];
			if (!attendee.name.trim()) {
				toast.error(`Name is required for person ${index + 1}.`);
				return false;
			}
			if (attendee.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(attendee.email)) {
				toast.error(`Enter a valid email for person ${index + 1}.`);
				return false;
			}
			if (attendee.phone && !/^[+]?[\d\s().-]{8,20}$/.test(attendee.phone)) {
				toast.error(`Enter a valid phone number for person ${index + 1}.`);
				return false;
			}
		}

		const selectedCounts = attendees.reduce<Record<string, number>>((acc, attendee) => {
			acc[attendee.passTypeId] = (acc[attendee.passTypeId] || 0) + 1;
			return acc;
		}, {});

		for (const passType of passTypes) {
			const requestedCount = selectedCounts[passType.id] || 0;
			if (
				typeof passType.availableQuantity === "number" &&
				requestedCount > passType.availableQuantity
			) {
				toast.error(`${passType.name} does not have enough availability.`);
				return false;
			}
		}

		return true;
	};

	const handleSubmitRegistration = async () => {
		if (!validateRegistration()) return;

		setIsSubmitting(true);
		try {
			const response = await bookTicket({
				eventId: event._id,
				passTypeId: selectedPassTypeId,
				teamCode: event.isTeamEvent ? teamCode.trim() : undefined,
				attendees: attendees.map((attendee) => {
					const passType = passTypes.find((item) => item.id === attendee.passTypeId);

					return {
						name: attendee.name.trim(),
						email: attendee.email.trim() || undefined,
						phone: attendee.phone.trim() || undefined,
						passTypeId: attendee.passTypeId,
						passTypeName: passType?.name,
					};
				}),
				friends: attendees.slice(1).map((attendee) => ({
					name: attendee.name.trim(),
					email: attendee.email.trim() || undefined,
					phone: attendee.phone.trim() || undefined,
				})),
			});

			if (response.data.paymentRequired === false || !response.data.paymentUrl) {
				await refreshPasses();
				setIsRegistrationPageOpen(false);
				toast.success("Registration completed.");
				return;
			}

			window.location.href = response.data.paymentUrl;
		} catch (error: any) {
			if (isAuthFailure(error)) {
				handleRegistrationAuthFailure();
				return;
			}
			toast.error(error?.error || error?.message || "Failed to register.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const [hovered, setHovered] = useState<string | null>(null);
	const tabs: Array<[string, string]> = [
		["details", "DETAILS"],
		...(event.prizes ? ([["prizes", "PRIZES"]] as Array<[string, string]>) : []),
		["community", "JOIN DISCUSSION COMMUNITY"],
	];

	if (isRegistrationPageOpen) {
		return (
			<>
				<EventJsonLd event={event} />
				<RegistrationPage
					eventName={event.name}
					onBack={() => setIsRegistrationPageOpen(false)}
					eventIsPaid={event.isPaid}
					eventIsTeamEvent={event.isTeamEvent}
					passTypes={passTypes}
					selectedPassTypeId={selectedPassTypeId}
					teamCode={teamCode}
					setTeamCode={setTeamCode}
					attendees={attendees}
					setAttendees={setAttendees}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmitRegistration}
				/>
			</>
		);
	}

	return (
		<>
			<EventJsonLd event={event} />
			<div className="fixed inset-0 z-[9999] min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#181818] pt-24 text-white">
				<Navbar />

				<main className="w-full max-w-full overflow-x-hidden px-4 pb-10 sm:px-6 lg:px-8 2xl:px-10">
					<div className="mb-3 text-sm font-semibold text-gray-500">
						Particular Event Info
					</div>

					<div className="min-h-[calc(100vh-190px)] w-full max-w-full overflow-hidden border border-white/5 bg-[#050506] shadow-2xl shadow-black/60 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
						<div className="min-w-0 max-w-full">
							<EventHeader
								event={event}
								formatTime={formatTime}
								isLike={isLike}
								likes={likes}
								toggleLike={toggle}
								onClose={handleClose}
							/>

							<div className="mx-5 mt-5 w-[calc(100%-40px)] overflow-x-auto rounded-full bg-[#111114] px-3 py-2 no-scrollbar">
								<div className="inline-flex min-w-max items-center gap-2">
									{tabs.map(([key, label]) => (
										<button
											key={key}
											onMouseEnter={() => setHovered(key)}
											onMouseLeave={() => setHovered(null)}
											className={`rounded-full px-4 py-1.5 text-xs font-medium text-white transition-colors ${
												hovered === key ? "bg-purple-600/40" : "bg-transparent"
											}`}
										>
											{label}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-4 px-5 pb-6 pt-5">
								<section
									className={`border-l-4 border-purple-500 bg-white/[0.06] p-4 transition-colors ${
										hovered === "details" ? "bg-purple-500/15" : ""
									}`}
								>
									<h2 className="text-lg font-semibold text-white">
										Details for the Event
									</h2>
									<EventDescription
										text={event.eventDescription}
										fallback="Event details will be updated soon."
										className="mt-3 text-sm leading-6 text-gray-300"
									/>
								</section>

								{event.prizes ? (
									<section
										className={`border-l-4 border-purple-500 bg-white/[0.06] p-4 transition-colors ${
											hovered === "prizes" ? "bg-purple-500/15" : ""
										}`}
									>
										<h2 className="text-lg font-semibold text-white">Prizes</h2>
										<p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-300">
											{event.prizes}
										</p>
									</section>
								) : null}

								<section
									className={`border-l-4 border-purple-500 bg-white/[0.06] p-4 transition-colors ${
										hovered === "community" ? "bg-purple-500/15" : ""
									}`}
								>
									<h2 className="text-lg font-semibold text-white">
										Join Discussion Community
									</h2>
									<p className="mt-3 text-sm leading-6 text-gray-300">
										Join the event community to stay updated and connect with other
										attendees.
									</p>
								</section>
							</div>
						</div>

						<PassTypesPanel
							passTypes={passTypes}
							selectedPassTypeId={selectedPassTypeId}
							isPaid={event.isPaid}
							isDisabled={isRegistrationDisabled}
							buttonText={registrationButtonText}
							onSelect={setSelectedPassTypeId}
							onRegister={openRegistrationPage}
						/>
					</div>

					{isRegistrationDisabled ? (
						<div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 text-amber-100">
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
							<span className="text-sm">
								Registration is currently unavailable for this event.
							</span>
						</div>
					) : null}

					{passQRCodes.length ? (
						<div className="mx-auto mt-8 w-full max-w-3xl">
							<QRCodeDisplay name={event.name} codes={passQRCodes} />
						</div>
					) : null}
				</main>

				<Footer showWave={false} />
			</div>
		</>
	);
}
