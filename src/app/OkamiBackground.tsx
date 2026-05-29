export function OkamiBackground() {
  return (
    <>
      {/* === 天照 (太陽) === */}
      <svg
        class="amaterasu"
        viewBox="0 0 480 480"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g>
          <circle cx="240" cy="240" r="180" class="sun-ring" />
          <circle cx="240" cy="240" r="160" class="sun-ring" opacity="0.35" />
          <g class="sun-rays">
            <line x1="240" y1="40" x2="240" y2="80" class="sun-ray" />
            <line x1="240" y1="400" x2="240" y2="440" class="sun-ray" />
            <line x1="40" y1="240" x2="80" y2="240" class="sun-ray" />
            <line x1="400" y1="240" x2="440" y2="240" class="sun-ray" />
            <line x1="100" y1="100" x2="128" y2="128" class="sun-ray" />
            <line x1="352" y1="352" x2="380" y2="380" class="sun-ray" />
            <line x1="380" y1="100" x2="352" y2="128" class="sun-ray" />
            <line x1="128" y1="352" x2="100" y2="380" class="sun-ray" />
          </g>
          <circle cx="240" cy="240" r="140" class="sun-core" opacity="0.92" />
          <circle
            cx="240"
            cy="240"
            r="138"
            fill="none"
            stroke="#9b1f15"
            stroke-width="2"
            opacity="0.5"
          />
          {/* 三つ巴 */}
          <g transform="translate(240, 240)" opacity="0.5">
            <path
              d="M0,-60 Q20,-40 30,-15 Q15,-25 0,-20 Q-10,-30 0,-60 Z"
              fill="#9b1f15"
            />
            <g transform="rotate(120)">
              <path
                d="M0,-60 Q20,-40 30,-15 Q15,-25 0,-20 Q-10,-30 0,-60 Z"
                fill="#9b1f15"
              />
            </g>
            <g transform="rotate(240)">
              <path
                d="M0,-60 Q20,-40 30,-15 Q15,-25 0,-20 Q-10,-30 0,-60 Z"
                fill="#9b1f15"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* === 山並み === */}
      <svg
        class="mountains"
        viewBox="0 0 1200 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3a5670" stop-opacity="0.0" />
            <stop offset="60%" stop-color="#3a5670" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#1a0f0a" stop-opacity="0.65" />
          </linearGradient>
          <linearGradient id="mtnFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1a0f0a" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#1a0f0a" stop-opacity="0.85" />
          </linearGradient>
        </defs>
        <path
          d="M0,180 L0,100 L120,60 L240,85 L380,40 L500,75 L640,50 L780,90 L920,55 L1080,80 L1200,65 L1200,180 Z"
          fill="url(#mtnGrad)"
        />
        <path
          d="M0,180 L0,140 L100,110 L220,135 L360,95 L500,125 L660,100 L820,130 L980,105 L1120,128 L1200,115 L1200,180 Z"
          fill="url(#mtnFrontGrad)"
        />
      </svg>

      {/* === 桜の花びら === */}
      <div class="sakura-field" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div class={`petal p${n}`} key={n}>
            <svg viewBox="0 0 24 24">
              <path
                d="M12,2 Q9,6 6,8 Q9,11 12,16 Q15,11 18,8 Q15,6 12,2 Z"
                fill={n % 2 === 0 ? '#f0a5a5' : '#e88a8a'}
                opacity={0.6 + (n % 3) * 0.1}
              />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
