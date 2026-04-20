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
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 text-sm font-semibold text-white">Guild Scope</div>

      <div className="grid gap-2">
        <Link
          href={withGuildQuery("/dashboard", "")}
          className={!selectedGuildId ? activeClassName : itemClassName}
        >
          All Guilds
        </Link>

        {guilds.map((guild) => (
          <Link
            key={guild.id}
            href={withGuildQuery("/dashboard", guild.id)}
            className={selectedGuildId === guild.id ? activeClassName : itemClassName}
          >
            {guild.name}
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
        The selected guild scope is preserved when using the page links below.
      </div>

      <div className="grid gap-2" style={{ marginTop: 16 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={withGuildQuery(item.href, selectedGuildId || "")}
            className={itemClassName}
          >
            Open {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const itemClassName =
  "block rounded-xl border border-transparent px-3 py-2 text-sm text-white/75 transition hover:border-white/10 hover:bg-white/5 hover:text-white";

const activeClassName =
  "block rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-sm text-white";
