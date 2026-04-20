"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function addOrUpdateStaffAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const discordId = String(formData.get("discordId") || "").trim();
    const rank = String(formData.get("rank") || "").trim();

    if (!discordId || !rank) {
      throw new Error("Discord ID and rank are required.");
    }

    await callInternalApi("/api/staff/upsert", {
      discordId,
      rank,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/staff");
    return { ok: true, message: "Staff member saved successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save staff member." };
  }
}

export async function addStrikeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const discordId = String(formData.get("discordId") || "").trim();
    const amount = Number(String(formData.get("amount") || "1"));

    if (!discordId || Number.isNaN(amount) || amount < 1) {
      throw new Error("Valid Discord ID and strike amount are required.");
    }

    await callInternalApi("/api/staff/strikes", {
      discordId,
      amount,
      mode: "add",
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/staff");
    return { ok: true, message: "Strike added successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to add strike." };
  }
}

export async function removeStrikeAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const discordId = String(formData.get("discordId") || "").trim();
    const amount = Number(String(formData.get("amount") || "1"));

    if (!discordId || Number.isNaN(amount) || amount < 1) {
      throw new Error("Valid Discord ID and strike amount are required.");
    }

    await callInternalApi("/api/staff/strikes", {
      discordId,
      amount,
      mode: "remove",
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/staff");
    return { ok: true, message: "Strike removed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to remove strike." };
  }
}

export async function removeStaffAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const session = await requireDashboardAdmin();

    const discordId = String(formData.get("discordId") || "").trim();

    if (!discordId) {
      throw new Error("Discord ID is required.");
    }

    await callInternalApi("/api/staff/remove", {
      discordId,
      actorId: session.user.discordId,
    });

    revalidatePath("/dashboard/staff");
    return { ok: true, message: "Staff member removed successfully." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to remove staff member." };
  }
}
