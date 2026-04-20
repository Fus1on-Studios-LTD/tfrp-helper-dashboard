import { getStaffProfileAction } from "@/app/dashboard/staff/actions";

export async function StaffProfilePanel({
  discordId,
  guildId,
}: {
  discordId: string;
  guildId?: string;
}) {
  const result = await getStaffProfileAction(discordId, guildId);
  const profile = result.profile;

  const breakdownEntries = Object.entries(profile.moderationBreakdown || {});
  const recentAudit = profile.recentAudit || [];

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        padding: "1rem",
        minWidth: 320,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        Staff Profile: {discordId}
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <div><strong>Rank:</strong> {profile.rank}</div>
        <div><strong>Strikes:</strong> {profile.strikes}</div>
        <div><strong>Total Logged Actions:</strong> {profile.totalModerationActions}</div>
        <div><strong>Added:</strong> {new Date(profile.createdAt).toLocaleString()}</div>
        <div><strong>Updated:</strong> {new Date(profile.updatedAt).toLocaleString()}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Moderation Breakdown</div>
        {breakdownEntries.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {breakdownEntries.map(([type, count]) => (
              <li key={type}>{type}: {String(count)}</li>
            ))}
          </ul>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.6)" }}>No moderation actions yet.</div>
        )}
      </div>

      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Recent Audit Activity</div>
        {recentAudit.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {recentAudit.slice(0, 8).map((item: any) => (
              <div
                key={item.id}
                style={{
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  padding: "0.75rem",
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>{item.action}</div>
                <div style={{ color: "rgba(255,255,255,0.65)" }}>
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.6)" }}>No recent audit activity.</div>
        )}
      </div>
    </div>
  );
}
