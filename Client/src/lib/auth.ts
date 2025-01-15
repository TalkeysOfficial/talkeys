import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"; // For creating a custom JWT (if needed)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  secret: process.env.SECRET as string,
  
  callbacks: {
    // When JWT is created, add user info from Google
    async jwt({ token, account, user }) {
      // If account is available (i.e., the user is signing in for the first time)
      if (account && user) {
        // Fetch user info from Google API using fetch
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        });

        if (res.ok) {
          const googleUserData = await res.json(); // Parse the response JSON
          // Add Google user info to the JWT
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;
          token.googleUserData = googleUserData; // Store full user info if needed
        } else {
          console.error("Failed to fetch user info from Google API");
        }
      }
      return token;
    },
    // This callback ensures the session object has the modified JWT data
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.googleUserData = token.googleUserData; // Store the custom user data in session
      }
      return session;
    },
  }
};
