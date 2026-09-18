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
  return (
    <section
      id={id}
      className={`relative flex min-h-screen w-full items-center overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-6 top-24 h-px w-24 bg-[var(--border-subtle)] md:left-10" />

        <div className="absolute bottom-8 left-6 right-6 h-px bg-white/5 md:left-10 md:right-10" />

        <div className="absolute right-6 top-24 md:right-10">
          <span className="portfolio-mono text-[9px] text-[var(--color-dim)]">
            SCENE {number}
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-32 md:px-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="portfolio-mono text-[10px] text-[var(--color-cyan)]">
            {number}
          </span>

          <span className="h-px w-8 bg-[var(--color-red)]" />

          <span className="portfolio-mono text-[10px] tracking-[0.25em] text-[var(--color-muted)]">
            {label}
          </span>
        </div>

        {children}
      </div>
    </section>
  );
}
