import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const adminIds = (process.env.DASHBOARD_ADMIN_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds+email",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "id" in profile) {
        token.discordId = String(profile.id);
        token.isDashboardAdmin = adminIds.includes(String(profile.id));
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub || "");
        session.user.discordId = String(token.discordId || "");
        session.user.isDashboardAdmin = Boolean(token.isDashboardAdmin);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
