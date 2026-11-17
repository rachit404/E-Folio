import type { ReactNode } from "react";

interface SceneSectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/**
 * One full-viewport scene. Everything inside must fit on a single
 * screen, so content is sized with viewport units, never scrolls, and
 * leaves room for the fixed nav above and the footer line below.
 */
export default function SceneSection({
  id,
  className = "",
  children,
}: SceneSectionProps) {
  return (
    <section
      id={id}
      className={`relative z-10 flex h-svh min-h-[580px] items-center overflow-hidden ${className}`}
    >
      <div className="mx-auto h-full w-full max-w-[1500px] px-6 pb-14 pt-[88px] md:px-12">
        {children}
      </div>
    </section>
  );
}
