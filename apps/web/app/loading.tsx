const STEPS = [
  "Initializing world",
  "Loading scenes",
  "Loading projects",
  "Connecting experience",
  "System ready",
];

/**
 * Shown while a route streams in. Pure CSS (no JS, no theme) so it
 * renders instantly with the global default colours.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-8 bg-[var(--color-void)] px-6"
    >
      <p className="micro text-center text-[var(--color-white)] [letter-spacing:0.4em]">
        System initialization
        <span className="mt-2 block text-[8px] text-[var(--color-muted)]">
          Loading my universe
        </span>
      </p>

      <ul className="micro space-y-2 text-[10px] text-[var(--color-white)]/80">
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="rise-in flex items-center gap-3"
            style={{ animationDelay: `${index * 0.18}s` }}
          >
            <span className="text-[var(--color-primary)]">{">"}</span>
            {step}
            {index < STEPS.length - 1 ? "..." : "."}
          </li>
        ))}
      </ul>

      <div className="h-1.5 w-[min(80vw,22rem)] overflow-hidden bg-white/10">
        <div className="h-full w-1/3 animate-[loadingProgress_1.6s_ease-in-out_infinite] bg-[var(--color-primary)]" />
      </div>

      <p className="note text-center">A more interesting tomorrow.</p>
    </div>
  );
}
