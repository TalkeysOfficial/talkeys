// components/event/RegistrationControls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { type RegistrationState } from "@/lib/hooks/useTeamRegistration";
import FriendsSection from "./FriendsSection";
import { type Friend } from "@/lib/utils/validation";

type CommonProps = {
	state: RegistrationState;
	isPaid: boolean;
	ticketPrice?: number;
	status: string;
	isLive?: boolean;

	// team / phone
	phone: string;
	setPhone: (v: string) => void;
	teamCode: string;
	setTeamCode: (v: string) => void;
	teamName: string;
	setTeamName: (v: string) => void;

	// actions
	toJoin: () => void;
	toCreate: () => void;
	submitPhone: () => void;
	submitJoin: () => void;
	submitCreate: () => void;
	createPass: () => Promise<void> | void;
	goRegister: () => void;
	payNow: () => void;
	reset: () => void;

	isLoading: boolean;
	errorMsg: string;

	// friends
	friends: Friend[];
	showFriends: boolean;
	setShowFriends: (v: boolean) => void;

	name: string;
	setName: (v: string) => void;
	email: string;
	setEmail: (v: string) => void;
	phoneFriend: string;
	setPhoneFriend: (v: string) => void;
	errors: Partial<Record<keyof Friend, string>>;
	validateField: (field: keyof Friend, value: string) => void;
	addFriend: () => void;
	removeFriend: (f: Friend) => void;
	onEnter: (e: React.KeyboardEvent) => void;

	passQRCodes: string[];
};

export default function RegistrationControls(props: CommonProps) {
	const isDisabled =
		props.status === "registration_closed" ||
		props.status === "coming_soon" ||
		props.status === "ended" ||
		!props.isLive;

	const initialButtonText =
		props.status === "registration_closed"
			? "Registrations Closed"
			: props.status === "coming_soon"
			? "Coming Soon"
			: props.status === "live"
			? props.isPaid
				? "Pay NOW"
				: "Register Now"
			: "Event Ended";

	const initialAria =
		props.status === "registration_closed"
			? "Registrations closed"
			: props.status === "coming_soon"
			? "Event coming soon"
			: props.status === "live"
			? props.isPaid
				? "Pay for tickets for event"
				: "Register for event"
			: "Event ended";

	const InitialPaidBlock = (
		<div className="space-y-3 w-full">
			<FriendsSection
				show={props.showFriends}
				toggle={() => props.setShowFriends(!props.showFriends)}
				name={props.name}
				setName={props.setName}
				email={props.email}
				setEmail={props.setEmail}
				phone={props.phoneFriend}
				setPhone={props.setPhoneFriend}
				errors={props.errors}
				validateField={props.validateField}
				onEnter={props.onEnter}
				add={props.addFriend}
				remove={props.removeFriend}
				friends={props.friends}
			/>
			<motion.div
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
			>
				<Button
					className="bg-purple-600 hover:bg-purple-700 w-full rounded-full"
					onClick={props.payNow}
					disabled={isDisabled}
					aria-label={initialAria}
				>
					{initialButtonText}
					{props.friends.length > 0 && (
						<span className="ml-2 text-xs bg-purple-800 px-2 py-1 rounded-full">
							+{props.friends.length}
						</span>
					)}
				</Button>
			</motion.div>
		</div>
	);

	const InitialFreeBlock = (
		<motion.div
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
		>
			<Button
				className="bg-purple-600 hover:bg-purple-700 w-full"
				onClick={props.goRegister}
				disabled={isDisabled}
				aria-label={initialAria}
			>
				{initialButtonText}
			</Button>
		</motion.div>
	);

	switch (props.state) {
		case "initial": {
			return props.isPaid ? InitialPaidBlock : InitialFreeBlock;
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
							onClick={props.toJoin}
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
							onClick={props.toCreate}
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
						value={props.phone}
						onChange={(e) => props.setPhone(e.target.value)}
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
								onClick={props.submitPhone}
								disabled={!props.phone}
							>
								<Check className="w-4 h-4 mr-2" /> Continue
							</Button>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="w-full"
						>
							<Button
								className="bg-red-600 hover:bg-red-700 w-full"
								onClick={props.reset}
							>
								<X className="w-4 h-4 mr-2" /> Cancel
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
						value={props.teamName}
						onChange={(e) => props.setTeamName(e.target.value)}
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
								onClick={props.submitCreate}
								disabled={props.isLoading || !props.teamName}
							>
								{props.isLoading ? (
									<div className="flex items-center justify-center gap-2 w-full">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span className="text-sm">Creating...</span>
									</div>
								) : (
									<>
										<Check className="w-4 h-4 mr-2" /> Create Team
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
								onClick={props.reset}
								disabled={props.isLoading}
							>
								<X className="w-4 h-4 mr-2" /> Cancel
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
						value={props.teamCode}
						onChange={(e) => props.setTeamCode(e.target.value)}
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
								onClick={props.submitJoin}
								disabled={props.isLoading || !props.teamCode}
							>
								{props.isLoading ? (
									<div className="flex items-center justify-center gap-2 w-full">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										<span className="text-sm">Joining...</span>
									</div>
								) : (
									<>
										<Check className="w-4 h-4 mr-2" /> Join Team
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
								onClick={props.reset}
								disabled={props.isLoading}
							>
								<X className="w-4 h-4 mr-2" /> Cancel
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
							value={props.teamCode}
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
									navigator.clipboard.writeText(props.teamCode)
								}
							>
								<Copy className="w-4 h-4" />
							</Button>
						</motion.div>
					</div>
					<div className="text-green-500">
						Team Created: {props.teamName}
					</div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							className="bg-green-600 hover:bg-green-700 w-full"
							onClick={() => props.createPass()}
						>
							Create Pass
						</Button>
					</motion.div>
				</div>
			);
		case "teamJoined":
			return (
				<div className="w-full max-w-sm mx-auto space-y-3">
					<FriendsSection
						show={props.showFriends}
						toggle={() => props.setShowFriends(!props.showFriends)}
						name={props.name}
						setName={props.setName}
						email={props.email}
						setEmail={props.setEmail}
						phone={props.phoneFriend}
						setPhone={props.setPhoneFriend}
						errors={props.errors}
						validateField={props.validateField}
						onEnter={props.onEnter}
						add={props.addFriend}
						remove={props.removeFriend}
						friends={props.friends}
					/>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={props.payNow}
						>
							Pay Now
							{props.friends.length > 0 && (
								<span className="ml-2 text-xs bg-purple-800 px-2 py-1 rounded-full">
									+{props.friends.length}
								</span>
							)}
						</Button>
					</motion.div>
				</div>
			);
		case "error":
			return (
				<div className="w-full max-w-sm mx-auto space-y-2">
					<div className="text-red-500">{props.errorMsg}</div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							className="bg-purple-600 hover:bg-purple-700 w-full"
							onClick={props.reset}
						>
							Try Again
						</Button>
					</motion.div>
				</div>
			);
		case "booked":
			return (
				<div className="w-full max-w-sm mx-auto space-y-2">
					<div className="text-green-500">{props.errorMsg}</div>
					<Button
						className="bg-purple-600 hover:bg-purple-700 w-full"
						disabled
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

					{props.isPaid && (props.ticketPrice ?? 0) > 0 && (
						<div className="space-y-3">
							<FriendsSection
								show={props.showFriends}
								toggle={() => props.setShowFriends(!props.showFriends)}
								name={props.name}
								setName={props.setName}
								email={props.email}
								setEmail={props.setEmail}
								phone={props.phoneFriend}
								setPhone={props.setPhoneFriend}
								errors={props.errors}
								validateField={props.validateField}
								onEnter={props.onEnter}
								add={props.addFriend}
								remove={props.removeFriend}
								friends={props.friends}
							/>
						</div>
					)}

					{props.isPaid && (props.ticketPrice ?? 0) > 0 && (
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="mb-2"
						>
							<Button
								className="bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2"
								onClick={props.payNow}
							>
								<span className="text-lg font-bold">Buy Now</span>
								{props.ticketPrice ? (
									<span className="text-sm">
										₹ {props.ticketPrice}
									</span>
								) : null}
								{props.friends.length > 0 && (
									<span className="ml-2 text-xs bg-purple-800 px-2 py-1 rounded-full">
										+{props.friends.length}
									</span>
								)}
							</Button>
						</motion.div>
					)}
				</div>
			);
		default:
			return null;
	}
}
