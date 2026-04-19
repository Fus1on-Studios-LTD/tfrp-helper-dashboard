"use server";

import { prisma } from "@/lib/prisma";
import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callBridge } from "@/lib/bridge";

export async function claimTicketAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Ticket ID is required.");

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      claimedById: session.user.discordId,
      updatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      guildId: ticket.guildId,
      action: "DASHBOARD_TICKET_CLAIMED",
      userId: session.user.discordId,
      metadata: { ticketId: ticket.id, channelId: ticket.channelId },
    },
  });

  revalidatePath("/dashboard/tickets");
}

export async function claimTicketViaBridgeAction(formData: FormData) {
  const session = await requireDashboardAdmin();
  const ticketId = String(formData.get("id") || "").trim();
  const guildId = String(formData.get("guildId") || "").trim();

  await callBridge("/api/tickets/claim", {
    ticketId,
    guildId,
    claimedById: session.user.discordId,
  });

  revalidatePath("/dashboard/tickets");
}

export async function closeTicketViaBridgeAction(formData: FormData) {
  const session = await requireDashboardAdmin();
  const ticketId = String(formData.get("id") || "").trim();

  await callBridge("/api/tickets/close", {
    ticketId,
    closedById: session.user.discordId,
  });

  revalidatePath("/dashboard/tickets");
}

export async function closeTicketAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Ticket ID is required.");

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      status: "closed",
      closedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      guildId: ticket.guildId,
      action: "DASHBOARD_TICKET_CLOSED",
      userId: session.user.discordId,
      metadata: { ticketId: ticket.id, channelId: ticket.channelId },
    },
  });

  revalidatePath("/dashboard/tickets");
}
