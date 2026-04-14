import { Panel } from "@/components/ui/card";
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
              <td style={{ display: "flex", gap: 8 }}>
                <form action={claimTicketAction}>
                  <input type="hidden" name="id" value={ticket.id} />
                  <button style={buttonStyle}>Claim</button>
                </form>
                <form action={closeTicketAction}>
                  <input type="hidden" name="id" value={ticket.id} />
                  <button style={dangerButtonStyle}>Close</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

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
