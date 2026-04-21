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
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to unlink the Discord account.",
    };
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
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to sync network memberships.",
    };
  }
}
