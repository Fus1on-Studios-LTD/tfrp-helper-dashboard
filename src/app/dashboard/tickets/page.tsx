import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import { getOpenTickets } from "@/lib/data";
import { claimTicketAction, closeTicketAction } from "./actions";

export default async function TicketsPage() {
  const tickets = await getOpenTickets();

  return (
    <Panel title="Open Tickets">
      <table>
        <thead>
          <tr>
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
