"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

import type { PortfolioData } from "@/content/schema/portfolio";
import SceneFrame from "@/components/layout/SceneFrame";

interface ContactSceneProps {
  portfolio: PortfolioData;
}

interface ContactLink {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export default function ContactScene({ portfolio }: ContactSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const links = useMemo<ContactLink[]>(() => {
    const result: ContactLink[] = [];

    if (portfolio.metadata.email) {
      result.push({
        label: "EMAIL",
        value: portfolio.metadata.email,
        href: `mailto:${portfolio.metadata.email}`,
      });
    }

    if (portfolio.metadata.links.github) {
      result.push({
        label: "GITHUB",
        value: portfolio.metadata.links.github.replace(/^https?:\/\//, ""),
        href: portfolio.metadata.links.github,
        external: true,
      });
    }

    if (portfolio.metadata.links.linkedin) {
      result.push({
        label: "LINKEDIN",
        value: portfolio.metadata.links.linkedin.replace(/^https?:\/\//, ""),
        href: portfolio.metadata.links.linkedin,
        external: true,
      });
    }

    return result;
  }, [portfolio.metadata]);

  useEffect(() => {
    const root = sceneRef.current;

    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-element]",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
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
      id="contact"
      number="06"
      label="TRANSMISSION / CONTACT"
      className="min-h-screen"
    >
      <div ref={sceneRef}>
        <section className="relative min-h-screen overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[8%] top-[20%] h-px w-[32%] bg-[var(--color-cyan)]/20" />
            <div className="absolute right-[8%] top-[35%] h-px w-[24%] bg-[var(--color-red)]/20" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
              <div>
                <p
                  data-contact-element
                  className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-cyan)]"
                >
                  06 / OPEN CHANNEL
                </p>

                <h2
                  data-contact-element
                  className="portfolio-display mt-7 text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]"
                >
                  LET&apos;S
                  <br />
                  <span className="text-[var(--color-red)]">BUILD.</span>
                </h2>

                <p
                  data-contact-element
                  className="mt-10 max-w-xl border-l border-[var(--color-cyan)]/40 pl-6 text-base leading-8 text-[var(--color-muted)] md:text-lg"
                >
                  Establish a transmission through any available channel.
                </p>

                <div data-contact-element className="portfolio-mono mt-10">
                  <span className="text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                    ACTIVE IDENTITY
                  </span>

                  <p className="mt-2 text-sm text-white">
                    {portfolio.metadata.name ?? "ENGINEER"}
                  </p>

                  {portfolio.metadata.course && (
                    <p className="mt-2 text-[8px] text-[var(--color-dim)]">
                      {portfolio.metadata.course}
                    </p>
                  )}
                </div>
              </div>

              <div
                data-contact-element
                className="border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/40 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <span className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-cyan)]">
                    TRANSMISSION TERMINAL
                  </span>

                  <span className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                    ONLINE
                  </span>
                </div>

                {links.length === 0 ? (
                  <div className="px-6 py-10">
                    <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                      NO TRANSMISSION CHANNELS DETECTED
                    </span>
                  </div>
                ) : (
                  links.map((link, index) => (
                    <a
                      key={`${link.label}-${link.href}`}
                      data-contact-element
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 border-b border-white/10 px-5 py-6 transition hover:bg-white/[0.02]"
                    >
                      <span className="portfolio-mono flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 text-[8px] text-[var(--color-dim)] group-hover:border-[var(--color-cyan)]/40 group-hover:text-[var(--color-cyan)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]">
                          {link.label}
                        </p>

                        <p className="mt-2 truncate text-sm text-[var(--color-muted)] group-hover:text-white">
                          {link.value}
                        </p>
                      </div>

                      <span className="text-[var(--color-red)]">
                        {link.external ? "↗" : "→"}
                      </span>
                    </a>
                  ))
                )}
              </div>
            </div>

            <div
              data-contact-element
              className="mt-20 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"
            >
              <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
                PORTFOLIO COMPLETE / 06
              </span>

              <a
                href="#home"
                className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)] hover:text-white"
              >
                RETURN TO ORIGIN ↑
              </a>
            </div>
          </div>
        </section>
      </div>
    </SceneFrame>
  );
}
