"use client"

import { useState } from "react"
import QRCode from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function QRCodeGenerator() {
  const [userId, setUserId] = useState("")
  const [qrValue, setQrValue] = useState("")

  const generateQR = () => {
    setQrValue(`${window.location.origin}/api/verify-user/${userId}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="userId">User ID</Label>
        <Input id="userId" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
      </div>
      <Button onClick={generateQR}>Generate QR Code</Button>
      {qrValue && (
        <div className="mt-4">
          <QRCode value={qrValue} size={256} />
        </div>
      )}
    </div>
  )
}

