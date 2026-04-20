import { prisma } from "@/lib/prisma";

export async function getGuildOptions() {
  const guilds = await prisma.guild.findMany({
    orderBy: { name: "asc" },
    take: 200,
  });

  return guilds.map((guild) => ({
    id: guild.id,
    name: guild.name,
  }));
}

export async function getDashboardOverviewByGuild(guildId?: string) {
  const ticketWhere = guildId ? { guildId, status: "open" } : { status: "open" };
  const moderationWhere = guildId
    ? {
        guildId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      }
    : {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      };

  const stickyWhere = guildId ? { guildId } : {};
  const auditWhere = guildId ? { guildId } : {};

  const [staffCount, openTickets, todayModeration, stickyCount, recentAudit] = await Promise.all([
    prisma.staffMember.count(),
    prisma.ticket.count({ where: ticketWhere }),
    prisma.moderationAction.count({ where: moderationWhere }),
    prisma.stickyMessage.count({ where: stickyWhere }),
    prisma.auditLog.findMany({
      where: auditWhere,
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

export async function getOpenTicketsByGuild(guildId?: string) {
  return prisma.ticket.findMany({
    where: {
      status: "open",
      ...(guildId ? { guildId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getStaffRowsByGuild(guildId?: string) {
  if (!guildId) {
    return prisma.staffMember.findMany({
      include: { user: true },
      orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
      take: 100,
    });
  }

  return prisma.staffMember.findMany({
    where: {
      user: {
        actions: {
          some: { guildId },
        },
      },
    },
    include: { user: true },
    orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
    take: 100,
  });
}

export async function getModerationRowsByGuild(guildId?: string) {
  return prisma.moderationAction.findMany({
    where: guildId ? { guildId } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getStickyRowsByGuild(guildId?: string) {
  return prisma.stickyMessage.findMany({
    where: guildId ? { guildId } : {},
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export async function getGuildConfigsByGuild(guildId?: string) {
  return prisma.guildConfig.findMany({
    where: guildId ? { guildId } : {},
    include: { guild: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

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
