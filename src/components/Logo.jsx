export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Glow layer */}
      <path
        d="M20 3 L35 9.5 L35 22.5 C35 31.5 28.5 37.5 20 40 C11.5 37.5 5 31.5 5 22.5 L5 9.5 Z"
        fill="url(#glowGrad)"
      />
      {/* Shield body */}
      <path
        d="M20 3 L35 9.5 L35 22.5 C35 31.5 28.5 37.5 20 40 C11.5 37.5 5 31.5 5 22.5 L5 9.5 Z"
        fill="url(#shieldGrad)"
        opacity="0.9"
      />
      {/* Inner highlight */}
      <path
        d="M20 7 L32 12.5 L32 22.5 C32 29.5 27 34.5 20 36.5 C13 34.5 8 29.5 8 22.5 L8 12.5 Z"
        fill="white"
        opacity="0.08"
      />
      {/* Checkmark */}
      <path
        d="M13.5 21 L18.5 26 L27 16"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
