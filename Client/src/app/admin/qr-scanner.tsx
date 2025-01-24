"use client";

import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface PassInfo {
	email: string;
	name: string;
	phoneNumber: string;
}

export default function AdminQRScanner() {
	const [isScanning, setIsScanning] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [passInfo, setPassInfo] = useState<PassInfo | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentPassId, setCurrentPassId] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const scannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		if (isScanning && videoRef.current) {
			scannerRef.current = new QrScanner(
				videoRef.current,
				(result) => {
					if (result) {
						handleScan(result.data);
						if (scannerRef.current) {
							scannerRef.current.stop();
						}
					}
				},
				{
					returnDetailedScanResult: true,
					highlightScanRegion: true,
					highlightCodeOutline: true,
				},
			);

			scannerRef.current.start().catch((err) => {
				console.error("Failed to start scanner:", err);
				setError(
					"Failed to access camera. Please check permissions and try again.",
				);
			});
		}

		return () => {
			if (scannerRef.current) {
				scannerRef.current.destroy();
			}
		};
	}, [isScanning]);

	const handleScan = async (result: string) => {
		setIsScanning(false);
		setIsPending(true);
		await getPassInfo(result);
		setIsPending(false);
	};

	const getPassInfo = async (passId: string): Promise<void> => {
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/verifyPass`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ passId }),
			});

			if (response.ok) {
				const data = await response.json();
				setPassInfo(data);
				setCurrentPassId(passId);
				setIsDialogOpen(true);
			} else if (response.status === 404) {
				setVerificationStatus("Invalid Pass");
				setError("Invalid pass ID provided.");
			} else {
				throw new Error(
					`Verification failed with status ${response.status}`,
				);
			}
		} catch (error) {
			console.error("Error checking pass:", error);
			setError("Failed to verify pass. Please try again.");
		}
	};

	const handleAcceptReject = async (action: "accept" | "reject") => {
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/${action}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ passId: currentPassId }),
			});

			if (response.ok) {
				setVerificationStatus(
					`Pass ${action === "accept" ? "Accepted" : "Rejected"}`,
				);
			} else {
				throw new Error(
					`${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
				);
			}
		} catch (error) {
			console.error(`Error ${action}ing pass:`, error);
			setError(`Failed to ${action} pass. Please try again.`);
		} finally {
			setIsDialogOpen(false);
			resetScanner();
		}
	};

	const resetScanner = () => {
		setIsScanning(true);
		setPassInfo(null);
		setCurrentPassId(null);
		setError(null);
		setVerificationStatus(null);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<h1 className="text-3xl font-bold mb-6 text-foreground">
				Admin QR Scanner
			</h1>

			<div className={`w-full max-w-md ${isPending ? "opacity-40" : ""}`}>
				{isScanning ? (
					<Card className="relative overflow-hidden">
						<CardContent className="p-0">
							<div className="relative aspect-square">
								<video
									ref={videoRef}
									className="w-full h-full object-cover rounded-lg"
								/>
								<div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none" />
							</div>
						</CardContent>
					</Card>
				) : (
					<Button
						onClick={() => setIsScanning(true)}
						className="w-full"
					>
						{verificationStatus ? "Scan More" : "Start Scanning"}
					</Button>
				)}
			</div>

			{error && <p className="mt-4 text-destructive text-center">{error}</p>}

			{(verificationStatus || error) && (
				<Button
					variant="outline"
					onClick={resetScanner}
					className="mt-4"
				>
					Scan Again
				</Button>
			)}

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogContent className="bg-black text-white">
					<DialogHeader>
						<DialogTitle>Pass Information</DialogTitle>
						<Button
							className="absolute right-4 top-4"
							variant="ghost"
							onClick={() => setIsDialogOpen(false)}
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogHeader>
					{passInfo && (
						<div className="py-4">
							<p>
								<strong>Name:</strong> {passInfo.name}
							</p>
							<p>
								<strong>Email:</strong> {passInfo.email}
							</p>
							<p>
								<strong>Phone:</strong> {passInfo.phoneNumber}
							</p>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => handleAcceptReject("reject")}
							className="bg-red-500 text-white"
						>
							Reject
						</Button>
						<Button
							variant="outline"
							onClick={() => handleAcceptReject("accept")}
							className="bg-green-500 text-white"
						>
							Accept
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
