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

const rankOptions = [
  "Community Director",
  "Deputy Director",
  "Senior Administrator",
  "Administrator",
  "Senior Moderator",
  "Moderator",
  "Support Team",
];

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
      <Panel
        title={guildId ? "Add or Update Staff Member" : "Add or Update Staff Member"}
        subtitle="Create or update global staff records with cleaner rank selection and audit notes."
      >
        <ActionForm
          action={addOrUpdateStaffAction}
          idleText="Save Staff Member"
          pendingText="Saving..."
          className="grid-form"
        >
          <div className="form-row-2">
            <input name="discordId" placeholder="Discord ID" required />
            <select name="rank" defaultValue={rankOptions[0]} required>
              {rankOptions.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>

          <textarea name="note" placeholder="Optional note for the audit log" style={{ minHeight: 110 }} />
        </ActionForm>
      </Panel>

      <Panel
        title={guildId ? "Staff Operations (Guild Scope)" : "Staff Operations"}
        subtitle="Manage ranks, strikes, removals, and view profile analytics in one place."
      >
        <div className="table-scroll">
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
                  <td><span className="badge">{row.rank}</span></td>
                  <td>{row.strikes}</td>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                  <td>
                    <div style={{ display: "grid", gap: 12 }}>
                      <ActionForm action={addStrikeAction} idleText="+1 Strike" pendingText="Adding..." buttonVariant="secondary">
                        <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                        <input type="hidden" name="amount" value="1" />
                        <input type="text" name="reason" placeholder="Reason (optional)" />
                      </ActionForm>

                      <ActionForm action={removeStrikeAction} idleText="-1 Strike" pendingText="Removing..." buttonVariant="ghost">
                        <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                        <input type="hidden" name="amount" value="1" />
                        <input type="text" name="reason" placeholder="Reason (optional)" />
                      </ActionForm>

                      <DangerActionForm
                        action={removeStaffAction}
                        idleText="Remove Staff Member"
                        pendingText="Removing..."
                        confirmMessage="Remove this staff member?"
                      >
                        <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                        <input type="text" name="reason" placeholder="Reason (optional)" />
                      </DangerActionForm>
                    </div>
                  </td>
                  <td>
                    <a
                      href={`?${new URLSearchParams({
                        ...(guildId ? { guild: guildId } : {}),
                        staff: row.user.discordId || "",
                      }).toString()}`}
                      className="button secondary"
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rows.length ? <div className="empty-state">No staff records found for the current scope.</div> : null}

        {selectedStaff ? <StaffProfilePanel discordId={selectedStaff} guildId={guildId || undefined} /> : null}
      </Panel>
    </div>
  );
}
