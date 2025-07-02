"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Clock, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function PaymentStatusContent() {
	const searchParams = useSearchParams();
	const status = searchParams.get("status") ?? "success"; // Default to success for demo

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "success":
				return {
					icon: CheckCircle,
					title: "Payment Successful!",
					description:
						"Your payment has been processed successfully. You should receive a confirmation email shortly.",
					iconColor: "text-green-500",
					bgColor: "bg-green-500/10",
					borderColor: "border-green-500/20",
				};
			case "pending":
				return {
					icon: Clock,
					title: "Payment Processing",
					description:
						"Your payment is being processed. This may take a few minutes. Please do not refresh this page.",
					iconColor: "text-yellow-500",
					bgColor: "bg-yellow-500/10",
					borderColor: "border-yellow-500/20",
				};
			case "cancelled":
			case "failed":
				return {
					icon: XCircle,
					title: "Payment Cancelled",
					description:
						"Your payment was cancelled or unsuccessful. No charges have been made to your account.",
					iconColor: "text-red-500",
					bgColor: "bg-red-500/10",
					borderColor: "border-red-500/20",
				};
			default:
				return {
					icon: CheckCircle,
					title: "Payment Successful!",
					description:
						"Your payment has been processed successfully. You should receive a confirmation email shortly.",
					iconColor: "text-green-500",
					bgColor: "bg-green-500/10",
					borderColor: "border-green-500/20",
				};
		}
	};

	const config = getStatusConfig(status);
	const StatusIcon = config.icon;

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
							{status === "success" && (
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
											<span className="font-mono">
												TXN-2024-001234
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Amount:</span>
											<span>$29.99</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Date:</span>
											<span>{new Date().toLocaleDateString()}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">
												Payment Method:
											</span>
											<span>•••• •••• •••• 1234</span>
										</div>
									</div>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								{status === "success" && (
									<>
										<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
											Continue to Dashboard
										</Button>
										<Button
											variant="outline"
											className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
										>
											Download Receipt
										</Button>
									</>
								)}

								{status === "pending" && (
									<>
										<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
											Check Status
										</Button>
										<Button
											variant="outline"
											className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
										>
											Contact Support
										</Button>
									</>
								)}

								{(status === "cancelled" || status === "failed") && (
									<>
										<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
											Try Again
										</Button>
										<Button
											variant="outline"
											className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
										>
											Choose Different Method
										</Button>
									</>
								)}
							</div>

							{/* Help Text */}
							<div className="mt-8 pt-6 border-t border-gray-700">
								<p className="text-sm text-gray-400">
									Need help?{" "}
									<Link
										href="/support"
										className="text-purple-400 hover:text-purple-300 underline"
									>
										Contact our support team
									</Link>{" "}
									or check our{" "}
									<Link
										href="/faq"
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
