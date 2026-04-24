import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { Panel } from "@/components/ui/card";
import {
  deleteGlobalRoleMappingAction,
  upsertGlobalRoleMappingAction,
} from "@/app/dashboard/roles/actions";

type Mapping = {
  id: string;
  guildId: string;
  key: string;
  roleId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type Guild = { id: string; name: string };

const commonKeys = [
  "COMMUNITY_DIRECTOR",
  "DEPUTY_DIRECTOR",
  "ADMINISTRATOR",
  "SENIOR_MODERATOR",
  "MODERATOR",
  "SUPPORT_TEAM",
  "STAFF",
];

export function GlobalRoleMappingManager({
  mappings,
  guilds,
  selectedGuildId,
}: {
  mappings: Mapping[];
  guilds: Guild[];
  selectedGuildId?: string;
}) {
  return (
    <div className="page-stack">
      <Panel
        title="Create or Update Global Role Mapping"
        subtitle="Map a universal role key to a real Discord role ID in each guild. This powers /globalrole and network post-join role assignment."
      >
        <ActionForm
          action={upsertGlobalRoleMappingAction}
          idleText="Save Mapping"
          pendingText="Saving..."
          className="grid-form"
          buttonVariant="primary"
        >
          <div className="form-row-2">
            <select name="guildId" defaultValue={selectedGuildId || ""} required>
              <option value="" disabled>Select Guild</option>
              {guilds.map((guild) => (
                <option key={guild.id} value={guild.id}>
                  {guild.name} — {guild.id}
                </option>
              ))}
            </select>

            <select name="key" defaultValue="MODERATOR" required>
              {commonKeys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div className="form-row-2">
            <input name="roleId" placeholder="Discord Role ID" required />
            <div className="badge" style={{ minHeight: 50, alignItems: "center" }}>
              Example: MODERATOR → 123456789012345678
            </div>
          </div>
        </ActionForm>
      </Panel>

      <Panel
        title={selectedGuildId ? "Existing Mappings (Guild Scope)" : "Existing Global Role Mappings"}
        subtitle="These keys should match the keys used by /globalrole and NetworkSyncRule.globalRoleKey."
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Guild</th>
                <th>Key</th>
                <th>Role ID</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td>{guilds.find((guild) => guild.id === mapping.guildId)?.name || mapping.guildId}</td>
                  <td><span className="badge">{mapping.key}</span></td>
                  <td>{mapping.roleId}</td>
                  <td>{new Date(mapping.updatedAt).toLocaleString()}</td>
                  <td>
                    <DangerActionForm
                      action={deleteGlobalRoleMappingAction}
                      idleText="Delete"
                      pendingText="Deleting..."
                      confirmMessage={`Delete mapping ${mapping.key}?`}
                    >
                      <input type="hidden" name="mappingId" value={mapping.id} />
                    </DangerActionForm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!mappings.length ? (
          <div className="empty-state">No role mappings found for the current scope.</div>
        ) : null}
      </Panel>
    </div>
  );
}
