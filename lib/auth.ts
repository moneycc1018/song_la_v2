import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "@/lib/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    freshAge: 24 * 60 * 60,
    disableSessionRefresh: false,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});
