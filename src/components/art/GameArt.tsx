// Original, procedurally generated key art for games and services.
// Used as a backdrop behind uploaded images and as the fallback when an
// upload is missing, so every card always has artwork.

type Palette = { sky: [string, string]; glow: string; land: [string, string]; rim: string };

const PALETTES: Palette[] = [
  { sky: ["#1b0f3d", "#5a2bd6"], glow: "#b39cff", land: ["#0d0820", "#241457"], rim: "#e3d9ff" },
  { sky: ["#2a0b2e", "#b8298f"], glow: "#ff8ad8", land: ["#12051a", "#4a0f40"], rim: "#ffd1f1" },
  { sky: ["#07213a", "#1f6fb8"], glow: "#8fd3ff", land: ["#041222", "#0f3456"], rim: "#d7f0ff" },
  { sky: ["#2d0c0c", "#c2410c"], glow: "#ffb070", land: ["#140606", "#4a150b"], rim: "#ffe0c2" },
  { sky: ["#0b2a1e", "#15a36b"], glow: "#8cf5c4", land: ["#04140d", "#0c3b28"], rim: "#d4ffe9" },
  { sky: ["#221a05", "#b8860b"], glow: "#ffe08a", land: ["#110c02", "#3d2d08"], rim: "#fff2c7" },
];

type Motif = "crystal" | "blade" | "orb" | "rune" | "shield" | "tower";
const MOTIFS: Motif[] = ["crystal", "blade", "orb", "rune", "shield", "tower"];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function ridge(rand: () => number, base: number, amp: number, steps: number): string {
  const pts: string[] = [`M0 ${base}`];
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * 400;
    const y = base - rand() * amp;
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push("L400 300 L0 300 Z");
  return pts.join(" ");
}

function MotifShape({ motif, p, id }: { motif: Motif; p: Palette; id: string }) {
  const stroke = { stroke: p.rim, strokeOpacity: 0.55, strokeWidth: 1.2 };
  switch (motif) {
    case "crystal":
      return (
        <g transform="translate(290 70)">
          <polygon points="0,-58 26,-8 12,70 -12,70 -26,-8" fill={`url(#${id}-m)`} {...stroke} />
          <polygon points="0,-58 12,70 -12,70" fill="#fff" opacity="0.12" />
          <polygon points="-44,20 -30,-6 -20,28 -30,54" fill={`url(#${id}-m)`} opacity="0.8" {...stroke} />
          <polygon points="42,24 54,4 60,40 48,58" fill={`url(#${id}-m)`} opacity="0.7" {...stroke} />
        </g>
      );
    case "blade":
      return (
        <g transform="translate(300 128) rotate(-28)">
          <polygon points="0,-120 9,-100 7,40 -7,40 -9,-100" fill={`url(#${id}-m)`} {...stroke} />
          <line x1="0" y1="-112" x2="0" y2="36" stroke="#fff" strokeOpacity="0.35" />
          <rect x="-30" y="40" width="60" height="8" rx="4" fill={p.rim} opacity="0.8" />
          <rect x="-4" y="48" width="8" height="34" rx="3" fill={p.land[1]} {...stroke} />
          <circle cx="0" cy="88" r="7" fill={p.glow} />
        </g>
      );
    case "orb":
      return (
        <g transform="translate(300 96)">
          <circle r="64" fill={p.glow} opacity="0.12" />
          <circle r="44" fill={`url(#${id}-m)`} {...stroke} />
          <ellipse rx="70" ry="16" fill="none" stroke={p.rim} strokeOpacity="0.45" transform="rotate(-18)" />
          <circle cx="-14" cy="-16" r="12" fill="#fff" opacity="0.25" />
        </g>
      );
    case "rune":
      return (
        <g transform="translate(296 100)" fill="none" stroke={p.rim}>
          <circle r="62" strokeOpacity="0.35" strokeDasharray="3 7" />
          <circle r="48" strokeOpacity="0.6" strokeWidth="1.5" />
          <polygon points="0,-40 35,20 -35,20" strokeOpacity="0.8" strokeWidth="1.5" />
          <polygon points="0,40 35,-20 -35,-20" strokeOpacity="0.5" />
          <circle r="8" fill={p.glow} stroke="none" />
        </g>
      );
    case "shield":
      return (
        <g transform="translate(300 96)">
          <path d="M0 -62 L52 -44 L46 18 Q30 56 0 72 Q-30 56 -46 18 L-52 -44 Z" fill={`url(#${id}-m)`} {...stroke} />
          <path d="M0 -44 L0 56" stroke={p.rim} strokeOpacity="0.5" />
          <path d="M-34 -20 L34 -20" stroke={p.rim} strokeOpacity="0.5" />
          <circle cy="-20" r="10" fill={p.glow} opacity="0.9" />
        </g>
      );
    case "tower":
    default:
      return (
        <g transform="translate(300 60)">
          <polygon points="-22,120 -16,0 0,-34 16,0 22,120" fill={p.land[1]} {...stroke} />
          <polygon points="-40,120 -34,40 -24,26 -14,40 -8,120" fill={p.land[0]} {...stroke} />
          <rect x="-4" y="20" width="8" height="14" rx="2" fill={p.glow} />
          <rect x="-4" y="54" width="8" height="12" rx="2" fill={p.glow} opacity="0.7" />
          <circle cy="-40" r="5" fill={p.glow} />
        </g>
      );
  }
}

export function GameArt({
  seed,
  className = "",
  title,
}: {
  seed: string;
  className?: string;
  title?: string;
}) {
  const h = hash(seed || "game");
  const p = PALETTES[h % PALETTES.length];
  const motif = MOTIFS[(h >>> 4) % MOTIFS.length];
  const rand = rng(h);
  const id = `ga${h.toString(36)}`;
  const stars = Array.from({ length: 22 }, () => ({
    x: rand() * 400,
    y: rand() * 150,
    r: rand() * 1.3 + 0.3,
    o: rand() * 0.6 + 0.2,
  }));
  const far = ridge(rand, 190, 60, 9);
  const near = ridge(rand, 240, 45, 7);

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <radialGradient id={`${id}-g`} cx="0.74" cy="0.32" r="0.55">
          <stop offset="0" stopColor={p.glow} stopOpacity="0.85" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.rim} />
          <stop offset="0.5" stopColor={p.glow} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.land[1]} />
          <stop offset="1" stopColor={p.land[0]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-s)`} />
      <rect width="400" height="300" fill={`url(#${id}-g)`} />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
      ))}
      <path d={far} fill={p.land[1]} opacity="0.75" />
      <MotifShape motif={motif} p={p} id={id} />
      <path d={near} fill={`url(#${id}-l)`} />
    </svg>
  );
}
