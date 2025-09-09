"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { Users, Globe2, Phone, Lightbulb, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Member = {
  name: string;
  email: string;
  college: string;
};

type FormData = {
  teamName: string;
  domain: string;
  members: Member[];
  projectTitle: string;
  projectDescription: string;
  contactEmail: string;
  contactPhone?: string;
=======
import {
	Users,
	Globe2,
	Lightbulb,
	Phone,
	ArrowUpRight,
	NotepadText,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND_URL = process.env.BACKEND_URL;

type FormData = {
	name: string;
	instaId: string;
	phone: string;
	followersCount: number;
	attendance: string;
>>>>>>> 4f8e7b96cc28e9d6a051cb55aa1ef961929e0fea
};

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 50,
			damping: 10,
			delayChildren: 0.2,
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 50, damping: 10 },
	},
};

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	console.log("Backend URL:", BACKEND_URL);

<<<<<<< HEAD
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      teamName: "",
      domain: "",
      members: [],
      projectTitle: "",
      projectDescription: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`https://api.talkeys.xyz/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      await response.json();
      alert("Successfully registered!");
    } catch (error) {
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center pt-24 pb-10 px-4">
      <motion.div
        className="w-full max-w-lg mx-auto p-6 bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/30 border border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight"
          variants={itemVariants}
        >
          Register for the Event
        </motion.h1>

        <motion.p className="text-center text-gray-300 mb-8" variants={itemVariants}>
          Fill out the form below to register.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Name
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
              {...register("teamName", { required: "Name is required" })}
            />
            {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-400" />
              Insta id
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="@yourhandle"
              {...register("domain", { required: "Insta id is required" })}
            />
            {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              Phone number
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter phone number"
              {...register("contactPhone", { required: "Phone number is required" })}
            />
            {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              Follower count
            </label>
            <Input
              type="number"
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 12000"
              {...register("projectTitle", { required: "Follower count is required" })}
            />
            {errors.projectTitle && <p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Will you be able to attend the event on 11th August?
            </label>
            <select
              className="bg-gray-700 text-white w-full rounded-md px-3 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("projectDescription", { required: "Please select an option" })}
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </select>
            {errors.projectDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.projectDescription.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-md transition-transform duration-300 hover:scale-105"
            >
              {loading ? "Submitting..." : "Submit"}
              {!loading && <ArrowUpRight className="w-4 h-4" />}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
=======
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			name: "",
			instaId: "",
			phone: "",
			followersCount: 0,
			attendance: "yes",
		},
	});

	const onSubmit = async (data: FormData) => {
		setLoading(true);

		try {
			const token = localStorage.getItem("accessToken");

			if (!token) {
				toast.error("No access token found. Please log in first.");
				return;
			}

			console.log("Submitting form with data:", data);
			console.log("Token:", token);
			const response = await fetch(`${BACKEND_URL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const responseData = await response.json();
			console.log("Server response:", responseData);

			toast.success("Successfully registered!");
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Registration failed!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="
        min-h-screen 
        bg-gradient-to-br from-black via-gray-900 to-purple-900 
        text-white 
        flex flex-col items-center 
        pt-24 pb-10 px-4
      "
		>
			<motion.div
				className="
          w-full max-w-lg mx-auto 
          p-6 
          bg-gray-900/70 
          backdrop-blur-md 
          rounded-2xl 
          shadow-2xl shadow-purple-500/30 
          border border-gray-700
        "
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<motion.h1
					className="
            text-4xl font-extrabold 
            text-center mb-2 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
            tracking-tight
          "
					variants={itemVariants}
				>
					Register for the Event
				</motion.h1>

				<motion.p
					className="text-center text-gray-300 mb-8"
					variants={itemVariants}
				>
					Fill out the form below to register your team.
				</motion.p>

				<motion.form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={itemVariants}>
						<label className="mb-1 text-gray-300 flex items-center gap-2">
							<Users className="w-4 h-4 text-purple-400" />
							Name
						</label>
						<Input
							className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
							placeholder="Enter team name"
							{...register("name", {
								required: "Name is required",
							})}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</motion.div>

					<motion.div variants={itemVariants}>
						<label className="mb-1 text-gray-300 flex items-center gap-2">
							<Globe2 className="w-4 h-4 text-purple-400" />
							Instagram Id
						</label>
						<Input
							className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
							placeholder="Enter Instagram Id"
							{...register("instaId", {
								required: "Instagram Id is required",
							})}
						/>
						{errors.instaId && (
							<p className="text-red-500 text-sm mt-1">
								{errors.instaId.message}
							</p>
						)}
					</motion.div>

					<motion.div variants={itemVariants}>
						<label className="mb-1 text-gray-300 flex items-center gap-2">
							<Phone className="w-4 h-4 text-purple-400" />
							Phone Number
						</label>
						<Input
							className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
							placeholder="Enter Phone Number"
							{...register("phone", {
								required: "Phone number is required",
							})}
						/>
						{errors.phone && (
							<p className="text-red-500 text-sm mt-1">
								{errors.phone.message}
							</p>
						)}
					</motion.div>

					<motion.div variants={itemVariants}>
						<label className="mb-1 text-gray-300 flex items-center gap-2">
							<Lightbulb className="w-4 h-4 text-purple-400" />
							Followers Count
						</label>
						<Input
							className="
                bg-gray-700 text-white w-full   
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
							placeholder="Enter Followers Count"
							{...register("followersCount", {
								required: "Followers count is required",
								valueAsNumber: true,
								min: {
									value: 5000,
									message: "Followers count must be at least 5000",
								},
							})}
						/>
						{errors.followersCount && (
							<p className="text-red-500 text-sm mt-1">
								{errors.followersCount.message}
							</p>
						)}
					</motion.div>

					<motion.div variants={itemVariants}>
						<label className="mb-1 text-gray-300 flex items-center gap-2">
							<NotepadText className="w-4 h-4 text-purple-400" />
							Will you be able to attend the event on September 11th?
						</label>
						<select
							className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
							defaultValue="yes"
							{...register("attendance", {
								required: "Attendance answer is required",
							})}
						>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
						{errors.attendance && (
							<p className="text-red-500 text-sm mt-1">
								{errors.attendance.message}
							</p>
						)}
					</motion.div>

					<motion.div variants={itemVariants}>
						<Button
							type="submit"
							disabled={loading}
							className="
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:from-purple-700 hover:to-indigo-700 
                w-full flex items-center justify-center gap-2 py-3 mt-2
                rounded-md
                transition-transform duration-300 hover:scale-105
              "
						>
							{loading ? "Submitting..." : "Submit"}
							{!loading && <ArrowUpRight className="w-4 h-4" />}
						</Button>
					</motion.div>
				</motion.form>
			</motion.div>
		</div>
	);
>>>>>>> 4f8e7b96cc28e9d6a051cb55aa1ef961929e0fea
}
