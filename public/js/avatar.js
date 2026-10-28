// Outlined geometric audience member. Expression changes per reaction; no animation.
const INK = '#252b3a';
const FILLS = ['#6434df', '#ff78c5', '#ffd05b', '#9bf1cd', '#ffffff', '#f1ebff'];

const dot = (x, y, r = 2.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" />`;
const line = (d, w = 2.6) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" />`;

const faces = {
  neutral: () => dot(34, 33) + dot(46, 33) + line('M35 42 H45'),
  nodding: () => dot(34, 34) + dot(46, 34) + line('M34 41 Q40 46 46 41'),
  smiling: () => line('M30 33 Q34 29 38 33') + line('M42 33 Q46 29 50 33') + line('M32 40 Q40 49 48 40'),
  confused: () => dot(34, 34) + dot(46, 34) + line('M30 27 L37 29') + line('M50 26 L43 29') + line('M33 43 Q36.5 40 40 43 T47 43'),
  checking_phone: () => dot(34, 37) + dot(46, 37) + line('M36 44 H44') + `<rect x="51" y="50" width="13" height="20" rx="3" fill="${INK}" /><rect x="53.5" y="53" width="8" height="12" rx="1.5" fill="#9bf1cd" />`,
  taking_notes: () => dot(34, 37) + dot(46, 37) + line('M35 43 Q40 46 45 43') + `<rect x="49" y="50" width="16" height="19" rx="3" fill="#ffd05b" stroke="${INK}" stroke-width="2.4" />` + line('M53 56 H61', 2) + line('M53 61 H61', 2),
  looking_away: () => dot(40, 32) + dot(50, 32) + line('M38 42 H46'),
  raising_hand: () => dot(34, 33) + dot(46, 33) + `<circle cx="40" cy="42" r="3.2" fill="${INK}" />` + line('M62 74 L66 24', 3) + `<circle cx="66" cy="19" r="6.5" fill="#ffffff" stroke="${INK}" stroke-width="3" />`,
  distracted: () => line('M31 34 H37') + line('M43 34 H49') + `<circle cx="40" cy="43" r="2.4" fill="none" stroke="${INK}" stroke-width="2.4" />` + `<text x="56" y="20" font-family="sans-serif" font-weight="800" font-size="11" fill="${INK}">z</text><text x="63" y="12" font-family="sans-serif" font-weight="800" font-size="9" fill="${INK}">z</text>`,
  interested: () => `<circle cx="34" cy="33" r="3.4" fill="${INK}" /><circle cx="46" cy="33" r="3.4" fill="${INK}" /><circle cx="35" cy="32" r="1" fill="#fff" /><circle cx="47" cy="32" r="1" fill="#fff" />` + `<path d="M33 40 H47 Q46 48 40 48 Q34 48 33 40 Z" fill="${INK}" />`,
};

export function avatarSVG(index, reaction) {
  const fill = FILLS[index % FILLS.length];
  const face = (faces[reaction] || faces.neutral)();
  return `
    <svg viewBox="0 0 80 80" class="block h-full w-full" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="80" height="80" fill="${fill}" />
      <path d="M16 82 V70 a24 24 0 0 1 48 0 V82 Z" fill="#ffffff" stroke="${INK}" stroke-width="3" />
      <circle cx="40" cy="36" r="17" fill="#ffffff" stroke="${INK}" stroke-width="3" />
      ${face}
    </svg>`;
}
