import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import {
  claimTicketAction,
  unclaimTicketAction,
  closeTicketAction,
  forceCloseTicketAction,
  reopenTicketAction,
} from "@/app/dashboard/tickets/actions";

export function TicketOpsPanel({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
      {status === "open" ? (
        <>
          <ActionForm action={claimTicketAction} idleText="Claim" pendingText="Claiming...">
            <input type="hidden" name="id" value={ticketId} />
          </ActionForm>
          <ActionForm action={unclaimTicketAction} idleText="Unclaim" pendingText="Unclaiming...">
            <input type="hidden" name="id" value={ticketId} />
          </ActionForm>
          <DangerActionForm
            action={closeTicketAction}
            idleText="Close"
            pendingText="Closing..."
            confirmMessage="Close this ticket?"
          >
            <input type="hidden" name="id" value={ticketId} />
          </DangerActionForm>
          <DangerActionForm
            action={forceCloseTicketAction}
            idleText="Force Close"
            pendingText="Closing..."
            confirmMessage="Force-close this ticket?"
          >
            <input type="hidden" name="id" value={ticketId} />
          </DangerActionForm>
        </>
      ) : (
        <ActionForm action={reopenTicketAction} idleText="Reopen" pendingText="Reopening...">
          <input type="hidden" name="id" value={ticketId} />
        </ActionForm>
      )}
    </div>
  );
}
