"use client";

import { CheckCircle, ArrowLeft, QrCode, Receipt } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense, useEffect, useState } from "react";

const config = {
	icon: CheckCircle,
	title: "Payment Successful!",
	description:
		"Your payment has been processed successfully. You should receive a confirmation email shortly.",
	iconColor: "text-green-500",
	bgColor: "bg-green-500/10",
	borderColor: "border-green-500/20",
};

type SuccessQRString = {
	id: string;
	personName: string;
	personType: "user" | "friend";
	qrScanned: boolean;
	scannedAt: string | null;
	qrContent: string;
};

type PassDetails = {
	passAmount: number;
	passEventName: string;
	passEventDate: string;
	passPaymentStatus: string;
	passCreatedAt: string;
	passStatus: string;
	passEnteries: number;
	eventId: string | null;
	qrStrings: SuccessQRString[];
};

const emptyPassDetails: PassDetails = {
	passAmount: 0.0,
	passEventName: "Unknown Event",
	passEventDate: "Unknown Date",
	passPaymentStatus: "ERROR",
	passCreatedAt: "NULL",
	passStatus: "ERROR",
	passEnteries: 0,
	eventId: null,
	qrStrings: [],
};

function PaymentStatusContent() {
	const searchParams = useSearchParams();
	const passId = searchParams.get("passId") ?? "NULL";
	const uuid = searchParams.get("uuid") ?? null;
	const StatusIcon = config.icon;
	const [passDetails, setPassDetails] = useState<PassDetails>(emptyPassDetails);
	const qrStrings = passDetails.qrStrings.filter((qr) => qr.qrContent);

	useEffect(() => {
		const getPassDetails = async () => {
			if (!uuid) return;

			try {
				const response = await fetch(
					`${process.env.BACKEND_URL}/api/passbyuuid/${uuid}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem(
								"accessToken",
							)}`,
						},
					},
				);
				if (!response.ok) throw new Error("Failed to fetch pass details");

				const data = await response.json();
				setPassDetails({
					...emptyPassDetails,
					...data.data,
					qrStrings: data.data?.qrStrings || [],
				});
			} catch (error) {
				console.error("Error fetching pass details:", error);
			}
		};
		getPassDetails();
	}, [uuid]);

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<header className="border-b border-gray-800">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="flex items-center space-x-2"
						>
							<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
								<span className="text-black font-bold text-sm">T</span>
							</div>
							<span className="text-xl font-bold">Talkeys</span>
						</Link>
						<nav className="hidden md:flex items-center space-x-8">
							<Link
								href="/explore"
								className="text-gray-300 hover:text-white transition-colors"
							>
								Explore
							</Link>
							<Link
								href="/events"
								className="text-gray-300 hover:text-white transition-colors"
							>
								Events
							</Link>
							<Link
								href="/communities"
								className="text-gray-300 hover:text-white transition-colors"
							>
								Communities
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					{/* Back Button */}
					<Link
						href="/"
						className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>

					{/* Status Card */}
					<Card
						className={`${config.bgColor} ${config.borderColor} border-2 bg-gray-900/50 backdrop-blur-sm`}
					>
						<CardContent className="p-8 text-center">
							<div
								className={`${config.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}
							>
								<StatusIcon
									className={`w-10 h-10 ${config.iconColor}`}
								/>
							</div>

							<h1 className="text-3xl font-bold mb-4">{config.title}</h1>
							<p className="text-gray-300 text-lg mb-8 leading-relaxed">
								{config.description}
							</p>

							{/* Transaction Details */}
							<div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
								<div className="flex items-center mb-4">
									<Receipt className="w-5 h-5 text-gray-400 mr-2" />
									<span className="font-semibold">
										Transaction Details
									</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-400">
											Transaction ID:
										</span>
										<span className="font-mono">{passId}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Amount:</span>
										<span>₹{passDetails.passAmount.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Date:</span>
										<span>
											{passDetails.passEventDate
												? new Date(
														passDetails.passEventDate,
												  ).toLocaleString("en-IN", {
														year: "numeric",
														month: "long",
														day: "numeric",
												  })
												: "N/A"}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">
											Number of Tickets:
										</span>
										<span>
											{passDetails.passEnteries}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">
											Payment Status:
										</span>
										<span>
											{passDetails.passPaymentStatus
												.charAt(0)
												.toUpperCase() +
												passDetails.passPaymentStatus.slice(1)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Event Name:</span>
										<span>{passDetails.passEventName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-400">Created At:</span>
										<span>
											{passDetails.passCreatedAt
												? new Date(
														passDetails.passCreatedAt,
												  ).toLocaleString("en-IN", {
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
												  })
												: "N/A"}
										</span>
									</div>
								</div>
							</div>

							{/* QR Codes */}
							<div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
								<div className="flex items-center mb-4">
									<QrCode className="w-5 h-5 text-gray-400 mr-2" />
									<span className="font-semibold">Entry QR Codes</span>
								</div>

								{qrStrings.length ? (
									<div className="grid gap-4 sm:grid-cols-2">
										{qrStrings.map((qrString, index) => (
											<div
												key={qrString.id || `${qrString.qrContent}-${index}`}
												className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center"
											>
												<div className="mx-auto mb-3 flex w-fit rounded-lg bg-white p-3">
													<QRCode
														value={qrString.qrContent}
														size={140}
														level="M"
													/>
												</div>
												<p className="font-medium">
													{qrString.personName || `Pass ${index + 1}`}
												</p>
												<p className="text-xs text-gray-400">
													{qrString.personType === "user"
														? "Primary attendee"
														: "Additional attendee"}
												</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-400">
										QR codes are being prepared. Refresh this page in a few
										seconds or continue to the event page.
									</p>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button asChild>
									<Link
										href={`/event/${passDetails.eventId}`}
										className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
									>
										Continue to Event Page
									</Link>
								</Button>
							</div>

							{/* Help Text */}
							<div className="mt-8 pt-6 border-t border-gray-700">
								<p className="text-sm text-gray-400">
									Need help?{" "}
									<Link
										href="/contactUs"
										className="text-purple-400 hover:text-purple-300 underline"
									>
										Contact our support team
									</Link>{" "}
									or check our{" "}
									<Link
										href="/aboutUs"
										className="text-purple-400 hover:text-purple-300 underline"
									>
										FAQ section
									</Link>
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}

export default function PaymentStatusPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-black text-white flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
						<p className="text-gray-400">Loading payment status...</p>
					</div>
				</div>
			}
		>
			<PaymentStatusContent />
		</Suspense>
	);
}
