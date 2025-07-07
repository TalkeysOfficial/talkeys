"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Upload,
  CalendarDays,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CreateEventFormData = {
  // Section 1
  organizerName: string;
  organizerEmail: string;
  organizerContact: string;
  organizationName: string;
  cityState: string;
  socialLinks: string;
  verificationDoc: FileList;
  // Section 2
  eventName: string;
  eventType: string;
  eventCategory: string;
  eventDescription: string;
  eventBanner: FileList;
  // Section 3
  eventDates: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  maxAttendees: number;
  venueName: string;
  venueAddress: string;
  gmapLink: string;
  specialEntryInstructions: string;
  onlinePlatform: string;
  willRecord: string;
  // Section 4
  isPaid: string;
  discountsOffered: string;
  qrCheckIn: string;
  refundPolicy: string;
  // Section 4.1
  ticketPricingStructure: string;
  ticketCategories: string;
  pricePerCategory: string;
  bookingLimit: string;
  ticketSalesStart: string;
  ticketSalesEnd: string;
  allowOnsiteBookings: string;
  showSoldOut: string;
  havePromos: string;
  promoCodeName: string;
  promoDiscountType: string;
  applicableTicketCategories: string;
  ticketInclusions: string;
  addOns: string;
  showTicketsLeft: string;
  emailQrTicket: string;
  showAttendeeDetails: string;
  // Section 5
  enableCommunityChat: string;
  hasSponsors: string;
  sponsorNames: string;
  sponsorImages: FileList;
  expectedAudience: string;
  eventDeck: FileList;
  // Section 6
  agreeAccurateInfo: boolean;
  agreeTerms: boolean;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 10, delayChildren: 0.2, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 10 } },
};

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,             // modification: imported trigger
    formState: { errors },
  } = useForm<CreateEventFormData>({
    defaultValues: {
      organizerName: "",
      organizerEmail: "",
      organizerContact: "",
      organizationName: "",
      cityState: "",
      socialLinks: "",
      verificationDoc: undefined!,
      eventName: "",
      eventType: "",
      eventCategory: "",
      eventDescription: "",
      eventBanner: undefined!,
      eventDates: "",
      startTime: "",
      endTime: "",
      registrationDeadline: "",
      maxAttendees: 0,
      venueName: "",
      venueAddress: "",
      gmapLink: "",
      specialEntryInstructions: "",
      onlinePlatform: "",
      willRecord: "",
      isPaid: "Free",
      discountsOffered: "",
      qrCheckIn: "",
      refundPolicy: "",
      ticketPricingStructure: "",
      ticketCategories: "",
      pricePerCategory: "",
      bookingLimit: "",
      ticketSalesStart: "",
      ticketSalesEnd: "",
      allowOnsiteBookings: "",
      showSoldOut: "",
      havePromos: "",
      promoCodeName: "",
      promoDiscountType: "",
      applicableTicketCategories: "",
      ticketInclusions: "",
      addOns: "",
      showTicketsLeft: "",
      emailQrTicket: "",
      showAttendeeDetails: "",
      enableCommunityChat: "",
      hasSponsors: "",
      sponsorNames: "",
      sponsorImages: undefined!,
      expectedAudience: "",
      eventDeck: undefined!,
      agreeAccurateInfo: false,
      agreeTerms: false,
    },
  });

  const eventType = watch("eventType");
  const isPaidEvent = watch("isPaid") === "Paid";
  const hasPromos = watch("havePromos") === "Yes";
  const hasSponsors = watch("hasSponsors") === "Yes";

  const onSubmit = async (data: CreateEventFormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:3001/event/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      alert("Event created successfully!");
    } catch {
      alert("Event creation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let valid = false;
  
    if (currentStep === 1) {
      const fields: Array<keyof CreateEventFormData> = [
        "organizerName",
        "organizerEmail",
        "organizerContact",
        "organizationName",
        "cityState",
        "socialLinks",
        "verificationDoc",
      ];
      valid = await trigger(fields);
    } else if (currentStep === 2) {
      const fields: Array<keyof CreateEventFormData> = [
        "eventName",
        "eventType",
        "eventCategory",
        "eventDescription",
        "eventBanner",
      ];
      valid = await trigger(fields);
    } else if (currentStep === 3) {
      const fields: Array<keyof CreateEventFormData> = [
        "eventDates",
        "startTime",
        "endTime",
        "registrationDeadline",
        "maxAttendees",
      ];
      if (eventType === "Offline") {
        fields.push(
          "venueName",
          "venueAddress",
          "gmapLink",
          "specialEntryInstructions"
        );
      }
      if (eventType === "Online") {
        fields.push("onlinePlatform", "willRecord");
      }
      valid = await trigger(fields);
    } else if (currentStep === 4) {
      const fields: Array<keyof CreateEventFormData> = [
        "isPaid",
        "discountsOffered",
        "qrCheckIn",
        "refundPolicy",
      ];
      if (isPaidEvent) {
        fields.push(
          "ticketPricingStructure",
          "ticketCategories",
          "pricePerCategory",
          "bookingLimit",
          "ticketSalesStart",
          "ticketSalesEnd",
          "allowOnsiteBookings",
          "showSoldOut",
          "havePromos"
        );
        if (hasPromos) {
          fields.push(
            "promoCodeName",
            "promoDiscountType",
            "applicableTicketCategories"
          );
        }
        fields.push(
          "ticketInclusions",
          "addOns",
          "showTicketsLeft",
          "emailQrTicket",
          "showAttendeeDetails"
        );
      }
      valid = await trigger(fields);
    } else if (currentStep === 5) {
      const fields: Array<keyof CreateEventFormData> = [
        "enableCommunityChat",
        "hasSponsors",
      ];
      if (hasSponsors) {
        fields.push("sponsorNames", "sponsorImages");
      }
      fields.push("expectedAudience", "eventDeck");
      valid = await trigger(fields);
    }
  
    if (valid) {
      setCurrentStep((p) => p + 1);
    }
  };
  

  const goBack = () => {
    setCurrentStep((p) => p - 1);
  };
  const maxStep = 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col items-center pt-24 pb-10 px-4">
      <motion.div
        className="w-full max-w-3xl mx-auto p-6 bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/30 border border-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-tight"
          variants={itemVariants}
        >
          Create Your Event
        </motion.h1>
        <motion.p className="text-center text-gray-300 mb-8" variants={itemVariants}>
          Step {currentStep} of {maxStep}
        </motion.p>

        <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence mode="wait">

            {currentStep === 1 && (
              <motion.div key="step1" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">1. Basic Organizer Information</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Organizer Name</label>
                  <Input {...register("organizerName", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Enter organizer name" />
                  {errors.organizerName && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" /> Email Address
                  </label>
                  <Input {...register("organizerEmail", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Enter email" />
                  {errors.organizerEmail && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400" /> Contact Number
                  </label>
                  <Input {...register("organizerContact", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Enter contact number" />
                  {errors.organizerContact && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Organization / Society Name</label>
                  <Input {...register("organizationName", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Enter organization name" />
                  {errors.organizationName && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">City & State</label>
                  <Input {...register("cityState", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. Patiala, Punjab" />
                  {errors.cityState && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Social Media Links</label>
                  <Input {...register("socialLinks", { required: true })} className="bg-gray-700 text-white w-full" placeholder="https://instagram.com/..." />
                  {errors.socialLinks && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" /> Upload Verification Document
                  </label>
                  <input {...register("verificationDoc", { required: true })} type="file" className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                  {errors.verificationDoc && <p className="text-red-500 text-sm">Required</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">2. Event Information</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Name</label>
                  <Input {...register("eventName", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Enter event name" />
                  {errors.eventName && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Type</label>
                  <select {...register("eventType", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="">-- Select an option --</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                  {errors.eventType && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Category</label>
                  <Input {...register("eventCategory", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Concert, Gaming, Workshop, etc." />
                  {errors.eventCategory && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Description</label>
                  <Textarea {...register("eventDescription", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Short and clear explanation" />
                  {errors.eventDescription && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" /> Event Banner / Poster
                  </label>
                  <input {...register("eventBanner", { required: true })} type="file" className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                  {errors.eventBanner && <p className="text-red-500 text-sm">Required</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">3. Event Timing & Logistics</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-400" /> Event Date(s)
                  </label>
                  <Input {...register("eventDates", { required: true })} className="bg-gray-700 text-white w-full" placeholder="2023-12-25 or comma separated" />
                  {errors.eventDates && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> Start Time
                  </label>
                  <Input type="time" {...register("startTime", { required: true })} className="bg-gray-700 text-white w-full" />
                  {errors.startTime && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> End Time
                  </label>
                  <Input type="time" {...register("endTime", { required: true })} className="bg-gray-700 text-white w-full" />
                  {errors.endTime && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Registration Deadline</label>
                  <Input type="date" {...register("registrationDeadline", { required: true })} className="bg-gray-700 text-white w-full" />
                  {errors.registrationDeadline && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Max No. of Attendees</label>
                  <Input type="number" {...register("maxAttendees", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. 200" />
                  {errors.maxAttendees && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {eventType === "Offline" && (
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-lg">Offline Details</h3>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Venue Name</label>
                      <Input {...register("venueName", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. Community Hall" />
                      {errors.venueName && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Full Address</label>
                      <Textarea {...register("venueAddress", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Street, City, State, Zipcode" />
                      {errors.venueAddress && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Google Maps Link</label>
                      <Input {...register("gmapLink", { required: true })} className="bg-gray-700 text-white w-full" placeholder="https://maps.google.com/..." />
                      {errors.gmapLink && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Special Entry Instructions</label>
                      <Input {...register("specialEntryInstructions", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. show college ID at gate" />
                      {errors.specialEntryInstructions && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                  </div>
                )}

                {eventType === "Online" && (
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-lg">Online Details</h3>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Platform Used</label>
                      <Input {...register("onlinePlatform", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. Zoom" />
                      {errors.onlinePlatform && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Will this be recorded?</label>
                      <select {...register("willRecord", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="">-- Select an option --</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {errors.willRecord && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">4. Ticketing & Access</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Is the Event Free or Paid?</label>
                  <select {...register("isPaid", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                  {errors.isPaid && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Any Discounts?</label>
                  <select {...register("discountsOffered", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {errors.discountsOffered && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Enable QR-based check-in?</label>
                  <select {...register("qrCheckIn", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {errors.qrCheckIn && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Refund Policy</label>
                  <select {...register("refundPolicy", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="">-- Select an option --</option>
                    <option value="No Refund">No Refund</option>
                    <option value="Partial">Partial</option>
                    <option value="Full">Full</option>
                  </select>
                  {errors.refundPolicy && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {isPaidEvent && (
                  <motion.div className="bg-gray-800/60 p-4 rounded-md mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-bold mb-4">4.1 Paid Event Details</h3>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Pricing Structure</label>
                      <Input {...register("ticketPricingStructure", { required: true })} className="bg-gray-700 text-white w-full" placeholder="Describe pricing or tiers" />
                      {errors.ticketPricingStructure && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Categories</label>
                      <Input {...register("ticketCategories", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. General, VIP" />
                      {errors.ticketCategories && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Price per Category</label>
                      <Input {...register("pricePerCategory", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. General: 500" />
                      {errors.pricePerCategory && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Booking Limit per Person</label>
                      <Input {...register("bookingLimit", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. Max 2 tickets" />
                      {errors.bookingLimit && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Sales Start</label>
                      <Input type="datetime-local" {...register("ticketSalesStart", { required: true })} className="bg-gray-700 text-white w-full" />
                      {errors.ticketSalesStart && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Sales End</label>
                      <Input type="datetime-local" {...register("ticketSalesEnd", { required: true })} className="bg-gray-700 text-white w-full" />
                      {errors.ticketSalesEnd && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Allow spot bookings?</label>
                      <select {...register("allowOnsiteBookings", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.allowOnsiteBookings && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Show "sold out" status?</label>
                      <select {...register("showSoldOut", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.showSoldOut && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Have promotional offers?</label>
                      <select {...register("havePromos", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.havePromos && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    {hasPromos && (
                      <div className="space-y-4 mb-4 mt-2">
                        <label className="block mb-1 text-gray-300">Promo Code Name</label>
                        <Input {...register("promoCodeName", { required: true })} className="bg-gray-700 text-white w-full" />
                        {errors.promoCodeName && <p className="text-red-500 text-sm">Required</p>}
                        <label className="block mb-1 text-gray-300">Discount Type</label>
                        <Input {...register("promoDiscountType", { required: true })} className="bg-gray-700 text-white w-full" />
                        {errors.promoDiscountType && <p className="text-red-500 text-sm">Required</p>}
                        <label className="block mb-1 text-gray-300">Applicable Ticket Categories</label>
                        <Input {...register("applicableTicketCategories", { required: true })} className="bg-gray-700 text-white w-full" />
                        {errors.applicableTicketCategories && <p className="text-red-500 text-sm">Required</p>}
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Inclusions</label>
                      <Input {...register("ticketInclusions", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. refreshments" />
                      {errors.ticketInclusions && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Add-ons</label>
                      <Input {...register("addOns", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. parking" />
                      {errors.addOns && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Show tickets left?</label>
                      <select {...register("showTicketsLeft", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.showTicketsLeft && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Email & QR ticket?</label>
                      <select {...register("emailQrTicket", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.emailQrTicket && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Include attendee details?</label>
                      <select {...register("showAttendeeDetails", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      {errors.showAttendeeDetails && <p className="text-red-500 text-sm">Required</p>}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div key="step5" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">5. Additional Features</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Enable Community Chat?</label>
                  <select {...register("enableCommunityChat", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {errors.enableCommunityChat && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Any sponsors or partners?</label>
                  <select {...register("hasSponsors", { required: true })} className="bg-gray-700 text-white w-full rounded-md px-3 py-2">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  {errors.hasSponsors && <p className="text-red-500 text-sm">Required</p>}
                </div>
                {hasSponsors && (
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-300">Sponsor Names</label>
                    <Input {...register("sponsorNames", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. XYZ Brand" />
                    {errors.sponsorNames && <p className="text-red-500 text-sm">Required</p>}
                    <label className="block mb-1 text-gray-300 mt-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-purple-400" /> Upload Sponsor Logos
                    </label>
                    <input {...register("sponsorImages", { required: true })} type="file" multiple className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    {errors.sponsorImages && <p className="text-red-500 text-sm">Required</p>}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Expected Audience Type</label>
                  <Input {...register("expectedAudience", { required: true })} className="bg-gray-700 text-white w-full" placeholder="e.g. College Students" />
                  {errors.expectedAudience && <p className="text-red-500 text-sm">Required</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" /> Upload Event Deck / Proposal
                  </label>
                  <input {...register("eventDeck", { required: true })} type="file" className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                  {errors.eventDeck && <p className="text-red-500 text-sm">Required</p>}
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div key="step6" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">6. Agreement & Submission</h2>
                <div className="mb-4 flex items-center gap-2">
                  <input type="checkbox" {...register("agreeAccurateInfo", { required: true })} className="h-4 w-4 text-purple-600" />
                  <label className="text-gray-300 text-sm">I confirm all information is accurate.</label>
                </div>
                {errors.agreeAccurateInfo && <p className="text-red-500 text-sm mb-2">Required</p>}
                <div className="mb-6 flex items-center gap-2">
                  <input type="checkbox" {...register("agreeTerms", { required: true })} className="h-4 w-4 text-purple-600" />
                  <label className="text-gray-300 text-sm">
                    I agree to abide by{" "}
                    <Link href="/t&c" className="text-purple-400 underline hover:text-purple-300 transition-colors">
                      terms and privacy policy
                    </Link>.
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-sm mb-2">Required</p>}
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full flex items-center justify-center gap-2 py-3 rounded-md transition-transform duration-300 hover:scale-105">
                  {loading ? "Submitting..." : "Submit"} {!loading && <ArrowUpRight className="w-4 h-4" />}
                </Button>
              </motion.div>
            )}


          </AnimatePresence>
        </motion.form>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button type="button" onClick={goBack} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
          )}
          {currentStep < maxStep && (
            <Button type="button" onClick={handleNext} className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
