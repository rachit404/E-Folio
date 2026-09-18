"use client";

import { useState } from "react";

interface PortfolioNavProps {
  profiles: string[];
  activeRole: string;
}

const navigation = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "SKILLS", href: "#skills" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

function formatRole(role: string): string {
  return role.replace(/[-_]+/g, " ").toUpperCase();
}

export default function PortfolioNav({
  profiles,
  activeRole,
}: PortfolioNavProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  const switchRole = (role: string) => {
    window.location.href = `/${encodeURIComponent(role)}#home`;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10">
          <a
            href="#home"
            onClick={closeMenu}
            className="group relative"
            aria-label="Rachit Doshi - Home"
          >
            <div className="portfolio-display text-xl font-black tracking-tight md:text-2xl">
              RD
              <span className="text-[var(--color-red)]">.</span>
            </div>

            <div className="portfolio-mono mt-0.5 text-[8px] text-[var(--color-dim)]">
              E-FOLIO / 01
            </div>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-8"
            >
              {navigation.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group portfolio-mono relative text-[10px] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-white)]"
                >
                  <span className="mr-1 text-[8px] text-[var(--color-dim)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {item.label}

                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-[var(--color-cyan)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Role switcher */}
            {profiles.length > 0 && (
              <div className="relative border-l border-white/10 pl-6">
                <label
                  htmlFor="portfolio-role"
                  className="portfolio-mono mr-2 text-[8px] tracking-[0.16em] text-[var(--color-dim)]"
                >
                  ROLE
                </label>

                <select
                  id="portfolio-role"
                  value={activeRole}
                  onChange={(event) => switchRole(event.target.value)}
                  className="portfolio-mono cursor-pointer appearance-none border border-[var(--color-cyan)]/20 bg-[var(--color-panel)] px-3 py-2 pr-7 text-[9px] tracking-[0.12em] text-[var(--color-cyan)] outline-none transition-colors hover:border-[var(--color-cyan)]/50"
                  aria-label="Select portfolio role"
                >
                  {profiles.map((profile) => (
                    <option key={profile} value={profile}>
                      {formatRole(profile)}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-2 bottom-[9px] text-[8px] text-[var(--color-cyan)]">
                  ▼
                </span>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="portfolio-mono flex h-10 w-10 items-center justify-center border border-white/10 text-xs text-[var(--color-white)] transition-colors hover:border-[var(--border-active)] md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-void)]/98 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex h-full flex-col justify-center px-8"
        >
          <p className="portfolio-mono mb-8 text-[10px] text-[var(--color-cyan)]">
            NAVIGATION // SYSTEM
          </p>

          <div className="flex flex-col">
            {navigation.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center border-b border-white/10 py-5"
              >
                <span className="portfolio-mono mr-6 text-xs text-[var(--color-dim)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="portfolio-display text-3xl font-bold text-[var(--color-white)]">
                  {item.label}
                </span>

                <span className="ml-auto text-[var(--color-cyan)] opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </a>
            ))}
          </div>

          {/* Mobile role switcher */}
          {profiles.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <label
                htmlFor="portfolio-role-mobile"
                className="portfolio-mono mb-3 block text-[9px] tracking-[0.18em] text-[var(--color-dim)]"
              >
                ACTIVE ROLE
              </label>

              <select
                id="portfolio-role-mobile"
                value={activeRole}
                onChange={(event) => switchRole(event.target.value)}
                className="portfolio-mono w-full appearance-none border border-[var(--color-cyan)]/30 bg-[var(--color-panel)] px-4 py-4 text-sm tracking-[0.12em] text-[var(--color-cyan)] outline-none"
                aria-label="Select portfolio role"
              >
                {profiles.map((profile) => (
                  <option key={profile} value={profile}>
                    {formatRole(profile)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
