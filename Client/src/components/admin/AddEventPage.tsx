"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import type { FormData } from "@/types/types";

const AddEventPage: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm<FormData>({
		defaultValues: {
			isTeamEvent: false,
			isPaid: false,
			isLive: false,
			category: "other",
			mode: "offline",
			visibility: "public",
			slots: 1,
			registrationCount: 0,
			name: "<NONE>",
			duration: "Variable",
			startDate: new Date().toString(),
			startTime: new Date().getTime().toString(),
			startRegistrationDate: new Date().toString(),
			totalSeats: 0,
			photographs: null,
			prizes: undefined,
			eventDescription: undefined,
			paymentQRcode: undefined,
			registrationLink: undefined,
			sponsorImages: null,
			organizerName: undefined,
			organizerEmail: "achatrath@thapar.edu",
			organizerContact: undefined,
			location: "",
			ticketPrice: 0,
		},
	});

	const isPaid = watch("isPaid");
	const mode = watch("mode");

	const onSubmit = async (data: FormData) => {
		const uploadToCloudinary = async (files: FileList | null) => {
			if (!files) return [];
			const uploadedFiles: string[] = [];

			for (const file of Array.from(files)) {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("upload_preset", "talkeys");

				try {
					const response = await fetch(
						`https://api.cloudinary.com/v1_1/drvoynt07/image/upload`,
						{
							method: "POST",
							body: formData,
						},
					);
					const result = await response.json();
					uploadedFiles.push(result.secure_url);
				} catch (error) {
					console.error("Error uploading to Cloudinary", error);
				}
			}

			return uploadedFiles;
		};

		try {
			const photographsUrls = await uploadToCloudinary(data.photographs);
			const sponsorImagesUrls = await uploadToCloudinary(data.sponsorImages);

			const eventData = {
				...data,
				photographs: photographsUrls,
				sponsorImages: sponsorImagesUrls,
			};

			const response = await fetch(`${process.env.BACKEND_URL}/addEvent`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(eventData),
			});

			if (response.ok) {
				reset();
				alert("Event added successfully!");
			} else {
				console.error("Failed to add event");
			}
		} catch (error) {
			alert("Could Not add Event");
			alert(error);
		}
	};

	const formAnimation = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	const inputAnimation = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={formAnimation}
			className="container mx-auto px-4 py-8"
		>
			<Card className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
				<CardHeader>
					<CardTitle>Add New Event</CardTitle>
					<CardDescription>
						Fill in the details to create a new event.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<motion.div
							variants={inputAnimation}
							className="grid grid-cols-1 md:grid-cols-3 gap-4"
						>
							<div className="flex items-center space-x-2">
								<Controller
									name="isTeamEvent"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="isTeamEvent"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Label htmlFor="isTeamEvent">Team Event</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Controller
									name="isPaid"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="isPaid"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Label htmlFor="isPaid">Paid Event</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Controller
									name="isLive"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="isLive"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Label htmlFor="isLive">Live Event</Label>
							</div>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="name">Name *</Label>
							<Controller
								name="name"
								control={control}
								rules={{ required: "Event name is required" }}
								render={({ field }) => (
									<Input
										id="name"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.name && (
								<span className="text-red-500 text-sm">
									{errors.name.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="category">Category *</Label>
							<Controller
								name="category"
								control={control}
								rules={{ required: "Category is required" }}
								render={({ field }) => (
									<Input
										id="category"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.category && (
								<span className="text-red-500 text-sm">
									{errors.category.message}
								</span>
							)}
						</motion.div>

						{isPaid && (
							<motion.div variants={inputAnimation}>
								<Label htmlFor="ticketPrice">Ticket Price *</Label>
								<Controller
									name="ticketPrice"
									control={control}
									rules={{
										required:
											"Ticket price is required for paid events",
									}}
									render={({ field }) => (
										<Input
											id="ticketPrice"
											type="number"
											{...field}
											className="mt-1 bg-gray-800"
										/>
									)}
								/>
								{errors.ticketPrice && (
									<span className="text-red-500 text-sm">
										{errors.ticketPrice.message}
									</span>
								)}
							</motion.div>
						)}

						<motion.div variants={inputAnimation}>
							<Label htmlFor="mode">Mode *</Label>
							<Controller
								name="mode"
								control={control}
								rules={{ required: "Mode is required" }}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-full bg-gray-800">
											<SelectValue placeholder="Select event mode" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectItem value="offline">
												Offline
											</SelectItem>
											<SelectItem value="online">Online</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.mode && (
								<span className="text-red-500 text-sm">
									{errors.mode.message}
								</span>
							)}
						</motion.div>

						{mode === "offline" && (
							<motion.div variants={inputAnimation}>
								<Label htmlFor="location">Location *</Label>
								<Controller
									name="location"
									control={control}
									rules={{
										required:
											"Location is required for offline events",
									}}
									render={({ field }) => (
										<Input
											id="location"
											{...field}
											className="mt-1 bg-gray-800"
										/>
									)}
								/>
								{errors.location && (
									<span className="text-red-500 text-sm">
										{errors.location.message}
									</span>
								)}
							</motion.div>
						)}

						<motion.div variants={inputAnimation}>
							<Label htmlFor="duration">Duration *</Label>
							<Controller
								name="duration"
								control={control}
								rules={{ required: "Duration is required" }}
								render={({ field }) => (
									<Input
										id="duration"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.duration && (
								<span className="text-red-500 text-sm">
									{errors.duration.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="slots">Slots *</Label>
							<Controller
								name="slots"
								control={control}
								rules={{ required: "Number of slots is required" }}
								render={({ field }) => (
									<Input
										id="slots"
										type="number"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.slots && (
								<span className="text-red-500 text-sm">
									{errors.slots.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="visibility">Visibility *</Label>
							<Controller
								name="visibility"
								control={control}
								rules={{ required: "Visibility is required" }}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger className="w-full bg-gray-800">
											<SelectValue placeholder="Select visibility" />
										</SelectTrigger>
										<SelectContent className="bg-white">
											<SelectItem value="public">Public</SelectItem>
											<SelectItem value="private">
												Private
											</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.visibility && (
								<span className="text-red-500 text-sm">
									{errors.visibility.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="startDate">Start Date *</Label>
							<Controller
								name="startDate"
								control={control}
								rules={{ required: "Start date is required" }}
								render={({ field }) => (
									<Input
										id="startDate"
										type="date"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.startDate && (
								<span className="text-red-500 text-sm">
									{errors.startDate.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="startTime">Start Time *</Label>
							<Controller
								name="startTime"
								control={control}
								rules={{ required: "Start time is required" }}
								render={({ field }) => (
									<Input
										id="startTime"
										type="time"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.startTime && (
								<span className="text-red-500 text-sm">
									{errors.startTime.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="startRegistrationDate">
								Start Registration Date *
							</Label>
							<Controller
								name="startRegistrationDate"
								control={control}
								rules={{
									required: "Start registration date is required",
								}}
								render={({ field }) => (
									<Input
										id="startRegistrationDate"
										type="date"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.startRegistrationDate && (
								<span className="text-red-500 text-sm">
									{errors.startRegistrationDate.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="totalSeats">Total Seats *</Label>
							<Controller
								name="totalSeats"
								control={control}
								rules={{ required: "Total seats is required" }}
								render={({ field }) => (
									<Input
										id="totalSeats"
										type="number"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
							{errors.totalSeats && (
								<span className="text-red-500 text-sm">
									{errors.totalSeats.message}
								</span>
							)}
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="photographs">Photographs</Label>
							<Controller
								name="photographs"
								control={control}
								render={({ field }) => (
									<Input
										id="photographs"
										type="file"
										multiple
										onChange={(e) => field.onChange(e.target.files)}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="prizes">Prizes</Label>
							<Controller
								name="prizes"
								control={control}
								render={({ field }) => (
									<Textarea
										id="prizes"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="eventDescription">Event Description</Label>
							<Controller
								name="eventDescription"
								control={control}
								render={({ field }) => (
									<Textarea
										id="eventDescription"
										{...field}
										className="mt-1 bg-gray-800"
										rows={4}
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="paymentQRcode">Payment QR Code</Label>
							<Controller
								name="paymentQRcode"
								control={control}
								render={({ field }) => (
									<Input
										id="paymentQRcode"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="registrationLink">Registration Link</Label>
							<Controller
								name="registrationLink"
								control={control}
								render={({ field }) => (
									<Input
										id="registrationLink"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="sponsorImages">Sponsor Images</Label>
							<Controller
								name="sponsorImages"
								control={control}
								render={({ field }) => (
									<Input
										id="sponsorImages"
										type="file"
										multiple
										onChange={(e) => field.onChange(e.target.files)}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="organizerName">Organizer Name</Label>
							<Controller
								name="organizerName"
								control={control}
								render={({ field }) => (
									<Input
										id="organizerName"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="organizerEmail">Organizer Email</Label>
							<Controller
								name="organizerEmail"
								control={control}
								render={({ field }) => (
									<Input
										id="organizerEmail"
										type="email"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>

						<motion.div variants={inputAnimation}>
							<Label htmlFor="organizerContact">Organizer Contact</Label>
							<Controller
								name="organizerContact"
								control={control}
								render={({ field }) => (
									<Input
										id="organizerContact"
										{...field}
										className="mt-1 bg-gray-800"
									/>
								)}
							/>
						</motion.div>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						onClick={handleSubmit(onSubmit)}
						className="w-full bg-transparent border border-white duration-300 hover:bg-purple-700"
					>
						Add Event
					</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default AddEventPage;
