import type { ElementType, ReactNode } from "react";

interface ComicPanelProps {
  /** Small caption box pinned to the panel's top edge (e.g. dates). */
  caption?: string;

  /** Panel spans both columns. */
  wide?: boolean;

  className?: string;

  children: ReactNode;
}

/**
 * A single comic panel. Rendered inside <ComicPage>, which animates
 * it (and any <ComicBeat> inside it) as the page scrolls.
 */
export function ComicPanel({
  caption,
  wide = false,
  className = "",
  children,
}: ComicPanelProps) {
  return (
    <article
      data-comic-panel
      className={`comic-panel p-6 md:p-8 ${wide ? "md:col-span-2" : ""} ${className}`}
    >
      {caption && (
        <span
          data-comic-beat
          className="comic-caption absolute -top-3 right-4 z-10"
        >
          {caption}
        </span>
      )}

      <div className="relative z-10">{children}</div>
    </article>
  );
}

interface ComicBeatProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * A sub-element of a panel that plays in after the panel itself,
 * one beat at a time (a narration line, a bullet, a label).
 */
export function ComicBeat({
  as = "div",
  className = "",
  children,
}: ComicBeatProps) {
  const Tag = as as ElementType<{
    className?: string;
    children?: ReactNode;
    "data-comic-beat"?: boolean;
  }>;

  return (
    <Tag data-comic-beat className={className}>
      {children}
    </Tag>
  );
}
