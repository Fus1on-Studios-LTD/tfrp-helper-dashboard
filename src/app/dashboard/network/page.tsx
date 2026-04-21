import { Panel } from "@/components/ui/card";
import { NetworkLinkPanel } from "@/components/network/network-link-panel";
import { NetworkRuleManager } from "@/components/network/network-rule-manager";
import { prisma } from "@/lib/prisma";

export default async function NetworkPage() {
  const rules = await prisma.networkSyncRule.findMany({
    orderBy: [{ enabled: "desc" }, { sourceGuildId: "asc" }, { targetGuildId: "asc" }],
    take: 200,
  });

  return (
    <div className="page-stack">
      <NetworkLinkPanel />
      <NetworkRuleManager rules={rules} />

      <Panel
        title="Sync Rule Notes"
        subtitle="How the rule engine works with your OAuth-linked users and global role mappings."
      >
        <div style={{ display: "grid", gap: 10, color: "var(--muted)", lineHeight: 1.6 }}>
          <div>1. User links their Discord account through the OAuth flow.</div>
          <div>2. A sync rule checks whether they have the source role in the source guild.</div>
          <div>3. If matched, the bot joins them to the target guild using <code>guilds.join</code>.</div>
          <div>4. If a global role key is set, the mapped target guild role is assigned after join.</div>
        </div>
      </Panel>
    </div>
  );
}
