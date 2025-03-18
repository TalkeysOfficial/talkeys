"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Globe2,
  UserPlus,
  UserMinus,
  Lightbulb,
  FileText,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Updated Member type:
 * Each member has a name, email, and college.
 */
type Member = {
  name: string;
  email: string;
  college: string;
};

type FormData = {
  teamName: string;
  domain: string;
  members: Member[]; // Now an array of objects with { name, email, college }
  projectTitle: string;
  projectDescription: string;
  contactEmail: string;
  contactPhone?: string;
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

  /**
   * Updated defaultValues to have two members,
   * each with name, email, and college set to empty strings.
   */
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      teamName: "",
      domain: "",
      members: [
        { name: "", email: "", college: "" },
        { name: "", email: "", college: "" },
      ],
      projectTitle: "",
      projectDescription: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const { fields, append, remove } = useFieldArray<FormData, "members">({
    control,
    name: "members",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.BACKEND_URL}/register`, {
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

      alert("Successfully registered!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Registration failed!");
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
          {/* TEAM NAME */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Team Name
            </label>
            <Input
              className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              placeholder="Enter team name"
              {...register("teamName", { required: "Team name is required" })}
            />
            {errors.teamName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.teamName.message}
              </p>
            )}
          </motion.div>

          {/* DOMAIN */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-purple-400" />
              Domain
            </label>
            <select
              className="
                bg-gray-700 text-white w-full 
                rounded-md px-3 py-2 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              {...register("domain", { required: "Domain is required" })}
            >
              <option value="">-- Select a domain --</option>
              <option value="Agritech">Agritech</option>
              <option value="Edtech">Edtech</option>
              <option value="Healthtech">Healthtech</option>
              <option value="Fintech">Fintech</option>
              <option value="E-commerce">E-commerce</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Open Domain">Open Domain</option>
            </select>
            {errors.domain && (
              <p className="text-red-500 text-sm mt-1">
                {errors.domain.message}
              </p>
            )}
          </motion.div>

          {/* TEAM MEMBERS */}
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Team Members (min 2, max 5)
            </label>

            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  className="mb-4 p-3 bg-gray-800/60 rounded-md"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Member Name */}
                  <label className="block mb-1 text-gray-300">
                    Member {index + 1} Name
                  </label>
                  <Input
                    className="
                      bg-gray-700 text-white w-full 
                      mb-2
                      transition-colors duration-300 
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                    "
                    placeholder="Enter member name"
                    {...register(`members.${index}.name`, {
                      required: "Member name is required",
                    })}
                    defaultValue={field.name}
                  />
                  {errors.members?.[index]?.name && (
                    <p className="text-red-500 text-sm mb-2">
                      {errors.members[index].name?.message}
                    </p>
                  )}

                  {/* Member Email */}
                  <label className="block mb-1 text-gray-300">
                    Member {index + 1} Email
                  </label>
                  <Input
                    className="
                      bg-gray-700 text-white w-full 
                      mb-2
                      transition-colors duration-300 
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                    "
                    placeholder="Enter member email"
                    {...register(`members.${index}.email`, {
                      required: "Member email is required",
                    })}
                    defaultValue={field.email}
                  />
                  {errors.members?.[index]?.email && (
                    <p className="text-red-500 text-sm mb-2">
                      {errors.members[index].email?.message}
                    </p>
                  )}

                  {/* Member College */}
                  <label className="block mb-1 text-gray-300">
                    Member {index + 1} College
                  </label>
                  <Input
                    className="
                      bg-gray-700 text-white w-full 
                      mb-2
                      transition-colors duration-300 
                      focus:outline-none focus:ring-2 focus:ring-purple-500
                    "
                    placeholder="Enter member college"
                    {...register(`members.${index}.college`, {
                      required: "Member college is required",
                    })}
                    defaultValue={field.college}
                  />
                  {errors.members?.[index]?.college && (
                    <p className="text-red-500 text-sm mb-2">
                      {errors.members[index].college?.message}
                    </p>
                  )}

                  {/* Remove button if more than 2 members */}
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      className="
                        bg-gradient-to-r from-red-600 to-pink-600 
                        hover:from-red-700 hover:to-pink-700 
                        transition-transform duration-300 hover:scale-105
                      "
                      onClick={() => remove(index)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Member button if fields.length < 5 */}
            {fields.length < 5 && (
              <Button
                type="button"
                className="
                  bg-gradient-to-r from-green-600 to-lime-600 
                  hover:from-green-700 hover:to-lime-700 
                  transition-transform duration-300 hover:scale-105
                "
                onClick={() => append({ name: "", email: "", college: "" })}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Add Member
              </Button>
            )}
          </motion.div>

          {/* PROJECT TITLE */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              Project Title
            </label>
            <Input
              className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              placeholder="Enter project title"
              {...register("projectTitle", {
                required: "Project title is required",
              })}
            />
            {errors.projectTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectTitle.message}
              </p>
            )}
          </motion.div>

          {/* PROJECT DESCRIPTION */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Project Description
            </label>
            <Textarea
              className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              placeholder="Enter project description"
              {...register("projectDescription", {
                required: "Project description is required",
              })}
            />
            {errors.projectDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectDescription.message}
              </p>
            )}
          </motion.div>

          {/* CONTACT EMAIL */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Contact Email
            </label>
            <Input
              className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              placeholder="Enter contact email"
              {...register("contactEmail", {
                required: "Contact email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactEmail.message}
              </p>
            )}
          </motion.div>

          {/* CONTACT PHONE (Optional) */}
          <motion.div variants={itemVariants}>
            <label className="block mb-1 text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              Contact Phone (optional)
            </label>
            <Input
              className="
                bg-gray-700 text-white w-full 
                transition-colors duration-300 
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
              placeholder="Enter contact phone"
              {...register("contactPhone")}
            />
          </motion.div>

          {/* SUBMIT BUTTON */}
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
}
