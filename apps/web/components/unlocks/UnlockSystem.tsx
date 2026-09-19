"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ProjectBreach from "@/components/unlocks/ProjectBreach";
import SignalDecode from "@/components/unlocks/SignalDecode";

import {
  enableInterviewMode,
  getUnlockState,
  type UnlockState,
} from "@/lib/unlocks";

type Challenge = "skills" | "projects" | null;

interface UnlockSystemProps {
  children: React.ReactNode;
}

const LOCKED_SECTIONS = {
  skills: "skills",
  projects: "projects",
} as const;

export default function UnlockSystem({ children }: UnlockSystemProps) {
  const [state, setState] = useState<UnlockState>({
    skills: false,
    projects: false,
    interviewMode: false,
  });

  const [challenge, setChallenge] = useState<Challenge>(null);

  const lastBlockedSection = useRef<string | null>(null);

  const syncState = useCallback(() => {
    setState(getUnlockState());
  }, []);

  const openChallenge = useCallback((section: "skills" | "projects") => {
    const current = getUnlockState();

    if (section === "skills" && current.skills) {
      return true;
    }

    if (section === "projects" && current.projects) {
      return true;
    }

    setChallenge(section);

    return false;
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
   * Protect navigation links.
   *
   * This runs at the document level so both desktop
   * and mobile navigation are protected without coupling
   * the navigation component to the game system.
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

      const unlocked = section === "skills" ? current.skills : current.projects;

      if (unlocked || current.interviewMode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      closeMenuIfNeeded();

      openChallenge(section);
    };

    const closeMenuIfNeeded = () => {
      window.dispatchEvent(new CustomEvent("e-folio-close-navigation"));
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [openChallenge]);

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

      const unlocked =
        current.interviewMode ||
        (section === "skills" ? current.skills : current.projects);

      if (unlocked) {
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

      openChallenge(section);

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
  }, [openChallenge]);

  /*
   * Protect manual scrolling into locked sections.
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

            openChallenge("skills");

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

            openChallenge("projects");

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
  }, [openChallenge]);

  const handleInterviewMode = () => {
    enableInterviewMode();
    setState(getUnlockState());
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
            <span className="h-1.5 w-1.5 bg-[var(--color-red)] shadow-[0_0_8px_var(--color-red)]" />

            <span className="text-[var(--color-dim)]">ACCESS</span>

            <span className="text-[var(--color-muted)]">
              {state.projects ? "FULL" : state.skills ? "LEVEL 02" : "LEVEL 01"}
            </span>
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
