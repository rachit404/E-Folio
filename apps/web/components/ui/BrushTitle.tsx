interface BrushTitleProps {
  /** First line, white. */
  first: string;
  /** Second line, accent colour. */
  second?: string;
  as?: "h1" | "h2";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "text-[clamp(1.6rem,min(3.3vw,6svh),3.2rem)]",
  md: "text-[clamp(2rem,min(4.6vw,7.2svh),4rem)]",
  lg: "text-[clamp(2.6rem,min(6vw,10svh),5.5rem)]",
};

/** Two-line brush headline: white first line, accent second line. */
export default function BrushTitle({
  first,
  second,
  as: Tag = "h2",
  size = "md",
  className = "",
}: BrushTitleProps) {
  return (
    <Tag
      className={`brush ${SIZES[size]} ${className}`}
    >
      <span className="block text-[var(--color-white)]">{first}</span>

      {second && (
        <span className="block text-[var(--color-accent)]">{second}</span>
      )}
    </Tag>
  );
}
