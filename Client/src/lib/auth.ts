import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from 'next/server'; // Import to use NextResponse

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
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ account }) {
            if (account?.id_token) {
                console.log("Setting cookie on the frontend", account?.id_token);
                return true;
            }
            return false;
        },
    },
    secret: process.env.SECRET as string,
};
