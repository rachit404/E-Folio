"use client";

import { useEffect, useMemo, useState } from "react";

import { unlockSkills } from "@/lib/unlocks";

interface SignalDecodeProps {
  onSuccess: () => void;
  onClose: () => void;
}

type Signal = "diamond" | "circle" | "square" | "triangle";

const SIGNALS: Signal[] = ["diamond", "circle", "square", "triangle"];

const SIGNAL_SYMBOLS: Record<Signal, string> = {
  diamond: "◆",
  circle: "●",
  square: "■",
  triangle: "▲",
};

function createSequence(): Signal[] {
  return Array.from({ length: 4 }, () => {
    return SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
  });
}

export default function SignalDecode({
  onSuccess,
  onClose,
}: SignalDecodeProps) {
  const sequence = useMemo(() => createSequence(), []);

  const [input, setInput] = useState<Signal[]>([]);
  const [status, setStatus] = useState<"watch" | "input" | "success" | "error">(
    "watch",
  );

  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    const reveal = async () => {
      setStatus("watch");

      for (let index = 0; index < sequence.length; index += 1) {
        if (cancelled) {
          return;
        }

        setVisibleIndex(index);

        await new Promise((resolve) => {
          window.setTimeout(resolve, 650);
        });
      }

      if (!cancelled) {
        setVisibleIndex(-1);
        setStatus("input");
      }
    };

    reveal();

    return () => {
      cancelled = true;
    };
  }, [sequence]);

  const selectSignal = (signal: Signal) => {
    if (status !== "input") {
      return;
    }

    const nextInput = [...input, signal];

    setInput(nextInput);

    const currentIndex = nextInput.length - 1;

    if (signal !== sequence[currentIndex]) {
      setStatus("error");
      return;
    }

    if (nextInput.length === sequence.length) {
      setStatus("success");
      unlockSkills();
      onSuccess();
    }
  };

  const reset = () => {
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-void)]/95 px-5 py-10 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signal-decode-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden border border-[var(--color-cyan)]/30 bg-[var(--color-panel)]/90">
        {/* Technical lines */}
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-cyan)] to-transparent" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[var(--color-red)] via-[var(--color-red)] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="portfolio-mono text-[8px] tracking-[0.2em] text-[var(--color-cyan)]">
              ACCESS PROTOCOL / 01
            </p>

            <h2
              id="signal-decode-title"
              className="portfolio-display mt-2 text-2xl font-bold tracking-tight"
            >
              SIGNAL DECODE
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="portfolio-mono border border-white/10 px-3 py-2 text-[8px] text-[var(--color-muted)] transition-colors hover:border-[var(--color-red)]/50 hover:text-[var(--color-red)]"
          >
            ESC ×
          </button>
        </div>

        {/* Instructions */}
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Memorize the signal sequence. Reproduce it exactly to establish
            access to the engineering arsenal.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="portfolio-mono text-[8px] tracking-[0.15em] text-[var(--color-dim)]">
              STATUS
            </span>

            <span
              className={`portfolio-mono text-[8px] tracking-[0.15em] ${
                status === "success"
                  ? "text-[var(--color-cyan)]"
                  : status === "error"
                    ? "text-[var(--color-red)]"
                    : "text-[var(--color-muted)]"
              }`}
            >
              {status === "watch" && "MEMORIZE SIGNAL"}
              {status === "input" && "REPEAT SIGNAL"}
              {status === "success" && "ACCESS GRANTED"}
              {status === "error" && "SIGNAL MISMATCH"}
            </span>
          </div>
        </div>

        {/* Sequence display */}
        <div className="px-6 py-10">
          <div className="flex min-h-24 items-center justify-center gap-5 border border-white/5 bg-black/20">
            {sequence.map((signal, index) => {
              const active = status === "watch" && visibleIndex === index;

              return (
                <div
                  key={`${signal}-${index}`}
                  className={`flex h-14 w-14 items-center justify-center border text-2xl transition-all duration-300 ${
                    active
                      ? "scale-125 border-[var(--color-cyan)] bg-[var(--color-cyan)]/10 text-[var(--color-cyan)] shadow-[0_0_25px_rgba(0,229,255,0.25)]"
                      : "border-white/10 text-white/20"
                  }`}
                  aria-hidden="true"
                >
                  {active ? SIGNAL_SYMBOLS[signal] : "?"}
                </div>
              );
            })}
          </div>

          {/* Player input */}
          <div className="mt-8">
            <p className="portfolio-mono mb-4 text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              YOUR SIGNAL
            </p>

            <div className="mb-6 flex min-h-12 items-center justify-center gap-3 border border-white/5 bg-black/20 px-4">
              {sequence.map((_, index) => {
                const selected = input[index];

                return (
                  <span
                    key={index}
                    className={`flex h-8 w-8 items-center justify-center border text-sm ${
                      selected
                        ? "border-[var(--color-cyan)]/40 text-[var(--color-cyan)]"
                        : "border-white/10 text-white/10"
                    }`}
                  >
                    {selected ? SIGNAL_SYMBOLS[selected] : "·"}
                  </span>
                );
              })}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-4 gap-2">
              {SIGNALS.map((signal) => (
                <button
                  key={signal}
                  type="button"
                  disabled={status !== "input"}
                  onClick={() => selectSignal(signal)}
                  className="group flex h-16 items-center justify-center border border-white/10 bg-black/20 text-xl text-white/50 transition-all hover:border-[var(--color-cyan)]/50 hover:bg-[var(--color-cyan)]/5 hover:text-[var(--color-cyan)] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Select ${signal}`}
                >
                  {SIGNAL_SYMBOLS[signal]}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {status === "success" && (
            <div className="mt-6 border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/5 p-5">
              <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-cyan)]">
                ACCESS GRANTED
              </p>

              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Engineering Arsenal unlocked.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 flex items-center justify-between border border-[var(--color-red)]/30 bg-[var(--color-red)]/5 p-5">
              <div>
                <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-red)]">
                  ACCESS DENIED
                </p>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Signal sequence mismatch.
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className="portfolio-mono border border-[var(--color-red)]/30 px-4 py-3 text-[8px] text-[var(--color-red)] transition-colors hover:border-[var(--color-red)]"
              >
                RETRY
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
              E-FOLIO SECURITY SYSTEM
            </span>

            <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
              CHALLENGE 01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
