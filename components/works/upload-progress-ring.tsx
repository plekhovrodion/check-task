interface UploadProgressRingProps {
  value: number;
  total: number;
}

export function UploadProgressRing({ value, total }: UploadProgressRingProps) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? value / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="shrink-0"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="#e4e6f7"
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="#503ae0"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
