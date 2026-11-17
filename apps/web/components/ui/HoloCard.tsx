import type { ReactNode } from "react";

interface HoloCardProps {
  tone?: "primary" | "accent";
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** Cyan (or red) holographic glass card with chamfered corners. */
export default function HoloCard({
  tone = "primary",
  className = "",
  bodyClassName = "p-4",
  children,
}: HoloCardProps) {
  return (
    <div className={`holo-glow ${className}`}>
      <div className={`holo h-full ${tone === "accent" ? "holo--accent" : ""}`}>
        <div className={`holo-body ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  );
}
