import type { PortfolioTheme } from "@/lib/theme";

export type RevealStyle = PortfolioTheme["comic"]["reveal"]["style"];

export interface RevealVars {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

/**
 * Start/end tween values for one panel.
 *
 * `index` alternates direction and tilt so neighbouring panels
 * don't all move the same way.
 *
 * clip-path is only used by "wipe": it would otherwise clip the
 * panel's hard offset shadow.
 */
export function revealVars(style: RevealStyle, index: number): RevealVars {
  const direction = index % 2 === 0 ? -1 : 1;

  switch (style) {
    case "wipe":
      return {
        from: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" },
        to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" },
      };

    case "slide":
      return {
        from: { opacity: 0, x: direction * 90 },
        to: { opacity: 1, x: 0 },
      };

    case "pop":
    default:
      return {
        from: {
          opacity: 0,
          y: 46,
          scale: 0.94,
          rotate: direction * 1.4,
        },
        to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
      };
  }
}

/** "FRAME 03/08" */
export function frameLabel(current: number, total: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `FRAME ${pad(current)}/${pad(total)}`;
}
