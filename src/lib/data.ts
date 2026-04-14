import { prisma } from "@/lib/prisma";

export async function getDashboardOverview() {
  const [staffCount, openTickets, todayModeration, stickyCount, recentAudit] = await Promise.all([
    prisma.staffMember.count(),
    prisma.ticket.count({ where: { status: "open" } }),
    prisma.moderationAction.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.stickyMessage.count(),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    staffCount,
    openTickets,
    todayModeration,
    stickyCount,
    recentAudit,
  };
}

export async function getOpenTickets() {
  return prisma.ticket.findMany({
    where: { status: "open" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getStaffRows() {
  return prisma.staffMember.findMany({
    include: { user: true },
    orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    take: 100,
  });
}

export async function getModerationRows() {
  return prisma.moderationAction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getStickyRows() {
  return prisma.stickyMessage.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export async function getGuildConfigs() {
  return prisma.guildConfig.findMany({
    include: { guild: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}
