"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

interface PortfolioNavProps {
  profiles: string[];
  activeRole: string;
}

const navigation = [
  {
    label: "HOME",
    href: "#home",
    id: "home",
    number: "00",
  },
  {
    label: "ABOUT",
    href: "#about",
    id: "about",
    number: "01",
  },
  {
    label: "EXPERIENCE",
    href: "#experience",
    id: "experience",
    number: "02",
  },
  {
    label: "PROJECTS",
    href: "#projects",
    id: "projects",
    number: "03",
  },
  {
    label: "SKILLS",
    href: "#skills",
    id: "skills",
    number: "05",
  },
  {
    label: "CONTACT",
    href: "#contact",
    id: "contact",
    number: "06",
  },
] as const;

function formatRole(role: string) {
  return role.replace(/[-_]+/g, " ").toUpperCase();
}

export default function PortfolioNav({
  profiles,
  activeRole,
}: PortfolioNavProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;

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

  useEffect(() => {
    const updateNavigationState = () => {
      scrollFrame.current = null;

      const viewportAnchor = window.innerHeight * 0.42;

      let closestId = "home";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of navigation) {
        const section = document.getElementById(item.id);

        if (!section) continue;

        const rect = section.getBoundingClientRect();

        if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
          continue;
        }

        const center = rect.top + rect.height / 2;

        const distance = Math.abs(center - viewportAnchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = item.id;
        }
      }

      setActiveSection((current) =>
        current === closestId ? current : closestId,
      );

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;

      setScrollProgress(progress);
    };

    const requestUpdate = () => {
      if (scrollFrame.current !== null) {
        return;
      }

      scrollFrame.current = window.requestAnimationFrame(updateNavigationState);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });

    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);

      window.removeEventListener("resize", requestUpdate);

      if (scrollFrame.current !== null) {
        window.cancelAnimationFrame(scrollFrame.current);

        scrollFrame.current = null;
      }
    };
  }, []);

  const navigateToSection = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();

    setOpen(false);

    const target = document.getElementById(id);

    if (!target) return;

    const offset = 8;

    const position =
      target.getBoundingClientRect().top + window.scrollY - offset;

    window.history.replaceState(null, "", `#${id}`);

    window.scrollTo({
      top: Math.max(0, position),
      behavior: "smooth",
    });
  };

  const switchRole = (role: string) => {
    window.location.href = `/${encodeURIComponent(role)}#home`;
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-white/[0.04]">
        <div
          className="h-full origin-left bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-cyan)] to-[var(--color-red)] transition-transform duration-150"
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
            className="group"
            aria-label="Home"
          >
            <div className="portfolio-display text-xl font-black md:text-2xl">
              RD
              <span className="text-[var(--color-red)]">.</span>
            </div>

            <div className="portfolio-mono mt-0.5 text-[8px] text-[var(--color-dim)]">
              E-FOLIO / WORLD
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-7"
            >
              {navigation.map((item) => {
                const active = activeSection === item.id;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => navigateToSection(event, item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`group portfolio-mono relative text-[9px] transition-colors ${
                      active
                        ? "text-white"
                        : "text-[var(--color-muted)] hover:text-white"
                    }`}
                  >
                    <span
                      className={`mr-1 text-[7px] ${
                        active
                          ? "text-[var(--color-cyan)]"
                          : "text-[var(--color-dim)]"
                      }`}
                    >
                      {item.number}
                    </span>

                    {item.label}

                    <span
                      className={`absolute -bottom-2 left-0 h-px bg-[var(--color-cyan)] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {profiles.length > 0 && (
              <div className="border-l border-white/10 pl-6">
                <label
                  htmlFor="portfolio-role"
                  className="portfolio-mono mr-2 text-[7px] tracking-[0.16em] text-[var(--color-dim)]"
                >
                  ROLE
                </label>

                <select
                  id="portfolio-role"
                  value={activeRole}
                  onChange={(event) => switchRole(event.target.value)}
                  className="portfolio-mono cursor-pointer appearance-none border border-[var(--color-cyan)]/20 bg-[var(--color-panel)] px-3 py-2 text-[8px] tracking-[0.12em] text-[var(--color-cyan)] outline-none"
                >
                  {profiles.map((profile) => (
                    <option key={profile} value={profile}>
                      {formatRole(profile)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="portfolio-mono flex h-10 w-10 items-center justify-center border border-white/10 text-xs text-white transition-colors hover:border-[var(--color-cyan)]/40 md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[var(--color-void)]/98 backdrop-blur-xl transition-opacity duration-500 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center px-8">
          <span className="portfolio-mono mb-8 text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
            NAVIGATION // WORLD SYSTEM
          </span>

          {navigation.map((item) => {
            const active = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(event) => navigateToSection(event, item.id)}
                tabIndex={open ? 0 : -1}
                className="flex items-center border-b border-white/10 py-5"
              >
                <span className="portfolio-mono mr-6 text-[9px] text-[var(--color-cyan)]">
                  {item.number}
                </span>

                <span
                  className={`portfolio-display text-3xl font-bold ${
                    active ? "text-[var(--color-cyan)]" : "text-white"
                  }`}
                >
                  {item.label}
                </span>

                <span className="ml-auto text-[var(--color-red)]">→</span>
              </a>
            );
          })}

          {profiles.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <label
                htmlFor="portfolio-role-mobile"
                className="portfolio-mono mb-3 block text-[8px] tracking-[0.18em] text-[var(--color-dim)]"
              >
                ACTIVE ROLE
              </label>

              <select
                id="portfolio-role-mobile"
                value={activeRole}
                onChange={(event) => switchRole(event.target.value)}
                className="portfolio-mono w-full border border-[var(--color-cyan)]/30 bg-[var(--color-panel)] px-4 py-4 text-sm text-[var(--color-cyan)] outline-none"
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
