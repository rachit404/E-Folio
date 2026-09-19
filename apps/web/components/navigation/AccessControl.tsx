"use client";

import { useEffect, useState } from "react";

import { getUnlockState, type UnlockState } from "@/lib/unlocks";

interface AccessControlProps {
  mobile?: boolean;
}

export default function AccessControl({ mobile = false }: AccessControlProps) {
  const [open, setOpen] = useState(false);

  const [unlockState, setUnlockState] = useState<UnlockState>({
    skills: false,
    projects: false,
    interviewMode: false,
  });

  const [resetConfirm, setResetConfirm] = useState(false);

  /*
   * Keep the Access panel synchronized
   * with UnlockSystem/localStorage.
   */
  useEffect(() => {
    setUnlockState(getUnlockState());

    const handleUnlockChange = () => {
      setUnlockState(getUnlockState());
    };

    window.addEventListener("e-folio-unlocks-changed", handleUnlockChange);

    return () => {
      window.removeEventListener("e-folio-unlocks-changed", handleUnlockChange);
    };
  }, []);

  /*
   * Escape closes the panel.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setResetConfirm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  /*
   * Close the panel when clicking outside.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (
        target.closest("[data-access-panel]") ||
        target.closest("[data-access-trigger]")
      ) {
        return;
      }

      setOpen(false);
      setResetConfirm(false);
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  /*
   * Close the Access panel when the mobile
   * navigation is closed by UnlockSystem.
   */
  useEffect(() => {
    const handleCloseNavigation = () => {
      setOpen(false);
      setResetConfirm(false);
    };

    window.addEventListener("e-folio-close-navigation", handleCloseNavigation);

    return () => {
      window.removeEventListener(
        "e-folio-close-navigation",
        handleCloseNavigation,
      );
    };
  }, []);

  /*
   * Reset one individual section.
   */
  const resetSection = (section: "skills" | "projects") => {
    window.dispatchEvent(
      new CustomEvent("e-folio-reset-access-section", {
        detail: {
          section,
        },
      }),
    );

    setResetConfirm(false);
  };

  /*
   * Reset everything.
   */
  const resetAll = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }

    window.dispatchEvent(new CustomEvent("e-folio-reset-access"));

    setResetConfirm(false);
    setOpen(false);
  };

  const hasAccess =
    unlockState.skills || unlockState.projects || unlockState.interviewMode;

  const renderStatus = (unlocked: boolean) => (
    <span
      className={`portfolio-mono text-[7px] tracking-[0.12em] ${
        unlocked ? "text-[var(--color-cyan)]" : "text-[var(--color-dim)]"
      }`}
    >
      {unlocked ? "UNLOCKED" : "LOCKED"}
    </span>
  );

  return (
    <div className={mobile ? "relative w-full" : "relative"}>
      {/* Trigger */}
      <button
        type="button"
        data-access-trigger
        onClick={() => {
          setOpen((value) => !value);
          setResetConfirm(false);
        }}
        className={`portfolio-mono border px-3 py-2 text-[8px] tracking-[0.14em] transition-all ${
          open
            ? "border-[var(--color-cyan)]/60 bg-[var(--color-cyan)]/5 text-[var(--color-cyan)]"
            : "border-white/10 text-[var(--color-dim)] hover:border-[var(--color-cyan)]/40 hover:text-[var(--color-cyan)]"
        }`}
        aria-expanded={open}
        aria-controls="e-folio-access-panel"
      >
        ACCESS
      </button>

      {open && (
        <div
          id="e-folio-access-panel"
          data-access-panel
          className={`absolute z-[140] border border-white/10 bg-[var(--color-panel)]/98 shadow-2xl backdrop-blur-xl ${
            mobile
              ? "left-0 right-0 top-[calc(100%+12px)]"
              : "right-0 top-[calc(100%+12px)] w-[320px]"
          }`}
        >
          {/* Accent line */}
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-cyan)] to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-cyan)]">
                ACCESS CONTROL
              </p>

              <p className="portfolio-display mt-1 text-lg font-bold">
                YOUR ACCESS
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setResetConfirm(false);
              }}
              className="portfolio-mono border border-white/10 px-2 py-1 text-[8px] text-[var(--color-dim)] transition-colors hover:border-white/30 hover:text-[var(--color-white)]"
              aria-label="Close access panel"
            >
              ×
            </button>
          </div>

          {/* Status */}
          <div className="p-5">
            <p className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
              ARCHIVE STATUS
            </p>

            <div className="mt-3 space-y-2">
              {/* Skills */}
              <div className="border border-white/5 bg-black/20 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="portfolio-mono text-[8px] tracking-[0.12em] text-[var(--color-muted)]">
                      SKILLS
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--color-dim)]">
                      Engineering Arsenal
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {renderStatus(unlockState.skills)}

                    {unlockState.skills && (
                      <button
                        type="button"
                        onClick={() => resetSection("skills")}
                        className="portfolio-mono text-[7px] tracking-[0.1em] text-[var(--color-dim)] transition-colors hover:text-[var(--color-red)]"
                      >
                        RESET
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="border border-white/5 bg-black/20 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="portfolio-mono text-[8px] tracking-[0.12em] text-[var(--color-muted)]">
                      PROJECTS
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--color-dim)]">
                      Project Archive
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {renderStatus(unlockState.projects)}

                    {unlockState.projects && (
                      <button
                        type="button"
                        onClick={() => resetSection("projects")}
                        className="portfolio-mono text-[7px] tracking-[0.1em] text-[var(--color-dim)] transition-colors hover:text-[var(--color-red)]"
                      >
                        RESET
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Interview Mode */}
              <div className="border border-white/5 bg-black/20 px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="portfolio-mono text-[8px] tracking-[0.12em] text-[var(--color-muted)]">
                      INTERVIEW MODE
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--color-dim)]">
                      Challenge bypass
                    </p>
                  </div>

                  <span
                    className={`portfolio-mono shrink-0 text-[7px] tracking-[0.12em] ${
                      unlockState.interviewMode
                        ? "text-[var(--color-cyan)]"
                        : "text-[var(--color-dim)]"
                    }`}
                  >
                    {unlockState.interviewMode ? "ACTIVE" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset all */}
            <div className="mt-5 border-t border-white/10 pt-5">
              {resetConfirm ? (
                <div className="border border-[var(--color-red)]/25 bg-[var(--color-red)]/5 p-3">
                  <p className="portfolio-mono text-[7px] leading-4 tracking-[0.12em] text-[var(--color-red)]">
                    CLEAR ALL LOCAL ACCESS STATE?
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={resetAll}
                      className="portfolio-mono flex-1 border border-[var(--color-red)]/40 px-3 py-2 text-[7px] tracking-[0.1em] text-[var(--color-red)] transition-colors hover:border-[var(--color-red)] hover:bg-[var(--color-red)]/10"
                    >
                      CONFIRM
                    </button>

                    <button
                      type="button"
                      onClick={() => setResetConfirm(false)}
                      className="portfolio-mono flex-1 border border-white/10 px-3 py-2 text-[7px] tracking-[0.1em] text-[var(--color-dim)] transition-colors hover:border-white/30 hover:text-[var(--color-white)]"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={resetAll}
                  disabled={!hasAccess}
                  className="portfolio-mono w-full border border-[var(--color-red)]/20 px-4 py-3 text-[8px] tracking-[0.14em] text-[var(--color-red)] transition-all hover:border-[var(--color-red)]/50 hover:bg-[var(--color-red)]/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  RESET ALL ACCESS
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-5 py-3">
            <p className="portfolio-mono text-[7px] leading-4 tracking-[0.12em] text-[var(--color-dim)]">
              Access state is stored locally on this device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
