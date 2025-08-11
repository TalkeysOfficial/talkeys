"use client"

import { useState, useRef, useEffect } from "react"
import QrScanner from "qr-scanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Camera, X } from 'lucide-react'

interface GetTixResponse {
  success: boolean
  data: {
    buyer: string
    buyerIMG: string
    event: string
    passStatus: string
    isScanned: boolean
    timeScanned: string
    person?: any
    amount?: number
  }
}

interface CurrentPassId {
  passUUID: string
  qrId?: string
}

type ScannerState = 'scanning' | 'passInfo' | 'success' | 'error' | 'used'

export default function QRScannerComponent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)
  const [state, setState] = useState<ScannerState>('scanning')
  const [passInfo, setPassInfo] = useState<GetTixResponse | null>(null)
  const [currentPassId, setCurrentPassId] = useState<CurrentPassId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null)

  // Initialize QR Scanner
  useEffect(() => {
    if (state === 'scanning' && videoRef.current) {
      initializeScanner()
    }
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy()
        qrScannerRef.current = null
      }
    }
  }, [state])

  const initializeScanner = async () => {
    if (!videoRef.current) return

    try {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleQRScan(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      )
      await qrScannerRef.current.start()
    } catch (error) {
      console.error('Failed to start QR scanner:', error)
      setError('Failed to access camera. Please check permissions.')
      setState('error')
    }
  }

  const handleQRScan = async (qrData: string) => {
    if (isPending) return

    setIsPending(true)
    setError(null)

    try {
      // Stop scanner while processing
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
      }

      // Parse QR data to extract passUUID and qrId
      const { passUUID, qrId } = parseQRData(qrData)
      if (!passUUID) {
        throw new Error('Invalid QR code format. Expected passUUID+qrId')
      }

      // Fetch pass information
      await getPassInfo(passUUID, qrId)
    } catch (error) {
      console.error('QR scan error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process QR code')
      setState('error')
      setIsPending(false)
    }
  }

  const parseQRData = (qrData: string): { passUUID: string; qrId?: string } => {
    // Assuming the format is "passUUID+qrId" or just "passUUID"
    const parts = qrData.split('+')
    return {
      passUUID: parts[0],
      qrId: parts[1] || undefined
    }
  }

  const getPassInfo = async (passUUID: string, qrId?: string): Promise<void> => {
    console.log("Fetching pass info for:", { passUUID, qrId })

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No access token found. Please login.")
      }

      // Prepare request body
      const requestBody: any = { passUUID }
      if (qrId) {
        requestBody.qrId = qrId
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/getTix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const data: GetTixResponse = await response.json()
        console.log("Pass data received:", data)

        if (!data.success) {
          throw new Error("API returned unsuccessful response")
        }

        setPassInfo(data)
        setCurrentPassId({ passUUID, qrId })
        setState('passInfo')
        setIsPending(false)
        setError(null)
      } else if (response.status === 404) {
        setVerificationStatus("Invalid Pass")
        setError("Pass not found. Please check the QR code.")
        setState('error')
        setIsPending(false)
      } else if (response.status === 401) {
        setError("Authentication failed. Please login again.")
        setState('error')
        setIsPending(false)
      } else {
        const errorText = await response.text()
        throw new Error(`Server error ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error("Error fetching pass info:", error)
      setError(error instanceof Error ? error.message : "Failed to verify pass. Please try again.")
      setState('error')
      setIsPending(false)
    }
  }

  const handleAccept = async () => {
    if (!currentPassId || !passInfo) {
      setError("No pass data available")
      return
    }

    setIsPending(true)

    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("No access token found")
      }

      console.log("Accepting pass:", currentPassId.passUUID)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uuid: currentPassId.passUUID, qrId: currentPassId.qrId }),
      })

      if (response.ok) {
        console.log("Pass accepted successfully")
        // Update the pass info to reflect it's now scanned
        const currentTime = new Date().toISOString()
        setPassInfo({
          ...passInfo,
          data: {
            ...passInfo.data,
            isScanned: true,
            timeScanned: currentTime,
          }
        })
        setVerificationStatus(`✅ Pass accepted for ${passInfo.data.buyer}`)
        setState('success')
      } else {
        const errorText = await response.text()
        throw new Error(`Accept failed: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Error accepting pass:", error)
      setError(error instanceof Error ? error.message : "Failed to accept pass. Please try again.")
      setState('error')
    } finally {
      setIsPending(false)
    }
  }

  const handleCancel = () => {
    resetScanner()
  }

  const resetScanner = () => {
    setPassInfo(null)
    setCurrentPassId(null)
    setError(null)
    setVerificationStatus(null)
    setIsPending(false)
    setState('scanning')
  }

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
  )

  const renderPassInfoView = () => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-center text-slate-900 font-bold">Pass Information</CardTitle>
      </CardHeader>
      <CardContent>
        {passInfo && (
          <div className="py-4 space-y-4">
            {/* Buyer Information */}
            <div className="flex items-center space-x-3">
              {/* {passInfo.data.buyerIMG && (
                <img 
                  src={passInfo.data.buyerIMG || "/placeholder.svg"}
                  alt="Buyer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              )} */}
              <div>
                <p className="text-sm text-slate-600 font-medium">Buyer</p>
                <p className="font-bold text-lg text-slate-900">{passInfo.data.person.personName}</p>
              </div>
            </div>

            {/* Event Information */}
            <div>
              <p className="text-sm text-slate-600 font-medium">Event</p>
              <p className="font-bold text-slate-900">{passInfo.data.event}</p>
            </div>

            {/* Pass Status */}
            <div>
              <p className="text-sm text-slate-600 font-medium">Amount</p>
              <p className="font-bold text-slate-900 capitalize">{passInfo.data.amount}</p>
            </div>

            {/* Scan Status Warning */}
            {passInfo.data.person.qrScanned && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <p className="font-bold text-red-800">Already Scanned</p>
                  {passInfo.data.person.scannedAt && (
                    <p className="text-red-700 text-sm mt-1">
                      Scanned: {new Date(passInfo.data.person.scannedAt).toLocaleString()}
                    </p>
                  )}
                </AlertDescription>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="w-full mt-4 text-slate-900 border-slate-300 hover:bg-slate-50"
                >
                  Scan Another
                </Button>
              </Alert>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {passInfo && !passInfo.data.person.qrScanned ? (
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
        ) : passInfo && passInfo.data.isScanned && (
          <div className="mt-6">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-800 font-medium">
                This pass has already been scanned and cannot be accepted again.
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={resetScanner}
              className="w-full mt-4 text-slate-900 border-slate-300 hover:bg-slate-50"
            >
              Scan Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSuccessView = () => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div>
            <h3 className="text-lg font-bold text-green-700">
              Pass Successfully Accepted!
            </h3>
            {verificationStatus && (
              <p className="text-green-600 mt-2 font-medium">{verificationStatus}</p>
            )}
          </div>
          <Button
            onClick={resetScanner}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Continue Scanning
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderErrorView = () => (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <X className="h-16 w-16 text-red-500" />
          <div>
            <h3 className="text-lg font-bold text-red-700">Error</h3>
            {error && (
              <p className="text-red-600 mt-2 font-medium">{error}</p>
            )}
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
  )

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {state === 'scanning' && renderScanningView()}
      {state === 'passInfo' && renderPassInfoView()}
      {state === 'success' && renderSuccessView()}
      {state === 'error' && renderErrorView()}
    </div>
  )
}
