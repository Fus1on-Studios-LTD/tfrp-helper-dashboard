"use server";

import { prisma } from "@/lib/prisma";
import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";

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
