import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="container" style={{ padding: "1rem 0 2rem" }}>
      <div className="dashboard-shell">
        <Sidebar />
        <div className="page-stack">
          <Topbar />
          {children}
        </div>
      </div>
    </main>
  );
}
