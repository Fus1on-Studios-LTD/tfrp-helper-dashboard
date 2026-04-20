import { Panel } from "@/components/ui/card";
import { TicketOpsPanel } from "@/components/tickets/ticket-ops-panel";
import { getSelectedGuildId } from "@/lib/guild-filter";
import { prisma } from "@/lib/prisma";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const raw = resolvedSearchParams.q;
  const query = Array.isArray(raw) ? (raw[0] || "") : (raw || "");
  const guildId = getSelectedGuildId(resolvedSearchParams);

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(guildId ? { guildId } : {}),
      ...(query
        ? {
            OR: [
              { channelId: { contains: query } },
              { creatorId: { contains: query } },
              { claimedById: { contains: query } },
              { subject: { contains: query } },
              { status: { contains: query } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <Panel title={guildId ? "Ticket Operations (Guild Scope)" : "Ticket Operations"}>
      <form method="get" style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        {guildId ? <input type="hidden" name="guild" value={guildId} /> : null}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by creator, channel, claimedBy, subject, or status"
          style={inputStyle}
        />
        <button style={buttonStyle}>Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Guild</th>
            <th>Channel</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Claimed By</th>
            <th>Subject</th>
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
              <td>{ticket.subject || "—"}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <TicketOpsPanel ticketId={ticket.id} status={ticket.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

const inputStyle = {
  flex: 1,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  padding: "0.9rem 1rem",
};

const buttonStyle = {
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
  padding: "0.9rem 1rem",
  fontWeight: 700,
};
