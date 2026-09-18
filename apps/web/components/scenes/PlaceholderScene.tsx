import SceneFrame from "@/components/layout/SceneFrame";

interface PlaceholderSceneProps {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
}

export default function PlaceholderScene({
  id,
  number,
  label,
  title,
  description,
}: PlaceholderSceneProps) {
  return (
    <SceneFrame id={id} number={number} label={label}>
      <div className="grid min-h-[420px] items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="portfolio-mono mb-5 text-[10px] text-[var(--color-red)]">
            SYSTEM / UNDER CONSTRUCTION
          </p>

          <h2 className="portfolio-display max-w-3xl text-5xl font-black leading-[0.9] tracking-tight md:text-8xl">
            {title}
          </h2>

          <p className="mt-8 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
            {description}
          </p>
        </div>

        <div className="portfolio-panel relative aspect-square overflow-hidden">
          <div className="absolute inset-6 border border-[var(--border-subtle)]" />

          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 border border-[var(--color-cyan)]/40">
            <div className="absolute inset-3 border border-[var(--color-red)]/40" />

            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-cyan)]" />
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between">
            <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
              LOADING SCENE
            </span>

            <span className="portfolio-mono text-[8px] text-[var(--color-cyan)]">
              00%
            </span>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
