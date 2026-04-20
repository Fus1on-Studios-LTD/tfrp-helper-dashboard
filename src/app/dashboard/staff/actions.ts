"use server";

import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";
import { callInternalApi } from "@/lib/bridge";

export async function addOrUpdateStaffAction(formData: FormData) {
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
}

export async function addStrikeAction(formData: FormData) {
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
}

export async function removeStrikeAction(formData: FormData) {
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
}

export async function removeStaffAction(_formData: FormData) {
  throw new Error("Staff removal is not implemented in the internal API yet.");
}
