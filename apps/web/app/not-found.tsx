"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NotFound() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-404-item]",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
      );

      gsap.to("[data-404-glitch]", {
        x: 2,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        ease: "none",
        repeatDelay: 3,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-void)] px-6 text-[var(--color-white)]"
    >
      {/* Technical atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute inset-0 opacity-25
            [background-image:linear-gradient(rgba(0,229,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.07)_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />

        <div className="absolute left-1/2 top-1/2 h-[70vw] w-[70vw] max-h-[800px] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,33,71,0.07),transparent_65%)]" />

        <div className="absolute left-0 top-1/2 h-px w-full bg-[var(--color-cyan)]/10" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-red)]/10" />

        <div className="absolute left-0 top-[22%] h-px w-[35%] bg-gradient-to-r from-transparent via-[var(--color-cyan)]/40 to-transparent" />

        <div className="absolute bottom-[22%] right-0 h-px w-[35%] bg-gradient-to-r from-transparent via-[var(--color-red)]/40 to-transparent" />
      </div>

      {/* Corner markers */}
      <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-[var(--color-cyan)]/40 md:left-10 md:top-10" />

      <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-[var(--color-cyan)]/40 md:right-10 md:top-10" />

      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-[var(--color-red)]/40 md:bottom-10 md:left-10" />

      <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-[var(--color-red)]/40 md:bottom-10 md:right-10" />

      {/* Main */}
      <div className="relative z-10 w-full max-w-5xl">
        <div
          data-404-item
          className="portfolio-mono mb-8 flex items-center gap-4 text-[9px] tracking-[0.22em] text-[var(--color-cyan)]"
        >
          <span className="h-px w-12 bg-[var(--color-red)]" />
          E-FOLIO // DIMENSION ERROR
        </div>

        <div className="grid gap-12 md:grid-cols-[1fr_0.8fr] md:items-center">
          {/* Error */}
          <div>
            <div
              data-404-item
              data-404-glitch
              className="portfolio-display text-[clamp(8rem,22vw,18rem)] font-black leading-[0.7] tracking-[-0.09em]"
            >
              404<span className="text-[var(--color-red)]">.</span>
            </div>

            <div
              data-404-item
              className="mt-10 border-l border-[var(--color-cyan)]/40 pl-6"
            >
              <h1 className="portfolio-display text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">
                WRONG
                <br />
                DIMENSION
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-muted)]">
                The requested coordinate does not exist inside this portfolio
                system.
              </p>
            </div>
          </div>

          {/* Diagnostic panel */}
          <div data-404-item>
            <div className="border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/50 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-[var(--color-white)]/10 px-5 py-4">
                <span className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-cyan)]">
                  NAVIGATION DIAGNOSTIC
                </span>

                <span className="portfolio-mono text-[8px] text-[var(--color-red)]">
                  ERROR
                </span>
              </div>

              <div className="space-y-5 px-5 py-6">
                <div>
                  <p className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
                    STATUS
                  </p>

                  <p className="portfolio-mono mt-2 text-[10px] text-[var(--color-red)]">
                    COORDINATE NOT FOUND
                  </p>
                </div>

                <div>
                  <p className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
                    SYSTEM
                  </p>

                  <p className="portfolio-mono mt-2 text-[10px] text-[var(--color-muted)]">
                    E-FOLIO / NAVIGATION
                  </p>
                </div>

                <div>
                  <p className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
                    RECOVERY
                  </p>

                  <p className="portfolio-mono mt-2 text-[10px] text-[var(--color-cyan)]">
                    RETURN TO KNOWN SPACE
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--color-white)]/10 p-5">
                <Link
                  href="/sde"
                  className="portfolio-mono inline-flex border border-[var(--color-cyan)]/50 px-6 py-3 text-[9px] tracking-[0.14em] transition-all duration-300 hover:bg-[var(--color-cyan)] hover:text-[var(--color-void)]"
                >
                  RETURN TO PORTFOLIO →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer diagnostics */}
        <div
          data-404-item
          className="portfolio-mono mt-16 flex flex-wrap justify-between gap-4 border-t border-[var(--color-white)]/10 pt-5 text-[7px] tracking-[0.16em] text-[var(--color-dim)]"
        >
          <span>DIMENSION / UNKNOWN</span>
          <span>RECOVERY / READY</span>
          <span>E-FOLIO / 404</span>
        </div>
      </div>
    </main>
  );
}
