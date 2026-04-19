import { auth } from "@/lib/auth";

export async function requireDashboardAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated.");
  }

  if (!session.user.isDashboardAdmin) {
    throw new Error("You do not have dashboard admin access.");
  }

  return session;
}
