interface UpIcoPr {
  size?: string;
}

export function UpIco({ size }: UpIcoPr) {
  return (
    <svg
      viewBox="0 0 24 24"
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 15V7" />
      <path d="M9 10l3-3 3 3" />
      <path d="M5 19h14" />
    </svg>
  );
}
