import Link from "next/link";
import { withGuildQuery } from "@/lib/guild-filter";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tickets", label: "Tickets" },
  { href: "/dashboard/staff", label: "Staff" },
  { href: "/dashboard/moderation", label: "Moderation" },
  { href: "/dashboard/sticky", label: "Sticky" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar({ selectedGuildId = "" }: { selectedGuildId?: string }) {
  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 lg:w-72">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-orange-300">Fus1on</div>
        <div className="text-xl font-semibold text-white">Staff Dashboard</div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={withGuildQuery(item.href, selectedGuildId)}
            className="block rounded-xl border border-transparent px-3 py-2 text-sm text-white/75 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
