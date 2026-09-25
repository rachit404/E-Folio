"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

gsap.registerPlugin(ScrollTrigger);

interface AboutSceneProps {
  portfolio: PortfolioData;
}

export default function AboutScene({ portfolio }: AboutSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sceneRef.current;

    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const elements = root.querySelectorAll("[data-about-element]");

      if (!elements.length) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <SceneFrame
      id="about"
      number="01"
      label="IDENTITY / SYSTEM PROFILE"
      className="min-h-screen"
    >
      <div ref={sceneRef}>
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[20%] h-px w-[30%] bg-[var(--color-cyan)]/20" />
            <div className="absolute right-[8%] top-[34%] h-px w-[22%] bg-[var(--color-red)]/20" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div>
                <p
                  data-about-element
                  className="portfolio-mono mb-6 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]"
                >
                  01 / IDENTITY
                </p>

                <h2
                  data-about-element
                  className="portfolio-display text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]"
                >
                  {portfolio.metadata.name ?? "ENGINEER"}
                  <span className="text-[var(--color-red)]">.</span>
                </h2>

                {portfolio.metadata.course && (
                  <p
                    data-about-element
                    className="portfolio-mono mt-6 text-[9px] tracking-[0.14em] text-[var(--color-cyan)]"
                  >
                    {portfolio.metadata.course}
                  </p>
                )}

                <div
                  data-about-element
                  className="mt-10 border-l border-[var(--color-cyan)]/40 pl-6"
                >
                  <p className="text-base leading-8 text-[var(--color-muted)] md:text-lg">
                    The portfolio record below is derived directly from the
                    active source data.
                  </p>
                </div>
              </div>

              <div
                data-about-element
                className="border border-white/10 bg-[var(--color-panel)]/30"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <span className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-cyan)]">
                    PORTFOLIO RECORD
                  </span>

                  <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                    VERIFIED
                  </span>
                </div>

                <div>
                  {portfolio.sections.map((section, index) => (
                    <div
                      key={`${section.heading}-${index}`}
                      data-about-element
                      className="flex items-center justify-between border-b border-white/10 px-5 py-5 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {section.heading}
                        </p>

                        <p className="portfolio-mono mt-1 text-[7px] uppercase tracking-[0.14em] text-[var(--color-dim)]">
                          {section.kind}
                        </p>
                      </div>

                      <span className="portfolio-mono text-[8px] text-[var(--color-cyan)]">
                        {String(section.items.length).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
              <div data-about-element>
                <span className="portfolio-mono text-[7px] tracking-[0.18em] text-[var(--color-dim)]">
                  SOURCE
                </span>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {portfolio.source.file}
                </p>
              </div>

              <div data-about-element>
                <span className="portfolio-mono text-[7px] tracking-[0.18em] text-[var(--color-dim)]">
                  SCHEMA
                </span>

                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  v{portfolio.schemaVersion}
                </p>
              </div>

              <div data-about-element className="md:text-right">
                <a
                  href="#experience"
                  className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)] hover:text-white"
                >
                  EXPERIENCE →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
