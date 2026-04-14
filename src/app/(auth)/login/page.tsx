import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <section className="rounded-2xl border bg-panel p-5" style={{ width: "min(480px, 100%)" }}>
        <div className="text-muted" style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12 }}>
          Fus1on Studios
        </div>
        <h1 style={{ fontSize: 36, margin: "0.5rem 0 0.75rem" }}>Staff Dashboard</h1>
        <p className="text-muted" style={{ lineHeight: 1.6 }}>
          Sign in with Discord to access moderation, ticket, staff, and configuration tools.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: "/dashboard" });
          }}
          style={{ marginTop: 20 }}
        >
          <button
            style={{
              width: "100%",
              borderRadius: 14,
              background: "linear-gradient(90deg, #f97316, #3b82f6)",
              color: "white",
              padding: "0.95rem 1rem",
              fontWeight: 700,
            }}
          >
            Continue with Discord
          </button>
        </form>
      </section>
    </main>
  );
}
