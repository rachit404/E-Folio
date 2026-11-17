import type { PortfolioTheme } from "@/lib/theme";

interface ChromeProps {
  copy: PortfolioTheme["copy"];
}

/** Fixed decoration shared by every scene: taglines and the scroll cue. */
export default function Chrome({ copy }: ChromeProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <p className="note absolute right-8 top-20 hidden max-w-[14rem] text-right md:block">
        {copy.taglineTop}
      </p>

      <p className="micro absolute bottom-4 right-6 hidden max-w-[16rem] text-right text-[8px] leading-4 text-[var(--color-dim)] md:block md:right-12">
        {copy.taglineFooter}
      </p>

      <div className="absolute bottom-6 left-6 hidden items-center gap-3 [@media(min-height:680px)]:flex md:left-12">
        <span className="micro [writing-mode:vertical-rl] rotate-180 text-[8px] text-[var(--color-muted)]">
          Scroll
        </span>

        <span className="h-10 w-px bg-[var(--color-muted)]/50" />
      </div>
    </div>
  );
}
