import { getDashboardOverview } from "@/lib/data";
import { Card, Panel } from "@/components/ui/card";

export default async function DashboardPage() {
  const data = await getDashboardOverview();

  return (
    <div className="page-stack">
      <div className="cards">
        <Card title="Staff Members" value={data.staffCount} subtitle="Tracked inside the staff system" />
        <Card title="Open Tickets" value={data.openTickets} subtitle="Currently unresolved" />
        <Card title="Moderation Today" value={data.todayModeration} subtitle="Warnings, bans, timeouts, and more" />
        <Card title="Sticky Messages" value={data.stickyCount} subtitle="Configured across channels" />
      </div>

      <Panel title="Recent Audit Activity">
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
