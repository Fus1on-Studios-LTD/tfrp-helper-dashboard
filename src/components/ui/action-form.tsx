"use client";

import { useActionState } from "react";

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
  pendingText = "Working...",
  idleText = "Submit",
  className,
  buttonVariant = "primary",
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  pendingText?: string;
  idleText?: string;
  className?: string;
  buttonVariant?: "primary" | "secondary" | "success" | "ghost";
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className={className}>
      {children}
      <button
        type="submit"
        disabled={pending}
        className={`button ${buttonVariant}`}
        style={pending ? { opacity: 0.82 } : undefined}
      >
        {pending ? pendingText : idleText}
      </button>

      {state.message ? (
        <div
          style={{
            marginTop: 12,
            borderRadius: 14,
            padding: "0.85rem 1rem",
            background: state.ok ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
            border: `1px solid ${state.ok ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"}`,
            color: state.ok ? "#86efac" : "#fca5a5",
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          {state.message}
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
        className="button danger"
        style={pending ? { opacity: 0.82 } : undefined}
      >
        {pending ? pendingText : idleText}
      </button>

      {state.message ? (
        <div
          style={{
            marginTop: 10,
            borderRadius: 14,
            padding: "0.75rem 0.9rem",
            background: state.ok ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
            border: `1px solid ${state.ok ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"}`,
            color: state.ok ? "#86efac" : "#fca5a5",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
