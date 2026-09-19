"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ProjectBreach from "@/components/unlocks/ProjectBreach";
import SignalDecode from "@/components/unlocks/SignalDecode";

import {
  enableInterviewMode,
  getUnlockState,
  resetUnlockSection,
  resetUnlockState,
  type UnlockState,
  type UnlockableSection,
} from "@/lib/unlocks";

type Challenge = "skills" | "projects" | null;

type PermissionSection = "skills" | "projects" | null;

interface UnlockSystemProps {
  children: React.ReactNode;
}

const LOCKED_SECTIONS = {
  skills: "skills",
  projects: "projects",
} as const;

const CHALLENGE_INFO = {
  skills: {
    protocol: "ACCESS PROTOCOL / 01",
    title: "SIGNAL DECODE",
    section: "SKILLS",
    objective:
      "Memorize a four-symbol sequence and reproduce it in the exact same order.",
    steps: [
      "Watch the four symbols as they are revealed one at a time.",
      "After the sequence disappears, select the symbols in the same order.",
      "A correct sequence unlocks the Skills archive.",
    ],
    success: "ENGINEERING ARSENAL UNLOCKED",
    difficulty: "MEMORY / SEQUENCE",
  },
  projects: {
    protocol: "ACCESS PROTOCOL / 02",
    title: "PROJECT BREACH",
    section: "PROJECTS",
    objective:
      "Observe a sequence of highlighted grid nodes and reproduce the activation order.",
    steps: [
      "Watch four grid nodes activate one at a time.",
      "After the sequence disappears, select the same nodes in order.",
      "A correct sequence unlocks the Projects archive.",
    ],
    success: "PROJECT ARCHIVE UNLOCKED",
    difficulty: "MEMORY / GRID",
  },
} as const;

export default function UnlockSystem({ children }: UnlockSystemProps) {
  const [state, setState] = useState<UnlockState>({
    skills: false,
    projects: false,
    interviewMode: false,
  });

  const [challenge, setChallenge] = useState<Challenge>(null);

  /*
   * Permission is session-only.
   *
   * We intentionally do not store this in localStorage.
   * Once a visitor agrees to play during this page session,
   * they won't repeatedly see the permission dialog.
   */
  const [gamePermission, setGamePermission] = useState(false);

  const [permissionSection, setPermissionSection] =
    useState<PermissionSection>(null);

  const lastBlockedSection = useRef<string | null>(null);

  const syncState = useCallback(() => {
    setState(getUnlockState());
  }, []);

  const closeNavigation = useCallback(() => {
    window.dispatchEvent(new CustomEvent("e-folio-close-navigation"));
  }, []);

  const isUnlocked = useCallback(
    (section: "skills" | "projects", current?: UnlockState) => {
      const unlockState = current ?? getUnlockState();

      if (unlockState.interviewMode) {
        return true;
      }

      return section === "skills" ? unlockState.skills : unlockState.projects;
    },
    [],
  );

  /*
   * Request permission before starting a game.
   */
  const requestChallenge = useCallback(
    (section: "skills" | "projects") => {
      const current = getUnlockState();

      if (isUnlocked(section, current)) {
        return true;
      }

      closeNavigation();

      if (gamePermission) {
        setChallenge(section);
        return false;
      }

      setPermissionSection(section);

      return false;
    },
    [closeNavigation, gamePermission, isUnlocked],
  );

  /*
   * Visitor agreed to play.
   */
  const startChallenge = useCallback(() => {
    if (!permissionSection) {
      return;
    }

    const section = permissionSection;

    setGamePermission(true);
    setPermissionSection(null);
    setChallenge(section);
  }, [permissionSection]);

  /*
   * Visitor does not want to play.
   */
  const declineChallenge = useCallback(() => {
    setPermissionSection(null);
    setChallenge(null);

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#home`,
    );

    const home = document.getElementById("home");

    if (home) {
      window.scrollTo({
        top: home.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  }, []);

  const goHome = useCallback(() => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#home`,
    );

    const home = document.getElementById("home");

    if (home) {
      window.scrollTo({
        top: home.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  }, []);

  /*
   * Synchronize unlock state.
   */
  useEffect(() => {
    syncState();

    const handleUnlockChange = () => {
      syncState();
    };

    window.addEventListener("e-folio-unlocks-changed", handleUnlockChange);

    return () => {
      window.removeEventListener("e-folio-unlocks-changed", handleUnlockChange);
    };
  }, [syncState]);

  /*
   * Reset ALL access from the Access panel.
   */
  useEffect(() => {
    const handleResetAccess = () => {
      resetUnlockState();

      setState(getUnlockState());
      setChallenge(null);
      setPermissionSection(null);
      setGamePermission(false);

      goHome();
    };

    window.addEventListener("e-folio-reset-access", handleResetAccess);

    return () => {
      window.removeEventListener("e-folio-reset-access", handleResetAccess);
    };
  }, [goHome]);

  /*
   * Reset one specific section.
   */
  useEffect(() => {
    const handleResetSection = (event: Event) => {
      const customEvent = event as CustomEvent<{
        section?: UnlockableSection;
      }>;

      const section = customEvent.detail?.section;

      if (section !== "skills" && section !== "projects") {
        return;
      }

      resetUnlockSection(section);

      setState(getUnlockState());

      /*
       * If the currently visible challenge belongs
       * to the reset section, close it.
       */
      if (challenge === section) {
        setChallenge(null);
      }

      setPermissionSection(null);

      /*
       * Resetting access exits Interview Mode too,
       * because Interview Mode represents full bypass.
       */
      goHome();
    };

    window.addEventListener("e-folio-reset-access-section", handleResetSection);

    return () => {
      window.removeEventListener(
        "e-folio-reset-access-section",
        handleResetSection,
      );
    };
  }, [challenge, goHome]);

  /*
   * Protect navigation links.
   */
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (href !== "#skills" && href !== "#projects") {
        return;
      }

      const section =
        href === "#skills" ? LOCKED_SECTIONS.skills : LOCKED_SECTIONS.projects;

      const current = getUnlockState();

      if (isUnlocked(section, current)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      closeNavigation();
      requestChallenge(section);
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [closeNavigation, isUnlocked, requestChallenge]);

  /*
   * Protect direct hash navigation.
   */
  useEffect(() => {
    const protectCurrentHash = () => {
      const hash = window.location.hash;

      if (hash !== "#skills" && hash !== "#projects") {
        return;
      }

      const section =
        hash === "#skills" ? LOCKED_SECTIONS.skills : LOCKED_SECTIONS.projects;

      const current = getUnlockState();

      if (isUnlocked(section, current)) {
        return;
      }

      if (lastBlockedSection.current === hash) {
        return;
      }

      lastBlockedSection.current = hash;

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#home`,
      );

      requestChallenge(section);

      window.setTimeout(() => {
        lastBlockedSection.current = null;
      }, 500);
    };

    const timer = window.setTimeout(protectCurrentHash, 100);

    window.addEventListener("hashchange", protectCurrentHash);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("hashchange", protectCurrentHash);
    };
  }, [isUnlocked, requestChallenge]);

  /*
   * Protect manual scrolling.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = getUnlockState();

        if (current.interviewMode) {
          return;
        }

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const section = entry.target.id;

          if (section === "skills" && !current.skills) {
            if (lastBlockedSection.current === section) {
              return;
            }

            lastBlockedSection.current = section;

            requestChallenge("skills");

            window.setTimeout(() => {
              lastBlockedSection.current = null;
            }, 800);

            return;
          }

          if (section === "projects" && !current.projects) {
            if (lastBlockedSection.current === section) {
              return;
            }

            lastBlockedSection.current = section;

            requestChallenge("projects");

            window.setTimeout(() => {
              lastBlockedSection.current = null;
            }, 800);

            return;
          }
        }
      },
      {
        threshold: 0.15,
      },
    );

    const observeSections = () => {
      const skills = document.getElementById("skills");

      const projects = document.getElementById("projects");

      if (skills) {
        observer.observe(skills);
      }

      if (projects) {
        observer.observe(projects);
      }
    };

    observeSections();

    return () => {
      observer.disconnect();
    };
  }, [requestChallenge]);

  const handleInterviewMode = () => {
    enableInterviewMode();

    setState(getUnlockState());

    setPermissionSection(null);

    setChallenge(null);
  };

  const handleChallengeSuccess = () => {
    syncState();

    window.setTimeout(() => {
      setChallenge(null);
    }, 900);
  };

  const handleChallengeClose = () => {
    setChallenge(null);
    goHome();
  };

  const permissionInfo = permissionSection
    ? CHALLENGE_INFO[permissionSection]
    : null;

  return (
    <>
      {children}

      {/* Interview bypass */}
      {!state.interviewMode && (
        <button
          type="button"
          onClick={handleInterviewMode}
          className="fixed right-0 top-1/2 z-[120] -translate-y-1/2 border border-[var(--color-cyan)]/30 bg-[var(--color-panel)]/90 px-3 py-4 backdrop-blur-md transition-all hover:border-[var(--color-cyan)]/70 hover:bg-[var(--color-cyan)]/5"
          aria-label="Enable interview mode and bypass portfolio challenges"
        >
          <span
            className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            INTERVIEW MODE
          </span>
        </button>
      )}

      {/* Current access status */}
      {!state.interviewMode && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[80] border border-white/10 bg-[var(--color-panel)]/80 px-4 py-3 backdrop-blur-md">
          <div className="portfolio-mono flex items-center gap-3 text-[7px] tracking-[0.14em]">
            <span
              className={`h-1.5 w-1.5 shadow-[0_0_8px_currentColor] ${
                state.projects
                  ? "bg-[var(--color-cyan)] text-[var(--color-cyan)]"
                  : state.skills
                    ? "bg-[var(--color-cyan)] text-[var(--color-cyan)]"
                    : "bg-[var(--color-red)] text-[var(--color-red)]"
              }`}
            />

            <span className="text-[var(--color-dim)]">ACCESS</span>

            <span className="text-[var(--color-muted)]">
              {state.projects ? "FULL" : state.skills ? "LEVEL 02" : "LEVEL 01"}
            </span>
          </div>
        </div>
      )}

      {/* Challenge permission / information */}
      {permissionInfo && (
        <div
          className="fixed inset-0 z-[180] flex items-center justify-center bg-[var(--color-void)]/92 px-5 py-8 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="challenge-permission-title"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[var(--color-cyan)]/30 bg-[var(--color-panel)]/95 shadow-2xl">
            <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-cyan)] to-transparent" />

            <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-gradient-to-l from-[var(--color-red)] via-[var(--color-red)] to-transparent" />

            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 md:px-8">
              <div>
                <p className="portfolio-mono text-[8px] tracking-[0.2em] text-[var(--color-cyan)]">
                  {permissionInfo.protocol}
                </p>

                <h2
                  id="challenge-permission-title"
                  className="portfolio-display mt-2 text-2xl font-bold md:text-3xl"
                >
                  {permissionInfo.title}
                </h2>

                <p className="portfolio-mono mt-2 text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                  TARGET / {permissionInfo.section}
                </p>
              </div>

              <button
                type="button"
                onClick={declineChallenge}
                className="portfolio-mono border border-white/10 px-3 py-2 text-[8px] text-[var(--color-muted)] transition-colors hover:border-[var(--color-red)]/50 hover:text-[var(--color-red)]"
                aria-label="Close challenge information"
              >
                ESC ×
              </button>
            </div>

            {/* Objective */}
            <div className="border-b border-white/10 px-6 py-6 md:px-8">
              <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                OBJECTIVE
              </p>

              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)] md:text-base">
                {permissionInfo.objective}
              </p>
            </div>

            {/* How to play */}
            <div className="border-b border-white/10 px-6 py-6 md:px-8">
              <div className="flex items-center justify-between">
                <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                  HOW TO PLAY
                </p>

                <span className="portfolio-mono text-[7px] tracking-[0.14em] text-[var(--color-cyan)]">
                  {permissionInfo.difficulty}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {permissionInfo.steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 border border-white/5 bg-black/20 p-4"
                  >
                    <span className="portfolio-mono shrink-0 text-[8px] text-[var(--color-cyan)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlock result */}
            <div className="px-6 py-6 md:px-8">
              <div className="border border-[var(--color-cyan)]/20 bg-[var(--color-cyan)]/5 p-4">
                <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]">
                  SUCCESS CONDITION
                </p>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {permissionInfo.success}
                </p>
              </div>

              <p className="mt-5 text-xs leading-5 text-[var(--color-dim)]">
                This challenge is optional. You can choose not to play and
                continue browsing the accessible parts of the portfolio.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={declineChallenge}
                  className="portfolio-mono border border-white/10 px-5 py-3 text-[8px] tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:border-white/30 hover:text-[var(--color-white)]"
                >
                  NOT NOW
                </button>

                <button
                  type="button"
                  onClick={startChallenge}
                  className="portfolio-mono border border-[var(--color-cyan)]/50 bg-[var(--color-cyan)]/5 px-5 py-3 text-[8px] tracking-[0.14em] text-[var(--color-cyan)] transition-all hover:border-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10"
                >
                  START CHALLENGE →
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 md:px-8">
              <div className="flex items-center justify-between">
                <span className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
                  E-FOLIO SECURITY SYSTEM
                </span>

                <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                  PERMISSION REQUIRED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge 01 */}
      {challenge === "skills" && (
        <SignalDecode
          onSuccess={handleChallengeSuccess}
          onClose={handleChallengeClose}
        />
      )}

      {/* Challenge 02 */}
      {challenge === "projects" && (
        <ProjectBreach
          onSuccess={handleChallengeSuccess}
          onClose={handleChallengeClose}
        />
      )}
    </>
  );
}
