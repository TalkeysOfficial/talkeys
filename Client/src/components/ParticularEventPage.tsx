"use client";

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
} from "lucide-react";
import Image from "next/image";
import placeholderImage from "@/public/images/events.jpg";
import type {
	BookTicketResponse,
	EventPageProps,
	RegistrationState,
	PassDetailsResponse,
} from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ParticularEventPage({
	event,
	onClose,
}: Readonly<EventPageProps>) {
	const router = useRouter();
	const [registrationState, setRegistrationState] =
		useState<RegistrationState>("initial");
	const [teamCode, setTeamCode] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [teamName, setTeamName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [passQRCodes, setPassQRCodes] = useState<string[]>([]);
	const [currentQRIndex, setCurrentQRIndex] = useState(0);
	const [isLike, setIsLike] = useState<boolean | null>(event.isLiked);

	// Touch event handling for swipe gestures
	const touchStartRef = useRef(0);
	const touchEndRef = useRef(0);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartRef.current = e.targetTouches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		touchEndRef.current = e.targetTouches[0].clientX;
	};

	const handleTouchEnd = () => {
		if (
			touchStartRef.current - touchEndRef.current > 100 &&
			currentQRIndex < passQRCodes.length - 1
		) {
			// Swipe left, show next QR code
			setCurrentQRIndex(currentQRIndex + 1);
		}

		if (
			touchStartRef.current - touchEndRef.current < -100 &&
			currentQRIndex > 0
		) {
			// Swipe right, show previous QR code
			setCurrentQRIndex(currentQRIndex - 1);
		}
	};

	useEffect(() => {
		async function getPassData() {
			try {
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
						}),
					},
				);
				const passData = (await passResponse.json()) as PassDetailsResponse;
				if (
					passResponse.ok &&
					passData.passes &&
					passData.passes.length > 0
				) {
					// Generate QR codes from the pass data
					const qrCodes: string[] = [];

					for (const passItem of passData.passes) {
						const passUUID = passItem.passUUID;
						// Create a separate QR code for each qrString ID
						for (const qrString of passItem.qrStrings) {
							const qrCode = `${passUUID}+${qrString.id}`;
							qrCodes.push(qrCode);
						}
					}

					setPassQRCodes(qrCodes);
					setRegistrationState("passCreated");
				} else {
					setRegistrationState("initial");
				}
			} catch (error) {
				console.error("Failed to get pass data", error);
				setRegistrationState("initial");
			}
		}

		getPassData();
	}, [event._id]);

	const handleRegisterClick = () => {
		if (event.registrationLink) {
			window.open(event.registrationLink, "_blank");
			return;
		}
		router.push("/register");
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
				// Fetch the updated passes after booking
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
						}),
					},
				);
				const passData = (await passResponse.json()) as PassDetailsResponse;
				if (passData.passes && passData.passes.length > 0) {
					const qrCodes: string[] = [];
					for (const passItem of passData.passes) {
						const passUUID = passItem.passUUID;
						for (const qrString of passItem.qrStrings) {
							const qrCode = `${passUUID}+${qrString.id}`;
							qrCodes.push(qrCode);
						}
					}
					setPassQRCodes(qrCodes);
				}
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
		try {
			const res = await fetch(`${process.env.BACKEND_URL}/api/book-ticket`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({
					eventId: event._id,
					passType: "General",
				}),
			});
			const data = (await res.json()) as BookTicketResponse;
			if (res.ok) {
				console.log("Booking ID sent successfully", data);
				console.log("Payment URL", data.data.paymentUrl);
				window.open(data.data.paymentUrl, "_blank");
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			console.error("Failed to send booking ID", error);
		}
	}

	const renderRegistrationButton = () => {
		switch (registrationState) {
			case "initial": {
				const isEventLive = event.isLive;
				const hasEventYetToCome = !isTimePassed(event.startDate);
				console.log(hasEventYetToCome);
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
					buttonText = "Pay Now";
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
					<motion.div
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={handleRegisterClick}
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
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
					<div className="space-y-6 w-full max-w-sm mx-auto">
						<div className="text-green-500 text-center">
							Pass Created Successfully!
						</div>

						{/* Buy Now Button on top */}
						{event.isPaid && event.ticketPrice > 0 && (
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="mb-2"
							>
								<Button
									className="bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2"
									onClick={sendBookingID}
								>
									<span className="text-lg font-bold">Buy Now</span>
									<span className="text-sm">
										₹ {event.ticketPrice}
									</span>
								</Button>
							</motion.div>
						)}

						{/* QR Code Carousel */}
						{passQRCodes.length > 0 && (
							<div className="relative w-full mt-4">
								{/* Current QR display with indicators */}
								<div className="overflow-hidden">
									<div
										className="flex transition-all duration-300"
										style={{
											transform: `translateX(-${
												currentQRIndex * 100
											}%)`,
											width: `${passQRCodes.length * 100}%`,
										}}
										onTouchStart={handleTouchStart}
										onTouchMove={handleTouchMove}
										onTouchEnd={handleTouchEnd}
									>
										{passQRCodes.map((qrCode, index) => (
											<div
												key={`qr-${qrCode.substring(
													0,
													8,
												)}-${index}`}
												className="flex-shrink-0 w-full flex flex-col items-center"
											>
												<div className="text-sm text-gray-400 mb-2">
													Pass {index + 1} of {passQRCodes.length}
												</div>
												<motion.div
													className="bg-white p-4 rounded-lg"
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.3 }}
												>
													<QRCode
														value={qrCode}
														size={150}
														level="M"
													/>
												</motion.div>
											</div>
										))}
									</div>
								</div>

								{/* Navigation arrows for desktop */}
								{passQRCodes.length > 1 && (
									<>
										<button
											onClick={() =>
												setCurrentQRIndex(
													Math.max(0, currentQRIndex - 1),
												)
											}
											className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hidden sm:block"
											disabled={currentQRIndex === 0}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="15 18 9 12 15 6"></polyline>
											</svg>
										</button>
										<button
											onClick={() =>
												setCurrentQRIndex(
													Math.min(
														passQRCodes.length - 1,
														currentQRIndex + 1,
													),
												)
											}
											className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hidden sm:block"
											disabled={
												currentQRIndex === passQRCodes.length - 1
											}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="9 18 15 12 9 6"></polyline>
											</svg>
										</button>
									</>
								)}

								{/* Swipe indicator text for mobile */}
								{passQRCodes.length > 1 && (
									<div className="text-center text-xs text-gray-500 mt-2 sm:hidden">
										Swipe to view all passes
									</div>
								)}

								{/* Dots indicators */}
								{passQRCodes.length > 1 && (
									<div className="flex justify-center gap-2 mt-4">
										{passQRCodes.map((qrCode, index) => (
											<button
												key={`dot-${qrCode.substring(
													0,
													8,
												)}-${index}`}
												onClick={() => setCurrentQRIndex(index)}
												className={`h-2 rounded-full transition-all ${
													currentQRIndex === index
														? "w-4 bg-purple-500"
														: "w-2 bg-gray-600"
												}`}
											/>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				);
		}
	};

	function formatTime(timeString: string): string {
		const [hours, minutes] = timeString.split(":").map(Number);
		const period = hours >= 12 ? "PM" : "AM";
		const hours12 = hours % 12 || 12;
		return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
	}

	return (
		<div
			className="bg-black text-white overflow-y-auto max-h-[90vh] md:max-h-[80vh] rounded-lg shadow-xl w-full mx-auto custom-scrollbar"
			aria-modal="true"
		>
			<div className="p-3 sm:p-4 md:p-6 max-w-[800px] mx-auto relative">
				{/* Close button - repositioned for mobile */}
				<motion.button
					onClick={onClose}
					className="absolute top-3 right-3 z-50 bg-gray-800 rounded-full p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
					aria-label="Close dialog"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<X className="w-5 h-5" />
				</motion.button>

				{/* Header Section */}
				<div className="flex flex-col sm:flex-row gap-6 mb-6 mt-8 sm:mt-0">
					{/* Left Column - Event Image */}
					<div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto">
						<Image
							src={event.photographs?.[0] ?? placeholderImage}
							alt={`${event.name}-banner`}
							className="rounded-lg object-scale-down object-center"
							fill
							priority
							sizes="(max-width: 640px) 100vw, 50vw"
						/>
					</div>

					{/* Right Column - Event Details */}
					<div className="w-full sm:w-1/2 space-y-4">
						<div>
							<h1 className="text-2xl font-bold mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
								{event.name}
							</h1>
							<div className="space-y-1.5 text-gray-400 text-sm">
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4 text-purple-400" />
									<span>{event.location ?? "Online Event"}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-purple-400" />
									<span>
										{new Date(event.startDate).toLocaleDateString(
											"en-IN",
										)}
										{" at "}
										{event.startTime}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<User className="w-4 h-4 text-purple-400" />
									<span>
										{event.mode === "offline"
											? "In-person Event"
											: "Online Event"}
									</span>
								</div>
							</div>
						</div>

						{/* Cost Section */}
						<div className="flex flex-col items-start gap-4">
							<div className="text-base">
								Cost:{" "}
								<span className="font-bold text-purple-300">
									₹{" "}
									{event.ticketPrice && event.ticketPrice > 0
										? event.ticketPrice
										: "Free"}
								</span>
							</div>
							{renderRegistrationButton()}
						</div>

						{/* Tags */}
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge
									variant="secondary"
									className="bg-purple-900/50 border border-purple-500/30"
								>
									{event.category}
								</Badge>
								<Badge
									variant="secondary"
									className="bg-blue-900/50 border border-blue-500/30"
								>
									{event.mode}
								</Badge>
								<Badge
									variant="secondary"
									className="bg-pink-900/50 border border-pink-500/30"
								>
									{event.visibility}
								</Badge>
							</div>
							<div className="flex gap-4">
								<motion.button
									aria-label="Like event"
									className="hover:text-purple-400 transition-colors"
									onClick={() => {
										handleLikeUnlikeEvent(event._id);
										event.isLiked = !event.isLiked;
										setIsLike(event.isLiked);
									}}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
								>
									<Heart
										className="w-5 h-5 text-gray-400"
										color={isLike ? "red" : "currentColor"}
									/>
								</motion.button>
								<motion.button
									aria-label="Share event"
									className="hover:text-purple-400 transition-colors"
									onClick={() => {
										if (navigator.share) {
											navigator
												.share({
													title: event.name,
													text: event.eventDescription,
													url: `${window.location.origin}/event/${event._id}`,
												})
												.catch((err) =>
													console.error("Error sharing:", err),
												);
										} else {
											console.log("Web Share API not supported");
										}
									}}
									whileHover={{ scale: 1.2 }}
									whileTap={{ scale: 0.9 }}
								>
									<Send className="w-5 h-5 text-gray-400" />
								</motion.button>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<Tabs
					defaultValue="details"
					className="w-full mt-6"
					aria-label="Event information tabs"
				>
					<TabsList className="bg-gray-900 border-b border-gray-800 w-full overflow-x-auto flex-nowrap overflow-y-hidden -mx-3 px-3 sm:mx-0 sm:px-0">
						<TabsTrigger
							value="details"
							className="text-sm data-[state=active]:bg-purple-600"
						>
							Details
						</TabsTrigger>
						<TabsTrigger
							value="dates"
							className="text-sm data-[state=active]:bg-purple-600"
						>
							Dates & Deadlines
						</TabsTrigger>
						{event.prizes && (
							<TabsTrigger
								value="prizes"
								className="text-sm data-[state=active]:bg-purple-600"
							>
								Prizes
							</TabsTrigger>
						)}
						{event.paymentQRcode && (
							<TabsTrigger
								value="Payment QR Code"
								className="text-sm data-[state=active]:bg-purple-600"
							>
								Payment QR Code
							</TabsTrigger>
						)}
					</TabsList>

					<AnimatePresence mode="wait">
						<TabsContent
							value="details"
							className="py-4"
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/20"
							>
								<h3 className="text-lg font-semibold mb-2 text-purple-300">
									Details for the Event
								</h3>
								<div className="text-gray-300 space-y-2 whitespace-pre-line">
									{event.eventDescription
										?.split("\\n")
										.map((line) => line)
										.join("\n")}
								</div>
							</motion.div>
						</TabsContent>

						<TabsContent
							value="dates"
							className="py-4"
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/20"
							>
								<h3 className="text-lg font-semibold mb-2 text-purple-300">
									Dates & Deadlines
								</h3>
								<p className="text-gray-300">
									<span className="font-medium">Start Date:</span>{" "}
									{new Date(event.startDate).toLocaleDateString(
										"en-IN",
									)}
									<br />
									<span className="font-medium">Start Time:</span>{" "}
									{formatTime(event.startTime)}
									<br />
									<span className="font-medium">Duration:</span>{" "}
									{event.duration}
									<br />
									<span className="font-medium">
										Registration Deadline:
									</span>{" "}
									{new Date(
										event.endRegistrationDate,
									).toLocaleDateString("en-IN")}
								</p>
							</motion.div>
						</TabsContent>

						<TabsContent
							value="prizes"
							className="py-4"
						>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="bg-gray-800/80 p-4 rounded-lg border border-purple-500/20"
							>
								<h3 className="text-lg font-semibold mb-2 text-purple-300">
									Prizes
								</h3>
								<div className="text-gray-300 space-y-2 whitespace-pre-line">
									{event.prizes
										?.split("\\n")
										.map((line) => line)
										.join("\n")}
								</div>
							</motion.div>
						</TabsContent>

						<TabsContent
							value="Payment QR Code"
							className="py-4 flex justify-center items-center"
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.3 }}
							>
								<Image
									src={event.paymentQRcode ?? ""}
									alt="paymentQRcode"
									height={300}
									width={300}
								/>
							</motion.div>
						</TabsContent>
					</AnimatePresence>
				</Tabs>
			</div>
		</div>
	);
}
