// Original glossy illustrations for the homepage category tiles.

export type CategoryKind = "boosting" | "currency" | "accounts" | "items" | "coaching";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-v`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d9ceff" />
        <stop offset="0.45" stopColor="#8f6bff" />
        <stop offset="1" stopColor="#3b1fa3" />
      </linearGradient>
      <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffd3f3" />
        <stop offset="0.5" stopColor="#e03bbe" />
        <stop offset="1" stopColor="#6a1757" />
      </linearGradient>
      <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f2ffd6" />
        <stop offset="0.5" stopColor="#b6f24a" />
        <stop offset="1" stopColor="#4b7a0e" />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.55" r="0.5">
        <stop offset="0" stopColor="#7c5cff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function CategoryArt({ kind, className = "" }: { kind: CategoryKind; className?: string }) {
  const id = `cat-${kind}`;
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <Defs id={id} />
      <circle cx="48" cy="52" r="42" fill={`url(#${id}-glow)`} />
      {kind === "boosting" && (
        <g>
          <path d="M22 70 L44 48 L54 58 L74 30" fill="none" stroke={`url(#${id}-m)`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M60 24 L80 22 L78 42 Z" fill={`url(#${id}-v)`} />
          <path d="M22 70 L44 48 L54 58 L74 30" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="70" r="5" fill="#fff" />
        </g>
      )}
      {kind === "currency" && (
        <g>
          {[66, 58, 50].map((y, i) => (
            <g key={y}>
              <ellipse cx="42" cy={y + 6} rx="22" ry="7" fill="#4b7a0e" />
              <rect x="20" y={y} width="44" height="6" fill={`url(#${id}-l)`} />
              <ellipse cx="42" cy={y} rx="22" ry="7" fill={i === 2 ? `url(#${id}-l)` : "#9ed83a"} />
            </g>
          ))}
          <circle cx="64" cy="36" r="17" fill={`url(#${id}-v)`} />
          <circle cx="64" cy="36" r="12" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
          <path d="M64 28 V44 M59 32 H67 Q70 32 70 35 Q70 38 64 38 Q58 38 58 41 Q58 44 61 44 H69" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {kind === "accounts" && (
        <g>
          <path d="M48 16 L74 26 L71 54 Q64 72 48 80 Q32 72 25 54 L22 26 Z" fill={`url(#${id}-v)`} />
          <path d="M48 16 L74 26 L71 54 Q64 72 48 80 Z" fill="#fff" opacity="0.1" />
          <circle cx="48" cy="40" r="8" fill="#fff" />
          <path d="M34 62 Q36 50 48 50 Q60 50 62 62" fill="#fff" />
          <circle cx="70" cy="68" r="10" fill={`url(#${id}-l)`} />
          <path d="M65 68 L69 72 L75 64" fill="none" stroke="#0b0a13" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "items" && (
        <g>
          <path d="M18 44 Q18 26 48 26 Q78 26 78 44 Z" fill={`url(#${id}-m)`} />
          <rect x="18" y="44" width="60" height="32" rx="4" fill={`url(#${id}-v)`} />
          <rect x="18" y="44" width="60" height="6" fill="#fff" opacity="0.15" />
          <rect x="42" y="40" width="12" height="16" rx="3" fill="#ffe08a" />
          <circle cx="48" cy="48" r="2.5" fill="#6b4a00" />
          <path d="M30 22 L33 14 L36 22 L44 25 L36 28 L33 36 L30 28 L22 25 Z" fill="#fff" opacity="0.9" />
        </g>
      )}
      {kind === "coaching" && (
        <g>
          <path d="M22 54 Q22 22 48 22 Q74 22 74 54" fill="none" stroke={`url(#${id}-v)`} strokeWidth="7" strokeLinecap="round" />
          <rect x="16" y="50" width="16" height="24" rx="7" fill={`url(#${id}-m)`} />
          <rect x="64" y="50" width="16" height="24" rx="7" fill={`url(#${id}-m)`} />
          <path d="M72 74 Q72 84 56 84 H50" fill="none" stroke="#b3a1ff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="84" r="4" fill="#fff" />
        </g>
      )}
    </svg>
  );
}

// Controller + headset composition for the "become a booster" call to action.
export function BoosterArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ba-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7c5cff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ba-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3556" />
          <stop offset="1" stopColor="#14121f" />
        </linearGradient>
        <linearGradient id="ba-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#e03bbe" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="120" r="118" fill="url(#ba-glow)" />
      <g fill="none" stroke="#fff" strokeOpacity="0.08">
        <circle cx="160" cy="120" r="96" />
        <circle cx="160" cy="120" r="74" />
      </g>
      {/* headset */}
      <path d="M100 118 Q100 52 160 52 Q220 52 220 118" fill="none" stroke="url(#ba-edge)" strokeWidth="10" strokeLinecap="round" />
      <rect x="86" y="108" width="30" height="46" rx="13" fill="url(#ba-body)" stroke="url(#ba-edge)" strokeWidth="2" />
      <rect x="204" y="108" width="30" height="46" rx="13" fill="url(#ba-body)" stroke="url(#ba-edge)" strokeWidth="2" />
      {/* controller */}
      <path
        d="M112 150 Q120 132 144 134 H176 Q200 132 208 150 L220 190 Q224 206 210 208 Q200 209 192 196 L184 184 H136 L128 196 Q120 209 110 208 Q96 206 100 190 Z"
        fill="url(#ba-body)"
        stroke="url(#ba-edge)"
        strokeWidth="2.5"
      />
      <path d="M130 158 V174 M122 166 H138" stroke="#b3a1ff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="186" cy="160" r="4.5" fill="#b6f24a" />
      <circle cx="196" cy="170" r="4.5" fill="#e03bbe" />
      <circle cx="176" cy="170" r="4.5" fill="#7c5cff" />
      <circle cx="186" cy="180" r="4.5" fill="#f3f0ff" />
      <rect x="150" y="146" width="20" height="5" rx="2.5" fill="#fff" opacity="0.25" />
      {/* sparkles */}
      <path d="M252 62 L256 50 L260 62 L272 66 L260 70 L256 82 L252 70 L240 66 Z" fill="#b6f24a" />
      <path d="M62 78 L65 70 L68 78 L76 81 L68 84 L65 92 L62 84 L54 81 Z" fill="#e03bbe" />
    </svg>
  );
}
