import { Panel } from "@/components/ui/card";
import { getGuildConfigs } from "@/lib/data";
import { updateGuildConfigAction } from "./actions";

export default async function SettingsPage() {
  const rows = await getGuildConfigs();

  return (
    <div className="page-stack">
      <Panel title="Update Guild Config">
        <form action={updateGuildConfigAction} style={{ display: "grid", gap: 12 }}>
          <input name="guildId" placeholder="Guild ID" style={inputStyle} required />
          <input name="modLogChannelId" placeholder="Mod Log Channel ID" style={inputStyle} />
          <input name="ticketCategoryId" placeholder="Ticket Category ID" style={inputStyle} />
          <input name="ticketLogChannelId" placeholder="Ticket Log Channel ID" style={inputStyle} />
          <input name="stickyCooldownMs" placeholder="Sticky Cooldown (ms)" style={inputStyle} defaultValue="15000" />
          <button style={buttonStyle}>Save Guild Config</button>
        </form>
      </Panel>

      <Panel title="Current Guild Settings">
        <table>
          <thead>
            <tr>
              <th>Guild</th>
              <th>Mod Log</th>
              <th>Ticket Category</th>
              <th>Ticket Log</th>
              <th>Sticky Cooldown</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.guild?.name || row.guildId}</td>
                <td>{row.modLogChannelId || "—"}</td>
                <td>{row.ticketCategoryId || "—"}</td>
                <td>{row.ticketLogChannelId || "—"}</td>
                <td>{row.stickyCooldownMs}ms</td>
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
