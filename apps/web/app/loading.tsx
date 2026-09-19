export default function Loading() {
  return (
    <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-void)] text-[var(--color-white)]">
      {/* Technical background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute inset-0
            opacity-30
            [background-image:linear-gradient(rgba(0,229,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.08)_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />

        <div className="absolute left-1/2 top-1/2 h-[45vw] w-[45vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.08),transparent_65%)]" />

        <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--color-cyan)]/10" />

        <div className="absolute inset-y-0 left-1/2 w-px bg-[var(--color-red)]/10" />

        <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[var(--color-cyan)]/40 to-transparent" />

        <div className="absolute bottom-0 right-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[var(--color-red)]/40 to-transparent" />
      </div>

      {/* Corner markers */}
      <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-[var(--color-cyan)]/40 md:left-10 md:top-10" />

      <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-[var(--color-cyan)]/40 md:right-10 md:top-10" />

      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-[var(--color-red)]/40 md:bottom-10 md:left-10" />

      <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-[var(--color-red)]/40 md:bottom-10 md:right-10" />

      {/* Main boot interface */}
      <div className="relative z-10 w-[min(90vw,520px)]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <span className="portfolio-mono text-[9px] tracking-[0.2em] text-[var(--color-cyan)]">
            E-FOLIO // SYSTEM
          </span>

          <span className="portfolio-mono text-[8px] text-[var(--color-dim)]">
            BOOT_SEQUENCE
          </span>
        </div>

        {/* Core */}
        <div className="relative mx-auto flex aspect-square w-44 items-center justify-center md:w-52">
          {/* Outer ring */}
          <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-[var(--color-cyan)]/20 border-t-[var(--color-cyan)]/70" />

          {/* Second ring */}
          <div className="absolute inset-5 animate-[spin_8s_linear_infinite_reverse] rounded-full border border-[var(--color-red)]/20 border-r-[var(--color-red)]/70" />

          {/* Technical square */}
          <div className="absolute inset-12 rotate-45 border border-[var(--color-cyan)]/40" />

          {/* Inner square */}
          <div className="absolute inset-[4.5rem] border border-[var(--color-red)]/40" />

          {/* Core */}
          <div className="relative h-5 w-5 bg-[var(--color-cyan)] shadow-[0_0_30px_var(--color-cyan)]">
            <div className="absolute inset-1 bg-[var(--color-void)]" />
          </div>

          {/* Orbit dots */}
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 bg-[var(--color-red)]" />

          <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-[var(--color-cyan)]" />

          <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-[var(--color-cyan)]" />

          <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 bg-[var(--color-red)]" />
        </div>

        {/* Boot text */}
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="portfolio-display text-3xl font-black tracking-[-0.04em] md:text-4xl">
                INITIALIZING
              </p>

              <p className="portfolio-mono mt-2 text-[8px] tracking-[0.2em] text-[var(--color-muted)]">
                ENGINEERING PORTFOLIO SYSTEM
              </p>
            </div>

            <span className="portfolio-mono text-[10px] text-[var(--color-cyan)]">
              01
            </span>
          </div>

          {/* Progress */}
          <div className="mt-7 h-px w-full overflow-hidden bg-[var(--color-white)]/10">
            <div className="h-full w-[35%] animate-[loadingProgress_1.8s_ease-in-out_infinite] bg-[var(--color-cyan)] shadow-[0_0_12px_var(--color-cyan)]" />
          </div>

          <div className="mt-3 flex justify-between">
            <span className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
              LOADING SYSTEMS
            </span>

            <span className="portfolio-mono text-[7px] tracking-[0.15em] text-[var(--color-dim)]">
              PLEASE WAIT
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-10 grid grid-cols-3 border border-[var(--color-white)]/10">
          <div className="border-r border-[var(--color-white)]/10 px-4 py-3">
            <p className="portfolio-mono text-[7px] text-[var(--color-dim)]">
              CORE
            </p>

            <p className="portfolio-mono mt-1 text-[8px] text-[var(--color-cyan)]">
              ONLINE
            </p>
          </div>

          <div className="border-r border-[var(--color-white)]/10 px-4 py-3">
            <p className="portfolio-mono text-[7px] text-[var(--color-dim)]">
              DATA
            </p>

            <p className="portfolio-mono mt-1 text-[8px] text-[var(--color-cyan)]">
              SYNC
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="portfolio-mono text-[7px] text-[var(--color-dim)]">
              WEBGL
            </p>

            <p className="portfolio-mono mt-1 text-[8px] text-[var(--color-red)]">
              INIT
            </p>
          </div>
        </div>
      </div>

      {/* Footer diagnostics */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between md:bottom-10 md:left-10 md:right-10">
        <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
          E-FOLIO / 00
        </span>

        <span className="portfolio-mono text-[7px] tracking-[0.16em] text-[var(--color-dim)]">
          SYSTEM BOOT
        </span>
      </div>
    </main>
  );
}
