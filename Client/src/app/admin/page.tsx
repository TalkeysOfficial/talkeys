import AdminQRScanner from "./QR-Scanner";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminPage() {
	return (
		<ProtectedRoute>
			<div className="container mx-auto px-4 min-h-screen bg-gray-100">
				<AdminQRScanner />
			</div>
		</ProtectedRoute>
	);
}
