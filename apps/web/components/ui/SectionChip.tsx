interface SectionChipProps {
  number: string;
  label: string;
}

/** "01 / ABOUT" marker above each headline. */
export default function SectionChip({ number, label }: SectionChipProps) {
  return (
    <p className="micro flex items-center gap-3">
      <span className="border border-[var(--color-accent)] px-2 py-1 text-[var(--color-accent)]">
        {number}
      </span>

      <span className="text-[var(--color-muted)]">/ {label}</span>
    </p>
  );
}
