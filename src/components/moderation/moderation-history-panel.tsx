import { lookupHistoryAction } from "@/app/dashboard/moderation/actions";

export async function ModerationHistoryPanel({
  targetDiscordId,
  guildId,
}: {
  targetDiscordId: string;
  guildId?: string;
}) {
  const result = await lookupHistoryAction(targetDiscordId, guildId);
  const actions = result.actions || [];

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        padding: "1rem",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        Moderation History: {targetDiscordId}
      </div>

      {actions.length ? (
        <div style={{ display: "grid", gap: 8 }}>
          {actions.map((action: any) => (
            <div
              key={action.id}
              style={{
                borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                padding: "0.75rem",
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 700 }}>{action.type}</div>
              <div>Reason: {action.reason || "—"}</div>
              <div>Moderator: {action.moderatorId}</div>
              <div>Guild: {action.guildId || "Global"}</div>
              <div style={{ color: "rgba(255,255,255,0.65)" }}>
                {new Date(action.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "rgba(255,255,255,0.6)" }}>No moderation history found.</div>
      )}
    </div>
  );
}
