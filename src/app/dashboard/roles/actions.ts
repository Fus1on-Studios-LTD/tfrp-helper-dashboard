"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { callInternalApi } from "@/lib/bridge";
import { revalidatePath } from "next/cache";

type ActionState = { ok: boolean; message: string };

function normalizeKey(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}

export async function upsertGlobalRoleMappingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const guildId = String(formData.get("guildId") || "").trim();
    const key = normalizeKey(String(formData.get("key") || ""));
    const roleId = String(formData.get("roleId") || "").trim();

    if (!guildId || !key || !roleId) {
      throw new Error("Guild ID, key, and role ID are required.");
    }

    await callInternalApi("/api/globalroles/mappings/upsert", {
      guildId,
      key,
      roleId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/roles");
    return { ok: true, message: `Global role mapping ${key} saved successfully.` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save global role mapping." };
  }
}

export async function deleteGlobalRoleMappingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();
    const mappingId = String(formData.get("mappingId") || "").trim();

    if (!mappingId) throw new Error("Mapping ID is required.");

    await callInternalApi("/api/globalroles/mappings/delete", {
      mappingId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/roles");
    return { ok: true, message: "Global role mapping deleted successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to delete global role mapping." };
  }
}
