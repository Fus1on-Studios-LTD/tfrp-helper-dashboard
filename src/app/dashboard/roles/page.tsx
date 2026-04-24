import { GlobalRoleMappingManager } from "@/components/roles/global-role-mapping-manager";
import { getSelectedGuildId } from "@/lib/guild-filter";
import { prisma } from "@/lib/prisma";

export default async function RolesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const selectedGuildId = getSelectedGuildId(resolvedSearchParams);

  const [guilds, mappings] = await Promise.all([
    prisma.guild.findMany({
      orderBy: { name: "asc" },
      take: 200,
    }),
    prisma.globalRoleMapping.findMany({
      where: selectedGuildId ? { guildId: selectedGuildId } : {},
      orderBy: [{ guildId: "asc" }, { key: "asc" }],
      take: 300,
    }),
  ]);

  return (
    <GlobalRoleMappingManager
      guilds={guilds}
      mappings={mappings}
      selectedGuildId={selectedGuildId}
    />
  );
}
