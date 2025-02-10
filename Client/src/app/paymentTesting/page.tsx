"use client";

import React, { useState } from "react";

const startPayment = async (bookingId: string) => {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/payment/${bookingId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "accessToken",
                )}`,
            },
        });
        if (response.ok) {
            console.log("Payment started successfully");
        } else {
            console.error("Failed to start payment");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const PaymentPage = () => {
    const [bookingId, setBookingId] = useState("");

    return (
        <div className="pt-12" style={{ paddingTop: "260px" }}>
            <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Enter booking ID"
                className="border px-4 py-2 rounded mb-4"
            />
            <button
                onClick={() => startPayment(bookingId)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Start Payment
            </button>
        </div>
    );
};

export default PaymentPage;
