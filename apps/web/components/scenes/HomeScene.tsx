import type { PortfolioData } from "@/content/schema/portfolio";
import SceneSection from "@/components/shell/SceneSection";
import BrushTitle from "@/components/ui/BrushTitle";
import type { PortfolioTheme } from "@/lib/theme";

interface HomeSceneProps {
  portfolio: PortfolioData;
  copy: PortfolioTheme["copy"];
  role: string;
  hasResume: boolean;
}

export default function HomeScene({
  portfolio,
  copy,
  role,
  hasResume,
}: HomeSceneProps) {
  const name = portfolio.metadata.name ?? "Your Name";

  const [first, ...rest] = name.trim().split(/\s+/);

  return (
    <SceneSection id="home">
      <div className="flex h-full max-w-[32rem] flex-col justify-center gap-5">
        <p className="micro rise-in text-[var(--color-muted)]">{copy.greeting}</p>

        <BrushTitle
          as="h1"
          size="lg"
          first={first}
          second={rest.join(" ") || undefined}
        />

        <div className="space-y-1">
          <p className="micro text-[var(--color-white)]">
            {copy.roles.join(" / ")}
          </p>

          {portfolio.metadata.course && (
            <p className="micro text-[8px] text-[var(--color-muted)]">
              {portfolio.metadata.course}
            </p>
          )}
        </div>

        <p className="max-w-md text-sm leading-6 text-[var(--color-white)]/80 [@media(max-height:700px)]:hidden">
          {copy.intro}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a href="#projects" className="cta">
            {copy.ctaPrimary}
            <span aria-hidden="true">→</span>
          </a>

          {hasResume && (
            <a href={`/resume/${role}`} className="cta-ghost" download>
              {copy.ctaSecondary}
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </div>
    </SceneSection>
  );
}
