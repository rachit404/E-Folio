interface CrownProps {
  className?: string;
}

export default function Crown({ className = "" }: CrownProps) {
  return (
    <svg
      viewBox="0 0 28 18"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M2 16 1 4l7 5 6-8 6 8 7-5-1 12Z" />
      <path d="M2 16h24" />
    </svg>
  );
}
