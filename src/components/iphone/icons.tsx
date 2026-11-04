// iOS-style app icons drawn as SVG (no emojis)
import type { ReactNode } from "react";

const S = ({ children, bg }: { children: ReactNode; bg: string }) => (
  <svg viewBox="0 0 60 60" className="ic-svg">
    <defs>
      <linearGradient id={`g-${bg}`} x1="0" y1="0" x2="0" y2="1">
        {GR[bg].map((c, i) => (
          <stop key={i} offset={i / (GR[bg].length - 1)} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <rect width="60" height="60" fill={`url(#g-${bg})`} />
    {children}
  </svg>
);

const GR: Record<string, string[]> = {
  green: ["#5df777", "#0bc940"],
  blue: ["#3fc8ff", "#1270f3"],
  gray: ["#e2e2e7", "#8e8e93"],
  dgray: ["#5b5b60", "#1c1c1e"],
  white: ["#ffffff", "#f1f1f4"],
  black: ["#2c2c2e", "#000000"],
  yellow: ["#fff27a", "#ffcc00"],
  red: ["#ff6a74", "#fa233b"],
  sky: ["#4ab2ff", "#1a5fd6"],
  orange: ["#ffb340", "#ff7a00"],
  pink: ["#ff6ba1", "#ff2d55"],
  teal: ["#7de6ff", "#2a8cf0"],
  purple: ["#d88bff", "#8b3dff"],
  appstore: ["#18bfff", "#1c64f2"],
};

export const icons: Record<string, ReactNode> = {
  phone: (
    <S bg="green">
      <path d="M22.5 15c1-.3 2 .2 2.5 1.1l2.6 5.2c.4.9.2 1.9-.5 2.5l-2.4 2c1.6 3.6 4.3 6.4 7.9 8l2-2.4c.7-.7 1.7-.9 2.5-.5l5.2 2.6c.9.5 1.4 1.5 1.1 2.5l-1 3.7c-.3 1-1.2 1.7-2.3 1.7C27.7 41.4 18.6 32.3 18.6 20.3c0-1.1.7-2 1.7-2.3z" fill="#fff" />
    </S>
  ),
  messages: (
    <S bg="green">
      <ellipse cx="30" cy="28" rx="17" ry="14" fill="#fff" />
      <path d="M17 38c-1 3-3 5-5 6 4 0 7-1 10-3z" fill="#fff" />
    </S>
  ),
  safari: (
    <S bg="white">
      <circle cx="30" cy="30" r="21" fill="url(#saf)" />
      <defs>
        <linearGradient id="saf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1ad4ff" />
          <stop offset="1" stopColor="#1b6cf3" />
        </linearGradient>
      </defs>
      {Array.from({ length: 36 }).map((_, i) => (
        <line key={i} x1="30" y1="10.5" x2="30" y2={i % 3 ? 12 : 13.5} stroke="#fff" strokeWidth=".6" transform={`rotate(${i * 10} 30 30)`} />
      ))}
      <g transform="rotate(45 30 30)">
        <path d="M30 14l3 16h-6z" fill="#ff3b30" />
        <path d="M30 46l3-16h-6z" fill="#fff" />
      </g>
    </S>
  ),
  music: (
    <S bg="red">
      <path d="M38 14v20.5a5 5 0 1 1-3-4.6V21l-12 2.6v14a5 5 0 1 1-3-4.6V18.5z" fill="#fff" />
    </S>
  ),
  mail: (
    <S bg="sky">
      <rect x="12" y="18" width="36" height="25" rx="3" fill="#fff" />
      <path d="M12.5 19.5L30 33l17.5-13.5" stroke="#2a78e6" strokeWidth="1.6" fill="none" />
    </S>
  ),
  calendar: null, // dynamic
  photos: (
    <S bg="white">
      {["#ffcc00", "#ff9500", "#ff3b30", "#d43d9b", "#8e44ad", "#2f80ed", "#34c759", "#a3d900"].map((c, i) => (
        <ellipse key={i} cx="30" cy="19" rx="5.6" ry="10" fill={c} opacity=".85" transform={`rotate(${i * 45} 30 30)`} style={{ mixBlendMode: "multiply" }} />
      ))}
    </S>
  ),
  camera: (
    <S bg="gray">
      <rect x="11" y="20" width="38" height="25" rx="5" fill="#2c2c2e" />
      <rect x="22" y="16" width="12" height="6" rx="2" fill="#2c2c2e" />
      <circle cx="30" cy="32.5" r="9" fill="#e5e5ea" />
      <circle cx="30" cy="32.5" r="6.5" fill="#1c1c1e" />
      <circle cx="28" cy="30.5" r="1.6" fill="#5a6aa0" />
      <circle cx="43" cy="25" r="1.4" fill="#ffcc00" />
    </S>
  ),
  clock: (
    <S bg="black">
      <circle cx="30" cy="30" r="21" fill="#fff" />
      {Array.from({ length: 12 }).map((_, i) => (
        <text key={i} x="30" y="14.2" fontSize="5" textAnchor="middle" fontWeight="600" fill="#000" transform={`rotate(${(i + 1) * 30} 30 30) translate(0 0)`}>
          {""}
        </text>
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="30" y1="10.5" x2="30" y2="13" stroke="#000" strokeWidth="1.2" transform={`rotate(${i * 30} 30 30)`} />
      ))}
      <line x1="30" y1="30" x2="30" y2="18" stroke="#000" strokeWidth="2.2" strokeLinecap="round" transform="rotate(300 30 30)" />
      <line x1="30" y1="30" x2="30" y2="14" stroke="#000" strokeWidth="1.6" strokeLinecap="round" transform="rotate(60 30 30)" />
      <line x1="30" y1="34" x2="30" y2="13" stroke="#ff9500" strokeWidth=".8" transform="rotate(200 30 30)" />
      <circle cx="30" cy="30" r="1.6" fill="#ff9500" />
    </S>
  ),
  weather: (
    <S bg="teal">
      <circle cx="24" cy="24" r="8" fill="#ffd60a" />
      <path d="M22 44a7 7 0 0 1 .8-14 9.5 9.5 0 0 1 18 2.4A5.8 5.8 0 0 1 41 44z" fill="#fff" />
    </S>
  ),
  notes: (
    <S bg="white">
      <rect width="60" height="15" fill="#ffd60a" />
      <rect y="15" width="60" height="1" fill="#e2c255" />
      {[24, 32, 40, 48].map((y) => (
        <line key={y} x1="0" x2="60" y1={y} y2={y} stroke="#d9d9dc" strokeWidth=".8" />
      ))}
    </S>
  ),
  calculator: (
    <S bg="black">
      <rect x="12" y="12" width="16" height="16" rx="8" fill="#5c5c5e" />
      <rect x="32" y="12" width="16" height="16" rx="8" fill="#5c5c5e" />
      <rect x="12" y="32" width="16" height="16" rx="8" fill="#5c5c5e" />
      <rect x="32" y="32" width="16" height="16" rx="8" fill="#ff9f0a" />
      <path d="M16 20h8M20 16v8M36 20h8M16 38l8 4M24 38l-8 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M36 38.5h8M36 41.5h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </S>
  ),
  settings: (
    <S bg="gray">
      <g transform="translate(30 30)">
        {Array.from({ length: 24 }).map((_, i) => (
          <rect key={i} x="-2" y="-20" width="4" height="6" rx="1" fill="#3a3a3c" transform={`rotate(${i * 15})`} />
        ))}
        <circle r="15.5" fill="#3a3a3c" />
        <circle r="13" fill="#c7c7cc" />
        <circle r="10" fill="#3a3a3c" />
        {[0, 120, 240].map((r) => (
          <rect key={r} x="-1.3" y="-10" width="2.6" height="10" fill="#c7c7cc" transform={`rotate(${r})`} />
        ))}
        <circle r="3.5" fill="#c7c7cc" />
        <circle r="2" fill="#3a3a3c" />
      </g>
    </S>
  ),
  appstore: (
    <S bg="appstore">
      <path d="M26 14l-12 21M34 14l12 21M14 37h32M20 44l-2 3M40 44l2 3" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M30.5 22L22 37" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    </S>
  ),
  maps: (
    <S bg="white">
      <rect width="60" height="60" fill="#a7e09a" />
      <path d="M0 40L60 18v10L0 50z" fill="#f6d36a" />
      <path d="M38 0l-8 60h6l8-60z" fill="#fff" />
      <path d="M0 0h22L0 22z" fill="#8ccfff" />
      <circle cx="40" cy="38" r="6" fill="#1a7cff" stroke="#fff" strokeWidth="2.5" />
    </S>
  ),
  facetime: (
    <S bg="green">
      <rect x="11" y="20" width="26" height="20" rx="5" fill="#fff" />
      <path d="M38 27l11-6v18l-11-6z" fill="#fff" />
    </S>
  ),
  wallet: (
    <S bg="black">
      <rect x="10" y="16" width="40" height="30" rx="5" fill="#2c2c2e" />
      <rect x="12" y="13" width="36" height="8" rx="3" fill="#30a0ff" />
      <rect x="12" y="19" width="36" height="8" rx="3" fill="#ffb800" />
      <rect x="12" y="25" width="36" height="8" rx="3" fill="#34c759" />
      <rect x="12" y="31" width="36" height="8" rx="3" fill="#ff3b30" />
      <path d="M10 36h14a6 6 0 0 0 12 0h14v6a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="#1c1c1e" />
    </S>
  ),
  health: (
    <S bg="white">
      <path d="M30 45s-15-8.5-15-19a8 8 0 0 1 15-3.8A8 8 0 0 1 45 26c0 10.5-15 19-15 19z" fill="url(#hg)" />
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6b9a" />
          <stop offset="1" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
    </S>
  ),
  files: (
    <S bg="white">
      <path d="M11 20a3 3 0 0 1 3-3h10l3 4h19a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill="#1e8bff" />
      <path d="M11 25h38v18a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill="#4aa9ff" />
    </S>
  ),
  tv: (
    <S bg="black">
      <text x="30" y="36" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" fontFamily="-apple-system,Helvetica">tv</text>
      <path d="M17 20.5c1.5 0 2.8.7 3.5 1.7-1.6 1-1.5 3.4.2 4.2-.5 1.4-1.6 3-2.9 3-.8 0-1.2-.5-2-.5s-1.3.5-2 .5c-1.4 0-3.2-2.8-3.2-5.3 0-2.3 1.5-3.6 3-3.6.9 0 1.6.5 2.1.5.5 0 1.3-.5 2.3-.5zM17.6 17.5c.1 1-.7 2.2-1.8 2.2-.1-1 .8-2.1 1.8-2.2z" fill="#fff" transform="translate(-4 2)" />
    </S>
  ),
  podcasts: (
    <S bg="purple">
      <circle cx="30" cy="27" r="13" stroke="#fff" strokeWidth="2.6" fill="none" />
      <circle cx="30" cy="27" r="7" stroke="#fff" strokeWidth="2.6" fill="none" />
      <circle cx="30" cy="27" r="3" fill="#fff" />
      <rect x="27.5" y="32" width="5" height="14" rx="2.5" fill="#fff" />
    </S>
  ),
  reminders: (
    <S bg="white">
      {[["#0a84ff", 18], ["#ff3b30", 30], ["#ff9500", 42]].map(([c, y]) => (
        <g key={y as number}>
          <circle cx="16" cy={y as number} r="3.6" fill={c as string} />
          <rect x="23" y={(y as number) - 1} width="24" height="2" rx="1" fill="#d1d1d6" />
        </g>
      ))}
    </S>
  ),
};

export function CalendarIcon({ day, dow }: { day: number; dow: string }) {
  return (
    <svg viewBox="0 0 60 60" className="ic-svg">
      <rect width="60" height="60" fill="#fff" />
      <text x="30" y="17" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#ff3b30" fontFamily="-apple-system,Helvetica,Arial">{dow}</text>
      <text x="30" y="47" textAnchor="middle" fontSize="30" fontWeight="300" fill="#000" fontFamily="-apple-system,Helvetica,Arial">{day}</text>
    </svg>
  );
}
