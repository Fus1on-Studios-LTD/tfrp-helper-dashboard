import { Panel } from "@/components/ui/card";
import { getModerationRows } from "@/lib/data";

export default async function ModerationPage() {
  const rows = await getModerationRows();

  return (
    <Panel title="Moderation Log">
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
