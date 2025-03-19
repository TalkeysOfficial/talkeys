"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({
	children,
}: Readonly<ProtectedRouteProps>) {
	const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		const checkAuthorization = async () => {
			try {
				const response = await fetch(`${process.env.BACKEND_URL}/CanScan`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"accessToken",
						)}`,
					},
				});

				if (response.status == 200) {
					setIsAuthorized(true);
				} else if (response.status == 403) {
					setIsAuthorized(false);
					router.push("/");
				}
			} catch (error) {
				console.error("Error checking authorization:", error);
				setIsAuthorized(false);
				router.push("/");
			}
		};

		checkAuthorization();
	}, [router]);

	if (!isAuthorized) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading...
			</div>
		);
	}

	return isAuthorized ? <>{children}</> : null;
}
