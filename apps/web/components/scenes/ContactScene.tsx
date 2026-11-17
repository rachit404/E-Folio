import type { PortfolioData } from "@/content/schema/portfolio";
import SceneSection from "@/components/shell/SceneSection";
import BrushTitle from "@/components/ui/BrushTitle";
import CopyButton from "@/components/ui/CopyButton";
import HoloCard from "@/components/ui/HoloCard";
import SectionChip from "@/components/ui/SectionChip";
import { channelIcon } from "@/components/ui/icons";
import { sceneNumber } from "@/lib/scenes/order";
import type { PortfolioTheme } from "@/lib/theme";

interface ContactSceneProps {
  portfolio: PortfolioData;
  copy: PortfolioTheme["copy"];
  role: string;
  hasResume: boolean;
}

interface Channel {
  key: string;
  label: string;
  value: string;
  href: string;
  external: boolean;
  download?: boolean;
}

/** Channels from the resume: email, every profile link, resume PDF. */
function buildChannels(
  metadata: PortfolioData["metadata"],
  role: string,
  hasResume: boolean,
  resumeLabel: string,
): Channel[] {
  const channels: Channel[] = [];

  if (metadata.email) {
    channels.push({
      key: "email",
      label: "Email",
      value: metadata.email,
      href: `mailto:${metadata.email}`,
      external: false,
    });
  }

  for (const [key, url] of Object.entries(metadata.links)) {
    channels.push({
      key,
      label: key,
      value: url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: url,
      external: true,
    });
  }

  if (hasResume) {
    channels.push({
      key: "resume",
      label: resumeLabel,
      value: `resume-${role}.pdf`,
      href: `/resume/${role}`,
      external: false,
      download: true,
    });
  }

  return channels;
}

export default function ContactScene({
  portfolio,
  copy,
  role,
  hasResume,
}: ContactSceneProps) {
  const channels = buildChannels(
    portfolio.metadata,
    role,
    hasResume,
    copy.ctaSecondary,
  );

  return (
    <SceneSection id="contact">
      <div className="flex h-full flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex max-w-[34rem] flex-1 flex-col justify-center gap-4">
          <SectionChip number={sceneNumber("contact")} label="Contact" />

          <BrushTitle first="Let's build something" second="worth shipping." />

          <p className="max-w-md text-sm leading-6 text-[var(--color-white)]/80">
            Have an idea, opportunity, or interesting problem? Send a
            transmission.
          </p>

          {channels.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-1">
              {channels.map((channel) => (
                <li key={channel.key}>
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    download={channel.download ? true : undefined}
                    aria-label={channel.label}
                    className="group block"
                  >
                    <HoloCard bodyClassName="flex h-16 w-16 flex-col items-center justify-center gap-1.5 p-1 transition-colors group-hover:bg-[var(--color-primary)]/15">
                      {channelIcon(channel.key, {
                        className: "h-5 w-5 text-[var(--color-white)]",
                      })}

                      <span className="micro text-[7px] text-[var(--color-muted)]">
                        {channel.label}
                      </span>
                    </HoloCard>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <HoloCard
          tone="primary"
          className="w-full md:w-[min(44%,30rem)]"
          bodyClassName="p-5"
        >
          <div className="flex items-center justify-between">
            <p className="micro text-[var(--color-primary)]">
              {"// Transmission terminal"}
            </p>

            <p className="micro flex items-center gap-2 text-[8px] text-[var(--color-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
              Online
            </p>
          </div>

          {channels.length === 0 ? (
            <p className="micro mt-6 text-[var(--color-dim)]">
              No channels on this resume
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {channels.map((channel) => (
                <li
                  key={channel.key}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-[var(--color-primary)]">
                    {channelIcon(channel.key, { className: "h-4 w-4" })}
                  </span>

                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="min-w-0 flex-1"
                  >
                    <span className="micro block text-[8px] text-[var(--color-muted)]">
                      {channel.label}
                    </span>

                    <span className="block truncate text-sm text-[var(--color-white)]">
                      {channel.value}
                    </span>
                  </a>

                  {channel.key === "email" && <CopyButton text={channel.value} />}

                  <span aria-hidden="true" className="text-[var(--color-accent)]">
                    {channel.external ? "↗" : "→"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </HoloCard>
      </div>
    </SceneSection>
  );
}
