import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        // Simple check (in production use bcrypt)
        const user = await User.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
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
