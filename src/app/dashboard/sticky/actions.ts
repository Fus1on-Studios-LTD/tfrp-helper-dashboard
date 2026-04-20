"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

export async function upsertStickyAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const channelId = String(formData.get("channelId") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!guildId || !channelId || !content) {
    throw new Error("Guild ID, Channel ID, and content are required.");
  }

  await callInternalApi("/api/sticky/upsert", {
    guildId,
    channelId,
    content,
    actorId: session.user.discordId,
  });

  revalidatePath("/dashboard/sticky");
}

export async function deleteStickyAction(formData: FormData) {
  const session = await requireDashboardAdmin();

  const guildId = String(formData.get("guildId") || "").trim();
  const channelId = String(formData.get("channelId") || "").trim();

  if (!guildId || !channelId) {
    throw new Error("Guild ID and Channel ID are required.");
  }

  await callInternalApi("/api/sticky/delete", {
    guildId,
    channelId,
    actorId: session.user.discordId,
  });

  revalidatePath("/dashboard/sticky");
}
