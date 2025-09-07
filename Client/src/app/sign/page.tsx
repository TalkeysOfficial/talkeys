"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
    const router = useRouter();
    const { isSignedIn, setIsSignedIn } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsSignedIn(!!token);
    }, [setIsSignedIn]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("name");
        setIsSignedIn(false);
        googleLogout();
        // Optional: redirect to home or login page after logout
        // router.push('/'); 
    };

    return (
        <GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com">
            <motion.div
                className="min-h-screen"
                // MODIFIED: Background now has a subtle dot-grid pattern over the gradient
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.04) 1px, transparent 0),
                        linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)
                    `,
                    backgroundSize: `25px 25px, cover`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.05 }}
            >
                <Navbar />

                {/* MODIFIED: Reverted to a centered single-column layout */}
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-[#102542] mb-2">
                                    {isSignedIn ? "Welcome Back!" : "Get Started"}
                                </h2>
                                <p className="text-gray-500">
                                    {isSignedIn ? "You are currently signed in." : "Create your account today."}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {isSignedIn ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3 px-4 bg-[#F87060] text-white font-bold rounded-full hover:bg-[#F87060]/90 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <div className="flex justify-center">
                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                const response = await fetch(
                                                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${credentialResponse.credential}`,
                                                        },
                                                    },
                                                );
                                                const data = await response.json();
                                                localStorage.setItem("accessToken", data.accessToken);
                                                localStorage.setItem("name", data.name);
                                                setIsSignedIn(true);
                                                router.push("/");
                                            }}
                                            onError={() => {
                                                console.log("Login Failed");
                                            }}
                                            theme="outline"
                                            size="large"
                                            shape="pill"
                                            width="300px"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-400">or</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    By continuing you agree to our{" "}
                                    <Link
                                        href="/t&c"
                                        target="_blank"
                                        className="font-medium text-[#F87060] hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacyPolicy"
                                        className="font-medium text-[#F87060] hover:underline"
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