import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    secret: process.env.SECRET as string,
};