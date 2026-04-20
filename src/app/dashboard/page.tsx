import { Card, Panel } from "@/components/ui/card";
import { getDashboardOverviewByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const data = await getDashboardOverviewByGuild(guildId || undefined);

  return (
    <div className="page-stack">
      <div className="cards">
        <Card title="Staff Members" value={data.staffCount} subtitle={guildId ? "Filtered view" : "Tracked inside the staff system"} />
        <Card title="Open Tickets" value={data.openTickets} subtitle={guildId ? "For selected guild" : "Currently unresolved"} />
        <Card title="Moderation Today" value={data.todayModeration} subtitle={guildId ? "For selected guild" : "Warnings, bans, timeouts, and more"} />
        <Card title="Sticky Messages" value={data.stickyCount} subtitle={guildId ? "For selected guild" : "Configured across channels"} />
      </div>

      <Panel title={guildId ? `Recent Audit Activity (Guild Scope)` : "Recent Audit Activity"}>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>Guild</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.recentAudit.map((row) => (
              <tr key={row.id}>
                <td>{row.action}</td>
                <td>{row.userId || "—"}</td>
                <td>{row.guildId || "Global"}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
