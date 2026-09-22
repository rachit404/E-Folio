"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PortfolioData } from "@/content/schema/portfolio";
import type { PortfolioTheme } from "@/lib/theme";

import WorldFrame from "@/components/layout/WorldFrame";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  portfolio: PortfolioData;
  theme: PortfolioTheme;
}

export default function Hero({ portfolio, theme }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const eyebrow = hero.querySelector("[data-hero-eyebrow]");

      const title = hero.querySelector("[data-hero-title]");

      const subtitle = hero.querySelector("[data-hero-subtitle]");

      const cta = hero.querySelector("[data-hero-cta]");

      const system = hero.querySelector("[data-hero-system]");

      const status = hero.querySelector("[data-hero-status]");

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .fromTo(
          eyebrow,
          {
            opacity: 0,
            x: -30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
          },
        )
        .fromTo(
          title,
          {
            opacity: 0,
            y: 55,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
          },
          "-=0.3",
        )
        .fromTo(
          subtitle,
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
          },
          "-=0.55",
        )
        .fromTo(
          system,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
          },
          "-=0.4",
        )
        .fromTo(
          cta,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.35",
        )
        .fromTo(
          status,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=0.3",
        );

      gsap.to(hero, {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <WorldFrame
      id="home"
      number="00"
      label="SYSTEM INITIALIZATION"
      className="min-h-screen"
    >
      <div
        ref={heroRef}
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Fine cinematic texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:radial-gradient(rgba(244,241,234,0.6)_0.7px,transparent_0.7px)] [background-size:6px_6px]"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-28 pt-36 md:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Identity */}
            <div className="max-w-5xl">
              <div data-hero-eyebrow className="mb-7 flex items-center gap-4">
                <span className="h-px w-10 bg-[var(--color-red)]" />

                <p className="portfolio-mono text-[10px] tracking-[0.18em] text-[var(--color-cyan)]">
                  {theme.hero.eyebrow}
                </p>
              </div>

              <h1
                data-hero-title
                className="portfolio-display text-[clamp(4.2rem,11vw,11rem)] font-black leading-[0.78] tracking-[-0.065em]"
              >
                {portfolio.metadata.name}

                <span className="text-[var(--color-red)]">.</span>
              </h1>

              <div
                data-hero-subtitle
                className="mt-10 flex max-w-2xl items-start gap-5"
              >
                <span className="mt-3 h-px w-14 shrink-0 bg-[var(--color-red)]" />

                <p className="text-base leading-7 text-[var(--color-white)]/75 md:text-lg">
                  {portfolio.metadata.course}
                </p>
              </div>

              <div
                data-hero-cta
                className="mt-12 flex flex-wrap items-center gap-5"
              >
                <a
                  href="#about"
                  className="portfolio-mono border border-[var(--color-cyan)]/55 bg-[var(--color-void)]/35 px-7 py-4 text-[10px] tracking-[0.12em] backdrop-blur-sm transition-all duration-300 hover:bg-[var(--color-cyan)] hover:text-[var(--color-void)]"
                >
                  {theme.hero.cta} →
                </a>

                <span className="portfolio-mono text-[8px] tracking-[0.14em] text-[var(--color-dim)]">
                  {theme.hero.scrollLabel}
                </span>
              </div>
            </div>

            {/* World system readout */}
            <div data-hero-system className="hidden justify-self-end lg:block">
              <div className="w-[300px] border-l border-[var(--color-cyan)]/30 pl-6">
                <div className="portfolio-mono text-[8px] tracking-[0.18em] text-[var(--color-cyan)]">
                  WORLD SYSTEM
                </div>

                <div className="mt-7 space-y-5">
                  <div>
                    <div className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                      ENVIRONMENT
                    </div>

                    <div className="mt-1 text-sm text-[var(--color-white)]">
                      HOME / DIMENSION-00
                    </div>
                  </div>

                  <div>
                    <div className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                      AVATAR
                    </div>

                    <div className="mt-1 text-sm text-[var(--color-white)]">
                      SPIDER ENGINEER
                    </div>
                  </div>

                  <div>
                    <div className="portfolio-mono text-[7px] text-[var(--color-dim)]">
                      DATA SOURCE
                    </div>

                    <div className="mt-1 text-sm text-[var(--color-white)]">
                      PORTFOLIO / LIVE
                    </div>
                  </div>

                  <div className="h-px w-full bg-[var(--color-white)]/10" />

                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />

                    <span className="portfolio-mono text-[8px] text-[var(--color-cyan)]">
                      WORLD ONLINE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            data-hero-status
            className="absolute bottom-10 right-6 md:right-10"
          >
            <div className="portfolio-mono flex items-center gap-3 text-[8px] text-[var(--color-muted)]">
              <span className="h-1.5 w-1.5 bg-[var(--color-cyan)] shadow-[0_0_10px_var(--color-cyan)]" />

              {theme.hero.status}
            </div>
          </div>
        </div>
      </div>
    </WorldFrame>
  );
}
