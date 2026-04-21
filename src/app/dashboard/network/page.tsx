import { Panel } from "@/components/ui/card";
import { NetworkLinkPanel } from "@/components/network/network-link-panel";
import { prisma } from "@/lib/prisma";

export default async function NetworkPage() {
  const rules = await prisma.networkSyncRule.findMany({
    where: { enabled: true },
    orderBy: [{ sourceGuildId: "asc" }, { targetGuildId: "asc" }],
    take: 100,
  });

  return (
    <div className="page-stack">
      <NetworkLinkPanel />

      <Panel
        title="Active Network Sync Rules"
        subtitle="These are the enabled role-based rules that decide whether a linked user can be auto-joined into another guild."
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Source Guild</th>
                <th>Source Role</th>
                <th>Target Guild</th>
                <th>Global Role Key</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.sourceGuildId}</td>
                  <td>{rule.sourceRoleId}</td>
                  <td>{rule.targetGuildId}</td>
                  <td>{rule.globalRoleKey || "—"}</td>
                  <td>{rule.enabled ? "Enabled" : "Disabled"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rules.length ? (
          <div className="empty-state">
            No enabled network sync rules were found. Add rules in your bot database or build the rule manager next.
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
