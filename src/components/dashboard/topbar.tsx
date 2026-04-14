import { auth, signOut } from "@/lib/auth";

export async function Topbar() {
  const session = await auth();

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
      <div>
        <div className="text-sm text-white/50">Connected as</div>
        <div className="text-white">
          {session?.user?.name || "Unknown User"}
          {session?.user?.discordId ? ` • ${session.user.discordId}` : ""}
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400">
          Sign Out
        </button>
      </form>
    </div>
  );
}
