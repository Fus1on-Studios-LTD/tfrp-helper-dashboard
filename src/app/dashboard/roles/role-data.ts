import { callInternalApi } from "@/lib/bridge";

export type DiscordRoleOption = {
  id: string;
  name: string;
  color: string;
  position: number;
  managed: boolean;
  mentionable: boolean;
  assignableByBot: boolean;
};

export async function getDiscordRolesForGuild(guildId?: string): Promise<DiscordRoleOption[]> {
  if (!guildId) return [];

  const result = await callInternalApi("/api/discord/guild-roles", {
    guildId,
  }).catch(() => ({ roles: [] }));

  return Array.isArray(result.roles) ? result.roles : [];
}
