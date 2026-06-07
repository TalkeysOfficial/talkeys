"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Camera, X } from "lucide-react";

interface GetTixResponse {
  success: boolean;
  data: {
    passUUID?: string;
    qrId?: string | null;
    buyer: string;
    buyerEmail?: string;
    buyerPhoneNumber?: string;
    buyerIMG: string;
    event: string;
    eventName?: string;
    eventDate?: string | null;
    eventLocation?: string;
    attendeeName?: string;
    passTypeName?: string;
    passPrice?: number;
    checkInStatus?: string;
    bookingStatus?: string;
    passStatus: string;
    paymentStatus?: string;
    alreadyScanned?: boolean;
    scannedAt?: string | null;
    isScanned: boolean;
    timeScanned: string;
    person?: any;
    amount?: number;
    ticketCount?: number;
    bookingMembers?: Array<{
      id?: string;
      name: string;
      personType?: "user" | "friend";
      passTypeName?: string;
      passPrice?: number;
      checkedIn?: boolean;
      isCurrent?: boolean;
    }>;
    bookedAt?: string | null;
    confirmedAt?: string | null;
  };
}

interface CurrentPassId {
  passUUID: string;
  qrId?: string;
}

type ScannerState = "scanning" | "passInfo" | "success" | "error" | "used";

const formatAmount = (amount?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatStatus = (value?: string | null) =>
  value?.replace(/_/g, " ") || "-";

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="rounded-lg bg-slate-100 p-3">
    <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
    <p className="mt-1 break-words font-bold text-slate-900">
      {value === undefined || value === null || value === "" ? "-" : value}
    </p>
  </div>
);

export default function QRScannerComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const isPendingRef = useRef(false);
  const [state, setState] = useState<ScannerState>("scanning");
  const [passInfo, setPassInfo] = useState<GetTixResponse | null>(null);
  const [currentPassId, setCurrentPassId] = useState<CurrentPassId | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );

  const setPending = useCallback((value: boolean) => {
    isPendingRef.current = value;
    setIsPending(value);
  }, []);

  const parseQRData = useCallback((qrData: string): { passUUID: string; qrId?: string } => {
    // Assuming the format is "passUUID+qrId" or just "passUUID"
    const parts = qrData.split("+");
    return {
      passUUID: parts[0],
      qrId: parts[1] || undefined,
    };
  }, []);

  const getPassInfo = useCallback(async (
    passUUID: string,
    qrId?: string,
  ): Promise<void> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found. Please login.");
      }

      // Prepare request body
      const requestBody: any = { passUUID };
      if (qrId) {
        requestBody.qrId = qrId;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/getTix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data: GetTixResponse = await response.json();

        if (!data.success) {
          throw new Error("API returned unsuccessful response");
        }

        setPassInfo(data);
        setCurrentPassId({ passUUID, qrId });
        setState(
          data.data.alreadyScanned || data.data.person?.qrScanned
            ? "used"
            : "passInfo",
        );
        setPending(false);
        setError(null);
      } else if (response.status === 404) {
        setVerificationStatus("Invalid Pass");
        setError("Pass not found. Please check the QR code.");
        setState("error");
        setPending(false);
      } else if (response.status === 401) {
        setError("Authentication failed. Please login again.");
        setState("error");
        setPending(false);
      } else {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error("Error fetching pass info:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to verify pass. Please try again.",
      );
      setState("error");
      setPending(false);
    }
  }, [setPending]);

  const handleQRScan = useCallback(async (qrData: string) => {
    if (isPendingRef.current) return;

    setPending(true);
    setError(null);

    try {
      // Stop scanner while processing
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }

      // Parse QR data to extract passUUID and qrId
      const { passUUID, qrId } = parseQRData(qrData);
      if (!passUUID) {
        throw new Error("Invalid QR code format. Expected passUUID+qrId");
      }

      // Fetch pass information
      await getPassInfo(passUUID, qrId);
    } catch (error) {
      console.error("QR scan error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process QR code",
      );
      setState("error");
      setPending(false);
    }
  }, [getPassInfo, parseQRData, setPending]);

  const initializeScanner = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleQRScan(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: "environment",
        },
      );
      await qrScannerRef.current.start();
    } catch (error) {
      console.error("Failed to start QR scanner:", error);
      setError("Failed to access camera. Please check permissions.");
      setState("error");
    }
  }, [handleQRScan]);

  // Initialize QR Scanner
  useEffect(() => {
    if (state === "scanning" && videoRef.current) {
      initializeScanner();
    }
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [initializeScanner, state]);

  const handleAccept = async () => {
    if (!currentPassId || !passInfo) {
      setError("No pass data available");
      return;
    }

    setPending(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${process.env.BACKEND_URL}/Accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uuid: currentPassId.passUUID,
          qrId: currentPassId.qrId,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (response.ok) {
        const currentTime = payload?.data?.scannedAt || new Date().toISOString();
        setPassInfo({
          ...passInfo,
          data: {
            ...passInfo.data,
            ...(payload?.data || {}),
            isScanned: true,
            timeScanned: currentTime,
          },
        });
        setVerificationStatus(
          `Pass accepted for ${
            payload?.data?.attendeeName ||
            passInfo.data.attendeeName ||
            passInfo.data.buyer
          }`,
        );
        setState("success");
      } else if (response.status === 409) {
        if (payload?.data) {
          setPassInfo({
            ...passInfo,
            data: {
              ...passInfo.data,
              ...payload.data,
            },
          });
        }
        setError(payload?.error || "This pass is already checked in.");
        setState("used");
      } else {
        throw new Error(
          payload?.error || `Accept failed with status ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Error accepting pass:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to accept pass. Please try again.",
      );
      setState("error");
    } finally {
      setPending(false);
    }
  };

  const handleCancel = () => {
    resetScanner();
  };

  const resetScanner = () => {
    setPassInfo(null);
    setCurrentPassId(null);
    setError(null);
    setVerificationStatus(null);
    setPending(false);
    setState("scanning");
  };

  const renderPassDetails = () => {
    if (!passInfo) return null;

    const data = passInfo.data;
    const passPrice = Number(data.passPrice || 0);
    const bookingMembers = data.bookingMembers || [];

    return (
      <div className="space-y-4 text-left">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-600">Attendee</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {data.attendeeName || data.person?.personName || "Unknown attendee"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
              {data.passTypeName || "General Pass"}
            </span>
            {passPrice > 0 ? (
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                {formatAmount(passPrice)}
              </span>
            ) : null}
            <span className="rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold capitalize text-slate-700">
              {formatStatus(data.checkInStatus)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow label="Booked By" value={data.buyer} />
          <DetailRow label="Buyer Phone" value={data.buyerPhoneNumber} />
          <DetailRow label="Buyer Email" value={data.buyerEmail} />
          <DetailRow label="Event" value={data.eventName || data.event} />
          <DetailRow label="Pass Type" value={data.passTypeName || "General Pass"} />
          {passPrice > 0 ? (
            <DetailRow label="Ticket Price" value={formatAmount(passPrice)} />
          ) : null}
          <DetailRow label="Tickets In Booking" value={data.ticketCount} />
          <DetailRow
            label="Booking"
            value={formatStatus(data.bookingStatus || data.passStatus)}
          />
        </div>

        {bookingMembers.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Members in this booking
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {bookingMembers.length} total passes
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {bookingMembers.map((member, index) => (
                <div
                  key={member.id || `${member.name}-${index}`}
                  className="flex items-start justify-between gap-3 rounded-lg bg-slate-100 p-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words font-bold text-slate-950">
                        {member.name || `Member ${index + 1}`}
                      </p>
                      {member.isCurrent ? (
                        <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                          Scanned QR
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {member.passTypeName || "General Pass"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${
                      member.checkedIn
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {member.checkedIn ? "Checked In" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderScanningView = () => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-slate-900 font-bold">
          <Camera className="h-5 w-5 text-slate-700" />
          <span className="text-slate-900">Scan QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg object-cover"
            playsInline
            muted
          />
          {isPending && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center font-semibold">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white font-medium">Processing...</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-700 text-center mt-4 font-medium">
          Position the QR code within the camera view
        </p>
      </CardContent>
    </Card>
  );

  const renderPassInfoView = () => {
    const alreadyScanned =
      Boolean(passInfo?.data.alreadyScanned) ||
      Boolean(passInfo?.data.person?.qrScanned);

    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-slate-900 font-bold">
            Pass Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {passInfo && (
            <div className="py-4 space-y-4">
              {renderPassDetails()}

              {alreadyScanned && (
                <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <p className="font-bold text-red-800">Already Scanned</p>
                </AlertDescription>
              </Alert>
              )}
            </div>
          )}

          {passInfo && !alreadyScanned ? (
            <div className="flex gap-2 w-full mt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccept}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white flex-1 font-medium"
              >
                {isPending ? "Accepting..." : "Accept Pass"}
              </Button>
            </div>
          ) : (
            passInfo && (
              <Button
                variant="outline"
                onClick={resetScanner}
                className="w-full mt-4 text-slate-900 border-slate-300 hover:bg-slate-50"
              >
                Scan Another
              </Button>
            )
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSuccessView = () => (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-xl border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div>
            <h3 className="text-lg font-bold text-green-700">
              Pass Successfully Accepted!
            </h3>
            {verificationStatus && (
              <p className="text-green-600 mt-2 font-medium">
                {verificationStatus}
              </p>
            )}
          </div>
          <div className="w-full">{renderPassDetails()}</div>
          <Button
            onClick={resetScanner}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Continue Scanning
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsedView = () => (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-xl border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="h-16 w-16 text-orange-500" />
          <div>
            <h3 className="text-lg font-bold text-orange-700">
              Already Checked In
            </h3>
          </div>
          <div className="w-full">{renderPassDetails()}</div>
          <Button
            onClick={resetScanner}
            variant="outline"
            className="w-full text-slate-900 border-slate-300 hover:bg-slate-50"
          >
            Scan Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderErrorView = () => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <X className="h-16 w-16 text-red-500" />
          <div>
            <h3 className="text-lg font-bold text-red-700">Error</h3>
            {error && <p className="text-red-600 mt-2 font-medium">{error}</p>}
          </div>
          <Button
            onClick={resetScanner}
            variant="outline"
            className="w-full text-slate-900 border-slate-300 hover:bg-slate-50"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {state === "scanning" && renderScanningView()}
      {state === "passInfo" && renderPassInfoView()}
      {state === "success" && renderSuccessView()}
      {state === "error" && renderErrorView()}
      {state === "used" && renderUsedView()}
    </div>
  );
}
