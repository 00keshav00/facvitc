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
        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user._id, name: "Admin", email: user.email };
        }
        return null;
      }
    })
  ],
  // Default pages will be used
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "secret", // Use env in production
});

export { handler as GET, handler as POST };
