import type React from "react";
import Link from "next/link";
import { QrCode, PlusCircle, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ProtectedRoute>
			<div className="flex min-h-screen bg-gray-950 text-white pt-10">
				{/* Desktop Sidebar */}
				<aside className="hidden md:flex w-64 flex-col bg-gray-900 p-4">
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

				{/* Mobile Header with Sheet */}
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="md:hidden absolute top-4 left-4 z-50"
						>
							<LayoutDashboard className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="left"
						className="w-64 bg-gray-900 p-4"
					>
						<SheetHeader>
							<SheetTitle className="text-2xl font-bold mb-6 text-white">
								Admin Dashboard
							</SheetTitle>
						</SheetHeader>
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
					</SheetContent>
				</Sheet>

				{/* Main Content */}
				<main className="flex-1 p-4 md:p-8">{children}</main>
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
