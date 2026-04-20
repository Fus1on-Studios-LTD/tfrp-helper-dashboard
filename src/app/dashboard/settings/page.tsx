import { Panel } from "@/components/ui/card";
import { ActionForm } from "@/components/ui/action-form";
import { getGuildConfigsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";
import { updateGuildConfigAction } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const rows = await getGuildConfigsByGuild(guildId || undefined);

  return (
    <div className="page-stack">
      <Panel title={guildId ? "Update Guild Config (Selected Guild)" : "Update Guild Config"}>
        <ActionForm
          action={updateGuildConfigAction}
          idleText="Save Guild Config"
          pendingText="Saving..."
          className="grid"
        >
          <input name="guildId" placeholder="Guild ID" style={inputStyle} required defaultValue={guildId} />
          <input name="modLogChannelId" placeholder="Mod Log Channel ID" style={inputStyle} />
          <input name="ticketCategoryId" placeholder="Ticket Category ID" style={inputStyle} />
          <input name="ticketLogChannelId" placeholder="Ticket Log Channel ID" style={inputStyle} />
          <input name="stickyCooldownMs" placeholder="Sticky Cooldown (ms)" style={inputStyle} defaultValue="15000" />
        </ActionForm>
      </Panel>

      <Panel title={guildId ? "Current Guild Settings (Guild Scope)" : "Current Guild Settings"}>
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
