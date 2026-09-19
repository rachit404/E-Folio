"use client";

import { useEffect, useState } from "react";

interface SceneFrameProps {
  id: string;
  number: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function SceneFrame({
  id,
  number,
  label,
  children,
  className = "",
}: SceneFrameProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);

    if (!element) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -5% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [id]);

  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full items-center overflow-hidden ${className}`}
    >
      {/* Scene geometry */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-6 top-24 h-px w-24 origin-left bg-[var(--border-subtle)] transition-transform duration-1000 ease-out md:left-10 ${
            visible ? "scale-x-100" : "scale-x-0"
          }`}
        />

        <div
          className={`absolute bottom-8 left-6 right-6 h-px origin-left bg-white/5 transition-transform duration-[1200ms] ease-out md:left-10 md:right-10 ${
            visible ? "scale-x-100" : "scale-x-0"
          }`}
        />

        <div
          className={`absolute right-6 top-24 transition-all duration-700 ${
            visible ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
          } md:right-10`}
        >
          <span className="portfolio-mono text-[9px] text-[var(--color-dim)]">
            SCENE {number}
          </span>
        </div>
      </div>

      {/* Main scene */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-32 md:px-10">
        {/* Scene label */}
        <div
          className={`mb-8 flex items-center gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            visible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <span className="portfolio-mono text-[10px] text-[var(--color-cyan)]">
            {number}
          </span>

          <span
            className={`h-px bg-[var(--color-red)] transition-all duration-700 delay-200 ${
              visible ? "w-8" : "w-0"
            }`}
          />

          <span
            className={`portfolio-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)] transition-all duration-700 delay-300 ${
              visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
          >
            {label}
          </span>
        </div>

        {/* Scene content */}
        <div
          className={`transition-all duration-[1100ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-24 scale-[0.96] opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
