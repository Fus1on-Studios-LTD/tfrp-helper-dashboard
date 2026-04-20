"use client";

import { useActionState, useEffect } from "react";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = {
  ok: false,
  message: "",
};

export function ActionForm({
  action,
  children,
  successMessage = "Saved successfully.",
  pendingText = "Working...",
  idleText = "Submit",
  className,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  successMessage?: string;
  pendingText?: string;
  idleText?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      console.log(`[dashboard-action] ${state.ok ? "success" : "error"}: ${state.message}`);
    }
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
      <button
        type="submit"
        disabled={pending}
        style={{
          borderRadius: 12,
          background: pending ? "#9ca3af" : "#f97316",
          color: "white",
          padding: "0.9rem 1rem",
          fontWeight: 700,
          opacity: pending ? 0.85 : 1,
        }}
      >
        {pending ? pendingText : idleText}
      </button>

      {state.message ? (
        <div
          style={{
            marginTop: 12,
            borderRadius: 12,
            padding: "0.85rem 1rem",
            background: state.ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${state.ok ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
            color: state.ok ? "#86efac" : "#fca5a5",
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          {state.message || successMessage}
        </div>
      ) : null}
    </form>
  );
}

export function DangerActionForm({
  action,
  children,
  confirmMessage = "Are you sure?",
  pendingText = "Working...",
  idleText = "Delete",
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  confirmMessage?: string;
  pendingText?: string;
  idleText?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
      <button
        type="submit"
        disabled={pending}
        style={{
          borderRadius: 10,
          background: pending ? "#9ca3af" : "#dc2626",
          color: "white",
          padding: "0.55rem 0.9rem",
          fontWeight: 700,
          opacity: pending ? 0.85 : 1,
        }}
      >
        {pending ? pendingText : idleText}
      </button>

      {state.message ? (
        <div
          style={{
            marginTop: 8,
            borderRadius: 12,
            padding: "0.7rem 0.9rem",
            background: state.ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            border: `1px solid ${state.ok ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
            color: state.ok ? "#86efac" : "#fca5a5",
            fontSize: 13,
            lineHeight: 1.35,
          }}
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
