// components/event/ParticularEventPage.tsx
"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventJsonLd from "@/components/EventJsonLd";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";

import EventHeader from "./EventHeader";
import RegistrationControls from "./RegistrationControls";
import QRCodeDisplay from "./QRCodeDisplay";

import { useFriendManager } from "@/lib/hooks/useFriendManager";
import { useTeamRegistration } from "@/lib/hooks/useTeamRegistration";
import { usePassManagement } from "@/lib/hooks/usePassManagement";
import { useEventLike } from "@/lib/hooks/useEventLike";

import { bookTicket } from "@/lib/services/eventApi";
import { formatTime } from "@/components/EventCarousel"; // keep your existing util

import type { EventPageProps } from "@/types/types";

export default function ParticularEventPage({
  event,
  onClose,
}: Readonly<EventPageProps>) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromHome = searchParams.get("from") === "home";

  const handleClose = () => {
    if (fromHome) router.push("/");
    else router.back();
  };

  // hooks
  const {
    friends,
    showFriends,
    setShowFriends,
    name,
    setName,
    email,
    setEmail,
    phone: phoneFriend,
    setPhone: setPhoneFriend,
    errors,
    validateField,
    addFriend,
    removeFriend,
    handleEnter,
  } = useFriendManager();

  const {
    state,
    setState,
    phone,
    setPhone,
    teamName,
    setTeamName,
    teamCode,
    setTeamCode,
    isLoading,
    errorMsg,
    toJoin,
    toCreate,
    submitPhone,
    submitJoin,
    submitCreate,
    reset,
  } = useTeamRegistration(event._id);

  const {
    codes: passQRCodes,
    create: createPass,
    refresh: refreshPasses,
  } = usePassManagement(event._id);
  const { isLike, likes, toggle } = useEventLike(
    event._id,
    event.isLiked,
    event.likes ?? 82,
  );

  // when existing passes found, show "passCreated"
  useEffect(() => {
    if (passQRCodes.length) setState("passCreated");
  }, [passQRCodes.length, setState]);

  const handleRegisterClick = () => {
    if (event.registrationLink) window.open(event.registrationLink, "_blank");
    else router.push("/register");
  };

  async function handleCreatePass() {
    await createPass(teamCode);
    setState("passCreated");
  }

  async function handlePayNowClick() {
    if (!isSignedIn) {
      toast.error("Please log in first to proceed with payment.");
      return;
    }
    try {
      const res = await bookTicket({
        eventId: event._id,
        passType: "General",
        friends,
      });
      // clear friend form after redirect-init
      window.location.href = res.data.paymentUrl;
    } catch (e: any) {
      console.log(e);
      toast.error(e?.error ?? "Failed to start payment");
    }
  }

  // hover tabs (kept from your UI)
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <EventJsonLd event={event} />
      <div className="fixed inset-0 z-[9999] min-h-screen w-full bg-black backdrop-blur-md overflow-y-scroll overflow-x-hidden py-10 pt-24 no-scrollbar">
        <Navbar />

        <EventHeader
          event={event}
          formatTime={formatTime}
          isLike={isLike}
          likes={likes}
          toggleLike={toggle}
          onClose={handleClose}
        >
          <RegistrationControls
            state={state}
            isPaid={!!event.isPaid}
            ticketPrice={event.ticketPrice}
            status={event.status}
            isRegistrationOpen={event.isRegistrationOpen}
            isLive={event.isLive}
            phone={phone}
            setPhone={setPhone}
            teamCode={teamCode}
            setTeamCode={setTeamCode}
            teamName={teamName}
            setTeamName={setTeamName}
            toJoin={toJoin}
            toCreate={toCreate}
            submitPhone={submitPhone}
            submitJoin={submitJoin}
            submitCreate={submitCreate}
            createPass={handleCreatePass}
            goRegister={handleRegisterClick}
            payNow={handlePayNowClick}
            reset={reset}
            isLoading={isLoading}
            errorMsg={errorMsg}
            friends={friends}
            showFriends={showFriends}
            setShowFriends={setShowFriends}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phoneFriend={phoneFriend}
            setPhoneFriend={setPhoneFriend}
            errors={errors}
            validateField={validateField}
            addFriend={addFriend}
            removeFriend={removeFriend}
            onEnter={handleEnter}
            passQRCodes={passQRCodes}
          />
        </EventHeader>

        {/* QR Codes if any */}
        <div className="w-full sm:w-[700px] mx-auto px-4">
          {state === "passCreated" && (
            <QRCodeDisplay name={event.name} codes={passQRCodes} />
          )}
        </div>

        {/* Category/Mode/Visibility/Type - REMOVED since now in EventHeader */}

        {/* Tabs */}
        <div className="w-max max-w-full bg-[#262626] overflow-x-auto whitespace-nowrap no-scrollbar inline-flex items-center justify-start gap-[8px] sm:gap-[20px] px-3 sm:px-6 mt-6 sm:ml-6">
          <div className="inline-flex items-center gap-[8px] sm:gap-[16px] min-w-max">
            {["details", "dates", "prizes", "community"].map((key, index) => {
              const labels = [
                "DETAILS",
                // "DATE & DEADLINES",
                // "PRIZES",
                "JOIN DISCUSSION COMMUNITY",
              ];
              return (
                <button
                  key={key}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  className={`text-white text-xs sm:text-base whitespace-nowrap font-urbanist px-2 py-1 transition-colors duration-200 ${
                    hovered === key ? "bg-[#8A44CB]/30 rounded-md" : ""
                  }`}
                >
                  {labels[index]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-[14px] sm:gap-[27px] w-full sm:w-[calc(100vw-122px)] mt-[14px] sm:mt-[27px] sm:ml-6">
          {/* Details */}
          <div
            className={`flex flex-col bg-neutral-900 rounded-none w/full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px] transition-colors duration-200 ${
              hovered === "details" ? "bg-[#8A44CB]/20" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
              <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                Details for the Event
              </span>
            </div>
            <span className="text-white text-xs sm:text-sm font-urbanist whitespace-pre-line">
              {event.eventDescription}
            </span>
          </div>

          {/* Dates */}
          {/*<div
            className={`flex flex-col bg-neutral-900 rounded-none w/full px-3 sm:px-[21px] py-2 sm:py-[13px] gap-2 sm:gap-[16px] transition-colors duration-200 ${
              hovered === "dates" ? "bg-[#8A44CB]/20" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
              <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                Dates & Deadlines
              </span>
            </div>
            <span className="text-white text-xs sm:text-sm font-urbanist">
              <span className="font-medium">Start Date:</span>{" "}
              {new Date(event.startDate).toLocaleDateString("en-IN")} <br />
              <span className="font-medium">Start Time:</span>{" "}
              {formatTime(event.startTime)} <br />
              <span className="font-medium">Duration:</span> {event.duration}{" "}
              <br />
              <span className="font-medium">
								Registration Deadline:
							</span>{" "}
							{new Date(event.endRegistrationDate).toLocaleDateString("en-IN")}
            </span>
          </div>*/}

          {/* Prizes */}
          {event.prizes && (
            <div
              className={`flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w/full gap-3 transition-colors duration-200 ${
                hovered === "prizes" ? "bg-[#8A44CB]/20" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
                <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                  Prizes
                </span>
              </div>
              <span className="text-white text-xs sm:text-sm font-urbanist whitespace-pre-line">
                {event.prizes}
              </span>
            </div>
          )}

          {/* Community */}
          <div
            className={`flex flex-col bg-neutral-900 py-4 px-3 sm:px-[21px] rounded-none w/full gap-3 transition-colors duration-200 ${
              hovered === "community" ? "bg-[#8A44CB]/20" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#8A44CB] w-[4px] sm:w-[5px] h-8 sm:h-10 rounded-full" />
              <span className="text-white text-base sm:text-lg font-semibold font-urbanist drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                Join Discussion Community
              </span>
            </div>
            <span className="text-white text-xs sm:text-sm font-urbanist">
              Join our vibrant discussion community to connect with like-minded
              individuals, share ideas, and stay updated on the latest
              conversations and event updates.
            </span>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
