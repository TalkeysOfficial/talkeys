import PaymentForm from "../../components/PaymentForm"
import QRCodeGenerator from "../../components/QRCodeGenerator"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">PhonePe Payment and QR Code App</h1>
      <div className="flex gap-8">
        <PaymentForm />
        <QRCodeGenerator />
      </div>
    </main>
  )
}

