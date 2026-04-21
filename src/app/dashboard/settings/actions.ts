"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function updateGuildConfigAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

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

    await callInternalApi("/api/settings/guild-config", {
      guildId,
      guildName: null,
      modLogChannelId,
      ticketCategoryId,
      ticketLogChannelId,
      stickyCooldownMs,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/settings");
    return { ok: true, message: "Guild settings saved successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save guild settings." };
  }
}
