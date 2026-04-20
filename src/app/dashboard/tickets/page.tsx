import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { getOpenTicketsByGuild } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";
import { claimTicketAction, closeTicketAction } from "./actions";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const guildId = getSelectedGuildId(resolvedSearchParams);
  const tickets = await getOpenTicketsByGuild(guildId || undefined);

  return (
    <Panel title={guildId ? "Open Tickets (Guild Scope)" : "Open Tickets"}>
      <table>
        <thead>
          <tr>
            <th>Guild</th>
            <th>Channel</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Claimed By</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.guildId}</td>
              <td>{ticket.channelId}</td>
              <td>{ticket.creatorId}</td>
              <td>{ticket.status}</td>
              <td>{ticket.claimedById || "Unclaimed"}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <ActionForm action={claimTicketAction} idleText="Claim" pendingText="Claiming...">
                    <input type="hidden" name="id" value={ticket.id} />
                  </ActionForm>
                  <DangerActionForm
                    action={closeTicketAction}
                    idleText="Close"
                    pendingText="Closing..."
                    confirmMessage="Close this ticket?"
                  >
                    <input type="hidden" name="id" value={ticket.id} />
                  </DangerActionForm>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
