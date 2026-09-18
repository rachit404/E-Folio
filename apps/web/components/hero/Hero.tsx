"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { PortfolioData } from "@/content/schema/portfolio";
import type { PortfolioTheme } from "@/lib/theme";

import SceneFrame from "@/components/layout/SceneFrame";
import EngineeringCore from "@/components/webgl/EngineeringCore";
import HeroAtmosphere from "@/components/hero/HeroAtmosphere";

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
      const core = hero.querySelector("[data-engineering-core]");
      const status = hero.querySelector("[data-hero-status]");
      const coordinates = hero.querySelector("[data-hero-coordinates]");
      const background = hero.querySelector("[data-hero-background]");
      const grid = hero.querySelector("[data-hero-grid]");

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
            duration: 0.8,
          },
        )
        .fromTo(
          title,
          {
            opacity: 0,
            y: 70,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.15,
          },
          "-=0.35",
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
            duration: 0.7,
          },
          "-=0.65",
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
            duration: 0.6,
          },
          "-=0.4",
        )
        .fromTo(
          core,
          {
            opacity: 0,
            scale: 0.7,
            rotation: -20,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.3,
            ease: "expo.out",
          },
          "-=0.9",
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
          "-=0.5",
        )
        .fromTo(
          coordinates,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=0.4",
        );

      if (grid) {
        gsap.to(grid, {
          yPercent: 12,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (background) {
        gsap.to(background, {
          yPercent: 18,
          scale: 1.08,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (core) {
        gsap.to(core, {
          yPercent: -18,
          rotation: "+=40",
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  const backgroundImage = theme.hero.backgroundImage;

  return (
    <SceneFrame
      id="home"
      number="00"
      label="SYSTEM INITIALIZATION"
      className="min-h-screen"
    >
      <HeroAtmosphere />

      <div ref={heroRef} className="relative min-h-[72vh] overflow-hidden">
        {backgroundImage && (
          <div
            data-hero-background
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(0,229,255,0.08),transparent_30%),radial-gradient(circle_at_18%_75%,rgba(255,33,71,0.08),transparent_30%)]" />

        <div
          data-hero-grid
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"
        />

        <div className="relative z-10 flex min-h-[72vh] flex-col justify-center">
          <div className="max-w-6xl">
            <div data-hero-eyebrow className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[var(--color-red)]" />

              <p className="portfolio-mono text-[10px] tracking-[0.18em] text-[var(--color-cyan)]">
                {theme.hero.eyebrow}
              </p>
            </div>

            <h1
              data-hero-title
              className="portfolio-display max-w-6xl text-[clamp(4.5rem,13vw,12rem)] font-black leading-[0.76] tracking-[-0.06em]"
            >
              {portfolio.metadata.name}
              <span className="text-[var(--color-red)]">.</span>
            </h1>

            <div
              data-hero-subtitle
              className="mt-10 flex flex-col gap-5 md:flex-row md:items-center"
            >
              <span className="h-px w-14 bg-[var(--color-red)]" />

              <p className="max-w-xl text-sm leading-6 text-[var(--color-muted)] md:text-base">
                {portfolio.metadata.course}
              </p>
            </div>

            <div
              data-hero-cta
              className="mt-12 flex flex-wrap items-center gap-5"
            >
              <a
                href="#about"
                className="portfolio-mono border border-[var(--color-cyan)]/50 px-7 py-4 text-[10px] tracking-[0.12em] transition-all duration-300 hover:bg-[var(--color-cyan)] hover:text-[var(--color-void)]"
              >
                {theme.hero.cta} →
              </a>

              <span className="portfolio-mono text-[9px] text-[var(--color-dim)]">
                {theme.hero.scrollLabel}
              </span>
            </div>
          </div>
        </div>

        <div
          data-engineering-core
          className="absolute bottom-6 right-0 z-10 hidden aspect-square w-[38vw] max-w-[520px] md:block"
        >
          <EngineeringCore model={theme.hero.model} />

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-cyan)] shadow-[0_0_30px_var(--color-cyan)]" />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="portfolio-mono text-[8px] tracking-[0.25em] text-[var(--color-cyan)]">
                ENGINEERING CORE
              </span>
            </div>
          </div>
        </div>

        <div
          data-hero-status
          className="absolute bottom-4 right-4 z-10 md:bottom-10 md:right-10"
        >
          <div className="portfolio-mono flex items-center gap-3 text-[8px] text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 bg-[var(--color-cyan)] shadow-[0_0_10px_var(--color-cyan)]" />

            {theme.hero.status}
          </div>
        </div>

        <div
          data-hero-coordinates
          className="absolute bottom-4 left-0 z-10 portfolio-mono text-[8px] text-[var(--color-dim)]"
        >
          19.0760° N / 72.8777° E
        </div>
      </div>
    </SceneFrame>
  );
}
