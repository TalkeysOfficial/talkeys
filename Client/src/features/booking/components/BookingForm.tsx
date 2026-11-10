"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, IndianRupee, Ticket } from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { EventPassType } from "@/types/types";

export type AttendeeForm = {
	name: string;
	email: string;
	phone: string;
	passTypeId: string;
};

const formatAmount = (amount: number) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(amount || 0);

export const createAttendee = (index: number, passTypeId: string): AttendeeForm => ({
	name: "",
	email: "",
	phone: "",
	passTypeId,
});

export function PassTypesPanel({
	passTypes,
	selectedPassTypeId,
	isPaid,
	isDisabled,
	buttonText,
	onSelect,
	onRegister,
}: {
	passTypes: EventPassType[];
	selectedPassTypeId: string;
	isPaid: boolean;
	isDisabled: boolean;
	buttonText: string;
	onSelect: (passTypeId: string) => void;
	onRegister: (passTypeId: string) => void;
}) {
	return (
		<aside className="h-full bg-[#070707]">
			<div className="h-full overflow-hidden border-t border-purple-500/25 bg-[#070707] lg:border-l lg:border-t-0">
				<div className="border-b border-white/10 p-5">
					<div className="flex items-center justify-between gap-3">
						<h2 className="text-xl font-semibold text-white">Types of Passes</h2>
						<Ticket className="h-5 w-5 text-[#c69cff]" />
					</div>
				</div>

				<div className="space-y-3 p-4">
					{passTypes.map((passType) => {
						const isSelected = selectedPassTypeId === passType.id;
						const soldOut = passType.availableQuantity === 0;

						return (
							<div
								key={passType.id}
								className={`rounded-lg border p-4 transition ${
									isSelected
										? "border-purple-400 bg-purple-500/15"
										: "border-white/10 bg-white/[0.03] hover:border-purple-400/60"
								}`}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<h3 className="break-words text-base font-semibold text-white">
											{passType.name}
										</h3>
										{passType.description ? (
											<p className="mt-1 text-sm leading-relaxed text-gray-400">
												{passType.description}
											</p>
										) : null}
									</div>
									<div className="shrink-0 rounded-md bg-black/40 px-3 py-1 text-sm font-semibold text-[#e5d0ff]">
										{isPaid && passType.price > 0
											? formatAmount(passType.price)
											: "Free"}
									</div>
								</div>

								<div className="mt-4 flex justify-end">
									<Button
										type="button"
										disabled={isDisabled || soldOut}
										onClick={() => {
											onSelect(passType.id);
											onRegister(passType.id);
										}}
										className="h-9 rounded-full bg-purple-700 px-5 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
									>
										{soldOut ? "Sold Out" : buttonText}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</aside>
	);
}

export function RegistrationPage({
	eventName,
	onBack,
	eventIsPaid,
	eventIsTeamEvent,
	passTypes,
	selectedPassTypeId,
	teamCode,
	setTeamCode,
	attendees,
	setAttendees,
	isSubmitting,
	onSubmit,
}: {
	eventName: string;
	onBack: () => void;
	eventIsPaid: boolean;
	eventIsTeamEvent: boolean;
	passTypes: EventPassType[];
	selectedPassTypeId: string;
	teamCode: string;
	setTeamCode: (value: string) => void;
	attendees: AttendeeForm[];
	setAttendees: (updater: AttendeeForm[] | ((current: AttendeeForm[]) => AttendeeForm[])) => void;
	isSubmitting: boolean;
	onSubmit: () => void;
}) {
	const [personCountValue, setPersonCountValue] = useState(
		String(attendees.length || 1),
	);
	const sharedPassTypeId = attendees[0]?.passTypeId || selectedPassTypeId;
	const totalAmount = attendees.reduce((sum, attendee) => {
		const passType = passTypes.find((item) => item.id === attendee.passTypeId);
		return sum + (eventIsPaid ? Number(passType?.price || 0) : 0);
	}, 0);
	const personCountNumber = Number(personCountValue);
	const isPersonCountValid =
		Number.isFinite(personCountNumber) &&
		personCountNumber >= 1 &&
		personCountNumber <= 10 &&
		attendees.length > 0;

	const setPersonCount = (nextCount: number) => {
		const count = Math.min(Math.max(Math.floor(nextCount), 0), 10);
		setAttendees((current) => {
			const next = [...current];
			while (next.length < count) {
				next.push(createAttendee(next.length, selectedPassTypeId));
			}
			return next.slice(0, count);
		});
	};

	useEffect(() => {
		setPersonCountValue(String(attendees.length));
	}, [attendees.length]);

	const handlePersonCountChange = (value: string) => {
		setPersonCountValue(value);

		if (!value) return;

		const nextCount = Number(value);
		if (!Number.isFinite(nextCount)) return;
		if (nextCount > 10) return;

		setPersonCount(nextCount);
	};

	const normalizePersonCount = () => {
		const nextCount = Number(personCountValue);
		const count = Number.isFinite(nextCount)
			? Math.min(Math.max(Math.floor(nextCount), 0), 10)
			: attendees.length;

		setPersonCountValue(String(count));
		setPersonCount(count);
	};

	const applyPassToAll = (passTypeId: string) => {
		setAttendees((current) =>
			current.map((attendee) => ({
				...attendee,
				passTypeId,
			})),
		);
	};

	const updateAttendee = (
		index: number,
		field: keyof AttendeeForm,
		value: string,
	) => {
		setAttendees((current) =>
			current.map((attendee, attendeeIndex) =>
				attendeeIndex === index ? { ...attendee, [field]: value } : attendee,
			),
		);
	};

	return (
		<div className="fixed inset-0 z-[9999] min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#070708] pt-24 text-white">
			<Navbar />

			<main className="w-full max-w-full overflow-x-hidden px-4 pb-32 sm:px-8 sm:pb-10">
				<button
					type="button"
					onClick={onBack}
					className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to event
				</button>

				<div className="grid min-h-[calc(100vh-150px)] w-full max-w-full gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
					<aside className="border border-purple-500/30 bg-[#0a0a0d] p-5 shadow-2xl shadow-purple-950/30 lg:sticky lg:top-24 lg:h-fit">
						<div className="flex items-center gap-2 text-sm uppercase tracking-wide text-purple-200">
							<Ticket className="h-4 w-4" />
							Register for
						</div>
						<h1 className="mt-2 break-words text-3xl font-semibold leading-tight text-white">
							{eventName}
						</h1>

						<div className="mt-6 space-y-4">
							<div>
								<Label htmlFor="personCount" className="text-gray-300">
									Number of people
								</Label>
								<Input
									id="personCount"
									type="number"
									min={0}
									max={10}
									value={personCountValue}
									onChange={(event) =>
										handlePersonCountChange(event.target.value)
									}
									onBlur={normalizePersonCount}
									className="mt-2 border-gray-700 bg-black text-white"
								/>
								{!isPersonCountValid ? (
									<p className="mt-2 text-xs text-gray-500">
										Add at least 1 person to confirm registration.
									</p>
								) : null}
							</div>

							<div>
								<Label className="text-gray-300">Apply pass to all</Label>
								<Select
									value={sharedPassTypeId}
									onValueChange={applyPassToAll}
								>
									<SelectTrigger className="mt-2 border-gray-700 bg-black text-white">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="z-[10001] border-gray-700 bg-gray-950 text-white">
										{passTypes.map((passType) => (
											<SelectItem key={passType.id} value={passType.id}>
												{passType.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{eventIsTeamEvent ? (
								<div>
									<Label htmlFor="teamCode" className="text-gray-300">
										Team Code
									</Label>
									<Input
										id="teamCode"
										value={teamCode}
										onChange={(event) => setTeamCode(event.target.value)}
										className="mt-2 border-gray-700 bg-black text-white"
									/>
								</div>
							) : null}

							<div className="border border-purple-500/25 bg-purple-500/10 p-4">
								<div className="flex items-center gap-2 text-sm text-purple-200">
									<IndianRupee className="h-4 w-4" />
									Total amount
								</div>
								<div className="mt-2 text-3xl font-semibold text-white">
									{formatAmount(totalAmount)}
								</div>
							</div>
						</div>
					</aside>

					<section className="flex min-w-0 flex-col border border-white/10 bg-[#0b0b0e]">
						<div className="border-b border-white/10 px-5 py-4 sm:px-6">
							<h2 className="text-xl font-semibold text-white">Attendee details</h2>
							<p className="mt-1 text-sm text-gray-400">
								Choose pass type and enter details for every person.
							</p>
						</div>

						<div className="space-y-4 p-5 pb-0 sm:p-6 sm:pb-0">
							{attendees.map((attendee, index) => (
								<div
									key={index}
									className="border border-white/10 bg-white/[0.03] p-4"
								>
									<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<h3 className="text-sm font-semibold uppercase text-gray-300">
											Person {index + 1}
										</h3>
										<Select
											value={attendee.passTypeId}
											onValueChange={(value) =>
												updateAttendee(index, "passTypeId", value)
											}
										>
											<SelectTrigger className="h-9 w-full border-gray-700 bg-black text-white sm:w-56">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="z-[10001] border-gray-700 bg-gray-950 text-white">
												{passTypes.map((passType) => (
													<SelectItem key={passType.id} value={passType.id}>
														{passType.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
										<div>
											<Label className="text-gray-300">Name</Label>
											<Input
												value={attendee.name}
												onChange={(event) =>
													updateAttendee(index, "name", event.target.value)
												}
												className="mt-2 border-gray-700 bg-black text-white"
											/>
										</div>
										<div>
											<Label className="text-gray-300">Email</Label>
											<Input
												type="email"
												value={attendee.email}
												onChange={(event) =>
													updateAttendee(index, "email", event.target.value)
												}
												className="mt-2 border-gray-700 bg-black text-white"
											/>
										</div>
										<div>
											<Label className="text-gray-300">Phone</Label>
											<Input
												value={attendee.phone}
												onChange={(event) =>
													updateAttendee(index, "phone", event.target.value)
												}
												className="mt-2 border-gray-700 bg-black text-white"
											/>
										</div>
									</div>
								</div>
							))}

							<div className="sticky bottom-0 z-30 -mx-5 -mb-5 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#0b0b0e]/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6 lg:static lg:mx-0 lg:mb-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:backdrop-blur-none">
								<Button
									type="button"
									variant="outline"
									onClick={onBack}
									className="border-gray-700 bg-transparent text-gray-200 hover:bg-gray-900 hover:text-white"
								>
									Cancel
								</Button>
								<Button
									type="button"
									onClick={onSubmit}
									disabled={isSubmitting || !isPersonCountValid}
									className="bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-60"
								>
									{isSubmitting ? "Processing..." : "Confirm Registration"}
								</Button>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
