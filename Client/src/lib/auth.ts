import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server"; // Import to use NextResponse
import { setCookie } from "cookies-next";

import { useSearchParams } from "next/navigation";
const backendURL = process.env.BACKEND_URL;
export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.CLIENT_ID!,
			clientSecret: process.env.CLIENT_SECRET!,
			// Set the authorization URL to include the callback URL
			authorization: {
				params: {
					redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
				},
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ account, profile }) {
			console.log(account, profile);
			if (account?.id_token) {
				setCookie("jwt", account.id_token, {
					httpOnly: true,
					sameSite: "strict",
					secure: false,
					path: "/",
				});

                const response = await fetch('http://localhost:8000/verify',{
                    credentials:"include",
                    method:"GET"
                });
                const data = await response.json();
                console.log(data); 

				return true;
			}
			return false;
		},
	},
	secret: process.env.SECRET as string,
};
