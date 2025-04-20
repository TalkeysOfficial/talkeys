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
  CheckCircle,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Ticket,
  Tag,
  PlusCircle,
  FileText,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CreateEventFormData = {
  organizerName: string;
  organizerEmail: string;
  organizerContact: string;
  organizationName?: string;
  cityState?: string;
  socialLinks?: string;
  verificationDoc?: FileList;

  eventName: string;
  eventType: string;          
  eventCategory: string;      
  eventDescription: string;
  eventBanner?: FileList;

  eventDates: string;       
  startTime: string;
  endTime: string;
  registrationDeadline?: string;
  maxAttendees?: number;

  venueName?: string;
  venueAddress?: string;
  gmapLink?: string;
  specialEntryInstructions?: string;

  onlinePlatform?: string;
  willRecord?: string;       
  isPaid: string;             
  discountsOffered?: string;  
  qrCheckIn?: string;         
  refundPolicy?: string;      

  ticketPricingStructure?: string;
  ticketCategories?: string;
  pricePerCategory?: string;
  bookingLimit?: string;
  ticketSalesStart?: string;
  ticketSalesEnd?: string;
  allowOnsiteBookings?: string;
  showSoldOut?: string;

  havePromos?: string; 
  promoCodeName?: string;
  promoDiscountType?: string;
  applicableTicketCategories?: string;

  ticketInclusions?: string;
  addOns?: string;
  showTicketsLeft?: string;
  emailQrTicket?: string;
  showAttendeeDetails?: string;

  enableCommunityChat?: string; 
  hasSponsors?: string;          
  sponsorNames?: string;
  sponsorImages?: FileList;
  expectedAudience?: string;
  eventDeck?: FileList;

  agreeAccurateInfo?: boolean;
  agreeTerms?: boolean;
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

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    defaultValues: {
      organizerName: "",
      organizerEmail: "",
      organizerContact: "",
      organizationName: "",
      cityState: "",
      socialLinks: "",
      // ...
      isPaid: "Free", 
      // ...
      agreeAccurateInfo: false,
      agreeTerms: false,
    },
  });
  const eventType = watch("eventType");
  const isPaidEvent = watch("isPaid") === "Paid";

  const onSubmit = async (data: CreateEventFormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      console.log("Submitting event creation form data:", data);

      const response = await fetch(`https://api.talkeys.xyz/event/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Server response:", responseData);

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Event creation failed!");
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const goBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const maxStep = 6; 

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
          w-full max-w-3xl mx-auto
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
          Create Your Event
        </motion.h1>
        <motion.p className="text-center text-gray-300 mb-8" variants={itemVariants}>
          Step {currentStep} of {maxStep}
        </motion.p>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-4">1. Basic Organizer Information</h2>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Organizer Name (Individual / Society / Brand)</label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Enter organizer name"
                    {...register("organizerName", { required: "Organizer name is required" })}
                  />
                  {errors.organizerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.organizerName.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    Email Address
                  </label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Enter email"
                    {...register("organizerEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.organizerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.organizerEmail.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400" />
                    Contact Number
                  </label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Enter contact number"
                    {...register("organizerContact", { required: "Contact number is required" })}
                  />
                  {errors.organizerContact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.organizerContact.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Organization / Society Name (optional)</label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Enter organization name"
                    {...register("organizationName")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">City & State</label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="e.g. Patiala, Punjab"
                    {...register("cityState")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">
                    Social Media Links (Instagram, Website, etc.)
                  </label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="e.g. https://instagram.com/..."
                    {...register("socialLinks")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    Upload ID/Verification Document
                  </label>
                  <input
                    type="file"
                    multiple={false}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100"
                    {...register("verificationDoc")}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-4">2. Event Information</h2>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Name</label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Enter event name"
                    {...register("eventName", { required: "Event name is required" })}
                  />
                  {errors.eventName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventName.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Type</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("eventType", { required: "Event type is required" })}
                  >
                    <option value="">-- Select an option --</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventType.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">
                    Event Category (tag)
                  </label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="Concert, Gaming, Workshop, etc."
                    {...register("eventCategory", { required: "Event category is required" })}
                  />
                  {errors.eventCategory && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventCategory.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Event Description</label>
                  <Textarea
                    className="bg-gray-700 text-white w-full"
                    placeholder="Short and clear explanation of the event"
                    {...register("eventDescription", { required: "Description is required" })}
                  />
                  {errors.eventDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.eventDescription.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    Event Banner / Poster
                  </label>
                  <input
                    type="file"
                    multiple={false}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100"
                    {...register("eventBanner")}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" variants={itemVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold mb-4">3. Event Timing & Logistics</h2>

                {/* For All Events */}
                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-purple-400" /> Event Date(s)
                  </label>
                  <Input className="bg-gray-700 text-white w-full" placeholder="e.g. 2023-12-25 or comma separated dates" {...register("eventDates", { required: "Event dates are required" })} />
                  {errors.eventDates && <p className="text-red-500 text-sm mt-1">{errors.eventDates.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> Start Time
                  </label>
                  <Input type="time" className="bg-gray-700 text-white w-full" {...register("startTime", { required: "Start time is required" })} />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" /> End Time
                  </label>
                  <Input type="time" className="bg-gray-700 text-white w-full" {...register("endTime", { required: "End time is required" })} />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Registration Deadline (Optional)</label>
                  <Input type="date" className="bg-gray-700 text-white w-full" {...register("registrationDeadline")} />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Max No. of Attendees</label>
                  <Input type="number" className="bg-gray-700 text-white w-full" placeholder="e.g. 200" {...register("maxAttendees")} />
                </div>

                {eventType === "Offline" && (
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-lg">Offline Event Details</h3>
                    <div>
                      <label className="block mb-1 text-gray-300">Venue Name</label>
                      <Input className="bg-gray-700 text-white w-full" placeholder="e.g. Community Hall" {...register("venueName")} />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-300">Full Address</label>
                      <Textarea className="bg-gray-700 text-white w-full" placeholder="Street, City, State, Zipcode" {...register("venueAddress")} />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-300">Google Maps Link (optional)</label>
                      <Input className="bg-gray-700 text-white w-full" placeholder="https://maps.google.com/..." {...register("gmapLink")} />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-300">Special Entry Instructions</label>
                      <Input className="bg-gray-700 text-white w-full" placeholder="e.g. show college ID at gate" {...register("specialEntryInstructions")} />
                    </div>
                  </div>
                )}

                {eventType === "Online" && (
                  <div className="space-y-4 mb-4">
                    <h3 className="font-semibold text-lg">Online Event Details</h3>
                    <div>
                      <label className="block mb-1 text-gray-300">Platform Used (Zoom, Google Meet, Discord...)</label>
                      <Input className="bg-gray-700 text-white w-full" placeholder="e.g. Zoom" {...register("onlinePlatform")} />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-300">Will this be recorded for replay access?</label>
                      <select className="bg-gray-700 text-white w-full rounded-md px-3 py-2" {...register("willRecord")}>
                        <option value="">-- Select an option --</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-4">4. Ticketing & Access</h2>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Is the Event Free or Paid?</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("isPaid", { required: "Please select an option" })}
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Any Discounts or Early Bird Offers?</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("discountsOffered")}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Enable QR-based check-in?</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("qrCheckIn")}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Refund Policy</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("refundPolicy")}
                  >
                    <option value="">-- Select an option --</option>
                    <option value="No Refund">No Refund</option>
                    <option value="Partial">Partial</option>
                    <option value="Full">Full</option>
                  </select>
                </div>

                {isPaidEvent && (
                  <motion.div
                    className="bg-gray-800/60 p-4 rounded-md mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-xl font-bold mb-4">
                      4.1 Paid Event Details
                    </h3>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Pricing Structure</label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="Describe your pricing or multiple tiers"
                        {...register("ticketPricingStructure")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">Ticket Categories</label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="e.g. General, VIP, Student, Couple"
                        {...register("ticketCategories")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Price per Category (in ₹)
                      </label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="e.g. General: 500, VIP: 1000"
                        {...register("pricePerCategory")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Booking Limit per Person
                      </label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="e.g. Max 2 tickets"
                        {...register("bookingLimit")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Ticket Sales Start
                      </label>
                      <Input
                        type="datetime-local"
                        className="bg-gray-700 text-white w-full"
                        {...register("ticketSalesStart")}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Ticket Sales End
                      </label>
                      <Input
                        type="datetime-local"
                        className="bg-gray-700 text-white w-full"
                        {...register("ticketSalesEnd")}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Allow spot (on-site) bookings?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("allowOnsiteBookings")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Show "sold out" status once full?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("showSoldOut")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Do you have any promotional offers or codes?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("havePromos")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    {watch("havePromos") === "Yes" && (
                      <div className="space-y-4 mb-4 mt-2">
                        <label className="block mb-1 text-gray-300">Promo Code Name</label>
                        <Input
                          className="bg-gray-700 text-white w-full"
                          {...register("promoCodeName")}
                        />

                        <label className="block mb-1 text-gray-300">Discount Type (Flat ₹ / % Off)</label>
                        <Input
                          className="bg-gray-700 text-white w-full"
                          {...register("promoDiscountType")}
                        />

                        <label className="block mb-1 text-gray-300">Applicable Ticket Categories</label>
                        <Input
                          className="bg-gray-700 text-white w-full"
                          {...register("applicableTicketCategories")}
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Does the ticket include any perks? 
                      </label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="e.g. refreshments, meet & greet"
                        {...register("ticketInclusions")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">List any add-ons available</label>
                      <Input
                        className="bg-gray-700 text-white w-full"
                        placeholder="e.g. parking, reserved seating"
                        {...register("addOns")}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Show number of tickets left to buyers?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("showTicketsLeft")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Would you like attendees to receive ticket via email & QR code?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("emailQrTicket")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-300">
                        Should the ticket contain attendee's name & contact?
                      </label>
                      <select
                        className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                        {...register("showAttendeeDetails")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-4">5. Additional Features</h2>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Enable Community Chat?</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("enableCommunityChat")}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Any sponsors or partners?</label>
                  <select
                    className="bg-gray-700 text-white w-full rounded-md px-3 py-2"
                    {...register("hasSponsors")}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {watch("hasSponsors") === "Yes" && (
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-300">Name them:</label>
                    <Input
                      className="bg-gray-700 text-white w-full"
                      placeholder="e.g. XYZ Brand"
                      {...register("sponsorNames")}
                    />
                    <label className="block mb-1 text-gray-300 mt-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-purple-400" />
                      Upload Sponsor Logos
                    </label>
                    <input
                      type="file"
                      multiple
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                                 file:rounded file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-purple-50 file:text-purple-700
                                 hover:file:bg-purple-100"
                      {...register("sponsorImages")}
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300">Expected Audience Type</label>
                  <Input
                    className="bg-gray-700 text-white w-full"
                    placeholder="e.g. College Students, Gamers, etc."
                    {...register("expectedAudience")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-400" />
                    Upload Event Deck / Proposal (optional)
                  </label>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                               file:rounded file:border-0
                               file:text-sm file:font-semibold
                               file:bg-purple-50 file:text-purple-700
                               hover:file:bg-purple-100"
                    {...register("eventDeck")}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step6"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-2xl font-bold mb-4">6. Agreement & Submission</h2>

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600"
                    {...register("agreeAccurateInfo", { required: true })}
                  />
                  <label className="text-gray-300 text-sm">
                    I confirm all the above information is accurate.
                  </label>
                </div>
                {errors.agreeAccurateInfo && (
                  <p className="text-red-500 text-sm mb-2">
                    You must confirm your info is accurate.
                  </p>
                )}

                <div className="mb-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600"
                    {...register("agreeTerms", { required: true })}
                  />
                  <label className="text-gray-300 text-sm">
                    I agree to abide by{" "}
                    <Link
                      href="/t&c"
                      className="text-purple-400 underline hover:text-purple-300 transition-colors"
                    >
                      terms and privacy policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm mb-2">
                    You must agree to the terms to continue.
                  </p>
                )}

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
            )}
          </AnimatePresence>
        </motion.form>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={goBack}
              className="
                bg-gradient-to-r from-gray-600 to-gray-700
                hover:from-gray-700 hover:to-gray-800
                flex items-center gap-2
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
          {currentStep < maxStep && (
            <Button
              type="button"
              onClick={goNext}
              className="
                ml-auto
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-700 hover:to-pink-700
                flex items-center gap-2
              "
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
