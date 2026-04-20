"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { callInternalApi } from "@/lib/bridge";
import { revalidatePath } from "next/cache";

type ActionState = {
  ok: boolean;
  message: string;
};

function parseDurationToMs(value: string) {
  const match = /^([0-9]+)(m|h|d)$/i.exec(value.trim());
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;
  if (unit === "d") return amount * 24 * 60 * 60 * 1000;
  return null;
}

async function runBasicAction(
  path: string,
  guildId: string,
  targetDiscordId: string,
  moderatorId: string,
  reason: string | null,
  extra: Record<string, unknown> = {}
) {
  return callInternalApi(path, {
    guildId,
    targetDiscordId,
    moderatorId,
    reason,
    ...extra,
  });
}

export async function warnAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const targetDiscordId = String(formData.get("targetDiscordId") || "").trim();
    const reason = String(formData.get("reason") || "").trim();

    if (!guildId || !targetDiscordId || !reason) {
      throw new Error("Guild ID, target Discord ID, and reason are required.");
    }

    await runBasicAction("/api/moderation/warn", guildId, targetDiscordId, session.user.discordId, reason);
    revalidatePath("/dashboard/moderation");
    return { ok: true, message: "Warning logged successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to warn user." };
  }
}

export async function noteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const targetDiscordId = String(formData.get("targetDiscordId") || "").trim();
    const reason = String(formData.get("reason") || "").trim();

    if (!guildId || !targetDiscordId || !reason) {
      throw new Error("Guild ID, target Discord ID, and note are required.");
    }

    await runBasicAction("/api/moderation/note", guildId, targetDiscordId, session.user.discordId, reason);
    revalidatePath("/dashboard/moderation");
    return { ok: true, message: "Note saved successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save note." };
  }
}

export async function timeoutAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const targetDiscordId = String(formData.get("targetDiscordId") || "").trim();
    const reason = String(formData.get("reason") || "").trim() || null;
    const duration = String(formData.get("duration") || "").trim();

    const durationMs = parseDurationToMs(duration);
    if (!guildId || !targetDiscordId || !durationMs) {
      throw new Error("Guild ID, target Discord ID, and a valid duration like 10m, 1h, or 1d are required.");
    }

    await runBasicAction(
      "/api/moderation/timeout",
      guildId,
      targetDiscordId,
      session.user.discordId,
      reason,
      { durationMs }
    );

    revalidatePath("/dashboard/moderation");
    return { ok: true, message: "Timeout applied successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to timeout user." };
  }
}

export async function kickAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const targetDiscordId = String(formData.get("targetDiscordId") || "").trim();
    const reason = String(formData.get("reason") || "").trim() || null;

    if (!guildId || !targetDiscordId) {
      throw new Error("Guild ID and target Discord ID are required.");
    }

    await runBasicAction("/api/moderation/kick", guildId, targetDiscordId, session.user.discordId, reason);
    revalidatePath("/dashboard/moderation");
    return { ok: true, message: "Member kicked successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to kick member." };
  }
}

export async function banAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const targetDiscordId = String(formData.get("targetDiscordId") || "").trim();
    const reason = String(formData.get("reason") || "").trim() || null;

    if (!guildId || !targetDiscordId) {
      throw new Error("Guild ID and target Discord ID are required.");
    }

    await runBasicAction("/api/moderation/ban", guildId, targetDiscordId, session.user.discordId, reason);
    revalidatePath("/dashboard/moderation");
    return { ok: true, message: "Member banned successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to ban member." };
  }
}

export async function lookupHistoryAction(targetDiscordId: string, guildId?: string) {
  const session = await requireDashboardAdmin();
  void session;

  if (!targetDiscordId) {
    throw new Error("Target Discord ID is required.");
  }

  return callInternalApi("/api/moderation/history", {
    targetDiscordId,
    guildId: guildId || null,
  });
}
