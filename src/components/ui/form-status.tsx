"use client";

import { useActionState } from "react";

export function SubmitButton({
  idleText,
  pendingText,
  className,
}: {
  idleText: string;
  pendingText: string;
  className?: string;
}) {
  // This component is intentionally lightweight and used inside server-action forms.
  return (
    <button
      type="submit"
      className={className || "rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white"}
      formAction={undefined}
    >
      {idleText}
    </button>
  );
}
