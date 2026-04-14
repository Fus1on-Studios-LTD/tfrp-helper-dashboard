import { Panel } from "@/components/ui/card";
import { getGuildConfigs } from "@/lib/data";

export default async function SettingsPage() {
  const rows = await getGuildConfigs();

  return (
    <Panel title="Guild Settings">
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
  );
}
