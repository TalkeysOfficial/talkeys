// @ts-nocheck
// @ts-ignore
"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  User,
  Heart,
  Send,
  Check,
  X,
  Copy,
} from "lucide-react";
import Image from "next/image";
import placeholderImage from "@/public/images/events.jpg";
import type { RegistrationState } from "@/types/types";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ParticularEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [registrationState, setRegistrationState] =
    useState<RegistrationState>("initial");
  const [teamCode, setTeamCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pass, setPass] = useState<string | null>(null);
  const [isLike, setIsLike] = useState<boolean | null>(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.BACKEND_URL}/getEventById/${eventId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data.data);
        setIsLike(false);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch event details", error);
        setError(error.message);
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  useEffect(() => {
    async function getTeamAndPass() {
      if (!event) return;

      try {
        const response = await fetch(`${process.env.BACKEND_URL}/getTeam`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        });
        const data = await response.json();
        if (response.ok) {
          setTeamName(data.teamName);
          setTeamCode(data.teamCode);
          const passResponse = await fetch(
            `${process.env.BACKEND_URL}/getPass`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                eventId: event._id,
                userId: data._id,
              }),
            }
          );
          const passData = await passResponse.json();
          if (passResponse.ok) {
            setPass(passData._id);
            setRegistrationState("passCreated");
          } else {
            setRegistrationState("teamJoined");
          }
        } else {
          setRegistrationState("initial");
        }
      } catch (error) {
        console.error("Failed to get team or pass", error);
        setRegistrationState("initial");
      }
    }

    if (event) {
      getTeamAndPass();
    }
  }, [event]);

  const handleRegisterClick = () => {
    if (!event) return;

    if (event.registrationLink) {
      window.open(event.registrationLink, "_blank");
      return;
    }
    if (event.isLive) {
      setRegistrationState("teamOptions");
    }
  };

  const handleJoinTeam = () => {
    setRegistrationState("joinTeamPhone");
  };

  const handleCreateTeam = () => {
    setRegistrationState("createTeamPhone");
  };

  const handleTeamCodeSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/joinTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ teamCode, phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setTeamName(data.teamName);
        setRegistrationState("teamJoined");
      } else {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error("Failed to join team", error);
      if (error instanceof Error) {
        if (error.message === "400") {
          setErrorMessage("Team full or invalid phone number");
        } else if (error.message === "404") {
          setErrorMessage("Team or user not found");
        } else {
          setErrorMessage("Server error");
        }
      }
      setRegistrationState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeamSubmit = async () => {
    if (!event) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/createTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          newPhoneNumber: phoneNumber,
          teamName,
          eventId: event._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTeamCode(data.team.teamCode);
        setTeamName(data.team.teamName);
        setRegistrationState("createTeamCode");
      } else {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error("Failed to create team", error);
      if (error instanceof Error) {
        if (error.message === "400") {
          setErrorMessage("Invalid phone number");
        } else if (error.message === "401") {
          setErrorMessage("Login Before Creating Team");
        } else if (error.message === "404") {
          setErrorMessage("User not found");
        } else {
          setErrorMessage("Server error");
        }
      }
      setRegistrationState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = () => {
    if (registrationState === "joinTeamPhone") {
      setRegistrationState("joinTeamCode");
    } else if (registrationState === "createTeamPhone") {
      setRegistrationState("createTeamName");
    }
  };

  const handleCreatePass = async () => {
    if (!event) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/bookPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          teamCode: teamCode,
          eventId: event._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPass(data._id);
        setRegistrationState("passCreated");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Failed to book pass", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to book pass"
      );
      setRegistrationState("error");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleLikeUnlikeEvent(eventId: string) {
    await fetch(
      `${process.env.BACKEND_URL}/${
        isLike ? "unlikeEvent" : "likeEvent"
      }/${eventId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  }

  function isTimePassed(dateString: string) {
    const time = new Date(dateString).getTime();
    const currentTime = new Date().getTime();
    return time <= currentTime;
  }

  async function sendBookingID() {
    if (!event) return;

    try {
      window.open(event.registrationLink, "_blank");
    } catch (error) {
      console.error("Failed to send booking ID", error);
    }
  }

  const renderRegistrationButton = () => {
    if (!event) return null;

    switch (registrationState) {
      case "initial": {
        const isEventLive = event.isLive;
        const isRegistrationClosed = isTimePassed(event.endRegistrationDate);
        const isEventPaid = event.isPaid;

        let buttonText;
        let ariaLabel;

        if (isRegistrationClosed) {
          buttonText = "Registrations Closed";
          ariaLabel = "Registrations closed";
        } else if (!isEventLive) {
          buttonText = "Coming Soon";
          ariaLabel = "Event coming soon";
        } else if (isEventPaid) {
          buttonText = "Pay NOW";
          ariaLabel = "Pay for tickets for event";
        } else {
          buttonText = "Register Now";
          ariaLabel = "Register for event";
        }

        if (event.isPaid) {
          return (
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={sendBookingID}
              disabled={!isEventLive || isRegistrationClosed}
              aria-label={ariaLabel}
            >
              {buttonText}
            </Button>
          );
        }

        return (
          <Button
            className="bg-purple-600 hover:bg-purple-700 w-full"
            onClick= {() => router.push("/register")}
            disabled={!isEventLive || isRegistrationClosed}
            aria-label={ariaLabel}
          >
            {buttonText}
          </Button>
        );
      }

      case "teamOptions":
        return (
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm mx-auto">
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={handleJoinTeam}
            >
              Join Team
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={handleCreateTeam}
            >
              Create Team
            </Button>
          </div>
        );
      case "joinTeamPhone":
      case "createTeamPhone":
        return (
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-gray-800 text-white w-full text-base px-4 py-2"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={handlePhoneSubmit}
                disabled={!phoneNumber}
              >
                <Check className="w-4 h-4 mr-2" />
                Continue
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                onClick={() => setRegistrationState("initial")}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
      case "createTeamName":
        return (
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-gray-800 text-white w-full text-base px-4 py-2"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={handleCreateTeamSubmit}
                disabled={isLoading || !teamName}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Creating...</span>
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Team
                  </>
                )}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                onClick={() => setRegistrationState("initial")}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
      case "joinTeamCode":
        return (
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="Enter team code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              className="bg-gray-800 text-white w-full text-base px-4 py-2"
            />
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={handleTeamCodeSubmit}
                disabled={isLoading || !teamCode}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Joining...</span>
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Join Team
                  </>
                )}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                onClick={() => setRegistrationState("initial")}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        );
      case "createTeamCode":
        return (
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <div className="flex w-full">
              <Input
                type="text"
                value={teamCode}
                readOnly
                className="bg-gray-800 text-white flex-1 text-base px-4 py-2"
              />
              <Button
                className="ml-2"
                onClick={() => navigator.clipboard.writeText(teamCode)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-green-500">Team Created: {teamName}</div>
            <Button
              className="bg-green-600 hover:bg-green-700 w-full"
              onClick={handleCreatePass}
            >
              Create Pass
            </Button>
          </div>
        );
      case "teamJoined":
        return (
          <div className="w-full max-w-sm mx-auto">
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={sendBookingID}
            >
              Pay Now
            </Button>
          </div>
        );
      case "error":
        return (
          <div className="w-full max-w-sm mx-auto space-y-2">
            <div className="text-red-500">{errorMessage}</div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={() => setRegistrationState("initial")}
            >
              Try Again
            </Button>
          </div>
        );
      case "booked":
        return (
          <div className="w-full max-w-sm mx-auto space-y-2">
            <div className="text-green-500">{errorMessage}</div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full"
              disabled={true}
            >
              Tickets Booked
            </Button>
          </div>
        );
      case "passCreated":
        return (
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <div className="text-green-500">
              Pass Created: Reload to Get Pass
            </div>
            {pass && (
              <div className="flex justify-center">
                <QRCode value={pass} />
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Loading event details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-black text-white flex items-center justify-center h-screen">
        <div className="text-red-500">Event not found</div>
      </div>
    );
  }

  return (
    <div
      className="bg-black text-white overflow-y-auto h-screen max-h-[100vh] rounded-lg shadow-xl w-full mx-auto custom-scrollbar flex items-end justify-center"
      aria-modal="true"
    >
      <div className="p-3 sm:p-4 md:p-6 lg:w-[800px] max-w-[800px] bg-black mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Left Column - Event Image */}
          <div className="relative w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto">
            <Image
              src={event.photographs?.[0] ?? placeholderImage}
              alt={`${event.name}-banner`}
              className="rounded-lg object-scale-down object-center"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>

          {/* Right Column - Event Details */}
          <div className="w-full sm:w-1/2 space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-3">{event.name}</h1>
              <div className="space-y-1.5 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location ?? "Online Event"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString("en-IN")}
                    {" at "}
                    {event.startTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {event.mode === "offline"
                      ? "In-person Event"
                      : "Online Event"}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Section */}
            <div className="flex flex-col items-start gap-4">
              <div className="text-base">Cost: ₹{event.ticketPrice}</div>
              {renderRegistrationButton()}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{event.category}</Badge>
                <Badge variant="secondary">{event.mode}</Badge>
                <Badge variant="secondary">{event.visibility}</Badge>
              </div>
              <div className="flex gap-4">
                <button
                  aria-label="Like event"
                  className="hover:text-purple-400 transition-colors"
                  onClick={() => {
                    handleLikeUnlikeEvent(event._id);
                    setIsLike(!isLike);
                  }}
                >
                  <Heart
                    className="w-5 h-5 text-gray-400"
                    color={isLike ? "red" : "currentColor"}
                  />
                </button>
                <button
                  aria-label="Share event"
                  className="hover:text-purple-400 transition-colors"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: event.name,
                          text: event.eventDescription,
                          url: `${window.location.origin}/event/${event._id}`,
                        })
                        .catch((err) => console.error("Error sharing:", err));
                    } else {
                      console.log("Web Share API not supported");
                    }
                  }}
                >
                  <Send className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          defaultValue="details"
          className="w-full mt-6"
          aria-label="Event information tabs"
        >
          <TabsList className="bg-gray-900 border-b border-gray-800 w-full overflow-x-auto flex-nowrap overflow-y-hidden -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsTrigger value="details" className="text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="dates" className="text-sm">
              Dates & Deadlines
            </TabsTrigger>
            {event.category === "Gaming" && (
              <TabsTrigger value="prizes" className="text-sm">
                Prizes
              </TabsTrigger>
            )}
            {event.paymentQRcode && (
              <TabsTrigger value="Payment QR Code" className="text-sm">
                Payment QR Code
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="py-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Details for the Event
              </h3>
              <div className="text-gray-400 space-y-2 whitespace-pre-line">
                {event.eventDescription
                  ?.split("\\n")
                  .map((line) => line)
                  .join("\n")}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dates" className="py-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Dates & Deadlines</h3>
              <p className="text-gray-400">
                Start Date: {new Date(event.startDate).toLocaleDateString()}
                <br />
                Start Time: {event.startTime}
                <br />
                Duration: {event.duration}
                <br />
                Registration Deadline:{" "}
                {new Date(event.endRegistrationDate).toLocaleDateString()}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="prizes" className="py-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Prizes</h3>
              <p className="text-gray-400">
                {event.prizes ?? "No prize information available."}
              </p>
            </div>
          </TabsContent>
          <TabsContent
            value="Payment QR Code"
            className="py-4 flex justify-center items-center"
          >
            <Image
              src={event.paymentQRcode ?? ""}
              alt="paymentQRcode"
              height={300}
              width={300}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
