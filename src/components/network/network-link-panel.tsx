import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callInternalApi } from "@/lib/bridge";
import { Panel } from "@/components/ui/card";
import { ActionForm, DangerActionForm } from "@/components/ui/action-form";
import {
  syncMyNetworkMembershipsAction,
  unlinkNetworkAccountAction,
} from "@/app/dashboard/network/actions";

function formatExpiry(date: Date | null) {
  if (!date) return "Unknown";
  return new Date(date).toLocaleString();
}

export async function NetworkLinkPanel() {
  const session = await auth();
  const discordId = session?.user?.discordId || "";

  const linked = discordId
    ? await prisma.linkedDiscordAccount.findUnique({
        where: { discordId },
      })
    : null;

  const startLink = discordId
    ? await callInternalApi("/api/network/link/start", {
        discordId,
      }).catch(() => null)
    : null;

  return (
    <div className="page-stack">
      <Panel
        title="Discord Network Link"
        subtitle="Link your Discord account with OAuth so the bot can join you into approved network guilds and assign mapped roles."
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div className="action-cluster">
            <span className="badge">
              {linked ? "Linked" : "Not Linked"}
            </span>
            {linked?.expiresAt ? (
              <span className="badge">Token expiry: {formatExpiry(linked.expiresAt)}</span>
            ) : null}
            {linked?.scope ? (
              <span className="badge">Scopes: {linked.scope}</span>
            ) : null}
          </div>

          <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            {linked
              ? "Your account is already linked. You can relink at any time if the token expires or if you want to refresh permissions."
              : "Your account is not linked yet. Start the OAuth flow below, approve the request, and then return here to run a network sync."}
          </div>

          <div className="action-cluster">
            {startLink?.url ? (
              <Link
                href={startLink.url}
                className="button primary"
                target="_blank"
                rel="noreferrer"
              >
                {linked ? "Relink Discord Account" : "Link Discord Account"}
              </Link>
            ) : (
              <span className="badge">Link URL unavailable</span>
            )}

            <ActionForm
              action={syncMyNetworkMembershipsAction}
              idleText="Run My Network Sync"
              pendingText="Syncing..."
              buttonVariant="secondary"
            >
              <input type="hidden" name="noop" value="1" />
            </ActionForm>

            {linked ? (
              <DangerActionForm
                action={unlinkNetworkAccountAction}
                idleText="Unlink Account"
                pendingText="Unlinking..."
                confirmMessage="Remove the linked Discord OAuth account?"
              >
                <input type="hidden" name="noop" value="1" />
              </DangerActionForm>
            ) : null}
          </div>
        </div>
      </Panel>
    </div>
  );
}
