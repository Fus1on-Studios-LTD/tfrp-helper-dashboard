import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { Panel } from "@/components/ui/card";
import {
  deleteNetworkRuleAction,
  toggleNetworkRuleAction,
  upsertNetworkRuleAction,
} from "@/app/dashboard/network/actions";

type Rule = {
  id: string;
  enabled: boolean;
  sourceGuildId: string;
  sourceRoleId: string;
  targetGuildId: string;
  globalRoleKey?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export function NetworkRuleManager({ rules }: { rules: Rule[] }) {
  return (
    <div className="page-stack">
      <Panel
        title="Create or Update Sync Rule"
        subtitle="Define which source guild role unlocks access to a target guild, and optionally apply a mapped global role after join."
      >
        <ActionForm
          action={upsertNetworkRuleAction}
          idleText="Save Rule"
          pendingText="Saving..."
          className="grid-form"
          buttonVariant="primary"
        >
          <div className="form-row-2">
            <input name="sourceGuildId" placeholder="Source Guild ID" required />
            <input name="sourceRoleId" placeholder="Source Role ID" required />
          </div>

          <div className="form-row-2">
            <input name="targetGuildId" placeholder="Target Guild ID" required />
            <input name="globalRoleKey" placeholder="Global Role Key (optional)" />
          </div>

          <div className="form-row-2">
            <select name="enabled" defaultValue="true">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            <div className="badge" style={{ minHeight: 50, alignItems: "center" }}>
              Example: main guild mod role → staff guild → MODERATOR
            </div>
          </div>
        </ActionForm>
      </Panel>

      <Panel
        title="Existing Sync Rules"
        subtitle="Enable, disable, and remove network sync rules without touching Prisma Studio."
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Source Guild</th>
                <th>Source Role</th>
                <th>Target Guild</th>
                <th>Global Role Key</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td><span className="badge">{rule.enabled ? "Enabled" : "Disabled"}</span></td>
                  <td>{rule.sourceGuildId}</td>
                  <td>{rule.sourceRoleId}</td>
                  <td>{rule.targetGuildId}</td>
                  <td>{rule.globalRoleKey || "—"}</td>
                  <td>{new Date(rule.updatedAt).toLocaleString()}</td>
                  <td>
                    <div className="action-cluster">
                      <ActionForm
                        action={toggleNetworkRuleAction}
                        idleText={rule.enabled ? "Disable" : "Enable"}
                        pendingText="Working..."
                        buttonVariant={rule.enabled ? "ghost" : "success"}
                      >
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <input type="hidden" name="enabled" value={rule.enabled ? "false" : "true"} />
                      </ActionForm>

                      <DangerActionForm
                        action={deleteNetworkRuleAction}
                        idleText="Delete"
                        pendingText="Deleting..."
                        confirmMessage="Delete this sync rule?"
                      >
                        <input type="hidden" name="ruleId" value={rule.id} />
                      </DangerActionForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rules.length ? (
          <div className="empty-state">No network sync rules found yet. Create your first rule above.</div>
        ) : null}
      </Panel>
    </div>
  );
}
