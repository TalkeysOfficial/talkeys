import React from "react";
import Head from "next/head";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<ProtectedRoute>
			<div>
				<Head>
					<title>Admin Panel</title>
					<meta
						name="description"
						content="Admin panel layout"
					/>
				</Head>
				<header>
					<nav>
						<ul>
							<li>
								<Link href="/admin/qrScanner">QR Scanner</Link>
							</li>
							<li>
								<Link href="/admin/addEvent">Add Event</Link>
							</li>
						</ul>
					</nav>
				</header>
				<main>{children}</main>
				<footer>
					<p>© 2023 Your Company</p>
				</footer>
			</div>
		</ProtectedRoute>
	);
};

export default Layout;
