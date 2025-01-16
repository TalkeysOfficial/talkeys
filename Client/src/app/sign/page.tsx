"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import image from "../../public/images/Default.png";
import {
  useGoogleLogin,
  GoogleOAuthProvider,
  useGoogleOneTapLogin,
  GoogleLogin,
} from "@react-oauth/google";
import { json } from "stream/consumers";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const router = useRouter();

  // const login = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log("Token Response:", tokenResponse);
  //   },
  //   onError: (error) => {
  //     console.error("Login Failed:", error);
  //   },
  // });

  return (
    <GoogleOAuthProvider clientId="563385258779-75kq583ov98fk7h3dqp5em0639769a61.apps.googleusercontent.com">
      <div
        className="min-h-screen text-white"
        style={{
          backgroundImage: `url(${image.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navbar />

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[calc(100vh)]">
          <div className="relative w-full max-w-6xl px-4">
            {/* Signup Card */}
            <div className="relative bg-[#202020] bg-opacity-80 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-2">Sign Up Now</h2>
                <p className="text-gray-400">Get Started Today!</p>
              </div>

              <div className="space-y-4">
                <button
                  // onClick={() => login()} // Trigger Google login when button is clicked
                  className="w-full py-3 px-4 border border-gray-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
                >
                  {/* <span>Continue with Google</span>
                   */}
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      // console.log(credentialResponse.credential);
                      const response = await fetch(
                        "http://localhost:8000/verify",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${credentialResponse.credential}`,
                          },
                        }
                      );
                      const accessToken = await response.json();
                      console.log(accessToken);
                      localStorage.setItem(
                        "accessToken",
                        accessToken
                      );
                      router.push("/");
                    }}
                    
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                  ;
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">or</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 text-center">
                  By continuing you agree to our{" "}
                  <Link
                    href="http://localhost:3000/terms"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="http://localhost:3000/privacy"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpPage;
