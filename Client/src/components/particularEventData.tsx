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
import type { Event } from "@/app/eventPage/page";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";

interface EventPageProps {
	readonly event: Event;
	readonly onClose: () => void;
}

interface TeamResponse {
	team: {
		teamName: string;
		teamLeader: string;
		teamCode: string;
		teamMembers: string[];
		maxMembers: number;
		_id: string;
		__v: number;
	};
	teamCode: string;
}

export default function EventPage({ event, onClose }: EventPageProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [registrationState, setRegistrationState] = useState<
		| "initial"
		| "teamOptions"
		| "joinTeamPhone"
		| "joinTeamCode"
		| "createTeamPhone"
		| "createTeamName"
		| "createTeamCode"
		| "teamJoined"
		| "error"
		| "booked"
		| "passCreated"
	>("initial");
	const [teamCode, setTeamCode] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [teamName, setTeamName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [pass, setPass] = useState<string | null>(null);

	useEffect(() => {
		async function getTeamAndPass() {
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
					// Fetch pass after confirming team exists
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

		getTeamAndPass();
	}, [event._id]);

	const handleRegisterClick = () => {
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
					setErrorMessage("Unauthorized");
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

	const handleBookTickets = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/bookTicket`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ teamCode, name: event.name }),
			});
			const data = await response.json();
			if (response.ok) {
				setErrorMessage(data.message);
				setRegistrationState("booked");
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			console.error("Failed to book tickets", error);
			if (error instanceof Error) setErrorMessage(error.message);
			setRegistrationState("error");
		} finally {
			setIsLoading(false);
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

	const renderRegistrationButton = () => {
		switch (registrationState) {
			case "initial":
				return (
					<Button
						className="bg-purple-600 hover:bg-purple-700 w-full"
						onClick={handleRegisterClick}
						disabled={!event.isLive}
						aria-label={
							event.isLive ? "Register for event" : "Event coming soon"
						}
					>
						{event.isLive ? "Register Now" : "Coming Soon"}
					</Button>
				);
			case "teamOptions":
				return (
					<div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm mx-auto">
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={handleJoinTeam}
						>
							Join Team
						</Button>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={handleCreateTeam}
						>
							Create Team
						</Button>
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
							className="bg-gray-800 text-white w-full text-base px-4 py-2"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<Button
								className="bg-green-600 hover:bg-green-700 w-full"
								onClick={handlePhoneSubmit}
								disabled={!phoneNumber}
							>
								<Check className="w-4 h-4 mr-2" />
								Continue
							</Button>
							<Button
								className="bg-red-600 hover:bg-red-700 w-full"
								onClick={() => setRegistrationState("initial")}
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
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
							className="bg-gray-800 text-white w-full text-base px-4 py-2"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
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
							<Button
								className="bg-red-600 hover:bg-red-700 w-full"
								onClick={() => setRegistrationState("initial")}
								disabled={isLoading}
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
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
							className="bg-gray-800 text-white w-full text-base px-4 py-2"
						/>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
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
							<Button
								className="bg-red-600 hover:bg-red-700 w-full"
								onClick={() => setRegistrationState("initial")}
								disabled={isLoading}
							>
								<X className="w-4 h-4 mr-2" />
								Cancel
							</Button>
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
								className="bg-gray-800 text-white flex-1 text-base px-4 py-2"
							/>
							<Button
								className="ml-2"
								onClick={() => navigator.clipboard.writeText(teamCode)}
							>
								<Copy className="w-4 h-4" />
							</Button>
						</div>
						<div className="text-green-500">Team Created: {teamName}</div>
						<Button
							className="bg-green-600 hover:bg-green-700 w-full"
							onClick={handleCreatePass}
						>
							Create Pass
						</Button>
					</div>
				);
			case "teamJoined":
				return (
					<div className="w-full max-w-sm mx-auto">
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={handleCreatePass}
						>
							Book Pass
						</Button>
					</div>
				);
			case "error":
				return (
					<div className="w-full max-w-sm mx-auto space-y-2">
						<div className="text-red-500">{errorMessage}</div>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={() => setRegistrationState("initial")}
						>
							Try Again
						</Button>
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
							<div className="flex justify-center">
								<QRCode value={pass} />
							</div>
						)}
					</div>
				);
		}
	};

	return (
		<div
			className="bg-black text-white overflow-y-auto max-h-[90vh] md:max-h-[80vh] rounded-lg shadow-xl w-full mx-auto"
			aria-modal="true"
		>
			<div className="p-3 sm:p-4 md:p-6 max-w-[800px] mx-auto">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-400 hover:text-white"
					aria-label="Close dialog"
				>
					<X className="w-6 h-6" />
				</button>

				{/* Header Section */}
				<div className="flex flex-col sm:flex-row gap-6 mb-6">
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
							<h1 className="text-2xl font-bold mb-3">{event.name}</h1>
							<div className="space-y-1.5 text-gray-400 text-sm">
								<div className="flex items-center gap-2">
									<MapPin className="w-4 h-4" />
									<span>{event.location ?? "Online Event"}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<span>
										{new Date(event.startDate).toLocaleDateString()}{" "}
										{event.startTime}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<User className="w-4 h-4" />
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
							<div className="text-base">Cost: ₹{event.ticketPrice}</div>
							{renderRegistrationButton()}
						</div>

						{/* Tags */}
						<div className="space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">{event.category}</Badge>
								<Badge variant="secondary">{event.mode}</Badge>
								<Badge variant="secondary">{event.visibility}</Badge>
							</div>
							<div className="flex gap-4">
								<button
									aria-label="Like event"
									className="hover:text-purple-400 transition-colors"
									onClick={() => {
										setIsLiked((prev) => !prev);
									}}
								>
									<Heart
										className="w-5 h-5 text-gray-400"
										color={isLiked ? "red" : "currentColor"}
									/>
								</button>
								<button
									aria-label="Share event"
									className="hover:text-purple-400 transition-colors"
									onClick={() => {
										navigator.clipboard.writeText(
											window.location.href,
										);
									}}
								>
									<Send className="w-5 h-5 text-gray-400" />
								</button>
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
							className="text-sm"
						>
							Details
						</TabsTrigger>
						<TabsTrigger
							value="dates"
							className="text-sm"
						>
							Dates & Deadlines
						</TabsTrigger>
						<TabsTrigger
							value="prizes"
							className="text-sm"
						>
							Prizes
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="details"
						className="py-4"
					>
						<div className="bg-gray-800 p-4 rounded-lg">
							<h3 className="text-lg font-semibold mb-2">
								Details for the Event
							</h3>
							<p className="text-gray-400">{event.eventDescription}</p>
						</div>
					</TabsContent>

					<TabsContent
						value="dates"
						className="py-4"
					>
						<div className="bg-gray-800 p-4 rounded-lg">
							<h3 className="text-lg font-semibold mb-2">
								Dates & Deadlines
							</h3>
							<p className="text-gray-400">
								Start Date:{" "}
								{new Date(event.startDate).toLocaleDateString()}
								<br />
								Start Time: {event.startTime}
								<br />
								Duration: {event.duration}
								<br />
								Registration Deadline:{" "}
								{new Date(
									event.endRegistrationDate,
								).toLocaleDateString()}
							</p>
						</div>
					</TabsContent>

					<TabsContent
						value="prizes"
						className="py-4"
					>
						<div className="bg-gray-800 p-4 rounded-lg">
							<h3 className="text-lg font-semibold mb-2">Prizes</h3>
							<p className="text-gray-400">
								{event.prizes ?? "No prize information available."}
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
