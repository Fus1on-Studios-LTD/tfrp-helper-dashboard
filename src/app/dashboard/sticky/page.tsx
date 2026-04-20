import { Panel } from "@/components/ui/card";
import { getStickyRows } from "@/lib/data";
import { upsertStickyAction, deleteStickyAction } from "./actions";

export default async function StickyPage() {
  const rows = await getStickyRows();

  return (
    <div className="page-stack">
      <Panel title="Create or Update Sticky Message">
        <form action={upsertStickyAction} style={{ display: "grid", gap: 12 }}>
          <input name="guildId" placeholder="Guild ID" style={inputStyle} required />
          <input name="channelId" placeholder="Channel ID" style={inputStyle} required />
          <textarea name="content" placeholder="Sticky content" style={{ ...inputStyle, minHeight: 140 }} required />
          <button style={buttonStyle}>Save Sticky Message</button>
        </form>
      </Panel>

      <Panel title="Existing Sticky Messages">
        <table>
          <thead>
            <tr>
              <th>Guild</th>
              <th>Channel</th>
              <th>Preview</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.guildId}</td>
                <td>{row.channelId}</td>
                <td>{row.content.slice(0, 80)}{row.content.length > 80 ? "..." : ""}</td>
                <td>{new Date(row.updatedAt).toLocaleString()}</td>
                <td>
                  <form action={deleteStickyAction}>
                    <input type="hidden" name="guildId" value={row.guildId} />
                    <input type="hidden" name="channelId" value={row.channelId} />
                    <button style={dangerButtonStyle}>Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

const inputStyle = {
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  padding: "0.9rem 1rem",
};

const buttonStyle = {
  borderRadius: 12,
  background: "#f97316",
  color: "white",
  padding: "0.9rem 1rem",
  fontWeight: 700,
};

const dangerButtonStyle = {
  borderRadius: 10,
  background: "#dc2626",
  color: "white",
  padding: "0.55rem 0.9rem",
  fontWeight: 700,
};
