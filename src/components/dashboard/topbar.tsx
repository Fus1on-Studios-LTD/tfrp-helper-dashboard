import { auth, signOut } from "@/lib/auth";

export async function Topbar() {
  const session = await auth();

  return (
    <div className="panel">
      <div className="panel-inner topbar">
        <div className="topbar-user">
          <div className="topbar-user-label">Connected as</div>
          <div className="topbar-user-value">
            {session?.user?.name || "Unknown User"}
            {session?.user?.discordId ? ` • ${session.user.discordId}` : ""}
          </div>
        </div>

        <div className="action-cluster">
          <div className="badge">
            {session?.user?.isDashboardAdmin ? "Admin Access" : "Read Only"}
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="button ghost">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
