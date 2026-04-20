import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { GuildSelector } from "@/components/dashboard/guild-selector";
import { getGuildOptions } from "@/lib/data";
import { getSelectedGuildId } from "@/lib/guild-filter";

export default async function DashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedSearchParams = (await searchParams) || {};
  const selectedGuildId = getSelectedGuildId(resolvedSearchParams);
  const guilds = await getGuildOptions();

  return (
    <main className="container" style={{ padding: "1rem 0 2rem" }}>
      <div className="dashboard-shell">
        <div className="page-stack">
          <Sidebar selectedGuildId={selectedGuildId} />
          <GuildSelector guilds={guilds} selectedGuildId={selectedGuildId} />
        </div>
        <div className="page-stack">
          <Topbar />
          {children}
        </div>
      </div>
    </main>
  );
}
