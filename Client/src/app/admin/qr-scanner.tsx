"use client";

import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
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

	let oldresult: string = "";
	const handleScan = async (result: string | null) => {
		if (result && oldresult !== result) {
			oldresult = result;
			setIsScanning(false);
			await getPassInfo(result);
		}
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
				return;
			} else {
				throw new Error(
					`Verification failed with status ${response.status}`,
				);
			}
		} catch (error) {
			console.error("Error verifying pass:", error);
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
		oldresult = "";
		setIsScanning(false);
		setPassInfo(null);
		setCurrentPassId(null);
		setError(null);
		setVerificationStatus(null);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-2xl font-bold mb-4 text-gray-800">
				Admin QR Scanner
			</h1>
			{isScanning ? (
				<div className="w-full max-w-sm">
					<QrReader
						onResult={(result, error) => {
							if (!!result) {
								handleScan(result?.getText());
							}
						}}
						constraints={{ facingMode: "environment" }}
						className="w-full rounded-lg overflow-hidden"
					/>
				</div>
			) : (
				<Button
					onClick={() => setIsScanning(true)}
					className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
				>
					{verificationStatus ? "Scan More" : "Start Scanning"}
				</Button>
			)}
			{verificationStatus && (
				<div
					className={`mt-4 p-2 rounded-lg ${
						verificationStatus.includes("Accepted")
							? "bg-green-500"
							: "bg-red-500"
					} text-white font-semibold text-center w-full max-w-sm`}
				>
					{verificationStatus}
				</div>
			)}
			{error && (
				<div className="mt-4 p-2 rounded-lg bg-red-500 text-white font-semibold text-center w-full max-w-sm">
					{error}
				</div>
			)}
			{(verificationStatus === "Invalid Pass" || error) && (
				<Button
					onClick={resetScanner}
					className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
				>
					Scan Again
				</Button>
			)}

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				
			>
				<DialogContent className="bg-white rounded-lg">
					<DialogHeader>
						<DialogTitle>Pass Information</DialogTitle>
						<Button
							className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
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
							onClick={() => handleAcceptReject("reject")}
							className="bg-red-500 hover:bg-red-600"
						>
							Reject
						</Button>
						<Button
							onClick={() => handleAcceptReject("accept")}
							className="bg-green-500 hover:bg-green-600"
						>
							Accept
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
