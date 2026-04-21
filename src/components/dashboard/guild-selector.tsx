import Link from "next/link";
import { withGuildQuery } from "@/lib/guild-filter";

type GuildOption = {
  id: string;
  name: string;
};

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tickets", label: "Tickets" },
  { href: "/dashboard/staff", label: "Staff" },
  { href: "/dashboard/moderation", label: "Moderation" },
  { href: "/dashboard/sticky", label: "Sticky" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function GuildSelector({
  guilds,
  selectedGuildId,
}: {
  guilds: GuildOption[];
  selectedGuildId?: string;
}) {
  return (
    <div className="panel">
      <div className="panel-inner">
        <div className="badge">Guild Scope</div>
        <div style={{ marginTop: 10 }} className="section-subtitle">
          Choose a guild to filter operational data across the dashboard.
        </div>

        <div className="select-card-grid">
          <Link
            href={withGuildQuery("/dashboard", "")}
            className={`select-card ${!selectedGuildId ? "active" : ""}`}
          >
            <div style={{ fontWeight: 700 }}>All Guilds</div>
            <div className="section-subtitle">View cross-network activity</div>
          </Link>

          {guilds.map((guild) => (
            <Link
              key={guild.id}
              href={withGuildQuery("/dashboard", guild.id)}
              className={`select-card ${selectedGuildId === guild.id ? "active" : ""}`}
            >
              <div style={{ fontWeight: 700 }}>{guild.name}</div>
              <div className="section-subtitle">{guild.id}</div>
            </Link>
          ))}
        </div>

        <div className="sidebar-links" style={{ marginTop: "1rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={withGuildQuery(item.href, selectedGuildId || "")}
              className="nav-link"
            >
              <span>Open {item.label}</span>
              <span style={{ color: "rgba(248,250,252,0.42)" }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
