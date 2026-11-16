import type { PortfolioData } from "@/content/schema/portfolio";

import ComicPage from "@/components/comic/ComicPage";
import { ComicBeat, ComicPanel } from "@/components/comic/ComicPanel";
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

/** Channels derived from the resume metadata: email first, then links. */
function buildLinks(metadata: PortfolioData["metadata"]): ContactLink[] {
  const result: ContactLink[] = [];

  if (metadata.email) {
    result.push({
      label: "EMAIL",
      value: metadata.email,
      href: `mailto:${metadata.email}`,
    });
  }

  for (const [key, url] of Object.entries(metadata.links)) {
    result.push({
      label: key.toUpperCase(),
      value: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: url,
      external: true,
    });
  }

  return result;
}

export default function ContactScene({ portfolio }: ContactSceneProps) {
  const links = buildLinks(portfolio.metadata);

  return (
    <SceneFrame
      id="contact"
      number="06"
      label="TRANSMISSION / CONTACT"
      className="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
          <ComicPage sceneId="contact" issue="FINAL ISSUE // OPEN CHANNEL">
            <ComicPanel wide caption="TO BE CONTINUED...">
              <ComicBeat
                as="p"
                className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-primary)]"
              >
                06 / OPEN CHANNEL
              </ComicBeat>

              <ComicBeat
                as="h2"
                className="portfolio-display mt-7 text-[clamp(4rem,10vw,9rem)] font-black leading-[0.8] tracking-[-0.06em]"
              >
                LET&apos;S
                <br />
                <span className="text-[var(--color-accent)]">BUILD.</span>
              </ComicBeat>

              <ComicBeat
                as="p"
                className="mt-10 max-w-xl border-l-4 border-[var(--color-primary)] pl-6 text-base leading-8 text-[var(--color-muted)] md:text-lg"
              >
                Establish a transmission through any available channel.
              </ComicBeat>

              <ComicBeat className="portfolio-mono mt-10">
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-dim)]">
                  ACTIVE IDENTITY
                </span>

                <p className="mt-2 text-sm text-[var(--color-white)]">
                  {portfolio.metadata.name ?? "ENGINEER"}
                </p>

                {portfolio.metadata.course && (
                  <p className="mt-2 text-[8px] text-[var(--color-dim)]">
                    {portfolio.metadata.course}
                  </p>
                )}
              </ComicBeat>
            </ComicPanel>

            <ComicPanel wide caption="TRANSMISSION TERMINAL">
              {links.length === 0 ? (
                <p className="portfolio-mono text-[8px] text-[var(--color-dim)]">
                  NO TRANSMISSION CHANNELS DETECTED
                </p>
              ) : (
                <ul className="divide-y-2 divide-dashed divide-white/15">
                  {links.map((link, index) => (
                    <ComicBeat as="li" key={`${link.label}-${link.href}`}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-4 py-5 transition-colors first:pt-0 last:pb-0"
                      >
                        <span className="portfolio-mono flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[var(--comic-ink)] text-[9px] text-[var(--color-dim)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-void)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="portfolio-mono block text-[8px] tracking-[0.16em] text-[var(--color-primary)]">
                            {link.label}
                          </span>

                          <span className="mt-2 block truncate text-sm text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-white)]">
                            {link.value}
                          </span>
                        </span>

                        <span className="text-xl font-black text-[var(--color-accent)]">
                          {link.external ? "↗" : "→"}
                        </span>
                      </a>
                    </ComicBeat>
                  ))}
                </ul>
              )}
            </ComicPanel>
          </ComicPage>

          <div className="mt-20 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <span className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-dim)]">
              PORTFOLIO COMPLETE / 06
            </span>

            <a
              href="#home"
              className="portfolio-mono text-[8px] tracking-[0.16em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-white)]"
            >
              RETURN TO ORIGIN ↑
            </a>
          </div>
        </div>
      </section>
    </SceneFrame>
  );
}
