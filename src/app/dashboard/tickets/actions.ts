"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function claimTicketAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ticketId = String(formData.get("id") || "").trim();
    if (!ticketId) throw new Error("Ticket ID is required.");

    await callInternalApi("/api/tickets/claim", {
      ticketId,
      claimedById: session.user.discordId,
    });

    revalidatePath("/dashboard/tickets");
    return { ok: true, message: "Ticket claimed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to claim ticket." };
  }
}

export async function unclaimTicketAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ticketId = String(formData.get("id") || "").trim();
    if (!ticketId) throw new Error("Ticket ID is required.");

    await callInternalApi("/api/tickets/unclaim", {
      ticketId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/tickets");
    return { ok: true, message: "Ticket unclaimed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to unclaim ticket." };
  }
}

export async function closeTicketAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ticketId = String(formData.get("id") || "").trim();
    if (!ticketId) throw new Error("Ticket ID is required.");

    await callInternalApi("/api/tickets/close", {
      ticketId,
      closedById: session.user.discordId,
      force: false,
    });

    revalidatePath("/dashboard/tickets");
    return { ok: true, message: "Ticket closed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to close ticket." };
  }
}

export async function forceCloseTicketAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ticketId = String(formData.get("id") || "").trim();
    if (!ticketId) throw new Error("Ticket ID is required.");

    await callInternalApi("/api/tickets/close", {
      ticketId,
      closedById: session.user.discordId,
      force: true,
    });

    revalidatePath("/dashboard/tickets");
    return { ok: true, message: "Ticket force-closed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to force-close ticket." };
  }
}

export async function reopenTicketAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ticketId = String(formData.get("id") || "").trim();
    if (!ticketId) throw new Error("Ticket ID is required.");

    await callInternalApi("/api/tickets/reopen", {
      ticketId,
      reopenedById: session.user.discordId,
    });

    revalidatePath("/dashboard/tickets");
    return { ok: true, message: "Ticket reopened successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to reopen ticket." };
  }
}

export async function getTranscriptAction(ticketId: string) {
  const session = await requireDashboardAdmin();
  void session;

  if (!ticketId) throw new Error("Ticket ID is required.");

  const result = await callInternalApi("/api/tickets/transcript", { ticketId });
  return result;
}
