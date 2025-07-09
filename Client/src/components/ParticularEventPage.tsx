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
import type { EventPageProps, RegistrationState } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import eventImg from "@/public/images/eventimage.jpg";
import collegeImg from "@/public/images/College.png";
import dateImg from "@/public/images/Date.png";
import heartImg from "@/public/images/heart.png";
import locationImg from "@/public/images/location.png";
import trophyImg from "@/public/images/trophy.png";
import vectorImg from "@/public/images/Vector.png";
import lineImg from "@/public/images/Line 4.png";

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
								className="bg-purple-600 hover:bg-purple-700 w-full rounded-full"
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
        <div className="fixed inset-0 z-[9999] min-h-screen w-full bg-background/80 backdrop-blur-md overflow-y-scroll overflow-x-hidden px-2 sm:px-4 py-10 pt-24 no-scrollbar">
  <Navbar />

  {onClose && (
    <div className="flex justify-start px-2 sm:px-4 mt-2">
      <button
        onClick={onClose}
        className="text-white text-lg sm:text-xl font-bold hover:text-red-400 transition-all"
        aria-label="Close"
      >
        ✖
      </button>
    </div>
  )}

  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 mt-6 sm:mt-10 mb-10 sm:mb-20 w-screen">
    <Image
      src={eventImg?.[0] ?? eventImg}
      alt={`${event.name}-banner`}
      width={253}
      height={320}
      className="object-cover rounded-xl"
    />

    <div className="flex flex-col gap-4 sm:gap-6 w-full text-[32px] sm:text-[54px] font-urbanist leading-none font-semibold mt-4 lg:mt-0">
      <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-urbanist leading-tight">
        {event.name}
      </span>

      <div className="flex flex-col gap-2 sm:gap-4 text-white font-urbanist w-full">
        <div className="flex items-center gap-2">
          <Image src={collegeImg} alt="college" width={20} height={20} className="w-4 sm:w-5 h-4 sm:h-5 object-contain" />
          <span className="text-[14px] sm:text-[16px] font-normal truncate">{event.collegeName ?? "College Name"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src={locationImg} alt="location" width={20} height={20} className="w-4 sm:w-5 h-4 sm:h-5 object-contain" />
          <span className="text-[14px] sm:text-[16px] font-normal truncate">{event.location ?? "This Location"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src={dateImg} alt="date" width={20} height={20} className="w-4 sm:w-5 h-4 sm:h-5 object-contain" />
          <span className="text-[14px] sm:text-[16px] font-normal truncate">
            {new Date(event.startDate).toLocaleDateString("en-IN")} at {formatTime(event.startTime)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Image src={trophyImg} alt="fest" width={20} height={20} className="w-4 sm:w-5 h-4 sm:h-5 object-contain" />
          <span className="text-[14px] sm:text-[16px] font-normal truncate">{event.festName ?? "Fest Name"}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center items-end gap-[25px] h-[297.501px] px-8 py-4 bg-neutral-900 rounded-2xl mt-6 sm:mt-10 w-full sm:w-[700px]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-2 sm:gap-4">
        <span className="text-white font-urbanist text-base sm:text-xl md:text-[22px] font-normal leading-none">
          Cost for Event
        </span>
        <div className="w-full sm:w-auto">{renderRegistrationButton()}</div>
      </div>

      <div className="flex justify-end items-center gap-2">
        <div className="flex items-center gap-2">
          <Image src={heartImg} alt="likes" width={48} height={20} className="w-12 h-5 object-contain" />
          <Image src={vectorImg} alt="vector" width={24} height={24} className="w-6 h-6 object-contain" />
        </div>
        <br />
        <span className="block text-neutral-300 text-sm font-urbanist">
          {event.likes ?? 82} likes
        </span>
      </div>

      <Image src={lineImg} alt="line" width={300} height={8} className="w-full h-2 object-contain" />

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
            {event.category}
          </span>
          <span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
            {event.mode}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[396px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
            {event.visibility}
          </span>
          <span className="text-[#CCA1F4] text-sm sm:text-lg flex justify-center items-center w-full sm:w-[272px] py-2 rounded-[27px] border border-[#CCA1F4] font-urbanist">
            {event.type ?? "Event Type"}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div className="w-auto max-w-full h-[39px] bg-[#262626] rounded-full inline-flex items-center justify-start gap-[8px] sm:gap-[20px] px-3 sm:px-6">
    <div className="flex flex-wrap justify-start items-center gap-[8px] sm:gap-[16px]">
      <button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1">DETAILS</button>
      <button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1">DATE & DEADLINES</button>
      <button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1">PRIZES</button>
      <button className="text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1">
        JOIN DISCUSSION COMMUNITY
      </button>
    </div>
  </div>

  <div className="flex flex-col gap-[14px] sm:gap-[27px] w-full sm:w-[calc(100vw-122px)] mt-[14px] sm:mt-[27px]">
    {/* Details Section */}
    <div className="flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px]">
      <div className="flex items-center gap-2">
        <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
        <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
          Details for the Event
        </span>
      </div>
      <span className="text-white text-xs sm:text-sm font-urbanist whitespace-pre-line">
        {event.eventDescription}
      </span>
    </div>

    {/* Dates Section */}
    <div className="flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px]">
      <div className="flex items-center gap-2">
        <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
        <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
          Dates & Deadlines
        </span>
      </div>
      <span className="text-white text-xs sm:text-sm font-urbanist">
        <span className="font-medium">Start Date:</span>{" "}
        {new Date(event.startDate).toLocaleDateString("en-IN")}
        <br />
        <span className="font-medium">Start Time:</span> {formatTime(event.startTime)}
        <br />
        <span className="font-medium">Duration:</span> {event.duration}
        <br />
        <span className="font-medium">Registration Deadline:</span>{" "}
        {new Date(event.endRegistrationDate).toLocaleDateString("en-IN")}
      </span>
    </div>

    {/* Prizes */}
    {event.prizes && (
      <div className="flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
          <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
            Prizes
          </span>
        </div>
        <span className="text-white text-xs sm:text-sm font-urbanist whitespace-pre-line">
          {event.prizes}
        </span>
      </div>
    )}

    {/* Community Section */}
    <div className="flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
        <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
          Join Discussion Community
        </span>
      </div>
      <span className="text-white text-xs sm:text-sm font-urbanist">
        Join our vibrant discussion community to connect with like-minded individuals, share ideas, and stay updated on the latest conversations and event updates.
      </span>
    </div>
  </div>

  <Footer />
</div>


	);
}
