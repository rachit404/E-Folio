"use client";

import { useEffect, useState, type MouseEvent } from "react";

interface PortfolioNavProps {
  profiles: string[];
  activeRole: string;
}

const navigation = [
  { label: "HOME", href: "#home", id: "home" },
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "EXPERIENCE", href: "#experience", id: "experience" },
  { label: "SKILLS", href: "#skills", id: "skills" },
  { label: "PROJECTS", href: "#projects", id: "projects" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

function formatRole(role: string): string {
  return role.replace(/[-_]+/g, " ").toUpperCase();
}

export default function PortfolioNav({
  profiles,
  activeRole,
}: PortfolioNavProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const closeMenu = () => {
    setOpen(false);
  };

  const switchRole = (role: string) => {
    window.location.href = `/${encodeURIComponent(role)}#home`;
  };

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      const scrollTop = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const navigateToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();

    closeMenu();

    const target = document.getElementById(id);

    if (!target) return;

    const headerOffset = 12;

    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.history.replaceState(null, "", `#${id}`);

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-white/[0.04]">
        <div
          className="h-full origin-left bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-cyan)] to-[var(--color-red)] shadow-[0_0_10px_rgba(0,229,255,0.5)]"
          style={{
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </div>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-10">
          <a
            href="#home"
            onClick={(event) => navigateToSection(event, "home")}
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
              {navigation.map((item, index) => {
                const isActive = activeSection === item.id;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(event) => navigateToSection(event, item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group portfolio-mono relative text-[10px] transition-colors duration-300 ${
                      isActive
                        ? "text-[var(--color-white)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-white)]"
                    }`}
                  >
                    <span
                      className={`mr-1 text-[8px] ${
                        isActive
                          ? "text-[var(--color-cyan)]"
                          : "text-[var(--color-dim)]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {item.label}

                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-[var(--color-cyan)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                );
              })}
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

                <span className="pointer-events-none absolute bottom-[9px] right-2 text-[8px] text-[var(--color-cyan)]">
                  ▼
                </span>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="portfolio-mono flex h-10 w-10 items-center justify-center border border-white/10 text-xs text-[var(--color-white)] transition-colors hover:border-[var(--color-cyan)]/50 md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-[var(--color-void)]/98 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex h-full flex-col justify-center overflow-y-auto px-8 pb-10 pt-24"
        >
          <p className="portfolio-mono mb-8 text-[10px] text-[var(--color-cyan)]">
            NAVIGATION // SYSTEM
          </p>

          <div className="flex flex-col">
            {navigation.map((item, index) => {
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => navigateToSection(event, item.id)}
                  tabIndex={open ? 0 : -1}
                  className={`group flex items-center border-b border-white/10 py-5 ${
                    isActive ? "text-[var(--color-cyan)]" : ""
                  }`}
                >
                  <span
                    className={`portfolio-mono mr-6 text-xs ${
                      isActive
                        ? "text-[var(--color-cyan)]"
                        : "text-[var(--color-dim)]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`portfolio-display text-3xl font-bold ${
                      isActive
                        ? "text-[var(--color-cyan)]"
                        : "text-[var(--color-white)]"
                    }`}
                  >
                    {item.label}
                  </span>

                  <span
                    className={`ml-auto transition-opacity ${
                      isActive
                        ? "text-[var(--color-cyan)] opacity-100"
                        : "text-[var(--color-cyan)] opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    →
                  </span>
                </a>
              );
            })}
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

          <div className="portfolio-mono mt-10 flex justify-between text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
            <span>E-FOLIO / NAV</span>
            <span>ESC / CLOSE</span>
          </div>
        </nav>
      </div>
    </>
  );
}
