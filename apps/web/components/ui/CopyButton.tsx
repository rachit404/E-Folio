"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

/** Copies text; reports the outcome in words, never silently. */
export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setState("copied");
    } catch {
      setState("failed");
    }

    window.setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="micro border border-white/20 px-2 py-1 text-[8px] text-[var(--color-white)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      {state === "copied"
        ? "Copied"
        : state === "failed"
          ? "Copy failed"
          : label}
    </button>
  );
}
