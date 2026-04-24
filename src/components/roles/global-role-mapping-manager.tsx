import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { Panel } from "@/components/ui/card";
import {
  deleteGlobalRoleMappingAction,
  upsertGlobalRoleMappingAction,
} from "@/app/dashboard/roles/actions";
import type { DiscordRoleOption } from "@/app/dashboard/roles/role-data";

type Mapping = {
  id: string;
  guildId: string;
  key: string;
  roleId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type Guild = {
  id: string;
  name: string;
};

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
  roles,
}: {
  mappings: Mapping[];
  guilds: Guild[];
  selectedGuildId?: string;
  roles: DiscordRoleOption[];
}) {
  const selectedGuildName =
    guilds.find((guild) => guild.id === selectedGuildId)?.name || selectedGuildId || "No guild selected";

  return (
    <div className="page-stack">
      <Panel
        title="Create or Update Global Role Mapping"
        subtitle="Choose a real Discord role from the selected guild instead of manually typing role IDs."
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
            {selectedGuildId ? (
              <select name="roleId" required defaultValue="">
                <option value="" disabled>
                  Select Discord Role from {selectedGuildName}
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.assignableByBot ? "✅" : "⚠️"} {role.name} — {role.id}
                  </option>
                ))}
              </select>
            ) : (
              <input name="roleId" placeholder="Select a guild first, then choose a role" required />
            )}

            <div className="badge" style={{ minHeight: 50, alignItems: "center" }}>
              ⚠️ means the bot may not be high enough to assign that role.
            </div>
          </div>
        </ActionForm>
      </Panel>

      <Panel
        title="Available Discord Roles"
        subtitle={selectedGuildId ? `Roles fetched live from ${selectedGuildName}.` : "Select a guild from the dashboard guild selector to load role dropdown options."}
      >
        {selectedGuildId ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Assignable</th>
                  <th>Role</th>
                  <th>Role ID</th>
                  <th>Position</th>
                  <th>Mentionable</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.assignableByBot ? "✅ Yes" : "⚠️ Bot role too low"}</td>
                    <td><span className="badge">{role.name}</span></td>
                    <td>{role.id}</td>
                    <td>{role.position}</td>
                    <td>{role.mentionable ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">Select a guild to load Discord roles.</div>
        )}
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
                <th>Role</th>
                <th>Role ID</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => {
                const role = roles.find((item) => item.id === mapping.roleId);

                return (
                  <tr key={mapping.id}>
                    <td>{guilds.find((guild) => guild.id === mapping.guildId)?.name || mapping.guildId}</td>
                    <td><span className="badge">{mapping.key}</span></td>
                    <td>{role?.name || "Unknown / not loaded"}</td>
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
                );
              })}
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
