"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Users, Phone, ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND_URL = process.env.BACKEND_URL;


type FormData = {
  name: string;
  email: string;
  phone: string;
  instaId: string;
  followersCount: number;
  attendance: "yes" | "no";
};

const containerVariants: Variants = {
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

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 10 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 50, damping: 10 },
	},
};

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      instaId: "",
      followersCount: 0,
      attendance: "yes",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (!BACKEND_URL) {
        throw new Error("BACKEND_URL is not configured");
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          instaId: data.instaId,
          phone: data.phone,
          followersCount: Number(data.followersCount),
          attendance: data.attendance,
        }),
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
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Email id
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Instagram ID
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="@yourhandle"
              {...register("instaId", { required: "Instagram ID is required" })}
            />
            {errors.instaId && <p className="text-red-500 text-sm mt-1">{errors.instaId.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Followers Count
            </label>
            <Input
              type="number"
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="5000"
              {...register("followersCount", {
                required: "Followers count is required",
                min: {
                  value: 5000,
                  message: "Followers count must be at least 5000",
                },
                valueAsNumber: true,
              })}
            />
            {errors.followersCount && <p className="text-red-500 text-sm mt-1">{errors.followersCount.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              Phone number
            </label>
            <Input
              className="bg-gray-700 text-white w-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter phone number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(\+91)?\d{10}$/,
                  message: "Enter a valid 10 digit phone number",
                },
              })}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300">
              Will you attend?
            </label>
            <select
              className="bg-gray-700 text-white w-full rounded-md px-3 py-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("attendance", { required: true })}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
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
}
