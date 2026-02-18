import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Attempting to authorize user:", credentials.email);
        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log("Authorization failed: User not found.");
            return null;
          }

          console.log("User found. Comparing passwords...");
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

          if (passwordsMatch) {
            console.log("Authorization successful.");
            return { id: user._id, name: "Admin", email: user.email };
          } else {
            console.log("Authorization failed: Passwords do not match.");
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
