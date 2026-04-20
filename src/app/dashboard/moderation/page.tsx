import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { ModerationHistoryPanel } from "@/components/moderation/moderation-history-panel";
import { getModerationRowsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";
import {
  warnAction,
  noteAction,
  timeoutAction,
  kickAction,
  banAction,
} from "./actions";

export default async function ModerationPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const selectedUser = Array.isArray(resolvedSearchParams.user)
    ? (resolvedSearchParams.user[0] || "")
    : (resolvedSearchParams.user || "");

  const rows = await getModerationRowsByGuild(guildId || undefined);

  return (
    <div className="page-stack">
      <Panel title={guildId ? "Moderation Controls (Selected Guild)" : "Moderation Controls"}>
        <div style={{ display: "grid", gap: 16 }}>
          <ActionForm action={warnAction} idleText="Warn User" pendingText="Saving..." className="grid">
            <input name="guildId" defaultValue={guildId} placeholder="Guild ID" style={inputStyle} required />
            <input name="targetDiscordId" placeholder="Target Discord ID" style={inputStyle} required />
            <input name="reason" placeholder="Warning reason" style={inputStyle} required />
          </ActionForm>

          <ActionForm action={noteAction} idleText="Add Note" pendingText="Saving..." className="grid">
            <input name="guildId" defaultValue={guildId} placeholder="Guild ID" style={inputStyle} required />
            <input name="targetDiscordId" placeholder="Target Discord ID" style={inputStyle} required />
            <input name="reason" placeholder="Internal note" style={inputStyle} required />
          </ActionForm>

          <ActionForm action={timeoutAction} idleText="Timeout User" pendingText="Applying..." className="grid">
            <input name="guildId" defaultValue={guildId} placeholder="Guild ID" style={inputStyle} required />
            <input name="targetDiscordId" placeholder="Target Discord ID" style={inputStyle} required />
            <input name="duration" placeholder="Duration like 10m, 1h, 1d" style={inputStyle} required />
            <input name="reason" placeholder="Timeout reason" style={inputStyle} />
          </ActionForm>

          <ActionForm action={kickAction} idleText="Kick User" pendingText="Kicking..." className="grid">
            <input name="guildId" defaultValue={guildId} placeholder="Guild ID" style={inputStyle} required />
            <input name="targetDiscordId" placeholder="Target Discord ID" style={inputStyle} required />
            <input name="reason" placeholder="Kick reason" style={inputStyle} />
          </ActionForm>

          <DangerActionForm
            action={banAction}
            idleText="Ban User"
            pendingText="Banning..."
            confirmMessage="Ban this user from the selected guild?"
          >
            <input name="guildId" defaultValue={guildId} placeholder="Guild ID" style={inputStyle} required />
            <input name="targetDiscordId" placeholder="Target Discord ID" style={inputStyle} required />
            <input name="reason" placeholder="Ban reason" style={inputStyle} />
          </DangerActionForm>
        </div>
      </Panel>

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
              <th>Lookup</th>
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
                <td>
                  <a
                    href={`?${new URLSearchParams({
                      ...(guildId ? { guild: guildId } : {}),
                      user: row.userId,
                    }).toString()}`}
                    style={linkButtonStyle}
                  >
                    View History
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedUser ? (
          <ModerationHistoryPanel targetDiscordId={selectedUser} guildId={guildId || undefined} />
        ) : null}
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

const linkButtonStyle = {
  display: "inline-block",
  borderRadius: 10,
  background: "#1d4ed8",
  color: "white",
  padding: "0.55rem 0.9rem",
  fontWeight: 700,
  textDecoration: "none",
};
