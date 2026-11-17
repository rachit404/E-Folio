import Crown from "./Crown";

interface WordmarkProps {
  name: string;
}

/** Stacked brush wordmark with a small crown, as in the comps. */
export default function Wordmark({ name }: WordmarkProps) {
  const [first, ...rest] = name.trim().split(/\s+/);

  return (
    <span className="relative inline-block pr-6" aria-label={name}>
      <span className="brush block text-[1.05rem] text-[var(--color-white)]">
        {first}
      </span>

      <span className="brush -mt-1 block pl-3 text-[1.05rem] text-[var(--color-accent)]">
        {rest.join(" ")}
      </span>

      <Crown className="absolute right-0 top-0 h-3.5 text-[var(--color-accent)]" />
    </span>
  );
}
