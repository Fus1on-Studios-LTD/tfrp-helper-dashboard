import Link from "next/link";
import { withGuildQuery } from "@/lib/guild-filter";

const items = [
  { href: "/dashboard", label: "Overview", emoji: "📊" },
  { href: "/dashboard/tickets", label: "Tickets", emoji: "🎫" },
  { href: "/dashboard/staff", label: "Staff", emoji: "🧑‍💼" },
  { href: "/dashboard/moderation", label: "Moderation", emoji: "🛡️" },
  { href: "/dashboard/sticky", label: "Sticky", emoji: "📌" },
  { href: "/dashboard/settings", label: "Settings", emoji: "⚙️" },
  { href: "/dashboard/network", label: "Network", emoji: "🌐" },
];

export function Sidebar({
  selectedGuildId = "",
  currentPath = "/dashboard",
}: {
  selectedGuildId?: string;
  currentPath?: string;
}) {
  return (
    <aside className="panel">
      <div className="panel-inner">
        <div className="sidebar-brand">
          <div className="sidebar-chip">Fus1on Studios</div>
          <div className="sidebar-title">Staff Dashboard</div>
          <div className="section-subtitle">
            Clean operator view for moderation, tickets, sticky systems, staff controls, and network sync.
          </div>
        </div>

        <nav className="sidebar-links">
          {items.map((item) => {
            const href = item.href === "/dashboard/network"
              ? item.href
              : withGuildQuery(item.href, selectedGuildId);
            const isActive = currentPath === item.href;

            return (
              <Link
                key={item.href}
                href={href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <span>{item.emoji} {item.label}</span>
                <span style={{ color: "rgba(248,250,252,0.42)" }}>→</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
