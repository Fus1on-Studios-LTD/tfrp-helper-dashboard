"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

export async function claimTicketAction(formData: FormData) {
  const session = await requireDashboardAdmin();
  const ticketId = String(formData.get("id") || "").trim();

  if (!ticketId) {
    throw new Error("Ticket ID is required.");
  }

  await callInternalApi("/api/tickets/claim", {
    ticketId,
    claimedById: session.user.discordId,
  });

  revalidatePath("/dashboard/tickets");
}

export async function closeTicketAction(formData: FormData) {
  const session = await requireDashboardAdmin();
  const ticketId = String(formData.get("id") || "").trim();

  if (!ticketId) {
    throw new Error("Ticket ID is required.");
  }

  await callInternalApi("/api/tickets/close", {
    ticketId,
    closedById: session.user.discordId,
  });

  revalidatePath("/dashboard/tickets");
}
