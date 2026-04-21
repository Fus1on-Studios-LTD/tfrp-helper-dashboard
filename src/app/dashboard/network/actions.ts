"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { callInternalApi } from "@/lib/bridge";
import { revalidatePath } from "next/cache";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function unlinkNetworkAccountAction(
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    await callInternalApi("/api/network/unlink", {
      discordId: session.user.discordId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/network");
    return { ok: true, message: "Linked Discord OAuth account removed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to unlink the Discord account." };
  }
}

export async function syncMyNetworkMembershipsAction(
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const result = await callInternalApi("/api/network/sync-user", {
      discordId: session.user.discordId,
      actorId: session.user.discordId,
    });

    const results = Array.isArray(result.results) ? result.results : [];
    const succeeded = results.filter((entry: any) => entry.ok && !entry.skipped).length;
    const skipped = results.filter((entry: any) => entry.skipped).length;
    const failed = results.filter((entry: any) => !entry.ok).length;

    revalidatePath("/dashboard/network");
    return {
      ok: true,
      message: `Network sync complete. Success: ${succeeded}, skipped: ${skipped}, failed: ${failed}.`,
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to sync network memberships." };
  }
}

export async function upsertNetworkRuleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const sourceGuildId = String(formData.get("sourceGuildId") || "").trim();
    const sourceRoleId = String(formData.get("sourceRoleId") || "").trim();
    const targetGuildId = String(formData.get("targetGuildId") || "").trim();
    const globalRoleKey = String(formData.get("globalRoleKey") || "").trim() || null;
    const enabled = String(formData.get("enabled") || "true") === "true";

    if (!sourceGuildId || !sourceRoleId || !targetGuildId) {
      throw new Error("Source guild ID, source role ID, and target guild ID are required.");
    }

    await callInternalApi("/api/network/rules/upsert", {
      sourceGuildId,
      sourceRoleId,
      targetGuildId,
      globalRoleKey,
      enabled,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/network");
    return { ok: true, message: "Network sync rule saved successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save network sync rule." };
  }
}

export async function deleteNetworkRuleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ruleId = String(formData.get("ruleId") || "").trim();

    if (!ruleId) throw new Error("Rule ID is required.");

    await callInternalApi("/api/network/rules/delete", {
      ruleId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/network");
    return { ok: true, message: "Network sync rule deleted successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to delete network sync rule." };
  }
}

export async function toggleNetworkRuleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const ruleId = String(formData.get("ruleId") || "").trim();
    const enabled = String(formData.get("enabled") || "false") === "true";

    if (!ruleId) throw new Error("Rule ID is required.");

    await callInternalApi("/api/network/rules/toggle", {
      ruleId,
      enabled,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/network");
    return { ok: true, message: `Rule ${enabled ? "enabled" : "disabled"} successfully.` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to update rule state." };
  }
}
