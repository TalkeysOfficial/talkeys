"use client";

import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Save, Trash2, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Event } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getSafeImageSrc } from "@/lib/utils";

const EVENT_CATEGORIES = ["Party", "Events", "Meeting", "Gaming"] as const;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type AdminEventFormValues = {
	isTeamEvent: boolean;
	isPaid: boolean;
	isLive: boolean;
	isRegistrationOpen: boolean;
	name: string;
	category: string;
	ticketPrice: number;
	mode: "offline" | "online";
	location: string;
	duration: string;
	slots: number;
	visibility: "public" | "private";
	startDate: string;
	endDate?: string;
	startTime: string;
	startRegistrationDate: string;
	totalSeats: number;
	photographsText: string;
	prizes: string;
	eventDescription: string;
	sponserImagesText: string;
	organizerName: string;
	organizerEmail: string;
	organizerContact: string;
};

type AdminEventFormProps = {
	mode: "create" | "edit";
	initialEvent?: Omit<Event, "status"> & {
		sponserImages?: string[];
		endDate?: string;
		updatedAt?: string;
	};
	eventId?: string;
};

const inputClassName = "border-gray-700 bg-gray-950 text-white placeholder:text-gray-500";
const selectTriggerClassName = "border-gray-700 bg-gray-950 text-white";
const selectContentClassName =
	"z-[100] border-gray-700 bg-gray-900 text-white shadow-xl shadow-black/40";

const toDateInputValue = (value?: string | null) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString().slice(0, 10);
};

const toArrayText = (values?: string[]) => (values?.length ? values.join("\n") : "");

const splitUrls = (value: string) =>
	value
		.split(/[\n,]/)
		.map((item) => item.trim())
		.filter(Boolean);

const splitImageUrls = (value: string) =>
	splitUrls(value).filter((url) => {
		if (getSafeImageSrc(url, "") !== "") return true;
		toast.error(`Skipped unsupported image URL: ${url}`);
		return false;
	});

const normalizeMode = (mode?: string): "offline" | "online" =>
	mode?.toLowerCase() === "online" ? "online" : "offline";

const normalizeVisibility = (visibility?: string): "public" | "private" =>
	visibility?.toLowerCase() === "private" ? "private" : "public";

const toNonNegativeNumber = (value: number, fallback = 0) =>
	Number.isFinite(value) && value >= 0 ? value : fallback;

const toNonNegativeInteger = (value: number, fallback = 0) =>
	Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;

const getDefaultValues = (
	event?: AdminEventFormProps["initialEvent"],
): AdminEventFormValues => ({
	isTeamEvent: event?.isTeamEvent ?? false,
	isPaid: event?.isPaid ?? false,
	isLive: event?.isLive ?? false,
	isRegistrationOpen: event?.isRegistrationOpen ?? false,
	name: event?.name ?? "",
	category: event?.category ?? "Events",
	ticketPrice: event?.ticketPrice ?? 0,
	mode: normalizeMode(event?.mode),
	location: event?.location ?? "",
	duration: event?.duration ?? "",
	slots: event?.slots ?? 1,
	visibility: normalizeVisibility(event?.visibility),
	startDate: toDateInputValue(event?.startDate) || toDateInputValue(new Date().toISOString()),
	endDate: toDateInputValue(event?.endDate),
	startTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(event?.startTime ?? "")
		? event?.startTime ?? ""
		: "10:00",
	startRegistrationDate:
		toDateInputValue(event?.startRegistrationDate) ||
		toDateInputValue(new Date().toISOString()),
	totalSeats: event?.totalSeats ?? 0,
	photographsText: toArrayText(event?.photographs),
	prizes: event?.prizes ?? "",
	eventDescription: event?.eventDescription ?? "",
	sponserImagesText: toArrayText(event?.sponserImages ?? event?.sponsorImages),
	organizerName: event?.organizerName ?? "",
	organizerEmail: event?.organizerEmail ?? "achatrath@thapar.edu",
	organizerContact: event?.organizerContact ?? "",
});

const FieldError = ({ message }: { message?: string }) =>
	message ? <p className="mt-1 text-sm text-red-300">{message}</p> : null;

const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SelectedFileList = ({
	files,
	label,
	onRemove,
}: {
	files: File[];
	label: string;
	onRemove: (index: number) => void;
}) => {
	if (!files.length) return null;

	return (
		<details className="mt-3 rounded-lg border border-gray-800 bg-gray-950/70">
			<summary className="cursor-pointer px-3 py-2 text-sm text-gray-200">
				{files.length} {label} selected
			</summary>
			<div className="space-y-2 border-t border-gray-800 p-3">
				{files.map((file, index) => (
					<div
						key={`${file.name}-${file.lastModified}-${index}`}
						className="flex items-center justify-between gap-3 rounded-md bg-gray-900 px-3 py-2 text-sm"
					>
						<div className="min-w-0">
							<div className="truncate text-white">{file.name}</div>
							<div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
						</div>
						<button
							type="button"
							onClick={() => onRemove(index)}
							className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-red-500/15 hover:text-red-300"
							aria-label={`Remove ${file.name}`}
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>
		</details>
	);
};

const ToggleField = ({
	label,
	description,
	checked,
	onCheckedChange,
}: {
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
}) => (
	<div className="flex min-h-20 items-center justify-between gap-4 rounded-lg border border-gray-800 bg-gray-950/80 p-4">
		<div>
			<div className="text-sm font-medium text-white">{label}</div>
			<div className="mt-1 text-xs text-gray-400">{description}</div>
		</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				className="bg-gray-700 before:bg-purple-600"
			/>
	</div>
);

export default function AdminEventForm({
	mode,
	initialEvent,
	eventId,
}: AdminEventFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [photographFiles, setPhotographFiles] = useState<File[]>([]);
	const [sponserImageFiles, setSponserImageFiles] = useState<File[]>([]);

	const defaultValues = useMemo(() => getDefaultValues(initialEvent), [initialEvent]);
	const categoryOptions = useMemo(() => {
		if (
			initialEvent?.category &&
			!EVENT_CATEGORIES.includes(initialEvent.category as (typeof EVENT_CATEGORIES)[number])
		) {
			return [initialEvent.category, ...EVENT_CATEGORIES];
		}

		return [...EVENT_CATEGORIES];
	}, [initialEvent?.category]);
	const {
		control,
		handleSubmit,
		register,
		reset,
		watch,
		formState: { errors },
	} = useForm<AdminEventFormValues>({ defaultValues });

	useEffect(() => {
		reset(defaultValues);
		setPhotographFiles([]);
		setSponserImageFiles([]);
	}, [defaultValues, reset]);

	const isPaid = watch("isPaid");
	const eventMode = watch("mode");

	const addSelectedFiles = (
		files: FileList | null,
		setFiles: Dispatch<SetStateAction<File[]>>,
	) => {
		if (!files?.length) return;
		const nextFiles = Array.from(files);
		const validFiles = nextFiles.filter((file) => {
			if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
				toast.error(`${file.name} is not a supported image type`);
				return false;
			}

			if (file.size > MAX_IMAGE_SIZE_BYTES) {
				toast.error(`${file.name} must be 5 MB or smaller`);
				return false;
			}

			return true;
		});

		setFiles((currentFiles) => {
			const existingKeys = new Set(
				currentFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
			);
			const dedupedFiles = validFiles.filter(
				(file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`),
			);

			return [...currentFiles, ...dedupedFiles];
		});
	};

	const removeSelectedFile = (
		index: number,
		setFiles: Dispatch<SetStateAction<File[]>>,
	) => {
		setFiles((currentFiles) =>
			currentFiles.filter((_, fileIndex) => fileIndex !== index),
		);
	};

	const uploadEventImages = async (files: File[]) => {
		if (!files.length) return [];

		const uploadedFiles: string[] = [];
		for (const file of files) {
			const formData = new FormData();
			formData.append("image", file);

			const response = await fetch(
				`${process.env.BACKEND_URL}/admin/event-images`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
					body: formData,
				},
			);
			const result = (await response.json().catch(() => ({}))) as {
				url?: string;
				message?: string;
			};

			if (!response.ok) {
				throw new Error(result.message || "Image upload failed");
			}

			if (result.url) uploadedFiles.push(result.url);
		}

		return uploadedFiles;
	};

	const onSubmit = async (values: AdminEventFormValues) => {
		if (isSubmitting || isDeleting) return;
		setIsSubmitting(true);

		try {
			const [uploadedPhotographs, uploadedSponserImages] = await Promise.all([
				uploadEventImages(photographFiles),
				uploadEventImages(sponserImageFiles),
			]);

			const photographs = [
				...splitImageUrls(values.photographsText),
				...uploadedPhotographs,
			];
			const sponserImages = [
				...splitImageUrls(values.sponserImagesText),
				...uploadedSponserImages,
			];

			const normalizedMode = normalizeMode(values.mode);
			const payload = {
				isTeamEvent: values.isTeamEvent,
				isPaid: values.isPaid,
				isLive: values.isLive,
				isRegistrationOpen: values.isRegistrationOpen,
				name: values.name.trim(),
				category: values.category.trim(),
				ticketPrice: values.isPaid
					? toNonNegativeNumber(values.ticketPrice)
					: 0,
				mode: normalizedMode,
				location: normalizedMode === "offline" ? values.location.trim() : "",
				duration: values.duration.trim(),
				slots: toNonNegativeInteger(values.slots, 1),
				visibility: normalizeVisibility(values.visibility),
				startDate: values.startDate,
				endDate: values.endDate || null,
				startTime: values.startTime,
				startRegistrationDate: values.startRegistrationDate,
				totalSeats: toNonNegativeInteger(values.totalSeats),
				photographs,
				prizes: values.prizes,
				eventDescription: values.eventDescription,
				sponserImages,
				organizerName: values.organizerName.trim(),
				...(values.organizerEmail.trim()
					? { organizerEmail: values.organizerEmail.trim() }
					: {}),
				organizerContact: values.organizerContact.trim(),
				...(mode === "edit" && initialEvent?.updatedAt
					? { lastKnownUpdatedAt: initialEvent.updatedAt }
					: {}),
			};

			const path =
				mode === "create" ? "/admin/events" : `/admin/events/${eventId}`;
			const response = await fetch(`${process.env.BACKEND_URL}${path}`, {
				method: mode === "create" ? "POST" : "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.message || "Could not save event");
			}

			toast.success(
				mode === "create"
					? "Event added successfully"
					: "Event updated successfully",
			);
			setPhotographFiles([]);
			setSponserImageFiles([]);
			const savedEventId = data.data?._id || eventId;
			router.push(
				mode === "create" && savedEventId
					? `/admin/events/${savedEventId}/edit`
					: `/admin/events/${eventId}`,
			);
			router.refresh();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not save event");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (mode !== "edit" || !eventId || isDeleting || isSubmitting) return;

		const confirmed = window.confirm(
			`Remove ${initialEvent?.name || "this event"}? This cannot be undone.`,
		);

		if (!confirmed) return;

		setIsDeleting(true);
		try {
			const response = await fetch(
				`${process.env.BACKEND_URL}/deleteSpecificEvent/${eventId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				},
			);
			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data.message || "Failed to remove event");
			}

			toast.success("Event removed successfully");
			router.push("/admin");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to remove event",
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6 px-4 py-8 text-white">
			<Link
				href={mode === "edit" && eventId ? `/admin/events/${eventId}` : "/admin"}
				className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to admin
			</Link>

			<Card className="border-gray-800 bg-gray-900/80 text-white">
				<CardHeader>
					<CardTitle className="text-2xl">
						{mode === "create" ? "Add Event" : "Edit Event"}
					</CardTitle>
					<CardDescription className="text-gray-400">
						Manage the same event fields used by the live event pages.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
							<Controller
								name="isTeamEvent"
								control={control}
								render={({ field }) => (
									<ToggleField
										label="Team Event"
										description="Allow team-based registrations."
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
							<Controller
								name="isPaid"
								control={control}
								render={({ field }) => (
									<ToggleField
										label="Paid"
										description="Collect payment before issuing passes."
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
							<Controller
								name="isLive"
								control={control}
								render={({ field }) => (
									<ToggleField
										label="Live"
										description="Show this event as active."
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
							<Controller
								name="isRegistrationOpen"
								control={control}
								render={({ field }) => (
									<ToggleField
										label="Registration"
										description="Allow users to register."
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
						</section>

						<section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
							<div>
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									className={inputClassName}
									{...register("name", { required: "Event name is required" })}
								/>
								<FieldError message={errors.name?.message} />
							</div>
							<div>
								<Label htmlFor="category">Category *</Label>
								<Controller
									name="category"
									control={control}
									rules={{ required: "Category is required" }}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id="category"
												className={selectTriggerClassName}
											>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent className={selectContentClassName}>
												{categoryOptions.map((category) => (
													<SelectItem
														key={category}
														value={category}
													>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<FieldError message={errors.category?.message} />
							</div>
							<div>
								<Label htmlFor="mode">Mode *</Label>
								<Controller
									name="mode"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id="mode"
												className={selectTriggerClassName}
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent className={selectContentClassName}>
												<SelectItem value="offline">Offline</SelectItem>
												<SelectItem value="online">Online</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</div>
							<div>
								<Label htmlFor="location">
									Location {eventMode === "offline" ? "*" : ""}
								</Label>
								<Input
									id="location"
									className={inputClassName}
									disabled={eventMode === "online"}
									{...register("location", {
										validate: (value) =>
											eventMode !== "offline" ||
											Boolean(value.trim()) ||
											"Location is required for offline events",
									})}
								/>
								<FieldError message={errors.location?.message} />
							</div>
							<div>
								<Label htmlFor="duration">Duration *</Label>
								<Input
									id="duration"
									className={inputClassName}
									placeholder="2 hours"
									{...register("duration", { required: "Duration is required" })}
								/>
								<FieldError message={errors.duration?.message} />
							</div>
							<div>
								<Label htmlFor="visibility">Visibility *</Label>
								<Controller
									name="visibility"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id="visibility"
												className={selectTriggerClassName}
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent className={selectContentClassName}>
												<SelectItem value="public">Public</SelectItem>
												<SelectItem value="private">Private</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</div>
							<div>
								<Label htmlFor="slots">Slots *</Label>
								<Input
									id="slots"
									type="number"
									min={0}
									className={inputClassName}
									{...register("slots", {
										valueAsNumber: true,
										required: "Slots is required",
										validate: (value) =>
											Number.isFinite(value) || "Slots must be a number",
										min: { value: 0, message: "Slots cannot be negative" },
									})}
								/>
								<FieldError message={errors.slots?.message} />
							</div>
						</section>

							<section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
								<div>
									<Label htmlFor="startDate">Start Date *</Label>
									<Input
										id="startDate"
										type="date"
										className={inputClassName}
										{...register("startDate", { required: "Start date is required" })}
									/>
									<FieldError message={errors.startDate?.message} />
								</div>
								<div>
									<Label htmlFor="startTime">Start Time *</Label>
									<Input
										id="startTime"
										type="time"
										className={inputClassName}
										{...register("startTime", { required: "Start time is required" })}
									/>
									<FieldError message={errors.startTime?.message} />
								</div>
								<div>
									<Label htmlFor="startRegistrationDate">Registration Date *</Label>
									<Input
										id="startRegistrationDate"
										type="date"
										className={inputClassName}
										{...register("startRegistrationDate", {
											required: "Registration start date is required",
										})}
									/>
									<FieldError message={errors.startRegistrationDate?.message} />
								</div>
								<div>
									<Label htmlFor="endDate">End Date</Label>
									<Input
										id="endDate"
										type="date"
										className={inputClassName}
										{...register("endDate")}
									/>
								</div>
							</section>

							<section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
								<div>
									<Label htmlFor="ticketPrice">
										Ticket Price {isPaid ? "*" : ""}
									</Label>
									<Input
										id="ticketPrice"
										type="number"
										min={0}
										disabled={!isPaid}
										className={inputClassName}
										{...register("ticketPrice", {
											valueAsNumber: true,
											validate: (value) =>
												!isPaid ||
												Number.isFinite(value) ||
												"Ticket price must be a number",
											min: {
												value: 0,
												message: "Ticket price cannot be negative",
											},
										})}
									/>
									{!isPaid ? (
										<p className="mt-1 text-xs text-gray-400">
											Turn on Paid to set a ticket price.
										</p>
									) : null}
									<FieldError message={errors.ticketPrice?.message} />
								</div>
								<div>
									<Label htmlFor="totalSeats">Total Seats *</Label>
									<Input
										id="totalSeats"
										type="number"
										min={0}
										className={inputClassName}
										{...register("totalSeats", {
											valueAsNumber: true,
											required: "Total seats is required",
											validate: (value) =>
												Number.isFinite(value) || "Total seats must be a number",
											min: {
												value: 0,
												message: "Total seats cannot be negative",
											},
										})}
									/>
									<FieldError message={errors.totalSeats?.message} />
								</div>
								<div>
									<Label htmlFor="organizerName">Organizer Name</Label>
									<Input
										id="organizerName"
										className={inputClassName}
										{...register("organizerName")}
									/>
								</div>
							</section>

							<section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<div>
									<Label htmlFor="eventDescription">Description</Label>
									<Textarea
										id="eventDescription"
										rows={7}
										className={inputClassName}
										{...register("eventDescription")}
									/>
								</div>
								<div>
									<Label htmlFor="prizes">Prizes</Label>
									<Textarea
										id="prizes"
										rows={7}
										className={inputClassName}
										{...register("prizes")}
									/>
								</div>
							</section>

							<section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<div>
									<Label htmlFor="photographsText">Photograph URLs</Label>
									<Textarea
										id="photographsText"
										rows={5}
										placeholder="One image URL per line"
										className={inputClassName}
										{...register("photographsText")}
									/>
									<div className="mt-3">
										<Label
											htmlFor="photographFiles"
											className="inline-flex items-center gap-2 text-sm text-gray-300"
										>
											<UploadCloud className="h-4 w-4" />
											Upload photographs
										</Label>
										<Input
											id="photographFiles"
											type="file"
											multiple
											accept="image/*"
											className={inputClassName}
											onChange={(event) => {
												addSelectedFiles(event.currentTarget.files, setPhotographFiles);
												event.currentTarget.value = "";
											}}
										/>
										<SelectedFileList
											files={photographFiles}
											label="photograph"
											onRemove={(index) =>
												removeSelectedFile(index, setPhotographFiles)
											}
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="sponserImagesText">Sponsor Image URLs</Label>
									<Textarea
										id="sponserImagesText"
										rows={5}
										placeholder="One image URL per line"
										className={inputClassName}
										{...register("sponserImagesText")}
									/>
									<div className="mt-3">
										<Label
											htmlFor="sponserImageFiles"
											className="inline-flex items-center gap-2 text-sm text-gray-300"
										>
											<UploadCloud className="h-4 w-4" />
											Upload sponsor images
										</Label>
										<Input
											id="sponserImageFiles"
											type="file"
											multiple
											accept="image/*"
											className={inputClassName}
											onChange={(event) => {
												addSelectedFiles(
													event.currentTarget.files,
													setSponserImageFiles,
												);
												event.currentTarget.value = "";
											}}
										/>
										<SelectedFileList
											files={sponserImageFiles}
											label="sponsor image"
											onRemove={(index) =>
												removeSelectedFile(index, setSponserImageFiles)
											}
										/>
									</div>
								</div>
							</section>

							<section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
								<div>
									<Label htmlFor="organizerEmail">Organizer Email</Label>
									<Input
										id="organizerEmail"
										type="email"
										className={inputClassName}
										{...register("organizerEmail")}
									/>
								</div>
								<div>
									<Label htmlFor="organizerContact">Organizer Contact</Label>
									<Input
										id="organizerContact"
										className={inputClassName}
										{...register("organizerContact")}
									/>
								</div>
							</section>

						<div className="flex flex-col gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
							{mode === "edit" ? (
								<Button
									type="button"
									disabled={isDeleting || isSubmitting}
									onClick={handleDelete}
									className="bg-red-600 text-white hover:bg-red-500"
								>
									{isDeleting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
									Remove this event
								</Button>
							) : (
								<span />
							)}
							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
								<Button
									type="button"
									variant="outline"
									className="border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
									onClick={() => router.back()}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting || isDeleting}
									className="bg-purple-700 text-white hover:bg-purple-600"
								>
									{isSubmitting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									{mode === "create" ? "Add Event" : "Save Changes"}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
