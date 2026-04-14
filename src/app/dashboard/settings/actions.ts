"use server";

import { prisma } from "@/lib/prisma";
import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";

export async function updateGuildConfigAction(formData: FormData) {
  await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const modLogChannelId = String(formData.get("modLogChannelId") || "").trim() || null;
  const ticketCategoryId = String(formData.get("ticketCategoryId") || "").trim() || null;
  const ticketLogChannelId = String(formData.get("ticketLogChannelId") || "").trim() || null;
  const stickyCooldownMsRaw = String(formData.get("stickyCooldownMs") || "").trim();

  if (!guildId) {
    throw new Error("Guild ID is required.");
  }

  const stickyCooldownMs = Number(stickyCooldownMsRaw || "15000");
  if (Number.isNaN(stickyCooldownMs) || stickyCooldownMs < 0) {
    throw new Error("Sticky cooldown must be a valid non-negative number.");
  }

  await prisma.guildConfig.upsert({
    where: { guildId },
    update: {
      modLogChannelId,
      ticketCategoryId,
      ticketLogChannelId,
      stickyCooldownMs,
    },
    create: {
      guildId,
      modLogChannelId,
      ticketCategoryId,
      ticketLogChannelId,
      stickyCooldownMs,
    },
  });

  await prisma.auditLog.create({
    data: {
      guildId,
      action: "DASHBOARD_GUILD_CONFIG_UPDATED",
      userId: null,
      metadata: {
        modLogChannelId,
        ticketCategoryId,
        ticketLogChannelId,
        stickyCooldownMs,
      },
    },
  });

  revalidatePath("/dashboard/settings");
}
