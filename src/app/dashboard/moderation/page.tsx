import { Panel } from "@/components/ui/card";
import { getModerationRowsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";

export default async function ModerationPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const rows = await getModerationRowsByGuild(guildId || undefined);

  return (
    <Panel title={guildId ? "Moderation Log (Guild Scope)" : "Moderation Log"}>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Target User</th>
            <th>Moderator</th>
            <th>Guild</th>
            <th>Reason</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.type}</td>
              <td>{row.userId}</td>
              <td>{row.moderatorId}</td>
              <td>{row.guildId || "Global"}</td>
              <td>{row.reason || "—"}</td>
              <td>{new Date(row.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
