"use client";

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
  const { metadata } = portfolio;

  const links: ContactLink[] = [];

  if (metadata.email) {
    links.push({
      label: "EMAIL",
      value: metadata.email,
      href: `mailto:${metadata.email}`,
    });
  }

  if (metadata.links.github) {
    links.push({
      label: "GITHUB",
      value: metadata.links.github.replace(/^https?:\/\//, ""),
      href: metadata.links.github,
      external: true,
    });
  }

  if (metadata.links.linkedin) {
    links.push({
      label: "LINKEDIN",
      value: metadata.links.linkedin.replace(/^https?:\/\//, ""),
      href: metadata.links.linkedin,
      external: true,
    });
  }

  return (
    <SceneFrame
      id="contact"
      number="05"
      label="TRANSMISSION / CONTACT"
      className="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden">
        {/* Background system */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[18%] h-px w-[36%] bg-[var(--color-cyan)]/20" />

          <div className="absolute right-[8%] top-[35%] h-px w-[24%] bg-[var(--color-red)]/20" />

          <div className="absolute bottom-[22%] left-[18%] h-px w-[22%] bg-[var(--color-cyan)]/10" />

          <div className="absolute right-[12%] bottom-[18%] h-32 w-32 border border-[var(--color-red)]/10" />

          <div className="absolute right-[15%] bottom-[21%] h-20 w-20 border border-[var(--color-cyan)]/10" />

          <div className="absolute right-[18%] bottom-[24%] h-8 w-8 bg-[var(--color-cyan)]/20 blur-md" />
        </div>

        <div className="relative z-10 grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-24">
          {/* Main transmission */}
          <div>
            <p className="portfolio-mono mb-7 text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
              05 / OPEN CHANNEL
            </p>

            <h2 className="portfolio-display text-[clamp(4rem,9vw,9rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]">
              LET&apos;S
              <br />
              <span className="text-[var(--color-red)]">BUILD.</span>
            </h2>

            <div className="mt-10 max-w-xl border-l border-[var(--color-cyan)]/40 pl-6">
              <p className="text-base leading-7 text-[var(--color-muted)] md:text-lg">
                Have an interesting problem, opportunity, collaboration, or
                system worth building?
              </p>

              <p className="mt-3 text-sm leading-7 text-[var(--color-dim)]">
                Establish a transmission through any available channel.
              </p>
            </div>

            {/* Identity */}
            <div className="portfolio-mono mt-12">
              <p className="text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                ACTIVE IDENTITY
              </p>

              <p className="mt-2 text-sm tracking-[0.12em] text-[var(--color-white)]">
                {metadata.name ?? "ENGINEER"}
              </p>
            </div>
          </div>

          {/* Communication terminal */}
          <div className="relative">
            <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.07),transparent_65%)]" />

            <div className="relative border border-[var(--color-cyan)]/20 bg-[var(--color-panel)]/40 backdrop-blur-sm">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-[var(--color-white)]/10 px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />

                  <span className="portfolio-mono text-[9px] tracking-[0.18em] text-[var(--color-cyan)]">
                    TRANSMISSION TERMINAL
                  </span>
                </div>

                <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                  ONLINE
                </span>
              </div>

              {/* Connection status */}
              <div className="border-b border-[var(--color-white)]/10 px-5 py-5 md:px-6">
                <div className="flex items-center justify-between">
                  <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                    CHANNEL STATUS
                  </span>

                  <span className="portfolio-mono text-[8px] text-[var(--color-cyan)]">
                    READY
                  </span>
                </div>

                <div className="mt-4 h-px w-full overflow-hidden bg-[var(--color-white)]/10">
                  <div className="h-full w-2/3 bg-[var(--color-cyan)]" />
                </div>
              </div>

              {/* Contact channels */}
              <div>
                {links.length === 0 ? (
                  <div className="px-5 py-8 md:px-6">
                    <p className="portfolio-mono text-[9px] tracking-[0.14em] text-[var(--color-dim)]">
                      NO TRANSMISSION CHANNELS DETECTED
                    </p>
                  </div>
                ) : (
                  links.map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 border-b border-[var(--color-white)]/10 px-5 py-6 transition-colors duration-300 hover:bg-[var(--color-white)]/[0.025] md:px-6"
                    >
                      <span className="portfolio-mono w-6 shrink-0 text-[8px] text-[var(--color-dim)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-cyan)]">
                          {link.label}
                        </p>

                        <p className="mt-2 truncate text-sm text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-white)]">
                          {link.value}
                        </p>
                      </div>

                      <span className="shrink-0 text-[var(--color-red)] transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  ))
                )}
              </div>

              {/* Terminal footer */}
              <div className="flex items-center justify-between px-5 py-4 md:px-6">
                <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                  ENCRYPTED CHANNEL
                </span>

                <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
                  E-FOLIO // 05
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="relative z-10 mt-20 flex flex-col gap-5 border-t border-[var(--color-white)]/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="portfolio-mono flex flex-wrap gap-4 text-[8px] tracking-[0.14em] text-[var(--color-dim)]">
            <span>PORTFOLIO COMPLETE</span>

            <span className="text-[var(--color-cyan)]">05 / 05</span>
          </div>

          <a
            href="#home"
            className="portfolio-mono text-[9px] tracking-[0.14em] text-[var(--color-cyan)] transition-colors hover:text-[var(--color-white)]"
          >
            RETURN TO ORIGIN ↑
          </a>
        </div>
      </section>
    </SceneFrame>
  );
}
