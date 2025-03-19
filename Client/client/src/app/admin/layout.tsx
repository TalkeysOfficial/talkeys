import type React from "react";
import Link from "next/link";
import { QrCode, PlusCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayoutClient from "./layout-client";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-950 text-white pt-20">
				{/* Desktop Sidebar */}
				<aside className="hidden md:flex w-64 flex-col bg-gray-900 p-4 min-h-screen fixed left-0 top-0 pt-24">
					<h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
					<nav className="space-y-4">
						<SidebarLink
							href="/admin"
							icon={LayoutDashboard}
						>
							Dashboard
						</SidebarLink>
						<SidebarLink
							href="/admin/qrScanner"
							icon={QrCode}
						>
							QR Code Reader
						</SidebarLink>
						<SidebarLink
							href="/admin/addEvent"
							icon={PlusCircle}
						>
							Add Event
						</SidebarLink>
					</nav>
				</aside>

				{/* Mobile Navigation - Client Component */}
				<AdminLayoutClient />

				{/* Main Content */}
				<main className="flex-1 p-4 md:p-8 md:ml-64">{children}</main>
			</div>
		</ProtectedRoute>
	);
};

const SidebarLink = ({
	href,
	icon: Icon,
	children,
}: {
	href: string;
	icon: React.ElementType;
	children: React.ReactNode;
}) => (
	<Link
		href={href}
		className={cn(
			"flex items-center space-x-2 text-gray-300 hover:text-white transition-colors",
			"rounded-lg p-2 hover:bg-gray-800",
		)}
	>
		<Icon className="h-5 w-5" />
		<span>{children}</span>
	</Link>
);

export default AdminLayout;
