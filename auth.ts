import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { db } from "@/db"; // your drizzle instance
import { headers } from "next/headers";
import { getUserRoleByUserId } from "./db/queries";

export const auth = betterAuth({
  plugins: [
    customSession(async ({ user, session }) => {
      const role = await getUserRoleByUserId(session.userId);
      return {
        user: {
          ...user,
          role: role,
        },
        session,
      };
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  pages: {
    signIn: "/login",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

export const getSession = async () =>
  auth.api.getSession({
    headers: await headers(),
  });
