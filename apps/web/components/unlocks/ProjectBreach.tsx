"use client";

import { useEffect, useMemo, useState } from "react";

import { unlockProjects } from "@/lib/unlocks";

interface ProjectBreachProps {
  onSuccess: () => void;
  onClose: () => void;
}

function createSequence() {
  const cells = Array.from({ length: 9 }, (_, index) => index);

  return [...cells].sort(() => Math.random() - 0.5).slice(0, 4);
}

export default function ProjectBreach({
  onSuccess,
  onClose,
}: ProjectBreachProps) {
  const sequence = useMemo(() => createSequence(), []);

  const [input, setInput] = useState<number[]>([]);
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

        setVisibleIndex(sequence[index]);

        await new Promise((resolve) => {
          window.setTimeout(resolve, 550);
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

  const selectCell = (cell: number) => {
    if (status !== "input") {
      return;
    }

    const position = input.length;

    if (cell !== sequence[position]) {
      setStatus("error");
      return;
    }

    const nextInput = [...input, cell];

    setInput(nextInput);

    if (nextInput.length === sequence.length) {
      setStatus("success");

      unlockProjects();

      onSuccess();
    }
  };

  const retry = () => {
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-void)]/95 px-5 py-10 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-breach-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden border border-[var(--color-red)]/30 bg-[var(--color-panel)]/95">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[var(--color-red)] via-[var(--color-red)] to-transparent" />

        <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[var(--color-cyan)] via-[var(--color-cyan)] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="portfolio-mono text-[8px] tracking-[0.2em] text-[var(--color-red)]">
              ACCESS PROTOCOL / 02
            </p>

            <h2
              id="project-breach-title"
              className="portfolio-display mt-2 text-2xl font-bold"
            >
              PROJECT BREACH
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
            Observe the highlighted grid nodes. Reproduce their activation
            sequence to breach the project archive.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="portfolio-mono text-[8px] tracking-[0.15em] text-[var(--color-dim)]">
              SECURITY STATUS
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
              {status === "watch" && "SCANNING"}
              {status === "input" && "REPRODUCE"}
              {status === "success" && "BREACH SUCCESSFUL"}
              {status === "error" && "ACCESS DENIED"}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 py-10">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
            {Array.from({ length: 9 }, (_, cell) => {
              const selected = input.includes(cell);
              const active = visibleIndex === cell;

              return (
                <button
                  key={cell}
                  type="button"
                  disabled={status !== "input"}
                  onClick={() => selectCell(cell)}
                  aria-label={`Grid node ${cell + 1}`}
                  className={`relative aspect-square border transition-all duration-300 ${
                    active
                      ? "scale-105 border-[var(--color-red)] bg-[var(--color-red)]/20 shadow-[0_0_30px_rgba(255,33,71,0.3)]"
                      : selected
                        ? "border-[var(--color-cyan)]/50 bg-[var(--color-cyan)]/10"
                        : "border-white/10 bg-black/20 hover:border-[var(--color-cyan)]/40 hover:bg-[var(--color-cyan)]/5"
                  }`}
                >
                  <span
                    className={`portfolio-mono text-[8px] ${
                      active
                        ? "text-[var(--color-red)]"
                        : selected
                          ? "text-[var(--color-cyan)]"
                          : "text-[var(--color-dim)]"
                    }`}
                  >
                    {String(cell + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 ${
                      active
                        ? "bg-[var(--color-red)] shadow-[0_0_15px_var(--color-red)]"
                        : selected
                          ? "bg-[var(--color-cyan)]"
                          : "bg-white/10"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mx-auto mt-7 max-w-md">
            <div className="flex justify-between">
              <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                SEQUENCE PROGRESS
              </span>

              <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                {input.length} / {sequence.length}
              </span>
            </div>

            <div className="mt-3 h-px bg-white/10">
              <div
                className="h-full bg-[var(--color-cyan)] transition-all duration-300"
                style={{
                  width: `${(input.length / sequence.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Result */}
          {status === "success" && (
            <div className="mt-7 border border-[var(--color-cyan)]/30 bg-[var(--color-cyan)]/5 p-5">
              <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-cyan)]">
                PROJECT ARCHIVE UNLOCKED
              </p>

              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Engineering projects are now accessible.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-7 flex items-center justify-between border border-[var(--color-red)]/30 bg-[var(--color-red)]/5 p-5">
              <div>
                <p className="portfolio-mono text-[9px] tracking-[0.16em] text-[var(--color-red)]">
                  BREACH FAILED
                </p>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Node sequence mismatch.
                </p>
              </div>

              <button
                type="button"
                onClick={retry}
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
              PROJECT SECURITY SYSTEM
            </span>

            <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
              CHALLENGE 02
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
