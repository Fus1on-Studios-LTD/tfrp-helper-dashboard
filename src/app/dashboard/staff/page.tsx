import { Panel } from "@/components/ui/card";
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
        <form action={addOrUpdateStaffAction} style={{ display: "grid", gap: 12 }}>
          <input name="discordId" placeholder="Discord ID" style={inputStyle} required />
          <input name="rank" placeholder="Rank" style={inputStyle} required />
          <button style={buttonStyle}>Save Staff Member</button>
        </form>
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
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <form action={addStrikeAction}>
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                      <button style={buttonStyle}>+1 Strike</button>
                    </form>
                    <form action={removeStrikeAction}>
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <input type="hidden" name="amount" value="1" />
                      <button style={buttonStyle}>-1 Strike</button>
                    </form>
                    <form action={removeStaffAction}>
                      <input type="hidden" name="discordId" value={row.user.discordId || ""} />
                      <button style={dangerButtonStyle}>Remove</button>
                    </form>
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

const buttonStyle = {
  borderRadius: 10,
  background: "#2563eb",
  color: "white",
  padding: "0.55rem 0.9rem",
  fontWeight: 700,
};

const dangerButtonStyle = {
  borderRadius: 10,
  background: "#dc2626",
  color: "white",
  padding: "0.55rem 0.9rem",
  fontWeight: 700,
};
