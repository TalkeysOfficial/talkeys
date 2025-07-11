"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import image from "@/public/images/Default.png";
import {
	GoogleOAuthProvider,
	GoogleLogin,
	googleLogout,
} from "@react-oauth/google";
import { useAuth } from "@/lib/authContext";

import { useRouter } from "next/navigation";

const SignUpPage = () => {
	const router = useRouter();
	const { isSignedIn, setIsSignedIn } = useAuth();

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		setIsSignedIn(!!token);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("name");
		setIsSignedIn(false);
		googleLogout();
	};

	return (
		<GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com">
			<motion.div
				className="min-h-screen text-white"
				style={{
					backgroundImage: `url(${image.src})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.05 }}
			>
				<Navbar />

				<div className="flex justify-center items-center min-h-[calc(100vh)]">
					<div className="relative w-full max-w-6xl px-4">
						<div className="relative bg-[#202020] bg-opacity-80 rounded-2xl p-8 max-w-md mx-auto">
							<div className="text-center mb-10">
								<h2 className="text-2xl font-bold mb-2">Sign Up Now</h2>
								<p className="text-gray-400">Get Started Today!</p>
							</div>

							<div className="space-y-4">
								{isSignedIn ? (
									<button
										onClick={handleLogout}
										className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
									>
										Logout
									</button>
								) : (
									<button className="w-full py-3 px-4 border-black rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800/20 transition-colors">
										<GoogleLogin
											onSuccess={async (credentialResponse) => {
												const response = await fetch(
													`${process.env.BACKEND_URL}/verify`,
													{
														method: "POST",
														headers: {
															"Content-Type": "application/json",
															Authorization: `Bearer ${credentialResponse.credential}`,
														},
													},
												);
												const data = await response.json();
												localStorage.setItem(
													"accessToken",
													data.accessToken,
												);
												localStorage.setItem("name", data.name);
												setIsSignedIn(true);
												router.push("/");
											}}
											onError={() => {
												console.log("Login Failed");
												router.push("/");
											}}
										/>
									</button>
								)}

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-600"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-2 bg-gray-900 text-gray-400">
											or
										</span>
									</div>
								</div>

								<p className="text-sm text-gray-400 text-center">
									By continuing you agree to our{" "}
									<Link
										href="/t&c"
										target="_blank"
										className="text-purple-400 hover:text-purple-300"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacyPolicy"
										className="text-purple-400 hover:text-purple-300"
									>
										Privacy Policy
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</GoogleOAuthProvider>
	);
};

export default SignUpPage;

{
	/* <button
									// onClick={() => login()} // Trigger Google login when button is clicked
									className="w-full py-3 px-4 border border-gray-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
								>
									{/* <span>Continue with Google</span>
									 */
}
// 	<GoogleLogin
// 		onSuccess={async (credentialResponse) => {
// 			// console.log(credentialResponse.credential);
// 			const response = await fetch(
// 				`${backendURL}/verify`,
// 				{
// 					method: "POST",
// 					headers: {
// 						"Content-Type": "application/json",
// 						Authorization: `Bearer ${credentialResponse.credential}`,
// 					},
// 				},
// 			);
// 			const accessToken = await response.json();
// 			console.log(accessToken);
// 			localStorage.setItem(
// 				"accessToken",
// 				accessToken,
// 			);
// 			setIsSignedIn(true);
// 			router.push("/");
// 		}}
// 		onError={() => {
// 			console.log("Login Failed");
// 			router.push("/");
// 		}}
// 	/>
// 	;
// </button> */}
