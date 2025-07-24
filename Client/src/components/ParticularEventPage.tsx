"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Copy } from "lucide-react";
import Image from "next/image";
import type {
	EventPageProps,
	RegistrationState,
	PassDetailsResponse,
	BookTicketResponse,
} from "@/types/types";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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
	const [isLike, setIsLike] = useState<boolean | null>(event.isLiked);
	const [likes, setLikes] = useState<number>(event.likes ?? 82);
	const [likeLoading, setLikeLoading] = useState(false);

	//hover on buttons
	const [hovered, setHovered] = useState<string | null>(null);

	// pathname use in closing button
	const searchParams = useSearchParams();

	const fromHome = searchParams.get("from") === "home";

	const handleClose = () => {
		if (fromHome) {
			router.push("/"); // go back to home
		} else {
			router.back(); // or onClose(), depending on your setup
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
	const toggleLike = async () => {
		if (likeLoading) return;

		setLikeLoading(true);
		try {
			await handleLikeUnlikeEvent(event._id);
			setIsLike((prev) => !prev);
			setLikes((prev) => (isLike ? prev - 1 : prev + 1));
		} catch (err) {
			console.error("Failed to toggle like", err);
		} finally {
			setLikeLoading(false);
		}
	};

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
								<style
									jsx
									global
								>{`
									.qr-swiper .swiper-button-next,
									.qr-swiper .swiper-button-prev {
										background: rgba(138, 68, 203, 0.8);
										border-radius: 50%;
										width: 40px;
										height: 40px;
									}
									.qr-swiper .swiper-button-next:after,
									.qr-swiper .swiper-button-prev:after {
										font-size: 16px;
										font-weight: bold;
									}
									.qr-swiper .swiper-pagination-bullet {
										background: #666;
									}
									.qr-swiper .swiper-pagination-bullet-active {
										background: #8a44cb;
									}
								`}</style>
								<Swiper
									modules={[Navigation, Pagination]}
									spaceBetween={20}
									slidesPerView={1}
									navigation={passQRCodes.length > 1}
									pagination={
										passQRCodes.length > 1
											? { clickable: true }
											: false
									}
									className="qr-swiper"
									style={
										{
											"--swiper-navigation-color": "#8A44CB",
											"--swiper-pagination-color": "#8A44CB",
										} as React.CSSProperties
									}
								>
									{passQRCodes.map((qrCode, index) => (
										<SwiperSlide
											key={`qr-${qrCode.substring(0, 8)}-${index}`}
										>
											<div className="flex flex-col items-center space-y-2 py-4">
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
										</SwiperSlide>
									))}
								</Swiper>
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
		<div className="fixed inset-0 z-[9999] min-h-screen w-full bg-black backdrop-blur-md overflow-y-scroll overflow-x-hidden py-10 pt-24 no-scrollbar">
			<Navbar />

			{handleClose && (
				<div className="flex justify-start px-2 sm:px-4 mt-2">
					<button
						onClick={handleClose}
						className="text-white text-lg sm:text-xl font-bold hover:text-red-400 transition-all"
						aria-label="Close"
					>
						✖
					</button>
				</div>
			)}

			<div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 mt-6 sm:mt-10 mb-10 sm:mb-20 w-full max-w-full overflow-hidden px-2 pl-8">
				<Image
					src={event.photographs?.[0] || "/images/placeholder.jpg"}
					alt={`${event.name}-banner`}
					width={253}
					height={320}
					className="object-cover rounded-xl w-auto max-w-full h-auto"
				/>

				<div className="flex flex-col gap-4 sm:gap-6 w-full text-[32px] sm:text-[54px] font-urbanist leading-none font-semibold mt-4 lg:mt-0">
					<span className="text-white text-xl sm:text-2xl md:text-3xl font-bold font-urbanist leading-tight">
						{event.name}
					</span>

					<div className="flex flex-col gap-2 sm:gap-4 text-white font-urbanist w-full">
						<div className="flex items-center gap-2">
							<Image
								src={collegeImg}
								alt="college"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate">
								{event.collegeName ?? "College Name"}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<Image
								src={locationImg}
								alt="location"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate">
								{event.location ?? "This Location"}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<Image
								src={dateImg}
								alt="date"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate">
								{new Date(event.startDate).toLocaleDateString("en-IN")}{" "}
								at {formatTime(event.startTime)}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<Image
								src={trophyImg}
								alt="fest"
								width={20}
								height={20}
								className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
							/>
							<span className="text-[14px] sm:text-[16px] font-normal truncate">
								{event.festName ?? "Fest Name"}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col justify-center items-end gap-[25px] px-4 sm:px-8 py-4 bg-neutral-900 rounded-2xl mt-6 sm:mt-10 w-full sm:w-[700px]">
					<div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-2 sm:gap-4">
						<span className="text-white font-urbanist text-base sm:text-xl md:text-[22px] font-normal leading-none">
							Cost for Event
						</span>
						<div className="w-full sm:w-auto">
							{renderRegistrationButton()}
						</div>
					</div>

					<div className="flex justify-end items-center gap-2 w-full">
						<div className="flex items-center gap-2">
							<motion.img
								src={heartImg.src}
								alt="likes"
								className="w-12 h-5 object-contain cursor-pointer transition-transform hover:scale-105"
								onClick={toggleLike}
								animate={{ scale: isLike ? 1.1 : 1 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 12,
								}}
							/>
							<img
								src={vectorImg.src}
								alt="vector"
								className="w-6 h-6 object-contain"
							/>
						</div>

						<span className="block text-white text-sm font-urbanist">
							{likes} likes
						</span>
					</div>

					<Image
						src={lineImg}
						alt="line"
						width={300}
						height={8}
						className="w-full h-2 object-contain"
					/>

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

			<div className="w-max max-w-full bg-[#262626] overflow-x-auto sm:overflow-visible whitespace-nowrap no-scrollbar inline-flex items-center justify-start gap-[8px] sm:gap-[20px] px-3 sm:px-6 mt-2 sm:ml-6">
				<div className="inline-flex items-center gap-[8px] sm:gap-[16px] min-w-max">
					{["details", "dates", "prizes", "community"].map(
						(key, index) => {
							const labels = [
								"DETAILS",
								"DATE & DEADLINES",
								"PRIZES",
								"JOIN DISCUSSION COMMUNITY",
							];
							return (
								<button
									key={key}
									onMouseEnter={() => setHovered(key)}
									onMouseLeave={() => setHovered(null)}
									className={`text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1 transition-colors duration-200 ${
										hovered === key
											? "bg-[#8A44CB]/30 rounded-md"
											: ""
									}`}
								>
									{labels[index]}
								</button>
							);
						},
					)}
				</div>
			</div>

			<div className="flex flex-col gap-[14px] sm:gap-[27px] w-full sm:w-[calc(100vw-122px)] mt-[14px] sm:mt-[27px] sm:ml-6">
				{/* Details Section */}
				<div
					className={`flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px] transition-colors duration-200 ${
						hovered === "details" ? "bg-[#8A44CB]/20" : ""
					}`}
				>
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
				<div
					className={`flex flex-col bg-neutral-900 rounded-none w-full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px] transition-colors duration-200 ${
						hovered === "dates" ? "bg-[#8A44CB]/20" : ""
					}`}
				>
					<div className="flex items-center gap-2">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Dates & Deadlines
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						<span className="font-medium">Start Date:</span>{" "}
						{new Date(event.startDate).toLocaleDateString("en-IN")} <br />
						<span className="font-medium">Start Time:</span>{" "}
						{formatTime(event.startTime)} <br />
						<span className="font-medium">Duration:</span>{" "}
						{event.duration} <br />
						<span className="font-medium">
							Registration Deadline:
						</span>{" "}
						{new Date(event.endRegistrationDate).toLocaleDateString(
							"en-IN",
						)}
					</span>
				</div>

				{/* Prizes */}
				{event.prizes && (
					<div
						className={`flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3 transition-colors duration-200 ${
							hovered === "prizes" ? "bg-[#8A44CB]/20" : ""
						}`}
					>
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
				<div
					className={`flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w-full gap-3 transition-colors duration-200 ${
						hovered === "community" ? "bg-[#8A44CB]/20" : ""
					}`}
				>
					<div className="flex items-center gap-3">
						<div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
						<span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
							Join Discussion Community
						</span>
					</div>
					<span className="text-white text-xs sm:text-sm font-urbanist">
						Join our vibrant discussion community to connect with
						like-minded individuals, share ideas, and stay updated on the
						latest conversations and event updates.
					</span>
				</div>
			</div>

			<Footer />
		</div>
	);
}
