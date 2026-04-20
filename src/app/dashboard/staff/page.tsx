import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { getStaffRows } from "@/lib/data";
import {
  addOrUpdateStaffAction,
  addStrikeAction,
  removeStrikeAction,
  removeStaffAction,
} from "./actions";

export default async function StaffPage() {
  const rows = await getStaffRows();

  return (
    <div className="page-stack">
      <Panel title="Add or Update Staff Member">
        <ActionForm
          action={addOrUpdateStaffAction}
          idleText="Save Staff Member"
          pendingText="Saving..."
          className="grid"
        >
          <input name="discordId" placeholder="Discord ID" style={inputStyle} required />
          <input name="rank" placeholder="Rank" style={inputStyle} required />
        </ActionForm>
      </Panel>

      <Panel title="Staff Roster">
        <table>
          <thead>
            <tr>
              <th>Discord ID</th>
              <th>Rank</th>
              <th>Strikes</th>
              <th>Added</th>
              <th>Quick Actions</th>
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
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <ActionForm action={addStrikeAction} idleText="+1 Strike" pendingText="Adding...">
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                    </ActionForm>
                    <ActionForm action={removeStrikeAction} idleText="-1 Strike" pendingText="Removing...">
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                    </ActionForm>
                    <DangerActionForm
                      action={removeStaffAction}
                      idleText="Remove"
                      pendingText="Removing..."
                      confirmMessage="Remove this staff member?"
                    >
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                    </DangerActionForm>
                  </div>
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
