"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	MapPin,
	Calendar,
	User,
	Heart,
	Send,
	Check,
	X,
	Copy,
	Clock,
	ArrowLeft,
	Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholderImage from "@/public/images/events.jpg";
import type { Event, RegistrationState } from "@/types/types";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ParticularEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [registrationState, setRegistrationState] =
		useState<RegistrationState>("initial");
	const [teamCode, setTeamCode] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [teamName, setTeamName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [pass, setPass] = useState<string | null>(null);
	const [isLike, setIsLike] = useState<boolean | null>(false);

	useEffect(() => {
		async function fetchEventDetails() {
			try {
				setLoading(true);
				const response = await fetch(
					`${process.env.BACKEND_URL}/getEventById/${eventId}`,
				);

				if (!response.ok) {
					throw new Error("Failed to fetch event");
				}

				const data = await response.json();
				setEvent(data.data);
				setIsLike(false);
				setLoading(false);
			} catch (error: any) {
				console.error("Failed to fetch event details", error);
				setError(error.message);
				setLoading(false);
			}
		}

		if (eventId) {
			fetchEventDetails();
		}
	}, [eventId]);

	useEffect(() => {
		async function getTeamAndPass() {
			if (!event) return;

			try {
				const response = await fetch(`${process.env.BACKEND_URL}/getTeam`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					},
					body: JSON.stringify({ eventId: event._id }),
				});
				const data = await response.json();
				if (response.ok) {
					setTeamName(data.teamName);
					setTeamCode(data.teamCode);
					const passResponse = await fetch(
						`${process.env.BACKEND_URL}/getPass`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${localStorage.getItem(
									"accessToken",
								)}`,
							},
							body: JSON.stringify({
								eventId: event._id,
								userId: data._id,
							}),
						},
					);
					const passData = await passResponse.json();
					if (passResponse.ok) {
						setPass(passData._id);
						setRegistrationState("passCreated");
					} else {
						setRegistrationState("teamJoined");
					}
				} else {
					setRegistrationState("initial");
				}
			} catch (error) {
				console.error("Failed to get team or pass", error);
				setRegistrationState("initial");
			}
		}

		if (event) {
			getTeamAndPass();
		}
	}, [event]);

	const handleRegisterClick = () => {
		if (!event) return;

		if (event.registrationLink) {
			window.open(event.registrationLink, "_blank");
			return;
		}
		if (event.isLive) {
			setRegistrationState("teamOptions");
		}
	};

	const handleJoinTeam = () => {
		setRegistrationState("joinTeamPhone");
	};

	const handleCreateTeam = () => {
		setRegistrationState("createTeamPhone");
	};

	const handleTeamCodeSubmit = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/joinTeam`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ teamCode, phoneNumber }),
			});
			const data = await response.json();
			if (response.ok) {
				setTeamName(data.teamName);
				setRegistrationState("teamJoined");
			} else {
				throw new Error(response.status.toString());
			}
		} catch (error) {
			console.error("Failed to join team", error);
			if (error instanceof Error) {
				if (error.message === "400") {
					setErrorMessage("Team full or invalid phone number");
				} else if (error.message === "404") {
					setErrorMessage("Team or user not found");
				} else {
					setErrorMessage("Server error");
				}
			}
			setRegistrationState("error");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateTeamSubmit = async () => {
		if (!event) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/createTeam`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					newPhoneNumber: phoneNumber,
					teamName,
					eventId: event._id,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				setTeamCode(data.team.teamCode);
				setTeamName(data.team.teamName);
				setRegistrationState("createTeamCode");
			} else {
				throw new Error(response.status.toString());
			}
		} catch (error) {
			console.error("Failed to create team", error);
			if (error instanceof Error) {
				if (error.message === "400") {
					setErrorMessage("Invalid phone number");
				} else if (error.message === "401") {
					setErrorMessage("Login Before Creating Team");
				} else if (error.message === "404") {
					setErrorMessage("User not found");
				} else {
					setErrorMessage("Server error");
				}
			}
			setRegistrationState("error");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePhoneSubmit = () => {
		if (registrationState === "joinTeamPhone") {
			setRegistrationState("joinTeamCode");
		} else if (registrationState === "createTeamPhone") {
			setRegistrationState("createTeamName");
		}
	};

	const handleCreatePass = async () => {
		if (!event) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/bookPass`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					teamCode: teamCode,
					eventId: event._id,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				setPass(data._id);
				setRegistrationState("passCreated");
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			console.error("Failed to book pass", error);
			setErrorMessage(
				error instanceof Error ? error.message : "Failed to book pass",
			);
			setRegistrationState("error");
		} finally {
			setIsLoading(false);
		}
	};

	async function handleLikeUnlikeEvent(eventId: string) {
		await fetch(
			`${process.env.BACKEND_URL}/${
				isLike ? "unlikeEvent" : "likeEvent"
			}/${eventId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			},
		);
	}

	function isTimePassed(dateString: string) {
		const time = new Date(dateString).getTime();
		const currentTime = new Date().getTime();
		return time <= currentTime;
	}

	async function sendBookingID() {
		if (!event) return;

		try {
			window.open(event.registrationLink, "_blank");
		} catch (error) {
			console.error("Failed to send booking ID", error);
		}
	}

	const renderRegistrationButton = () => {
		if (!event) return null;

		switch (registrationState) {
			case "initial": {
				const isEventLive = event.isLive;
				const hasEventYetToCome = !isTimePassed(event.startDate);
				const isRegistrationClosed = isTimePassed(
					event.endRegistrationDate,
				);
				const isEventPaid = event.isPaid;

				let buttonText;
				let ariaLabel;

				if (isRegistrationClosed) {
					buttonText = "Registrations Closed";
					ariaLabel = "Registrations closed";
				} else if (!isEventLive || hasEventYetToCome) {
					buttonText = "Coming Soon";
					ariaLabel = "Event coming soon";
				} else if (isEventPaid) {
					buttonText = "Pay NOW";
					ariaLabel = "Pay for tickets for event";
				} else {
					buttonText = "Register Now";
					ariaLabel = "Register for event";
				}

				if (event.isPaid) {
					return (
						<motion.div
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full"
								onClick={sendBookingID}
								disabled={
									!isEventLive ||
									isRegistrationClosed ||
									hasEventYetToCome
								}
								aria-label={ariaLabel}
							>
								{buttonText}
							</Button>
						</motion.div>
					);
				}

        return (
          <Button
            className="bg-purple-600 hover:bg-purple-700 w-full"
            onClick= {() => router.push("/register")}
            disabled={!isEventLive || isRegistrationClosed}
            aria-label={ariaLabel}
          >
            {buttonText}
          </Button>
        );
      }

			case "teamOptions":
				return (
					<div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm mx-auto">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="w-full"
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full"
								onClick={handleJoinTeam}
							>
								Join Team
							</Button>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="w-full"
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full"
								onClick={handleCreateTeam}
							>
								Create Team
							</Button>
						</motion.div>
					</div>
				);
			case "joinTeamPhone":
			case "createTeamPhone":
				return (
					<div className="space-y-2 w-full max-w-sm mx-auto">
						<Input
							type="tel"
							placeholder="Enter your phone number"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							className="bg-gray-800 text-white w-full text-base px-4 py-2 border-purple-500/50 focus:border-purple-500"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-green-600 hover:bg-green-700 w-full"
									onClick={handlePhoneSubmit}
									disabled={!phoneNumber}
								>
									<Check className="w-4 h-4 mr-2" />
									Continue
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-red-600 hover:bg-red-700 w-full"
									onClick={() => setRegistrationState("initial")}
								>
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							</motion.div>
						</div>
					</div>
				);
			case "createTeamName":
				return (
					<div className="space-y-2 w-full max-w-sm mx-auto">
						<Input
							type="text"
							placeholder="Enter team name"
							value={teamName}
							onChange={(e) => setTeamName(e.target.value)}
							className="bg-gray-800 text-white w-full text-base px-4 py-2 border-purple-500/50 focus:border-purple-500"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-green-600 hover:bg-green-700 w-full"
									onClick={handleCreateTeamSubmit}
									disabled={isLoading || !teamName}
								>
									{isLoading ? (
										<div className="flex items-center justify-center gap-2 w-full">
											<Loader2 className="w-4 h-4 animate-spin" />
											<span className="text-sm">Creating...</span>
										</div>
									) : (
										<>
											<Check className="w-4 h-4 mr-2" />
											Create Team
										</>
									)}
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-red-600 hover:bg-red-700 w-full"
									onClick={() => setRegistrationState("initial")}
									disabled={isLoading}
								>
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							</motion.div>
						</div>
					</div>
				);
			case "joinTeamCode":
				return (
					<div className="space-y-2 w-full max-w-sm mx-auto">
						<Input
							type="text"
							placeholder="Enter team code"
							value={teamCode}
							onChange={(e) => setTeamCode(e.target.value)}
							className="bg-gray-800 text-white w-full text-base px-4 py-2 border-purple-500/50 focus:border-purple-500"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-green-600 hover:bg-green-700 w-full"
									onClick={handleTeamCodeSubmit}
									disabled={isLoading || !teamCode}
								>
									{isLoading ? (
										<div className="flex items-center justify-center gap-2 w-full">
											<Loader2 className="w-4 h-4 animate-spin" />
											<span className="text-sm">Joining...</span>
										</div>
									) : (
										<>
											<Check className="w-4 h-4 mr-2" />
											Join Team
										</>
									)}
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full"
							>
								<Button
									className="bg-red-600 hover:bg-red-700 w-full"
									onClick={() => setRegistrationState("initial")}
									disabled={isLoading}
								>
									<X className="w-4 h-4 mr-2" />
									Cancel
								</Button>
							</motion.div>
						</div>
					</div>
				);
			case "createTeamCode":
				return (
					<div className="space-y-2 w-full max-w-sm mx-auto">
						<div className="flex w-full">
							<Input
								type="text"
								value={teamCode}
								readOnly
								className="bg-gray-800 text-white flex-1 text-base px-4 py-2 border-purple-500/50"
							/>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<Button
									className="ml-2 bg-purple-600"
									onClick={() =>
										navigator.clipboard.writeText(teamCode)
									}
								>
									<Copy className="w-4 h-4" />
								</Button>
							</motion.div>
						</div>
						<div className="text-green-500">Team Created: {teamName}</div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								className="bg-green-600 hover:bg-green-700 w-full"
								onClick={handleCreatePass}
							>
								Create Pass
							</Button>
						</motion.div>
					</div>
				);
			case "teamJoined":
				return (
					<div className="w-full max-w-sm mx-auto">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full"
								onClick={sendBookingID}
							>
								Pay Now
							</Button>
						</motion.div>
					</div>
				);
			case "error":
				return (
					<div className="w-full max-w-sm mx-auto space-y-2">
						<div className="text-red-500">{errorMessage}</div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full"
								onClick={() => setRegistrationState("initial")}
							>
								Try Again
							</Button>
						</motion.div>
					</div>
				);
			case "booked":
				return (
					<div className="w-full max-w-sm mx-auto space-y-2">
						<div className="text-green-500">{errorMessage}</div>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							disabled={true}
						>
							Tickets Booked
						</Button>
					</div>
				);
			case "passCreated":
				return (
					<div className="space-y-2 w-full max-w-sm mx-auto">
						<div className="text-green-500">
							Pass Created: Reload to Get Pass
						</div>
						{pass && (
							<motion.div
								className="flex justify-center"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
							>
								<QRCode value={pass} />
							</motion.div>
						)}
					</div>
				);
		}
	};

	function formatTime(timeString: string): string {
		if (!timeString || !timeString.includes(":")) return timeString;

		const [hours, minutes] = timeString.split(":").map(Number);
		const period = hours >= 12 ? "PM" : "AM";
		const hours12 = hours % 12 || 12;
		return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
	}

	if (loading) {
		return (
			<div className="min-h-screen pt-24 flex items-center justify-center bg-black/80 text-white">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-12 w-12 animate-spin text-purple-500" />
					<p className="text-lg">Loading event details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-black/80 text-white p-4">
				<div className="bg-gray-900/80 rounded-lg p-8 max-w-md w-full text-center">
					<div className="text-red-500 text-xl mb-6">Error: {error}</div>
					<Button
						className="bg-purple-600 hover:bg-purple-700"
						onClick={() => window.location.reload()}
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="min-h-screen pt-24 flex items-center justify-center bg-black/80 text-white">
				<div className="bg-gray-900/80 rounded-lg p-8 max-w-md w-full text-center">
					<div className="text-red-500 text-xl">Event not found</div>
					<Link
						href="/eventPage"
						className="mt-6 inline-block"
					>
						<Button className="bg-purple-600 hover:bg-purple-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Events
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black/80 text-white"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="max-w-6xl mx-auto">
				{/* Back button */}
				<div className="mb-6">
					<Link href="/eventPage">
						<Button
							variant="ghost"
							className="text-white hover:bg-gray-800"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Events
						</Button>
					</Link>
				</div>

				{/* Main content */}
				<div className="bg-gray-900/60 rounded-xl overflow-hidden shadow-xl">
					{/* Header Section */}
					<div className="p-6 md:p-8">
						<div className="flex flex-col lg:flex-row gap-8">
							{/* Left Column - Event Image */}
							<div className="w-full lg:w-1/2">
								<div className="relative aspect-video rounded-lg overflow-hidden">
									<Image
										src={event.photographs?.[0] ?? placeholderImage}
										alt={`${event.name}-banner`}
										className="object-cover"
										fill
										priority
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
								</div>
							</div>

							{/* Right Column - Event Details */}
							<div className="w-full lg:w-1/2 space-y-6">
								<div>
									<h1 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
										{event.name}
									</h1>
									<div className="space-y-3 text-gray-300">
										<div className="flex items-center gap-3">
											<MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
											<span>{event.location ?? "Online Event"}</span>
										</div>
										<div className="flex items-center gap-3">
											<Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
											<span>
												{new Date(
													event.startDate,
												).toLocaleDateString("en-IN", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
											<span>{formatTime(event.startTime)}</span>
										</div>
										<div className="flex items-center gap-3">
											<User className="w-5 h-5 text-purple-400 flex-shrink-0" />
											<span>
												{event.mode === "offline"
													? "In-person Event"
													: "Online Event"}
											</span>
										</div>
									</div>
								</div>

								{/* Cost Section */}
								<div className="bg-gray-800/60 rounded-lg p-4 space-y-4">
									<div className="flex justify-between items-center">
										<div className="text-lg">
											<span className="text-gray-300">Price:</span>{" "}
											<span className="font-bold text-purple-300">
												{event.ticketPrice && event.ticketPrice > 0
													? `₹${event.ticketPrice}`
													: "Free"}
											</span>
										</div>
										<div className="flex gap-3">
											<motion.button
												aria-label={
													isLike ? "Unlike event" : "Like event"
												}
												className="hover:text-purple-400 transition-colors bg-gray-700 p-2 rounded-full"
												onClick={() => {
													handleLikeUnlikeEvent(event._id);
													setIsLike(!isLike);
												}}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
											>
												<Heart
													className="w-5 h-5"
													fill={isLike ? "#ef4444" : "none"}
													color={
														isLike ? "#ef4444" : "currentColor"
													}
												/>
											</motion.button>
											<motion.button
												aria-label="Share event"
												className="hover:text-purple-400 transition-colors bg-gray-700 p-2 rounded-full"
												onClick={() => {
													if (navigator.share) {
														navigator
															.share({
																title: event.name,
																text: event.eventDescription,
																url: `${window.location.origin}/event/${event._id}`,
															})
															.catch((err) =>
																console.error(
																	"Error sharing:",
																	err,
																),
															);
													} else {
														navigator.clipboard.writeText(
															`${window.location.origin}/event/${event._id}`,
														);
														alert("Link copied to clipboard!");
													}
												}}
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
											>
												<Send className="w-5 h-5" />
											</motion.button>
										</div>
									</div>
									{renderRegistrationButton()}
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2">
									<Badge
										variant="secondary"
										className="bg-purple-900/50 border border-purple-500/30 px-3 py-1"
									>
										{event.category}
									</Badge>
									<Badge
										variant="secondary"
										className="bg-blue-900/50 border border-blue-500/30 px-3 py-1"
									>
										{event.mode}
									</Badge>
									<Badge
										variant="secondary"
										className="bg-pink-900/50 border border-pink-500/30 px-3 py-1"
									>
										{event.visibility}
									</Badge>
								</div>
							</div>
						</div>
					</div>

					{/* Tabs Section */}
					<Tabs
						defaultValue="details"
						className="w-full"
						aria-label="Event information tabs"
					>
						<div className="px-6 md:px-8 border-t border-gray-700">
							<TabsList className="bg-gray-800/60 w-full justify-start rounded-none border-b border-gray-700 overflow-hidden">
								<TabsTrigger
									value="details"
									className="text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3"
								>
									Details
								</TabsTrigger>
								<TabsTrigger
									value="dates"
									className="text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3"
								>
									Dates & Deadlines
								</TabsTrigger>
								{event.prizes && (
									<TabsTrigger
										value="prizes"
										className="text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3"
									>
										Prizes
									</TabsTrigger>
								)}
								{event.paymentQRcode && (
									<TabsTrigger
										value="payment"
										className="text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3"
									>
										Payment QR Code
									</TabsTrigger>
								)}
							</TabsList>
						</div>

						<div className="p-6 md:p-8">
							<AnimatePresence mode="wait">
								<TabsContent
									value="details"
									className="mt-0"
								>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20"
									>
										<h3 className="text-xl font-semibold mb-4 text-purple-300">
											Event Details
										</h3>
										<div className="text-gray-300 space-y-4 whitespace-pre-line">
											{event.eventDescription
												?.split("\\n")
												.map((line, index) => (
													<p key={index}>{line}</p>
												))}
										</div>
									</motion.div>
								</TabsContent>

								<TabsContent
									value="dates"
									className="mt-0"
								>
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20"
									>
										<h3 className="text-xl font-semibold mb-4 text-purple-300">
											Dates & Deadlines
										</h3>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="bg-gray-700/40 p-4 rounded-lg">
												<p className="text-gray-300">
													<span className="font-medium text-purple-300">
														Start Date:
													</span>{" "}
													{new Date(
														event.startDate,
													).toLocaleDateString("en-IN", {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</p>
											</div>
											<div className="bg-gray-700/40 p-4 rounded-lg">
												<p className="text-gray-300">
													<span className="font-medium text-purple-300">
														Start Time:
													</span>{" "}
													{formatTime(event.startTime)}
												</p>
											</div>
											<div className="bg-gray-700/40 p-4 rounded-lg">
												<p className="text-gray-300">
													<span className="font-medium text-purple-300">
														Duration:
													</span>{" "}
													{event.duration}
												</p>
											</div>
											<div className="bg-gray-700/40 p-4 rounded-lg">
												<p className="text-gray-300">
													<span className="font-medium text-purple-300">
														Registration Deadline:
													</span>{" "}
													{new Date(
														event.endRegistrationDate,
													).toLocaleDateString("en-IN", {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</p>
											</div>
										</div>
									</motion.div>
								</TabsContent>

								{event.prizes && (
									<TabsContent
										value="prizes"
										className="mt-0"
									>
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
											className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20"
										>
											<h3 className="text-xl font-semibold mb-4 text-purple-300">
												Prizes
											</h3>
											<div className="text-gray-300 space-y-4 whitespace-pre-line">
												{event.prizes
													?.split("\\n")
													.map((line, index) => (
														<p key={index}>{line}</p>
													))}
											</div>
										</motion.div>
									</TabsContent>
								)}

								{event.paymentQRcode && (
									<TabsContent
										value="payment"
										className="mt-0"
									>
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											transition={{ duration: 0.3 }}
											className="bg-gray-800/40 p-6 rounded-lg border border-purple-500/20 flex flex-col items-center"
										>
											<h3 className="text-xl font-semibold mb-6 text-purple-300">
												Payment QR Code
											</h3>
											<div className="bg-white p-4 rounded-lg">
												<Image
													src={
														event.paymentQRcode ||
														"/placeholder.svg"
													}
													alt="Payment QR Code"
													height={300}
													width={300}
													className="mx-auto"
												/>
											</div>
											<p className="mt-4 text-gray-300 text-center">
												Scan this QR code to make your payment
											</p>
										</motion.div>
									</TabsContent>
								)}
							</AnimatePresence>
						</div>
					</Tabs>
				</div>
			</div>
		</motion.div>
	);
}
