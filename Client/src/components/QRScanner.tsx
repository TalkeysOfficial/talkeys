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

type GetTix = {
	success: boolean,
	data: {
		buyer: string,
		event: string,
		person: {
			personName: string,
			qrScanned: boolean,
			scannedAt: Date,
			_id: string
		},
		amount: number,
	}
};

export default function AdminQRScanner() {
	const [isScanning, setIsScanning] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [passInfo, setPassInfo] = useState<GetTix | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentPassId, setCurrentPassId] = useState<{ passUUID: string; qrId: string } | null>(null);
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
		try {
			// Split the QR code result at the '+' character
			const parts = result.trim().split('+');
			
			// Ensure we have exactly two parts and remove any extra whitespace
			if (parts.length === 2) {
				const passUUID = parts[0].trim();
				const qrId = parts[1].trim();
				console.log("Parsed QR Code:", { passUUID, qrId });
				await getPassInfo(passUUID, qrId);
			} else {
				console.error("Invalid QR format. Expected format: 'passId+extraData'");
				setError("Invalid QR code format");
				setIsPending(false);
				return;
			}
		} catch (error) {
			console.error("Error parsing QR code:", error);
			setError("Failed to process QR code");
			setIsPending(false);
			return;
		}
		
		setIsPending(false);
	};

	const getPassInfo = async (passUUID: string, qrId: string): Promise<void> => {
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/api/getTix`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ passUUID, qrId }),
			});

			if (response.ok) {
				const data = await response.json() as GetTix;
				setPassInfo(data);
				setCurrentPassId({ passUUID, qrId });
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

	const handleAccept = async () => {
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/Accept`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ uuid: currentPassId?.passUUID, qrId: currentPassId?.qrId }),
			});

			if (response.ok) {
				setVerificationStatus(
					`Pass accepted for ${passInfo?.data.person.personName}`,
				);
			} else {
				throw new Error(
					`Accept failed`,
				);
			}
		} catch (error) {
			console.error(`Error accepting pass:`, error);
			setError(`Failed to accept pass. Please try again.`);
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
								<strong>Name:</strong> {passInfo.data.person.personName}
							</p>
							<p>
								<strong>Event:</strong> {passInfo.data.amount}
							</p>
							{passInfo.data.person.qrScanned && (
								<div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
									<p className="text-red-300 font-semibold">
										⚠️ This pass has already been scanned
									</p>
									{passInfo.data.person.scannedAt && (
										<p className="text-red-200 text-sm mt-1">
											Scanned at: {new Date(passInfo.data.person.scannedAt).toLocaleString()}
										</p>
									)}
								</div>
							)}
						</div>
					)}
					<DialogFooter>
						{passInfo && !passInfo.data.person.qrScanned ? (
							<Button
								variant="outline"
								onClick={() => handleAccept()}
								className="bg-green-500 text-white"
							>
								Accept
							</Button>
						) : (
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								className="bg-gray-500 text-white"
							>
								Close
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
