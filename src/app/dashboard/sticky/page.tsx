import { Panel } from "@/components/ui/card";
import { getStickyRows } from "@/lib/data";

export default async function StickyPage() {
  const rows = await getStickyRows();

  return (
    <Panel title="Sticky Messages">
      <table>
        <thead>
          <tr>
            <th>Guild</th>
            <th>Channel</th>
            <th>Message ID</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.guildId}</td>
              <td>{row.channelId}</td>
              <td>{row.messageId || "—"}</td>
              <td>{new Date(row.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
        Wire create/update/delete actions here next.
      </div>
    </Panel>
  );
}
