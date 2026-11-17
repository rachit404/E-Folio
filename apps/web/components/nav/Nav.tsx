"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import Wordmark from "@/components/ui/Wordmark";
import { SCENES } from "@/lib/scenes/order";

interface NavProps {
  name: string;
  profiles: string[];
  activeRole: string;
  /** Extra controls (Interviewer mode, game toggles). */
  trailing?: ReactNode;
}

function formatRole(role: string) {
  return role.replace(/[-_]+/g, " ").toUpperCase();
}

export default function Nav({
  name,
  profiles,
  activeRole,
  trailing,
}: NavProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  const frame = useRef<number | null>(null);

  /* Scroll spy: the section crossing the middle of the viewport. */
  useEffect(() => {
    const update = () => {
      frame.current = null;

      const middle = window.innerHeight / 2;

      for (const scene of SCENES) {
        const rect = document.getElementById(scene.id)?.getBoundingClientRect();

        if (rect && rect.top <= middle && rect.bottom > middle) {
          setActive((current) => (current === scene.id ? current : scene.id));

          return;
        }
      }
    };

    const request = () => {
      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(update);
      }
    };

    request();

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);

      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);

        // Reset so a remount (React strict mode) can schedule again.
        frame.current = null;
      }
    };
  }, []);

  /* Mobile menu: lock scroll, close on Escape or when widened. */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previous;

      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();

    setOpen(false);

    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    window.history.replaceState(null, "", `#${id}`);

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  };

  const roleSelect = (
    <label className="micro flex items-center gap-2 text-[var(--color-muted)]">
      <span className="hidden lg:inline">Role</span>

      <select
        value={activeRole}
        onChange={(event) => router.push(`/${event.target.value}#home`)}
        aria-label="Resume role"
        className="micro border border-white/15 bg-[var(--color-void)]/70 px-2 py-1.5 text-[var(--color-primary)] outline-none focus-visible:border-[var(--color-primary)]"
      >
        {profiles.map((profile) => (
          <option key={profile} value={profile}>
            {formatRole(profile)}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[var(--color-void)]/85 to-transparent">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-6 px-6 md:px-12">
          <a
            href="#home"
            onClick={(event) => go(event, "home")}
            aria-label="Home"
          >
            <Wordmark name={name} />
          </a>

          <nav
            aria-label="Sections"
            className="hidden items-center gap-6 md:flex lg:gap-8"
          >
            {SCENES.map((scene) => {
              const current = active === scene.id;

              return (
                <a
                  key={scene.id}
                  href={`#${scene.id}`}
                  onClick={(event) => go(event, scene.id)}
                  aria-current={current ? "true" : undefined}
                  className={`micro relative py-2 transition-colors ${
                    current
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-white)]/80 hover:text-[var(--color-white)]"
                  }`}
                >
                  {scene.label}

                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px bg-[var(--color-accent)] transition-transform duration-300 ${
                      current ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {trailing}

            {roleSelect}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-[var(--color-white)] transition-transform ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />

              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-[var(--color-white)] transition-transform ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-[var(--color-void)]/95 px-6 pb-8 pt-24 backdrop-blur-md md:hidden"
        >
          <nav className="flex flex-col gap-5">
            {SCENES.map((scene, index) => (
              <a
                key={scene.id}
                href={`#${scene.id}`}
                onClick={(event) => go(event, scene.id)}
                className="brush text-3xl text-[var(--color-white)]"
              >
                <span className="micro mr-3 text-[var(--color-accent)]">
                  {String(index).padStart(2, "0")}
                </span>

                {scene.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
            {trailing}

            {roleSelect}
          </div>
        </div>
      )}
    </>
  );
}
