"use server";

import { prisma } from "@/lib/prisma";
import { requireDashboardAdmin } from "@/lib/guards";
import { revalidatePath } from "next/cache";

async function findStaffUserByDiscordId(discordId: string) {
  return prisma.user.findUnique({
    where: { discordId },
    include: { staff: true },
  });
}

export async function addOrUpdateStaffAction(formData: FormData) {
  await requireDashboardAdmin();

  const discordId = String(formData.get("discordId") || "").trim();
  const rank = String(formData.get("rank") || "").trim();

  if (!discordId || !rank) {
    throw new Error("Discord ID and rank are required.");
  }

  const user = await prisma.user.upsert({
    where: { discordId },
    update: {},
    create: { discordId },
  });

  await prisma.staffMember.upsert({
    where: { userId: user.id },
    update: {
      rank,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      rank,
      strikes: 0,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "DASHBOARD_STAFF_UPSERTED",
      userId: discordId,
      metadata: { discordId, rank },
    },
  });

  revalidatePath("/dashboard/staff");
}

export async function addStrikeAction(formData: FormData) {
  await requireDashboardAdmin();

  const discordId = String(formData.get("discordId") || "").trim();
  const amount = Number(String(formData.get("amount") || "1"));

  if (!discordId || Number.isNaN(amount) || amount < 1) {
    throw new Error("Valid Discord ID and strike amount are required.");
  }

  const user = await findStaffUserByDiscordId(discordId);
  if (!user?.staff) {
    throw new Error("Staff member not found.");
  }

  const updated = await prisma.staffMember.update({
    where: { userId: user.id },
    data: {
      strikes: { increment: amount },
      updatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "DASHBOARD_STAFF_STRIKE_ADDED",
      userId: discordId,
      metadata: { discordId, amount, strikesTotal: updated.strikes },
    },
  });

  revalidatePath("/dashboard/staff");
}

export async function removeStrikeAction(formData: FormData) {
  await requireDashboardAdmin();

  const discordId = String(formData.get("discordId") || "").trim();
  const amount = Number(String(formData.get("amount") || "1"));

  if (!discordId || Number.isNaN(amount) || amount < 1) {
    throw new Error("Valid Discord ID and strike amount are required.");
  }

  const user = await findStaffUserByDiscordId(discordId);
  if (!user?.staff) {
    throw new Error("Staff member not found.");
  }

  const nextStrikes = Math.max(0, user.staff.strikes - amount);

  const updated = await prisma.staffMember.update({
    where: { userId: user.id },
    data: {
      strikes: nextStrikes,
      updatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "DASHBOARD_STAFF_STRIKE_REMOVED",
      userId: discordId,
      metadata: { discordId, amount, strikesTotal: updated.strikes },
    },
  });

  revalidatePath("/dashboard/staff");
}

export async function removeStaffAction(formData: FormData) {
  await requireDashboardAdmin();

  const discordId = String(formData.get("discordId") || "").trim();
  if (!discordId) {
    throw new Error("Discord ID is required.");
  }

  const user = await findStaffUserByDiscordId(discordId);
  if (!user?.staff) {
    throw new Error("Staff member not found.");
  }

  await prisma.staffMember.delete({
    where: { userId: user.id },
  });

  await prisma.auditLog.create({
    data: {
      action: "DASHBOARD_STAFF_REMOVED",
      userId: discordId,
      metadata: { discordId },
    },
  });

  revalidatePath("/dashboard/staff");
}
