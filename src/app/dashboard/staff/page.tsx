import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { StaffProfilePanel } from "@/components/staff/staff-profile-panel";
import { getStaffRowsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";
import {
  addOrUpdateStaffAction,
  addStrikeAction,
  removeStrikeAction,
  removeStaffAction,
} from "./actions";

export default async function StaffPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const selectedStaff = Array.isArray(resolvedSearchParams.staff)
    ? (resolvedSearchParams.staff[0] || "")
    : (resolvedSearchParams.staff || "");

  const rows = await getStaffRowsByGuild(guildId || undefined);

  return (
    <div className="page-stack">
      <Panel title={guildId ? "Add or Update Staff Member (Global record)" : "Add or Update Staff Member"}>
        <ActionForm
          action={addOrUpdateStaffAction}
          idleText="Save Staff Member"
          pendingText="Saving..."
          className="grid"
        >
          <input name="discordId" placeholder="Discord ID" style={inputStyle} required />
          <input name="rank" placeholder="Rank" style={inputStyle} required />
          <textarea name="note" placeholder="Optional note for audit log" style={{ ...inputStyle, minHeight: 100 }} />
        </ActionForm>
      </Panel>

      <Panel title={guildId ? "Staff Operations (Guild Scope)" : "Staff Operations"}>
        <table>
          <thead>
            <tr>
              <th>Discord ID</th>
              <th>Rank</th>
              <th>Strikes</th>
              <th>Added</th>
              <th>Quick Actions</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.user.discordId}</td>
                <td>{row.rank}</td>
                <td>{row.strikes}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
                <td>
                  <div style={{ display: "grid", gap: 8, alignItems: "flex-start" }}>
                    <ActionForm action={addStrikeAction} idleText="+1 Strike" pendingText="Adding...">
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                      <input type="text" name="reason" placeholder="Reason (optional)" style={smallInputStyle} />
                    </ActionForm>
                    <ActionForm action={removeStrikeAction} idleText="-1 Strike" pendingText="Removing...">
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                      <input type="text" name="reason" placeholder="Reason (optional)" style={smallInputStyle} />
                    </ActionForm>
                    <DangerActionForm
                      action={removeStaffAction}
                      idleText="Remove"
                      pendingText="Removing..."
                      confirmMessage="Remove this staff member?"
                    >
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="text" name="reason" placeholder="Reason (optional)" style={smallInputStyle} />
                    </DangerActionForm>
                  </div>
                </td>
                <td>
                  <a
                    href={`?${new URLSearchParams({
                      ...(guildId ? { guild: guildId } : {}),
                      staff: row.user.discordId || "",
                    }).toString()}`}
                    style={linkButtonStyle}
                  >
                    View Profile
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedStaff ? <StaffProfilePanel discordId={selectedStaff} guildId={guildId || undefined} /> : null}
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

const smallInputStyle = {
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  padding: "0.55rem 0.75rem",
  width: 220,
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
