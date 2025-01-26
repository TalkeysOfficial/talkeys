import AdminQRScanner from "@/app/admin/QR-Scanner";
import ProtectedRoute from "@/app/admin/ProtectedRoute";

export default function AdminPage() {
	return (
		<ProtectedRoute>
			<div className="container mx-auto px-4 min-h-screen bg-gray-100">
				<AdminQRScanner />
			</div>
		</ProtectedRoute>
	);
}
