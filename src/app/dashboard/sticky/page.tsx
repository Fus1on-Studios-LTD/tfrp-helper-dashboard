import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { getStickyRowsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";
import { upsertStickyAction, deleteStickyAction } from "./actions";

export default async function StickyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const rows = await getStickyRowsByGuild(guildId || undefined);

  return (
    <div className="page-stack">
      <Panel title={guildId ? "Create or Update Sticky Message (Selected Guild)" : "Create or Update Sticky Message"}>
        <ActionForm
          action={upsertStickyAction}
          idleText="Save Sticky Message"
          pendingText="Saving..."
          className="grid"
        >
          <input name="guildId" placeholder="Guild ID" style={inputStyle} required defaultValue={guildId} />
          <input name="channelId" placeholder="Channel ID" style={inputStyle} required />
          <textarea name="content" placeholder="Sticky content" style={{ ...inputStyle, minHeight: 140 }} required />
        </ActionForm>
      </Panel>

      <Panel title={guildId ? "Existing Sticky Messages (Guild Scope)" : "Existing Sticky Messages"}>
        <table>
          <thead>
            <tr>
              <th>Guild</th>
              <th>Channel</th>
              <th>Preview</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.guildId}</td>
                <td>{row.channelId}</td>
                <td>{row.content.slice(0, 80)}{row.content.length > 80 ? "..." : ""}</td>
                <td>{new Date(row.updatedAt).toLocaleString()}</td>
                <td>
                  <DangerActionForm
                    action={deleteStickyAction}
                    idleText="Delete"
                    pendingText="Deleting..."
                    confirmMessage="Delete this sticky message?"
                  >
                    <input type="hidden" name="guildId" value={row.guildId} />
                    <input type="hidden" name="channelId" value={row.channelId} />
                  </DangerActionForm>
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
