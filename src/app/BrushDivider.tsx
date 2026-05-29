export function BrushDivider() {
  return (
    <svg
      class="brush-divider"
      viewBox="0 0 260 22"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brushGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1a0f0a" stop-opacity="0" />
          <stop offset="15%" stop-color="#1a0f0a" stop-opacity="0.55" />
          <stop offset="50%" stop-color="#1a0f0a" stop-opacity="0.95" />
          <stop offset="85%" stop-color="#1a0f0a" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#1a0f0a" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M5,11 Q40,5 130,11 T256,12"
        stroke="url(#brushGradMain)"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
      />
      <path
        d="M30,14 Q60,16 90,13"
        stroke="url(#brushGradMain)"
        stroke-width="1.2"
        fill="none"
        stroke-linecap="round"
        opacity="0.5"
      />
      <circle cx="130" cy="11" r="3" fill="#d23a2c" opacity="0.8" />
      <circle cx="200" cy="13" r="1.4" fill="#1a0f0a" opacity="0.5" />
    </svg>
  );
}
