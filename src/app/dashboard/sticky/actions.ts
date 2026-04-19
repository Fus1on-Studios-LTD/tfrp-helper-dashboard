"use server";

import { prisma } from "@/lib/prisma";
import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callBridge } from "@/lib/bridge";

export async function upsertStickyAction(formData: FormData) {
  await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const channelId = String(formData.get("channelId") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!guildId || !channelId || !content) {
    throw new Error("Guild ID, Channel ID, and content are required.");
  }

  await prisma.stickyMessage.upsert({
    where: {
      guildId_channelId: {
        guildId,
        channelId,
      },
    },
    update: {
      content,
      updatedAt: new Date(),
    },
    create: {
      guildId,
      channelId,
      content,
    },
  });

  await prisma.auditLog.create({
    data: {
      guildId,
      action: "DASHBOARD_STICKY_UPSERTED",
      metadata: { guildId, channelId },
    },
  });

  revalidatePath("/dashboard/sticky");
}

export async function upsertStickyViaBridgeAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const channelId = String(formData.get("channelId") || "").trim();
  const content = String(formData.get("content") || "").trim();

  await callBridge("/api/sticky/upsert", {
    guildId,
    channelId,
    content,
    actorId: session.user.discordId,
  });

  revalidatePath("/dashboard/sticky");
}

export async function deleteStickyViaBridgeAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const channelId = String(formData.get("channelId") || "").trim();

  await callBridge("/api/sticky/delete", {
    guildId,
    channelId,
    actorId: session.user.discordId,
  });

  revalidatePath("/dashboard/sticky");
}

export async function deleteStickyAction(formData: FormData) {
  await requireDashboardAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    throw new Error("Sticky ID is required.");
  }

  const existing = await prisma.stickyMessage.findUnique({ where: { id } });
  await prisma.stickyMessage.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      guildId: existing?.guildId || null,
      action: "DASHBOARD_STICKY_DELETED",
      metadata: { id, channelId: existing?.channelId || null },
    },
  });

  revalidatePath("/dashboard/sticky");
}
