import { Panel } from "@/components/ui/card";
import { getStaffRows } from "@/lib/data";

export default async function StaffPage() {
  const rows = await getStaffRows();

  return (
    <Panel title="Staff Roster">
      <table>
        <thead>
          <tr>
            <th>Discord ID</th>
            <th>Rank</th>
            <th>Strikes</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.user.discordId}</td>
              <td>{row.rank}</td>
              <td>{row.strikes}</td>
              <td>{new Date(row.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
