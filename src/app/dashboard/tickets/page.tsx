import { Panel } from "@/components/ui/card";
import { getOpenTickets } from "@/lib/data";

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
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
