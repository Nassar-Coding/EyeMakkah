import React, { useState, useEffect, useMemo, useRef, useReducer, useContext, createContext, useCallback } from "react";
import {
  Home, Compass, Users, CalendarCheck, Search, ChevronLeft, ChevronRight, MapPin, Clock,
  Bookmark, BookmarkCheck, Share2, Bell, X, Plus, Minus, Check, CheckCheck, AlertTriangle,
  Info, Shield, ExternalLink, Navigation, Star, Heart, MessageCircle, Send, Camera, Image as ImageIcon,
  Languages, Utensils, Coffee, Landmark, BookOpen, GraduationCap, HandHeart, ShoppingBag, Mountain,
  Baby, Accessibility, Sparkles, Filter, Map as MapIcon, List, Settings, User, Lock, Eye, EyeOff,
  Flag, Ban, RefreshCw, TrendingUp, Ticket, Tag, Wallet, Phone, ArrowLeft, ArrowRight, MoreHorizontal,
  Trash2, Pencil, ThumbsUp, HelpCircle, Megaphone, Footprints, Palette, Wrench, Leaf,
  Building2, Store, Armchair, Layers, WifiOff, Loader2, CircleDot, ChevronDown, ChevronUp, Quote,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   EyeMakkah — مجتمع مكة الرقمي
   Residents & visitors · Discovery · Community · Participation · Plan
   Transformation build — Groups 1→5 cumulative, one product.
   Arabic-first (RTL). AI is horizontal and mostly invisible.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────── 1. DESIGN TOKENS ───────────────────────── */

const T = {
  limestone: "#F4EFE5",
  paper: "#FFFCF6",
  sand: "#E8DDC9",
  sandDeep: "#DED2BE",
  ink: "#211E19",
  muted: "#756E64",
  green: "#17463A",
  deep: "#0E3129",
  brass: "#B8944A",
  brassSoft: "#D8BE86",
  clay: "#A65F45",
  ok: "#3D725E",
  warn: "#A6522D",
  line: "rgba(33,30,25,.12)",
  lineSoft: "rgba(33,30,25,.07)",
  ar: '"29LT Zarid Sans","Tajawal",Tahoma,Arial,sans-serif',
  en: '"29LT Zarid Sans","Inter",system-ui,sans-serif',
};

const R = { ctl: 8, box: 12, boxLg: 14, media: 16, mediaLg: 20, pill: 999 };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap');

.em *, .em *::before, .em *::after { box-sizing: border-box; }
.em { font-family: ${T.ar}; color: ${T.ink}; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.em .lat { font-family: ${T.en}; }
.em button { font: inherit; color: inherit; cursor: pointer; background: none; border: none; padding: 0; }
.em input, .em textarea, .em select { font: inherit; color: inherit; }
.em ::-webkit-scrollbar { width: 0; height: 0; }
.em .scroll { scrollbar-width: none; -ms-overflow-style: none; }
.em .row { display: flex; align-items: center; }
.em .press { transition: transform .16s cubic-bezier(.2,.8,.2,1), opacity .16s ease; }
.em .press:active { transform: scale(.975); opacity: .9; }
.em .lift { transition: transform .22s cubic-bezier(.2,.8,.2,1); }
.em .lift:active { transform: scale(.99); }
.em .hs { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
.em .hs > * { scroll-snap-align: start; flex: 0 0 auto; }
.em .clamp1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.em .clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.em .clamp3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.em .clamp4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

@keyframes emUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes emIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes emSheet { from { transform: translateY(24px); opacity: .4; } to { transform: none; opacity: 1; } }
@keyframes emShimmer { 0% { background-position: 120% 0; } 100% { background-position: -120% 0; } }
@keyframes emPulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes emSpin { to { transform: rotate(360deg); } }
.em .up { animation: emUp .34s cubic-bezier(.2,.8,.2,1) both; }
.em .fade { animation: emIn .3s ease both; }
.em .sheetIn { animation: emSheet .26s cubic-bezier(.2,.8,.2,1) both; }
.em .spin { animation: emSpin 1s linear infinite; }
.em .shim { background: linear-gradient(90deg, ${T.sand} 25%, ${T.limestone} 50%, ${T.sand} 75%); background-size: 240% 100%; animation: emShimmer 1.4s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  .em .up, .em .fade, .em .sheetIn, .em .shim, .em .spin { animation: none !important; }
  .em .press, .em .lift { transition: none !important; }
}
`;

/* ───────────────────────── 2. SMALL UTILITIES ───────────────────────── */

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const ar = (v) => String(v).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const uniq = (a) => Array.from(new Set(a));
const byId = (list) => { const m = {}; for (const x of list) m[x.id] = x; return m; };

/* deterministic hash → pseudo random, so every object looks stable across renders */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0);
}
function rng(seed) {
  let s = typeof seed === "string" ? hash(seed) : seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const pick = (arr, r) => arr[Math.floor(r() * arr.length) % arr.length];

/* time helpers — the prototype runs on a fixed "now" so states stay reproducible */
const NOW = new Date("2026-09-20T18:20:00+03:00");
const MIN = 60000, HOUR = 3600000, DAY = 86400000;
const t0 = NOW.getTime();
const at = (offsetHours) => new Date(t0 + offsetHours * HOUR);
const daysAgo = (d) => new Date(t0 - d * DAY);

/* Makkah runs on UTC+03:00 with no daylight saving. The prototype must read the
   clock in Makkah time whatever timezone the device or server happens to use. */
const TZ = 3 * HOUR;
const mk = (d) => new Date(new Date(d).getTime() + TZ);   // read with getUTC*
const mkHour = (d = NOW) => { const l = mk(d); return l.getUTCHours() + l.getUTCMinutes() / 60; };
const mkDayStart = (d) => { const l = mk(d); return Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate()); };

const AR_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function clockAr(d) {
  const l = mk(d);
  const h = l.getUTCHours(), m = l.getUTCMinutes();
  const suffix = h < 12 ? "ص" : "م";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${ar(hh)}${m ? ":" + ar(String(m).padStart(2, "0")) : ""} ${suffix}`;
}
function dayLabelAr(d) {
  const l = mk(d);
  const diff = Math.round((mkDayStart(d) - mkDayStart(NOW)) / DAY);
  if (diff === 0) return "اليوم";
  if (diff === 1) return "غدًا";
  if (diff === -1) return "أمس";
  if (diff > 1 && diff < 7) return AR_DAYS[l.getUTCDay()];
  if (diff < -1 && diff > -7) return `${AR_DAYS[l.getUTCDay()]} الماضي`;
  return `${ar(l.getUTCDate())} ${AR_MONTHS[l.getUTCMonth()]}`;
}
function whenAr(d) { return `${dayLabelAr(d)} — ${clockAr(d)}`; }
function agoAr(d) {
  const diff = t0 - new Date(d).getTime();
  if (diff < HOUR) return `قبل ${ar(Math.max(1, Math.round(diff / MIN)))} دقيقة`;
  if (diff < DAY) return `قبل ${ar(Math.round(diff / HOUR))} ساعة`;
  const dd = Math.round(diff / DAY);
  if (dd < 30) return `قبل ${ar(dd)} يوم`;
  if (dd < 365) return `قبل ${ar(Math.round(dd / 30))} شهر`;
  return `قبل ${ar(Math.round(dd / 365))} سنة`;
}
function inAr(d) {
  const diff = new Date(d).getTime() - t0;
  if (diff <= 0) return "الآن";
  if (diff < HOUR) return `بعد ${ar(Math.max(1, Math.round(diff / MIN)))} دقيقة`;
  if (diff < DAY) return `بعد ${ar(Math.round(diff / HOUR))} ساعة`;
  return dayLabelAr(new Date(d));
}
const riyal = (n) => (n === 0 ? "مجانًا" : `${ar(n)} ريال`);
const minutesAr = (n) => `${ar(n)} دقيقة`;
/* Arabic counts: 1 and 2 have their own forms, 3–10 take the plural */
function countAr(n, one, two, many, singular) {
  if (n === 1) return one;
  if (n === 2) return two;
  return `${ar(n)} ${n >= 3 && n <= 10 ? many : (singular || one)}`;
}

/* ───────────────────────── 3. EDITORIAL IMAGE LAYER ─────────────────────────
   Photography carries the hierarchy in EyeMakkah. Two layers exist:

   1) REAL PHOTO — used only where the subject is a real, public, named place and
      a known public image exists. Attribution is shown in the source sheet.
   2) EDITORIAL ARTWORK — a deterministic, per-object drawn scene. Every object
      gets a visually distinct image, nothing repeats, nothing loads from the
      network, and a drawn scene is never presented as a photograph of a specific
      business. Prototype objects carry a «صورة تعبيرية» mark.

   Production note: replace this layer with owned/licensed media on your own CDN.
   ──────────────────────────────────────────────────────────────────────────── */

const REAL_PHOTOS = {
  haram: {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF_%D8%A7%D9%84%D8%AD%D8%B1%D8%A7%D9%85%D9%A3.jpg?width=1200",
    credit: "ويكيميديا كومنز — المسجد الحرام",
  },
  clock: {
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Makkah_clock_tower_with_Abraj_Al_Bait_Towers.jpg?width=1200",
    credit: "ويكيميديا كومنز — برج الساعة وأبراج البيت",
  },
};

const MOODS = {
  dawn:  { sky: ["#F8E9D2", "#EFCDA4", "#D8A384"], gnd: ["#D5C0A0", "#B2946F"], dark: false, warm: "#FFF0CE", haze: "#F3D9B8" },
  day:   { sky: ["#EDF1F3", "#DCE3E7", "#C3CCD2"], gnd: ["#D8CCB2", "#B6A88A"], dark: false, warm: "#FFF8E6", haze: "#E4E6E2" },
  gold:  { sky: ["#FAE7C1", "#EFC48B", "#D2915F"], gnd: ["#CDA87D", "#A17F58"], dark: false, warm: "#FFE9B8", haze: "#EED2A6" },
  dusk:  { sky: ["#E7B98F", "#B97C64", "#6B4A50"], gnd: ["#8A6A58", "#5B453F"], dark: true,  warm: "#F5C877", haze: "#B98A72" },
  night: { sky: ["#354150", "#26313D", "#18202A"], gnd: ["#343740", "#22252C"], dark: true,  warm: "#F0C879", haze: "#3A4552" },
};
const MOOD_BIAS = {
  food: ["gold", "dusk", "night"], cafe: ["gold", "dusk", "day"], library: ["day", "gold"],
  museum: ["day", "gold", "dusk"], workshop: ["gold", "day", "dusk"], hall: ["dusk", "night"],
  market: ["dusk", "night", "gold"], mountain: ["dawn", "gold", "day"], garden: ["gold", "dusk", "day"],
  haram: ["dusk", "night", "dawn"], skyline: ["dusk", "night", "gold"], alley: ["gold", "dusk", "night"],
  kids: ["gold", "dusk", "day"], sport: ["dusk", "night", "dawn"], volunteer: ["gold", "day", "dusk"],
  stay: ["night", "dusk", "day"],
};

function Scene({ kind = "alley", seed = "x", style }) {
  const r = rng(kind + "|" + seed);
  const bias = MOOD_BIAS[kind] || Object.keys(MOODS);
  const mood = MOODS[pick(bias, r)] || MOODS.gold;
  const uid = "s" + hash(kind + seed).toString(36);
  const { sky, gnd, dark, warm, haze } = mood;
  const accent = pick(["#A65F45", "#B8944A", "#17463A", "#8C6B4F", "#9E6B52", "#6E8E6B"], r);
  const P = { r, uid, dark, warm, haze, accent, stone: dark ? "#3A3833" : "#E5DAC5", stone2: dark ? "#2B2A27" : "#CFC0A5", gnd };

  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" style={{ display: "block", width: "100%", height: "100%", ...style }} aria-hidden="true">
      <defs>
        <linearGradient id={uid + "sky"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} /><stop offset="52%" stopColor={sky[1]} /><stop offset="100%" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id={uid + "g"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gnd[0]} /><stop offset="100%" stopColor={gnd[1]} />
        </linearGradient>
        <radialGradient id={uid + "glow"} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={warm} stopOpacity=".9" /><stop offset="100%" stopColor={warm} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={uid + "vig"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={dark ? ".2" : ".06"} />
          <stop offset="52%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={dark ? ".38" : ".22"} />
        </linearGradient>
        <linearGradient id={uid + "side"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={dark ? ".2" : ".08"} />
          <stop offset="34%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={dark ? ".16" : ".05"} />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill={"url(#" + uid + "sky)"} />
      <SceneBody kind={kind} P={P} />
      <rect width="320" height="240" fill={"url(#" + uid + "vig)"} />
      <rect width="320" height="240" fill={"url(#" + uid + "side)"} />
    </svg>
  );
}

/* shared scene helpers */
function SunDisc({ P, x, y, rad }) {
  const { uid, dark, warm } = P;
  return (
    <g>
      <circle cx={x} cy={y} r={rad * 5.2} fill={"url(#" + uid + "glow)"} opacity={dark ? ".5" : ".62"} />
      <circle cx={x} cy={y} r={rad} fill={dark ? "#F0E6CC" : warm} opacity={dark ? ".92" : ".85"} />
    </g>
  );
}
function Hills({ P, baseY = 150 }) {
  const { r, dark, haze } = P;
  const far = dark ? "#222833" : haze;
  const near = dark ? "#1B2029" : "#B7A484";
  return (
    <g>
      <path d={`M-10 ${baseY - 14} L${30 + r() * 26} ${baseY - 66} L${92} ${baseY - 20} L${146 + r() * 24} ${baseY - 78} L${214} ${baseY - 16} L${262 + r() * 20} ${baseY - 54} L330 ${baseY - 8} L330 240 L-10 240 Z`} fill={far} opacity=".62" />
      <path d={`M-10 ${baseY + 6} L${54} ${baseY - 40} L${124} ${baseY + 8} L${196} ${baseY - 34} L${268} ${baseY + 10} L330 ${baseY - 14} L330 240 L-10 240 Z`} fill={near} opacity=".55" />
    </g>
  );
}
function City({ P, baseY = 200, n = 8, tall = 120 }) {
  const { r, dark, stone, stone2, warm } = P;
  const items = [];
  let x = -14;
  for (let i = 0; i < n; i++) {
    const w = 26 + r() * 40, h = 42 + r() * tall;
    items.push({ x, w, h, i });
    x += w + 2 + r() * 8;
  }
  return (
    <g>
      {items.map((b) => (
        <g key={b.i}>
          <rect x={b.x} y={baseY - b.h} width={b.w} height={b.h} rx="2" fill={b.i % 2 ? stone2 : stone} opacity={dark ? 1 : .96} />
          <rect x={b.x} y={baseY - b.h} width={b.w} height="3" fill={dark ? "#4A4740" : "#F1E7D2"} opacity=".5" />
          {Array.from({ length: Math.max(1, Math.floor(b.h / 24)) }).map((_, j) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 16)) }).map((__, k) => {
              const lit = r() > .42;
              return <rect key={j + "-" + k} x={b.x + 5 + k * 14} y={baseY - b.h + 11 + j * 22} width="6.5" height="9" rx="1"
                fill={lit ? (dark ? warm : "#FBF3E0") : (dark ? "#1A1C20" : "#C8B896")} opacity={lit ? (dark ? .9 : .7) : .5} />;
            }))}
        </g>
      ))}
    </g>
  );
}
function Minaret({ P, x, base, h }) {
  const { dark, warm } = P;
  return (
    <g>
      <rect x={x - 4} y={base - h} width="8" height={h} rx="2.5" fill={dark ? "#3E3B34" : "#F0E7D3"} />
      <rect x={x - 5.5} y={base - h * 0.42} width="11" height="4" rx="1.5" fill={dark ? "#4C483F" : "#E3D6BB"} />
      <path d={`M${x - 5} ${base - h} q5 -11 10 0 z`} fill={dark ? "#4C483F" : "#E9DCC0"} />
      <circle cx={x} cy={base - h - 10} r="3" fill="#B8944A" opacity=".95" />
      <circle cx={x} cy={base - h * 0.5} r="1.6" fill={warm} opacity={dark ? ".95" : ".6"} />
    </g>
  );
}
function Lanterns({ P, y = 42, n = 7 }) {
  const { r, warm, dark } = P;
  return (
    <g>
      <path d={`M-6 ${y - 12} Q80 ${y + 10} 160 ${y - 8} T326 ${y + 6}`} stroke={dark ? "#50483C" : "#B9A484"} strokeWidth="1.2" fill="none" opacity=".8" />
      {Array.from({ length: n }).map((_, i) => {
        const x = 12 + i * (296 / (n - 1)), yy = y + Math.sin(i * 1.1) * 8;
        return (
          <g key={i}>
            <line x1={x} y1={yy - 10} x2={x} y2={yy - 2} stroke={dark ? "#50483C" : "#B9A484"} strokeWidth="1" />
            <path d={`M${x - 5} ${yy + 2} q5 -9 10 0 q-1 8 -5 9 q-4 -1 -5 -9 z`} fill={warm} opacity={dark ? ".95" : ".8"} />
            <circle cx={x} cy={yy + 4} r="7" fill={warm} opacity={dark ? ".18" : ".12"} />
          </g>
        );
      })}
    </g>
  );
}
function Figures({ P, y, xs, scale = 1 }) {
  const { dark, accent } = P;
  const tone = dark ? "#151719" : "#584A3C";
  return (
    <g opacity={dark ? ".92" : ".72"}>
      {xs.map((x, i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
          <circle cx="0" cy="-16" r="4" fill={i % 3 === 0 ? accent : tone} />
          <path d="M-5 -11 q5 -3 10 0 l2 13 q-7 3 -14 0 z" fill={i % 3 === 0 ? accent : tone} />
        </g>
      ))}
    </g>
  );
}

function SceneBody({ kind, P }) {
  const { r, dark, warm, accent, stone, stone2, uid, haze } = P;
  const ground = (y) => <rect x="0" y={y} width="320" height={240 - y} fill={"url(#" + uid + "g)"} />;

  switch (kind) {
    case "haram":
      return (
        <g>
          <SunDisc P={P} x={64 + r() * 190} y={40} rad={dark ? 8 : 13} />
          <Hills P={P} baseY={150} />
          <City P={P} baseY={196} n={7} tall={110} />
          {/* courtyard + arcade */}
          {ground(186)}
          <rect x="16" y="150" width="288" height="52" rx="4" fill={dark ? "#33312B" : "#EFE5D0"} />
          {[28, 68, 108, 148, 188, 228, 268].map((x) => (
            <g key={x}>
              <path d={`M${x} 178 q10 -22 20 0 z`} fill={dark ? "#20201D" : "#D9CCB2"} />
              <rect x={x + 2} y="178" width="16" height="24" fill={dark ? "#1B1B19" : "#CFC0A5"} opacity=".9" />
            </g>
          ))}
          {[22, 104, 216, 298].map((x, i) => <Minaret key={i} P={P} x={x} base={186} h={86 + (i % 2) * 22} />)}
          {/* central cube */}
          <rect x="140" y="188" width="40" height="42" rx="1.5" fill={dark ? "#100F0E" : "#241F1B"} />
          <rect x="140" y="199" width="40" height="5.5" fill="#B8944A" opacity=".95" />
          <Figures P={P} y={236} xs={[38, 62, 86, 214, 246, 276]} scale={.9} />
        </g>
      );

    case "mountain":
      return (
        <g>
          <SunDisc P={P} x={236} y={48} rad={dark ? 8 : 15} />
          <path d="M-10 240 L58 118 L108 176 L150 126 L206 240 Z" fill={dark ? "#282C33" : "#A68C69"} />
          <path d="M-10 240 L58 118 L86 152 L52 240 Z" fill={dark ? "#1F2329" : "#8E765A"} opacity=".8" />
          <path d="M116 240 L206 86 L296 240 Z" fill={dark ? "#1B1F25" : "#8A7254"} />
          <path d="M206 86 L236 128 L206 240 L176 160 Z" fill={dark ? "#141820" : "#79624A"} opacity=".75" />
          <path d="M198 86 l8 -12 l8 12 z" fill="#B8944A" opacity=".85" />
          {ground(214)}
          <path d="M20 240 q56 -34 104 -58 q48 -24 92 -64" stroke={dark ? "#4E483C" : "#EFE4CA"} strokeWidth="3.4" fill="none" strokeDasharray="8 7" opacity=".85" />
          <Figures P={P} y={224} xs={[52, 74, 128]} scale={.85} />
        </g>
      );

    case "alley":
      return (
        <g>
          <rect x="-6" y="24" width="122" height="216" rx="2" fill={stone} />
          <rect x="204" y="8" width="122" height="232" rx="2" fill={stone2} />
          <rect x="-6" y="24" width="122" height="216" fill={dark ? "#000" : "#000"} opacity={dark ? ".2" : ".05"} />
          {/* mashrabiya */}
          {[62, 124, 186].map((y, i) => (
            <g key={y}>
              <rect x="6" y={y} width="86" height="38" rx="3" fill={accent} opacity={dark ? ".8" : ".9"} />
              {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={12 + k * 13} y={y + 5} width="8" height="28" rx="1.5" fill={dark ? "#1A1714" : "#F3E9D4"} opacity=".45" />)}
              <rect x="222" y={y - 26} width="86" height="38" rx="3" fill={i % 2 ? "#8C6B4F" : accent} opacity={dark ? ".72" : ".8"} />
              {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={228 + k * 13} y={y - 21} width="8" height="28" rx="1.5" fill={dark ? "#1A1714" : "#F3E9D4"} opacity=".4" />)}
            </g>
          ))}
          {/* sky slit + street */}
          <path d="M116 240 L146 34 L176 34 L204 240 Z" fill={dark ? "#141A22" : "#F6EEDA"} opacity={dark ? ".7" : ".55"} />
          <path d="M120 240 L150 54 L172 54 L200 240 Z" fill={dark ? "#0F141B" : "#FBF5E6"} opacity=".5" />
          <Lanterns P={P} y={58} n={4} />
          <Figures P={P} y={232} xs={[146, 166, 184]} scale={1.05} />
          <rect x="0" y="232" width="320" height="8" fill={dark ? "#1C1E21" : "#BFAE8E"} opacity=".7" />
        </g>
      );

    case "market":
      return (
        <g>
          <City P={P} baseY={126} n={6} tall={70} />
          <Lanterns P={P} y={46} n={8} />
          {ground(200)}
          {[4, 112, 220].map((x, i) => (
            <g key={x}>
              {/* awning */}
              <path d={`M${x - 4} 140 l52 -24 l52 24 z`} fill={i === 1 ? accent : i === 0 ? "#A65F45" : "#6E8E6B"} opacity=".95" />
              <path d={`M${x - 4} 140 l52 -24 l52 24 z`} fill="#000" opacity=".12" />
              <rect x={x + 4} y="140" width="88" height="66" rx="2" fill={dark ? "#2F2B26" : "#EADFC8"} />
              <rect x={x + 4} y="140" width="88" height="5" fill={dark ? "#433C33" : "#D2C2A2"} />
              {/* produce baskets */}
              {Array.from({ length: 5 }).map((_, j) => (
                <g key={j}>
                  <ellipse cx={x + 18 + j * 16} cy={170 + (j % 2) * 9} rx="8.5" ry="5" fill={dark ? "#4A4136" : "#C9B189"} />
                  <circle cx={x + 18 + j * 16} cy={166 + (j % 2) * 9} r={5.5} fill={pick(["#C2703B", "#8F9B4C", "#B8944A", "#A65F45", "#6E8E6B", "#D9B36B"], r)} />
                </g>
              ))}
              <rect x={x + 4} y="200" width="88" height="6" fill={dark ? "#211F1C" : "#B9A683"} />
            </g>
          ))}
          <Figures P={P} y={234} xs={[44, 70, 158, 250, 284]} />
        </g>
      );

    case "food":
      return (
        <g>
          <rect x="0" y="0" width="320" height="112" fill={dark ? "#241F1A" : "#E3D5BB"} />
          <rect x="0" y="0" width="320" height="112" fill={"url(#" + uid + "sky)"} opacity={dark ? ".35" : ".5"} />
          <SunDisc P={P} x={272} y={30} rad={7} />
          <rect x="18" y="26" width="76" height="60" rx="4" fill={dark ? "#3A342C" : "#F3EADA"} opacity=".7" />
          {ground(112)}
          <rect x="0" y="108" width="320" height="8" fill={dark ? "#1A1611" : "#C9B189"} />
          {/* main platter */}
          <ellipse cx="160" cy="176" rx="96" ry="44" fill={dark ? "#0F0D0B" : "#8E7A5C"} opacity=".22" />
          <ellipse cx="160" cy="170" rx="92" ry="41" fill={dark ? "#3C332A" : "#FBF3E2"} />
          <ellipse cx="160" cy="168" rx="72" ry="31" fill={pick(["#C2703B", "#A8563A", "#BE8340", "#8E6A3C"], r)} />
          <ellipse cx="160" cy="162" rx="46" ry="19" fill={pick(["#EBD7AC", "#E2C792", "#F2E2BD"], r)} />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={118 + i * 11} cy={158 + (i % 3) * 6} r={3.4 + r() * 2.4}
              fill={pick(["#7E8B49", "#B8944A", "#A65F45", "#6E8E6B", "#D9B36B", "#8C4A33"], r)} opacity=".95" />
          ))}
          {/* side dishes */}
          {[44, 276].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={196} rx="30" ry="14" fill={dark ? "#453A30" : "#FDF7EA"} />
              <ellipse cx={x} cy={192} rx="19" ry="9" fill={pick(["#C2703B", "#8F9B4C", "#BE8340", "#6E8E6B"], r)} />
            </g>
          ))}
          {/* cups + bread */}
          <g>
            <path d="M232 138 q0 -16 11 -16 q11 0 11 16 z" fill={dark ? "#E9DCC2" : "#FFFDF6"} />
            <path d="M254 128 q9 0 7 -8" stroke={dark ? "#E9DCC2" : "#FFFDF6"} strokeWidth="2.4" fill="none" />
            <ellipse cx="70" cy="136" rx="24" ry="9" fill={dark ? "#6B5741" : "#E4C99A"} />
            <ellipse cx="70" cy="133" rx="19" ry="6" fill={dark ? "#7E6748" : "#F0DDB6"} />
          </g>
        </g>
      );

    case "cafe":
      return (
        <g>
          <rect x="0" y="0" width="320" height="150" fill={dark ? "#252A31" : "#E4DFCF"} />
          {/* window wall */}
          {[14, 116, 218].map((x) => (
            <g key={x}>
              <rect x={x} y="18" width="88" height="112" rx="3" fill={dark ? "#38424F" : "#F7F0DC"} opacity=".9" />
              <rect x={x} y="18" width="88" height="112" rx="3" fill={"url(#" + uid + "sky)"} opacity={dark ? ".45" : ".55"} />
              <rect x={x + 42} y="18" width="3" height="112" fill={dark ? "#20242B" : "#CFC3A8"} />
            </g>
          ))}
          <rect x="0" y="130" width="320" height="6" fill={dark ? "#1B1E23" : "#C8BC9F"} />
          {ground(150)}
          {/* counter */}
          <rect x="0" y="150" width="320" height="90" fill={dark ? "#33291F" : "#D3BD96"} />
          <rect x="0" y="146" width="320" height="10" rx="3" fill={dark ? "#4D3B29" : "#B2946B"} />
          {/* cups */}
          {[62, 160, 258].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={148} rx="20" ry="6" fill="#000" opacity=".12" />
              <path d={`M${x - 15} 146 q0 -26 15 -26 q15 0 15 26 z`} fill={i === 1 ? accent : dark ? "#EADCC0" : "#FFFDF6"} />
              <ellipse cx={x} cy={121} rx="13" ry="4.4" fill={i === 1 ? "#F3E4C6" : "#7A5333"} opacity=".9" />
              <path d={`M${x + 15} 132 q11 0 9 -11`} stroke={i === 1 ? accent : dark ? "#EADCC0" : "#FFFDF6"} strokeWidth="3" fill="none" />
              <path d={`M${x - 4} 112 q5 -11 0 -20`} stroke={warm} strokeWidth="2" fill="none" opacity={dark ? ".7" : ".45"} />
            </g>
          ))}
          <rect x="226" y="168" width="72" height="50" rx="5" fill={accent} opacity=".4" />
        </g>
      );

    case "workshop":
      return (
        <g>
          <rect x="0" y="0" width="320" height="156" fill={dark ? "#2A2822" : "#E7DFCB"} />
          {/* shelves with tools */}
          {[22, 116, 210].map((x, i) => (
            <g key={x}>
              <rect x={x} y={34 + i * 6} width="88" height="6" rx="2" fill={dark ? "#4A4437" : "#C4B08A"} />
              {Array.from({ length: 5 }).map((_, k) => (
                <rect key={k} x={x + 6 + k * 16} y={16 + i * 6 + (k % 2) * 6} width="9" height={18 - (k % 2) * 4} rx="2"
                  fill={pick(["#A65F45", "#B8944A", "#17463A", "#8C6B4F"], r)} opacity=".9" />
              ))}
            </g>
          ))}
          <circle cx="272" cy="72" r="20" fill={warm} opacity={dark ? ".3" : ".4"} />
          <rect x="268" y="6" width="8" height="46" fill={dark ? "#4A4740" : "#B6A588"} />
          <path d="M258 72 l14 -16 l14 16 z" fill={dark ? "#524C42" : "#D6C7A6"} />
          {/* bench */}
          <rect x="0" y="156" width="320" height="84" fill={dark ? "#3A2C21" : "#C6A578"} />
          <rect x="0" y="150" width="320" height="10" rx="2" fill={dark ? "#553E2B" : "#A6844F"} />
          {/* work in progress */}
          <rect x="94" y="120" width="120" height="32" rx="3" fill={dark ? "#453A2E" : "#EFE2C6"} />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={98 + i * 13} y={124} width="8" height="24" rx="1.5" fill={pick(["#A65F45", "#B8944A", "#17463A", "#6E8E6B", "#9E6B52"], r)} opacity=".95" />
          ))}
          <Figures P={P} y={196} xs={[48, 258]} scale={1.15} />
        </g>
      );

    case "library":
      return (
        <g>
          <rect x="0" y="0" width="320" height="240" fill={dark ? "#221F1B" : "#EEE5D0"} />
          {/* arch */}
          <path d="M104 210 L104 96 q56 -52 112 0 L216 210 Z" fill={dark ? "#2C2823" : "#E4D8BC"} opacity=".55" />
          {[10, 226].map((bx) => (
            <g key={bx}>
              <rect x={bx} y="28" width="84" height="176" rx="3" fill={dark ? "#332E27" : "#D8C9A9"} />
              {[0, 1, 2, 3].map((row) => (
                <g key={row}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <rect key={i} x={bx + 6 + i * 12} y={36 + row * 42} width={7 + r() * 3} height={32} rx="1"
                      fill={pick(["#A65F45", "#17463A", "#B8944A", "#7C4A38", "#3D725E", "#8C6B4F"], r)} opacity=".95" />
                  ))}
                  <rect x={bx + 3} y={70 + row * 42} width="78" height="4" fill={dark ? "#4A4438" : "#BBA680"} />
                </g>
              ))}
            </g>
          ))}
          {/* reading table */}
          <rect x="100" y="166" width="120" height="8" rx="2" fill={dark ? "#4F4235" : "#B49265"} />
          <rect x="112" y="174" width="8" height="40" fill={dark ? "#3E3428" : "#9C7C52"} />
          <rect x="200" y="174" width="8" height="40" fill={dark ? "#3E3428" : "#9C7C52"} />
          <path d="M140 166 l20 -10 l20 10 z" fill={dark ? "#E9DCC2" : "#FFFCF2"} />
          <circle cx="160" cy="130" r="10" fill={warm} opacity={dark ? ".85" : ".5"} />
          <circle cx="160" cy="130" r="24" fill={warm} opacity={dark ? ".2" : ".14"} />
          <rect x="0" y="212" width="320" height="28" fill={dark ? "#1A1815" : "#CDBC97"} />
        </g>
      );

    case "museum":
      return (
        <g>
          <rect x="0" y="0" width="320" height="240" fill={dark ? "#222029" : "#EFE8DA"} />
          <rect x="0" y="0" width="320" height="76" fill={dark ? "#1B1922" : "#E5DCCA"} />
          {[18, 122, 226].map((x, i) => (
            <g key={x}>
              <circle cx={x + 38} cy="30" r="14" fill={warm} opacity={dark ? ".28" : ".22"} />
              <rect x={x} y="56" width="76" height="92" rx="2" fill={dark ? "#322F3A" : "#FFFDF5"} stroke="#B8944A" strokeWidth="2" />
              <rect x={x + 9} y="66" width="58" height="72" rx="1" fill={pick(["#A65F45", "#17463A", "#8C6B4F", "#3D725E", "#7A5B8C"], r)} opacity=".88" />
              {i === 1 && <path d={`M${x + 22} 128 l16 -32 l16 32 z`} fill="#EFE3C6" opacity=".45" />}
              {i === 0 && <circle cx={x + 38} cy="102" r="17" fill="#EFE3C6" opacity=".35" />}
              {i === 2 && <rect x={x + 22} y="88" width="32" height="32" rx="2" fill="#EFE3C6" opacity=".32" />}
            </g>
          ))}
          <rect x="0" y="176" width="320" height="64" fill={dark ? "#1A1822" : "#D9CCAF"} />
          <rect x="0" y="172" width="320" height="6" fill={dark ? "#2C2935" : "#C2B190"} />
          {[76, 244].map((x) => (
            <g key={x}>
              <rect x={x - 14} y="188" width="28" height="34" rx="2" fill={dark ? "#393545" : "#F1E9D6"} />
              <circle cx={x} cy="182" r="9" fill="#B8944A" opacity=".8" />
            </g>
          ))}
          <Figures P={P} y={224} xs={[160, 182]} scale={1.05} />
        </g>
      );

    case "hall":
      return (
        <g>
          <rect x="0" y="0" width="320" height="240" fill={dark ? "#1E232B" : "#E6E0D2"} />
          {/* stage */}
          <rect x="30" y="34" width="260" height="92" rx="4" fill={dark ? "#12222A" : "#17463A"} />
          <rect x="44" y="46" width="232" height="68" rx="3" fill={dark ? "#1C3A34" : "#255C4C"} />
          <path d="M60 114 q100 -52 200 0 z" fill={warm} opacity={dark ? ".14" : ".2"} />
          <circle cx="160" cy="18" r="8" fill={warm} opacity=".6" />
          <path d="M152 24 L120 118 L200 118 L168 24 Z" fill={warm} opacity={dark ? ".13" : ".16"} />
          {/* speaker */}
          <g transform="translate(160 118)">
            <circle cx="0" cy="-22" r="7" fill={dark ? "#EADCC0" : "#3A2F25"} />
            <path d="M-9 -15 q9 -5 18 0 l3 17 q-12 5 -24 0 z" fill={dark ? "#EADCC0" : "#3A2F25"} />
          </g>
          {/* audience rows */}
          {[0, 1, 2, 3].map((row) => (
            <g key={row} opacity={1 - row * .12}>
              {Array.from({ length: 9 - (row % 2) }).map((_, i) => (
                <g key={i} transform={`translate(${24 + i * 34 + (row % 2) * 16} ${162 + row * 22})`}>
                  <circle cx="0" cy="-8" r="6" fill={dark ? "#2E3641" : "#8C7A5E"} />
                  <path d="M-8 -2 q8 -4 16 0 l2 12 l-20 0 z" fill={dark ? "#252C36" : "#786853"} />
                </g>
              ))}
            </g>
          ))}
        </g>
      );

    case "volunteer":
      return (
        <g>
          <SunDisc P={P} x={56} y={38} rad={11} />
          <City P={P} baseY={140} n={6} tall={76} />
          {ground(158)}
          {/* tent */}
          <path d="M28 128 l70 -30 l70 30 z" fill={T.green} opacity=".92" />
          <rect x="34" y="128" width="128" height="14" fill={dark ? "#123028" : "#1E5546"} />
          <rect x="40" y="142" width="116" height="34" rx="2" fill={dark ? "#2A2C28" : "#EFE6D2"} opacity=".9" />
          {/* crates of water */}
          {[186, 236, 286].map((x, i) => (
            <g key={x}>
              <rect x={x - 22} y={158 - (i % 2) * 8} width="44" height="30" rx="3" fill={i % 2 ? accent : "#3D725E"} />
              {[0, 1, 2].map((k) => <rect key={k} x={x - 17 + k * 11} y={163 - (i % 2) * 8} width="7" height="20" rx="1.5" fill="#F3EEDD" opacity=".75" />)}
            </g>
          ))}
          <Figures P={P} y={214} xs={[72, 96, 120, 208, 262]} scale={1.1} />
        </g>
      );

    case "garden":
      return (
        <g>
          <SunDisc P={P} x={248} y={42} rad={12} />
          <Hills P={P} baseY={130} />
          <rect x="0" y="138" width="320" height="102" fill={dark ? "#273327" : "#8FA875"} />
          <path d="M0 138 q80 -16 160 0 q80 16 160 0 l0 102 l-320 0 z" fill={dark ? "#202B20" : "#7E9868"} />
          <path d="M-10 240 q100 -56 180 -60 q86 -4 160 -40" stroke={dark ? "#453F32" : "#E6DCBE"} strokeWidth="18" fill="none" opacity=".8" />
          {[34, 92, 168, 254, 302].map((x, i) => (
            <g key={x}>
              <rect x={x - 3.5} y={128 - (i % 2) * 12} width="7" height={52} rx="2" fill={dark ? "#33301F" : "#6E5738"} />
              <circle cx={x} cy={112 - (i % 2) * 14} r={24 + (i % 3) * 6} fill={dark ? "#26382A" : "#5E7F5A"} />
              <circle cx={x + 12} cy={102 - (i % 2) * 12} r={15} fill={dark ? "#30472F" : "#75976C"} opacity=".92" />
              <circle cx={x - 12} cy={106 - (i % 2) * 10} r={12} fill={dark ? "#223223" : "#527250"} opacity=".9" />
            </g>
          ))}
          {[52, 200].map((x, i) => (
            <g key={x}>
              <rect x={x} y="186" width="58" height="6" rx="2" fill={dark ? "#4B4334" : "#C2A87C"} />
              <rect x={x + 4} y="192" width="6" height="16" fill={dark ? "#3A3428" : "#9E8560"} />
              <rect x={x + 48} y="192" width="6" height="16" fill={dark ? "#3A3428" : "#9E8560"} />
            </g>
          ))}
          <Figures P={P} y={220} xs={[136, 156]} scale={.95} />
        </g>
      );

    case "kids":
      return (
        <g>
          <SunDisc P={P} x={268} y={38} rad={13} />
          <rect x="0" y="146" width="320" height="94" fill={dark ? "#2C332B" : "#9FB784"} />
          <path d="M0 146 q100 -14 180 0 q80 14 140 0 l0 94 l-320 0 z" fill={dark ? "#262E25" : "#8CA673"} />
          {/* play house */}
          <rect x="30" y="112" width="92" height="58" rx="6" fill={accent} opacity=".92" />
          <path d="M22 112 l54 -30 l54 30 z" fill="#B8944A" />
          <rect x="62" y="136" width="28" height="34" rx="3" fill={dark ? "#26221D" : "#F7EFDB"} opacity=".9" />
          {/* slide */}
          <path d="M122 170 l66 -48" stroke={dark ? "#4A4436" : "#F0E5CA"} strokeWidth="11" strokeLinecap="round" />
          <rect x="184" y="108" width="8" height="62" fill={dark ? "#3A3529" : "#C9B58C"} />
          {/* swings */}
          <path d="M226 106 l32 0" stroke={dark ? "#4A4436" : "#C9B58C"} strokeWidth="5" />
          <line x1="232" y1="106" x2="232" y2="146" stroke={dark ? "#4A4436" : "#C9B58C"} strokeWidth="2" />
          <line x1="252" y1="106" x2="252" y2="146" stroke={dark ? "#4A4436" : "#C9B58C"} strokeWidth="2" />
          <rect x="226" y="146" width="32" height="5" rx="2" fill="#6E8E6B" />
          {[286, 302].map((x, i) => <circle key={x} cx={x} cy={150 + i * 10} r={10 + i * 3} fill={pick(["#6E8E6B", "#B8944A", "#A65F45"], r)} opacity=".9" />)}
          <Figures P={P} y={206} xs={[96, 112, 208]} scale={.75} />
        </g>
      );

    case "sport":
      return (
        <g>
          <City P={P} baseY={140} n={6} tall={70} />
          <rect x="0" y="140" width="320" height="100" fill={dark ? "#26332B" : "#6F9268"} />
          <ellipse cx="160" cy="206" rx="152" ry="48" fill="none" stroke="#FFF7E4" strokeWidth="3" opacity=".65" />
          <ellipse cx="160" cy="206" rx="104" ry="31" fill="none" stroke="#FFF7E4" strokeWidth="2" opacity=".4" />
          <line x1="8" y1="206" x2="312" y2="206" stroke="#FFF7E4" strokeWidth="1.5" opacity=".3" />
          {[26, 108, 212, 296].map((x, i) => (
            <g key={x}>
              <rect x={x} y="70" width="5" height="72" fill={dark ? "#43413A" : "#B6A588"} />
              <rect x={x - 9} y="62" width="23" height="10" rx="2" fill={dark ? "#55524A" : "#D2C4A6"} />
              <circle cx={x + 2} cy="66" r="13" fill={warm} opacity={dark ? ".4" : ".3"} />
            </g>
          ))}
          <Figures P={P} y={214} xs={[96, 128, 176, 224]} scale={1.05} />
        </g>
      );

    case "stay":
      return (
        <g>
          <SunDisc P={P} x={40} y={34} rad={9} />
          <City P={P} baseY={120} n={7} tall={84} />
          <rect x="22" y="80" width="124" height="160" rx="4" fill={stone} />
          <rect x="176" y="54" width="128" height="186" rx="4" fill={stone2} />
          {Array.from({ length: 6 }).map((_, row) => (
            <g key={row}>
              {[0, 1, 2, 3].map((c) => {
                const lit1 = r() > .38, lit2 = r() > .45;
                return (
                  <g key={c}>
                    <rect x={34 + c * 28} y={96 + row * 24} width="18" height="15" rx="1.5" fill={lit1 ? warm : dark ? "#191B1E" : "#C9BB9B"} opacity={lit1 ? (dark ? .92 : .7) : .55} />
                    <rect x={188 + c * 29} y={72 + row * 24} width="18" height="15" rx="1.5" fill={lit2 ? warm : dark ? "#191B1E" : "#C9BB9B"} opacity={lit2 ? (dark ? .9 : .65) : .5} />
                  </g>
                );
              })}
            </g>
          ))}
          <rect x="22" y="80" width="124" height="6" fill="#B8944A" opacity=".7" />
          <rect x="176" y="54" width="128" height="6" fill="#B8944A" opacity=".55" />
          <rect x="0" y="230" width="320" height="10" fill={dark ? "#1F2124" : "#BFAE8E"} />
          <Figures P={P} y={230} xs={[156, 170]} scale={.85} />
        </g>
      );

    default: /* skyline */
      return (
        <g>
          <SunDisc P={P} x={62 + r() * 190} y={40} rad={dark ? 8 : 14} />
          <Hills P={P} baseY={140} />
          <City P={P} baseY={198} n={9} tall={128} />
          <Minaret P={P} x={40} base={198} h={70} />
          <Minaret P={P} x={282} base={198} h={58} />
          {ground(196)}
          <Figures P={P} y={230} xs={[64, 92, 226]} scale={.9} />
        </g>
      );
  }
}

/* Photo — real photo when we truly have one, editorial artwork otherwise. */
function Photo({ kind, seed, photo, ratio = "4 / 3", radius = R.media, children, mark = false, style, scrim = "soft" }) {
  const real = photo ? REAL_PHOTOS[photo] : null;
  const [failed, setFailed] = useState(false);
  const showReal = real && !failed;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, borderRadius: radius, overflow: "hidden", background: T.sand, ...style }}>
      <div style={{ position: "absolute", inset: 0 }}><Scene kind={kind} seed={seed} /></div>
      {showReal && (
        <img src={real.url} alt="" loading="lazy" onError={() => setFailed(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {scrim !== "none" && (
        <div style={{
          position: "absolute", inset: 0,
          background: scrim === "strong"
            ? "linear-gradient(180deg, rgba(14,49,41,.04) 0%, rgba(20,16,12,.1) 40%, rgba(16,13,10,.58) 100%)"
            : "linear-gradient(180deg, rgba(20,16,12,0) 48%, rgba(18,14,10,.42) 100%)",
        }} />
      )}
      {mark && !showReal && (
        <span style={{
          position: "absolute", insetInlineEnd: 8, top: 8, fontSize: 9.5, fontWeight: 700, color: "#FFF6E4",
          background: "rgba(22,18,14,.42)", padding: "2px 7px", borderRadius: R.pill, backdropFilter: "blur(3px)",
        }}>صورة تعبيرية</span>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GROUP 1 — LIVING MAKKAH: CONTENT & DISCOVERY FOUNDATION
   A reusable inventory layer. Nothing below is hardcoded into screen markup;
   Home, Discover, Search, Map, Decision Pages, Community and Plan all read
   from the same objects.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────── 4.1 Neighborhoods — Makkah is read through its areas ───────── */

const NEIGHBORHOODS = [
  { id: "awali", name: "العوالي", blurb: "أحياء سكنية واسعة، مطاعم عائلية ومقاهٍ تفتح متأخرًا.", x: 0.70, y: 0.74 },
  { id: "aziziyah", name: "العزيزية", blurb: "حركة دائمة، مطاعم ومقاهٍ وخدمات قريبة من طريق الحرم.", x: 0.66, y: 0.40 },
  { id: "shisha", name: "الششة", blurb: "حي شمالي هادئ نسبيًا، أسواق يومية وحياة أسرية.", x: 0.46, y: 0.20 },
  { id: "shawqiyah", name: "الشوقية", blurb: "غرب مكة، أسواق شعبية وورش ومهن محلية.", x: 0.22, y: 0.30 },
  { id: "naseem", name: "النسيم", blurb: "حي شرقي حديث، حدائق ومرافق عائلية.", x: 0.84, y: 0.46 },
  { id: "bathaquraish", name: "بطحاء قريش", blurb: "امتداد جنوبي، مساحات مفتوحة وفعاليات موسمية.", x: 0.58, y: 0.86 },
  { id: "misfalah", name: "المسفلة", blurb: "قريب من الحرم، طابع قديم وأكل مكي أصيل.", x: 0.42, y: 0.62 },
  { id: "ajyad", name: "أجياد", blurb: "ملاصق للحرم، إقامة وخدمات وحركة زوار كثيفة.", x: 0.50, y: 0.60 },
  { id: "hijrah", name: "الهجرة", blurb: "حي شمالي شرقي، مجتمع سكني ومبادرات حي نشطة.", x: 0.76, y: 0.24 },
  { id: "zahir", name: "الزاهر", blurb: "شمال غرب الحرم، متاحف ومرافق ثقافية.", x: 0.34, y: 0.42 },
  { id: "kakiyah", name: "الكعكية", blurb: "غرب مكة، مجتمع سكني وأسواق قريبة.", x: 0.26, y: 0.52 },
  { id: "jarwal", name: "جرول", blurb: "حي عريق غرب الحرم، مهن قديمة وسوق يومي.", x: 0.32, y: 0.56 },
  { id: "rusayfah", name: "الرصيفة", blurb: "شمال شرق، امتداد سكني ومرافق رياضية.", x: 0.80, y: 0.30 },
  { id: "tanim", name: "التنعيم", blurb: "شمال غرب مكة، ميقات ومحيط خدمي.", x: 0.30, y: 0.16 },
  { id: "haram-area", name: "محيط الحرم", blurb: "المركز — الحرم وما حوله من ساحات وخدمات.", x: 0.50, y: 0.52 },
];
const NB = byId(NEIGHBORHOODS);

/* ───────── 4.2 Categories & intents ───────── */

const CATEGORIES = [
  { id: "food", name: "مطاعم وأكل", icon: Utensils, tone: T.clay },
  { id: "cafe", name: "مقاهٍ", icon: Coffee, tone: "#8C6B4F" },
  { id: "culture", name: "ثقافة وتاريخ", icon: Landmark, tone: T.green },
  { id: "heritage", name: "تراث ومسارات", icon: Footprints, tone: "#7C5A3A" },
  { id: "nature", name: "طبيعة وجبال", icon: Mountain, tone: "#5C6E4A" },
  { id: "market", name: "أسواق وتسوق", icon: ShoppingBag, tone: "#9E6B52" },
  { id: "family", name: "عائلات وأطفال", icon: Baby, tone: "#A8763F" },
  { id: "learn", name: "تعلّم وورش", icon: GraduationCap, tone: "#4A6B7C" },
  { id: "craft", name: "حرف ومهارات", icon: Palette, tone: T.brass },
  { id: "volunteer", name: "تطوع ومبادرات", icon: HandHeart, tone: T.ok },
  { id: "sport", name: "رياضة ومشي", icon: Footprints, tone: "#5E7E6B" },
  { id: "events", name: "فعاليات", icon: Ticket, tone: "#7A5B8C" },
  { id: "services", name: "خدمات", icon: Wrench, tone: "#6B6B6B" },
  { id: "stay", name: "إقامة", icon: Building2, tone: "#54697E" },
];
const CAT = byId(CATEGORIES);

/* Suitability vocabulary — never inferred, always declared by the object. */
const SUIT = {
  family: "مناسب للعائلات",
  kids: "مناسب للأطفال",
  solo: "مناسب للحضور منفردًا",
  beginners: "مناسب للمبتدئين",
  small: "مجموعة صغيرة",
  women: "مخصص للنساء",
  students: "مناسب للطلاب",
  accessible: "مسار مناسب للكراسي المتحركة",
  stepfree: "بدون درج",
  quiet: "هادئ",
  evening: "مناسب للمساء",
  outdoor: "في الهواء الطلق",
  indoor: "مكان مغلق",
  seated: "جلسات مريحة",
  short: "يناسب وقتًا قصيرًا",
  arabic: "لغة النشاط: العربية",
  bilingual: "العربية والإنجليزية",
  firsttime: "مناسب لأول زيارة",
  noexp: "لا تحتاج خبرة سابقة",
  heat: "يفضّل بعد المغرب لتفادي الحر",
};

/* ───────── 4.3 Providers & hosts ───────── */

const PROVIDERS = [
  { id: "hira-district", name: "حي حراء الثقافي", kind: "جهة ثقافية", real: true, blurb: "وجهة ثقافية تضم معرض الوحي ومرافق ثقافية ومطاعم." },
  { id: "makkah-museum-org", name: "متحف مكة المكرمة للتراث والحضارة", kind: "متحف", real: true, blurb: "متحف مدينة يعرض تاريخ مكة وحضارتها في قصر الزاهر." },
  { id: "uqu", name: "جامعة أم القرى", kind: "جهة تعليمية", real: true, blurb: "أنشطة طلابية وبرامج إثرائية ومبادرات مجتمعية." },
  { id: "kiswa", name: "مجمع الملك عبدالعزيز لكسوة الكعبة المشرفة", kind: "جهة رسمية", real: true, blurb: "مصنع كسوة الكعبة ومركز تعريفي بالحرفة." },
  { id: "makkah-lib", name: "مكتبة مكة المكرمة", kind: "مكتبة عامة", real: true, blurb: "مكتبة عامة وبرامج قرائية وثقافية." },
  { id: "host-um-khalid", name: "ضيافة أم خالد", kind: "مضيفة مكية", real: false, blurb: "أسرة مكية تستضيف تجربة طعام وحديث عن حياة الحي." },
  { id: "host-abu-faisal", name: "بيت أبو فيصل المكي", kind: "مضيف مكي", real: false, blurb: "جلسة قهوة ومعجنات مكية وحكايات الحارة القديمة." },
  { id: "craft-sadu", name: "بيت السدو المكي", kind: "ورشة حرفية", real: false, blurb: "ورشة نسيج السدو والحرف اليدوية للمبتدئين." },
  { id: "craft-khatt", name: "مرسم الخط", kind: "ورشة حرفية", real: false, blurb: "ورش خط عربي وتذهيب لجميع المستويات." },
  { id: "walk-makkah", name: "مسارات مكة", kind: "مشغل تجارب", real: false, blurb: "جولات مشي تاريخية بإشراف مرشدين محليين." },
  { id: "guide-saeed", name: "سعيد — مرشد محلي", kind: "مرشد", real: false, blurb: "مرشد سياحي محلي، جولات تاريخية بالعربية والإنجليزية." },
  { id: "guide-noura", name: "نورة — مرشدة محلية", kind: "مرشدة", real: false, blurb: "جولات ثقافية للعائلات والمجموعات النسائية." },
  { id: "vol-hadiyah", name: "فريق هديّة التطوعي", kind: "فريق تطوعي", real: false, blurb: "مبادرات إفطار وسقيا وخدمة الزوار." },
  { id: "vol-hayy", name: "مبادرة حيّنا", kind: "مبادرة حي", real: false, blurb: "مبادرات تنظيف وتشجير وخدمة مجتمع الحي." },
  { id: "club-mashy", name: "نادي مشي مكة", kind: "نادي هواية", real: false, blurb: "مجموعة مشي أسبوعية في مسارات المدينة." },
  { id: "club-qira", name: "نادي قراءة الزاهر", kind: "نادي هواية", real: false, blurb: "لقاء قرائي شهري مفتوح للجميع." },
  { id: "club-photo", name: "نادي تصوير مكة", kind: "نادي هواية", real: false, blurb: "جولات تصوير ومراجعة أعمال للأعضاء." },
  { id: "eat-sufrah", name: "سفرة العوالي", kind: "مطعم", real: false, blurb: "مطعم حجازي عائلي — نموذج أولي ضمن هذا التصور." },
  { id: "eat-qahwa", name: "قهوة الحارة", kind: "مقهى", real: false, blurb: "مقهى حي صغير — نموذج أولي ضمن هذا التصور." },
  { id: "svc-transport", name: "نقل مكة المرخّص", kind: "مزوّد خدمة", real: false, blurb: "خدمة نقل مرخّصة — نموذج أولي." },
];
const PROV = byId(PROVIDERS);

/* ───────── 4.4 Inventory objects ─────────
   Compact authoring shape, expanded by `expand()` into the full object used by
   every surface. Fields:
   id · n name · t tagline · ab about · nb neighborhood · cat category
   pr provider · sc scene · pt real-photo key · real (real public entity)
   price · dur minutes · su suitability · act action kind · out outbound partner
   tm timing · fx practical facts [label, value, sourceClass, ageDays, freshness]
   com communities · nov novelty · pop popularity · cap/joined declared prototype counts
   ───────────────────────────────────────────────────────────────────────── */

const HOURS = (open, close) => ({ kind: "hours", open, close });
const SESSION = (hoursFromNow, durMin) => ({ kind: "session", start: at(hoursFromNow), end: at(hoursFromNow + durMin / 60) });
const WEEKLY = (dayIdx, hour, minute = 0) => ({ kind: "recurring", dayIdx, hour, minute });
const WINDOW = (fromDays, toDays) => ({ kind: "window", from: at(fromDays * 24), to: at(toDays * 24) });

const PLACES = [
  { id: "hira", n: "حي حراء الثقافي", t: "وجهة ثقافية متكاملة عند جبل النور", real: true, nb: "shisha", cat: "culture", pr: "hira-district", sc: "museum",
    ab: "وجهة ثقافية تجمع معرض الوحي ومرافق ثقافية ومطاعم ومساحات مفتوحة عند سفح جبل النور. تناسب زيارة مسائية كاملة أكثر من مرور سريع.",
    price: 0, dur: 150, su: ["family", "firsttime", "evening", "bilingual", "seated"], act: "go",
    tm: HOURS(9, 23), com: ["culture", "visitors"], nov: 0.3, pop: 0.95,
    fx: [["ساعات الزيارة", "٩ ص — ١١ م", "provider", 6, "F3"], ["الدخول", "دخول الحي مجاني — بعض المرافق تذكرة مستقلة", "provider", 9, "F3"],
         ["الوصول", "مواقف واسعة ونقل داخلي بين المرافق", "provider", 14, "F3"], ["المدة المقترحة", "ساعتان إلى ثلاث", "community", 4, "F4"]] },
  { id: "haram", n: "المسجد الحرام", t: "قلب مكة ومركز حركتها", real: true, nb: "haram-area", cat: "culture", pr: null, sc: "haram", pt: "haram",
    ab: "المركز الذي تدور حوله المدينة وخدماتها وحركتها اليومية. الخدمات التشغيلية والمسارات الرسمية تُدار عبر الجهات المختصة وتطبيقاتها.",
    price: 0, dur: null, su: ["accessible", "firsttime"], act: "official", out: "الخريطة الرسمية للحرمين",
    tm: HOURS(0, 24), com: ["visitors", "hajj"], nov: 0.05, pop: 1,
    fx: [["الإرشاد داخل الحرم", "عبر المسارات والخدمات الرسمية", "official", 3, "F4"], ["أوقات الازدحام", "تتغير لحظيًا — تُراجع من المصدر الرسمي", "official", 1, "F1"]] },
  { id: "makkah-museum", n: "متحف مكة المكرمة للتراث والحضارة", t: "قصر الزاهر وتاريخ المدينة", real: true, nb: "zahir", cat: "culture", pr: "makkah-museum-org", sc: "museum",
    ab: "متحف المدينة في قصر الزاهر، يعرض تاريخ مكة وعمارتها وحياتها الاجتماعية عبر مقتنيات ونماذج.",
    price: 0, dur: 90, su: ["family", "kids", "indoor", "bilingual"], act: "go", tm: HOURS(9, 21), com: ["culture"], nov: 0.45, pop: 0.7,
    fx: [["ساعات العمل", "٩ ص — ٩ م", "provider", 21, "F3"], ["الدخول", "مجاني", "provider", 21, "F3"], ["الوصول", "مدخل رئيسي بدون درج", "community", 11, "F4"]] },
  { id: "clock-museum", n: "متحف برج الساعة", t: "علم الفلك والوقت فوق مكة", real: true, nb: "haram-area", cat: "culture", pr: null, sc: "skyline", pt: "clock",
    ab: "متحف داخل برج الساعة يعرض تاريخ قياس الوقت وعلم الفلك، مع مستوى إطلالة على محيط الحرم.",
    price: 50, dur: 60, su: ["family", "firsttime", "indoor"], act: "book", out: "منصة التذاكر",
    tm: HOURS(10, 23), com: ["visitors", "culture"], nov: 0.35, pop: 0.85,
    fx: [["ساعات الزيارة", "١٠ ص — ١١ م", "provider", 34, "F3"], ["التذكرة", "تُحجز مسبقًا عبر المشغّل", "provider", 34, "F3"], ["الوصول", "مصاعد — بدون درج", "provider", 60, "F4"]] },
  { id: "jabal-nour", n: "جبل النور", t: "المعلم الذي يطل على مكة", real: true, nb: "shisha", cat: "nature", pr: null, sc: "mountain",
    ab: "جبل مرتفع شمال شرق مكة، الصعود شاق ويستغرق وقتًا طويلًا، ويحتاج لياقة وماء ووقت مناسب من اليوم.",
    price: 0, dur: 240, su: ["outdoor", "heat"], act: "go", tm: HOURS(0, 24), com: ["visitors", "culture"], nov: 0.2, pop: 0.9,
    fx: [["الصعود", "مسار جبلي شاق — غير مناسب لمن لديه صعوبة في الحركة", "community", 8, "F4"],
         ["أفضل وقت", "قبل الفجر أو بعد العصر لتفادي الحر", "community", 5, "F4"], ["المدة", "من ساعتين إلى أربع ذهابًا وإيابًا", "community", 8, "F4"]] },
  { id: "jabal-thawr", n: "جبل ثور", t: "جنوب مكة، مسار جبلي معروف", real: true, nb: "bathaquraish", cat: "nature", pr: null, sc: "mountain",
    ab: "جبل جنوب مكة، مسار صعوده طويل ويحتاج استعدادًا. الزيارة أقرب لتجربة مشي جبلي منها لجولة قصيرة.",
    price: 0, dur: 210, su: ["outdoor", "heat"], act: "go", tm: HOURS(0, 24), com: ["visitors", "sport"], nov: 0.4, pop: 0.6,
    fx: [["المسار", "صخري ومتدرج — أحذية مناسبة ضرورية", "community", 12, "F4"], ["الماء", "لا تعتمد على نقاط بيع في الأعلى", "community", 12, "F4"]] },
  { id: "ain-zubaydah", n: "عين زبيدة", t: "حكاية الماء في مكة", real: true, nb: "naseem", cat: "heritage", pr: null, sc: "garden",
    ab: "أثر تاريخي يروي كيف وصل الماء إلى مكة قرونًا طويلة. يُزار عادة ضمن مسار تراثي مع شرح، لا كمحطة منفردة.",
    price: 0, dur: 75, su: ["outdoor", "family", "evening"], act: "go", tm: HOURS(8, 18), com: ["culture", "living"], nov: 0.75, pop: 0.45,
    fx: [["الزيارة", "يفضّل ضمن جولة مصحوبة بشرح", "community", 18, "F4"], ["الوصول", "بعض الأجزاء غير ممهّدة", "community", 18, "F4"]] },
  { id: "wadi-asilah", n: "وادي العسيلة", t: "نقوش إسلامية مبكرة في وادٍ مفتوح", real: true, nb: "rusayfah", cat: "heritage", pr: null, sc: "mountain",
    ab: "موقع مفتوح يضم تركيزًا لافتًا من النقوش الإسلامية المبكرة. يحتاج مرافقة مختص ووسيلة مناسبة للوصول.",
    price: 0, dur: 180, su: ["outdoor", "heat", "small"], act: "contact", tm: HOURS(7, 17), com: ["culture"], nov: 0.95, pop: 0.3,
    fx: [["الوصول", "يفضّل بمرافقة مرشد ومركبة مناسبة", "community", 26, "F4"], ["الوقت", "الصباح الباكر أفضل بكثير", "community", 26, "F4"]] },
  { id: "hudaybiyah", n: "الحديبية", t: "موقع تاريخي غرب مكة", real: true, nb: "tanim", cat: "heritage", pr: null, sc: "garden",
    ab: "موقع تاريخي يقع غرب مكة على طريق جدة، يزوره كثيرون ضمن مسار تاريخي أوسع.",
    price: 0, dur: 90, su: ["outdoor", "family"], act: "go", tm: HOURS(7, 19), com: ["culture", "visitors"], nov: 0.6, pop: 0.5, fx: [["الوصول", "خارج المدينة — يحتاج وسيلة نقل", "community", 30, "F4"]] },
  { id: "kiswa-complex", n: "مجمع كسوة الكعبة المشرفة", t: "حرفة تُصنع أمام عينيك", real: true, nb: "kakiyah", cat: "craft", pr: "kiswa", sc: "workshop",
    ab: "مجمع يُصنع فيه كسوة الكعبة، ويضم مسارًا تعريفيًا بمراحل النسيج والتطريز والخط.",
    price: 0, dur: 75, su: ["family", "firsttime", "indoor", "arabic"], act: "register", out: "الجهة المشغّلة",
    tm: HOURS(8, 16), com: ["culture", "craft"], nov: 0.55, pop: 0.8,
    fx: [["الزيارة", "بتنسيق مسبق عبر الجهة المشغّلة", "official", 40, "F3"], ["التصوير", "وفق تعليمات الموقع", "official", 40, "F4"]] },
  { id: "makkah-library", n: "مكتبة مكة المكرمة", t: "قراءة وبرامج ثقافية قرب الحرم", real: true, nb: "haram-area", cat: "learn", pr: "makkah-lib", sc: "library",
    ab: "مكتبة عامة وبرامج قرائية وجلسات ثقافية، مساحة هادئة قريبة من مركز المدينة.",
    price: 0, dur: 60, su: ["quiet", "indoor", "students", "solo"], act: "go", tm: HOURS(8, 20), com: ["learn", "culture"], nov: 0.5, pop: 0.4,
    fx: [["ساعات العمل", "٨ ص — ٨ م", "provider", 45, "F3"], ["الدخول", "مجاني", "provider", 45, "F3"]] },
  { id: "otaibiyah-souq", n: "سوق العتيبية", t: "سوق يومي بنبض محلي", real: true, nb: "shawqiyah", cat: "market", pr: null, sc: "market",
    ab: "سوق شعبي تجد فيه الخضار والتمور والبهارات والأدوات المنزلية، وأفضل أوقاته بعد العصر.",
    price: null, dur: 60, su: ["family", "evening", "outdoor"], act: "go", tm: HOURS(7, 23), com: ["living", "food"], nov: 0.45, pop: 0.65,
    fx: [["أفضل وقت", "بعد العصر وحتى العشاء", "community", 3, "F3"], ["الدفع", "نقدًا وبطاقات لدى أغلب المحلات", "community", 20, "F4"]] },
  { id: "haramain-arch", n: "معرض عمارة الحرمين الشريفين", t: "تفاصيل العمارة عن قرب", real: true, nb: "zahir", cat: "culture", pr: null, sc: "museum",
    ab: "معرض يعرض مقتنيات ونماذج من عمارة المسجد الحرام والمسجد النبوي عبر العصور.",
    price: 0, dur: 70, su: ["family", "indoor", "firsttime"], act: "go", tm: HOURS(9, 21), com: ["culture"], nov: 0.55, pop: 0.6,
    fx: [["ساعات العمل", "٩ ص — ٩ م", "provider", 28, "F3"], ["الدخول", "مجاني", "provider", 28, "F3"]] },
];

const RESTAURANTS = [
  { id: "r-sufrah", n: "سفرة العوالي", t: "مطبخ حجازي عائلي", nb: "awali", cat: "food", pr: "eat-sufrah", sc: "food",
    ab: "مطعم حي يقدّم أطباقًا حجازية بيتية. الجلسات عائلية والخدمة أسرع قبل العشاء المتأخر.",
    price: 60, dur: 60, su: ["family", "seated", "evening"], act: "go", tm: HOURS(12, 1), com: ["food", "awali"], nov: 0.5, pop: 0.7,
    fx: [["الدوام", "١٢ ظهرًا — ١ صباحًا", "provider", 11, "F3"], ["متوسط الطلب", "٥٠ — ٧٠ ريال للفرد", "community", 6, "F3"], ["الازدحام", "أهدأ قبل ٨ مساءً", "community", 2, "F2"]] },
  { id: "r-mandi", n: "مندي الهجرة", t: "مندي ولحم على الحطب", nb: "hijrah", cat: "food", sc: "food",
    ab: "مطعم مندي ومظبي في حي الهجرة، الطلبات الكبيرة تحتاج وقتًا فاتصل قبل الحضور.",
    price: 85, dur: 70, su: ["family", "seated"], act: "go", tm: HOURS(11, 0), com: ["food", "hijrah"], nov: 0.4, pop: 0.75,
    fx: [["الدوام", "١١ ص — ١٢ ص", "provider", 17, "F3"], ["الطلبات الكبيرة", "يفضّل الاتصال قبل ساعة", "community", 9, "F3"]] },
  { id: "r-foul", n: "فول ومعصوب الحارة", t: "فطور مكي من الصباح الباكر", nb: "misfalah", cat: "food", sc: "food",
    ab: "مطعم فطور شعبي يقدّم الفول والمعصوب والشكشوكة. يزدحم بعد الفجر وقبل الدوام.",
    price: 25, dur: 35, su: ["solo", "short", "family"], act: "go", tm: HOURS(5, 12), com: ["food", "misfalah"], nov: 0.35, pop: 0.8,
    fx: [["الدوام", "٥ ص — ١٢ ظهرًا", "provider", 25, "F3"], ["الازدحام", "أعلى بعد الفجر مباشرة", "community", 4, "F2"]] },
  { id: "r-saleeg", n: "بيت السليق", t: "سليق حجازي كل خميس", nb: "aziziyah", cat: "food", sc: "food",
    ab: "مطعم يقدّم السليق الحجازي بشكل يومي مع تركيز أكبر في نهاية الأسبوع.",
    price: 55, dur: 55, su: ["family", "seated"], act: "go", tm: HOURS(12, 23), com: ["food"], nov: 0.55, pop: 0.6,
    fx: [["الدوام", "١٢ ظهرًا — ١١ م", "provider", 13, "F3"], ["الأفضل طلبًا", "السليق باللبن والدجاج", "community", 7, "F4"]] },
  { id: "r-sea", n: "سمك البحر الأحمر", t: "سمك طازج بطريقة حجازية", nb: "kakiyah", cat: "food", sc: "food",
    ab: "مطعم أسماك بطابع حجازي، الطلب على الصيد اليومي والسيّادية.",
    price: 95, dur: 70, su: ["family", "seated", "evening"], act: "go", tm: HOURS(13, 0), com: ["food"], nov: 0.6, pop: 0.55,
    fx: [["الدوام", "١ ظهرًا — ١٢ ص", "provider", 19, "F3"], ["الحجز", "غير مطلوب عادة إلا للمجموعات", "provider", 19, "F3"]] },
  { id: "r-kebda", n: "كبدة الشوقية", t: "كبدة وسندويشات مسائية", nb: "shawqiyah", cat: "food", sc: "food",
    ab: "محل صغير مشهور بالكبدة والسندويشات، يفتح بعد العصر ويستمر حتى وقت متأخر.",
    price: 30, dur: 30, su: ["solo", "short", "evening"], act: "go", tm: HOURS(16, 2), com: ["food", "shawqiyah"], nov: 0.5, pop: 0.7,
    fx: [["الدوام", "٤ م — ٢ ص", "provider", 8, "F3"], ["الجلوس", "مساحة محدودة — أغلب الطلبات سفري", "community", 5, "F3"]] },
  { id: "r-shawarma", n: "شاورما النسيم", t: "شاورما وسندويشات سريعة", nb: "naseem", cat: "food", sc: "food",
    ab: "محل سندويشات سريع قرب مرافق الحي، مناسب لوجبة خفيفة بعد نشاط مسائي.",
    price: 22, dur: 20, su: ["solo", "short", "kids"], act: "go", tm: HOURS(13, 3), com: ["food", "naseem"], nov: 0.3, pop: 0.72,
    fx: [["الدوام", "١ ظهرًا — ٣ ص", "provider", 6, "F3"]] },
  { id: "r-hijazi-breakfast", n: "ريوق مكة", t: "فطور حجازي بجلسة هادئة", nb: "zahir", cat: "food", sc: "food",
    ab: "مطعم فطور بجلسات هادئة وقائمة حجازية، مناسب للعائلات في الصباح.",
    price: 45, dur: 50, su: ["family", "quiet", "seated"], act: "go", tm: HOURS(6, 13), com: ["food"], nov: 0.65, pop: 0.5,
    fx: [["الدوام", "٦ ص — ١ ظهرًا", "provider", 15, "F3"], ["العائلات", "قسم عائلي منفصل", "provider", 15, "F4"]] },
  { id: "r-biryani", n: "برياني الرصيفة", t: "برياني ومطبخ هندي محلي", nb: "rusayfah", cat: "food", sc: "food",
    ab: "مطبخ هندي محلي عريق في الحي، حصص كبيرة وأسعار مناسبة.",
    price: 38, dur: 45, su: ["family", "solo"], act: "go", tm: HOURS(11, 0), com: ["food"], nov: 0.45, pop: 0.68,
    fx: [["الدوام", "١١ ص — ١٢ ص", "provider", 22, "F3"]] },
  { id: "r-grill", n: "مشاوي بطحاء قريش", t: "مشاوي في الهواء الطلق", nb: "bathaquraish", cat: "food", sc: "food",
    ab: "جلسات خارجية ومشاوي، يناسب المجموعات في الأمسيات المعتدلة.",
    price: 75, dur: 80, su: ["family", "outdoor", "evening"], act: "go", tm: HOURS(17, 1), com: ["food"], nov: 0.6, pop: 0.5,
    fx: [["الدوام", "٥ م — ١ ص", "provider", 12, "F3"], ["الجلسات", "خارجية — قد تكون حارة قبل المغرب", "community", 3, "F2"]] },
  { id: "r-veg", n: "مطبخ نباتي — الششة", t: "خيارات نباتية وسلطات", nb: "shisha", cat: "food", sc: "food",
    ab: "قائمة نباتية وسلطات وأطباق خفيفة، خيار عملي لمن يبحث عن وجبة أخف.",
    price: 40, dur: 45, su: ["solo", "quiet"], act: "go", tm: HOURS(11, 23), com: ["food"], nov: 0.8, pop: 0.35,
    fx: [["الدوام", "١١ ص — ١١ م", "provider", 10, "F3"]] },
  { id: "r-sweets", n: "حلويات جرول", t: "حلويات مكية وكنافة", nb: "jarwal", cat: "food", sc: "food",
    ab: "محل حلويات قديم في الحي، الكنافة والمعمول أشهر ما يُطلب بعد العشاء.",
    price: 28, dur: 20, su: ["family", "short", "evening"], act: "go", tm: HOURS(15, 1), com: ["food", "jarwal"], nov: 0.55, pop: 0.6,
    fx: [["الدوام", "٣ م — ١ ص", "provider", 9, "F3"]] },
  { id: "r-family-hall", n: "مطعم العائلة — العوالي", t: "قاعة عائلية واسعة", nb: "awali", cat: "food", sc: "food",
    ab: "مطعم بقاعة عائلية واسعة ومساحة للأطفال، مناسب للمجموعات الكبيرة.",
    price: 65, dur: 75, su: ["family", "kids", "seated"], act: "go", tm: HOURS(12, 0), com: ["food", "families", "awali"], nov: 0.5, pop: 0.58,
    fx: [["الدوام", "١٢ ظهرًا — ١٢ ص", "provider", 16, "F3"], ["الأطفال", "ركن ألعاب داخلي", "provider", 16, "F4"]] },
  { id: "r-late", n: "مطعم الليل — العزيزية", t: "مفتوح حتى الفجر", nb: "aziziyah", cat: "food", sc: "food",
    ab: "مطعم يعمل حتى ساعات متأخرة جدًا، يخدم الزوار بعد الصلوات المتأخرة.",
    price: 45, dur: 45, su: ["solo", "evening"], act: "go", tm: HOURS(18, 5), com: ["food", "visitors"], nov: 0.5, pop: 0.66,
    fx: [["الدوام", "٦ م — ٥ ص", "provider", 7, "F3"]] },
];

const CAFES = [
  { id: "c-harah", n: "قهوة الحارة", t: "مقهى صغير في قلب الحي", nb: "misfalah", cat: "cafe", pr: "eat-qahwa", sc: "cafe",
    ab: "مقهى صغير بجلسات بسيطة، يعرف زبائنه بالاسم. مناسب لقهوة هادئة أو لقاء قصير.",
    price: 18, dur: 40, su: ["solo", "quiet", "seated"], act: "go", tm: HOURS(6, 0), com: ["food", "misfalah"], nov: 0.7, pop: 0.45,
    fx: [["الدوام", "٦ ص — ١٢ ص", "provider", 5, "F3"], ["الجلوس", "داخلي محدود وخارجي بعد المغرب", "community", 3, "F2"]] },
  { id: "c-specialty", n: "محمصة مكة", t: "قهوة مختصة وتحميص محلي", nb: "aziziyah", cat: "cafe", sc: "cafe",
    ab: "مقهى مختص بتحميص محلي وخيارات تقطير، هادئ في فترة ما بعد الظهر.",
    price: 26, dur: 45, su: ["solo", "quiet", "students"], act: "go", tm: HOURS(7, 1), com: ["food"], nov: 0.75, pop: 0.55,
    fx: [["الدوام", "٧ ص — ١ ص", "provider", 4, "F3"], ["العمل عن بعد", "مقاعد وطاولات ومقابس", "community", 6, "F3"]] },
  { id: "c-study", n: "مقهى الدراسة — الششة", t: "مساحة مذاكرة للطلاب", nb: "shisha", cat: "cafe", sc: "cafe",
    ab: "مقهى بمساحات دراسة هادئة، يمتلئ في فترات الاختبارات.",
    price: 20, dur: 120, su: ["students", "quiet", "solo"], act: "go", tm: HOURS(8, 2), com: ["learn", "students"], nov: 0.6, pop: 0.5,
    fx: [["الدوام", "٨ ص — ٢ ص", "provider", 9, "F3"], ["الازدحام", "مرتفع بعد المغرب في موسم الاختبارات", "community", 2, "F2"]] },
  { id: "c-family", n: "مقهى العائلة — النسيم", t: "جلسات عائلية خارجية", nb: "naseem", cat: "cafe", sc: "cafe",
    ab: "مقهى بجلسات خارجية عائلية قرب حديقة الحي، مناسب بعد نشاط مسائي.",
    price: 24, dur: 50, su: ["family", "kids", "outdoor", "evening"], act: "go", tm: HOURS(15, 1), com: ["families", "naseem"], nov: 0.5, pop: 0.6,
    fx: [["الدوام", "٣ م — ١ ص", "provider", 8, "F3"]] },
  { id: "c-heritage", n: "قهوة التراث — جرول", t: "قهوة عربية ومعجنات", nb: "jarwal", cat: "cafe", sc: "cafe",
    ab: "جلسة قهوة عربية ومعجنات مكية في بيت قديم مُعاد ترميمه.",
    price: 22, dur: 45, su: ["family", "quiet", "firsttime"], act: "go", tm: HOURS(9, 23), com: ["culture", "jarwal"], nov: 0.85, pop: 0.4,
    fx: [["الدوام", "٩ ص — ١١ م", "provider", 12, "F3"], ["الوصول", "مدخل ضيق وعتبة مرتفعة", "community", 14, "F4"]] },
  { id: "c-night", n: "مقهى الليل — أجياد", t: "قريب من الحرم ويفتح متأخرًا", nb: "ajyad", cat: "cafe", sc: "cafe",
    ab: "مقهى قريب من محيط الحرم يعمل حتى وقت متأخر، مناسب بين الصلوات.",
    price: 20, dur: 30, su: ["solo", "short", "evening"], act: "go", tm: HOURS(12, 4), com: ["visitors"], nov: 0.35, pop: 0.7,
    fx: [["الدوام", "١٢ ظهرًا — ٤ ص", "provider", 6, "F3"]] },
];

const EXPERIENCES = [
  { id: "x-revelation", n: "معرض الوحي", t: "التجربة الأبرز في حي حراء", real: true, nb: "shisha", cat: "culture", pr: "hira-district", sc: "museum",
    ab: "معرض تفاعلي يقدّم سيرة الوحي وسياقها في مكة، بمسار عرض منظّم يستغرق نحو ساعة.",
    price: 50, dur: 70, su: ["family", "firsttime", "indoor", "bilingual", "accessible"], act: "book", out: "منصة الحجز",
    tm: HOURS(9, 23), com: ["culture", "visitors"], nov: 0.35, pop: 0.92,
    fx: [["مدة الزيارة", "نحو ٧٠ دقيقة", "provider", 10, "F4"], ["التذكرة", "تُحجز مسبقًا — الأمسيات تمتلئ أسرع", "provider", 10, "F3"],
         ["الوصول", "مسار بدون درج داخل المعرض", "provider", 30, "F4"], ["اللغة", "العربية والإنجليزية", "provider", 30, "F4"]] },
  { id: "x-ala-khutah", n: "على خطاه", t: "مسار يروي قصة الهجرة", real: true, nb: "shisha", cat: "heritage", pr: "hira-district", sc: "museum",
    ab: "تجربة مسار داخل حي حراء تروي قصة الهجرة بترتيب زمني ومحطات شرح.",
    price: 40, dur: 60, su: ["family", "firsttime", "arabic", "indoor"], act: "book", out: "منصة الحجز", tm: HOURS(10, 22), com: ["culture"], nov: 0.55, pop: 0.7,
    fx: [["المدة", "نحو ساعة", "provider", 16, "F4"], ["التذكرة", "تُحجز عبر المشغّل", "provider", 16, "F3"]] },
  { id: "x-bus", n: "حافلة معالم مكة", t: "جولة بالحافلة مع شرح صوتي", real: true, nb: "haram-area", cat: "heritage", pr: null, sc: "skyline",
    ab: "جولة بالحافلة تمر على معالم المدينة مع شرح صوتي، مناسبة لمن يريد صورة عامة عن مكة في وقت محدود.",
    price: 80, dur: 180, su: ["family", "firsttime", "bilingual", "seated"], act: "book", out: "مشغّل الجولة", tm: HOURS(9, 22), com: ["visitors"], nov: 0.5, pop: 0.75,
    fx: [["المدة", "نحو ٣ ساعات", "provider", 24, "F4"], ["نقطة الانطلاق", "محطة محددة قرب محيط الحرم", "provider", 24, "F3"]] },
  { id: "x-family-host", n: "ضيافة أسرة مكية", t: "سفرة وحديث في بيت مكي", nb: "jarwal", cat: "culture", pr: "host-um-khalid", sc: "food",
    ab: "زيارة قصيرة لأسرة مكية: سفرة بيتية، حديث عن الحي وعاداته، وأسئلة مفتوحة. مجموعة صغيرة فقط.",
    price: 150, dur: 120, su: ["small", "family", "firsttime", "arabic", "seated"], act: "book", out: "المضيف",
    tm: WEEKLY(4, 19), com: ["culture", "families", "jarwal"], nov: 0.95, pop: 0.5, cap: 8, joined: 5,
    fx: [["الحجز", "مسبق ومحدود بعدد صغير", "provider", 5, "F3"], ["ما يشمله", "سفرة كاملة وقهوة وحديث", "provider", 5, "F4"],
         ["الخصوصية", "تفاصيل العنوان تُرسل بعد التأكيد فقط", "provider", 5, "F4"]] },
  { id: "x-coffee-house", n: "جلسة قهوة وحكايات الحارة", t: "قهوة ومعجنات وحديث قديم", nb: "misfalah", cat: "culture", pr: "host-abu-faisal", sc: "cafe",
    ab: "جلسة مسائية قصيرة: قهوة مكية، معجنات، وحكايات عن الحارة قبل التوسعات.",
    price: 70, dur: 75, su: ["small", "solo", "beginners", "arabic", "evening"], act: "book", out: "المضيف",
    tm: WEEKLY(1, 20), com: ["culture", "misfalah"], nov: 0.9, pop: 0.42, cap: 10, joined: 6,
    fx: [["المكان", "بيت مُعاد ترميمه — جلسة أرضية", "provider", 9, "F4"], ["الوصول", "درج قصير عند المدخل", "community", 7, "F4"]] },
  { id: "x-sadu", n: "ورشة السدو للمبتدئين", t: "تنسج قطعتك في جلسة واحدة", nb: "shawqiyah", cat: "craft", pr: "craft-sadu", sc: "workshop",
    ab: "ورشة عملية لنسيج السدو: تتعلم الأساسيات وتخرج بقطعة صغيرة من صنعك. لا تحتاج خبرة.",
    price: 120, dur: 150, su: ["beginners", "noexp", "small", "women", "arabic"], act: "register", out: "الورشة",
    tm: WEEKLY(6, 17), com: ["craft", "learn"], nov: 0.85, pop: 0.45, cap: 12, joined: 7,
    fx: [["المستوى", "مبتدئ — لا تحتاج خبرة", "provider", 6, "F4"], ["المواد", "مشمولة في الرسوم", "provider", 6, "F4"]] },
  { id: "x-khatt", n: "ورشة خط عربي للمبتدئين", t: "قلم وحبر وأول كلمة", nb: "zahir", cat: "craft", pr: "craft-khatt", sc: "workshop",
    ab: "ورشة خط عربي تبدأ من مسك القلم حتى كتابة كلمة كاملة بخط النسخ. مجموعة صغيرة ومناسبة للحضور منفردًا.",
    price: 90, dur: 120, su: ["beginners", "noexp", "small", "solo", "arabic", "evening"], act: "register", out: "الورشة",
    tm: WEEKLY(5, 18), com: ["craft", "learn"], nov: 0.8, pop: 0.6, cap: 14, joined: 7,
    fx: [["المستوى", "مبتدئ — لا تحتاج خبرة", "provider", 3, "F4"], ["الأدوات", "تُوفّر في الورشة", "provider", 3, "F4"], ["اللغة", "العربية", "provider", 3, "F4"]] },
  { id: "x-walk-old", n: "مشية مكة القديمة", t: "ساعة ونصف بين الحارات", nb: "misfalah", cat: "heritage", pr: "walk-makkah", sc: "alley",
    ab: "جولة مشي مع مرشد محلي بين الحارات القديمة، تشرح العمارة والأسماء والحكايات اليومية.",
    price: 60, dur: 90, su: ["small", "beginners", "outdoor", "evening", "bilingual"], act: "register", out: "مسارات مكة",
    tm: WEEKLY(4, 18, 30), com: ["culture", "misfalah", "visitors"], nov: 0.8, pop: 0.6, cap: 15, joined: 9,
    fx: [["المسافة", "نحو ٢ كم مشيًا", "provider", 4, "F4"], ["الأرضية", "أرصفة غير مستوية في أجزاء", "community", 6, "F4"], ["الوقت", "بعد المغرب لتفادي الحر", "provider", 4, "F3"]] },
  { id: "x-photo-walk", n: "جولة تصوير مسائية", t: "الضوء الأخير فوق مكة", nb: "zahir", cat: "craft", pr: "club-photo", sc: "skyline",
    ab: "جولة تصوير مع مجموعة صغيرة في وقت الغروب، مع مراجعة سريعة للصور في النهاية.",
    price: 0, dur: 120, su: ["small", "solo", "beginners", "outdoor", "evening"], act: "join",
    tm: WEEKLY(3, 17, 30), com: ["craft", "culture"], nov: 0.9, pop: 0.4, cap: 20, joined: 11,
    fx: [["المستوى", "أي كاميرا أو جوال", "provider", 8, "F4"], ["نقطة اللقاء", "تُرسل للمشاركين قبل الموعد", "provider", 8, "F3"]] },
  { id: "x-hike-sunrise", n: "مشي جبلي عند الشروق", t: "مسار متوسط مع مجموعة", nb: "rusayfah", cat: "sport", pr: "club-mashy", sc: "mountain",
    ab: "مسار مشي جبلي متوسط الصعوبة مع مجموعة النادي، ينطلق قبل الشروق وينتهي بفطور بسيط.",
    price: 0, dur: 150, su: ["small", "outdoor", "solo", "heat"], act: "join",
    tm: WEEKLY(5, 5, 30), com: ["sport", "living"], nov: 0.75, pop: 0.5, cap: 25, joined: 14,
    fx: [["الصعوبة", "متوسط — يحتاج لياقة أساسية", "provider", 7, "F4"], ["الماء", "أحضر لترًا على الأقل", "provider", 7, "F4"]] },
  { id: "x-cook", n: "مطبخ مكي — درس عملي", t: "تطبخ سليقًا ومعصوبًا", nb: "awali", cat: "craft", sc: "workshop",
    ab: "درس طبخ عملي لأطباق مكية، تطبخ وتأكل ما صنعته في نهاية الجلسة.",
    price: 180, dur: 180, su: ["beginners", "small", "women", "arabic"], act: "register", out: "المطبخ",
    tm: WEEKLY(2, 17), com: ["food", "craft"], nov: 0.85, pop: 0.5, cap: 10, joined: 6,
    fx: [["المستوى", "مبتدئ", "provider", 11, "F4"], ["المواد", "مشمولة", "provider", 11, "F4"]] },
  { id: "x-kids-science", n: "ورشة علوم للأطفال", t: "تجارب بسيطة من ٧ إلى ١٢ سنة", nb: "naseem", cat: "family", pr: "uqu", sc: "kids",
    ab: "ورشة علمية قصيرة للأطفال بتجارب آمنة وبسيطة، بحضور ولي الأمر.",
    price: 35, dur: 75, su: ["kids", "family", "indoor", "arabic"], act: "register", out: "الجهة المنظّمة",
    tm: WEEKLY(6, 10), com: ["families", "learn"], nov: 0.7, pop: 0.55, cap: 20, joined: 12,
    fx: [["العمر", "من ٧ إلى ١٢ سنة", "provider", 5, "F4"], ["الحضور", "بمرافقة ولي الأمر", "provider", 5, "F4"]] },
  { id: "x-heritage-hike", n: "مسار عين زبيدة التراثي", t: "مشي وشرح عن ماء مكة", nb: "naseem", cat: "heritage", pr: "walk-makkah", sc: "garden",
    ab: "مسار مشي قصير حول أثر عين زبيدة مع شرح تاريخي عن كيف وصل الماء إلى المدينة.",
    price: 45, dur: 110, su: ["family", "outdoor", "beginners", "arabic"], act: "register", out: "مسارات مكة",
    tm: WEEKLY(6, 16, 30), com: ["culture", "living"], nov: 0.9, pop: 0.45, cap: 18, joined: 8,
    fx: [["المسافة", "نحو ١٫٥ كم", "provider", 13, "F4"], ["الأرضية", "غير ممهّدة في أجزاء", "community", 18, "F4"]] },
  { id: "x-library-night", n: "أمسية قرائية", t: "قراءة ونقاش مفتوح", nb: "haram-area", cat: "learn", pr: "makkah-lib", sc: "library",
    ab: "أمسية قراءة ونقاش حول كتاب الشهر، مفتوحة للجميع بلا رسوم.",
    price: 0, dur: 90, su: ["solo", "quiet", "beginners", "arabic", "evening"], act: "join",
    tm: WEEKLY(1, 19, 30), com: ["learn", "culture"], nov: 0.8, pop: 0.35, cap: 30, joined: 13,
    fx: [["الحضور", "بدون رسوم", "provider", 6, "F4"], ["الكتاب", "يُعلن قبل أسبوع", "provider", 6, "F3"]] },
];

const EVENTS = [
  { id: "e-hira-talk", n: "لقاء: عمارة مكة القديمة", t: "محاضرة مفتوحة مع نقاش", nb: "shisha", cat: "culture", pr: "hira-district", sc: "hall",
    ab: "لقاء مفتوح يتناول عمارة مكة قبل التوسعات، مع جلسة أسئلة في النهاية.",
    price: 0, dur: 90, su: ["solo", "beginners", "arabic", "indoor", "evening"], act: "register", out: "الجهة المنظّمة",
    tm: SESSION(2.5, 90), com: ["culture"], nov: 0.7, pop: 0.6, cap: 120, joined: 74,
    fx: [["الموعد", "الليلة ٨:٥٠ م", "provider", 0.2, "F2"], ["التسجيل", "مجاني — المقاعد محدودة", "provider", 0.5, "F2"]] },
  { id: "e-craft-market", n: "سوق الحرفيين المسائي", t: "حرفيون محليون ومنتجات يدوية", nb: "jarwal", cat: "market", sc: "market",
    ab: "سوق مسائي يجمع حرفيين محليين: سدو، فخار، جلد، وعطور. عروض حية للصناعة.",
    price: 0, dur: 120, su: ["family", "kids", "outdoor", "evening"], act: "go",
    tm: SESSION(1.2, 240), com: ["craft", "market", "families"], nov: 0.75, pop: 0.7,
    fx: [["الموعد", "الليلة حتى منتصف الليل", "provider", 0.3, "F2"], ["الدخول", "مجاني", "provider", 1, "F3"]] },
  { id: "e-family-night", n: "ليلة العائلة في النسيم", t: "أنشطة وألعاب ومأكولات", nb: "naseem", cat: "family", sc: "kids",
    ab: "فعالية عائلية في حديقة الحي: ألعاب للأطفال، عربات طعام، وركن للأسر.",
    price: 0, dur: 180, su: ["family", "kids", "outdoor", "evening"], act: "go",
    tm: SESSION(1.8, 180), com: ["families", "naseem"], nov: 0.6, pop: 0.78,
    fx: [["الموعد", "الليلة ٨:٠٠ م — ١١:٠٠ م", "provider", 0.4, "F2"], ["المواقف", "مواقف الحديقة تمتلئ مبكرًا", "community", 0.5, "F2"]] },
  { id: "e-student-fair", n: "ملتقى الأندية الطلابية", t: "تعرّف على أندية الجامعة", nb: "awali", cat: "learn", pr: "uqu", sc: "hall",
    ab: "ملتقى تعريفي بأندية الجامعة وبرامجها، مع تسجيل مباشر في الأندية.",
    price: 0, dur: 240, su: ["students", "indoor", "arabic"], act: "register", out: "الجامعة",
    tm: SESSION(20, 240), com: ["learn", "students"], nov: 0.65, pop: 0.6, cap: 400, joined: 186,
    fx: [["الموعد", "غدًا من ١٠ ص", "provider", 1, "F2"], ["الحضور", "لطلاب وطالبات الجامعة", "provider", 1, "F3"]] },
  { id: "e-volunteer-day", n: "يوم تطوعي: خدمة الزوار", t: "إرشاد وسقيا في محيط الحرم", nb: "haram-area", cat: "volunteer", pr: "vol-hadiyah", sc: "volunteer",
    ab: "فرصة تطوعية منظّمة لخدمة الزوار: إرشاد، توزيع ماء، ومساعدة كبار السن. تدريب قصير قبل الوردية.",
    price: 0, dur: 240, su: ["solo", "beginners", "noexp", "arabic"], act: "register", out: "الجهة المنظّمة",
    tm: SESSION(38, 240), com: ["volunteer"], nov: 0.7, pop: 0.65, cap: 60, joined: 41,
    fx: [["الوردية", "بعد غد — ٤ ساعات", "provider", 1, "F2"], ["الشروط", "تسجيل مسبق وحضور تدريب قصير", "official", 2, "F3"], ["العمر", "١٨ سنة فأكثر", "official", 2, "F3"]] },
  { id: "e-book-fair", n: "معرض الكتاب المصاحب", t: "دور نشر محلية وجلسات توقيع", nb: "zahir", cat: "learn", sc: "library",
    ab: "معرض كتاب مصاحب لبرنامج ثقافي، يضم دور نشر محلية وجلسات توقيع.",
    price: 0, dur: 300, su: ["family", "students", "indoor"], act: "go",
    tm: WINDOW(-1, 4), com: ["learn", "culture"], nov: 0.6, pop: 0.55,
    fx: [["الفترة", "مستمر حتى نهاية الأسبوع", "provider", 1, "F2"], ["الدخول", "مجاني", "provider", 1, "F3"]] },
  { id: "e-sport-run", n: "جري مكة — النسخة المسائية", t: "٥ كم في مسار مغلق", nb: "bathaquraish", cat: "sport", sc: "sport",
    ab: "فعالية جري ٥ كم في مسار مغلق، فئات للمبتدئين وللمتقدمين.",
    price: 30, dur: 120, su: ["solo", "beginners", "outdoor", "evening"], act: "register", out: "منصة التسجيل",
    tm: SESSION(74, 120), com: ["sport"], nov: 0.65, pop: 0.6, cap: 300, joined: 212,
    fx: [["الموعد", "بعد ثلاثة أيام — ٧:٠٠ م", "provider", 2, "F2"], ["الفئات", "٥ كم — مبتدئ ومتقدم", "provider", 2, "F3"]] },
  { id: "e-heritage-night", n: "ليلة التراث في جرول", t: "حرف وعروض وأكل قديم", nb: "jarwal", cat: "heritage", sc: "market",
    ab: "أمسية تراثية في حي جرول: عروض حرفية، أكل مكي قديم، وجلسات حكواتي.",
    price: 0, dur: 210, su: ["family", "kids", "outdoor", "evening"], act: "go",
    tm: SESSION(50, 210), com: ["culture", "jarwal", "families"], nov: 0.8, pop: 0.68,
    fx: [["الموعد", "بعد يومين — ٧:٣٠ م", "provider", 1, "F2"]] },
  { id: "e-past-expo", n: "معرض الحرف السابق", t: "انتهى — يُعرض في الأرشيف", nb: "shawqiyah", cat: "craft", sc: "workshop",
    ab: "معرض حرفي أُقيم الأسبوع الماضي. يظهر هنا كسجل، ولم يعد ضمن ما هو متاح الآن.",
    price: 0, dur: 180, su: ["family"], act: "go", tm: SESSION(-96, 180), com: ["craft"], nov: 0.3, pop: 0.3,
    fx: [["الحالة", "انتهى", "provider", 4, "F0"]] },
  { id: "e-past-lecture", n: "محاضرة: تاريخ الأسواق", t: "انتهت — متاح ملخصها في المجتمع", nb: "shawqiyah", cat: "culture", sc: "hall",
    ab: "محاضرة أُقيمت قبل أيام عن تاريخ أسواق مكة. النقاش استمر بعدها في المجتمع.",
    price: 0, dur: 90, su: ["solo", "arabic"], act: "go", tm: SESSION(-52, 90), com: ["culture", "market"], nov: 0.3, pop: 0.35,
    fx: [["الحالة", "انتهت", "provider", 2, "F0"]] },
];

const ACTIVITIES = [
  { id: "a-calligraphy-friday", n: "ورشة خط للمبتدئين — الجمعة", t: "مجموعة صغيرة · لا تحتاج خبرة", nb: "zahir", cat: "craft", pr: "craft-khatt", sc: "workshop",
    ab: "جلسة خط عربي للمبتدئين مساء الجمعة. مجموعة صغيرة، ومناسبة للحضور منفردًا.",
    price: 90, dur: 120, su: ["beginners", "noexp", "small", "solo", "arabic", "evening"], act: "join",
    tm: SESSION(25.5, 120), com: ["craft", "learn"], nov: 0.8, pop: 0.6, cap: 12, joined: 7,
    fx: [["الموعد", "الجمعة ٦:٠٠ م", "provider", 1, "F2"], ["المجموعة", "١٢ مقعدًا", "provider", 1, "F2"], ["الخبرة", "غير مطلوبة", "provider", 3, "F4"]] },
  { id: "a-neighborhood-cleanup", n: "مبادرة تنظيف الحي", t: "ساعتان مع أهل الحي", nb: "awali", cat: "volunteer", pr: "vol-hayy", sc: "volunteer",
    ab: "مبادرة تنظيف وتشجير ينظّمها سكان الحي. الأدوات متوفرة، والمشاركة مفتوحة للعائلات.",
    price: 0, dur: 120, su: ["family", "beginners", "outdoor", "noexp"], act: "join",
    tm: SESSION(39, 120), com: ["volunteer", "awali"], nov: 0.7, pop: 0.45, cap: 40, joined: 18,
    fx: [["الموعد", "بعد غد ٥:٠٠ م", "provider", 1, "F2"], ["الأدوات", "توفّرها المبادرة", "provider", 2, "F4"]] },
  { id: "a-kids-reading", n: "ركن القراءة للأطفال", t: "جلسة قصص أسبوعية", nb: "shisha", cat: "family", pr: "makkah-lib", sc: "library",
    ab: "جلسة قصص تفاعلية للأطفال من ٤ إلى ٩ سنوات، بحضور ولي الأمر.",
    price: 0, dur: 60, su: ["kids", "family", "indoor", "arabic"], act: "join",
    tm: WEEKLY(6, 11), com: ["families", "learn"], nov: 0.6, pop: 0.5, cap: 25, joined: 14,
    fx: [["العمر", "٤ — ٩ سنوات", "provider", 9, "F4"], ["الحضور", "مع ولي الأمر", "provider", 9, "F4"]] },
  { id: "a-women-walk", n: "مشي مسائي — مجموعة نسائية", t: "مسار آمن ومضاء", nb: "naseem", cat: "sport", pr: "club-mashy", sc: "garden",
    ab: "مجموعة مشي نسائية أسبوعية في مسار مضاء داخل الحي، بوتيرة هادئة تناسب المبتدئات.",
    price: 0, dur: 60, su: ["women", "beginners", "outdoor", "evening", "small"], act: "join",
    tm: WEEKLY(0, 19), com: ["sport", "naseem"], nov: 0.7, pop: 0.5, cap: 30, joined: 17,
    fx: [["المسار", "نحو ٣ كم في مسار مضاء", "provider", 7, "F4"], ["الخصوصية", "قائمة المشاركات غير معلنة", "provider", 7, "F4"]] },
  { id: "a-student-study", n: "مجموعة مذاكرة — أم القرى", t: "جلسات مذاكرة جماعية", nb: "awali", cat: "learn", pr: "uqu", sc: "library",
    ab: "جلسات مذاكرة جماعية للطلاب قبل الاختبارات، بتنظيم بسيط ومقاعد محدودة.",
    price: 0, dur: 180, su: ["students", "quiet", "arabic"], act: "join",
    tm: WEEKLY(2, 18), com: ["learn", "students"], nov: 0.55, pop: 0.55, cap: 35, joined: 21,
    fx: [["المقاعد", "٣٥ مقعدًا", "provider", 4, "F3"]] },
  { id: "a-food-tour", n: "مسار الأكل المكي", t: "أربع محطات في مشية واحدة", nb: "misfalah", cat: "food", pr: "walk-makkah", sc: "food",
    ab: "جولة ذوق بين أربع محطات أكل في الحي القديم، مع شرح عن أصل كل طبق.",
    price: 110, dur: 120, su: ["small", "firsttime", "evening", "bilingual"], act: "join",
    tm: WEEKLY(4, 19), com: ["food", "culture", "misfalah"], nov: 0.85, pop: 0.6, cap: 12, joined: 8,
    fx: [["المحطات", "أربع محطات مشيًا", "provider", 6, "F4"], ["ما يشمله", "الأطباق مشمولة في الرسوم", "provider", 6, "F4"]] },
  { id: "a-beginner-photo", n: "أساسيات التصوير بالجوال", t: "جلسة عملية قصيرة", nb: "zahir", cat: "craft", pr: "club-photo", sc: "workshop",
    ab: "جلسة عملية لأساسيات التصوير بالجوال، تنتهي بتطبيق ميداني قصير.",
    price: 0, dur: 90, su: ["beginners", "noexp", "solo", "small", "arabic"], act: "join",
    tm: WEEKLY(3, 19), com: ["craft", "learn"], nov: 0.75, pop: 0.45, cap: 18, joined: 9,
    fx: [["الأدوات", "جوالك يكفي", "provider", 5, "F4"]] },
  { id: "a-iftar-service", n: "وردية سقيا وإفطار", t: "خدمة زوار بتنظيم رسمي", nb: "haram-area", cat: "volunteer", pr: "vol-hadiyah", sc: "volunteer",
    ab: "وردية تطوعية لتوزيع الماء والوجبات على الزوار ضمن تنظيم الجهة المشرفة.",
    price: 0, dur: 180, su: ["beginners", "noexp", "arabic"], act: "register", out: "منصة التطوع",
    tm: WEEKLY(5, 16), com: ["volunteer"], nov: 0.6, pop: 0.6, cap: 80, joined: 52,
    fx: [["التسجيل", "عبر المنصة الرسمية للجهة", "official", 3, "F3"], ["العمر", "١٨ سنة فأكثر", "official", 3, "F3"]] },
];

const RECURRING = [
  { id: "g-walk-club", n: "نادي مشي مكة", t: "كل ثلاثاء — مسار مختلف", nb: "naseem", cat: "sport", pr: "club-mashy", sc: "garden",
    ab: "نادي مشي أسبوعي يغيّر مساره كل أسبوع داخل المدينة. مفتوح للمبتدئين، ولا يحتاج تسجيل مسبق.",
    price: 0, dur: 75, su: ["beginners", "solo", "outdoor", "evening"], act: "join", tm: WEEKLY(2, 19, 30),
    com: ["sport", "living"], nov: 0.55, pop: 0.6, members: 240, state: "active",
    fx: [["الموعد", "كل ثلاثاء ٧:٣٠ م", "provider", 6, "F3"], ["المستوى", "مبتدئ فأعلى", "provider", 20, "F4"]] },
  { id: "g-book-club", n: "نادي قراءة الزاهر", t: "لقاء شهري حول كتاب", nb: "zahir", cat: "learn", pr: "club-qira", sc: "library",
    ab: "نادي قراءة شهري يناقش كتابًا واحدًا. الحضور مفتوح، والكتاب يُعلن قبل أسبوعين.",
    price: 0, dur: 120, su: ["solo", "quiet", "arabic", "evening"], act: "join", tm: WEEKLY(1, 20),
    com: ["learn", "culture"], nov: 0.7, pop: 0.45, members: 96, state: "active",
    fx: [["الموعد", "أول اثنين من كل شهر", "provider", 12, "F3"]] },
  { id: "g-photo-club", n: "نادي تصوير مكة", t: "جولة كل أربعاء ومراجعة أعمال", nb: "zahir", cat: "craft", pr: "club-photo", sc: "skyline",
    ab: "نادي تصوير ينظّم جولة أسبوعية ومراجعة شهرية للأعمال. يقبل المبتدئين.",
    price: 0, dur: 120, su: ["beginners", "solo", "small", "outdoor"], act: "join", tm: WEEKLY(3, 17, 30),
    com: ["craft"], nov: 0.75, pop: 0.5, members: 132, state: "active",
    fx: [["الموعد", "كل أربعاء قبل الغروب", "provider", 8, "F3"]] },
  { id: "g-family-picnic", n: "لقاء العائلات — حديقة النسيم", t: "كل جمعة صباحًا", nb: "naseem", cat: "family", sc: "kids",
    ab: "لقاء أسبوعي لعائلات الحي في الحديقة، أنشطة بسيطة للأطفال وترتيب تطوعي من الأهالي.",
    price: 0, dur: 120, su: ["family", "kids", "outdoor"], act: "join", tm: WEEKLY(5, 8),
    com: ["families", "naseem"], nov: 0.6, pop: 0.55, members: 180, state: "active",
    fx: [["الموعد", "كل جمعة ٨:٠٠ ص", "provider", 10, "F3"]] },
  { id: "g-craft-circle", n: "حلقة الحرفيين", t: "لقاء نصف شهري", nb: "shawqiyah", cat: "craft", pr: "craft-sadu", sc: "workshop",
    ab: "حلقة تجمع حرفيين وهواة لتبادل المهارات وعرض الأعمال.",
    price: 0, dur: 150, su: ["small", "arabic"], act: "join", tm: WEEKLY(6, 17),
    com: ["craft"], nov: 0.8, pop: 0.4, members: 64, state: "active",
    fx: [["الموعد", "كل سبتين", "provider", 26, "F3"]] },
  { id: "g-dormant-club", n: "نادي الدراجات — الشوقية", t: "متوقف مؤقتًا", nb: "shawqiyah", cat: "sport", sc: "sport",
    ab: "نادي دراجات توقّف نشاطه منذ أشهر. يظهر هنا كسجل، ولا يُرشَّح كمجموعة نشطة.",
    price: 0, dur: 90, su: ["outdoor"], act: "join", tm: WEEKLY(4, 17),
    com: ["sport"], nov: 0.2, pop: 0.15, members: 41, state: "dormant", lastActivityDays: 168,
    fx: [["آخر نشاط", "قبل أكثر من خمسة أشهر", "community", 168, "F3"]] },
];

const OFFERS = [
  { id: "o-sufrah-family", n: "عرض العشاء العائلي", t: "خصم على الطبق الثاني", nb: "awali", cat: "food", pr: "eat-sufrah", sc: "food", linked: "r-sufrah",
    ab: "عرض من المطعم على الطبق الثاني ضمن الطلب العائلي، داخل الفرع فقط.", price: null, dur: null,
    su: ["family", "evening"], act: "redeem", out: "المطعم", tm: WINDOW(-2, 0.5), com: ["food", "awali"], nov: 0.4, pop: 0.6,
    fx: [["ينتهي", "الليلة", "provider", 0.3, "F0"], ["الفرع", "فرع العوالي فقط", "provider", 2, "F3"], ["الشروط", "لا يجمع مع عروض أخرى", "provider", 2, "F3"]] },
  { id: "o-cafe-morning", n: "قهوة الصباح", t: "سعر خاص قبل ١٠ ص", nb: "aziziyah", cat: "cafe", sc: "cafe", linked: "c-specialty",
    ab: "سعر خاص على مشروبات التقطير في الفترة الصباحية.", act: "redeem", out: "المقهى",
    tm: WINDOW(-5, 12), com: ["food"], nov: 0.45, pop: 0.5,
    fx: [["الفترة", "يوميًا قبل ١٠ ص", "provider", 5, "F3"], ["ينتهي", "بعد أسبوعين", "provider", 5, "F0"]] },
  { id: "o-museum-family", n: "تذكرة عائلية", t: "سعر مجموعة لأربعة أفراد", nb: "haram-area", cat: "culture", sc: "museum", linked: "clock-museum",
    ab: "سعر مخفّض للتذكرة العائلية عند الحجز المسبق عبر المشغّل.", act: "redeem", out: "منصة التذاكر",
    tm: WINDOW(-9, 20), com: ["visitors", "families"], nov: 0.5, pop: 0.55,
    fx: [["الشروط", "الحجز المسبق مطلوب", "provider", 9, "F3"], ["ينتهي", "نهاية الشهر", "provider", 9, "F0"]] },
  { id: "o-craft-workshop", n: "مقعدان بسعر واحد", t: "ورشة الخط — الجمعة", nb: "zahir", cat: "craft", pr: "craft-khatt", sc: "workshop", linked: "a-calligraphy-friday",
    ab: "عرض تشجيعي على حجز مقعدين في ورشة الخط للمبتدئين.", act: "redeem", out: "الورشة",
    tm: WINDOW(-1, 5), com: ["craft"], nov: 0.6, pop: 0.45,
    fx: [["الشروط", "على جلسة الجمعة فقط", "provider", 1, "F3"], ["ينتهي", "بعد خمسة أيام", "provider", 1, "F0"]] },
  { id: "o-expired-grill", n: "عرض المشاوي — انتهى", t: "انتهت صلاحيته", nb: "bathaquraish", cat: "food", sc: "food", linked: "r-grill",
    ab: "عرض مسائي انتهت صلاحيته. يظهر في السجل فقط ولا يُعرض ضمن العروض السارية.",
    act: "redeem", out: "المطعم", tm: WINDOW(-20, -3), com: ["food"], nov: 0.2, pop: 0.3,
    fx: [["الحالة", "منتهٍ", "provider", 3, "F0"]] },
  { id: "o-sweets", n: "خصم الحلويات بعد العشاء", t: "من ١٠ م حتى الإغلاق", nb: "jarwal", cat: "food", sc: "food", linked: "r-sweets",
    ab: "خصم مسائي على الحلويات المكية في الفترة المتأخرة.", act: "redeem", out: "المحل",
    tm: WINDOW(-3, 9), com: ["food", "jarwal"], nov: 0.5, pop: 0.5,
    fx: [["الفترة", "من ١٠ م حتى الإغلاق", "provider", 3, "F3"], ["ينتهي", "بعد تسعة أيام", "provider", 3, "F0"]] },
  { id: "o-bus-tour", n: "تذكرة الحافلة — سعر مخفّض", t: "الجولة المسائية", nb: "haram-area", cat: "heritage", sc: "skyline", linked: "x-bus",
    ab: "سعر مخفّض على الجولة المسائية بحافلة المعالم عند الحجز عبر المشغّل.", act: "redeem", out: "مشغّل الجولة",
    tm: WINDOW(-6, 14), com: ["visitors"], nov: 0.45, pop: 0.6,
    fx: [["الشروط", "الجولة المسائية فقط", "provider", 6, "F3"], ["ينتهي", "بعد أسبوعين", "provider", 6, "F0"]] },
];

const SERVICES = [
  { id: "s-guide-saeed", n: "سعيد — مرشد محلي", t: "جولات تاريخية بالعربية والإنجليزية", nb: "misfalah", cat: "services", pr: "guide-saeed", sc: "alley",
    ab: "مرشد محلي ينظّم جولات تاريخية في المدينة. يعرض ترخيصه ومجال عمله بوضوح قبل الحجز.",
    price: 250, dur: 180, su: ["small", "bilingual", "firsttime"], act: "contact", out: "المرشد",
    tm: HOURS(8, 22), com: ["visitors", "culture"], nov: 0.6, pop: 0.5,
    fx: [["الترخيص", "رقم ترخيص معروض لدى الجهة المختصة", "official", 22, "F3"], ["اللغات", "العربية والإنجليزية", "provider", 22, "F4"], ["المدة", "٣ ساعات", "provider", 22, "F4"]] },
  { id: "s-guide-noura", n: "نورة — مرشدة محلية", t: "جولات للعائلات والمجموعات النسائية", nb: "zahir", cat: "services", pr: "guide-noura", sc: "museum",
    ab: "مرشدة محلية متخصصة في الجولات العائلية والمجموعات النسائية داخل المدينة.",
    price: 220, dur: 150, su: ["family", "women", "small", "arabic"], act: "contact", out: "المرشدة",
    tm: HOURS(9, 21), com: ["visitors", "families"], nov: 0.7, pop: 0.45,
    fx: [["الترخيص", "رقم ترخيص معروض لدى الجهة المختصة", "official", 18, "F3"], ["المدة", "ساعتان ونصف", "provider", 18, "F4"]] },
  { id: "s-transport", n: "نقل مرخّص داخل مكة", t: "توصيل وجولات بسائق", nb: "haram-area", cat: "services", pr: "svc-transport", sc: "skyline",
    ab: "خدمة نقل مرخّصة للتنقل داخل المدينة وللجولات المجدولة.",
    price: 120, dur: null, su: ["family", "accessible"], act: "contact", out: "مزوّد الخدمة",
    tm: HOURS(0, 24), com: ["visitors", "living"], nov: 0.3, pop: 0.6,
    fx: [["الترخيص", "نشاط نقل مرخّص", "official", 40, "F3"], ["الكراسي المتحركة", "مركبات مجهّزة عند الطلب المسبق", "provider", 40, "F3"]] },
  { id: "s-wheelchair", n: "تأجير كرسي متحرك", t: "توصيل إلى مكان الإقامة", nb: "ajyad", cat: "services", sc: "stay",
    ab: "خدمة تأجير كراسٍ متحركة مع توصيل إلى مكان الإقامة داخل المدينة.",
    price: 80, dur: null, su: ["accessible", "family"], act: "contact", out: "مزوّد الخدمة",
    tm: HOURS(6, 23), com: ["living", "visitors"], nov: 0.6, pop: 0.45,
    fx: [["التوصيل", "داخل مكة", "provider", 15, "F3"], ["المدة", "يومي أو أسبوعي", "provider", 15, "F3"]] },
  { id: "s-babysit", n: "رعاية أطفال أثناء الفعاليات", t: "ركن مشرف عليه", nb: "naseem", cat: "services", sc: "kids",
    ab: "ركن رعاية أطفال مشرف عليه أثناء بعض الفعاليات، بحجز مسبق ومقاعد محدودة.",
    price: 60, dur: 120, su: ["kids", "family"], act: "contact", out: "مزوّد الخدمة",
    tm: HOURS(16, 23), com: ["families"], nov: 0.75, pop: 0.35,
    fx: [["الحجز", "مسبق — الأماكن محدودة", "provider", 12, "F3"], ["العمر", "٣ — ١٠ سنوات", "provider", 12, "F4"]] },
  { id: "s-luggage", n: "حفظ أمتعة", t: "قرب محيط الحرم", nb: "ajyad", cat: "services", sc: "stay",
    ab: "خدمة حفظ أمتعة بالساعة أو اليوم قرب محيط الحرم.",
    price: 25, dur: null, su: ["solo", "short"], act: "contact", out: "مزوّد الخدمة",
    tm: HOURS(0, 24), com: ["visitors"], nov: 0.4, pop: 0.5,
    fx: [["التسعير", "بالساعة أو اليوم", "provider", 20, "F3"]] },
];

const STAYS = [
  { id: "st-ajyad", n: "إقامة أجياد — قريب من الحرم", t: "مشي قصير لكنه صاعد", nb: "ajyad", cat: "stay", sc: "stay",
    ab: "مكان إقامة قريب من الحرم بالمسافة، لكن الطريق صاعد في جزء منه. المسافة على الخريطة لا تصف الجهد الفعلي.",
    price: 420, dur: null, su: ["family", "firsttime"], act: "book", out: "منصة الحجز", tm: HOURS(0, 24), com: ["visitors"], nov: 0.3, pop: 0.8,
    fx: [["المسافة", "نحو ٤٠٠ م إلى أقرب باب", "provider", 25, "F3"],
         ["الطريق", "منحدر صاعد في جزء من المسار — مرهق للكراسي المتحركة", "community", 4, "F3"],
         ["النقل", "خدمة نقل داخلية في أوقات الصلوات", "provider", 25, "F3"]] },
  { id: "st-aziziyah", n: "شقق العزيزية المخدومة", t: "أوسع للعائلات مع نقل", nb: "aziziyah", cat: "stay", sc: "stay",
    ab: "شقق مخدومة أوسع للعائلات مع خدمة نقل مجدولة إلى محيط الحرم.",
    price: 300, dur: null, su: ["family", "kids", "accessible"], act: "book", out: "منصة الحجز", tm: HOURS(0, 24), com: ["visitors", "families"], nov: 0.45, pop: 0.6,
    fx: [["النقل", "رحلات مجدولة إلى محيط الحرم", "provider", 17, "F3"], ["الوصول", "مصعد ومدخل بدون درج", "provider", 17, "F4"]] },
  { id: "st-misfalah", n: "نزل المسفلة", t: "اقتصادي وقريب من الأكل المحلي", nb: "misfalah", cat: "stay", sc: "stay",
    ab: "نزل اقتصادي في حي قديم، قريب من مطاعم محلية وأسواق يومية.",
    price: 180, dur: null, su: ["solo", "short"], act: "book", out: "منصة الحجز", tm: HOURS(0, 24), com: ["visitors"], nov: 0.55, pop: 0.45,
    fx: [["الوصول", "درج عند المدخل الرئيسي", "community", 9, "F4"]] },
];

/* More of the city — breadth matters: browsing for several minutes should not
   loop back to the same dozen objects. */
const MORE = [
  { id: "p-park-naseem", n: "حديقة النسيم", t: "مساحة خضراء ومسار مشي", nb: "naseem", cat: "family", sc: "garden", price: 0, dur: 60,
    ab: "حديقة حي واسعة فيها مسار مشي وألعاب أطفال، أنشط بعد المغرب.", su: ["family", "kids", "outdoor", "evening"], act: "go", tm: HOURS(6, 0), com: ["families", "naseem"], nov: 0.5, pop: 0.6,
    fx: [["الازدحام", "مرتفع في نهاية الأسبوع", "community", 3, "F2"], ["الدخول", "مجاني", "provider", 40, "F4"]] },
  { id: "p-park-awali", n: "متنزه العوالي", t: "جلسات عائلية ومسار مضاء", nb: "awali", cat: "family", sc: "garden", price: 0, dur: 60,
    ab: "متنزه بمسار مضاء وجلسات عائلية، مناسب لنزهة قصيرة بعد العشاء.", su: ["family", "outdoor", "evening"], act: "go", tm: HOURS(6, 1), com: ["families", "awali"], nov: 0.55, pop: 0.55,
    fx: [["الإنارة", "المسار مضاء بالكامل", "community", 12, "F4"]] },
  { id: "p-view-jabal", n: "مطل مكة الشمالي", t: "إطلالة على المدينة قبل الغروب", nb: "shisha", cat: "nature", sc: "mountain", price: 0, dur: 45,
    ab: "نقطة إطلالة مرتفعة تُظهر امتداد المدينة. أفضل وقت قبل الغروب بنصف ساعة.", su: ["outdoor", "solo", "evening", "short"], act: "go", tm: HOURS(5, 23), com: ["culture", "sport"], nov: 0.85, pop: 0.4,
    fx: [["الوصول", "طريق صاعد — مركبة مناسبة", "community", 15, "F4"]] },
  { id: "p-souq-shawqiyah", n: "سوق الشوقية الشعبي", t: "خضار وتمور وبهارات", nb: "shawqiyah", cat: "market", sc: "market", price: null, dur: 45,
    ab: "سوق يومي للخضار والتمور والبهارات، أسعاره أفضل في الصباح.", su: ["family", "outdoor"], act: "go", tm: HOURS(6, 22), com: ["market", "shawqiyah"], nov: 0.5, pop: 0.6,
    fx: [["أفضل وقت", "الصباح للخضار، والمساء للحركة", "community", 6, "F3"]] },
  { id: "p-souq-gold", n: "سوق الذهب — جرول", t: "محلات صياغة قديمة", nb: "jarwal", cat: "market", sc: "market", price: null, dur: 40,
    ab: "صف من محلات الصياغة القديمة، أغلبها يفتح بعد العصر.", su: ["evening"], act: "go", tm: HOURS(10, 23), com: ["market", "jarwal"], nov: 0.6, pop: 0.45,
    fx: [["الدوام", "فترتان — راجع المحل قبل الزيارة", "community", 9, "F3"]] },
  { id: "p-souq-perfume", n: "سوق العطارة", t: "بخور وعطور ومواد تقليدية", nb: "misfalah", cat: "market", sc: "market", price: null, dur: 40,
    ab: "سوق صغير للبخور والعطور والمواد التقليدية، تجد فيه خلطات محلية.", su: ["family", "evening"], act: "go", tm: HOURS(9, 0), com: ["market", "misfalah"], nov: 0.7, pop: 0.5,
    fx: [["الأسعار", "تفاوض معتاد في أغلب المحلات", "community", 11, "F4"]] },
  { id: "p-heritage-house", n: "بيت مكي مُرمَّم", t: "عمارة الروشان عن قرب", nb: "jarwal", cat: "heritage", sc: "alley", price: 20, dur: 50,
    ab: "بيت قديم مُعاد ترميمه يعرض تفاصيل الروشان والعمارة المكية التقليدية.", su: ["family", "firsttime", "indoor"], act: "go", tm: HOURS(10, 21), com: ["culture", "jarwal"], nov: 0.9, pop: 0.4,
    fx: [["الوصول", "درج داخلي بين الطوابق", "community", 20, "F4"], ["التذكرة", "رمزية عند الباب", "provider", 20, "F3"]] },
  { id: "p-gallery", n: "معرض فني — الزاهر", t: "أعمال فنانين محليين", nb: "zahir", cat: "culture", sc: "museum", price: 0, dur: 45,
    ab: "معرض صغير يعرض أعمال فنانين من مكة، يتغير محتواه كل شهرين تقريبًا.", su: ["solo", "quiet", "indoor"], act: "go", tm: HOURS(16, 22), com: ["culture", "craft"], nov: 0.85, pop: 0.35,
    fx: [["المعرض الحالي", "يتغير دوريًا", "provider", 30, "F3"]] },
  { id: "p-sports-hall", n: "صالة الحي الرياضية", t: "ملاعب وحصص مسائية", nb: "rusayfah", cat: "sport", sc: "sport", price: 40, dur: 60,
    ab: "صالة حي فيها ملاعب وحصص مسائية، الحجز بالساعة للمجموعات.", su: ["solo", "indoor", "evening"], act: "book", out: "الصالة", tm: HOURS(15, 0), com: ["sport", "rusayfah"], nov: 0.5, pop: 0.5,
    fx: [["الحجز", "بالساعة — يفضّل مسبقًا", "provider", 14, "F3"]] },
  { id: "p-track", n: "مسار المشي — بطحاء قريش", t: "٣ كم مضاءة", nb: "bathaquraish", cat: "sport", sc: "garden", price: 0, dur: 45,
    ab: "مسار مشي مضاء بطول ٣ كم مع نقاط مياه على الطريق.", su: ["outdoor", "solo", "evening", "beginners"], act: "go", tm: HOURS(5, 1), com: ["sport"], nov: 0.55, pop: 0.55,
    fx: [["الطول", "٣ كم", "provider", 60, "F4"], ["نقاط المياه", "ثلاث نقاط على المسار", "community", 14, "F4"]] },
  { id: "p-mall-kakiyah", n: "مركز تسوق الكعكية", t: "تسوق ومطاعم تحت سقف واحد", nb: "kakiyah", cat: "market", sc: "market", price: null, dur: 90,
    ab: "مركز تسوق فيه محلات ومطاعم وركن ألعاب، خيار عملي في الأيام الحارة.", su: ["family", "kids", "indoor", "accessible"], act: "go", tm: HOURS(9, 0), com: ["market", "families"], nov: 0.3, pop: 0.7,
    fx: [["الوصول", "مصاعد ومنحدرات", "provider", 45, "F4"]] },
  { id: "p-datemarket", n: "سوق التمور", t: "أصناف محلية ومذاق مختلف", nb: "shisha", cat: "market", sc: "market", price: null, dur: 35,
    ab: "سوق مخصص للتمور بأصناف محلية، البائعون يسمحون بالتذوق قبل الشراء.", su: ["family", "short"], act: "go", tm: HOURS(7, 23), com: ["market", "food"], nov: 0.7, pop: 0.5,
    fx: [["التذوق", "متاح قبل الشراء", "community", 8, "F4"]] },
  { id: "p-plaza", n: "ساحة الحي — الهجرة", t: "ساحة مفتوحة للفعاليات", nb: "hijrah", cat: "family", sc: "garden", price: 0, dur: 40,
    ab: "ساحة مفتوحة تستضيف فعاليات الحي الموسمية وجلسات مسائية.", su: ["family", "outdoor", "evening"], act: "go", tm: HOURS(16, 1), com: ["hijrah", "families"], nov: 0.6, pop: 0.45, fx: [] },
  { id: "p-clinicwalk", n: "ممشى المستشفى — التنعيم", t: "ممشى قصير ومظلل", nb: "tanim", cat: "sport", sc: "garden", price: 0, dur: 30,
    ab: "ممشى قصير مظلل مناسب لكبار السن ولمن يبحث عن مسار قريب وسهل.", su: ["accessible", "stepfree", "quiet", "short"], act: "go", tm: HOURS(5, 23), com: ["living", "sport"], nov: 0.65, pop: 0.3,
    fx: [["الأرضية", "ممهّدة بالكامل", "community", 16, "F4"]] },

  { id: "r-hijazi-awali", n: "مطبخ الحجاز — العوالي", t: "أطباق بيتية بأسعار معقولة", nb: "awali", cat: "food", sc: "food", price: 42, dur: 50,
    ab: "مطبخ صغير يقدّم أطباقًا بيتية يومية، الطلب الخارجي أسرع من الجلوس.", su: ["solo", "family"], act: "go", tm: HOURS(11, 23), com: ["food", "awali"], nov: 0.6, pop: 0.5,
    fx: [["الدوام", "١١ ص — ١١ م", "provider", 14, "F3"]] },
  { id: "r-yemeni", n: "مطعم يمني — الششة", t: "فحسة ومندي", nb: "shisha", cat: "food", sc: "food", price: 48, dur: 55,
    ab: "مطعم يمني معروف في الحي، الفحسة والمندي أكثر ما يُطلب.", su: ["family", "seated"], act: "go", tm: HOURS(11, 1), com: ["food"], nov: 0.45, pop: 0.65, fx: [["الدوام", "١١ ص — ١ ص", "provider", 12, "F3"]] },
  { id: "r-turkish", n: "مطبخ تركي — العزيزية", t: "مشاوي وحساء", nb: "aziziyah", cat: "food", sc: "food", price: 58, dur: 55,
    ab: "مطبخ تركي بقائمة مشاوٍ وحساء، جلسات داخلية مريحة.", su: ["family", "seated"], act: "go", tm: HOURS(12, 1), com: ["food"], nov: 0.5, pop: 0.55, fx: [["الدوام", "١٢ ظهرًا — ١ ص", "provider", 10, "F3"]] },
  { id: "r-indian-veg", n: "نباتي هندي — الرصيفة", t: "ثالي وأطباق خفيفة", nb: "rusayfah", cat: "food", sc: "food", price: 32, dur: 40,
    ab: "مطبخ هندي نباتي بأسعار مناسبة وحصص كبيرة.", su: ["solo", "family"], act: "go", tm: HOURS(11, 23), com: ["food"], nov: 0.7, pop: 0.4, fx: [["الدوام", "١١ ص — ١١ م", "provider", 18, "F3"]] },
  { id: "r-burger", n: "برجر الحي — النسيم", t: "وجبات سريعة للعائلات", nb: "naseem", cat: "food", sc: "food", price: 35, dur: 30,
    ab: "مطعم برجر محلي بخيارات للأطفال وجلسات خارجية.", su: ["kids", "family", "short"], act: "go", tm: HOURS(13, 2), com: ["food", "families"], nov: 0.4, pop: 0.6, fx: [["الدوام", "١ ظهرًا — ٢ ص", "provider", 7, "F3"]] },
  { id: "r-soup", n: "شوربة وسلطات — جرول", t: "خيار خفيف مسائي", nb: "jarwal", cat: "food", sc: "food", price: 26, dur: 30,
    ab: "قائمة شوربات وسلطات، مناسب لوجبة خفيفة بعد المغرب.", su: ["solo", "short", "quiet"], act: "go", tm: HOURS(16, 0), com: ["food"], nov: 0.75, pop: 0.35, fx: [["الدوام", "٤ م — ١٢ ص", "provider", 13, "F3"]] },
  { id: "r-fish-fry", n: "سمك مقلي — الكعكية", t: "طلبات سفري سريعة", nb: "kakiyah", cat: "food", sc: "food", price: 45, dur: 25,
    ab: "محل سمك مقلي، أغلب الطلبات سفري ولا توجد جلسات داخلية.", su: ["short", "solo"], act: "go", tm: HOURS(12, 0), com: ["food"], nov: 0.6, pop: 0.45, fx: [["الجلوس", "لا توجد جلسات", "provider", 9, "F4"]] },
  { id: "r-kabsa-family", n: "كبسة البيت — الهجرة", t: "طلبات عائلية كبيرة", nb: "hijrah", cat: "food", sc: "food", price: 120, dur: 60,
    ab: "مطبخ متخصص بالطلبات العائلية الكبيرة، يحتاج طلبًا مسبقًا.", su: ["family"], act: "contact", out: "المطبخ", tm: HOURS(10, 22), com: ["food", "hijrah"], nov: 0.65, pop: 0.45,
    fx: [["الطلب", "مسبق قبل ٣ ساعات", "provider", 11, "F3"]] },
  { id: "r-breakfast-tanim", n: "فطور التنعيم", t: "فول وتميس من الفجر", nb: "tanim", cat: "food", sc: "food", price: 20, dur: 30,
    ab: "مطعم فطور شعبي يفتح من الفجر ويغلق ظهرًا.", su: ["short", "solo", "family"], act: "go", tm: HOURS(4, 12), com: ["food"], nov: 0.5, pop: 0.5, fx: [["الدوام", "٤ ص — ١٢ ظهرًا", "provider", 15, "F3"]] },
  { id: "c-book-cafe", n: "مقهى الكتاب — الششة", t: "قهوة ورفوف كتب", nb: "shisha", cat: "cafe", sc: "library", price: 24, dur: 60,
    ab: "مقهى صغير مع رفوف كتب للتبادل، يستضيف لقاءات قرائية أحيانًا.", su: ["quiet", "solo", "students"], act: "go", tm: HOURS(8, 0), com: ["learn", "culture"], nov: 0.85, pop: 0.4,
    fx: [["التبادل", "خذ كتابًا واترك كتابًا", "provider", 21, "F4"]] },
  { id: "c-dessert", n: "مقهى الحلويات — العزيزية", t: "حلى وقهوة بعد العشاء", nb: "aziziyah", cat: "cafe", sc: "cafe", price: 30, dur: 40,
    ab: "مقهى حلويات يعمل حتى وقت متأخر، مناسب بعد العشاء.", su: ["family", "evening"], act: "go", tm: HOURS(16, 2), com: ["food"], nov: 0.45, pop: 0.6, fx: [["الدوام", "٤ م — ٢ ص", "provider", 6, "F3"]] },
  { id: "c-rooftop", n: "مقهى السطح — أجياد", t: "جلسة مرتفعة بعد العشاء", nb: "ajyad", cat: "cafe", sc: "skyline", price: 34, dur: 50,
    ab: "جلسة سطح مرتفعة بإطلالة على محيط الحي، تمتلئ بسرعة بعد العشاء.", su: ["evening", "outdoor", "solo"], act: "go", tm: HOURS(17, 2), com: ["visitors"], nov: 0.7, pop: 0.6,
    fx: [["الانتظار", "قد يصل ٢٠ دقيقة في الذروة", "community", 2, "F2"]] },
  { id: "c-women", n: "مقهى مخصص للنساء — العوالي", t: "قسم مستقل وجلسات هادئة", nb: "awali", cat: "cafe", sc: "cafe", price: 28, dur: 60,
    ab: "مقهى بقسم مخصص للنساء وجلسات هادئة، يستضيف لقاءات صغيرة.", su: ["women", "quiet", "seated"], act: "go", tm: HOURS(9, 0), com: ["living", "awali"], nov: 0.7, pop: 0.45, fx: [["القسم", "مدخل مستقل", "provider", 19, "F4"]] },

  { id: "x-pottery", n: "ورشة فخار — أول قطعة", t: "جلسة عملية لثلاث ساعات", nb: "shawqiyah", cat: "craft", pr: "craft-sadu", sc: "workshop", price: 140, dur: 180,
    ab: "ورشة فخار عملية تبدأ من تشكيل الطين حتى قطعة جاهزة للحرق.", su: ["beginners", "noexp", "small"], act: "register", out: "الورشة", tm: WEEKLY(0, 17), com: ["craft"], nov: 0.85, pop: 0.45, cap: 10, joined: 5,
    fx: [["الاستلام", "القطعة تُسلّم بعد الحرق بأسبوع", "provider", 10, "F4"]] },
  { id: "x-leather", n: "ورشة جلود تقليدية", t: "خياطة يدوية ومنتج صغير", nb: "jarwal", cat: "craft", sc: "workshop", price: 130, dur: 150,
    ab: "ورشة جلود يدوية تنتج فيها قطعة صغيرة بنفسك، بإشراف حرفي.", su: ["beginners", "small", "noexp"], act: "register", out: "الورشة", tm: WEEKLY(3, 18), com: ["craft"], nov: 0.9, pop: 0.4, cap: 8, joined: 4, fx: [] },
  { id: "x-perfume", n: "تركيب عطر شخصي", t: "جلسة تعريفية وتجربة", nb: "misfalah", cat: "craft", sc: "workshop", price: 160, dur: 90,
    ab: "جلسة تعريفية بتركيب العطور تخرج منها بعبوة صغيرة من تركيبك.", su: ["beginners", "small", "women"], act: "register", out: "الورشة", tm: WEEKLY(2, 19), com: ["craft", "market"], nov: 0.9, pop: 0.45, cap: 10, joined: 6, fx: [] },
  { id: "x-storyteller", n: "جلسة حكواتي", t: "حكايات مكة للعائلة", nb: "jarwal", cat: "culture", sc: "hall", price: 30, dur: 60,
    ab: "جلسة حكايات عن مكة القديمة تناسب العائلات والأطفال فوق ست سنوات.", su: ["family", "kids", "arabic", "evening"], act: "register", out: "المنظّم", tm: WEEKLY(4, 20), com: ["culture", "families"], nov: 0.8, pop: 0.5, cap: 40, joined: 22, fx: [] },
  { id: "x-arabic-class", n: "عربية للزوار — جلسة تمهيدية", t: "عبارات يومية مفيدة", nb: "aziziyah", cat: "learn", sc: "hall", price: 0, dur: 60,
    ab: "جلسة تمهيدية تعلّم عبارات يومية مفيدة للزوار غير الناطقين بالعربية.", su: ["beginners", "bilingual", "solo"], act: "join", tm: WEEKLY(1, 18), com: ["learn", "visitors"], nov: 0.85, pop: 0.4, cap: 25, joined: 11, fx: [["اللغة", "شرح بالإنجليزية", "provider", 8, "F4"]] },
  { id: "x-first-aid", n: "إسعافات أولية — أساسيات", t: "جلسة عملية للمبتدئين", nb: "naseem", cat: "learn", sc: "hall", price: 50, dur: 120,
    ab: "دورة قصيرة في الإسعافات الأولية الأساسية بتدريب عملي.", su: ["beginners", "noexp", "arabic"], act: "register", out: "الجهة المنظّمة", tm: WEEKLY(6, 16), com: ["learn", "volunteer"], nov: 0.7, pop: 0.5, cap: 30, joined: 17, fx: [] },
  { id: "x-family-cook", n: "مطبخ العائلة — جلسة الأطفال", t: "الأطفال يطبخون بأنفسهم", nb: "naseem", cat: "family", sc: "workshop", price: 70, dur: 90,
    ab: "جلسة طبخ بسيطة للأطفال تحت إشراف، ينتهون فيها بطبق من صنعهم.", su: ["kids", "family"], act: "register", out: "المطبخ", tm: WEEKLY(5, 16), com: ["families", "craft"], nov: 0.75, pop: 0.5, cap: 12, joined: 8, fx: [["العمر", "٦ — ١٢ سنة", "provider", 6, "F4"]] },
  { id: "x-night-souq-tour", n: "جولة السوق الليلي", t: "مشي وتذوق بين المحلات", nb: "shawqiyah", cat: "market", pr: "walk-makkah", sc: "market", price: 70, dur: 100,
    ab: "جولة مسائية داخل السوق الشعبي مع تذوق وشرح عن المهن القديمة.", su: ["small", "evening", "firsttime"], act: "join", tm: WEEKLY(3, 20), com: ["market", "culture"], nov: 0.85, pop: 0.5, cap: 14, joined: 7, fx: [] },

  { id: "e-neighborhood-market", n: "سوق الحي المسائي — العوالي", t: "أسر منتجة ومأكولات", nb: "awali", cat: "market", sc: "market", price: 0, dur: 240,
    ab: "سوق مسائي للأسر المنتجة في ساحة الحي، أكل ومنتجات يدوية.", su: ["family", "outdoor", "evening"], act: "go", tm: SESSION(2, 240), com: ["market", "awali", "families"], nov: 0.65, pop: 0.6,
    fx: [["الموعد", "الليلة حتى منتصف الليل", "provider", 0.4, "F2"]] },
  { id: "e-poetry", n: "أمسية شعرية", t: "شعراء محليون ونقاش", nb: "zahir", cat: "culture", sc: "hall", price: 0, dur: 90,
    ab: "أمسية شعرية لشعراء من مكة مع فقرة مفتوحة للحضور.", su: ["solo", "arabic", "evening"], act: "register", out: "المنظّم", tm: SESSION(27, 90), com: ["culture"], nov: 0.75, pop: 0.45, cap: 80, joined: 38, fx: [] },
  { id: "e-tech-meetup", n: "لقاء التقنية الشهري", t: "عروض قصيرة ونقاش", nb: "awali", cat: "learn", sc: "hall", price: 0, dur: 120,
    ab: "لقاء شهري لمهتمي التقنية بعروض قصيرة ونقاش مفتوح.", su: ["students", "solo", "arabic"], act: "register", out: "المنظّم", tm: SESSION(46, 120), com: ["learn", "students"], nov: 0.7, pop: 0.5, cap: 100, joined: 57, fx: [] },
  { id: "e-blood-drive", n: "حملة تبرع بالدم", t: "بالتعاون مع جهة صحية", nb: "aziziyah", cat: "volunteer", sc: "volunteer", price: 0, dur: 300,
    ab: "حملة تبرع بالدم في مقر الحي بالتعاون مع جهة صحية مختصة.", su: ["beginners", "noexp"], act: "register", out: "الجهة الصحية", tm: SESSION(62, 300), com: ["volunteer", "living"], nov: 0.6, pop: 0.55, cap: 150, joined: 64,
    fx: [["الشروط", "وفق الاشتراطات الصحية المعلنة", "official", 2, "F3"]] },
  { id: "e-kids-theatre", n: "مسرح الأطفال", t: "عرض قصير مناسب للصغار", nb: "naseem", cat: "family", sc: "hall", price: 40, dur: 60,
    ab: "عرض مسرحي قصير للأطفال، مقاعد محدودة ويفضّل الحجز.", su: ["kids", "family", "indoor"], act: "book", out: "منصة التذاكر", tm: SESSION(44, 60), com: ["families"], nov: 0.65, pop: 0.6, cap: 200, joined: 138, fx: [] },
  { id: "e-craft-expo", n: "معرض الحرف الموسمي", t: "ثلاثة أيام مع ورش حية", nb: "shawqiyah", cat: "craft", sc: "workshop", price: 0, dur: 360,
    ab: "معرض موسمي للحرف مع ورش حية للزوار خلال ثلاثة أيام.", su: ["family", "kids", "indoor"], act: "go", tm: WINDOW(1, 4), com: ["craft", "market"], nov: 0.75, pop: 0.6, fx: [] },
  { id: "e-heritage-lecture", n: "محاضرة: مسارات الحج القديمة", t: "مع خرائط تاريخية", nb: "zahir", cat: "culture", sc: "hall", price: 0, dur: 75,
    ab: "محاضرة عن مسارات الحج القديمة مع عرض خرائط تاريخية.", su: ["solo", "arabic"], act: "register", out: "المنظّم", tm: SESSION(70, 75), com: ["culture", "hajj"], nov: 0.8, pop: 0.45, cap: 90, joined: 33, fx: [] },
  { id: "e-family-fun", n: "مهرجان الحي — الهجرة", t: "يومان من الأنشطة", nb: "hijrah", cat: "family", sc: "kids", price: 0, dur: 300,
    ab: "مهرجان حي على مدى يومين: ألعاب، عربات طعام، وفقرات للأطفال.", su: ["family", "kids", "outdoor", "evening"], act: "go", tm: WINDOW(2, 4), com: ["families", "hijrah"], nov: 0.6, pop: 0.7, fx: [] },

  { id: "a-quran-circle", n: "حلقة تحفيظ للأطفال", t: "حلقة حي مسائية", nb: "shisha", cat: "learn", sc: "hall", price: 0, dur: 60,
    ab: "حلقة تحفيظ مسائية للأطفال في مسجد الحي، بتنظيم من أهالي الحي.", su: ["kids", "arabic"], act: "join", tm: WEEKLY(0, 17), com: ["learn", "shisha"], nov: 0.4, pop: 0.5, cap: 30, joined: 22, fx: [] },
  { id: "a-elderly-visit", n: "زيارة كبار السن", t: "مبادرة أسبوعية", nb: "kakiyah", cat: "volunteer", pr: "vol-hayy", sc: "volunteer", price: 0, dur: 90,
    ab: "مبادرة أسبوعية لزيارة كبار السن في الحي بتنسيق مع الأسر.", su: ["beginners", "small", "arabic"], act: "join", tm: WEEKLY(4, 16), com: ["volunteer", "living"], nov: 0.7, pop: 0.4, cap: 15, joined: 9,
    fx: [["التنسيق", "بموافقة الأسر مسبقًا", "provider", 9, "F4"]] },
  { id: "a-language-exchange", n: "تبادل لغوي — عربي/إنجليزي", t: "جلسة أسبوعية مفتوحة", nb: "aziziyah", cat: "learn", sc: "cafe", price: 0, dur: 75,
    ab: "جلسة تبادل لغوي أسبوعية بين متحدثي العربية والإنجليزية.", su: ["solo", "bilingual", "beginners", "evening"], act: "join", tm: WEEKLY(6, 19), com: ["learn", "visitors"], nov: 0.8, pop: 0.45, cap: 20, joined: 12, fx: [] },
  { id: "a-chess", n: "ركن الشطرنج", t: "لقاء أسبوعي مفتوح", nb: "naseem", cat: "sport", sc: "cafe", price: 0, dur: 120,
    ab: "لقاء شطرنج أسبوعي مفتوح لكل المستويات في ركن المقهى.", su: ["solo", "beginners", "quiet"], act: "join", tm: WEEKLY(1, 20), com: ["sport", "learn"], nov: 0.75, pop: 0.35, cap: 24, joined: 10, fx: [] },
  { id: "a-tree-planting", n: "تشجير الحي", t: "مبادرة موسمية", nb: "hijrah", cat: "volunteer", pr: "vol-hayy", sc: "garden", price: 0, dur: 150,
    ab: "مبادرة تشجير موسمية في شوارع الحي بمشاركة الأسر.", su: ["family", "outdoor", "noexp"], act: "join", tm: SESSION(56, 150), com: ["volunteer", "hijrah"], nov: 0.65, pop: 0.45, cap: 50, joined: 24, fx: [] },
  { id: "a-swim-women", n: "حصة سباحة — للنساء", t: "مسبح مغلق ومدربة", nb: "awali", cat: "sport", sc: "sport", price: 80, dur: 60,
    ab: "حصة سباحة للنساء في مسبح مغلق مع مدربة، بعدد محدود.", su: ["women", "beginners", "indoor"], act: "register", out: "المركز", tm: WEEKLY(0, 18), com: ["sport", "awali"], nov: 0.7, pop: 0.4, cap: 12, joined: 8, fx: [["الخصوصية", "قائمة المشاركات غير معلنة", "provider", 12, "F4"]] },
  { id: "a-bike-family", n: "جولة دراجات عائلية", t: "مسار قصير وآمن", nb: "bathaquraish", cat: "sport", sc: "sport", price: 0, dur: 75,
    ab: "جولة دراجات عائلية على مسار قصير آمن، دراجات متاحة للإيجار قرب المسار.", su: ["family", "kids", "outdoor", "evening"], act: "join", tm: WEEKLY(5, 17), com: ["sport", "families"], nov: 0.7, pop: 0.45, cap: 30, joined: 13, fx: [] },
  { id: "a-newcomers", n: "لقاء الوافدين الجدد لمكة", t: "أسئلة السكن والخدمات", nb: "aziziyah", cat: "learn", sc: "hall", price: 0, dur: 90,
    ab: "لقاء شهري لمن انتقل حديثًا إلى مكة: أسئلة السكن والمدارس والخدمات.", su: ["beginners", "solo", "arabic"], act: "join", tm: WEEKLY(2, 19), com: ["living", "learn"], nov: 0.85, pop: 0.4, cap: 40, joined: 16, fx: [] },

  { id: "g-quran-club", n: "مجلس القرآن الأسبوعي", t: "كل خميس بعد المغرب", nb: "shisha", cat: "learn", sc: "hall", price: 0, dur: 60,
    ab: "مجلس أسبوعي مفتوح في مسجد الحي بعد صلاة المغرب.", su: ["arabic", "solo"], act: "join", tm: WEEKLY(4, 19), com: ["learn"], nov: 0.4, pop: 0.5, members: 150, state: "active", fx: [] },
  { id: "g-running-club", n: "نادي الجري — بطحاء قريش", t: "كل سبت صباحًا", nb: "bathaquraish", cat: "sport", sc: "sport", price: 0, dur: 75,
    ab: "نادي جري أسبوعي بمستويات مختلفة وقائد لكل مجموعة.", su: ["beginners", "outdoor", "solo"], act: "join", tm: WEEKLY(6, 6), com: ["sport"], nov: 0.6, pop: 0.55, members: 188, state: "active", fx: [] },
  { id: "g-mothers-circle", n: "ملتقى أمهات الحي", t: "لقاء نصف شهري", nb: "naseem", cat: "family", sc: "cafe", price: 0, dur: 90,
    ab: "ملتقى للأمهات لتبادل الخبرات وتنظيم أنشطة للأطفال.", su: ["women", "family"], act: "join", tm: WEEKLY(1, 10), com: ["families", "naseem"], nov: 0.7, pop: 0.45, members: 112, state: "active", fx: [] },
  { id: "g-paused-club", n: "نادي المسرح — متوقف مؤقتًا", t: "يعود بعد الموسم", nb: "zahir", cat: "culture", sc: "hall", price: 0, dur: 120,
    ab: "نادي مسرح أوقف لقاءاته مؤقتًا حتى بداية الموسم القادم.", su: ["arabic"], act: "join", tm: WEEKLY(3, 19), com: ["culture"], nov: 0.3, pop: 0.25, members: 58, state: "paused", lastActivityDays: 48,
    fx: [["الحالة", "متوقف مؤقتًا حتى إشعار المنظّم", "provider", 48, "F3"]] },

  { id: "o-workshop-student", n: "خصم الطلاب على الورش", t: "بطاقة جامعية سارية", nb: "zahir", cat: "learn", sc: "workshop", linked: "x-khatt",
    ab: "خصم للطلاب على ورش الخط والحرف عند إبراز البطاقة الجامعية.", act: "redeem", out: "الورشة", tm: WINDOW(-12, 25), com: ["learn", "students"], nov: 0.55, pop: 0.45,
    fx: [["الشروط", "بطاقة جامعية سارية", "provider", 12, "F3"]] },
  { id: "o-family-park", n: "باقة العائلة — أنشطة الحديقة", t: "أربعة أنشطة بسعر واحد", nb: "naseem", cat: "family", sc: "kids", linked: "p-park-naseem",
    ab: "باقة تشمل أربعة أنشطة داخل الحديقة للعائلة الواحدة.", act: "redeem", out: "مشغّل الأنشطة", tm: WINDOW(-4, 11), com: ["families"], nov: 0.5, pop: 0.5, fx: [["ينتهي", "بعد أحد عشر يومًا", "provider", 4, "F0"]] },
  { id: "o-cafe-evening", n: "عرض المساء — مقهى السطح", t: "مشروبان بسعر واحد", nb: "ajyad", cat: "cafe", sc: "skyline", linked: "c-rooftop",
    ab: "عرض مسائي على المشروبات في الفترة من ٥ إلى ٧ مساءً.", act: "redeem", out: "المقهى", tm: WINDOW(-2, 6), com: ["visitors"], nov: 0.5, pop: 0.5, fx: [["الفترة", "٥ — ٧ م", "provider", 2, "F3"]] },
  { id: "o-transport-day", n: "باقة النقل اليومية", t: "سعر ثابت لليوم", nb: "haram-area", cat: "services", sc: "skyline", linked: "s-transport",
    ab: "باقة نقل بسعر ثابت لليوم الواحد داخل المدينة.", act: "redeem", out: "مزوّد الخدمة", tm: WINDOW(-8, 30), com: ["visitors"], nov: 0.4, pop: 0.45, fx: [] },

  { id: "s-translator", n: "مترجم مرافق", t: "بالساعة أو نصف اليوم", nb: "haram-area", cat: "services", sc: "hall", price: 150, dur: 120,
    ab: "خدمة مترجم مرافق للزوار، تُحجز بالساعة أو نصف اليوم.", su: ["bilingual", "small"], act: "contact", out: "مزوّد الخدمة", tm: HOURS(7, 23), com: ["visitors"], nov: 0.6, pop: 0.4,
    fx: [["اللغات", "الإنجليزية والأردية والإندونيسية", "provider", 25, "F3"]] },
  { id: "s-photographer", n: "مصوّر للمناسبات العائلية", t: "جلسات قصيرة", nb: "zahir", cat: "services", sc: "workshop", price: 300, dur: 90,
    ab: "مصوّر محلي للمناسبات والجلسات العائلية القصيرة.", su: ["family", "small"], act: "contact", out: "المصوّر", tm: HOURS(9, 23), com: ["craft", "families"], nov: 0.55, pop: 0.35, fx: [] },
  { id: "s-repair", n: "ورشة صيانة منزلية", t: "زيارة في نفس اليوم", nb: "shawqiyah", cat: "services", sc: "workshop", price: 100, dur: null,
    ab: "خدمة صيانة منزلية سريعة داخل الأحياء الغربية.", su: [], act: "contact", out: "مزوّد الخدمة", tm: HOURS(7, 22), com: ["living"], nov: 0.35, pop: 0.5, fx: [] },
  { id: "s-tutor", n: "دروس تقوية — ثانوي", t: "مجموعات صغيرة", nb: "awali", cat: "services", sc: "library", price: 90, dur: 90,
    ab: "دروس تقوية لطلاب الثانوية في مجموعات صغيرة.", su: ["students", "small", "arabic"], act: "contact", out: "المعلّم", tm: HOURS(15, 22), com: ["learn", "students"], nov: 0.5, pop: 0.45, fx: [] },
];

/* ───────── 4.5 Neighborhood staples — generated breadth, clearly prototype ─────────
   A small generator fills out everyday inventory so browsing a neighborhood never
   feels empty. Names are descriptive, never borrowed from real businesses, and
   every generated object is marked as prototype content. */

const STAPLE_TEMPLATES = [
  { cat: "food", sc: "food", names: ["مطبخ الأسرة", "مطعم الركن", "بيت الطباخ", "سفرة الحي"], t: "مطبخ يومي لأهل الحي", dur: 45, price: [30, 60],
    ab: "مطعم حي يخدم السكان يوميًا بقائمة بسيطة وأسعار معقولة.", su: ["family", "solo"], hours: [11, 23] },
  { cat: "cafe", sc: "cafe", names: ["مقهى الزاوية", "قهوة الصباح", "ركن القهوة", "مقهى الممشى"], t: "قهوة سريعة قرب البيت", dur: 30, price: [16, 28],
    ab: "مقهى صغير قريب من السكن، مناسب لقهوة سريعة أو جلسة قصيرة.", su: ["solo", "short"], hours: [6, 1] },
  { cat: "market", sc: "market", names: ["بقالة الحي الكبيرة", "سوق الخضار اليومي", "محل التمور والمكسرات"], t: "احتياج يومي قريب", dur: 25, price: null,
    ab: "محل يخدم احتياجات الحي اليومية، قريب ومفتوح معظم اليوم.", su: ["short", "family"], hours: [6, 0] },
  { cat: "family", sc: "kids", names: ["ملعب الحي", "ساحة الأطفال", "ركن الألعاب"], t: "مساحة لعب قريبة", dur: 45, price: null,
    ab: "مساحة لعب للأطفال داخل الحي، أنشط بعد المغرب.", su: ["kids", "family", "outdoor", "evening"], hours: [15, 23] },
  { cat: "services", sc: "workshop", names: ["مغسلة الحي", "ورشة صيانة سريعة", "صيدلية الحي"], t: "خدمة قريبة وسريعة", dur: null, price: null,
    ab: "خدمة يومية داخل الحي بساعات عمل طويلة.", su: ["short"], hours: [8, 0] },
];

function generateStaples() {
  const out = [];
  const nbs = NEIGHBORHOODS.filter((n) => n.id !== "haram-area");
  nbs.forEach((nb, i) => {
    const r = rng("staple|" + nb.id);
    const picks = STAPLE_TEMPLATES.slice().sort(() => r() - 0.5).slice(0, i % 3 === 0 ? 2 : 1);
    picks.forEach((tpl, k) => {
      const name = `${tpl.names[Math.floor(r() * tpl.names.length)]} — ${nb.name}`;
      out.push({
        id: `gen-${nb.id}-${tpl.cat}-${k}`, n: name, t: tpl.t, nb: nb.id, cat: tpl.cat, sc: tpl.sc,
        ab: tpl.ab, dur: tpl.dur, price: tpl.price ? Math.round(tpl.price[0] + r() * (tpl.price[1] - tpl.price[0])) : null,
        su: tpl.su, act: "go", tm: HOURS(tpl.hours[0], tpl.hours[1]),
        com: [nb.id, tpl.cat === "food" || tpl.cat === "cafe" ? "food" : "living"].filter(Boolean),
        nov: 0.3 + r() * 0.4, pop: 0.25 + r() * 0.4, generated: true,
        fx: [["الدوام", `${ar(tpl.hours[0])} — ${ar(tpl.hours[1] === 0 ? 12 : tpl.hours[1] > 12 ? tpl.hours[1] - 12 : tpl.hours[1])}`, "provider", Math.round(5 + r() * 60), "F3"]],
      });
    });
  });
  return out;
}

/* ───────── 4.6 Expansion into the working object model ───────── */

const TYPE_BY_PREFIX = { p: "place", r: "restaurant", c: "restaurant", x: "experience", e: "event", a: "activity", g: "recurring", o: "offer", s: "service", st: "place", gen: "place" };

function inferType(id, fallback) {
  if (fallback) return fallback;
  const head = id.split("-")[0];
  return TYPE_BY_PREFIX[head] || "place";
}

const TYPE_LABEL = {
  place: "مكان", restaurant: "مطعم", experience: "تجربة", event: "فعالية",
  activity: "نشاط", recurring: "مجموعة متكررة", offer: "عرض", service: "خدمة", community: "مجتمع", contribution: "مساهمة",
};

const AL_TYPE = {
  place: "المكان", restaurant: "المطعم", experience: "التجربة", event: "الفعالية",
  activity: "النشاط", recurring: "المجموعة", offer: "العرض", service: "الخدمة",
};
const alType = (o) => AL_TYPE[o.type] || "العنصر";

const ACTION_LABEL = {
  go: "الاتجاهات", book: "احجز", register: "سجّل", join: "انضم", redeem: "استخدم العرض",
  contact: "تواصل", official: "افتح المصدر الرسمي",
};

function expand(raw, forcedType) {
  const type = inferType(raw.id, forcedType);
  const r = rng(raw.id);
  const claims = [];
  const push = (field, cls, value, ageDays, fresh) =>
    claims.push({ id: `${raw.id}:${field}:${cls}`, obj: raw.id, field, cls, value, at: daysAgo(ageDays), fresh: fresh || "F3" });

  push("identity", raw.real ? "official" : "provider", raw.n, raw.real ? 120 : 45, "F4");
  (raw.fx || []).forEach((f, i) => {
    const [label, value, cls, ageDays, fresh] = f;
    claims.push({ id: `${raw.id}:f${i}`, obj: raw.id, field: label, cls, value, at: daysAgo(ageDays), fresh: fresh || "F3" });
  });

  return {
    ...raw,
    type,
    typeLabel: TYPE_LABEL[type],
    name: raw.n,
    tagline: raw.t || "",
    about: raw.ab || "",
    neighborhood: raw.nb,
    category: raw.cat,
    provider: raw.pr || null,
    scene: raw.sc || "skyline",
    photo: raw.pt || null,
    real: !!raw.real,
    generated: !!raw.generated,
    price: raw.price === undefined ? null : raw.price,
    duration: raw.dur === undefined ? null : raw.dur,
    suit: raw.su || [],
    action: raw.act || "go",
    outbound: raw.out || null,
    timing: raw.tm || null,
    facts: (raw.fx || []).map(([label, value, cls, ageDays, fresh]) => ({ label, value, cls, at: daysAgo(ageDays), fresh: fresh || "F3" })),
    claims,
    communities: raw.com || [],
    novelty: raw.nov ?? 0.5,
    popularity: raw.pop ?? 0.5,
    capacity: raw.cap ?? null,
    joinedCount: raw.joined ?? null,
    members: raw.members ?? null,
    groupState: raw.state ?? null,
    lastActivityDays: raw.lastActivityDays ?? null,
    linked: raw.linked || null,
    geo: (() => {
      const nb = NB[raw.nb] || NB["haram-area"];
      return { x: clamp(nb.x + (r() - 0.5) * 0.11, 0.04, 0.96), y: clamp(nb.y + (r() - 0.5) * 0.11, 0.05, 0.95) };
    })(),
  };
}

const INVENTORY = [
  ...PLACES.map((o) => expand(o, "place")),
  ...RESTAURANTS.map((o) => expand(o, "restaurant")),
  ...CAFES.map((o) => expand(o, "restaurant")),
  ...EXPERIENCES.map((o) => expand(o, "experience")),
  ...EVENTS.map((o) => expand(o, "event")),
  ...ACTIVITIES.map((o) => expand(o, "activity")),
  ...RECURRING.map((o) => expand(o, "recurring")),
  ...OFFERS.map((o) => expand(o, "offer")),
  ...SERVICES.map((o) => expand(o, "service")),
  ...STAYS.map((o) => expand(o, "place")),
  ...MORE.map((o) => expand(o)),
  ...generateStaples().map((o) => expand(o, "place")),
];

const OBJ = byId(INVENTORY);
const getObj = (id) => OBJ[id] || null;

/* Provider-published content enters the same inventory the whole app reads. */
function registerObject(raw, forcedType) {
  const o = expand(raw, forcedType);
  INVENTORY.push(o);
  OBJ[o.id] = o;
  return o;
}
function patchObjectFact(objId, label, value) {
  const o = OBJ[objId];
  if (!o) return;
  const claim = { id: `${objId}:prov:${hash(label + value)}`, obj: objId, field: label, cls: "provider", value, at: new Date(t0), fresh: "F3" };
  o.claims = [...o.claims, claim];
  const i = o.facts.findIndex((f) => f.label === label);
  if (i > -1) o.facts[i] = { ...o.facts[i], value, cls: "provider", at: new Date(t0) };
  else o.facts.push({ label, value, cls: "provider", at: new Date(t0), fresh: "F3" });
}
function setGroupState(objId, groupState) {
  const o = OBJ[objId];
  if (o) { o.groupState = groupState; o.state = groupState; }
}

/* distance — schematic, derived from the prototype map grid, never presented as
   a precise measurement. */
const USER_HOME = { x: NB.awali.x, y: NB.awali.y };
function distanceKm(o, from) {
  const a = from || USER_HOME;
  const dx = (o.geo.x - a.x) * 14, dy = (o.geo.y - a.y) * 14;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
}
const walkMinutes = (km) => Math.round(km * 12);

/* ═══════════════════════════════════════════════════════════════════════════
   GROUP 2 — COMMUNITY & SOCIAL LAYER
   Eight stable families, many real sub-communities, clubs, and one unified
   Contribution model. Community knowledge also surfaces outside the tab.
   ═══════════════════════════════════════════════════════════════════════════ */

const FAMILIES = [
  { id: "hoods", name: "الأحياء", blurb: "مجتمعات الأحياء — ما يحدث فعلًا قرب بيتك.", icon: Building2, scene: "alley" },
  { id: "visitors", name: "زوار مكة", blurb: "أسئلة الزيارة الأولى، اللغات، والوصول.", icon: Users, scene: "haram" },
  { id: "hajj", name: "الحج والعمرة", blurb: "التحضير، الحملات، والتجربة العملية.", icon: Compass, scene: "haram" },
  { id: "food", name: "المطاعم والتجارب", blurb: "أكل مكة: ماذا تطلب، وأين، ومتى.", icon: Utensils, scene: "food" },
  { id: "culture", name: "الثقافة والتاريخ", blurb: "مكة القديمة، المعالم، والحكايات.", icon: Landmark, scene: "museum" },
  { id: "volunteer", name: "التطوع والمبادرات", blurb: "فرص موثوقة ومبادرات الأحياء.", icon: HandHeart, scene: "volunteer" },
  { id: "learn", name: "التعليم والهوايات", blurb: "ورش، أندية، ودراسة.", icon: GraduationCap, scene: "library" },
  { id: "living", name: "الحياة في مكة", blurb: "السكن، الخدمات، والوصول، وحياة المدينة اليومية.", icon: Home, scene: "skyline" },
];

const C = (id, family, name, blurb, members, extra = {}) => ({
  id, family, name, blurb, members, kind: extra.kind || "community",
  scene: extra.scene || FAMILIES.find((f) => f.id === family)?.scene || "skyline",
  nb: extra.nb || null, langs: extra.langs || ["ar"], state: extra.state || "active",
  lastActivityDays: extra.lastActivityDays ?? 0.3,
  rules: extra.rules || ["اكتب من تجربتك، وحدّد الوقت والمكان.", "لا تنشر أرقامًا شخصية أو مواقع دقيقة لأحد.", "التسويق الشخصي يحتاج إفصاحًا واضحًا."],
  moderators: extra.moderators || ["فريق مجتمع EyeMakkah"],
  club: extra.club || null, linked: extra.linked || [],
});

const COMMUNITIES = [
  ...FAMILIES.map((f) => C(f.id, f.id, f.name, f.blurb, 0, { kind: "family", scene: f.scene })),

  C("awali", "hoods", "مجتمع العوالي", "مطاعم الحي، خدماته، ومبادراته.", 3840, { nb: "awali", scene: "alley" }),
  C("aziziyah", "hoods", "مجتمع العزيزية", "حركة الحي اليومية وخدماته.", 4120, { nb: "aziziyah", scene: "skyline" }),
  C("misfalah", "hoods", "مجتمع المسفلة", "الحي القديم، أكله وحكاياته.", 2210, { nb: "misfalah", scene: "alley" }),
  C("naseem", "hoods", "مجتمع النسيم", "الحدائق والعائلات ومرافق الحي.", 2980, { nb: "naseem", scene: "garden" }),
  C("jarwal", "hoods", "مجتمع جرول", "المهن القديمة والسوق اليومي.", 1640, { nb: "jarwal", scene: "market" }),
  C("shisha", "hoods", "مجتمع الششة", "حياة الحي وخدماته اليومية.", 1990, { nb: "shisha", scene: "alley" }),
  C("shawqiyah", "hoods", "مجتمع الشوقية", "الأسواق والورش وأهل الحرف.", 1480, { nb: "shawqiyah", scene: "market" }),
  C("hijrah", "hoods", "مجتمع الهجرة", "مبادرات الحي وفعالياته.", 1220, { nb: "hijrah", scene: "garden" }),
  C("rusayfah", "hoods", "مجتمع الرصيفة", "مرافق رياضية وحياة سكنية.", 1130, { nb: "rusayfah", scene: "sport" }),
  C("kakiyah", "hoods", "مجتمع الكعكية", "خدمات الحي وأسواقه.", 980, { nb: "kakiyah", scene: "market" }),

  C("firstvisit", "visitors", "أول زيارة لمكة", "أسئلة من يزور لأول مرة — بلا حرج.", 5600, { langs: ["ar", "en"], scene: "haram" }),
  C("visitors-en", "visitors", "Visitors — English", "نفس المجتمع بلغة أخرى، والمحتوى مترجم في الاتجاهين.", 3100, { langs: ["en", "ar"], scene: "haram" }),
  C("visitors-ur", "visitors", "زائرون — اردو", "مجتمع للزوار الناطقين بالأردية.", 2400, { langs: ["ur", "ar"], scene: "haram" }),
  C("visitors-id", "visitors", "Pengunjung — Bahasa", "مجتمع للزوار الناطقين بالإندونيسية.", 1900, { langs: ["id", "ar"], scene: "haram" }),
  C("accessible", "visitors", "سهولة الوصول", "تجارب واقعية عن المسارات والمداخل والكراسي المتحركة.", 1740, { scene: "alley" }),

  C("campaigns", "hajj", "الحملات والمجموعات", "تنسيق المجموعات وأسئلتها العملية.", 2600, { scene: "haram" }),
  C("first-umrah", "hajj", "أول عمرة", "الاستعداد والخطوات والأسئلة الشائعة.", 4300, { langs: ["ar", "en"], scene: "haram" }),
  C("hajj-logistics", "hajj", "السكن والتنقل في الموسم", "أسئلة عملية عن المسافات والمواعيد ونقاط اللقاء.", 3100, { scene: "stay" }),
  C("after-umrah", "hajj", "بعد العمرة", "ماذا تفعل في بقية أيامك في مكة.", 2200, { scene: "alley" }),

  C("local-food", "food", "الأكل المكي", "الأطباق المكية وأين تجدها وما يُطلب فعلًا.", 6100, { scene: "food" }),
  C("cafes", "food", "المقاهي", "قهوة، جلسات، ومساحات عمل ودراسة.", 3300, { scene: "cafe" }),
  C("new-openings", "food", "افتتاحات جديدة", "ما فتح حديثًا — وهل يستحق.", 2700, { scene: "market" }),
  C("family-dining", "food", "مطاعم العائلات", "الجلسات، الأطفال، والانتظار.", 2100, { scene: "food" }),

  C("heritage", "culture", "التراث والمسارات", "المواقع التاريخية ومسارات المشي.", 2900, { scene: "mountain" }),
  C("makkah-old", "culture", "مكة القديمة", "صور وحكايات وأسماء الحارات.", 3600, { scene: "alley" }),
  C("craft", "culture", "الحرف والمهارات", "السدو، الخط، الفخار، الجلد، والعطور.", 1800, { scene: "workshop" }),
  C("museums", "culture", "المتاحف والمعارض", "ما يستحق الزيارة هذا الشهر.", 1500, { scene: "museum" }),
  C("photo-c", "culture", "تصوير مكة", "زوايا وأوقات وضوء المدينة.", 1300, { scene: "skyline" }),

  C("haram-service", "volunteer", "خدمة الزوار", "فرص منظّمة عبر جهات مرخّصة.", 3200, { scene: "volunteer" }),
  C("neighborhood-init", "volunteer", "مبادرات الأحياء", "تنظيف، تشجير، وخدمة الجيران.", 1600, { scene: "garden" }),
  C("health-vol", "volunteer", "التطوع الصحي", "حملات وتدريب وإسعافات.", 1100, { scene: "volunteer" }),
  C("env-vol", "volunteer", "البيئة والتشجير", "مبادرات نظافة وتشجير في الأحياء.", 940, { scene: "garden" }),

  C("students", "learn", "طلاب أم القرى", "أندية، فعاليات، ومجموعات مذاكرة.", 4400, { scene: "library" }),
  C("workshops", "learn", "الورش والدورات", "ورش قصيرة ودورات عملية.", 2300, { scene: "workshop" }),
  C("clubs", "learn", "الأندية والهوايات", "مشي، قراءة، تصوير، شطرنج.", 2000, { scene: "garden" }),
  C("kids-learning", "learn", "تعلّم الأطفال", "برامج وأنشطة للصغار.", 1700, { scene: "kids" }),

  C("families", "living", "العائلات", "أين نخرج، ومتى، وكيف نتفادى الزحام.", 5200, { scene: "kids" }),
  C("market", "living", "الأسواق والتسوق", "أسواق يومية وأسعار ومواسم.", 2500, { scene: "market" }),
  C("sport", "living", "المشي والرياضة", "مسارات، أندية، ومجموعات أسبوعية.", 2800, { scene: "sport" }),
  C("newcomers", "living", "وافدون جدد لمكة", "السكن، المدارس، والخدمات.", 1400, { scene: "skyline" }),
  C("services-c", "living", "الخدمات والصيانة", "تجارب حقيقية مع مزوّدي الخدمات.", 1200, { scene: "workshop" }),
  C("quiet-club", "living", "نادي المسرح — متوقف", "مجموعة متوقفة مؤقتًا، تُعرض كسجل ولا تُرشَّح.", 58,
    { state: "dormant", lastActivityDays: 62, scene: "hall" }),
];

/* Clubs are repeated participation groups; they live inside communities and
   point at a real recurring activity. Community ≠ Club ≠ Activity. */
const CLUBS = [
  { id: "club-mashy", community: "sport", name: "نادي مشي مكة", activity: "g-walk-club", members: 240, cadence: "كل ثلاثاء", state: "active" },
  { id: "club-qira", community: "clubs", name: "نادي قراءة الزاهر", activity: "g-book-club", members: 96, cadence: "شهريًا", state: "active" },
  { id: "club-photo", community: "craft", name: "نادي تصوير مكة", activity: "g-photo-club", members: 132, cadence: "كل أربعاء", state: "active" },
  { id: "club-family", community: "families", name: "لقاء العائلات", activity: "g-family-picnic", members: 180, cadence: "كل جمعة", state: "active" },
  { id: "club-craft", community: "craft", name: "حلقة الحرفيين", activity: "g-craft-circle", members: 64, cadence: "كل أسبوعين", state: "active" },
  { id: "club-run", community: "sport", name: "نادي الجري", activity: "g-running-club", members: 188, cadence: "كل سبت", state: "active" },
  { id: "club-mothers", community: "families", name: "ملتقى أمهات الحي", activity: "g-mothers-circle", members: 112, cadence: "نصف شهري", state: "active" },
  { id: "club-quran", community: "learn", name: "مجلس القرآن الأسبوعي", activity: "g-quran-club", members: 150, cadence: "كل خميس", state: "active" },
  { id: "club-theatre", community: "quiet-club", name: "نادي المسرح", activity: "g-paused-club", members: 58, cadence: "متوقف", state: "paused" },
  { id: "club-bikes", community: "sport", name: "نادي الدراجات", activity: "g-dormant-club", members: 41, cadence: "متوقف", state: "dormant" },
];

/* a family's size is the sum of its communities */
COMMUNITIES.filter((c) => c.kind === "family").forEach((f) => {
  f.members = COMMUNITIES.filter((c) => c.family === f.id && c.kind !== "family").reduce((a, c) => a + c.members, 0);
});

const COM = byId(COMMUNITIES);
const subCommunities = (familyId) => COMMUNITIES.filter((c) => c.family === familyId && c.kind !== "family");

/* ───────── 5.1 Contributions — one model for every kind of human knowledge ─────────
   question · answer · experience_report · recommendation · update · tip · photo · story
   Authors keep their own voice. Translation is a viewing layer, never a rewrite.
   Display names are first names or kunyas — never full identity, never location. */

let _kseq = 0;
const K = (type, com, author, body, o = {}) => ({
  id: o.id || `k${++_kseq}`,
  type, communities: Array.isArray(com) ? com : [com],
  author, body,
  obj: o.obj || null, parent: o.parent || null,
  at: daysAgo(o.days ?? 2),
  helpful: o.helpful ?? Math.round(3 + (hash(body) % 40)),
  lang: o.lang || "ar",
  original: o.original || null,          // { lang, text } when the author wrote in another language
  fields: o.fields || null,              // structured experience report
  photos: o.photos || 0,
  visitedAt: o.visited != null ? daysAgo(o.visited) : null,
  flagged: o.flagged || null,            // moderation state
  providerReply: o.providerReply || null,
  answers: 0,
});

const AUTHORS = {
  umKhalid: { name: "أم خالد", role: "من سكان العوالي", kind: "resident", nb: "awali" },
  abuFaisal: { name: "أبو فيصل", role: "من أهل المسفلة", kind: "resident", nb: "misfalah" },
  noura: { name: "نورة", role: "من سكان النسيم", kind: "resident", nb: "naseem" },
  saad: { name: "سعد", role: "من سكان العزيزية", kind: "resident", nb: "aziziyah" },
  maryam: { name: "مريم", role: "طالبة بأم القرى", kind: "resident", nb: "awali" },
  faisal: { name: "فيصل", role: "من سكان الششة", kind: "resident", nb: "shisha" },
  huda: { name: "هدى", role: "من أهل جرول", kind: "resident", nb: "jarwal" },
  ahmad: { name: "أحمد", role: "زائر — الرياض", kind: "visitor" },
  sarah: { name: "Sarah", role: "زائرة — المملكة المتحدة", kind: "visitor" },
  imran: { name: "عمران", role: "زائر — باكستان", kind: "visitor" },
  dewi: { name: "Dewi", role: "زائرة — إندونيسيا", kind: "visitor" },
  khalid: { name: "خالد", role: "زائر متكرر", kind: "visitor" },
  omar: { name: "عمر", role: "متطوع في خدمة الزوار", kind: "resident", nb: "haram-area" },
  layla: { name: "ليلى", role: "من سكان الرصيفة", kind: "resident", nb: "rusayfah" },
  hostUm: { name: "ضيافة أم خالد", role: "مضيفة — مقدّمة التجربة", kind: "provider" },
  sufrah: { name: "سفرة العوالي", role: "حساب المطعم", kind: "provider" },
  khattShop: { name: "مرسم الخط", role: "حساب الورشة", kind: "provider" },
  guideS: { name: "سعيد", role: "مرشد محلي", kind: "provider" },
};

const CONTRIBUTIONS = [
  /* — حراء ومعرض الوحي — */
  K("question", ["culture", "firstvisit"], AUTHORS.ahmad, "أول زيارة لحي حراء مع الوالدة. كم يحتاج الوقت فعليًا، وهل المشي داخل الحي طويل؟", { obj: "hira", days: 3, helpful: 21, id: "q-hira" }),
  K("answer", ["culture"], AUTHORS.faisal, "ساعتان تكفي للمعرض وجلسة قهوة. المشي بين المرافق قصير، وفيه عربات نقل داخلية إذا احتجتوها. الأفضل تجون بعد المغرب، النهار حار.", { obj: "hira", parent: "q-hira", days: 3, helpful: 34 }),
  K("answer", ["culture"], AUTHORS.noura, "رحت مع والدتي الشهر الماضي وكانت مرتاحة. المسار داخل المعرض بدون درج، والمقاعد موجودة في أكثر من نقطة.", { obj: "hira", parent: "q-hira", days: 2, helpful: 28, visited: 30 }),
  K("experience_report", ["culture", "families"], AUTHORS.umKhalid, "زرنا معرض الوحي الخميس الماضي مع ثلاثة أطفال. المعرض منظّم والوقت مضبوط، لكن آخر جولة تمتلئ بسرعة. حجزنا قبلها بيومين.",
    { obj: "x-revelation", days: 6, helpful: 47, visited: 7, photos: 2, fields: { "كيف كان الوصول؟": "سهل — مواقف قريبة", "مناسب للأطفال؟": "نعم، من سن ٦ فأكثر", "أفضل وقت؟": "بعد المغرب", "ماذا تمنيت أن تعرف؟": "أن الحجز المسبق ضروري في الإجازة" } }),
  K("tip", ["culture"], AUTHORS.khalid, "لو زرت المعرض سابقًا، جرّب «على خطاه» هالمرة. تجربة مختلفة تمامًا وأهدأ.", { obj: "x-ala-khutah", days: 9, helpful: 19 }),

  /* — الأكل المكي — */
  K("question", ["local-food", "visitors-en"], AUTHORS.sarah, "وش أطلب في مطعم حجازي أول مرة؟ القائمة كبيرة وما أعرف من وين أبدأ.",
    { obj: "r-sufrah", days: 1, helpful: 26, lang: "ar", original: { lang: "en", text: "What should I order at a Hijazi restaurant for the first time? The menu is long and I don't know where to start." }, id: "q-food" }),
  K("answer", ["local-food"], AUTHORS.umKhalid, "اطلبي سليق وإذا حابة تجربين شي مختلف خذي «مفروكة». وإذا كنتِ لحالك نص طلب يكفي، الحصص كبيرة.", { obj: "r-sufrah", parent: "q-food", days: 1, helpful: 41 }),
  K("answer", ["local-food"], AUTHORS.abuFaisal, "أضيف: اسأل عن طبق اليوم. غالبًا أطيب من القائمة الثابتة وأرخص.", { obj: "r-sufrah", parent: "q-food", days: 1, helpful: 22 }),
  K("recommendation", ["local-food", "awali"], AUTHORS.saad, "سفرة العوالي أفضل قبل الثامنة. بعدها الانتظار يوصل نص ساعة في نهاية الأسبوع.", { obj: "r-sufrah", days: 2, helpful: 33, visited: 3 }),
  K("update", ["local-food", "awali"], AUTHORS.noura, "القسم العائلي توسّع، صار فيه طاولات أكثر من قبل.", { obj: "r-sufrah", days: 5, helpful: 12, visited: 5 }),
  K("experience_report", ["local-food"], AUTHORS.ahmad, "فول ومعصوب الحارة: رحت الساعة ٦ صباحًا وكان الزحام معقول. المعصوب ممتاز، والمكان بسيط وما فيه جلسات كثيرة.",
    { obj: "r-foul", days: 4, helpful: 29, visited: 4, fields: { "أفضل وقت؟": "قبل ٧ صباحًا", "الجلوس": "محدود", "مناسب للعائلات؟": "أفضل سفري" } }),
  K("recommendation", ["local-food", "misfalah"], AUTHORS.abuFaisal, "قهوة الحارة مكان صغير بس صاحبه يعرف زبائنه. لو تبي جلسة هادية بعد العصر، هذا مكانك.", { obj: "c-harah", days: 7, helpful: 24 }),
  K("question", ["local-food"], AUTHORS.maryam, "فيه مكان يفتح بدري للدراسة ويكون هادي؟", { days: 2, helpful: 14, id: "q-study" }),
  K("answer", ["local-food", "cafes"], AUTHORS.faisal, "مقهى الدراسة بالششة من ٨ الصباح، وفيه مقابس كثيرة. بس بعد المغرب يزدحم بالطلاب.", { obj: "c-study", parent: "q-study", days: 2, helpful: 20 }),
  K("tip", ["local-food"], AUTHORS.huda, "حلويات جرول: اطلب الكنافة قبل ١٠ مساءً، بعد كذا تكون الكمية خلصت غالبًا.", { obj: "r-sweets", days: 3, helpful: 17 }),

  /* — الوصول وسهولة الحركة — */
  K("experience_report", ["accessible", "visitors"], AUTHORS.ahmad, "المسافة على الخريطة ٤٠٠ متر، بس الطريق صاعد وفيه جزء بدون ظل. مع كرسي متحرك أخذ منا ضعف الوقت المتوقع. رجعنا بالنقل الداخلي وكان أسهل بكثير.",
    { obj: "st-ajyad", days: 4, helpful: 62, visited: 5, fields: { "كيف كان الوصول؟": "صعب مع كرسي متحرك — منحدر صاعد", "البديل الأفضل": "النقل الداخلي في أوقات الصلوات", "الوقت الفعلي": "ضعف المتوقع" } }),
  K("update", ["accessible"], AUTHORS.noura, "بيت مكي مُرمَّم: الطابق الثاني بدرج فقط، والمعرض الأرضي يغطي أغلب المحتوى.", { obj: "p-heritage-house", days: 11, helpful: 26, visited: 12 }),
  K("tip", ["accessible", "families"], AUTHORS.layla, "ممشى المستشفى بالتنعيم ممهّد بالكامل ومظلل، أنسب خيار مشي مع كبار السن عندنا.", { obj: "p-clinicwalk", days: 8, helpful: 31 }),
  K("question", ["accessible"], AUTHORS.dewi, "هل مسار مشية مكة القديمة مناسب لوالدتي الكبيرة؟",
    { obj: "x-walk-old", days: 3, helpful: 15, lang: "ar", original: { lang: "id", text: "Apakah jalur jalan kaki Makkah lama cocok untuk ibu saya yang sudah lanjut usia?" }, id: "q-walk" }),
  K("answer", ["accessible", "heritage"], AUTHORS.guideS, "المسار فيه أرصفة غير مستوية في جزء منه. نقدر نختصره ونبدأ من نقطة ثانية لو أخبرتونا قبلها. الوقت يصير ساعة بدل ساعة ونصف.", { obj: "x-walk-old", parent: "q-walk", days: 3, helpful: 27 }),

  /* — تعارض المعلومات — */
  K("update", ["museums", "visitors"], AUTHORS.khalid, "رحت متحف برج الساعة أمس الساعة ١٠:٤٥ مساءً ولقيت الدخول مقفل. الموظف قال آخر تذكرة ١٠:٣٠.", { obj: "clock-museum", days: 1, helpful: 38, visited: 1, id: "k-clock-conflict" }),
  K("answer", ["museums"], AUTHORS.saad, "أنا دخلت الأسبوع اللي طاف الساعة ١١ عادي. يمكن اختلف الجدول هالأسبوع.", { obj: "clock-museum", parent: "k-clock-conflict", days: 0.5, helpful: 12 }),

  /* — العائلات — */
  K("experience_report", ["families", "naseem"], AUTHORS.noura, "ليلة العائلة بحديقة النسيم: وصلنا ٨ وكانت المواقف ممتلئة. ركّنا بالشارع الخلفي ومشينا خمس دقائق. الأطفال استمتعوا، والعربات كثيرة.",
    { obj: "e-family-night", days: 1, helpful: 44, visited: 1, photos: 3, fields: { "الازدحام": "مرتفع بعد الثامنة", "المواقف": "امتلأت مبكرًا", "مناسب للأطفال؟": "نعم" } }),
  K("question", ["families"], AUTHORS.umKhalid, "عندنا ساعتين بس الليلة مع طفلين. وش أفضل خيار قريب ما يحتاج حجز؟", { days: 0.3, helpful: 9, id: "q-tonight" }),
  K("answer", ["families", "naseem"], AUTHORS.layla, "سوق الحرفيين المسائي بجرول ممتاز لهالوقت. مفتوح لين متأخر، وما يحتاج حجز، والأطفال يستمتعون بالعروض الحية.", { obj: "e-craft-market", parent: "q-tonight", days: 0.2, helpful: 16 }),
  K("tip", ["families"], AUTHORS.saad, "مطعم العائلة بالعوالي فيه ركن ألعاب داخلي — ينفع لو الجو حار.", { obj: "r-family-hall", days: 6, helpful: 21 }),
  K("recommendation", ["families", "kids-learning"], AUTHORS.maryam, "ورشة العلوم للأطفال بسيطة ومنظّمة، بنت أختي ٩ سنوات استفادت منها كثير.", { obj: "x-kids-science", days: 10, helpful: 18 }),

  /* — الحرف والورش — */
  K("experience_report", ["craft", "workshops"], AUTHORS.maryam, "ورشة الخط للمبتدئين: رحت لحالي وما حسيت بحرج. المجموعة صغيرة والمدرب يبدأ من الصفر. طلعت بكلمة كاملة بخط النسخ.",
    { obj: "x-khatt", days: 5, helpful: 52, visited: 6, photos: 1, fields: { "مناسب للحضور منفردًا؟": "نعم تمامًا", "تحتاج خبرة؟": "لا", "المدة الفعلية": "ساعتان" } }),
  K("question", ["craft"], AUTHORS.sarah, "هل ورشة السدو متاحة بالإنجليزية؟",
    { obj: "x-sadu", days: 4, helpful: 8, lang: "ar", original: { lang: "en", text: "Is the Sadu weaving workshop available in English?" }, id: "q-sadu" }),
  K("answer", ["craft"], AUTHORS.khattShop, "الشرح بالعربية، لكن المدربة تقدر تشرح الخطوات بالإنجليزية لو أخبرتونا عند الحجز. العمل نفسه عملي أكثر منه كلام.", { obj: "x-sadu", parent: "q-sadu", days: 4, helpful: 15 }),
  K("recommendation", ["craft"], AUTHORS.huda, "ورشة الفخار تستاهل، بس انتبهوا: القطعة تُستلم بعد أسبوع مو نفس اليوم.", { obj: "x-pottery", days: 12, helpful: 23 }),
  K("photo", ["craft", "makkah-old"], AUTHORS.abuFaisal, "من جولة التصوير المسائية الأسبوع الماضي — الضوء قبل المغرب بعشر دقائق هو الأفضل.", { obj: "x-photo-walk", days: 6, helpful: 29, photos: 4 }),

  /* — التطوع — */
  K("question", ["volunteer", "haram-service"], AUTHORS.faisal, "أول مرة أتطوع. هل التسجيل يحتاج شروط معينة؟", { obj: "e-volunteer-day", days: 2, helpful: 11, id: "q-vol" }),
  K("answer", ["volunteer"], AUTHORS.omar, "التسجيل عبر منصة الجهة نفسها، والعمر ١٨ فأكثر. فيه تدريب قصير قبل الوردية، وما تحتاج خبرة سابقة.", { obj: "e-volunteer-day", parent: "q-vol", days: 2, helpful: 26 }),
  K("experience_report", ["volunteer"], AUTHORS.omar, "الوردية الماضية كانت أربع ساعات فعلية. الأفضل تجي قبل نص ساعة عشان الترتيب والتوزيع.",
    { obj: "a-iftar-service", days: 9, helpful: 34, visited: 9, fields: { "المدة الفعلية": "٤ ساعات", "الجهد": "وقوف طويل", "تحتاج خبرة؟": "لا" } }),
  K("update", ["neighborhood-init", "awali"], AUTHORS.umKhalid, "مبادرة تنظيف الحي: الأدوات صارت متوفرة من الجمعية، ما عاد يحتاج أحد يجيب معه شي.", { obj: "a-neighborhood-cleanup", days: 3, helpful: 19 }),

  /* — الطلاب والتعلّم — */
  K("question", ["students"], AUTHORS.maryam, "متى يفتح التسجيل في الأندية الطلابية هالفصل؟", { obj: "e-student-fair", days: 2, helpful: 13, id: "q-clubs" }),
  K("answer", ["students"], AUTHORS.faisal, "الملتقى نفسه فيه تسجيل مباشر. لو ما لحقت، أغلب الأندية تفتح تسجيل إلكتروني بعده بأسبوع.", { obj: "e-student-fair", parent: "q-clubs", days: 1, helpful: 17 }),
  K("tip", ["students", "cafes"], AUTHORS.maryam, "مجموعة المذاكرة بأم القرى تحجز مقاعدها بسرعة في موسم الاختبارات. سجّل من بداية الأسبوع.", { obj: "a-student-study", days: 4, helpful: 15 }),
  K("recommendation", ["clubs", "sport"], AUTHORS.layla, "نادي مشي مكة: المسار يتغير كل أسبوع وهذا أحلى شي فيه. ما تحس بالملل.", { obj: "g-walk-club", days: 5, helpful: 27 }),
  K("experience_report", ["clubs"], AUTHORS.saad, "أمسية قرائية بالمكتبة: العدد صغير والنقاش هادئ. ينفع لو تحب تسمع أكثر من تتكلم.", { obj: "x-library-night", days: 8, helpful: 21, visited: 8 }),

  /* — الأسواق — */
  K("recommendation", ["market", "shawqiyah"], AUTHORS.huda, "سوق العتيبية بعد العصر أفضل بكثير. الصباح للبضاعة الطازجة، والمساء للحركة والأسعار.", { obj: "otaibiyah-souq", days: 3, helpful: 30 }),
  K("tip", ["market"], AUTHORS.abuFaisal, "سوق العطارة: اطلب خلطة جاهزة وجرّبها قبل ما تشتري كمية.", { obj: "p-souq-perfume", days: 10, helpful: 18 }),
  K("update", ["market", "jarwal"], AUTHORS.huda, "سوق الذهب بجرول: أغلب المحلات صارت تفتح بعد العصر فقط.", { obj: "p-souq-gold", days: 8, helpful: 22 }),
  K("question", ["market"], AUTHORS.ahmad, "وين ألقى تمور محلية بأسعار معقولة مو للسياح؟", { days: 5, helpful: 16, id: "q-dates" }),
  K("answer", ["market"], AUTHORS.saad, "سوق التمور بالششة. البائعين يخلونك تذوق قبل الشراء، والأسعار أنظف من المحلات السياحية.", { obj: "p-datemarket", parent: "q-dates", days: 5, helpful: 24 }),

  /* — مقدمو الخدمات والثقة — */
  K("experience_report", ["visitors", "heritage"], AUTHORS.khalid, "حجزت جولة مع سعيد. عرض رقم الترخيص من نفسه قبل ما أسأل، والوقت كان مضبوط.",
    { obj: "s-guide-saeed", days: 14, helpful: 33, visited: 15, fields: { "الالتزام بالوقت": "ممتاز", "اللغة": "عربي وإنجليزي", "الشفافية": "عرض الترخيص مسبقًا" } }),
  K("question", ["visitors", "firstvisit"], AUTHORS.imran, "كيف أتأكد أن المرشد مرخّص؟ وصلتني عروض من حسابات ما أعرفها.",
    { days: 6, helpful: 29, lang: "ar", original: { lang: "ur", text: "میں کیسے یقینی بناؤں کہ گائیڈ لائسنس یافتہ ہے؟ مجھے نامعلوم اکاؤنٹس سے پیشکشیں آ رہی ہیں۔" }, id: "q-guide" }),
  K("answer", ["visitors"], AUTHORS.omar, "اطلب رقم الترخيص وتأكد منه لدى الجهة المختصة. وأي أحد يطلب تحويل مبلغ كامل مقدمًا بدون عقد أو إيصال — تجنبه.", { parent: "q-guide", days: 6, helpful: 41 }),
  K("post_story", ["services-c"], AUTHORS.layla, "تجربتي مع ورشة الصيانة: جاؤوا نفس اليوم لكن السعر النهائي اختلف عن المتفق. اطلبوا السعر كتابة قبل البدء.", { obj: "s-repair", days: 16, helpful: 25 }),

  /* — مكة القديمة والحكايات — */
  K("post_story", ["makkah-old", "misfalah"], AUTHORS.abuFaisal, "أسماء الحارات القديمة تختفي شوي شوي. جدي كان يسمي المنطقة باسم ثاني تمامًا، وما عاد أحد يعرفه إلا كبار السن.", { days: 12, helpful: 58, photos: 1 }),
  K("photo", ["makkah-old"], AUTHORS.huda, "صورة للروشان من بيت قديم في جرول قبل الترميم.", { obj: "p-heritage-house", days: 20, helpful: 44, photos: 2 }),
  K("question", ["heritage"], AUTHORS.khalid, "زرت أغلب المعالم المعروفة. فيه شي أقل شهرة يستاهل؟", { days: 4, helpful: 20, id: "q-hidden" }),
  K("answer", ["heritage"], AUTHORS.faisal, "وادي العسيلة — بس لا تروح لحالك. خذ مرشد ومركبة مناسبة، والصباح الباكر أفضل بكثير.", { obj: "wadi-asilah", parent: "q-hidden", days: 4, helpful: 31 }),
  K("answer", ["heritage"], AUTHORS.noura, "ومسار عين زبيدة. قصير بس القصة اللي وراه تغيّر نظرتك للمدينة.", { obj: "x-heritage-hike", parent: "q-hidden", days: 3, helpful: 26 }),

  /* — الزوار واللغة — */
  K("question", ["visitors-en", "firstvisit"], AUTHORS.sarah, "هل أحتاج حجز مسبق للمتاحف في نهاية الأسبوع؟",
    { days: 2, helpful: 12, lang: "ar", original: { lang: "en", text: "Do I need to book museums in advance on weekends?" }, id: "q-book" }),
  K("answer", ["visitors-en"], AUTHORS.saad, "للمتاحف الكبيرة نعم، خصوصًا المساء. المعارض الصغيرة عادة ما تحتاج.", { parent: "q-book", days: 2, helpful: 18 }),
  K("recommendation", ["visitors-id"], AUTHORS.dewi, "جلسة التبادل اللغوي ساعدتني كثير في أول أسبوع. الناس متعاونين وما فيه أي إحراج.",
    { obj: "a-language-exchange", days: 7, helpful: 22, lang: "ar", original: { lang: "id", text: "Sesi pertukaran bahasa sangat membantu saya di minggu pertama. Orang-orangnya ramah." } }),
  K("tip", ["visitors"], AUTHORS.imran, "مقهى الليل بأجياد يفتح لين متأخر — مفيد بين الصلوات.",
    { obj: "c-night", days: 9, helpful: 14, lang: "ar", original: { lang: "ur", text: "اجیاد میں نائٹ کیفے دیر تک کھلا رہتا ہے — نمازوں کے درمیان مفید ہے۔" } }),

  /* — العروض — */
  K("update", ["food", "awali"], AUTHORS.saad, "عرض العشاء العائلي بسفرة العوالي شغال فعلًا، بس الفرع الثاني ما يطبّقه.", { obj: "o-sufrah-family", days: 1, helpful: 19 }),
  K("question", ["food"], AUTHORS.umKhalid, "العرض ينتهي الليلة ولا مستمر؟", { obj: "o-sufrah-family", days: 0.4, helpful: 6, id: "q-offer" }),

  /* — حالات إشراف — */
  K("post_story", ["food"], { name: "حساب جديد", role: "عضو جديد", kind: "resident" }, "أفضل مطعم في مكة بلا منازع، جربوه اليوم وخصم خاص لمتابعيني — تواصلوا معي مباشرة.",
    { days: 1, helpful: 0, flagged: { state: "held", reason: "ترويج غير مفصح عنه", note: "المحتوى قيد المراجعة — لا يُعرض ضمن التوصيات." } }),
  K("experience_report", ["food"], AUTHORS.ahmad, "الخدمة كانت بطيئة والطلب تأخر أكثر من ساعة. المكان ممتاز لكن الوقت ما كان مناسب.",
    { obj: "r-mandi", days: 3, helpful: 15, visited: 3, providerReply: { by: "مندي الهجرة", text: "نعتذر عن التأخير — كان لدينا ضغط في نهاية الأسبوع، وزدنا الطاقم منذ ذلك الوقت.", days: 2 } }),

  /* — أسئلة مفتوحة بلا إجابة بعد — */
  K("question", ["naseem", "families"], AUTHORS.layla, "فيه أحد جرّب ركن رعاية الأطفال أثناء الفعاليات؟ كيف كان؟", { obj: "s-babysit", days: 1, helpful: 7, id: "q-babysit" }),
  K("question", ["sport"], AUTHORS.maryam, "مجموعة المشي النسائية — هل القائمة معلنة للمشاركات؟", { obj: "a-women-walk", days: 2, helpful: 9, id: "q-privacy" }),
  K("answer", ["sport"], AUTHORS.noura, "لا، القائمة غير معلنة. تعرفين العدد فقط، وتشوفين من حضر عند اللقاء نفسه.", { obj: "a-women-walk", parent: "q-privacy", days: 2, helpful: 18 }),
  K("question", ["hoods", "awali"], AUTHORS.saad, "صار فيه سوق مسائي جديد بالعوالي — أحد يعرف لين متى يستمر؟", { obj: "e-neighborhood-market", days: 0.6, helpful: 8, id: "q-market" }),
  K("question", ["newcomers"], AUTHORS.dewi, "انتقلت حديثًا للعزيزية. من وين أبدأ لمعرفة خدمات الحي؟", { days: 3, helpful: 11, id: "q-new" }),
  K("answer", ["newcomers", "aziziyah"], AUTHORS.saad, "احضر لقاء الوافدين الجدد، يشرحون السكن والمدارس والخدمات في جلسة وحدة. وبعدها انضم لمجتمع الحي.", { obj: "a-newcomers", parent: "q-new", days: 3, helpful: 16 }),

  /* — الحج والعمرة — */
  K("question", ["first-umrah"], AUTHORS.imran, "أول عمرة — كم أحتاج وقت بين الوصول والبدء؟",
    { days: 5, helpful: 24, lang: "ar", original: { lang: "ur", text: "پہلا عمرہ — پہنچنے اور شروع کرنے کے درمیان کتنا وقت درکار ہے؟" }, id: "q-umrah" }),
  K("answer", ["first-umrah"], AUTHORS.omar, "يعتمد على وقت الوصول والزحام. الأفضل ترتاح أولًا وتبدأ بعد الفجر أو بعد العشاء — أهدأ.", { parent: "q-umrah", days: 5, helpful: 37 }),
  K("tip", ["campaigns"], AUTHORS.khalid, "حدّد نقطة لقاء ثابتة لمجموعتك من البداية، وخلها بعيدة عن الأبواب المزدحمة.", { days: 11, helpful: 29 }),
];

/* answer counts */
CONTRIBUTIONS.forEach((k) => {
  if (k.parent) { const p = CONTRIBUTIONS.find((x) => x.id === k.parent); if (p) p.answers = (p.answers || 0) + 1; }
});
const KB = byId(CONTRIBUTIONS);
const visible = (k, state) => (!k.flagged || k.flagged.state !== "held") && !(state?.blocked || []).includes(k.author?.name);
/* the community always reads the user's own contributions alongside the seeded ones */
const allContributions = (state) => [...(state?.contributions || []), ...CONTRIBUTIONS].filter((k) => visible(k, state));
const contributionsFor = (objId, state) => allContributions(state).filter((k) => k.obj === objId && !k.parent);
const answersFor = (kid, state) => allContributions(state).filter((k) => k.parent === kid);
const contributionsIn = (comId, state) => allContributions(state).filter((k) => k.communities.includes(comId));
const findContribution = (id, state) => KB[id] || (state?.contributions || []).find((k) => k.id === id) || null;
const CONTRIB_LABEL = {
  question: "سؤال", answer: "إجابة", experience_report: "تجربة", recommendation: "توصية",
  update: "تحديث معلومة", correction: "تصحيح", tip: "نصيحة", photo: "صورة", post_story: "حكاية",
};

/* ═══════════════════════════════════════════════════════════════════════════
   GROUP 4 FOUNDATION — FRESHNESS, SOURCE CLAIMS, LIFECYCLE, CONFLICT
   Built into the data layer from the start so discovery, decision pages and
   Plan all read the same trust state. Deepened further in the Group 4 section.
   ═══════════════════════════════════════════════════════════════════════════ */

const FRESHNESS = {
  F0: { label: "صلاحية محددة", ttlDays: null, note: "تنتهي بتاريخ معلن." },
  F1: { label: "معلومة تشغيلية لحظية", ttlDays: 0, note: "تتغير لحظيًا — تُراجع من المصدر الرسمي." },
  F2: { label: "معلومة قصيرة الأجل", ttlDays: 2, note: "تحتاج تأكيدًا حديثًا." },
  F3: { label: "معلومة تشغيلية معتادة", ttlDays: 45, note: "تُراجع دوريًا." },
  F4: { label: "معلومة وصفية مستقرة", ttlDays: 400, note: "نادرًا ما تتغير." },
};

const SOURCE_CLASS = {
  official: { label: "معلومة رسمية", tone: T.green, icon: Shield, weight: 4 },
  provider: { label: "من مقدم الخدمة", tone: "#54697E", icon: Store, weight: 3 },
  community: { label: "من المجتمع", tone: T.clay, icon: Users, weight: 2 },
  eyemakkah: { label: "سياق أضافه EyeMakkah", tone: T.brass, icon: Sparkles, weight: 1 },
};

const TRUST_STATE = {
  official: { label: "معلومة رسمية", tone: T.green, icon: Shield },
  provider: { label: "من مقدم الخدمة", tone: "#54697E", icon: Store },
  community: { label: "من المجتمع", tone: T.clay, icon: Users },
  corroborated: { label: "أكدتها مساهمات حديثة", tone: T.ok, icon: CheckCheck },
  current: { label: "معلومة حديثة", tone: T.ok, icon: Check },
  possibly_stale: { label: "قد تكون المعلومة قديمة", tone: T.warn, icon: Clock },
  conflicting: { label: "توجد معلومات متعارضة", tone: T.warn, icon: AlertTriangle },
  expired: { label: "انتهت الصلاحية", tone: T.warn, icon: X },
  insufficient: { label: "لم نتمكن من التحقق", tone: T.muted, icon: HelpCircle },
};

/* Explicit competing claims — credible sources that materially disagree.
   EyeMakkah never silently picks one. */
const CONFLICT_CLAIMS = [
  { id: "clock:hours:community", obj: "clock-museum", field: "ساعات الزيارة", cls: "community",
    value: "آخر دخول ١٠:٣٠ م — الباب أُغلق الساعة ١٠:٤٥", at: daysAgo(1), fresh: "F2",
    by: "خالد — زائر متكرر", note: "زيارة ميدانية أمس" },
  { id: "gold:hours:community", obj: "p-souq-gold", field: "الدوام", cls: "community",
    value: "أغلب المحلات تفتح بعد العصر فقط", at: daysAgo(8), fresh: "F3", by: "هدى — من أهل جرول" },
];

/* A resolution exists for the Clock Tower conflict — a newer provider statement.
   It is not applied until it actually arrives (the user can pull it in from the
   source sheet, which mirrors how a real refresh would behave). */
const CONFLICT_RESOLUTIONS = {
  "clock-museum:ساعات الزيارة": {
    cls: "provider", value: "جدول الشتاء: آخر دخول ١٠:٣٠ م — الإغلاق ١١:٠٠ م", at: daysAgo(0.2), fresh: "F3",
    note: "تحديث من المشغّل يوضّح اختلاف آخر موعد دخول عن موعد الإغلاق.",
  },
};

INVENTORY.forEach((o) => {
  const extra = CONFLICT_CLAIMS.filter((c) => c.obj === o.id);
  if (extra.length) o.claims = [...o.claims, ...extra];
});

function claimAgeDays(c) { return (t0 - new Date(c.at).getTime()) / DAY; }

function claimState(c) {
  const policy = FRESHNESS[c.fresh] || FRESHNESS.F3;
  if (policy.ttlDays === null) return "current";
  if (policy.ttlDays === 0) return "insufficient";
  return claimAgeDays(c) > policy.ttlDays ? "possibly_stale" : "current";
}

/* Field-level trust: which sources speak about this field, do they agree, how old. */
function fieldTrust(obj, fieldLabel, resolved) {
  const claims = (obj.claims || []).filter((c) => c.field === fieldLabel);
  if (!claims.length) return { state: "insufficient", claims: [] };
  const resolution = resolved && resolved[`${obj.id}:${fieldLabel}`];
  const all = resolution ? [...claims, { id: "res", obj: obj.id, field: fieldLabel, ...resolution }] : claims;
  const values = uniq(all.map((c) => c.value));
  const byClass = uniq(all.map((c) => c.cls));
  let state;
  if (resolution) state = "current";
  else if (values.length > 1 && byClass.length > 1) state = "conflicting";
  else if (all.filter((c) => c.cls === "community").length >= 2 && values.length === 1) state = "corroborated";
  else state = claimState(all.slice().sort((a, b) => new Date(b.at) - new Date(a.at))[0]);
  const primary = all.slice().sort((a, b) =>
    (SOURCE_CLASS[b.cls].weight - SOURCE_CLASS[a.cls].weight) || (new Date(b.at) - new Date(a.at)))[0];
  return { state, claims: all, primary, resolution: !!resolution };
}

/* Object-level trust summary — the worst material state wins, but desirability
   is never hidden behind it. */
function objectTrust(obj, resolved) {
  const fields = uniq((obj.claims || []).map((c) => c.field));
  const results = fields.map((f) => ({ field: f, ...fieldTrust(obj, f, resolved) }));
  const has = (s) => results.some((r) => r.state === s);
  const life = lifecycleOf(obj);
  let state = "current";
  if (life === "expired" || life === "ended") state = "expired";
  else if (has("conflicting")) state = "conflicting";
  else if (has("possibly_stale")) state = "possibly_stale";
  else if (has("corroborated")) state = "corroborated";
  else if (obj.real) state = "official";
  else state = "provider";
  return { state, fields: results, lifecycle: life };
}

/* ───────── Lifecycle ───────── */
function lifecycleOf(o) {
  const tm = o.timing;
  if (o.type === "offer" && tm && tm.kind === "window") {
    const to = new Date(tm.to).getTime();
    if (to < t0) return "expired";
    if (to - t0 < 12 * HOUR) return "ending";
    return "active";
  }
  if (o.type === "event" && tm) {
    if (tm.kind === "session") {
      const s = new Date(tm.start).getTime(), e = new Date(tm.end).getTime();
      if (t0 > e + 7 * DAY) return "archived";
      if (t0 > e) return "ended";
      if (t0 >= s) return "live";
      if (s - t0 < 3 * HOUR) return "soon";
      return "upcoming";
    }
    if (tm.kind === "window") {
      const f = new Date(tm.from).getTime(), to = new Date(tm.to).getTime();
      if (t0 > to) return "ended";
      if (t0 >= f) return "live";
      return "upcoming";
    }
  }
  if (o.type === "recurring" || o.groupState) {
    if (o.groupState === "dormant") return "dormant";
    if (o.groupState === "paused") return "paused";
    return "active";
  }
  if (o.type === "activity" && tm && tm.kind === "session") {
    const s = new Date(tm.start).getTime(), e = new Date(tm.end).getTime();
    if (t0 > e) return "ended";
    if (t0 >= s) return "live";
    if (s - t0 < 3 * HOUR) return "soon";
    return "upcoming";
  }
  return "active";
}

const LIFECYCLE_LABEL = {
  upcoming: "قادم", soon: "يبدأ قريبًا", live: "جارٍ الآن", ended: "انتهى", archived: "في الأرشيف",
  active: "متاح", ending: "ينتهي قريبًا", expired: "منتهٍ", paused: "متوقف مؤقتًا", dormant: "غير نشط",
};

/* Should this object be promoted in active discovery? Expired and ended content
   must stop contaminating the feed. */
function isPromotable(o) {
  const l = lifecycleOf(o);
  return !["ended", "archived", "expired", "dormant", "paused"].includes(l);
}

/* Next occurrence for recurring things, so "when" is always answerable. */
function nextOccurrence(o) {
  const tm = o.timing;
  if (!tm) return null;
  if (tm.kind === "session") return new Date(tm.start);
  if (tm.kind === "window") return new Date(tm.from) > NOW ? new Date(tm.from) : null;
  if (tm.kind === "recurring") {
    const l = mk(NOW);
    const delta = (tm.dayIdx - l.getUTCDay() + 7) % 7;
    let inst = Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() + delta, tm.hour, tm.minute || 0) - TZ;
    if (inst < t0) inst += 7 * DAY;
    return new Date(inst);
  }
  return null;
}

function isOpenNow(o) {
  const tm = o.timing;
  if (!tm || tm.kind !== "hours") return null;
  const h = mkHour();
  const { open, close } = tm;
  return close > open ? h >= open && h < close : h >= open || h < close;
}

function timingLabel(o) {
  const tm = o.timing;
  if (!tm) return null;
  if (tm.kind === "hours") {
    const open = isOpenNow(o);
    return open === null ? null : open ? "مفتوح الآن" : "مغلق الآن";
  }
  const next = nextOccurrence(o);
  if (!next) return LIFECYCLE_LABEL[lifecycleOf(o)];
  const life = lifecycleOf(o);
  if (life === "live") return "جارٍ الآن";
  if (life === "ended" || life === "archived") return "انتهى";
  return inAr(next);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RELEVANCE — the invisible half of the product
   Precedence: safety/authoritative → hard constraints → active plan → intent →
   time & permitted location → explicit preferences → recent high-confidence
   actions → joined communities → long-term affinity → quality → novelty.
   Every boost can explain itself in one human sentence.
   ═══════════════════════════════════════════════════════════════════════════ */

function scoreObject(o, ctx) {
  const why = [];
  let s = 0;
  const add = (v, reason) => { s += v; if (reason && v > 0) why.push(reason); };

  /* hard constraints first — these are filters expressed as scores of -Infinity */
  if (ctx.access?.includes("stepfree") && o.suit.includes("stepfree")) add(28, "مسار بدون درج حسب تفضيلك");
  if (ctx.access?.includes("stepfree") && (o.facts || []).some((f) => /درج|منحدر صاعد|غير مستوية|غير ممهّدة/.test(f.value))) add(-40, null);
  if (ctx.party === "kids" && o.suit.includes("kids")) add(18, "مناسب للأطفال");
  if (ctx.party === "kids" && o.cat === "cafe") add(-6, null);
  if (ctx.womenOnly && o.suit.includes("women")) add(16, "نشاط مخصص للنساء");

  /* active plan continuity */
  if (ctx.planNeighborhoods?.includes(o.neighborhood)) add(22, "قريب من شيء في خطتك");
  if (ctx.planCategories?.includes(o.category) && o.type !== "event") add(6, null);

  /* current intent (search / chosen filter) */
  if (ctx.intentCategory && o.category === ctx.intentCategory) add(26, "يطابق ما تبحث عنه الآن");
  if (ctx.intentSuit && o.suit.includes(ctx.intentSuit)) add(14, null);

  /* time */
  const life = lifecycleOf(o);
  if (!isPromotable(o)) add(-1000, null);
  if (life === "soon") add(24, "يبدأ قريبًا");
  if (life === "live") add(20, "جارٍ الآن");
  if (life === "ending") add(18, "ينتهي قريبًا");
  const open = isOpenNow(o);
  if (open === true) add(10, "مفتوح الآن");
  if (open === false) add(-14, null);
  if (ctx.evening && o.suit.includes("evening")) add(10, "يناسب هذا الوقت من اليوم");
  if (ctx.shortWindow && (o.duration == null || o.duration <= 90)) add(12, "يناسب الوقت المتاح لديك");
  if (ctx.shortWindow && o.duration > 150) add(-16, null);

  /* permitted location */
  if (ctx.locationGranted) {
    const km = distanceKm(o, ctx.from);
    if (km < 1.2) add(16, "قريب منك الآن");
    else if (km < 3) add(9, null);
    else if (km > 8) add(-10, null);
  } else if (ctx.nb && o.neighborhood === ctx.nb) add(12, `في ${NB[ctx.nb]?.name || "منطقتك"}`);

  /* explicit preferences */
  if (ctx.interests?.includes(o.category)) add(20, `اخترت «${CAT[o.category]?.name}» ضمن اهتماماتك`);
  if (ctx.firstTime && o.suit.includes("firsttime")) add(16, "بداية مناسبة لأول زيارة");
  if (ctx.timeAvailable && o.duration != null) {
    if (o.duration <= ctx.timeAvailable * 0.75) add(10, `يناسب ${minutesAr(ctx.timeAvailable)} المتاحة لديك`);
    else if (o.duration > ctx.timeAvailable) add(-22, null);
  }

  /* recent high-confidence behaviour */
  const aff = ctx.affinity || {};
  const catAff = aff[o.category] || 0;
  if (catAff > 0) add(Math.min(18, catAff * 6), catAff >= 2 ? `تتفاعل كثيرًا مع ${CAT[o.category]?.name}` : null);
  if (catAff < 0) add(Math.max(-18, catAff * 7), null);
  const nbAff = aff["nb:" + o.neighborhood] || 0;
  if (nbAff > 0) add(Math.min(12, nbAff * 5), nbAff >= 2 ? `تهتم بما يحدث في ${NB[o.neighborhood]?.name}` : null);

  /* communities */
  if (o.communities?.some((c) => ctx.joinedCommunities?.includes(c))) {
    const c = o.communities.find((x) => ctx.joinedCommunities?.includes(x));
    add(15, `من ${COM[c]?.name || "مجتمع تتابعه"}`);
  }

  /* trust & freshness affect ranking, never silently hide the object */
  const trust = objectTrust(o, ctx.resolved);
  if (trust.state === "conflicting") add(-8, null);
  if (trust.state === "possibly_stale") add(-6, null);
  if (trust.state === "corroborated") add(8, "أكدتها مساهمات حديثة");

  /* quality and popularity come late on purpose */
  add(o.popularity * 8, null);

  /* novelty — a repeat user should not be trapped in the same loop */
  if (ctx.completed?.[o.id]) add(-70, null);
  if (ctx.completedCategories?.[o.category] >= 2) add(-6, null);
  if (ctx.noveltySeeking) add(o.novelty * 22, o.novelty > 0.75 ? "جديد عليك — لم تجرّبه بعد" : null);
  else add(o.novelty * 6, null);

  /* explicit negative feedback — one dismissal is not a permanent dislike */
  const d = ctx.dismissed?.[o.id];
  if (d) add(d >= 2 ? -90 : -34, null);

  /* seen-recently damping keeps browsing from looping */
  const seen = ctx.seen?.[o.id] || 0;
  add(-Math.min(14, seen * 3.5), null);

  if (ctx.saved?.[o.id]) add(6, "محفوظ لديك");
  return { score: s, why: uniq(why) };
}

/* Some explanations say more about *you* than others; show those first. */
const GENERIC_REASON = /^(مفتوح الآن|يبدأ قريبًا|جارٍ الآن|ينتهي قريبًا|يناسب هذا الوقت من اليوم)$/;
function reasonRank(r) {
  if (/اخترت|تتفاعل|تهتم|أول زيارة|خطتك|مجتمع|جديد عليك|محفوظ/.test(r)) return 3;
  if (/قريب منك|في /.test(r)) return 2;
  if (GENERIC_REASON.test(r)) return 0;
  return 1;
}

/* Diversity-aware ranking: no module should read like one category on repeat. */
function rank(list, ctx, opts = {}) {
  const { limit = 8, maxPerCategory = 2, maxPerNeighborhood = 3, types, exclude = [] } = opts;
  const scored = list
    .filter((o) => !exclude.includes(o.id))
    .filter((o) => (types ? types.includes(o.type) : true))
    .map((o) => ({ o, ...scoreObject(o, ctx) }))
    .filter((x) => x.score > -500)
    .sort((a, b) => b.score - a.score);

  const out = [], cats = {}, nbs = {}, usedReasons = new Set();
  for (const x of scored) {
    const c = x.o.category, n = x.o.neighborhood;
    if ((cats[c] || 0) >= maxPerCategory) continue;
    if ((nbs[n] || 0) >= maxPerNeighborhood) continue;
    cats[c] = (cats[c] || 0) + 1; nbs[n] = (nbs[n] || 0) + 1;
    /* one module should not repeat the same explanation on every row: prefer the
       most specific reason that has not been used yet in this list */
    const ordered = x.why.slice().sort((a, b) => reasonRank(b) - reasonRank(a));
    const fresh = ordered.find((r) => !usedReasons.has(r));
    const why = fresh ? [fresh, ...ordered.filter((r) => r !== fresh)] : ordered;
    if (why[0]) usedReasons.add(why[0]);
    out.push({ ...x, why });
    if (out.length >= limit) break;
  }
  return out;
}

/* Multi-object search across the whole inventory + communities + contributions. */
function searchAll(q, ctx) {
  const needle = q.trim();
  if (!needle) return { objects: [], communities: [], contributions: [] };
  const terms = needle.split(/\s+/).filter(Boolean);
  const match = (text) => { const t = String(text || ""); return terms.every((x) => t.includes(x)); };
  const loose = (text) => { const t = String(text || ""); return terms.some((x) => t.includes(x)); };

  const objects = INVENTORY
    .map((o) => {
      const hay = [o.name, o.tagline, o.about, CAT[o.category]?.name, NB[o.neighborhood]?.name, PROV[o.provider]?.name, ...(o.suit || []).map((s) => SUIT[s])].join(" · ");
      let sc = 0;
      if (match(o.name)) sc += 60;
      if (match(hay)) sc += 30;
      else if (loose(hay)) sc += 10;
      if (!isPromotable(o)) sc -= 25;
      if (sc <= 0) return null;
      const r = scoreObject(o, ctx);
      return { o, score: sc + r.score * 0.35, why: r.why };
    })
    .filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 24);

  const communities = COMMUNITIES.filter((c) => c.kind !== "family" && (match(c.name) || loose(c.name + " " + c.blurb))).slice(0, 6);
  const contributions = CONTRIBUTIONS.filter((k) => !k.flagged && (match(k.body) || loose(k.body))).slice(0, 6);
  return { objects, communities, contributions };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MODEL & STORE
   Action is first-class data. Every meaningful action is appended to one log
   which drives Plan state, personalization and the interaction analytics that
   the backend intelligence layer would consume. Nothing is overwritten.

   SEMANTICS THAT NEVER COLLAPSE:
   حفظ ≠ أضف إلى خطتي ≠ انضم ≠ سأحضر ≠ حجز ≠ مؤكد ≠ حضرت
   ═══════════════════════════════════════════════════════════════════════════ */

const ACTION_WEIGHT = {
  view: 0.15, search: 0.2, save: 1.2, plan: 1.8, join: 2.2, going: 2.2, register: 2.4,
  book_outbound: 2, book_confirmed: 3, directions: 1.2, complete: 3, contribute: 2.4,
  helpful: 0.8, join_community: 2, dismiss: -2.2, redeem: 2,
};

const PLAN_STATE = {
  interested: { label: "مهتم به", tone: T.muted, icon: Heart, bucket: "interested" },
  saved: { label: "محفوظ لوقت لاحق", tone: T.muted, icon: Bookmark, bucket: "saved" },
  planned: { label: "في خطتي", tone: T.green, icon: CalendarCheck, bucket: "upcoming" },
  going: { label: "سأحضر", tone: T.green, icon: Users, bucket: "upcoming" },
  registered: { label: "مسجَّل", tone: T.green, icon: Check, bucket: "upcoming" },
  awaiting: { label: "بانتظار تأكيد الحجز", tone: T.warn, icon: Clock, bucket: "upcoming" },
  confirmed: { label: "مؤكد", tone: T.ok, icon: CheckCheck, bucket: "confirmed" },
  active: { label: "جارٍ الآن", tone: T.clay, icon: CircleDot, bucket: "now" },
  completed: { label: "مكتمل", tone: T.muted, icon: Check, bucket: "completed" },
  cancelled: { label: "ملغى", tone: T.muted, icon: X, bucket: "completed" },
};

const allNotifications = (state) => {
  const auto = buildNotifications(state).filter((n) => !state.notificationsRead?.[n.id]);
  return [...state.notifications, ...auto].sort((a, b) => new Date(b.at) - new Date(a.at));
};

const PLAN_BUCKETS = [
  { id: "now", label: "الآن" },
  { id: "today", label: "اليوم" },
  { id: "upcoming", label: "قادم" },
  { id: "confirmed", label: "مؤكد" },
  { id: "interested", label: "مهتم به" },
  { id: "saved", label: "محفوظ لوقت لاحق" },
  { id: "completed", label: "مكتمل" },
];

const initialState = (seed = {}) => ({
  profile: {
    mode: "resident",            // resident | visitor
    firstTime: false,
    nb: "awali",
    party: "solo",               // solo | family | kids | group
    womenOnly: false,
    access: [],                  // stepfree ...
    interests: ["food", "culture"],
    lang: "ar",
    locationGranted: false,
    personalization: true,
    notifications: false,
    reduceRepetition: true,
    timeAvailable: null,        // null | 60 | 120 | 240 minutes
    textScale: 1,
    autoTranslate: true,
    ...(seed.profile || {}),
  },
  log: seed.log || [],
  saved: {},
  plan: [],                       // [{ id, obj, state, at, note, outboundAt, confirmedAt }]
  joinedCommunities: ["awali", "food"],
  followedCommunities: ["local-food"],
  helpful: {},
  contributions: [],              // user-authored
  dismissed: {},
  completedCats: {},
  seen: {},
  resolved: {},                   // conflict resolutions the user pulled in
  reported: {},
  blocked: [],
  notifications: [],
  notificationsRead: {},
  removedInterests: [],
  reviews: [],
  translated: {},
  providerId: "craft-khatt",
  providerReplies: {},
  publishedIds: [],
  lastDismissReason: null,
  ...seed,
});

function planIndex(state, objId) { return state.plan.findIndex((p) => p.obj === objId); }

function upsertPlan(state, objId, next, extra = {}) {
  const i = planIndex(state, objId);
  const plan = state.plan.slice();
  if (i === -1) plan.push({ id: `pl${plan.length + 1}-${objId}`, obj: objId, state: next, at: new Date(t0), ...extra });
  else plan[i] = { ...plan[i], state: next, ...extra };
  return plan;
}

function logOf(state, type, objId, meta) {
  return [...state.log, { id: `ev${state.log.length + 1}`, type, obj: objId || null, at: new Date(t0 + state.log.length * 1000), meta: meta || null }];
}

function reducer(state, a) {
  switch (a.type) {
    case "view": {
      const seen = { ...state.seen, [a.obj]: (state.seen[a.obj] || 0) + 1 };
      return { ...state, seen, log: logOf(state, "view", a.obj, a.meta) };
    }
    case "search": return { ...state, log: logOf(state, "search", null, { q: a.q }) };

    case "save": {
      const on = !state.saved[a.obj];
      const saved = { ...state.saved };
      if (on) saved[a.obj] = new Date(t0); else delete saved[a.obj];
      let plan = state.plan;
      if (!on) { const i = planIndex(state, a.obj); if (i > -1 && plan[i].state === "saved") plan = plan.filter((p) => p.obj !== a.obj); }
      else plan = upsertPlan(state, a.obj, state.plan[planIndex(state, a.obj)]?.state && state.plan[planIndex(state, a.obj)]?.state !== "saved" ? state.plan[planIndex(state, a.obj)].state : "saved");
      return { ...state, saved, plan, log: logOf(state, on ? "save" : "unsave", a.obj) };
    }
    case "interested": return { ...state, plan: upsertPlan(state, a.obj, "interested"), log: logOf(state, "interested", a.obj) };
    case "plan": return { ...state, plan: upsertPlan(state, a.obj, "planned", { note: a.note || null }), log: logOf(state, "plan", a.obj) };
    case "join": return { ...state, plan: upsertPlan(state, a.obj, "going"), log: logOf(state, "join", a.obj) };
    case "register": return { ...state, plan: upsertPlan(state, a.obj, "registered"), log: logOf(state, "register", a.obj) };
    case "book_outbound": return { ...state, plan: upsertPlan(state, a.obj, "awaiting", { outboundAt: new Date(t0) }), log: logOf(state, "book_outbound", a.obj, { provider: a.provider }) };
    case "book_confirm": return {
      ...state, plan: upsertPlan(state, a.obj, "confirmed", { confirmedAt: new Date(t0), confirmSource: a.source || "user" }),
      log: logOf(state, "book_confirmed", a.obj, { source: a.source || "user" }),
    };
    case "book_fail": return { ...state, plan: upsertPlan(state, a.obj, "planned", { failed: true }), log: logOf(state, "book_failed", a.obj) };
    case "start": return { ...state, plan: upsertPlan(state, a.obj, "active", { startedAt: new Date(t0) }), log: logOf(state, "start", a.obj) };
    case "complete": {
      const o = getObj(a.obj);
      return {
        ...state,
        plan: upsertPlan(state, a.obj, "completed", { completedAt: new Date(t0) }),
        completedCats: { ...state.completedCats, [o?.category]: (state.completedCats[o?.category] || 0) + 1 },
        log: logOf(state, "complete", a.obj),
      };
    }
    case "cancel": return { ...state, plan: upsertPlan(state, a.obj, "cancelled"), log: logOf(state, "cancel", a.obj) };
    case "remove_plan": return { ...state, plan: state.plan.filter((p) => p.obj !== a.obj), log: logOf(state, "remove_plan", a.obj) };
    case "directions": return { ...state, log: logOf(state, "directions", a.obj) };
    case "redeem": return { ...state, plan: upsertPlan(state, a.obj, "planned"), log: logOf(state, "redeem", a.obj) };

    case "dismiss": {
      const n = (state.dismissed[a.obj] || 0) + 1;
      return { ...state, dismissed: { ...state.dismissed, [a.obj]: n }, lastDismissReason: a.reason || null, log: logOf(state, "dismiss", a.obj, { reason: a.reason, count: n }) };
    }
    case "undismiss": { const d = { ...state.dismissed }; delete d[a.obj]; return { ...state, dismissed: d, log: logOf(state, "undismiss", a.obj) }; }

    case "helpful": {
      const on = !state.helpful[a.k];
      const helpful = { ...state.helpful };
      if (on) helpful[a.k] = true; else delete helpful[a.k];
      return { ...state, helpful, log: logOf(state, on ? "helpful" : "unhelpful", null, { k: a.k }) };
    }
    case "contribute": {
      const c = { ...a.contribution, id: `u${state.contributions.length + 1}`, at: new Date(t0), mine: true };
      if (c.type === "correction" && c.obj) {
        return {
          ...state,
          contributions: [c, ...state.contributions],
          reviews: [{ id: `rv${(state.reviews || []).length + 1}`, obj: c.obj, body: c.body, at: new Date(t0), state: "pending" }, ...(state.reviews || [])],
          log: logOf(state, "correction", c.obj, { type: c.type }),
        };
      }
      const notifications = a.expectAnswer
        ? [{ id: `n${state.notifications.length + 1}`, kind: "answer", k: c.id, obj: c.obj, at: new Date(t0 + 90000), read: false,
             title: "وصلتك إجابة على سؤالك", body: a.expectAnswer }, ...state.notifications]
        : state.notifications;
      return { ...state, contributions: [c, ...state.contributions], notifications, log: logOf(state, "contribute", c.obj, { type: c.type }) };
    }
    case "join_community": {
      const on = !state.joinedCommunities.includes(a.com);
      return {
        ...state,
        joinedCommunities: on ? [...state.joinedCommunities, a.com] : state.joinedCommunities.filter((x) => x !== a.com),
        log: logOf(state, on ? "join_community" : "leave_community", null, { com: a.com }),
      };
    }
    case "follow_community": {
      const on = !state.followedCommunities.includes(a.com);
      return { ...state, followedCommunities: on ? [...state.followedCommunities, a.com] : state.followedCommunities.filter((x) => x !== a.com), log: logOf(state, "follow_community", null, { com: a.com }) };
    }
    case "resolve": return { ...state, resolved: { ...state.resolved, [a.key]: CONFLICT_RESOLUTIONS[a.key] }, log: logOf(state, "trust_resolved", a.obj, { key: a.key }) };
    case "report": return { ...state, reported: { ...state.reported, [a.k]: a.reason || "مخالفة" }, log: logOf(state, "report", null, { k: a.k, reason: a.reason }) };
    case "block": return { ...state, blocked: uniq([...state.blocked, a.who]), log: logOf(state, "block", null, { who: a.who }) };
    case "translate": return { ...state, translated: { ...state.translated, [a.k]: !state.translated[a.k] }, log: logOf(state, "translate", null, { k: a.k }) };

    case "profile": return { ...state, profile: { ...state.profile, ...a.patch }, log: logOf(state, "profile", null, a.patch) };
    case "provider_update": {
      patchObjectFact(a.obj, a.label, a.value);
      return { ...state, log: logOf(state, "provider_update", a.obj, { field: a.label }) };
    }
    case "provider_state": {
      setGroupState(a.obj, a.state);
      return { ...state, log: logOf(state, "provider_state", a.obj, { state: a.state }) };
    }
    case "provider_publish": {
      const o = registerObject(a.raw, a.objType);
      return { ...state, publishedIds: [...state.publishedIds, o.id], log: logOf(state, "provider_publish", o.id, { type: o.type }) };
    }
    case "provider_reply": {
      const k = KB[a.k] || state.contributions.find((x) => x.id === a.k);
      if (k) k.providerReply = { by: PROV[state.providerId]?.name || "مقدّم الخدمة", text: a.text, days: 0 };
      return { ...state, providerReplies: { ...state.providerReplies, [a.k]: a.text }, log: logOf(state, "provider_reply", k?.obj || null, { k: a.k }) };
    }
    case "remove_interest": return {
      ...state,
      profile: { ...state.profile, interests: state.profile.interests.filter((i) => i !== a.interest) },
      removedInterests: uniq([...state.removedInterests, a.interest]),
      log: logOf(state, "correct_interest", null, { removed: a.interest }),
    };
    case "notify": return { ...state, notifications: [{ id: `n${state.notifications.length + 1}`, at: new Date(t0), read: false, ...a.n }, ...state.notifications] };
    case "read_notification": return {
      ...state,
      notifications: state.notifications.map((n) => (n.id === a.id ? { ...n, read: true } : n)),
      notificationsRead: { ...(state.notificationsRead || {}), [a.id]: true },
    };
    case "read_all": return {
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      notificationsRead: Object.fromEntries(allNotifications(state).map((n) => [n.id, true])),
    };
    case "seed": return { ...a.state };
    default: return state;
  }
}

/* Notifications exist to be useful. Each candidate must point at something that
   actually changed for this user; nothing is generated to "bring you back". */
function buildNotifications(state) {
  if (!state.profile.notifications) return [];
  const out = [];
  const add = (n) => out.push({ id: "auto-" + n.key, read: false, ...n });

  /* a saved offer is about to expire */
  Object.keys(state.saved).forEach((id) => {
    const o = getObj(id);
    if (o?.type === "offer" && lifecycleOf(o) === "ending") {
      add({ key: "offer-" + id, kind: "offer", obj: id, at: new Date(t0 - 20 * MIN),
        title: "العرض الذي حفظته ينتهي الليلة", body: `${o.name} — تأكد من الشروط قبل الذهاب.` });
    }
  });

  /* something in your plan starts soon */
  state.plan.filter((p) => ["confirmed", "registered", "going", "planned"].includes(p.state)).forEach((p) => {
    const o = getObj(p.obj); if (!o) return;
    const n = nextOccurrence(o);
    if (n && n - t0 > 0 && n - t0 < 6 * HOUR) {
      add({ key: "plan-" + p.obj, kind: "plan", obj: p.obj, at: new Date(t0 - 12 * MIN),
        title: `${o.name} ${inAr(n)}`, body: [NB[o.neighborhood]?.name, o.duration ? minutesAr(o.duration) : null].filter(Boolean).join(" — ") });
    }
  });

  /* a fact your plan depends on became disputed */
  state.plan.filter((p) => !["completed", "cancelled", "saved"].includes(p.state)).forEach((p) => {
    const o = getObj(p.obj); if (!o) return;
    const tr = objectTrust(o, state.resolved);
    if (tr.state === "conflicting") {
      add({ key: "trust-" + p.obj, kind: "trust", obj: p.obj, at: new Date(t0 - 40 * MIN),
        title: "معلومة في خطتك تحتاج مراجعة", body: `${o.name} — مصدران يذكران وقتين مختلفين.` });
    }
  });

  /* your club meets this week */
  CLUBS.filter((cl) => cl.state === "active" && state.joinedCommunities.includes(cl.community)).slice(0, 2).forEach((cl) => {
    const act = getObj(cl.activity); const n = act && nextOccurrence(act);
    if (n && n - t0 < 4 * DAY) {
      add({ key: "club-" + cl.id, kind: "club", obj: cl.activity, at: new Date(t0 - 3 * HOUR),
        title: `نشاط مجموعتك ${inAr(n)}`, body: `${cl.name} — ${cl.cadence}` });
    }
  });

  /* registration opened for something you were interested in */
  state.plan.filter((p) => p.state === "interested").slice(0, 2).forEach((p) => {
    const o = getObj(p.obj); if (!o || !["event", "activity", "experience"].includes(o.type)) return;
    add({ key: "reg-" + p.obj, kind: "plan", obj: p.obj, at: new Date(t0 - 90 * MIN),
      title: "نشاط سجّلت اهتمامك به بدأ التسجيل له", body: o.name });
  });

  return out.sort((a, b) => new Date(b.at) - new Date(a.at));
}

/* Derived personalization context. Views count for little; explicit and
   behavioural actions count for more; a single dismissal is not an identity. */
function deriveContext(state, extra = {}) {
  const affinity = {};
  const bump = (k, v) => { affinity[k] = (affinity[k] || 0) + v; };
  for (const ev of state.log) {
    const w = ACTION_WEIGHT[ev.type];
    if (!w) continue;
    const o = ev.obj ? getObj(ev.obj) : null;
    if (o) { bump(o.category, w); bump("nb:" + o.neighborhood, w * 0.6); }
    if (ev.type === "join_community" && ev.meta?.com) {
      const c = COM[ev.meta.com];
      if (c?.nb) bump("nb:" + c.nb, 1.2);
    }
  }
  for (const i of state.profile.interests) bump(i, 2);
  for (const i of state.removedInterests) bump(i, -4);

  const active = state.plan.filter((p) => ["planned", "going", "registered", "confirmed", "active", "awaiting"].includes(p.state));
  const completed = {};
  state.plan.filter((p) => p.state === "completed").forEach((p) => { completed[p.obj] = true; });
  const hour = Math.floor(mkHour());

  return {
    mode: state.profile.mode,
    nb: state.profile.nb,
    from: state.profile.locationGranted ? { x: NB[state.profile.nb]?.x ?? 0.5, y: NB[state.profile.nb]?.y ?? 0.5 } : null,
    locationGranted: state.profile.locationGranted,
    interests: state.profile.personalization ? state.profile.interests : [],
    access: state.profile.access,
    party: state.profile.party,
    womenOnly: state.profile.womenOnly,
    affinity: state.profile.personalization ? affinity : {},
    joinedCommunities: state.joinedCommunities,
    saved: state.saved,
    dismissed: state.dismissed,
    seen: state.seen,
    completed,
    completedCategories: state.completedCats,
    resolved: state.resolved,
    planNeighborhoods: uniq(active.map((p) => getObj(p.obj)?.neighborhood).filter(Boolean)),
    planCategories: uniq(active.map((p) => getObj(p.obj)?.category).filter(Boolean)),
    evening: hour >= 16 || hour < 2,
    firstTime: state.profile.firstTime,
    timeAvailable: state.profile.timeAvailable,
    shortWindow: state.profile.timeAvailable != null && state.profile.timeAvailable <= 120,
    noveltySeeking: state.profile.mode === "resident" || Object.keys(completed).length >= 2,
    ...extra,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP CONTEXT + UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════════════════ */

const App = createContext(null);
const useApp = () => useContext(App);

function Pill({ children, tone = T.muted, bg, icon: Icon, size = 11, strong }) {
  return (
    <span className="row" style={{
      gap: 4, fontSize: size, fontWeight: strong ? 800 : 700, color: tone,
      background: bg || "transparent", border: bg ? "none" : `1px solid ${tone}33`,
      padding: bg ? "3px 8px" : "2px 7px", borderRadius: R.pill, whiteSpace: "nowrap", lineHeight: 1.6,
    }}>
      {Icon && <Icon size={size + 1} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

function Chip({ children, active, onClick, icon: Icon, tone = T.ink }) {
  return (
    <button className="press" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: R.pill,
      background: active ? T.deep : T.paper, color: active ? "#F6EFE0" : tone,
      border: `1px solid ${active ? T.deep : T.line}`, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {Icon && <Icon size={14} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

function SectionTitle({ title, sub, action, onAction, tone = T.ink }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 10, padding: "0 16px", marginBottom: 10 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: tone, letterSpacing: "-.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3, lineHeight: 1.6 }}>{sub}</div>}
      </div>
      {action && <button className="press" onClick={onAction} style={{ fontSize: 12.5, fontWeight: 800, color: T.green, whiteSpace: "nowrap" }}>{action}</button>}
    </div>
  );
}

function Divider({ m = 16 }) { return <div style={{ height: 1, background: T.lineSoft, margin: `${m}px 16px` }} />; }

function TrustChip({ state, small }) {
  const s = TRUST_STATE[state] || TRUST_STATE.insufficient;
  const Icon = s.icon;
  return (
    <span className="row" style={{
      gap: 4, fontSize: small ? 10.5 : 11.5, fontWeight: 700, color: s.tone,
      background: `${s.tone}14`, padding: small ? "2px 7px" : "3px 9px", borderRadius: R.pill, whiteSpace: "nowrap",
    }}>
      <Icon size={small ? 11 : 12.5} strokeWidth={2.4} />{s.label}
    </span>
  );
}

function FreshnessChip({ o, small }) {
  const { state } = useApp();
  const tr = objectTrust(o, state.resolved);
  if (!["conflicting", "possibly_stale"].includes(tr.state)) return null;
  return <TrustChip state={tr.state} small={small} />;
}

function LifecycleChip({ o }) {
  const l = lifecycleOf(o);
  if (l === "active") return null;
  const tones = { live: T.clay, soon: T.brass, ending: T.warn, expired: T.warn, ended: T.muted, archived: T.muted, paused: T.muted, dormant: T.muted, upcoming: T.green };
  return <Pill tone={tones[l] || T.muted} bg={`${tones[l] || T.muted}18`}>{LIFECYCLE_LABEL[l]}</Pill>;
}

function Toast({ msg, onDone }) {
  useEffect(() => { if (!msg) return; const t = setTimeout(onDone, 2100); return () => clearTimeout(t); }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div className="fade" style={{
      position: "absolute", insetInline: 24, bottom: 96, zIndex: 90, background: T.deep, color: "#F6EFE0",
      padding: "11px 15px", borderRadius: R.box, fontSize: 13, fontWeight: 600, textAlign: "center",
      boxShadow: "0 18px 40px rgba(20,16,10,.3)", lineHeight: 1.6,
    }}>{msg}</div>
  );
}

function Sheet({ open, onClose, title, children, tall }) {
  if (!open) return null;
  return (
    <div className="fade" style={{ position: "absolute", inset: 0, zIndex: 95, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,16,12,.44)" }} />
      <div className="sheetIn scroll" style={{
        position: "relative", width: "100%", maxHeight: tall ? "88%" : "76%", overflowY: "auto",
        background: T.paper, borderTopLeftRadius: 22, borderTopRightRadius: 22, boxShadow: "0 -18px 50px rgba(20,16,10,.26)",
      }}>
        <div style={{ position: "sticky", top: 0, background: T.paper, padding: "12px 16px 10px", zIndex: 2 }}>
          <div style={{ width: 42, height: 4, borderRadius: 99, background: T.line, margin: "0 auto 12px" }} />
          <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{title}</div>
            <button className="press" onClick={onClose} aria-label="إغلاق" style={{ color: T.muted }}><X size={19} /></button>
          </div>
        </div>
        <div style={{ padding: "0 16px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon = Compass, title, body, action, onAction }) {
  return (
    <div style={{ padding: "38px 26px", textAlign: "center" }}>
      <div style={{ width: 54, height: 54, borderRadius: 18, background: T.sand, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
        <Icon size={24} color={T.green} strokeWidth={1.8} />
      </div>
      <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.75 }}>{body}</div>
      {action && <button className="press" onClick={onAction} style={{ marginTop: 16, background: T.deep, color: "#F6EFE0", padding: "10px 18px", borderRadius: R.ctl, fontSize: 13.5, fontWeight: 800 }}>{action}</button>}
    </div>
  );
}

function Loading({ lines = 3 }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <div className="shim" style={{ height: 150, borderRadius: R.media, marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="shim" style={{ height: 13, width: `${86 - i * 16}%`, borderRadius: 6, marginBottom: 9 }} />
      ))}
    </div>
  );
}

function Stars({ n = 0 }) {
  return <span className="row" style={{ gap: 2 }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} fill={i < n ? T.brass : "none"} color={T.brass} strokeWidth={1.6} />)}</span>;
}

/* Why-this — the explanation stays one short human sentence. */
function WhyThis({ reasons, inline }) {
  const [open, setOpen] = useState(false);
  if (!reasons?.length) return null;
  if (inline) return <div style={{ fontSize: 12, color: T.ok, fontWeight: 700 }}>{reasons[0]}</div>;
  return (
    <div style={{ marginTop: 8 }}>
      <button className="press row" onClick={() => setOpen(!open)} style={{ gap: 5, fontSize: 12, color: T.muted, fontWeight: 700 }}>
        <Sparkles size={12} color={T.brass} /> لماذا ظهر لك؟ {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      {open && (
        <ul className="up" style={{ margin: "7px 0 0", paddingInlineStart: 18, color: T.muted, fontSize: 12.5, lineHeight: 1.85 }}>
          {reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
          <li>يمكنك تعديل ما يتذكّره EyeMakkah من «حسابي».</li>
        </ul>
      )}
    </div>
  );
}

/* Object metadata line — type · area · timing · distance */
function MetaLine({ o, showDistance }) {
  const { state } = useApp();
  const bits = [];
  bits.push(o.typeLabel);
  if (NB[o.neighborhood]) bits.push(NB[o.neighborhood].name);
  const tl = timingLabel(o);
  if (tl) bits.push(tl);
  if (showDistance && state.profile.locationGranted) bits.push(`${ar(distanceKm(o))} كم`);
  if (o.price != null) bits.push(riyal(o.price));
  return <div className="clamp1" style={{ fontSize: 11.5, color: T.muted, fontWeight: 600 }}>{bits.join(" — ")}</div>;
}

/* ───────── Object presentations ─────────
   Photography leads. Text sits on or beside the image. Not every block is a card. */

function SaveButton({ o, size = 18, onDark }) {
  const { state, dispatch, toast } = useApp();
  const on = !!state.saved[o.id];
  return (
    <button className="press" aria-label={on ? "إزالة من المحفوظات" : "حفظ"}
      onClick={(e) => { e.stopPropagation(); dispatch({ type: "save", obj: o.id }); toast(on ? "أزلناه من المحفوظات" : "حُفظ — الحفظ لا يعني الحجز ولا الانضمام"); }}
      style={{
        width: size + 16, height: size + 16, borderRadius: R.pill, display: "grid", placeItems: "center",
        background: onDark ? "rgba(20,16,12,.42)" : T.paper, border: onDark ? "none" : `1px solid ${T.line}`,
        color: on ? T.brass : onDark ? "#F6EFE0" : T.muted, backdropFilter: onDark ? "blur(4px)" : "none",
      }}>
      {on ? <BookmarkCheck size={size} strokeWidth={2.2} /> : <Bookmark size={size} strokeWidth={2} />}
    </button>
  );
}

function PlanStateChip({ o }) {
  const { state } = useApp();
  const item = state.plan.find((p) => p.obj === o.id);
  if (!item) return null;
  const s = PLAN_STATE[item.state];
  const Icon = s.icon;
  return <Pill tone={s.tone} bg={`${s.tone}16`} icon={Icon}>{s.label}</Pill>;
}

/* Hero — the lead object of a module. Large photography, text over the image. */
function HeroCard({ x, kicker }) {
  const { go } = useApp();
  const o = x.o || x;
  return (
    <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ display: "block", width: "100%", textAlign: "start" }}>
      <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="16 / 11" radius={R.mediaLg} scrim="strong">
        <div style={{ position: "absolute", insetInlineStart: 14, insetInlineEnd: 14, bottom: 13 }}>
          {kicker && <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".1em", color: T.brassSoft, marginBottom: 6 }}>{kicker}</div>}
          <div className="clamp2" style={{ fontSize: 22, fontWeight: 800, color: "#FFF8EA", lineHeight: 1.35, letterSpacing: "-.01em" }}>{o.name}</div>
          <div className="clamp1" style={{ fontSize: 13, color: "rgba(255,247,230,.82)", marginTop: 5, fontWeight: 600 }}>
            {[NB[o.neighborhood]?.name, timingLabel(o), o.price != null ? riyal(o.price) : null].filter(Boolean).join(" — ")}
          </div>
        </div>
        <div style={{ position: "absolute", insetInlineStart: 12, top: 12, display: "flex", gap: 6, flexWrap: "wrap", maxWidth: "70%" }}>
          <LifecycleChip o={o} />
          <PlanStateChip o={o} />
        </div>
        <div style={{ position: "absolute", insetInlineEnd: 12, bottom: 12 }} />
      </Photo>
      {x.why?.length ? <div style={{ fontSize: 12, color: T.ok, fontWeight: 700, marginTop: 8 }}>{x.why[0]}</div> : null}
    </button>
  );
}

/* Editorial row — image beside text, the workhorse of Discover and Home lists. */
function DismissButton({ o, onDone }) {
  const { dispatch, toast, state } = useApp();
  const [open, setOpen] = useState(false);
  const count = state.dismissed[o.id] || 0;
  return (
    <>
      <button className="press" aria-label="إخفاء" onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        style={{ width: 30, height: 30, borderRadius: R.pill, display: "grid", placeItems: "center", color: T.muted }}>
        <X size={15} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="لماذا تخفيه؟">
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.8, marginBottom: 14 }}>
          الإخفاء مرة واحدة يقلّل التكرار فقط — ولا نعتبره كرهًا دائمًا. يمكنك التراجع من «حسابي».
        </div>
        {["لا يناسبني الآن", "جرّبته من قبل", "بعيد عني", "لا تعجبني هذه الفئة", "يتكرر كثيرًا"].map((r) => (
          <button key={r} className="press" onClick={() => { dispatch({ type: "dismiss", obj: o.id, reason: r }); setOpen(false); toast(count >= 1 ? "لن نعرضه مجددًا" : "قلّلنا ظهوره"); onDone && onDone(); }}
            style={{ display: "block", width: "100%", textAlign: "start", padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}`, fontSize: 14, fontWeight: 600 }}>{r}</button>
        ))}
      </Sheet>
    </>
  );
}

function RowCard({ x, showWhy = true, showDistance, dismissible }) {
  const { go } = useApp();
  const o = x.o || x;
  return (
    <div style={{ display: "flex", gap: 12, width: "100%", padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ width: 104, flex: "0 0 104px" }}>
        <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="1 / 1" radius={R.box} scrim="none" />
      </button>
      <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ flex: 1, minWidth: 0, textAlign: "start" }}>
        <div className="row" style={{ gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
          <LifecycleChip o={o} />
          <FreshnessChip o={o} small />
          <PlanStateChip o={o} />
        </div>
        <div className="clamp2" style={{ fontSize: 15.5, fontWeight: 800, lineHeight: 1.45 }}>{o.name}</div>
        <div className="clamp1" style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>{o.tagline}</div>
        <div style={{ marginTop: 5 }}><MetaLine o={o} showDistance={showDistance} /></div>
        {showWhy && x.why?.length ? <div className="clamp1" style={{ fontSize: 11.5, color: T.ok, fontWeight: 700, marginTop: 5 }}>{x.why[0]}</div> : null}
      </button>
      <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <SaveButton o={o} size={16} />
        {dismissible && <DismissButton o={o} />}
      </div>
    </div>
  );
}

/* Tile — used inside horizontal scrollers. */
function TileCard({ x, w = 208, kicker }) {
  const { go } = useApp();
  const o = x.o || x;
  return (
    <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ width: w, textAlign: "start" }}>
      <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="4 / 3" radius={R.media} scrim="soft">
        <div style={{ position: "absolute", insetInlineStart: 9, top: 9, display: "flex", gap: 5, flexWrap: "wrap", maxWidth: "80%" }}>
          <LifecycleChip o={o} /><PlanStateChip o={o} />
        </div>
        <div style={{ position: "absolute", insetInlineEnd: 8, bottom: 8 }}><SaveButton o={o} size={15} onDark /></div>
      </Photo>
      {kicker && <div style={{ fontSize: 10.5, fontWeight: 800, color: T.brass, letterSpacing: ".08em", marginTop: 8 }}>{kicker}</div>}
      <div className="clamp2" style={{ fontSize: 14.5, fontWeight: 800, marginTop: 6, lineHeight: 1.45 }}>{o.name}</div>
      <div style={{ marginTop: 4 }}><MetaLine o={o} /></div>
      {x.why?.length ? <div className="clamp1" style={{ fontSize: 11.5, color: T.ok, fontWeight: 700, marginTop: 4 }}>{x.why[0]}</div> : null}
    </button>
  );
}

/* A plain fact row — practical information as facts, not cards. */
function FactRow({ label, value, trustState, onSource }) {
  return (
    <button className="press" onClick={onSource} disabled={!onSource}
      style={{ display: "flex", width: "100%", textAlign: "start", gap: 12, padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}`, alignItems: "flex-start" }}>
      <div style={{ flex: "0 0 96px", fontSize: 12.5, color: T.muted, fontWeight: 700, paddingTop: 1 }}>{label}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.65 }}>{value}</div>
        {trustState && <div style={{ marginTop: 5 }}><TrustChip state={trustState} small /></div>}
      </div>
      {onSource && <ChevronLeft size={15} color={T.muted} style={{ marginTop: 3 }} />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GROUP 3 — PARTICIPATION & GOING OUT
   From "this looks interesting" to actually going, joining, completing and
   continuing. Outings are assembled from context, never static itineraries.
   ═══════════════════════════════════════════════════════════════════════════ */

const OUTING_SHAPES = [
  { id: "coffee-workshop-dinner", title: "قهوة ← ورشة ← عشاء", hours: 4,
    steps: [{ cat: ["cafe"], dur: 45 }, { type: ["activity", "experience"], dur: 120 }, { cat: ["food"], dur: 60 }] },
  { id: "culture-walk-food", title: "معرض ← مشية قصيرة ← أكل قريب", hours: 3.5,
    steps: [{ cat: ["culture"], dur: 70 }, { cat: ["heritage", "market"], dur: 60 }, { cat: ["food"], dur: 55 }] },
  { id: "market-sweets", title: "سوق ← حلو بعد العشاء", hours: 2,
    steps: [{ cat: ["market"], dur: 50 }, { cat: ["food", "cafe"], dur: 40 }] },
  { id: "family-evening", title: "نشاط للأطفال ← عشاء عائلي", hours: 3,
    steps: [{ cat: ["family"], dur: 80 }, { cat: ["food"], dur: 60 }] },
  { id: "quiet-solo", title: "مشي هادئ ← قهوة لوحدك", hours: 2,
    steps: [{ cat: ["sport", "nature"], dur: 50 }, { cat: ["cafe"], dur: 45 }] },
  { id: "learn-then-eat", title: "جلسة تعلّم ← عشاء خفيف", hours: 3,
    steps: [{ cat: ["learn", "craft"], dur: 90 }, { cat: ["food"], dur: 45 }] },
];

function buildOutings(ctx, state, maxHours = 4) {
  const out = [];
  const usedShapes = OUTING_SHAPES.filter((sh) => sh.hours <= maxHours + 0.5);
  for (const shape of usedShapes) {
    const chosen = [];
    const taken = new Set();
    let ok = true;
    for (const st of shape.steps) {
      const pool = INVENTORY.filter((o) =>
        !taken.has(o.id) && isPromotable(o) && o.type !== "offer" && o.type !== "service" &&
        (st.cat ? st.cat.includes(o.category) : true) && (st.type ? st.type.includes(o.type) : true) &&
        (chosen.length ? distanceKm(o, chosen[0].geo) < 5 : true) &&
        (ctx.party === "kids" ? !["cafe"].includes(o.category) : true));
      if (!pool.length) { ok = false; break; }
      const best = rank(pool, ctx, { limit: 3, maxPerCategory: 3, maxPerNeighborhood: 3 })[0];
      if (!best) { ok = false; break; }
      taken.add(best.o.id);
      chosen.push(best.o);
    }
    if (!ok || chosen.length < 2) continue;
    const mins = chosen.reduce((a, o) => a + (o.duration || 50), 0) + (chosen.length - 1) * 15;
    out.push({ ...shape, objects: chosen, minutes: mins });
  }
  return out.slice(0, 3);
}

function OutingSheet({ outing, open, onClose }) {
  const { dispatch, go, toast } = useApp();
  if (!outing) return null;
  const addAll = () => {
    outing.objects.forEach((o) => dispatch({ type: "plan", obj: o.id }));
    toast("أضفنا الخطة كاملة — لم يُحجز أي شيء بعد");
    onClose(); go({ s: "plan" });
  };
  return (
    <Sheet open={open} onClose={onClose} title={outing.title} tall>
      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.8, marginBottom: 14 }}>
        مقترح مبني على وقتك وموقعك وما تفاعلت معه — وليس قالبًا جاهزًا. يمكنك حذف أي محطة.
      </div>
      {outing.objects.map((o, i) => (
        <div key={o.id} className="row" style={{ gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 24px", paddingTop: 4 }}>
            <span style={{ width: 24, height: 24, borderRadius: 99, background: T.deep, color: "#F6EFE0", fontSize: 12, fontWeight: 800, display: "grid", placeItems: "center" }}>{ar(i + 1)}</span>
            {i < outing.objects.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 34, background: T.sand, marginTop: 4 }} />}
          </div>
          <button className="lift" onClick={() => { onClose(); go({ s: "object", id: o.id }); }} style={{ flex: 1, textAlign: "start", minWidth: 0 }}>
            <div className="clamp1" style={{ fontSize: 14.5, fontWeight: 800 }}>{o.name}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
              {[NB[o.neighborhood]?.name, o.duration ? minutesAr(o.duration) : null, o.price != null ? riyal(o.price) : null].filter(Boolean).join(" — ")}
            </div>
          </button>
          <div style={{ width: 56, flex: "0 0 56px" }}>
            <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="1 / 1" radius={R.ctl} scrim="none" />
          </div>
        </div>
      ))}
      <div style={{ padding: "11px 12px", borderRadius: R.box, background: T.sand, fontSize: 12.5, color: T.muted, lineHeight: 1.8, marginTop: 4 }}>
        الوقت التقديري {minutesAr(outing.minutes)} شاملًا التنقل بين المحطات. الإضافة إلى خطتك لا تعني حجزًا ولا تسجيلًا.
      </div>
      <button className="press" onClick={addAll}
        style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 14 }}>
        أضف الخطة كاملة إلى خطتي
      </button>
    </Sheet>
  );
}

function OutingCard({ outing, onOpen }) {
  return (
    <button className="lift" onClick={onOpen} style={{ width: 246, textAlign: "start" }}>
      <div style={{ display: "flex", gap: 4, borderRadius: R.media, overflow: "hidden" }}>
        {outing.objects.map((o) => (
          <div key={o.id} style={{ flex: 1 }}>
            <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="3 / 4" radius={0} scrim="soft" />
          </div>
        ))}
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 800, marginTop: 8 }}>{outing.title}</div>
      <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
        {countAr(outing.objects.length, "محطة واحدة", "محطتان", "محطات", "محطة")} — {minutesAr(outing.minutes)}
      </div>
    </button>
  );
}

/* Participation context — stated by the organiser, never inferred. */
function ParticipationContext({ o, compact }) {
  const bits = [];
  if (o.capacity != null) bits.push({ icon: Users, text: `${ar(o.joinedCount)} من ${ar(o.capacity)} مشاركًا — بيانات نموذج أولي` });
  const next = nextOccurrence(o);
  if (next) bits.push({ icon: Clock, text: whenAr(next) });
  if (o.duration) bits.push({ icon: Clock, text: minutesAr(o.duration) });
  o.suit.filter((x) => ["small", "solo", "beginners", "noexp", "women", "kids", "family", "students", "arabic", "bilingual"].includes(x))
    .forEach((x) => bits.push({ icon: Check, text: SUIT[x] }));
  if (!bits.length) return null;
  return (
    <div style={{ padding: compact ? 0 : "13px", borderRadius: R.box, background: compact ? "transparent" : T.sand, marginTop: compact ? 8 : 14 }}>
      {!compact && <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 9 }}>أول مرة؟ هذا ما تتوقعه</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {bits.slice(0, 6).map((b, i) => (
          <span key={i} className="row" style={{ gap: 5, fontSize: 12, color: T.ink, fontWeight: 600 }}>
            <b.icon size={12.5} color={T.green} />{b.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Completion — lightweight, high-value prompts instead of a star rating. */
function CompletionSheet({ o, open, onClose }) {
  const { dispatch, go, toast, ctx, state } = useApp();
  const [ask, setAsk] = useState(false);
  if (!o) return null;
  const next = rank(INVENTORY.filter((x) => x.id !== o.id && isPromotable(x)),
    { ...ctx, noveltySeeking: true, planNeighborhoods: [o.neighborhood] }, { limit: 3, maxPerCategory: 1 });
  const openQ = allContributions(state).find((k) => k.type === "question" && !k.answers && k.communities.some((c) => o.communities.includes(c)));

  return (
    <>
      <Sheet open={open && !ask} onClose={onClose} title={`أكملت «${o.name}»`} tall>
        <div style={{ fontSize: 14, lineHeight: 1.85, marginBottom: 16 }}>استمتعت؟ سطران منك الآن أنفع لغيرك من عشرة تقييمات بالنجوم.</div>
        {[
          { icon: Camera, label: "شارك صورة", note: "صورة حديثة تساعد من لم يزره بعد", act: () => setAsk(true) },
          { icon: Sparkles, label: "اكتب نصيحة عملية", note: "أفضل وقت، ما تطلبه، أو ما تمنيت معرفته", act: () => setAsk(true) },
          openQ && { icon: HelpCircle, label: "ساعد شخصًا يسأل", note: openQ.body.slice(0, 60) + "…", act: () => { onClose(); go({ s: "thread", id: openQ.id }); } },
        ].filter(Boolean).map((row, i) => (
          <button key={i} className="press" onClick={row.act}
            style={{ display: "flex", width: "100%", gap: 11, textAlign: "start", padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}`, alignItems: "flex-start" }}>
            <row.icon size={17} color={T.green} style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{row.label}</div>
              <div className="clamp1" style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{row.note}</div>
            </div>
            <ChevronLeft size={15} color={T.muted} style={{ marginTop: 3 }} />
          </button>
        ))}

        {next.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 4 }}>خطوة تالية تناسبك</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>لن نعرض عليك نفس التجربة مرة أخرى.</div>
            <div className="hs scroll" style={{ gap: 12 }}>
              {next.map((x) => <TileCard key={x.o.id} x={x} w={172} />)}
            </div>
          </div>
        )}
        <button className="press" onClick={onClose}
          style={{ width: "100%", marginTop: 18, padding: "12px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 13.5 }}>
          لاحقًا
        </button>
      </Sheet>
      <AskSheet open={ask} onClose={() => { setAsk(false); onClose(); }} presetObject={o} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME — a contextual compositor, not a menu
   Precedence: active plan → time-critical → immediate/nearby → community →
   personalized discovery → offers → inspiration → participation.
   Modules are chosen, not all rendered.
   ═══════════════════════════════════════════════════════════════════════════ */

function greeting(profile) {
  const h = Math.floor(mkHour());
  const time = h < 5 ? "ليلة هادئة" : h < 11 ? "صباح الخير" : h < 15 ? "نهارك سعيد" : h < 19 ? "مساء الخير" : "مساء الخير";
  return time;
}

function buildHome(state, ctx) {
  const used = new Set();
  const take = (list, n) => { const out = []; for (const x of list) { if (used.has(x.o.id)) continue; used.add(x.o.id); out.push(x); if (out.length >= n) break; } return out; };
  const pool = INVENTORY.filter((o) => o.type !== "offer");
  const modules = [];

  /* H1 — what you already committed to */
  const activeItems = state.plan.filter((p) => ["active", "confirmed", "registered", "going", "planned", "awaiting"].includes(p.state));
  if (activeItems.length) {
    modules.push({ id: "journey", kind: "journey", items: activeItems.slice(0, 3) });
    const anchor = getObj(activeItems[0].obj);
    if (anchor) {
      const near = rank(pool.filter((o) => o.id !== anchor.id && o.neighborhood === anchor.neighborhood), ctx, { limit: 6, maxPerCategory: 2 });
      if (near.length) modules.push({
        id: "around-plan", kind: "scroller",
        title: `حول ${anchor.name}`, sub: "خطوات قريبة تكمل ما التزمت به", items: take(near, 5),
      });
    }
  }

  /* H5 — time-critical */
  const soon = rank(INVENTORY.filter((o) => ["soon", "live"].includes(lifecycleOf(o))), ctx, { limit: 6, maxPerCategory: 2 });
  if (soon.length) modules.push({ id: "soon", kind: "scroller", title: "يبدأ قريبًا", sub: "ما زال أمامك وقت للحاق به", items: take(soon, 4) });

  /* H2 — immediate context */
  const areaName = NB[ctx.nb]?.name || "مكة";
  const nearby = rank(pool.filter((o) => (ctx.locationGranted ? distanceKm(o, ctx.from) < 4 : o.neighborhood === ctx.nb)), ctx, { limit: 8, maxPerCategory: 2 });
  if (nearby.length) modules.push({
    id: "near", kind: "rows",
    title: ctx.locationGranted ? "قريب منك الآن" : `هذا المساء في ${areaName}`,
    sub: ctx.locationGranted ? "حسب موقعك الحالي" : "يمكنك تفعيل الموقع لنتائج أدق", items: take(nearby, 4),
  });

  /* H3 — for you */
  const forYou = rank(pool, ctx, { limit: 10, maxPerCategory: 2, maxPerNeighborhood: 2 });
  if (forYou.length) modules.push({
    id: "foryou", kind: "hero+rows",
    title: ctx.mode === "visitor" ? "مختارة لزيارتك" : "لأجلك",
    sub: state.profile.personalization ? "تتغير كلما تفاعلت أكثر" : "التخصيص متوقف — هذه اختيارات عامة", items: take(forYou, 4),
  });

  /* H4 — community */
  const comItems = allContributions(state)
    .filter((k) => !k.parent && k.communities.some((c) => state.joinedCommunities.includes(c) || state.followedCommunities.includes(c)))
    .sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 4);
  if (comItems.length) modules.push({ id: "community", kind: "community", title: "من مجتمعك", sub: "معرفة محلية حديثة من الناس، لا من التطبيق", items: comItems });

  /* H6 — offers, only when genuinely valid */
  const offers = rank(INVENTORY.filter((o) => o.type === "offer" && isPromotable(o)), ctx, { limit: 4, maxPerCategory: 3 });
  if (offers.length) modules.push({ id: "offers", kind: "offers", title: "عروض سارية تناسبك", sub: "نعرض العرض ما دام ساريًا فقط", items: take(offers, 3) });

  /* H7 — inspiration / novelty */
  const novel = rank(pool.filter((o) => o.novelty > 0.65), { ...ctx, noveltySeeking: true }, { limit: 8, maxPerCategory: 2 });
  if (novel.length) modules.push({
    id: "new", kind: "scroller",
    title: Object.keys(ctx.completed || {}).length ? "شيء جديد عليك" : "أقل شهرة — ويستحق",
    sub: "بعيدًا عن المسار المعتاد", items: take(novel, 5),
  });

  /* H7.5 — going out: low-friction prompts that assemble a real outing */
  if (ctx.evening || state.profile.mode === "visitor") {
    const hours = ctx.timeAvailable ? ctx.timeAvailable / 60 : 4;
    const outings = buildOutings(ctx, state, hours);
    if (outings.length) modules.push({
      id: "outings", kind: "outings",
      title: ctx.timeAvailable === 60 ? "عندك ساعة؟" : ctx.timeAvailable === 120 ? "عندك ساعتان؟" : ctx.evening ? "وش تسوي الليلة؟" : "عندك وقت؟",
      sub: "نركّب لك مسارًا من أماكن قريبة بعضها من بعض", items: outings,
    });
  }

  /* H8 — participation */
  const participate = rank(INVENTORY.filter((o) => ["activity", "recurring"].includes(o.type) && isPromotable(o)), ctx, { limit: 6, maxPerCategory: 3 });
  if (participate.length) modules.push({ id: "participate", kind: "rows", title: "شارك هذا الأسبوع", sub: "أنشطة يمكنك الانضمام إليها فعلًا", items: take(participate, 3) });

  /* H9 — practical city knowledge */
  modules.push({ id: "hoods", kind: "hoods", title: "تصفّح مكة بالأحياء", sub: "لكل حي إيقاعه ومجتمعه" });
  return modules;
}

function CommunitySnippet({ k, compact }) {
  const { go, state, dispatch } = useApp();
  const o = k.obj ? getObj(k.obj) : null;
  const com = COM[k.communities[0]];
  const translated = state.translated[k.id];
  const showOriginal = k.original && translated;
  return (
    <div style={{ padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <div className="row" style={{ gap: 8, marginBottom: 7 }}>
        <div style={{ width: 28, height: 28, borderRadius: R.pill, background: T.sand, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, color: T.green }}>
          {k.author.name.slice(0, 1)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="row" style={{ gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 800 }}>{k.author.name}</span>
            {k.author.kind === "provider" && <Pill tone="#54697E" size={10}>مقدّم الخدمة</Pill>}
          </div>
          <div style={{ fontSize: 11, color: T.muted }}>{k.author.role} — {agoAr(k.at)}</div>
        </div>
        {com && <button className="press" onClick={() => go({ s: "community", id: com.id })} style={{ fontSize: 11, fontWeight: 800, color: T.green }}>{com.name}</button>}
      </div>
      <button className="press" onClick={() => go({ s: "thread", id: k.parent || k.id })} style={{ textAlign: "start", width: "100%" }}>
        <div className={compact ? "clamp3" : ""} style={{ fontSize: 14, lineHeight: 1.85, fontWeight: k.type === "question" ? 700 : 500 }}>
          {showOriginal ? k.original.text : k.body}
        </div>
      </button>
      {k.original && (
        <button className="press row" onClick={() => dispatch({ type: "translate", k: k.id })} style={{ gap: 5, marginTop: 6, fontSize: 11.5, color: T.muted, fontWeight: 700 }}>
          <Languages size={12} />{translated ? "عرض الترجمة" : `النص الأصلي — ${({ en: "English", ur: "اردو", id: "Bahasa" })[k.original.lang]}`}
        </button>
      )}
      <div className="row" style={{ gap: 10, marginTop: 9, flexWrap: "wrap" }}>
        {o && <button className="press" onClick={() => go({ s: "object", id: o.id })} style={{ fontSize: 11.5, fontWeight: 800, color: T.clay }}>↳ {o.name}</button>}
        <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 600 }}>{ar(k.helpful + (state.helpful[k.id] ? 1 : 0))} وجدوها مفيدة</span>
        {k.answers > 0 && <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 600 }}>{countAr(k.answers, "إجابة واحدة", "إجابتان", "إجابات", "إجابة")}</span>}
      </div>
    </div>
  );
}

function useOnline() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine !== false);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return online;
}

function DegradedBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div className="row" style={{ gap: 9, margin: "0 16px 14px", padding: "11px 13px", borderRadius: R.box, background: `${T.warn}12`, alignItems: "flex-start" }}>
      <WifiOff size={16} color={T.warn} style={{ marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.warn }}>أنت بلا اتصال</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4, lineHeight: 1.7 }}>
          نعرض ما سبق تحميله. المواعيد والعروض وحالات التسجيل قد لا تكون محدّثة، والحجز الخارجي لن يعمل الآن.
        </div>
      </div>
    </div>
  );
}

function ScreenHome() {
  const { state, ctx, go, dispatch } = useApp();
  const modules = useMemo(() => buildHome(state, ctx), [state, ctx]);
  const p = state.profile;
  const unread = allNotifications(state).filter((n) => !n.read).length;

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      {/* header */}
      <div style={{ padding: "14px 16px 12px" }}>
        <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 700 }}>{greeting(p)}</div>
            <div className="row" style={{ gap: 6, marginTop: 2 }}>
              <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-.02em" }}>
                {p.mode === "visitor" ? "مكة اليوم" : `مكة اليوم — ${NB[p.nb]?.name || ""}`}
              </div>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="press" onClick={() => go({ s: "notifications" })} aria-label="الإشعارات"
              style={{ width: 36, height: 36, borderRadius: R.pill, background: T.paper, border: `1px solid ${T.line}`, display: "grid", placeItems: "center", position: "relative" }}>
              <Bell size={17} color={T.ink} />
              {unread > 0 && <span style={{ position: "absolute", top: 7, insetInlineEnd: 8, width: 7, height: 7, borderRadius: 99, background: T.clay }} />}
            </button>
            <button className="press" onClick={() => go({ s: "profile" })} aria-label="حسابي"
              style={{ width: 36, height: 36, borderRadius: R.pill, background: T.deep, color: "#F6EFE0", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800 }}>
              {p.mode === "visitor" ? "ز" : "م"}
            </button>
          </div>
        </div>
        <button className="press row" onClick={() => go({ s: "search" })}
          style={{ width: "100%", gap: 9, marginTop: 12, background: T.paper, border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "11px 13px", color: T.muted }}>
          <Search size={16} />
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>ابحث عن مكان أو تجربة أو مجتمع</span>
        </button>
      </div>

      <DegradedBanner />

      {!p.locationGranted && (
        <div style={{ margin: "0 16px 16px", padding: "12px 14px", background: T.sand, borderRadius: R.box }}>
          <div className="row" style={{ gap: 9, alignItems: "flex-start" }}>
            <MapPin size={16} color={T.green} style={{ marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>نعرض الآن نتائج {NB[p.nb]?.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 1.7 }}>تفعيل الموقع يجعل «قريب منك» دقيقًا. يعمل التطبيق بدونه أيضًا.</div>
            </div>
            <button className="press" onClick={() => dispatch({ type: "profile", patch: { locationGranted: true } })}
              style={{ fontSize: 12, fontWeight: 800, color: T.green, whiteSpace: "nowrap" }}>فعّل الموقع</button>
          </div>
        </div>
      )}

      <div style={{ padding: "0 16px 18px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>كم معك وقت الآن؟</div>
        <div className="hs scroll" style={{ gap: 8 }}>
          {[[60, "ساعة"], [120, "ساعتان"], [240, "المساء كله"], [null, "غير محدد"]].map(([v, l]) => (
            <Chip key={String(v)} active={p.timeAvailable === v} onClick={() => dispatch({ type: "profile", patch: { timeAvailable: v } })}>{l}</Chip>
          ))}
        </div>
      </div>

      {modules.map((m, mi) => <HomeModule key={m.id} m={m} index={mi} />)}

      <div style={{ padding: "18px 16px 8px", textAlign: "center", fontSize: 11.5, color: T.muted, lineHeight: 1.8 }}>
        هذا نموذج أولي. القيم التشغيلية والعروض والمساهمات توضيحية، ولا تمثل معلومات حيّة.
      </div>
    </div>
  );
}

function HomeModule({ m, index }) {
  const { go, state, dispatch, toast } = useApp();
  const body = () => {
    switch (m.kind) {
      case "journey":
        return (
          <div style={{ padding: "0 16px" }}>
            {m.items.map((it) => { const o = getObj(it.obj); return o ? <PlanTeaser key={it.id} item={it} o={o} /> : null; })}
          </div>
        );
      case "scroller":
        return <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{m.items.map((x) => <TileCard key={x.o.id} x={x} />)}</div>;
      case "rows":
        return <div style={{ padding: "0 16px" }}>{m.items.map((x) => <RowCard key={x.o.id} x={x} showDistance dismissible />)}</div>;
      case "hero+rows":
        return (
          <div style={{ padding: "0 16px" }}>
            {m.items[0] && <HeroCard x={m.items[0]} kicker={m.items[0].why?.[0] ? "مختار لك" : undefined} />}
            <div style={{ marginTop: 6 }}>{m.items.slice(1).map((x) => <RowCard key={x.o.id} x={x} dismissible />)}</div>
          </div>
        );
      case "community":
        return <div style={{ padding: "0 16px" }}>{m.items.map((k) => <CommunitySnippet key={k.id} k={k} compact />)}</div>;
      case "offers":
        return (
          <div style={{ padding: "0 16px" }}>
            {m.items.map((x) => {
              const o = x.o, life = lifecycleOf(o), linked = o.linked ? getObj(o.linked) : null;
              return (
                <button key={o.id} className="lift" onClick={() => go({ s: "object", id: o.id })}
                  style={{ display: "flex", width: "100%", gap: 12, textAlign: "start", padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
                  <div style={{ width: 72, flex: "0 0 72px" }}><Photo kind={o.scene} seed={o.id} ratio="1 / 1" radius={R.box} scrim="none" mark={false} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                      <Pill tone={life === "ending" ? T.warn : T.brass} bg={life === "ending" ? `${T.warn}16` : `${T.brass}16`} icon={Tag}>
                        {life === "ending" ? "ينتهي الليلة" : "عرض ساري"}
                      </Pill>
                    </div>
                    <div className="clamp1" style={{ fontSize: 15, fontWeight: 800 }}>{o.name}</div>
                    <div className="clamp1" style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>{linked ? linked.name : o.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      case "outings":
        return <OutingsRow items={m.items} />;
      case "hoods":
        return (
          <div className="hs scroll" style={{ padding: "0 16px 4px" }}>
            {NEIGHBORHOODS.filter((n) => n.id !== "haram-area").slice(0, 10).map((n) => (
              <button key={n.id} className="lift" onClick={() => go({ s: "discover", nb: n.id })} style={{ width: 150, textAlign: "start" }}>
                <Photo kind={["alley", "market", "garden", "skyline"][hash(n.id) % 4]} seed={"nb" + n.id} ratio="4 / 3" radius={R.media} scrim="strong" mark={false}>
                  <div style={{ position: "absolute", insetInlineStart: 10, bottom: 9 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#FFF8EA" }}>{n.name}</div>
                  </div>
                </Photo>
                <div className="clamp2" style={{ fontSize: 11.5, color: T.muted, marginTop: 6, lineHeight: 1.6 }}>{n.blurb}</div>
              </button>
            ))}
          </div>
        );
      default: return null;
    }
  };
  return (
    <div className="up" style={{ marginBottom: 26, animationDelay: `${Math.min(index * 45, 260)}ms` }}>
      {m.title && <SectionTitle title={m.title} sub={m.sub}
        action={m.id === "community" ? "المجتمع" : m.id === "hoods" ? "اكتشف" : undefined}
        onAction={() => go({ s: m.id === "community" ? "community" : "discover" })} />}
      {body()}
    </div>
  );
}

function OutingsRow({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="hs scroll" style={{ padding: "0 16px 4px" }}>
        {items.map((out) => <OutingCard key={out.id} outing={out} onOpen={() => setOpen(out)} />)}
      </div>
      <OutingSheet outing={open} open={!!open} onClose={() => setOpen(null)} />
    </>
  );
}

function PlanTeaser({ item, o }) {
  const { go } = useApp();
  const s = PLAN_STATE[item.state];
  const next = nextOccurrence(o);
  return (
    <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ display: "block", width: "100%", textAlign: "start", marginBottom: 12 }}>
      <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="16 / 9" radius={R.mediaLg} scrim="strong">
        <div style={{ position: "absolute", insetInlineStart: 14, insetInlineEnd: 14, bottom: 12 }}>
          <div className="row" style={{ gap: 6, marginBottom: 7 }}>
            <Pill tone="#FFF8EA" bg="rgba(20,16,12,.45)" icon={s.icon} strong>{s.label}</Pill>
            {next && <Pill tone="#FFF8EA" bg="rgba(20,16,12,.45)">{whenAr(next)}</Pill>}
          </div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#FFF8EA", lineHeight: 1.4 }}>
            {item.state === "active" ? `جارٍ الآن — ${o.name}` : item.state === "confirmed" ? `قبل ${o.name}` : o.name}
          </div>
        </div>
      </Photo>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DISCOVER — browse · search · map · filters (modes, not tabs)
   ═══════════════════════════════════════════════════════════════════════════ */

const INTENTS = [
  { id: "tonight", label: "الليلة", test: (o) => ["soon", "live"].includes(lifecycleOf(o)) || isOpenNow(o) === true || o.suit.includes("evening") },
  { id: "week", label: "هذا الأسبوع", test: (o) => { const n = nextOccurrence(o); return n && n - t0 < 7 * DAY; } },
  { id: "free", label: "بدون رسوم", test: (o) => o.price === 0 || o.price == null },
  { id: "nobooking", label: "بدون حجز", test: (o) => ["go", "join"].includes(o.action) },
  { id: "family", label: "للعائلة", test: (o) => o.suit.includes("family") || o.suit.includes("kids") },
  { id: "solo", label: "للحضور منفردًا", test: (o) => o.suit.includes("solo") || o.suit.includes("small") },
  { id: "short", label: "أقل من ساعة", test: (o) => o.duration != null && o.duration <= 60 },
  { id: "accessible", label: "وصول أسهل", test: (o) => o.suit.includes("accessible") || o.suit.includes("stepfree") },
  { id: "quiet", label: "هادئ", test: (o) => o.suit.includes("quiet") },
  { id: "new", label: "جديد عليك", test: (o) => o.novelty > 0.7 },
];

function ScreenDiscover({ params }) {
  const { state, ctx, go, dispatch } = useApp();
  const [mode, setMode] = useState(params?.mode || "browse");
  const [cat, setCat] = useState(params?.cat || null);
  const [nb, setNb] = useState(params?.nb || null);
  const [intent, setIntent] = useState(params?.intent || null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const activeCount = (cat ? 1 : 0) + (nb ? 1 : 0) + (intent ? 1 : 0);
  const archive = useMemo(() => INVENTORY.filter((o) => !isPromotable(o)), []);

  useEffect(() => { if (params?.nb) setNb(params.nb); if (params?.cat) setCat(params.cat); if (params?.intent) setIntent(params.intent); }, [params]);

  const filtered = useMemo(() => {
    let list = INVENTORY.filter((o) => o.type !== "offer" || isPromotable(o));
    if (cat) list = list.filter((o) => o.category === cat);
    if (nb) list = list.filter((o) => o.neighborhood === nb);
    if (intent) { const it = INTENTS.find((x) => x.id === intent); if (it) list = list.filter(it.test); }
    return list;
  }, [cat, nb, intent]);

  const active = !!(cat || nb || intent);
  const rctx = { ...ctx, intentCategory: cat || ctx.intentCategory, shortWindow: intent === "short" };
  const results = useMemo(
    () => rank(filtered, rctx, { limit: 14 * page, maxPerCategory: cat ? 99 : 4, maxPerNeighborhood: nb ? 99 : 5 }),
    [filtered, rctx, page, cat, nb]
  );

  const editorial = useMemo(() => {
    const used = new Set();
    const mk = (title, sub, list, kind = "scroller", n = 6) => {
      const picked = [];
      for (const x of list) { if (used.has(x.o.id)) continue; used.add(x.o.id); picked.push(x); if (picked.length >= n) break; }
      return picked.length ? { title, sub, items: picked, kind } : null;
    };
    const base = INVENTORY.filter((o) => o.type !== "offer");
    return [
      mk("الليلة في مكة", "ما يمكن اللحاق به خلال ساعات", rank(base.filter(INTENTS[0].test), ctx, { limit: 10 }), "hero", 4),
      mk("مطاعم وأكل", "من مطابخ الأحياء إلى الأكل المكي القديم", rank(base.filter((o) => ["food", "cafe"].includes(o.category)), ctx, { limit: 12, maxPerCategory: 8, maxPerNeighborhood: 2 })),
      mk("تجارب تستحق", "ورش، مسارات، وضيافة محلية", rank(base.filter((o) => o.type === "experience"), ctx, { limit: 12, maxPerCategory: 6 })),
      mk("فعاليات وأنشطة", "ما هو مجدول فعلًا هذه الأيام", rank(base.filter((o) => ["event", "activity"].includes(o.type) && isPromotable(o)), ctx, { limit: 12, maxPerCategory: 6 }), "rows", 4),
      mk("ثقافة وتاريخ", "المدينة كما يعرفها أهلها", rank(base.filter((o) => ["culture", "heritage"].includes(o.category)), ctx, { limit: 12, maxPerCategory: 8 })),
      mk("أقل شهرة — ويستحق", "بعيدًا عن المسار المعتاد", rank(base.filter((o) => o.novelty > 0.72), { ...ctx, noveltySeeking: true }, { limit: 12, maxPerCategory: 4 })),
      mk("مجموعات وأندية", "مشاركة متكررة وليست زيارة واحدة", rank(base.filter((o) => o.type === "recurring" && isPromotable(o)), ctx, { limit: 8, maxPerCategory: 6 }), "rows", 3),
    ].filter(Boolean);
  }, [ctx]);

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: T.limestone, paddingTop: 12, boxShadow: `0 8px 12px -12px ${T.ink}` }}>
        <div className="row" style={{ gap: 9, padding: "0 16px 10px" }}>
          <button className="press row" onClick={() => go({ s: "search" })}
            style={{ flex: 1, gap: 9, background: T.paper, border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "10px 12px", color: T.muted }}>
            <Search size={15} /><span style={{ fontSize: 13, fontWeight: 600 }}>ابحث في مكة</span>
          </button>
          <button className="press" onClick={() => setFilters(true)} aria-label="مرشّحات"
            style={{ width: 40, height: 40, borderRadius: R.ctl, background: activeCount ? T.deep : T.paper, color: activeCount ? "#F6EFE0" : T.ink, border: `1px solid ${activeCount ? T.deep : T.line}`, display: "grid", placeItems: "center", position: "relative" }}>
            <Filter size={16} />
            {activeCount > 0 && <span style={{ position: "absolute", top: -5, insetInlineEnd: -5, width: 17, height: 17, borderRadius: 99, background: T.clay, color: "#FFF8EA", fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center" }}>{ar(activeCount)}</span>}
          </button>
          <button className="press" onClick={() => setMode(mode === "map" ? "browse" : "map")} aria-label="الخريطة"
            style={{ width: 40, height: 40, borderRadius: R.ctl, background: mode === "map" ? T.deep : T.paper, color: mode === "map" ? "#F6EFE0" : T.ink, border: `1px solid ${mode === "map" ? T.deep : T.line}`, display: "grid", placeItems: "center" }}>
            {mode === "map" ? <List size={17} /> : <MapIcon size={17} />}
          </button>
        </div>
        <div className="hs scroll" style={{ padding: "0 16px 10px", gap: 8 }}>
          {INTENTS.map((i) => <Chip key={i.id} active={intent === i.id} onClick={() => { setIntent(intent === i.id ? null : i.id); setPage(1); }}>{i.label}</Chip>)}
        </div>
        {(cat || nb) && (
          <div className="row" style={{ gap: 7, padding: "0 16px 10px", flexWrap: "wrap" }}>
            {cat && <Chip active icon={CAT[cat].icon} onClick={() => setCat(null)}>{CAT[cat].name} ✕</Chip>}
            {nb && <Chip active onClick={() => setNb(null)}>{NB[nb].name} ✕</Chip>}
          </div>
        )}
      </div>

      <Sheet open={filters} onClose={() => setFilters(false)} title="ترتيب وتصفية" tall>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 9 }}>الفئة</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => <Chip key={c.id} icon={c.icon} active={cat === c.id} onClick={() => { setCat(cat === c.id ? null : c.id); setPage(1); }}>{c.name}</Chip>)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, margin: "20px 0 9px" }}>الحي</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {NEIGHBORHOODS.filter((n) => n.id !== "haram-area").map((n) => (
            <Chip key={n.id} active={nb === n.id} onClick={() => { setNb(nb === n.id ? null : n.id); setPage(1); }}>{n.name}</Chip>
          ))}
        </div>
        <div className="row" style={{ gap: 9, marginTop: 22 }}>
          <button className="press" onClick={() => { setCat(null); setNb(null); setIntent(null); }}
            style={{ flex: 1, padding: "12px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 13.5 }}>مسح الكل</button>
          <button className="press" onClick={() => setFilters(false)}
            style={{ flex: 2, padding: "12px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13.5 }}>اعرض النتائج</button>
        </div>
      </Sheet>

      {mode === "map" ? (
        <MapView list={filtered} />
      ) : active ? (
        <div style={{ padding: "12px 16px 0" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 13, color: T.muted, fontWeight: 700 }}>
              {countAr(results.length, "نتيجة واحدة", "نتيجتان", "نتائج", "نتيجة")}{nb ? ` في ${NB[nb].name}` : ""}{cat ? ` — ${CAT[cat].name}` : ""}
            </div>
            <button className="press" onClick={() => { setCat(null); setNb(null); setIntent(null); }} style={{ fontSize: 12.5, fontWeight: 800, color: T.green }}>مسح المرشّحات</button>
          </div>
          {results.length === 0 ? (
            <EmptyState icon={Filter} title="لا نتائج بهذه المرشّحات" body="جرّب توسيع النطاق أو إزالة أحد المرشّحات. لا نعرض محتوى منتهيًا لمجرد ملء الصفحة."
              action="إزالة المرشّحات" onAction={() => { setCat(null); setNb(null); setIntent(null); }} />
          ) : (
            <>
              {results.map((x, i) => (i === 0 ? <div key={x.o.id} style={{ marginBottom: 6 }}><HeroCard x={x} /></div> : <RowCard key={x.o.id} x={x} showDistance />))}
              {results.length >= 14 * page && (
                <button className="press" onClick={() => setPage(page + 1)}
                  style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: R.ctl, border: `1px solid ${T.line}`, background: T.paper, fontWeight: 800, fontSize: 13.5 }}>
                  اعرض المزيد
                </button>
              )}
            </>
          )}
        </div>
      ) : showArchive ? (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8, marginBottom: 12 }}>
            محتوى انتهى أو خرج عن الصلاحية. يُحفظ كسجل ولا يظهر في الاكتشاف أو التوصيات.
          </div>
          {archive.length ? archive.map((o) => (
            <div key={o.id} style={{ opacity: .72 }}><RowCard x={{ o }} showWhy={false} /></div>
          )) : <EmptyState icon={Layers} title="الأرشيف فارغ" body="لا يوجد محتوى منتهٍ حاليًا." />}
          <button className="press" onClick={() => setShowArchive(false)}
            style={{ width: "100%", margin: "16px 0", padding: "12px", borderRadius: R.ctl, border: `1px solid ${T.line}`, background: T.paper, fontWeight: 800, fontSize: 13.5 }}>
            رجوع إلى الاكتشاف
          </button>
        </div>
      ) : (
        <div style={{ paddingTop: 14 }}>
          {editorial.map((sec, i) => (
            <div key={sec.title} className="up" style={{ marginBottom: 26, animationDelay: `${Math.min(i * 40, 200)}ms` }}>
              <SectionTitle title={sec.title} sub={sec.sub} />
              {sec.kind === "hero" ? (
                <div style={{ padding: "0 16px" }}>
                  <HeroCard x={sec.items[0]} />
                  <div style={{ marginTop: 6 }}>{sec.items.slice(1).map((x) => <RowCard key={x.o.id} x={x} />)}</div>
                </div>
              ) : sec.kind === "rows" ? (
                <div style={{ padding: "0 16px" }}>{sec.items.map((x) => <RowCard key={x.o.id} x={x} />)}</div>
              ) : (
                <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{sec.items.map((x) => <TileCard key={x.o.id} x={x} />)}</div>
              )}
            </div>
          ))}
          <div style={{ padding: "0 16px 6px" }}>
            <button className="press" onClick={() => setShowArchive(true)}
              style={{ width: "100%", padding: "12px", borderRadius: R.ctl, border: `1px solid ${T.line}`, background: T.paper, fontWeight: 800, fontSize: 13, color: T.muted }}>
              <Layers size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
              الأرشيف — {countAr(archive.length, "عنصر واحد", "عنصران", "عناصر", "عنصر")} انتهت أو خرجت عن الصلاحية
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Map — a contextual lens over the same inventory ───────── */

function MapView({ list, height = 380 }) {
  const { go, ctx, state } = useApp();
  const [sel, setSel] = useState(null);
  const shown = useMemo(() => rank(list, ctx, { limit: 26, maxPerCategory: 8, maxPerNeighborhood: 6 }).map((x) => x.o), [list, ctx]);
  const selObj = sel ? getObj(sel) : null;

  return (
    <div style={{ padding: "12px 16px 0" }}>
      <div style={{ position: "relative", borderRadius: R.media, overflow: "hidden", background: "#E8E0CC", height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="mapg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F2EADA" /><stop offset="100%" stopColor="#DFD3BA" /></linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#mapg)" />
          {/* valley ridges */}
          <path d="M0 22 Q22 12 44 24 T100 18" stroke="#C6B492" strokeWidth="6" fill="none" opacity=".5" />
          <path d="M0 78 Q26 88 52 76 T100 84" stroke="#C6B492" strokeWidth="7" fill="none" opacity=".45" />
          <path d="M14 0 Q22 40 10 100" stroke="#CDBC9B" strokeWidth="5" fill="none" opacity=".4" />
          <path d="M88 0 Q78 46 92 100" stroke="#CDBC9B" strokeWidth="5" fill="none" opacity=".4" />
          {/* roads */}
          <path d="M50 0 L50 100" stroke="#F7F1E2" strokeWidth="3.4" />
          <path d="M0 52 L100 52" stroke="#F7F1E2" strokeWidth="3.4" />
          <path d="M8 88 Q46 60 96 30" stroke="#F7F1E2" strokeWidth="2.4" fill="none" />
          {/* haram */}
          <circle cx="50" cy="52" r="7" fill={T.green} opacity=".16" />
          <circle cx="50" cy="52" r="2.4" fill={T.green} />
        </svg>

        {NEIGHBORHOODS.filter((n) => n.id !== "haram-area").map((n) => (
          <div key={n.id} style={{ position: "absolute", insetInlineStart: `${n.x * 100}%`, top: `${n.y * 100}%`, transform: "translate(-50%,-50%)", fontSize: 9.5, color: T.muted, fontWeight: 800, pointerEvents: "none", whiteSpace: "nowrap", opacity: .75 }}>
            {n.name}
          </div>
        ))}
        <div style={{ position: "absolute", insetInlineStart: "50%", top: "52%", transform: "translate(-50%,-50%)", fontSize: 10.5, color: T.green, fontWeight: 800, pointerEvents: "none" }}>الحرم</div>

        {shown.map((o) => {
          const on = sel === o.id;
          const tone = CAT[o.category]?.tone || T.green;
          return (
            <button key={o.id} className="press" onClick={() => setSel(on ? null : o.id)} aria-label={o.name}
              style={{
                position: "absolute", insetInlineStart: `${o.geo.x * 100}%`, top: `${o.geo.y * 100}%`, transform: "translate(-50%,-100%)",
                width: on ? 26 : 18, height: on ? 26 : 18, borderRadius: R.pill, background: on ? tone : T.paper,
                border: `2px solid ${tone}`, display: "grid", placeItems: "center", boxShadow: on ? "0 6px 14px rgba(20,16,10,.28)" : "none", zIndex: on ? 5 : 2,
              }}>
              <span style={{ width: on ? 8 : 6, height: on ? 8 : 6, borderRadius: 99, background: on ? T.paper : tone }} />
            </button>
          );
        })}

        {state.profile.locationGranted && (
          <div style={{ position: "absolute", insetInlineStart: `${NB[state.profile.nb].x * 100}%`, top: `${NB[state.profile.nb].y * 100}%`, transform: "translate(-50%,-50%)" }}>
            <span style={{ display: "block", width: 14, height: 14, borderRadius: 99, background: T.clay, border: "3px solid #FFF8EA", boxShadow: "0 3px 10px rgba(20,16,10,.3)" }} />
          </div>
        )}

        <div style={{ position: "absolute", insetInlineEnd: 10, top: 10, fontSize: 9.5, color: T.muted, background: "rgba(255,252,246,.85)", padding: "3px 8px", borderRadius: R.pill, fontWeight: 700 }}>
          خريطة تخطيطية للنموذج
        </div>
      </div>

      {selObj ? (
        <div className="up" style={{ marginTop: 12 }}>
          <RowCard x={{ o: selObj }} showWhy={false} showDistance />
          <button className="press" onClick={() => go({ s: "object", id: selObj.id })}
            style={{ width: "100%", marginTop: 8, padding: "11px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13.5 }}>
            افتح صفحة {alType(selObj)}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 12, fontSize: 12.5, color: T.muted, lineHeight: 1.8, textAlign: "center" }}>
          اختر نقطة على الخريطة لعرض تفاصيلها. الخريطة عرض للمحتوى نفسه، وليست بديلًا عن الإرشاد الرسمي داخل الحرم.
        </div>
      )}
      <div style={{ height: 20 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH — one field, many object types, identity always visible
   ═══════════════════════════════════════════════════════════════════════════ */

const SUGGESTED_QUERIES = ["أكل مكي", "حراء", "ورشة", "للعائلة", "تطوع", "العوالي", "مشي", "قهوة هادئة"];

function ScreenSearch() {
  const { ctx, go, dispatch, state } = useApp();
  const [q, setQ] = useState("");
  const [typing, setTyping] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => inputRef.current?.focus(), 120); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!q) return; setTyping(true); const t = setTimeout(() => setTyping(false), 260); return () => clearTimeout(t); }, [q]);

  const res = useMemo(() => searchAll(q, ctx), [q, ctx]);
  const empty = q.trim() && !typing && !res.objects.length && !res.communities.length && !res.contributions.length;

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "sticky", top: 0, background: T.limestone, zIndex: 20, padding: "12px 16px 10px" }}>
        <div className="row" style={{ gap: 9 }}>
          <button className="press" onClick={() => go({ back: true })} aria-label="رجوع" style={{ color: T.ink }}><ChevronRight size={22} /></button>
          <div className="row" style={{ flex: 1, gap: 8, background: T.paper, border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "9px 12px" }}>
            <Search size={16} color={T.muted} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
              onBlur={() => q && dispatch({ type: "search", q })}
              placeholder="مكان، تجربة، مجتمع، أو سؤال" dir="rtl"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 600 }} />
            {q && <button className="press" onClick={() => setQ("")} aria-label="مسح"><X size={15} color={T.muted} /></button>}
          </div>
        </div>
      </div>

      {!q.trim() && (
        <div style={{ padding: "6px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>جرّب البحث عن</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SUGGESTED_QUERIES.map((s) => <Chip key={s} onClick={() => setQ(s)}>{s}</Chip>)}
          </div>
          <Divider m={20} />
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>البحث يغطي</div>
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.9 }}>
            الأماكن والمطاعم والتجارب والفعاليات والأنشطة والمجموعات والعروض والخدمات ومجتمعات مكة ومساهمات الناس.
          </div>
        </div>
      )}

      {typing && q.trim() ? <div style={{ paddingTop: 12 }}><Loading lines={2} /></div> : null}

      {empty && (
        <EmptyState icon={Search} title={`لا نتائج لـ «${q}»`}
          body="قد تكون الكلمة غير مستخدمة في مكة بهذا الشكل. جرّب كلمة أقرب للمعنى، أو تصفّح حسب الحي أو الفئة."
          action="تصفّح اكتشف" onAction={() => go({ s: "discover" })} />
      )}

      {!typing && q.trim() && res.objects.length > 0 && (
        <div style={{ padding: "8px 16px 0" }}>
          <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 700, marginBottom: 4 }}>{countAr(res.objects.length, "نتيجة واحدة", "نتيجتان", "نتائج", "نتيجة")} عبر أنواع مختلفة</div>
          {res.objects.map((x) => (
            <div key={x.o.id} style={{ position: "relative" }}>
              <div style={{ position: "absolute", insetInlineEnd: 0, top: 14, zIndex: 2 }}>
                <Pill tone={CAT[x.o.category]?.tone || T.muted}>{x.o.typeLabel}</Pill>
              </div>
              <RowCard x={x} />
            </div>
          ))}
        </div>
      )}

      {!typing && res.communities.length > 0 && (
        <div style={{ padding: "18px 16px 0" }}>
          <SectionTitle title="مجتمعات" sub="نقاش دائم ومعرفة محلية" />
          {res.communities.map((c) => <CommunityRow key={c.id} c={c} />)}
        </div>
      )}

      {!typing && res.contributions.length > 0 && (
        <div style={{ padding: "18px 16px 0" }}>
          <SectionTitle title="من مساهمات الناس" sub="نصوصهم كما كتبوها" />
          {res.contributions.map((k) => <CommunitySnippet key={k.id} k={k} compact />)}
        </div>
      )}
    </div>
  );
}

function CommunityRow({ c }) {
  const { go, state } = useApp();
  const joined = state.joinedCommunities.includes(c.id);
  return (
    <button className="lift" onClick={() => go({ s: "community", id: c.id })}
      style={{ display: "flex", width: "100%", gap: 12, textAlign: "start", padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ width: 56, flex: "0 0 56px" }}><Photo kind={c.scene} seed={c.id} ratio="1 / 1" radius={R.box} scrim="none" mark={false} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 6 }}>
          <span style={{ fontSize: 14.5, fontWeight: 800 }}>{c.name}</span>
          {joined && <Pill tone={T.ok} size={10}>منضم</Pill>}
          {c.state !== "active" && <Pill tone={T.muted} size={10}>غير نشط</Pill>}
        </div>
        <div className="clamp2" style={{ fontSize: 12.5, color: T.muted, marginTop: 3, lineHeight: 1.6 }}>{c.blurb}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4, fontWeight: 600 }}>{ar(c.members.toLocaleString("en-US"))} عضو</div>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DECISION PAGE — identity → why it fits → facts → community → provenance →
   one action → what next
   ═══════════════════════════════════════════════════════════════════════════ */

function ScreenObject({ id }) {
  const { state, ctx, dispatch, go, toast } = useApp();
  const o = getObj(id);
  const [sourceField, setSourceField] = useState(null);
  const [askOpen, setAskOpen] = useState(false);
  useEffect(() => { if (o) dispatch({ type: "view", obj: o.id }); /* eslint-disable-next-line */ }, [id]);

  if (!o) return <EmptyState title="لم نعد نجد هذا العنصر" body="ربما انتهى أو أُزيل من المحتوى." />;

  const trust = objectTrust(o, state.resolved);
  const rel = scoreObject(o, ctx);
  const life = lifecycleOf(o);
  const next = nextOccurrence(o);
  const provider = o.provider ? PROV[o.provider] : null;
  const contribs = contributionsFor(o.id, state);
  /* if this object has little of its own, borrow relevant knowledge from the
     communities it belongs to rather than showing an empty section */
  const related = useMemo(() => contribs.length >= 2 ? [] : allContributions(state)
    .filter((k) => !k.parent && k.obj !== o.id && k.communities.some((c) => o.communities.includes(c)))
    .sort((a, b) => (b.helpful || 0) - (a.helpful || 0)).slice(0, 2), [contribs.length, o.id, state]);
  const planItem = state.plan.find((p) => p.obj === o.id);
  const linked = o.linked ? getObj(o.linked) : null;
  const cs = uniq(o.communities.map((c) => COM[c]).filter(Boolean).map((c) => c.id));

  const whatNext = useMemo(() => {
    const near = rank(INVENTORY.filter((x) => x.id !== o.id && x.type !== "offer"), { ...ctx, planNeighborhoods: [o.neighborhood], noveltySeeking: true },
      { limit: 4, maxPerCategory: 1 });
    return near;
  }, [o.id, ctx]);

  return (
    <div className="scroll" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {/* A — identity / desirability */}
      <div style={{ position: "relative" }}>
        <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="4 / 3" radius={0} scrim="strong" />
        <button className="press" onClick={() => go({ back: true })} aria-label="رجوع"
          style={{ position: "absolute", insetInlineStart: 14, top: 14, width: 36, height: 36, borderRadius: R.pill, background: "rgba(20,16,12,.44)", color: "#FFF8EA", display: "grid", placeItems: "center", backdropFilter: "blur(4px)" }}>
          <ChevronRight size={20} />
        </button>
        <div style={{ position: "absolute", insetInlineEnd: 14, top: 14 }}><SaveButton o={o} onDark /></div>
        <div style={{ position: "absolute", insetInlineStart: 16, insetInlineEnd: 16, bottom: 14 }}>
          <div className="row" style={{ gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <Pill tone="#FFF8EA" bg="rgba(20,16,12,.42)" strong>{o.typeLabel}</Pill>
            <LifecycleChip o={o} />
            <PlanStateChip o={o} />
            {o.generated && <Pill tone="#FFF8EA" bg="rgba(20,16,12,.42)">نموذج أولي</Pill>}
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "#FFF8EA", lineHeight: 1.32, letterSpacing: "-.02em" }}>{o.name}</div>
          <div style={{ fontSize: 13.5, color: "rgba(255,247,230,.85)", marginTop: 6, fontWeight: 600 }}>
            {[NB[o.neighborhood]?.name, next ? whenAr(next) : timingLabel(o), o.duration ? minutesAr(o.duration) : null, o.price != null ? riyal(o.price) : null].filter(Boolean).join(" — ")}
          </div>
        </div>
      </div>

      {planItem?.state === "active" && <ActivePanel o={o} />}

      {!o.photo && (
        <div style={{ padding: "7px 16px 0", fontSize: 10.5, color: T.muted, fontWeight: 600 }}>
          صورة تعبيرية مرسومة داخل التطبيق — ليست صورة فوتوغرافية {alType(o)}.
        </div>
      )}
      {o.photo && REAL_PHOTOS[o.photo] && (
        <div style={{ padding: "7px 16px 0", fontSize: 10.5, color: T.muted, fontWeight: 600 }}>
          الصورة: {REAL_PHOTOS[o.photo].credit}
        </div>
      )}
      <div style={{ padding: "14px 16px 0" }}>
        {o.tagline && <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.65, marginBottom: 8 }}>{o.tagline}</div>}
        <div style={{ fontSize: 14.5, lineHeight: 1.95, color: T.ink }}>{o.about}</div>

        {/* trust headline — visible but not dominant */}
        {(trust.state === "conflicting" || trust.state === "possibly_stale" || trust.state === "expired") && (
          <div style={{ marginTop: 14, padding: "12px 13px", borderRadius: R.box, background: `${T.warn}12`, border: `1px solid ${T.warn}33` }}>
            <div className="row" style={{ gap: 8, alignItems: "flex-start" }}>
              <AlertTriangle size={16} color={T.warn} style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.warn }}>
                  {trust.state === "conflicting" ? "توجد معلومات متعارضة" : trust.state === "expired" ? "هذا المحتوى لم يعد ساريًا" : "قد تكون بعض المعلومات قديمة"}
                </div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 4, lineHeight: 1.75 }}>
                  {trust.state === "conflicting"
                    ? "مصدران يذكران معلومتين مختلفتين عن الوقت. نعرض الاثنين بدل أن نختار لك."
                    : trust.state === "expired" ? "نعرضه هنا كسجل، ولا يظهر ضمن ما هو متاح الآن."
                    : "تجاوزت بعض الحقول مدة التحديث المتوقعة."}
                </div>
                {trust.state === "conflicting" && (
                  <div style={{ fontSize: 12.5, color: T.warn, marginTop: 7, fontWeight: 700, lineHeight: 1.75 }}>
                    ننصح بالتأكد من المشغّل قبل الذهاب، خصوصًا إن كان الوقت ضيقًا.
                  </div>
                )}
                <button className="press" onClick={() => setSourceField(trust.fields.find((f) => ["conflicting", "possibly_stale"].includes(f.state))?.field || trust.fields[0]?.field)}
                  style={{ fontSize: 12.5, fontWeight: 800, color: T.warn, marginTop: 7 }}>اعرض المصادر المتعارضة</button>
              </div>
            </div>
          </div>
        )}

        {/* B — why it fits now */}
        {state.profile.personalization && rel.why.length > 0 && (
          <div style={{ marginTop: 16, padding: "12px 13px", borderRadius: R.box, background: T.sand }}>
            <div className="row" style={{ gap: 7, marginBottom: 6 }}>
              <Sparkles size={14} color={T.brass} /><span style={{ fontSize: 12.5, fontWeight: 800 }}>لماذا قد يناسبك الآن</span>
            </div>
            <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.9, color: T.ink }}>
              {rel.why.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {/* participation context for things you join, stated by the organiser */}
        {["activity", "event", "experience", "recurring"].includes(o.type) && planItem?.state !== "active" && <ParticipationContext o={o} />}

        {/* suitability, stated by the object — never inferred */}
        {o.suit.length > 0 && !["activity", "event", "experience", "recurring"].includes(o.type) && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 14 }}>
            {o.suit.map((s) => <Pill key={s} tone={T.green} bg={`${T.green}0F`}>{SUIT[s]}</Pill>)}
          </div>
        )}
      </div>

      {/* C — practical facts */}
      {o.facts.length > 0 && (
        <div style={{ padding: "22px 16px 0" }}>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>معلومات عملية</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>اضغط أي معلومة لترى مصدرها وتاريخها.</div>
          {o.facts.map((f) => {
            const ft = fieldTrust(o, f.label, state.resolved);
            const shown = ["current"].includes(ft.state) ? (ft.primary?.cls || "provider") : ft.state;
            return <FactRow key={f.label} label={f.label} value={ft.primary?.value || f.value} trustState={shown} onSource={() => setSourceField(f.label)} />;
          })}
          {o.capacity != null && (
            <FactRow label="المشاركون" value={`${ar(o.joinedCount)} من ${ar(o.capacity)} — بيانات نموذج أولي`} trustState="provider" />
          )}
          {provider && (
            <FactRow label="مقدّم التجربة" value={`${provider.name} — ${provider.kind}`} trustState={provider.real ? "official" : "provider"} onSource={() => setSourceField("identity")} />
          )}
        </div>
      )}

      {/* D — community lived context */}
      <div style={{ padding: "22px 16px 0" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>ماذا يقول الناس</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>تجارب مرتبطة بـ{alType(o)} — بأصوات أصحابها.</div>
          </div>
          <button className="press" onClick={() => setAskOpen(true)} style={{ fontSize: 12.5, fontWeight: 800, color: T.green, whiteSpace: "nowrap" }}>اسأل</button>
        </div>
        {contribs.slice(0, 3).map((k) => <CommunitySnippet key={k.id} k={k} compact />)}
        {!contribs.length && !related.length && (
          <div style={{ padding: "14px 0", fontSize: 13, color: T.muted, lineHeight: 1.8 }}>
            لا توجد مساهمات عن {alType(o)} بعد. لو زرته، تجربتك ستفيد غيرك أكثر من أي تقييم بالنجوم.
          </div>
        )}
        {related.length > 0 && (
          <div style={{ marginTop: contribs.length ? 10 : 0 }}>
            <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, marginBottom: 2 }}>من مجتمعات مرتبطة</div>
            {related.map((k) => <CommunitySnippet key={k.id} k={k} compact />)}
          </div>
        )}
        {cs.length > 0 && (
          <div className="hs scroll" style={{ gap: 8, marginTop: 12 }}>
            {cs.map((c) => <Chip key={c} icon={Users} onClick={() => go({ s: "community", id: c })}>{COM[c].name}</Chip>)}
          </div>
        )}
      </div>

      {/* E — provenance summary */}
      <div style={{ padding: "22px 16px 0" }}>
        <button className="press row" onClick={() => setSourceField(trust.fields[0]?.field || "identity")}
          style={{ width: "100%", gap: 10, padding: "13px", borderRadius: R.box, border: `1px solid ${T.line}`, background: T.paper, textAlign: "start" }}>
          <Shield size={17} color={T.green} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>المصدر والسياق</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
              {countAr(uniq(o.claims.map((c) => c.cls)).length, "مصدر واحد", "مصدران", "مصادر", "مصدر")} — آخر تحديث {agoAr(o.claims.slice().sort((a, b) => new Date(b.at) - new Date(a.at))[0].at)}
            </div>
          </div>
          <TrustChip state={trust.state} small />
        </button>
      </div>

      {/* G — what next */}
      <div style={{ padding: "24px 0 0" }}>
        <SectionTitle title="وبعدها؟" sub={`خطوات قريبة من ${NB[o.neighborhood]?.name || "الموقع"}`} />
        <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{whatNext.map((x) => <TileCard key={x.o.id} x={x} w={176} />)}</div>
      </div>

      {linked && (
        <div style={{ padding: "22px 16px 0" }}>
          <SectionTitle title={o.type === "offer" ? "العرض مرتبط بـ" : "مرتبط بـ"} />
          <RowCard x={{ o: linked }} showWhy={false} />
        </div>
      )}

      <SourceSheet o={o} field={sourceField} onClose={() => setSourceField(null)} />
      <AskSheet o={o} open={askOpen} onClose={() => setAskOpen(false)} />
      <ActionBar o={o} planItem={planItem} />
    </div>
  );
}

/* ───────── Action bar — one primary action, semantics kept distinct ───────── */

function ActionBar({ o, planItem }) {
  const { state, dispatch, toast, go } = useApp();
  const [handoff, setHandoff] = useState(false);
  const [done, setDone] = useState(false);
  const life = lifecycleOf(o);
  const blocked = ["expired", "ended", "archived"].includes(life);
  const saved = !!state.saved[o.id];
  const st = planItem?.state;

  const primary = (() => {
    if (blocked) return { label: "انتهى — اعرض بدائل", act: () => go({ s: "discover", cat: o.category }), tone: T.muted };
    switch (st) {
      case "awaiting": return { label: "أكّد الحجز أو ألغِه", act: () => setHandoff(true), tone: T.warn };
      case "confirmed": return { label: "ابدأ الآن", act: () => { dispatch({ type: "start", obj: o.id }); toast("بدأت — نعرض الآن ما تحتاجه أثناء التنفيذ"); }, tone: T.deep };
      case "going":
      case "registered": return { label: "ابدأ الآن", act: () => { dispatch({ type: "start", obj: o.id }); toast("بدأت — الاتجاهات والمعلومات العملية أولًا"); }, tone: T.deep };
      case "active": return { label: "أكملت هذا", act: () => { dispatch({ type: "complete", obj: o.id }); setDone(true); }, tone: T.ok };
      case "completed": return { label: "شارك تجربتك", act: () => setDone(true), tone: T.deep };
      default: break;
    }
    switch (o.action) {
      case "join": return { label: "انضم — سأحضر", act: () => { dispatch({ type: "join", obj: o.id }); toast("سُجّل حضورك — الانضمام ليس حجزًا ولا تأكيدًا"); }, tone: T.deep };
      case "register": return { label: "سجّل", act: () => setHandoff(true), tone: T.deep };
      case "book": return { label: "احجز", act: () => setHandoff(true), tone: T.deep };
      case "redeem": return { label: "استخدم العرض", act: () => setHandoff(true), tone: T.deep };
      case "contact": return { label: "تواصل", act: () => setHandoff(true), tone: T.deep };
      case "official": return { label: "افتح المصدر الرسمي", act: () => setHandoff(true), tone: T.green };
      default: return { label: "الاتجاهات", act: () => setHandoff(true), tone: T.deep };
    }
  })();

  const inPlan = planItem && !["saved", "interested", "cancelled"].includes(st);
  const showInterested = !planItem && !blocked;

  return (
    <>
      <div style={{
        position: "sticky", bottom: 0, zIndex: 40, padding: "12px 16px 14px", marginTop: "auto",
        background: "linear-gradient(180deg, rgba(244,239,229,0) 0%, rgba(244,239,229,.96) 30%, #F4EFE5 100%)",
      }}>
        {planItem && (
          <div className="row" style={{ gap: 7, marginBottom: 9, flexWrap: "wrap" }}>
            <PlanStateChip o={o} />
            <span style={{ fontSize: 11.5, color: T.muted }}>
              {st === "saved" ? "الحفظ لا يعني الحجز" : st === "planned" ? "في خطتك — لم يُحجز" : st === "going" ? "سجّلت حضورك — بدون حجز"
                : st === "registered" ? "مسجَّل لدى المنظّم" : st === "awaiting" ? "انتقلت لإكمال الحجز — غير مؤكد بعد"
                : st === "confirmed" ? "مؤكد" : st === "active" ? "جارٍ الآن" : st === "completed" ? "حضرت وأكملت" : ""}
            </span>
          </div>
        )}
        <div className="row" style={{ gap: 9 }}>
          <button className="press" onClick={() => dispatch({ type: "save", obj: o.id })} aria-label="حفظ"
            style={{ width: 46, height: 46, borderRadius: R.ctl, background: T.paper, border: `1px solid ${saved ? T.brass : T.line}`, color: saved ? T.brass : T.ink, display: "grid", placeItems: "center" }}>
            {saved ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
          </button>
          {showInterested && (
            <button className="press" onClick={() => { dispatch({ type: "interested", obj: o.id }); toast("سجّلناه كاهتمام — نذكّرك إن اقترب موعده"); }} aria-label="مهتم"
              style={{ width: 46, height: 46, borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, display: "grid", placeItems: "center" }}>
              <Heart size={18} />
            </button>
          )}
          {!inPlan && !blocked && (
            <button className="press" onClick={() => { dispatch({ type: "plan", obj: o.id }); toast("أُضيف إلى خطتي — لم يُحجز ولم تُسجّل بعد"); }}
              style={{ height: 46, padding: "0 14px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 13 }}>
              أضف لخطتي
            </button>
          )}
          <button className="press" onClick={primary.act}
            style={{ flex: 1, height: 46, borderRadius: R.ctl, background: primary.tone, color: "#F6EFE0", fontWeight: 800, fontSize: 14.5 }}>
            {primary.label}
          </button>
        </div>
        {st === "active" && (
          <button className="press" onClick={() => setHandoff(true)}
            style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 13 }}>
            <Navigation size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />الاتجاهات
          </button>
        )}
        {o.outbound && !blocked && (
          <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 8, lineHeight: 1.7 }}>
            {["book", "register"].includes(o.action)
              ? `يكتمل لدى ${o.outbound} — لا يصبح «مؤكدًا» إلا بتأكيد حقيقي`
              : `الخدمة عبر ${o.outbound}`}
          </div>
        )}
      </div>
      <HandoffSheet o={o} open={handoff} onClose={() => setHandoff(false)} />
      <CompletionSheet o={o} open={done} onClose={() => setDone(false)} />
    </>
  );
}

/* Active state — only what you need while you are actually there. */
function ActivePanel({ o }) {
  const { state, go, dispatch, toast } = useApp();
  const tips = contributionsFor(o.id, state).filter((k) => ["tip", "experience_report", "update"].includes(k.type)).slice(0, 2);
  const provider = o.provider ? PROV[o.provider] : null;
  const next = nextOccurrence(o);
  return (
    <div style={{ margin: "14px 16px 0", padding: "14px", borderRadius: R.box, background: `${T.clay}10`, border: `1px solid ${T.clay}33` }}>
      <div className="row" style={{ gap: 7, marginBottom: 10 }}>
        <CircleDot size={15} color={T.clay} />
        <span style={{ fontSize: 14, fontWeight: 800, color: T.clay }}>جارٍ الآن</span>
      </div>
      {next && <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>الموعد: {whenAr(next)}</div>}
      {(o.facts || []).slice(0, 2).map((f) => (
        <div key={f.label} className="row" style={{ gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: T.muted, fontWeight: 700, flex: "0 0 84px" }}>{f.label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1, lineHeight: 1.6 }}>{f.value}</span>
        </div>
      ))}
      {provider && <div style={{ fontSize: 12.5, color: T.muted, marginTop: 6 }}>المنظّم: {provider.name}</div>}
      {tips.length > 0 && (
        <div style={{ marginTop: 11, paddingTop: 11, borderTop: `1px solid ${T.clay}22` }}>
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>نصائح من أناس جرّبوه</div>
          {tips.map((k) => (
            <div key={k.id} className="clamp2" style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.75, marginBottom: 5 }}>— {k.body}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Source sheet — claim-level provenance, conflicts kept visible ───────── */

function SourceSheet({ o, field, onClose }) {
  const { state, dispatch, toast } = useApp();
  if (!field || !o) return null;
  const ft = fieldTrust(o, field, state.resolved);
  const key = `${o.id}:${field}`;
  const canResolve = CONFLICT_RESOLUTIONS[key] && !state.resolved[key];
  const fields = uniq(o.claims.map((c) => c.field));
  const pendingReviews = (state.reviews || []).filter((r) => r.obj === o.id && r.state === "pending");

  return (
    <Sheet open={!!field} onClose={onClose} title="المصدر والسياق" tall>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 8 }}>{o.name}</div>
        <div className="hs scroll" style={{ gap: 7 }}>
          {fields.map((f) => (
            <Chip key={f} active={f === field} onClick={() => { const el = document.getElementById("srcfield-" + hash(f)); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{f === "identity" ? "التعريف" : f}</Chip>
          ))}
        </div>
      </div>

      <div id={"srcfield-" + hash(field)} style={{ padding: "13px", borderRadius: R.box, background: T.sand, marginBottom: 14 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{field === "identity" ? "التعريف والوصف" : field}</span>
          <TrustChip state={ft.state} />
        </div>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8 }}>
          {ft.state === "conflicting" && "مصدران معتبران يذكران معلومتين مختلفتين. لا نختار نيابة عنك — نعرض الاثنين بتاريخيهما."}
          {ft.state === "possibly_stale" && "تجاوزت المعلومة مدة التحديث المتوقعة لهذا النوع من الحقول ولم يصلنا تأكيد أحدث."}
          {ft.state === "corroborated" && "أكثر من مساهمة حديثة ومستقلة تؤكد المعلومة نفسها."}
          {ft.state === "current" && "المعلومة داخل مدة التحديث المتوقعة لهذا النوع من الحقول."}
          {ft.state === "insufficient" && "الأدلة غير كافية. هذه المعلومة تتغير لحظيًا، والمصدر الرسمي هو المرجع."}
        </div>
      </div>

      {ft.state === "conflicting" && (
        <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
          {ft.claims.slice().sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 2).map((c) => (
            <div key={c.id} style={{ flex: 1, padding: "11px", borderRadius: R.box, border: `1px solid ${SOURCE_CLASS[c.cls].tone}44`, background: T.paper }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: SOURCE_CLASS[c.cls].tone }}>{SOURCE_CLASS[c.cls].label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6, lineHeight: 1.6 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>{agoAr(c.at)}</div>
            </div>
          ))}
        </div>
      )}
      {pendingReviews.length > 0 && (
        <div style={{ padding: "11px 12px", borderRadius: R.box, background: `${T.brass}12`, marginBottom: 14 }}>
          <div className="row" style={{ gap: 7, marginBottom: 5 }}>
            <Clock size={13} color={T.brass} /><span style={{ fontSize: 12.5, fontWeight: 800 }}>تصحيح بانتظار المراجعة</span>
          </div>
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.75 }}>{pendingReviews[0].body}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
            سُجّل كمصدر مجتمعي بتاريخه. لا يغيّر معلومة أعلى سلطة حتى تراجعه الجهة المعنية.
          </div>
        </div>
      )}
      {ft.claims.slice().sort((a, b) => new Date(b.at) - new Date(a.at)).map((c) => {
        const sc = SOURCE_CLASS[c.cls];
        const Icon = sc.icon;
        const st = claimState(c);
        return (
          <div key={c.id} style={{ padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <Icon size={14} color={sc.tone} />
              <span style={{ fontSize: 12.5, fontWeight: 800, color: sc.tone }}>{sc.label}</span>
              <span style={{ fontSize: 11.5, color: T.muted }}>— {agoAr(c.at)}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.7 }}>{c.value}</div>
            {c.by && <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4 }}>{c.by}{c.note ? ` — ${c.note}` : ""}</div>}
            <div className="row" style={{ gap: 8, marginTop: 7 }}>
              <Pill tone={T.muted} size={10.5}>{FRESHNESS[c.fresh]?.label}</Pill>
              {st === "possibly_stale" && <Pill tone={T.warn} size={10.5}>تجاوزت مدة التحديث</Pill>}
            </div>
          </div>
        );
      })}

      {canResolve && (
        <button className="press" onClick={() => { dispatch({ type: "resolve", key, obj: o.id }); toast("وصل تحديث من المصدر — حُدّثت الحالة في كل مكان"); }}
          style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13.5 }}>
          اطلب تحديثًا من المصدر
        </button>
      )}
      {state.resolved[key] && (
        <div style={{ marginTop: 14, padding: "12px", borderRadius: R.box, background: `${T.ok}12`, fontSize: 12.5, color: T.ok, fontWeight: 700, lineHeight: 1.7 }}>
          وصل تحديث أحدث من المشغّل. تم تحديث الحالة هنا وفي خطتك ونتائج البحث.
        </div>
      )}

      <div style={{ marginTop: 18, fontSize: 11.5, color: T.muted, lineHeight: 1.85 }}>
        لا نستخدم شارة «موثوق» عامة. كل معلومة تحمل مصدرها وتاريخها، ونوضّح ما لم نتمكن من التحقق منه.
        القيم في هذا النموذج توضيحية.
      </div>
    </Sheet>
  );
}

/* ───────── Handoff — leaving EyeMakkah never means confirmed ───────── */

function HandoffSheet({ o, open, onClose }) {
  const { dispatch, toast, go, state } = useApp();
  const [stage, setStage] = useState("intro");
  useEffect(() => { if (open) setStage("intro"); }, [open]);
  if (!o) return null;
  const isBooking = ["book", "register"].includes(o.action);
  const isOfficial = o.action === "official";
  const partner = o.outbound || "الخرائط";

  const leave = () => {
    if (isBooking) { dispatch({ type: "book_outbound", obj: o.id, provider: partner }); setStage("returned"); }
    else if (o.action === "redeem") { dispatch({ type: "redeem", obj: o.id }); setStage("returned"); }
    else { dispatch({ type: "directions", obj: o.id }); setStage("returned"); }
  };

  return (
    <Sheet open={open} onClose={onClose} title={isOfficial ? "المصدر الرسمي" : isBooking ? "إكمال الحجز خارج EyeMakkah" : o.action === "redeem" ? "استخدام العرض" : "الاتجاهات"}>
      {stage === "intro" && (
        <div>
          <div style={{ fontSize: 14.5, lineHeight: 1.9, marginBottom: 14 }}>
            {isOfficial
              ? "هذه معلومة تشغيلية تديرها الجهة المختصة. ننقلك إلى مصدرها الرسمي بدل أن نعيد إنتاجها هنا."
              : isBooking
              ? `سنحوّلك إلى ${partner} لإكمال العملية. الانتقال لا يعني أن الحجز تم.`
              : o.action === "redeem"
              ? `العرض يُستخدم لدى ${partner} مباشرة. تأكد من الشروط والتاريخ قبل الذهاب.`
              : `سنفتح الاتجاهات في تطبيق الخرائط. سياق ${o.name} يبقى محفوظًا هنا.`}
          </div>
          <div style={{ padding: "12px 13px", borderRadius: R.box, background: T.sand, marginBottom: 16 }}>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}><Info size={14} color={T.green} /><span style={{ fontSize: 12.5, fontWeight: 800 }}>ما يحدث بعد الانتقال</span></div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.85 }}>
              {isBooking
                ? "سنسجّل «انتقلت لإكمال الحجز» في خطتك. لن يتحول إلى «مؤكد» إلا بتأكيد منك أو من مزوّد الخدمة."
                : "نحتفظ بسياق العنصر في خطتك حتى تعود، فلا تبدأ البحث من جديد."}
            </div>
          </div>
          <button className="press" onClick={leave}
            style={{ width: "100%", padding: "13px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 14 }}>
            {isOfficial ? "افتح المصدر الرسمي" : isBooking ? `تابع إلى ${partner}` : o.action === "redeem" ? "اعرض تفاصيل العرض" : "افتح الاتجاهات"}
            <ExternalLink size={15} style={{ marginInlineStart: 7, verticalAlign: "-2px" }} />
          </button>
        </div>
      )}

      {stage === "returned" && (
        <div>
          <div className="row" style={{ gap: 9, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: R.pill, background: `${T.warn}18`, display: "grid", placeItems: "center" }}><ExternalLink size={16} color={T.warn} /></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{isBooking ? "انتقلت لإكمال الحجز" : "تم فتح الوجهة الخارجية"}</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{o.name}</div>
            </div>
          </div>
          {isBooking ? (
            <>
              <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.85, marginBottom: 14 }}>
                لم نستلم تأكيدًا بعد. أخبرنا ما الذي حدث فعلًا حتى تبقى خطتك صحيحة.
              </div>
              <button className="press" onClick={() => { dispatch({ type: "book_confirm", obj: o.id, source: "user" }); toast("تم التأكيد بناءً على تأكيدك أنت"); onClose(); }}
                style={{ width: "100%", padding: "13px", borderRadius: R.ctl, background: T.ok, color: "#F6FBF8", fontWeight: 800, fontSize: 14, marginBottom: 9 }}>
                أكملت الحجز — أكّده
              </button>
              <button className="press" onClick={() => { dispatch({ type: "book_fail", obj: o.id }); toast("أبقيناه في خطتك كغير مؤكد"); onClose(); }}
                style={{ width: "100%", padding: "13px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 14 }}>
                لم يكتمل — أبقه غير مؤكد
              </button>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 12, lineHeight: 1.8 }}>
                في المنتج الحقيقي يصل التأكيد من مزوّد الخدمة مباشرة. لا نحوّل الحالة إلى «مؤكد» لمجرد أنك غادرت التطبيق.
              </div>
            </>
          ) : (
            <button className="press" onClick={onClose} style={{ width: "100%", padding: "13px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 14 }}>
              رجوع إلى {o.name}
            </button>
          )}
        </div>
      )}
    </Sheet>
  );
}

/* ───────── Ask — a question is a contribution, routed to the right community ───────── */

function AskSheet({ o: objProp, open, onClose, presetCommunity, presetObject }) {
  const { dispatch, toast, go, state } = useApp();
  const o = objProp || presetObject || null;
  const [text, setText] = useState("");
  const [type, setType] = useState("question");
  const [withPhoto, setWithPhoto] = useState(false);
  const [fields, setFields] = useState({});
  const suggested = useMemo(() => {
    const ids = o ? o.communities : (presetCommunity ? [presetCommunity] : ["living"]);
    return uniq([...ids, ...state.joinedCommunities]).map((c) => COM[c]).filter(Boolean).slice(0, 4);
  }, [o, presetCommunity, state.joinedCommunities]);
  const [target, setTarget] = useState(null);
  useEffect(() => {
    if (!open) return;
    setText(""); setWithPhoto(false); setFields({});
    setType(presetObject ? "experience_report" : "question");
    setTarget(suggested[0]?.id || "living");
  }, [open, suggested, presetObject]);

  const TYPES = [
    { id: "question", label: "سؤال", icon: HelpCircle },
    { id: "experience_report", label: "تجربة", icon: Quote },
    { id: "recommendation", label: "توصية", icon: ThumbsUp },
    { id: "tip", label: "نصيحة", icon: Sparkles },
    { id: "update", label: "تحديث معلومة", icon: RefreshCw },
    { id: "correction", label: "تصحيح", icon: Pencil },
  ];
  const REPORT_FIELDS = ["كيف كان الوصول؟", "أفضل وقت؟", "ماذا تمنيت أن تعرفه قبلها؟"];

  const submit = () => {
    if (!text.trim()) return;
    const filled = Object.fromEntries(Object.entries(fields).filter(([, v]) => v && v.trim()));
    dispatch({
      type: "contribute",
      contribution: {
        type, communities: [target],
        author: { name: "أنت", role: state.profile.mode === "visitor" ? "زائر" : `من سكان ${NB[state.profile.nb]?.name}`, kind: "resident" },
        body: text.trim(), obj: o?.id || null, helpful: 0, lang: "ar", answers: 0,
        photos: withPhoto ? 1 : 0, fields: Object.keys(filled).length ? filled : null,
        visitedAt: type === "experience_report" ? new Date(t0) : null,
      },
      expectAnswer: type === "question" ? "ردّ أحد أعضاء المجتمع على سؤالك." : null,
    });
    toast(type === "question" ? "نُشر سؤالك في المجتمع" : type === "correction" ? "وصل تصحيحك — يُراجع قبل أن يغيّر معلومة رسمية" : "شكرًا — أضفنا مساهمتك");
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={o ? `شارك عن ${o.name}` : "شارك المجتمع"} tall>
      {o && (
        <div className="row" style={{ gap: 10, marginBottom: 14, padding: "9px 10px", borderRadius: R.box, background: T.limestone }}>
          <div style={{ width: 40, flex: "0 0 40px" }}><Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="1 / 1" radius={R.ctl} scrim="none" /></div>
          <div style={{ minWidth: 0 }}>
            <div className="clamp1" style={{ fontSize: 13, fontWeight: 800 }}>{o.name}</div>
            <div style={{ fontSize: 11, color: T.muted }}>ستُربط مساهمتك بـ{alType(o)}</div>
          </div>
        </div>
      )}
      <div className="hs scroll" style={{ gap: 7, marginBottom: 14 }}>
        {TYPES.map((t) => <Chip key={t.id} icon={t.icon} active={type === t.id} onClick={() => setType(t.id)}>{t.label}</Chip>)}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} dir="rtl" rows={5}
        placeholder={type === "question" ? "مثال: هل المكان مناسب مع كبار السن؟ وكم يحتاج وقت؟" : "اكتب من تجربتك: متى زرته، وما الذي تمنيت أن تعرفه قبلها."}
        style={{ width: "100%", border: `1px solid ${T.line}`, borderRadius: R.box, padding: "12px", fontSize: 14, lineHeight: 1.8, background: T.paper, resize: "none", outline: "none" }} />

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>ينشر في</div>
        <div className="hs scroll" style={{ gap: 7 }}>
          {suggested.map((c) => <Chip key={c.id} active={target === c.id} onClick={() => setTarget(c.id)}>{c.name}</Chip>)}
        </div>
      </div>

      {type === "experience_report" && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>اختياري — أسئلة يبحث عنها الناس فعلًا</div>
          {REPORT_FIELDS.map((q) => (
            <div key={q} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 4, fontWeight: 700 }}>{q}</div>
              <input value={fields[q] || ""} onChange={(e) => setFields({ ...fields, [q]: e.target.value })} dir="rtl"
                style={{ width: "100%", border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "9px 11px", fontSize: 13, background: T.paper, outline: "none" }} />
            </div>
          ))}
        </div>
      )}

      <button className="press row" onClick={() => setWithPhoto(!withPhoto)}
        style={{ gap: 8, marginTop: 14, padding: "10px 12px", borderRadius: R.ctl, border: `1px dashed ${withPhoto ? T.green : T.line}`, width: "100%", color: withPhoto ? T.green : T.muted }}>
        <Camera size={15} /><span style={{ fontSize: 13, fontWeight: 700 }}>{withPhoto ? "ستُرفق صورة من تجربتك" : "أرفق صورة"}</span>
      </button>

      {type === "correction" && (
        <div style={{ marginTop: 12, padding: "11px 12px", borderRadius: R.box, background: `${T.brass}14`, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
          التصحيح يُسجَّل كمصدر مجتمعي بتاريخه. لا يستبدل معلومة رسمية تلقائيًا، لكنه قد يطلب مراجعتها.
        </div>
      )}

      <div style={{ marginTop: 14, padding: "11px 12px", borderRadius: R.box, background: T.sand, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
        لا تنشر أرقامًا شخصية أو موقعًا دقيقًا لأحد. اسمك المعروض فقط، وموقعك لا يُنشر.
      </div>

      <button className="press" onClick={submit} disabled={!text.trim()}
        style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: R.ctl, background: text.trim() ? T.deep : T.line, color: text.trim() ? "#F6EFE0" : T.muted, fontWeight: 800, fontSize: 14 }}>
        انشر
      </button>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMMUNITY — families → communities → conversations → activities
   ═══════════════════════════════════════════════════════════════════════════ */

function ContributionCard({ k, onOpen }) {
  const { go, state, dispatch } = useApp();
  const o = k.obj ? getObj(k.obj) : null;
  const com = COM[k.communities[0]];
  const translated = state.translated[k.id];
  const showOriginal = k.original && translated;
  const helpful = k.helpful + (state.helpful[k.id] ? 1 : 0);
  return (
    <div style={{ padding: "13px 13px", borderRadius: R.box, background: T.paper, border: `1px solid ${T.line}`, marginBottom: 10 }}>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: R.pill, background: T.sand, display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 800, color: T.green }}>
          {k.author.name.slice(0, 1)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, fontWeight: 800 }}>{k.author.name}</span>
            <Pill tone={T.clay} size={10}>{CONTRIB_LABEL[k.type] || "مساهمة"}</Pill>
            {k.author.kind === "provider" && <Pill tone="#54697E" size={10}>مقدّم الخدمة</Pill>}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{k.author.role} — {agoAr(k.at)}</div>
        </div>
        {com && <button className="press" onClick={() => go({ s: "community", id: com.id })} style={{ fontSize: 11, fontWeight: 800, color: T.green, whiteSpace: "nowrap" }}>{com.name}</button>}
      </div>
      <button className="press" onClick={() => (onOpen ? onOpen() : go({ s: "thread", id: k.parent || k.id }))} style={{ textAlign: "start", width: "100%" }}>
        <div className="clamp4" style={{ fontSize: 14, lineHeight: 1.85, fontWeight: k.type === "question" ? 700 : 500 }}>
          {showOriginal ? k.original.text : k.body}
        </div>
      </button>
      {k.fields && (
        <div style={{ marginTop: 9, padding: "9px 11px", borderRadius: R.ctl, background: T.limestone }}>
          {Object.entries(k.fields).slice(0, 3).map(([q, a]) => (
            <div key={q} className="row" style={{ gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 700, flex: "0 0 96px" }}>{q}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{a}</span>
            </div>
          ))}
        </div>
      )}
      {k.photos > 0 && (
        <div className="row" style={{ gap: 7, marginTop: 9 }}>
          {Array.from({ length: Math.min(3, k.photos) }).map((_, i) => (
            <div key={i} style={{ flex: 1 }}>
              <Photo kind={o?.scene || "alley"} seed={k.id + "p" + i} ratio="4 / 3" radius={R.ctl} scrim="none" />
            </div>
          ))}
        </div>
      )}
      {k.original && (
        <button className="press row" onClick={() => dispatch({ type: "translate", k: k.id })} style={{ gap: 5, marginTop: 8, fontSize: 11.5, color: T.muted, fontWeight: 700 }}>
          <Languages size={12} />{translated ? "عرض الترجمة" : `النص الأصلي — ${({ en: "English", ur: "اردو", id: "Bahasa" })[k.original.lang]}`}
        </button>
      )}
      <div className="row" style={{ gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {o && <button className="press" onClick={() => go({ s: "object", id: o.id })} style={{ fontSize: 11.5, fontWeight: 800, color: T.clay }}>↳ {o.name}</button>}
        <button className="press row" onClick={() => dispatch({ type: "helpful", k: k.id })} style={{ gap: 4, fontSize: 11.5, fontWeight: 700, color: state.helpful[k.id] ? T.ok : T.muted }}>
          <ThumbsUp size={12} />{ar(helpful)}
        </button>
        {k.answers > 0 && <span style={{ fontSize: 11.5, color: T.muted, fontWeight: 600 }}>{countAr(k.answers, "إجابة واحدة", "إجابتان", "إجابات", "إجابة")}</span>}
        {k.type === "question" && k.answers === 0 && <Pill tone={T.brass} size={10.5}>بلا إجابة</Pill>}
      </div>
    </div>
  );
}

function ScreenCommunity() {
  const { state, ctx, go, dispatch, toast } = useApp();
  const [tab, setTab] = useState("for-me");
  const [composer, setComposer] = useState(false);
  const [showHeld, setShowHeld] = useState(false);
  const heldItems = useMemo(() => CONTRIBUTIONS.filter((k) => k.flagged?.state === "held"), []);
  const mine = state.joinedCommunities;
  const following = state.followedCommunities;
  const relevant = (k) => k.communities.some((c) => mine.includes(c) || following.includes(c));

  const all = useMemo(() => allContributions(state).filter((k) => !k.parent), [state]);
  const pool = tab === "for-me" ? all.filter(relevant) : all;

  /* community home is an editorial mix, not eight equal cards */
  const openQuestions = pool.filter((k) => k.type === "question" && !k.answers).slice(0, 3);
  const usefulAnswers = useMemo(() => allContributions(state)
    .filter((k) => k.parent && (tab === "all" || relevant(k)))
    .sort((a, b) => (b.helpful || 0) - (a.helpful || 0)).slice(0, 3), [state, tab]);
  const photos = pool.filter((k) => k.photos > 0).slice(0, 4);
  const updates = pool.filter((k) => ["update", "correction"].includes(k.type)).slice(0, 3);
  const reports = pool.filter((k) => ["experience_report", "recommendation"].includes(k.type)).slice(0, 3);
  const myClubs = CLUBS.filter((cl) => mine.includes(cl.community) && cl.state === "active").slice(0, 4);
  const activityPrompts = useMemo(() => rank(INVENTORY.filter((o) => ["activity", "recurring"].includes(o.type) && isPromotable(o)), ctx, { limit: 6, maxPerCategory: 2 }), [ctx]);

  /* continue the conversation after you actually attended something */
  const justCompleted = state.plan.filter((p) => p.state === "completed").slice(-1)[0];
  const completedObj = justCompleted ? getObj(justCompleted.obj) : null;
  const alreadyShared = completedObj && state.contributions.some((k) => k.obj === completedObj.id);

  const suggestedCommunities = useMemo(() => COMMUNITIES.filter((c) => c.kind !== "family" && c.state === "active" && !mine.includes(c.id))
    .map((c) => {
      let s = c.members / 1000;
      if (c.nb === state.profile.nb) s += 9;
      if (ctx.interests.some((i) => c.id === i || c.family === i)) s += 5;
      if (c.family === "visitors" && state.profile.mode === "visitor") s += 7;
      return { c, s };
    }).sort((a, b) => b.s - a.s).slice(0, 4).map((x) => x.c), [mine, state.profile.nb, state.profile.mode, ctx.interests]);

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "sticky", top: 0, background: T.limestone, zIndex: 20, padding: "14px 16px 10px" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-.02em" }}>المجتمع</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>من المجتمع، إلى المجتمع</div>
          </div>
          <button className="press" onClick={() => setComposer(true)}
            style={{ height: 38, padding: "0 14px", borderRadius: R.pill, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13 }}>
            <Plus size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 5 }} />شارك
          </button>
        </div>
        <div className="row" style={{ gap: 14, marginTop: 12 }}>
          {[["for-me", "لك"], ["all", "كل المجتمعات"], ["browse", "تصفّح"]].map(([id, label]) => (
            <button key={id} className="press" onClick={() => setTab(id)}
              style={{ fontSize: 13.5, fontWeight: 800, paddingBottom: 6, borderBottom: `2px solid ${tab === id ? T.green : "transparent"}`, color: tab === id ? T.ink : T.muted }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "browse" ? (
        <div style={{ paddingTop: 12 }}>
          {FAMILIES.map((f) => (
            <div key={f.id} style={{ marginBottom: 22 }}>
              <SectionTitle title={f.name} sub={f.blurb} action="الكل" onAction={() => go({ s: "family", id: f.id })} />
              <div style={{ padding: "0 16px" }}>
                {subCommunities(f.id).slice(0, 3).map((c) => <CommunityRow key={c.id} c={c} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {completedObj && !alreadyShared && (
            <div className="up" style={{ margin: "12px 16px 20px", padding: "14px", borderRadius: R.box, background: T.sand }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>أكملت «{completedObj.name}»</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 5, lineHeight: 1.8 }}>
                تجربتك الآن أحدث معلومة عن {alType(completedObj)}. سطران يكفيان ليستفيد غيرك.
              </div>
              <button className="press" onClick={() => setComposer(true)}
                style={{ marginTop: 11, padding: "9px 15px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13 }}>
                اكتب تجربتك
              </button>
            </div>
          )}

          <div className="hs scroll" style={{ padding: "12px 16px 6px", gap: 10 }}>
            {FAMILIES.map((f) => (
              <button key={f.id} className="lift" onClick={() => go({ s: "family", id: f.id })} style={{ width: 132, textAlign: "start" }}>
                <Photo kind={f.scene} seed={"fam" + f.id} ratio="4 / 3" radius={R.media} scrim="strong">
                  <div style={{ position: "absolute", insetInlineStart: 9, bottom: 8, insetInlineEnd: 9 }}>
                    <div className="clamp1" style={{ fontSize: 13.5, fontWeight: 800, color: "#FFF8EA" }}>{f.name}</div>
                  </div>
                </Photo>
                <div style={{ fontSize: 10.5, color: T.muted, marginTop: 5, fontWeight: 600 }}>{countAr(subCommunities(f.id).length, "مجتمع واحد", "مجتمعان", "مجتمعات", "مجتمع")}</div>
              </button>
            ))}
          </div>

          {openQuestions.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <SectionTitle title="أسئلة تنتظر إجابة" sub="معرفتك قد تختصر على أحدهم وقتًا طويلًا" />
              <div style={{ padding: "0 16px" }}>{openQuestions.map((k) => <ContributionCard key={k.id} k={k} />)}</div>
            </div>
          )}

          {usefulAnswers.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <SectionTitle title="إجابات وجدها الناس مفيدة" sub="معرفة محلية، لا نصوص عامة" />
              <div style={{ padding: "0 16px" }}>{usefulAnswers.map((k) => <ContributionCard key={k.id} k={k} />)}</div>
            </div>
          )}

          {myClubs.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <SectionTitle title="أنديتك ومجموعاتك" sub="مشاركة تتكرر — لا زيارة واحدة" />
              <div className="hs scroll" style={{ padding: "0 16px 4px" }}>
                {myClubs.map((cl) => <ClubTile key={cl.id} cl={cl} />)}
              </div>
            </div>
          )}

          <div style={{ marginTop: 22 }}>
            <SectionTitle title="من النقاش إلى المشاركة" sub="أنشطة تبدأ من هذه المجتمعات ويمكنك الانضمام إليها" />
            <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{activityPrompts.map((x) => <TileCard key={x.o.id} x={x} w={190} />)}</div>
          </div>

          {photos.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <SectionTitle title="صور من المجتمع" sub="مما شاركه الناس مؤخرًا" />
              <div className="hs scroll" style={{ padding: "0 16px 4px" }}>
                {photos.map((k) => {
                  const o = k.obj ? getObj(k.obj) : null;
                  return (
                    <button key={k.id} className="lift" onClick={() => go({ s: "thread", id: k.id })} style={{ width: 172, textAlign: "start" }}>
                      <Photo kind={o?.scene || "alley"} seed={k.id + "cover"} ratio="1 / 1" radius={R.media} scrim="soft">
                        <div style={{ position: "absolute", insetInlineStart: 9, bottom: 8, insetInlineEnd: 9 }}>
                          <div className="clamp1" style={{ fontSize: 12, fontWeight: 800, color: "#FFF8EA" }}>{k.author.name}</div>
                        </div>
                      </Photo>
                      <div className="clamp2" style={{ fontSize: 12, color: T.muted, marginTop: 6, lineHeight: 1.6 }}>{k.body}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {updates.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <SectionTitle title="تحديثات وتصحيحات" sub="تغيّرات لاحظها الناس على أرض الواقع" />
              <div style={{ padding: "0 16px" }}>{updates.map((k) => <ContributionCard key={k.id} k={k} />)}</div>
            </div>
          )}

          {reports.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <SectionTitle title="تجارب وتوصيات" />
              <div style={{ padding: "0 16px" }}>{reports.map((k) => <ContributionCard key={k.id} k={k} />)}</div>
            </div>
          )}

          {heldItems.length > 0 && (
            <div style={{ margin: "6px 16px 18px" }}>
              <button className="press row" onClick={() => setShowHeld(!showHeld)}
                style={{ gap: 7, fontSize: 12.5, fontWeight: 800, color: T.muted }}>
                <Shield size={13} />{countAr(heldItems.length, "مساهمة واحدة", "مساهمتان", "مساهمات", "مساهمة")} قيد المراجعة {showHeld ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {showHeld && heldItems.map((k) => (
                <div key={k.id} style={{ marginTop: 10, padding: "12px", borderRadius: R.box, background: T.paper, border: `1px dashed ${T.warn}55` }}>
                  <div className="row" style={{ gap: 7, marginBottom: 6 }}>
                    <AlertTriangle size={13} color={T.warn} />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: T.warn }}>{k.flagged.reason}</span>
                  </div>
                  <div className="clamp2" style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.75 }}>{k.body}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 7, lineHeight: 1.7 }}>
                    {k.flagged.note} تقلّ ظهوره حتى تكتمل المراجعة البشرية، ولصاحبه حق الاعتراض.
                  </div>
                </div>
              ))}
            </div>
          )}

          {!state.contributions.length && (
            <div style={{ margin: "8px 16px 20px", padding: "14px", borderRadius: R.box, background: T.paper, border: `1px dashed ${T.line}` }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>لم تشارك بعد</div>
              <div style={{ fontSize: 12.5, color: T.muted, marginTop: 5, lineHeight: 1.8 }}>
                أسهل بداية: جواب قصير على سؤال مفتوح، أو نصيحة عملية عن مكان تعرفه. لا يلزم أن تكون خبيرًا.
              </div>
              <button className="press" onClick={() => setComposer(true)}
                style={{ marginTop: 11, padding: "9px 15px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, fontWeight: 800, fontSize: 13 }}>
                ابدأ بمساهمة صغيرة
              </button>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <SectionTitle title="مجتمعاتك" sub="ما تنضم إليه يظهر أولًا في رئيسيتك" action="تصفّح" onAction={() => setTab("browse")} />
            <div style={{ padding: "0 16px" }}>
              {mine.map((c) => COM[c] ? <CommunityRow key={c} c={COM[c]} /> : null)}
              {!mine.length && <div style={{ fontSize: 13, color: T.muted, padding: "10px 0", lineHeight: 1.8 }}>لم تنضم لأي مجتمع بعد.</div>}
            </div>
          </div>

          {suggestedCommunities.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <SectionTitle title="قد تناسبك" sub={`حسب حيّك واهتماماتك${state.profile.mode === "visitor" ? " ووضعك كزائر" : ""}`} />
              <div style={{ padding: "0 16px" }}>{suggestedCommunities.map((c) => <CommunityRow key={c.id} c={c} />)}</div>
            </div>
          )}
        </>
      )}

      <AskSheet open={composer} onClose={() => setComposer(false)} presetCommunity={mine[0]} presetObject={completedObj && !alreadyShared ? completedObj : null} />
    </div>
  );
}

function ClubTile({ cl }) {
  const { go } = useApp();
  const act = getObj(cl.activity);
  const next = act ? nextOccurrence(act) : null;
  return (
    <button className="lift" onClick={() => go({ s: "club", id: cl.id })} style={{ width: 196, textAlign: "start" }}>
      <Photo kind={act?.scene || "garden"} seed={"club" + cl.id} ratio="4 / 3" radius={R.media} scrim="strong">
        <div style={{ position: "absolute", insetInlineStart: 10, bottom: 9, insetInlineEnd: 10 }}>
          <div className="clamp1" style={{ fontSize: 14, fontWeight: 800, color: "#FFF8EA" }}>{cl.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,247,230,.85)", marginTop: 3 }}>{cl.cadence} — {ar(cl.members)} عضو</div>
        </div>
      </Photo>
      {next && <div style={{ fontSize: 11.5, color: T.ok, fontWeight: 700, marginTop: 6 }}>اللقاء القادم {inAr(next)}</div>}
    </button>
  );
}

function ScreenClub({ id }) {
  const { state, go, dispatch, toast, ctx } = useApp();
  const cl = CLUBS.find((c) => c.id === id);
  if (!cl) return <EmptyState title="هذا النادي غير متاح" body="" />;
  const act = getObj(cl.activity);
  const com = COM[cl.community];
  const joined = act ? state.plan.some((p) => p.obj === act.id && ["going", "registered", "confirmed", "active"].includes(p.state)) : false;
  const next = act ? nextOccurrence(act) : null;
  const threads = com ? contributionsIn(com.id, state).filter((k) => !k.parent).slice(0, 4) : [];

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "relative" }}>
        <Photo kind={act?.scene || "garden"} seed={"clubhero" + cl.id} ratio="16 / 9" radius={0} scrim="strong" />
        <button className="press" onClick={() => go({ back: true })} aria-label="رجوع"
          style={{ position: "absolute", insetInlineStart: 14, top: 14, width: 36, height: 36, borderRadius: R.pill, background: "rgba(20,16,12,.44)", color: "#FFF8EA", display: "grid", placeItems: "center" }}><ChevronRight size={20} /></button>
        <div style={{ position: "absolute", insetInlineStart: 16, bottom: 14, insetInlineEnd: 16 }}>
          <Pill tone="#FFF8EA" bg="rgba(20,16,12,.45)" strong>نادٍ — مشاركة متكررة</Pill>
          <div style={{ fontSize: 23, fontWeight: 800, color: "#FFF8EA", marginTop: 8 }}>{cl.name}</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,247,230,.85)", marginTop: 4 }}>{cl.cadence} — {ar(cl.members)} عضو</div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {cl.state !== "active" && (
          <div style={{ padding: "12px 13px", borderRadius: R.box, background: `${T.warn}12`, marginBottom: 14 }}>
            <div className="row" style={{ gap: 8 }}><AlertTriangle size={15} color={T.warn} />
              <span style={{ fontSize: 13, fontWeight: 800, color: T.warn }}>{cl.state === "paused" ? "متوقف مؤقتًا" : "غير نشط حاليًا"}</span></div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 6, lineHeight: 1.75 }}>
              لا نرشّح هذه المجموعة ضمن الأنشطة النشطة. تبقى هنا كسجل حتى يعود نشاطها.
            </div>
          </div>
        )}

        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 8 }}>ثلاثة أشياء مختلفة، مترابطة</div>
        <div style={{ borderRadius: R.box, border: `1px solid ${T.line}`, overflow: "hidden", marginBottom: 16 }}>
          {[
            com && { icon: Users, label: "المجتمع", value: com.name, go: () => go({ s: "community", id: com.id }), note: "مساحة معرفة دائمة" },
            { icon: RefreshCw, label: "النادي", value: cl.name, note: `مجموعة مشاركة متكررة — ${cl.cadence}` },
            act && { icon: CalendarCheck, label: "النشاط", value: act.name, go: () => go({ s: "object", id: act.id }), note: next ? `اللقاء القادم ${whenAr(next)}` : "لا موعد محدد الآن" },
          ].filter(Boolean).map((row, i) => (
            <button key={i} className="press" onClick={row.go} disabled={!row.go}
              style={{ display: "flex", width: "100%", gap: 11, textAlign: "start", padding: "13px", borderBottom: i < 2 ? `1px solid ${T.lineSoft}` : "none", background: T.paper, alignItems: "flex-start" }}>
              <row.icon size={16} color={T.green} style={{ marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 700 }}>{row.label}</div>
                <div className="clamp1" style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{row.value}</div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>{row.note}</div>
              </div>
              {row.go && <ChevronLeft size={16} color={T.muted} style={{ alignSelf: "center" }} />}
            </button>
          ))}
        </div>

        {act && cl.state === "active" && (
          <button className="press" onClick={() => { dispatch({ type: "join", obj: act.id }); toast("سُجّل حضورك في اللقاء القادم — الانضمام ليس حجزًا"); }}
            style={{ width: "100%", padding: "13px", borderRadius: R.ctl, background: joined ? T.paper : T.deep, color: joined ? T.ink : "#F6EFE0", border: `1px solid ${joined ? T.line : T.deep}`, fontWeight: 800, fontSize: 14 }}>
            {joined ? "أنت ضمن اللقاء القادم" : "انضم للقاء القادم"}
          </button>
        )}
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 10, lineHeight: 1.8 }}>
          قائمة المشاركين غير معلنة. ترى العدد فقط، ولا يُنشر موقع أحد.
        </div>
      </div>

      {threads.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <SectionTitle title="نقاش المجموعة" sub={`من ${com?.name}`} />
          <div style={{ padding: "0 16px" }}>{threads.map((k) => <ContributionCard key={k.id} k={k} />)}</div>
        </div>
      )}
    </div>
  );
}

function ScreenFamily({ id }) {
  const { go } = useApp();
  const f = FAMILIES.find((x) => x.id === id);
  const subs = subCommunities(id);
  if (!f) return <EmptyState title="غير موجود" body="" />;
  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "relative" }}>
        <Photo kind={f.scene} seed={"famhero" + f.id} ratio="16 / 9" radius={0} scrim="strong" mark={false} />
        <button className="press" onClick={() => go({ back: true })} style={{ position: "absolute", insetInlineStart: 14, top: 14, width: 36, height: 36, borderRadius: R.pill, background: "rgba(20,16,12,.44)", color: "#FFF8EA", display: "grid", placeItems: "center" }}><ChevronRight size={20} /></button>
        <div style={{ position: "absolute", insetInlineStart: 16, bottom: 14, insetInlineEnd: 16 }}>
          <div style={{ fontSize: 23, fontWeight: 800, color: "#FFF8EA" }}>{f.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,247,230,.85)", marginTop: 4 }}>{f.blurb}</div>
        </div>
      </div>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>{ar(subs.length)} مجتمع داخل هذه العائلة</div>
        {subs.map((c) => <CommunityRow key={c.id} c={c} />)}
      </div>
    </div>
  );
}

function ScreenCommunityDetail({ id }) {
  const { state, dispatch, go, toast, ctx } = useApp();
  const c = COM[id];
  const [composer, setComposer] = useState(false);
  const [tab, setTab] = useState("useful");
  if (!c) return <EmptyState title="هذا المجتمع غير متاح" body="قد يكون أُرشف." />;
  const joined = state.joinedCommunities.includes(c.id);
  const followed = state.followedCommunities.includes(c.id);
  const items = contributionsIn(c.id, state).filter((k) => !k.parent);
  const list = tab === "questions" ? items.filter((k) => k.type === "question")
    : tab === "reports" ? items.filter((k) => ["experience_report", "recommendation", "update", "photo"].includes(k.type))
    : items.slice().sort((a, b) => (b.helpful + b.answers * 5) - (a.helpful + a.answers * 5));
  const linkedObjects = useMemo(() => rank(INVENTORY.filter((o) => o.communities.includes(c.id) && isPromotable(o)), ctx, { limit: 6, maxPerCategory: 3 }), [c.id, ctx]);
  const clubs = CLUBS.filter((cl) => cl.community === c.id);

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ position: "relative" }}>
        <Photo kind={c.scene} seed={"com" + c.id} ratio="16 / 9" radius={0} scrim="strong" mark={false} />
        <button className="press" onClick={() => go({ back: true })} style={{ position: "absolute", insetInlineStart: 14, top: 14, width: 36, height: 36, borderRadius: R.pill, background: "rgba(20,16,12,.44)", color: "#FFF8EA", display: "grid", placeItems: "center" }}><ChevronRight size={20} /></button>
        <div style={{ position: "absolute", insetInlineStart: 16, bottom: 14, insetInlineEnd: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#FFF8EA" }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,247,230,.85)", marginTop: 4 }}>{ar(c.members.toLocaleString("en-US"))} عضو — {c.state === "active" ? "نشط" : "غير نشط"}</div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontSize: 14, lineHeight: 1.85 }}>{c.blurb}</div>
        <div className="row" style={{ gap: 9, marginTop: 14 }}>
          <button className="press" onClick={() => { dispatch({ type: "join_community", com: c.id }); toast(joined ? "غادرت المجتمع" : "انضممت — ستظهر معرفته في رئيسيتك"); }}
            style={{ flex: 1, padding: "11px", borderRadius: R.ctl, background: joined ? T.paper : T.deep, color: joined ? T.ink : "#F6EFE0", border: `1px solid ${joined ? T.line : T.deep}`, fontWeight: 800, fontSize: 13.5 }}>
            {joined ? "أنت عضو" : "انضم"}
          </button>
          <button className="press" onClick={() => { dispatch({ type: "follow_community", com: c.id }); toast(followed ? "لن نُظهر محتواه في رئيسيتك" : "تتابعه الآن — يظهر محتواه دون أن تكون عضوًا"); }}
            style={{ padding: "11px 15px", borderRadius: R.ctl, background: T.paper, border: `1px solid ${followed ? T.green : T.line}`, color: followed ? T.green : T.ink, fontWeight: 800, fontSize: 13.5 }}>
            {followed ? "تتابعه" : "تابِع"}
          </button>
          <button className="press" onClick={() => setComposer(true)} aria-label="اكتب مساهمة"
            style={{ width: 44, padding: "11px 0", borderRadius: R.ctl, background: T.paper, border: `1px solid ${T.line}`, display: "grid", placeItems: "center" }}>
            <Pencil size={16} />
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 11.5, color: T.muted, lineHeight: 1.8 }}>
          الانضمام لا ينشر هويتك ولا موقعك. تظهر مساهماتك باسمك المعروض فقط.
        </div>
      </div>

      {clubs.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <SectionTitle title="أندية ومجموعات متكررة" sub="مشاركة تتكرر، لا زيارة واحدة" />
          <div style={{ padding: "0 16px" }}>
            {clubs.map((cl) => {
              const act = getObj(cl.activity);
              return (
                <button key={cl.id} className="lift" onClick={() => go({ s: "club", id: cl.id })}
                  style={{ display: "flex", width: "100%", gap: 12, textAlign: "start", padding: "12px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
                  <div style={{ width: 52, flex: "0 0 52px" }}><Photo kind={act?.scene || "garden"} seed={cl.id} ratio="1 / 1" radius={R.box} scrim="none" mark={false} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 800 }}>{cl.name}</span>
                      {cl.state !== "active" && <Pill tone={T.muted} size={10}>{cl.state === "paused" ? "متوقف مؤقتًا" : "غير نشط"}</Pill>}
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{cl.cadence} — {ar(cl.members)} عضو</div>
                  </div>
                  <ChevronLeft size={16} color={T.muted} style={{ alignSelf: "center" }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {linkedObjects.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <SectionTitle title="أماكن وأنشطة يتحدث عنها المجتمع" />
          <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{linkedObjects.map((x) => <TileCard key={x.o.id} x={x} w={180} />)}</div>
        </div>
      )}

      <div style={{ marginTop: 22, padding: "0 16px" }}>
        <div className="row" style={{ gap: 14, marginBottom: 6 }}>
          {[["useful", "الأكثر فائدة"], ["questions", "أسئلة"], ["reports", "تجارب وتحديثات"]].map(([k, l]) => (
            <button key={k} className="press" onClick={() => setTab(k)}
              style={{ fontSize: 13, fontWeight: 800, paddingBottom: 5, borderBottom: `2px solid ${tab === k ? T.green : "transparent"}`, color: tab === k ? T.ink : T.muted }}>{l}</button>
          ))}
        </div>
        {list.length ? list.map((k) => <ContributionCard key={k.id} k={k} />)
          : <EmptyState icon={MessageCircle} title="لا مساهمات هنا بعد" body="كن أول من يكتب — سؤال واحد يكفي لبدء النقاش." action="اكتب مساهمة" onAction={() => setComposer(true)} />}
      </div>

      <div style={{ marginTop: 22, padding: "0 16px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 8 }}>قواعد بسيطة</div>
        {c.rules.map((r, i) => (
          <div key={i} className="row" style={{ gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: T.brass, marginTop: 8 }} />
            <span style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8 }}>{r}</span>
          </div>
        ))}
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 8 }}>الإشراف: {c.moderators.join("، ")}</div>
      </div>

      <AskSheet open={composer} onClose={() => setComposer(false)} presetCommunity={c.id} />
    </div>
  );
}

/* ───────── Thread — the author's voice is preserved; translation is a view ───────── */

function ScreenThread({ id }) {
  const { state, dispatch, go, toast } = useApp();
  const root = findContribution(id, state);
  const [reply, setReply] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  if (!root) return <EmptyState title="لم نعد نجد هذه المساهمة" body="قد تكون أُزيلت." />;
  const answers = answersFor(root.id, state);
  const o = root.obj ? getObj(root.obj) : null;
  const com = COM[root.communities[0]];

  const send = () => {
    if (!reply.trim()) return;
    dispatch({ type: "contribute", contribution: { type: "answer", communities: root.communities, author: { name: "أنت", role: state.profile.mode === "visitor" ? "زائر" : "من السكان", kind: "resident" }, body: reply.trim(), obj: root.obj, parent: root.id, helpful: 0, lang: "ar" } });
    setReply(""); toast("نُشرت إجابتك");
  };

  return (
    <div className="scroll" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ position: "sticky", top: 0, background: T.limestone, zIndex: 20, padding: "12px 16px 10px" }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="press" onClick={() => go({ back: true })} aria-label="رجوع"><ChevronRight size={22} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="clamp1" style={{ fontSize: 15, fontWeight: 800 }}>{com?.name || "نقاش"}</div>
            <div style={{ fontSize: 11.5, color: T.muted }}>{countAr(answers.length, "إجابة واحدة", "إجابتان", "إجابات", "إجابة")}</div>
          </div>
          <button className="press" onClick={() => setReportOpen(true)} aria-label="إبلاغ"><Flag size={16} color={T.muted} /></button>
        </div>
      </div>

      <div style={{ padding: "6px 16px 0", flex: 1 }}>
        <ContributionCard k={root} onOpen={() => {}} />
        {o && (
          <button className="lift" onClick={() => go({ s: "object", id: o.id })}
            style={{ display: "flex", width: "100%", gap: 11, textAlign: "start", marginTop: 12, padding: "10px", borderRadius: R.box, background: T.paper, border: `1px solid ${T.line}` }}>
            <div style={{ width: 48, flex: "0 0 48px" }}><Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="1 / 1" radius={R.ctl} scrim="none" mark={false} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 700 }}>مرتبط بـ</div>
              <div className="clamp1" style={{ fontSize: 14, fontWeight: 800, marginTop: 2 }}>{o.name}</div>
              <MetaLine o={o} />
            </div>
            <ChevronLeft size={16} color={T.muted} style={{ alignSelf: "center" }} />
          </button>
        )}

        {o && state.plan.some((p) => p.obj === o.id && p.state === "completed") && (
          <div style={{ marginTop: 14, padding: "13px", borderRadius: R.box, background: T.sand }}>
            <div style={{ fontSize: 13.5, fontWeight: 800 }}>أنت جرّبت هذا فعلًا</div>
            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 5, lineHeight: 1.8 }}>
              إجابتك هنا أقوى من أي مصدر آخر، لأنها من زيارة حديثة.
            </div>
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          {answers.length === 0 && (
            <div style={{ padding: "18px 0", fontSize: 13.5, color: T.muted, lineHeight: 1.85 }}>
              لا إجابة بعد. إذا كنت تعرف الجواب من تجربة حقيقية، إجابتك هنا أنفع من بحث طويل.
            </div>
          )}
          {answers.map((k) => (
            <div key={k.id} style={{ borderInlineStart: `2px solid ${T.sand}`, paddingInlineStart: 12, marginBottom: 4 }}>
              <ContributionCard k={k} onOpen={() => {}} />
              {k.providerReply && (
                <div style={{ margin: "-4px 0 14px", padding: "11px 12px", borderRadius: R.box, background: T.sand }}>
                  <div className="row" style={{ gap: 7, marginBottom: 5 }}>
                    <Store size={13} color="#54697E" /><span style={{ fontSize: 12, fontWeight: 800 }}>{k.providerReply.by}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>— {ar(k.providerReply.days)} يوم</span>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.8 }}>{k.providerReply.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "sticky", bottom: 0, zIndex: 30, padding: "12px 16px 14px", marginTop: "auto", background: "linear-gradient(180deg, rgba(244,239,229,0), #F4EFE5 32%)" }}>
        <div className="row" style={{ gap: 8 }}>
          <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتب إجابة من تجربتك" dir="rtl"
            style={{ flex: 1, background: T.paper, border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "11px 13px", fontSize: 13.5, outline: "none" }} />
          <button className="press" onClick={send} aria-label="إرسال"
            style={{ width: 44, height: 44, borderRadius: R.ctl, background: reply.trim() ? T.deep : T.line, color: reply.trim() ? "#F6EFE0" : T.muted, display: "grid", placeItems: "center" }}>
            <Send size={17} />
          </button>
        </div>
      </div>

      <Sheet open={reportOpen} onClose={() => setReportOpen(false)} title="الإبلاغ عن محتوى">
        <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.85, marginBottom: 14 }}>
          اختر السبب. البلاغ يذهب للمراجعة البشرية، ولا يحذف المحتوى تلقائيًا.
        </div>
        {["معلومة غير صحيحة", "ترويج غير مفصح عنه", "محتوى مسيء", "انتحال شخصية", "محتوى مكرر"].map((r) => (
          <button key={r} className="press" onClick={() => { dispatch({ type: "report", k: root.id, reason: r }); setReportOpen(false); toast("وصلنا بلاغك — سيراجعه فريق الإشراف"); }}
            style={{ display: "block", width: "100%", textAlign: "start", padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}`, fontSize: 14, fontWeight: 600 }}>{r}</button>
        ))}
        <button className="press" onClick={() => { dispatch({ type: "block", who: root.author.name }); setReportOpen(false); toast("لن تظهر لك مساهمات هذا الحساب"); }}
          style={{ display: "block", width: "100%", textAlign: "start", padding: "14px 0", fontSize: 14, fontWeight: 700, color: T.warn }}>
          <Ban size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />حظر {root.author.name}
        </button>
      </Sheet>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PLAN — continuity, not a favourites tab
   ═══════════════════════════════════════════════════════════════════════════ */

function ScreenPlan() {
  const { state, ctx, go, dispatch, toast } = useApp();
  const [completing, setCompleting] = useState(null);
  const items = state.plan.filter((p) => p.state !== "cancelled");

  const bucketOf = (p) => {
    const o = getObj(p.obj);
    if (p.state === "active") return "now";
    if (p.state === "completed") return "completed";
    if (p.state === "saved") return "saved";
    if (p.state === "interested") return "interested";
    if (p.state === "confirmed") return "confirmed";
    const n = o ? nextOccurrence(o) : null;
    if (n && mkDayStart(n) === mkDayStart(NOW)) return "today";
    return "upcoming";
  };
  const grouped = {};
  items.forEach((p) => { const b = bucketOf(p); (grouped[b] = grouped[b] || []).push(p); });
  Object.values(grouped).forEach((list) => list.sort((a, b) => {
    const oa = getObj(a.obj), ob = getObj(b.obj);
    const na = oa && nextOccurrence(oa), nb = ob && nextOccurrence(ob);
    return (na ? +na : Infinity) - (nb ? +nb : Infinity);
  }));

  const completed = items.filter((p) => p.state === "completed");
  const needsAttention = items.filter((p) => {
    const o = getObj(p.obj); if (!o) return false;
    if (p.state === "awaiting") return true;
    const tr = objectTrust(o, state.resolved);
    return ["conflicting", "possibly_stale", "expired"].includes(tr.state) && !["completed", "saved"].includes(p.state);
  });

  const whatNext = useMemo(() => {
    if (!completed.length) return [];
    const last = getObj(completed[completed.length - 1].obj);
    return rank(INVENTORY.filter((o) => o.id !== last?.id && isPromotable(o) && !state.plan.some((p) => p.obj === o.id)),
      { ...ctx, noveltySeeking: true, planNeighborhoods: last ? [last.neighborhood] : [] }, { limit: 4, maxPerCategory: 1 });
  }, [completed.length, ctx, state.plan]);

  if (!items.length) {
    return (
      <div className="scroll" style={{ paddingBottom: 96 }}>
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 21, fontWeight: 800 }}>خطتي</div>
          <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>ما ستفعله، وما بعده</div>
        </div>
        <EmptyState icon={CalendarCheck} title="خطتك فارغة الآن"
          body="احفظ ما يعجبك، أو أضف شيئًا إلى خطتك. الحفظ ليس حجزًا، والإضافة إلى الخطة ليست تسجيلًا ولا تأكيدًا — نُبقي الفرق واضحًا دائمًا."
          action="تصفّح اكتشف" onAction={() => go({ s: "discover" })} />
      </div>
    );
  }

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ padding: "16px 16px 10px" }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>خطتي</div>
        <div style={{ fontSize: 12.5, color: T.muted, marginTop: 3 }}>
          {countAr(items.length, "عنصر واحد", "عنصران", "عناصر", "عنصر")} — كل حالة تعني شيئًا مختلفًا
        </div>
      </div>

      {needsAttention.length > 0 && (
        <div style={{ margin: "0 16px 18px", padding: "13px", borderRadius: R.box, background: `${T.warn}10`, border: `1px solid ${T.warn}2E` }}>
          <div className="row" style={{ gap: 8, marginBottom: 7 }}>
            <AlertTriangle size={15} color={T.warn} />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: T.warn }}>{countAr(needsAttention.length, "عنصر واحد", "عنصران", "عناصر", "عنصر")} يحتاج مراجعة</span>
          </div>
          {needsAttention.slice(0, 3).map((p) => {
            const o = getObj(p.obj);
            const tr = objectTrust(o, state.resolved);
            return (
              <button key={p.id} className="press" onClick={() => go({ s: "object", id: o.id })}
                style={{ display: "block", width: "100%", textAlign: "start", padding: "7px 0" }}>
                <div className="clamp1" style={{ fontSize: 13, fontWeight: 700 }}>{o.name}</div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>
                  {p.state === "awaiting" ? "انتقلت لإكمال الحجز ولم يصلنا تأكيد" : TRUST_STATE[tr.state]?.label}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {PLAN_BUCKETS.map((b) => {
        const list = grouped[b.id];
        if (!list?.length) return null;
        return (
          <div key={b.id} style={{ marginBottom: 24 }}>
            <SectionTitle title={b.label} sub={
              b.id === "now" ? "ما أنت فيه الآن" :
              b.id === "saved" ? "محفوظ فقط — بلا التزام" :
              b.id === "interested" ? "سجّلنا اهتمامك، ونذكّرك إن اقترب موعده" :
              b.id === "confirmed" ? "وصلنا تأكيد أو أكّدته بنفسك" : undefined} />
            <div style={{ padding: "0 16px" }}>
              {list.map((p) => <PlanRow key={p.id} p={p} onComplete={() => setCompleting(getObj(p.obj))} />)}
            </div>
          </div>
        );
      })}

      {whatNext.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionTitle title="ماذا بعد؟" sub="بناءً على ما أكملته — بدون إعادة عرض نفس التجربة" />
          <div className="hs scroll" style={{ padding: "0 16px 4px" }}>{whatNext.map((x) => <TileCard key={x.o.id} x={x} w={182} />)}</div>
        </div>
      )}

      <CompletionSheet o={completing} open={!!completing} onClose={() => setCompleting(null)} />
    </div>
  );
}

function PlanRow({ p, onComplete }) {
  const { go, dispatch, toast, state } = useApp();
  const [open, setOpen] = useState(false);
  const o = getObj(p.obj);
  if (!o) return null;
  const s = PLAN_STATE[p.state];
  const next = nextOccurrence(o);
  const trust = objectTrust(o, state.resolved);
  const warn = ["conflicting", "possibly_stale", "expired"].includes(trust.state);

  const actions = [];
  if (p.state === "saved" || p.state === "interested") actions.push({ label: "أضف إلى خطتي", act: () => { dispatch({ type: "plan", obj: o.id }); toast("أصبح في خطتك — لم يُحجز بعد"); } });
  if (["planned", "going", "registered", "confirmed"].includes(p.state)) actions.push({ label: "ابدأ الآن", act: () => { dispatch({ type: "start", obj: o.id }); toast("بدأت — المعلومات العملية أولًا"); } });
  if (p.state === "awaiting") {
    actions.push({ label: "أكّد الحجز", act: () => { dispatch({ type: "book_confirm", obj: o.id, source: "user" }); toast("تم التأكيد بناءً على تأكيدك أنت"); } });
    actions.push({ label: "لم يكتمل", act: () => { dispatch({ type: "book_fail", obj: o.id }); toast("أبقيناه غير مؤكد في خطتك"); } });
  }
  if (p.state === "active") actions.push({ label: "أكملت هذا", act: () => { dispatch({ type: "complete", obj: o.id }); onComplete && onComplete(); } });
  if (p.state === "completed") actions.push({ label: "شارك تجربتك", act: () => onComplete && onComplete() });
  if (!["completed", "cancelled"].includes(p.state)) actions.push({ label: "أزل من خطتي", act: () => { dispatch({ type: "remove_plan", obj: o.id }); toast("أزلناه من خطتك"); }, danger: true });

  return (
    <div style={{ display: "flex", gap: 12, padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 10px" }}>
        <span style={{ width: 10, height: 10, borderRadius: 99, background: s.tone, marginTop: 5 }} />
        <span style={{ width: 2, flex: 1, background: T.sand, marginTop: 5 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button className="lift" onClick={() => go({ s: "object", id: o.id })} style={{ textAlign: "start", width: "100%" }}>
          <div className="row" style={{ gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
            <Pill tone={s.tone} bg={`${s.tone}16`} icon={s.icon}>{s.label}</Pill>
            {warn && <Pill tone={T.warn} bg={`${T.warn}16`} icon={AlertTriangle}>يحتاج مراجعة</Pill>}
          </div>
          <div className="clamp2" style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.45 }}>{o.name}</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
            {[
              p.state === "completed" ? `اكتمل ${agoAr(p.completedAt || p.at)}`
                : p.state === "active" ? "بدأ للتو"
                : next ? whenAr(next) : timingLabel(o),
              NB[o.neighborhood]?.name,
              p.state === "completed" ? null : o.duration ? minutesAr(o.duration) : null,
            ].filter(Boolean).join(" — ")}
          </div>
        </button>
        <div className="row" style={{ gap: 8, marginTop: 9, flexWrap: "wrap" }}>
          {actions.slice(0, open ? actions.length : 2).map((a) => (
            <button key={a.label} className="press" onClick={a.act}
              style={{ padding: "7px 12px", borderRadius: R.pill, border: `1px solid ${a.danger ? `${T.warn}44` : T.line}`, background: T.paper, fontSize: 12, fontWeight: 800, color: a.danger ? T.warn : T.ink }}>
              {a.label}
            </button>
          ))}
          {actions.length > 2 && (
            <button className="press" onClick={() => setOpen(!open)} style={{ fontSize: 12, fontWeight: 800, color: T.muted, padding: "7px 4px" }}>
              {open ? "أقل" : "المزيد"}
            </button>
          )}
        </div>
      </div>
      <div style={{ width: 76, flex: "0 0 76px" }}>
        <Photo kind={o.scene} seed={o.id} photo={o.photo} ratio="1 / 1" radius={R.box} scrim="none" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROFILE / CONTEXT — what EyeMakkah remembers, and how to correct it
   ═══════════════════════════════════════════════════════════════════════════ */

function Toggle({ on, onChange, label, note }) {
  return (
    <button className="press" onClick={() => onChange(!on)}
      style={{ display: "flex", width: "100%", gap: 12, alignItems: "flex-start", padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}`, textAlign: "start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
        {note && <div style={{ fontSize: 12, color: T.muted, marginTop: 4, lineHeight: 1.7 }}>{note}</div>}
      </div>
      <span style={{ width: 42, height: 25, borderRadius: R.pill, background: on ? T.green : T.line, position: "relative", flex: "0 0 42px", transition: "background .18s" }}>
        <span style={{ position: "absolute", top: 3, insetInlineStart: on ? 20 : 3, width: 19, height: 19, borderRadius: 99, background: T.paper, transition: "inset-inline-start .18s" }} />
      </span>
    </button>
  );
}

function ScreenProfile() {
  const { state, dispatch, go, toast, ctx } = useApp();
  const p = state.profile;
  const inferred = useMemo(() => {
    const aff = {};
    for (const ev of state.log) {
      const w = ACTION_WEIGHT[ev.type]; if (!w || w < 0) continue;
      const o = ev.obj ? getObj(ev.obj) : null; if (!o) continue;
      aff[o.category] = (aff[o.category] || 0) + w;
    }
    return Object.entries(aff).filter(([k, v]) => v >= 1 && !p.interests.includes(k)).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [state.log, p.interests]);

  const completed = state.plan.filter((x) => x.state === "completed");
  const saved = Object.keys(state.saved);

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ padding: "14px 16px 0" }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="press" onClick={() => go({ back: true })} aria-label="رجوع"><ChevronRight size={22} /></button>
          <div style={{ fontSize: 20, fontWeight: 800 }}>حسابي</div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 8 }}>أنت في مكة بصفة</div>
        <div className="row" style={{ gap: 8 }}>
          {[["resident", "مقيم"], ["visitor", "زائر"]].map(([m, l]) => (
            <Chip key={m} active={p.mode === m} onClick={() => { dispatch({ type: "profile", patch: { mode: m, nb: m === "visitor" ? "ajyad" : "awali" } }); toast(`حُدّثت الرئيسية لتناسب وضع ${l}`); }}>{l}</Chip>
          ))}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "18px 0 8px" }}>حيّك أو منطقتك الحالية</div>
        <div className="hs scroll" style={{ gap: 8 }}>
          {NEIGHBORHOODS.filter((n) => n.id !== "haram-area").map((n) => (
            <Chip key={n.id} active={p.nb === n.id} onClick={() => dispatch({ type: "profile", patch: { nb: n.id } })}>{n.name}</Chip>
          ))}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "18px 0 8px" }}>من معك عادة</div>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          {[["solo", "بمفردي"], ["family", "مع العائلة"], ["kids", "مع أطفال"], ["group", "مع مجموعة"]].map(([v, l]) => (
            <Chip key={v} active={p.party === v} onClick={() => dispatch({ type: "profile", patch: { party: v } })}>{l}</Chip>
          ))}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "18px 0 8px" }}>اهتماماتك المعلنة</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => {
            const on = p.interests.includes(c.id);
            return (
              <Chip key={c.id} icon={c.icon} active={on}
                onClick={() => dispatch({ type: "profile", patch: { interests: on ? p.interests.filter((x) => x !== c.id) : [...p.interests, c.id] } })}>
                {c.name}
              </Chip>
            );
          })}
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "20px 0 8px" }}>ما فهمه EyeMakkah من تفاعلك</div>
        {inferred.length ? (
          <div>
            <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 10, lineHeight: 1.75 }}>
              هذه استنتاجات من سلوكك داخل التطبيق فقط. يمكنك إزالة أي منها، ولن نستنتج أمورًا حساسة عنك.
            </div>
            {inferred.map(([k]) => (
              <div key={k} className="row" style={{ justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{CAT[k]?.name}</span>
                <button className="press" onClick={() => { dispatch({ type: "remove_interest", interest: k }); toast("أزلناه — ستقل نتائجه دون أن تختفي بقية السياق"); }}
                  style={{ fontSize: 12.5, fontWeight: 800, color: T.warn }}>أزل</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8 }}>لم يتكوّن استنتاج واضح بعد. تصفّح واحفظ وشارك، وستجد ما فهمه هنا.</div>
        )}

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "20px 0 4px" }}>الخصوصية والتحكم</div>
        <Toggle on={p.locationGranted} onChange={(v) => dispatch({ type: "profile", patch: { locationGranted: v } })}
          label="استخدام الموقع" note="يُستخدم للمسافات و«قريب منك» فقط. لا يُنشر موقعك لأحد، ولا يظهر لأعضاء المجتمع." />
        <Toggle on={p.personalization} onChange={(v) => dispatch({ type: "profile", patch: { personalization: v } })}
          label="التخصيص من سلوكك" note="عند الإيقاف تصبح النتائج عامة وتختفي أسباب «لماذا ظهر لك»." />
        <Toggle on={p.notifications} onChange={(v) => dispatch({ type: "profile", patch: { notifications: v } })}
          label="الإشعارات المفيدة" note="ردّ على سؤالك، تغيّر في خطتك، أو عرض حفظته على وشك الانتهاء. لا إشعارات تسويقية عامة." />
        <Toggle on={p.access.includes("stepfree")} onChange={(v) => dispatch({ type: "profile", patch: { access: v ? uniq([...p.access, "stepfree"]) : p.access.filter((a) => a !== "stepfree") } })}
          label="أفضّل مسارات بدون درج" note="يؤثر في الترتيب ويعرض معلومات الوصول أولًا. لا نستنتج أي معلومة صحية." />
        <Toggle on={p.womenOnly} onChange={(v) => dispatch({ type: "profile", patch: { womenOnly: v } })}
          label="إبراز الأنشطة المخصصة للنساء" note="يرفع ترتيب الأنشطة التي يعلن منظّموها أنها مخصصة للنساء." />
        <Toggle on={p.firstTime} onChange={(v) => dispatch({ type: "profile", patch: { firstTime: v } })}
          label="هذه أول زيارة لي لمكة" note="نبدأ بما يناسب أول زيارة، ونشرح أكثر بدل أن نفترض معرفة سابقة." />
        <Toggle on={p.autoTranslate} onChange={(v) => dispatch({ type: "profile", patch: { autoTranslate: v } })}
          label="ترجمة المساهمات تلقائيًا" note="الترجمة طبقة عرض فقط — النص الأصلي وكاتبه يبقيان ظاهرين دائمًا." />

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "22px 0 8px" }}>حجم النص</div>
        <div className="row" style={{ gap: 8 }}>
          {[[0.92, "أصغر"], [1, "عادي"], [1.12, "أكبر"], [1.25, "الأكبر"]].map(([v, l]) => (
            <Chip key={l} active={Math.abs(p.textScale - v) < 0.01} onClick={() => dispatch({ type: "profile", patch: { textScale: v } })}>{l}</Chip>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 8, lineHeight: 1.75 }}>
          يؤثر على نصوص التطبيق كاملة. كما نحترم إعداد «تقليل الحركة» في نظامك تلقائيًا.
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "20px 0 8px" }}>نشاطك</div>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Stat n={saved.length} l="محفوظ" onClick={() => go({ s: "plan" })} />
          <Stat n={state.plan.filter((x) => !["saved", "completed", "cancelled"].includes(x.state)).length} l="في خطتي" onClick={() => go({ s: "plan" })} />
          <Stat n={completed.length} l="مكتمل" onClick={() => go({ s: "plan" })} />
          <Stat n={state.contributions.length} l="مساهماتي" onClick={() => go({ s: "community" })} />
          <Stat n={state.joinedCommunities.length} l="مجتمعاتي" onClick={() => go({ s: "community" })} />
        </div>

        {Object.keys(state.dismissed).length > 0 && (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 800, margin: "20px 0 8px" }}>عناصر أخفيتها</div>
            {Object.keys(state.dismissed).slice(0, 5).map((id) => {
              const o = getObj(id); if (!o) return null;
              return (
                <div key={id} className="row" style={{ justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
                  <span className="clamp1" style={{ fontSize: 13.5, fontWeight: 600 }}>{o.name}</span>
                  <button className="press" onClick={() => dispatch({ type: "undismiss", obj: id })} style={{ fontSize: 12.5, fontWeight: 800, color: T.green }}>أعده</button>
                </div>
              );
            })}
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 8, lineHeight: 1.8 }}>إخفاء مرة واحدة لا يعني كرهًا دائمًا — نقلّل التكرار فقط.</div>
          </>
        )}

        <button className="press" onClick={() => go({ s: "provider" })}
          style={{ display: "flex", width: "100%", gap: 11, textAlign: "start", marginTop: 22, padding: "13px", borderRadius: R.box, border: `1px solid ${T.line}`, background: T.paper, alignItems: "flex-start" }}>
          <Store size={17} color={T.green} style={{ marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>أدوات مقدّم التجربة</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4, lineHeight: 1.7 }}>
              دور منفصل: انشر، حدّث معلوماتك العملية، ردّ على أسئلة المجتمع، واطّلع على الإشارات المجمّعة.
            </div>
          </div>
          <ChevronLeft size={16} color={T.muted} style={{ alignSelf: "center" }} />
        </button>

        <div style={{ fontSize: 13.5, fontWeight: 800, margin: "22px 0 8px" }}>السلامة والإشراف</div>
        <div style={{ borderRadius: R.box, border: `1px solid ${T.line}`, overflow: "hidden", background: T.paper }}>
          {[
            { icon: Flag, label: "بلاغاتك", value: countAr(Object.keys(state.reported).length, "بلاغ واحد", "بلاغان", "بلاغات", "بلاغ"), note: "كل بلاغ يذهب لمراجعة بشرية، ولا يحذف المحتوى تلقائيًا" },
            { icon: Ban, label: "حسابات محظورة", value: countAr(state.blocked.length, "حساب واحد", "حسابان", "حسابات", "حساب"), note: state.blocked.length ? state.blocked.join("، ") : "لا يظهر لك محتوى من تحظره" },
            { icon: Pencil, label: "تصحيحات أرسلتها", value: countAr((state.reviews || []).length, "تصحيح واحد", "تصحيحان", "تصحيحات", "تصحيح"), note: "تُسجَّل كمصدر مجتمعي بتاريخها ولا تستبدل معلومة رسمية" },
            { icon: Lock, label: "خصوصية الحضور", value: "غير معلنة", note: "لا نعرض قوائم المشاركين ولا مواقع المستخدمين لأحد" },
          ].map((row, i, arr) => (
            <div key={row.label} className="row" style={{ gap: 11, padding: "12px 13px", borderBottom: i < arr.length - 1 ? `1px solid ${T.lineSoft}` : "none", alignItems: "flex-start" }}>
              <row.icon size={16} color={T.green} style={{ marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{row.label}</span>
                  <span style={{ fontSize: 12.5, color: T.muted, fontWeight: 700 }}>{row.value}</span>
                </div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4, lineHeight: 1.7 }}>{row.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ margin: "14px 0 10px", padding: "13px", borderRadius: R.box, background: T.limestone, fontSize: 11.5, color: T.muted, lineHeight: 1.9 }}>
          <div style={{ fontWeight: 800, color: T.ink, marginBottom: 5 }}>ما لا نفعله</div>
          لا نعرض مستخدمين قريبين منك، ولا نطابق بين الغرباء، ولا ننشر موقع أحد، ولا نستنتج
          معلومات صحية أو دينية أو هوية من سلوكك، ولا نمنح شارة «موثوق» عامة بلا مصدر.
        </div>

        <div style={{ margin: "14px 0 10px", padding: "13px", borderRadius: R.box, background: T.sand, fontSize: 12, color: T.muted, lineHeight: 1.9 }}>
          <div style={{ fontWeight: 800, color: T.ink, marginBottom: 5 }}>عن هذا النموذج</div>
          EyeMakkah — مجتمع مكة الرقمي. نموذج منتج للسكان والزوار.
          الصور التعبيرية مرسومة داخل التطبيق، والقيم التشغيلية والمساهمات توضيحية ولا تمثل معلومات حيّة.
          الخدمات الرسمية والحجوزات تتم لدى الجهات ومزوّدي الخدمة المختصين.
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l, onClick }) {
  return (
    <button className="press" onClick={onClick} style={{ padding: "11px 14px", borderRadius: R.box, background: T.paper, border: `1px solid ${T.line}`, textAlign: "center", minWidth: 78 }}>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{ar(n)}</div>
      <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2, fontWeight: 600 }}>{l}</div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROVIDER / HOST SURFACE — a separate role, not a dashboard bolted onto the
   consumer app. Enough capability to keep the ecosystem alive: publish, keep
   practical information current, answer the community, pause a group, and see
   what interaction data the platform would actually generate.
   ═══════════════════════════════════════════════════════════════════════════ */

function ScreenProvider() {
  const { state, dispatch, go, toast } = useApp();
  const [tab, setTab] = useState("content");
  const prov = PROV[state.providerId];
  const mine = useMemo(() => INVENTORY.filter((o) => o.provider === state.providerId || state.publishedIds.includes(o.id)), [state.providerId, state.publishedIds]);
  const questions = useMemo(() => allContributions(state)
    .filter((k) => k.type === "question" && k.obj && mine.some((o) => o.id === k.obj)), [state, mine]);

  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ padding: "14px 16px 0" }}>
        <div className="row" style={{ gap: 10 }}>
          <button className="press" onClick={() => go({ back: true })} aria-label="رجوع"><ChevronRight size={22} /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>أدوات مقدّم التجربة</div>
            <div className="clamp1" style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{prov?.name} — {prov?.kind}</div>
          </div>
        </div>
        <div className="row" style={{ gap: 14, marginTop: 14 }}>
          {[["content", "محتواي"], ["people", "المشاركون"], ["questions", "الأسئلة"], ["signals", "الإشارات"]].map(([id, l]) => (
            <button key={id} className="press" onClick={() => setTab(id)}
              style={{ fontSize: 13, fontWeight: 800, paddingBottom: 6, borderBottom: `2px solid ${tab === id ? T.green : "transparent"}`, color: tab === id ? T.ink : T.muted }}>{l}</button>
          ))}
        </div>
      </div>

      {tab === "content" && <ProviderContent mine={mine} />}
      {tab === "people" && <ProviderPeople mine={mine} />}
      {tab === "questions" && <ProviderQuestions questions={questions} />}
      {tab === "signals" && <ProviderSignals />}
    </div>
  );
}

function ProviderContent({ mine }) {
  const { dispatch, toast, go, state } = useApp();
  const [editing, setEditing] = useState(null);
  const [publishing, setPublishing] = useState(false);
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <button className="press" onClick={() => setPublishing(true)}
        style={{ width: "100%", padding: "12px", borderRadius: R.ctl, background: T.deep, color: "#F6EFE0", fontWeight: 800, fontSize: 13.5, marginBottom: 16 }}>
        <Plus size={15} style={{ verticalAlign: "-3px", marginInlineEnd: 6 }} />انشر نشاطًا أو عرضًا
      </button>

      {mine.map((o) => (
        <div key={o.id} style={{ padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div className="row" style={{ gap: 11, alignItems: "flex-start" }}>
            <div style={{ width: 56, flex: "0 0 56px" }}><Photo kind={o.scene} seed={o.id} ratio="1 / 1" radius={R.box} scrim="none" /></div>
            <button className="press" onClick={() => go({ s: "object", id: o.id })} style={{ flex: 1, textAlign: "start", minWidth: 0 }}>
              <div className="row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                <Pill tone={T.muted}>{o.typeLabel}</Pill>
                <LifecycleChip o={o} />
                <FreshnessChip o={o} small />
              </div>
              <div className="clamp1" style={{ fontSize: 14.5, fontWeight: 800 }}>{o.name}</div>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>
                آخر تحديث {agoAr(o.claims.slice().sort((a, b) => new Date(b.at) - new Date(a.at))[0].at)}
              </div>
            </button>
          </div>
          <div className="row" style={{ gap: 8, marginTop: 9, flexWrap: "wrap" }}>
            <button className="press" onClick={() => setEditing(o)}
              style={{ padding: "7px 12px", borderRadius: R.pill, border: `1px solid ${T.line}`, background: T.paper, fontSize: 12, fontWeight: 800 }}>
              حدّث معلومة عملية
            </button>
            {o.type === "recurring" && (
              <>
                <button className="press" onClick={() => { dispatch({ type: "provider_state", obj: o.id, state: o.groupState === "paused" ? "active" : "paused" }); toast(o.groupState === "paused" ? "عاد النشاط — يظهر في التوصيات" : "أوقفناه مؤقتًا — لن يُرشَّح كمجموعة نشطة"); }}
                  style={{ padding: "7px 12px", borderRadius: R.pill, border: `1px solid ${T.line}`, background: T.paper, fontSize: 12, fontWeight: 800 }}>
                  {o.groupState === "paused" ? "استئناف" : "إيقاف مؤقت"}
                </button>
                <button className="press" onClick={() => { dispatch({ type: "provider_state", obj: o.id, state: "dormant" }); toast("نُقل إلى الأرشيف ولن يُعرض كنشط"); }}
                  style={{ padding: "7px 12px", borderRadius: R.pill, border: `1px solid ${T.warn}44`, background: T.paper, fontSize: 12, fontWeight: 800, color: T.warn }}>
                  أرشفة
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {!mine.length && <EmptyState icon={Store} title="لا محتوى منشور بعد" body="انشر نشاطك الأول ليظهر في الاكتشاف وفي مجتمعات مكة." />}

      <ProviderEditSheet o={editing} onClose={() => setEditing(null)} />
      <ProviderPublishSheet open={publishing} onClose={() => setPublishing(false)} />
    </div>
  );
}

function ProviderEditSheet({ o, onClose }) {
  const { dispatch, toast } = useApp();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => { if (o) { setLabel(o.facts[0]?.label || "الدوام"); setValue(""); } }, [o]);
  if (!o) return null;
  const labels = uniq([...(o.facts || []).map((f) => f.label), "الدوام", "السعر", "الوصول", "الموعد"]);
  return (
    <Sheet open={!!o} onClose={onClose} title={`تحديث ${o.name}`} tall>
      <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8, marginBottom: 14 }}>
        يُسجَّل التحديث باسمك وبتاريخ اليوم كمصدر «من مقدم الخدمة». لا يُحذف ما سبقه — يبقى سجل المصادر كاملًا.
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>الحقل</div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
        {labels.map((l) => <Chip key={l} active={label === l} onClick={() => setLabel(l)}>{l}</Chip>)}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>القيمة الجديدة</div>
      <input value={value} onChange={(e) => setValue(e.target.value)} dir="rtl" placeholder="مثال: ٤ م — ١١ م"
        style={{ width: "100%", border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "11px 12px", fontSize: 14, background: T.paper, outline: "none" }} />
      <button className="press" onClick={() => { if (!value.trim()) return; dispatch({ type: "provider_update", obj: o.id, label, value: value.trim() }); toast("حُدّثت المعلومة — وظهر تاريخها في سجل المصادر"); onClose(); }}
        style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: R.ctl, background: value.trim() ? T.deep : T.line, color: value.trim() ? "#F6EFE0" : T.muted, fontWeight: 800, fontSize: 14 }}>
        انشر التحديث
      </button>
    </Sheet>
  );
}

function ProviderPublishSheet({ open, onClose }) {
  const { dispatch, toast, state, go } = useApp();
  const [name, setName] = useState("");
  const [kind, setKind] = useState("activity");
  const [nb, setNb] = useState("zahir");
  const [price, setPrice] = useState("0");
  useEffect(() => { if (open) { setName(""); setKind("activity"); setPrice("0"); } }, [open]);
  const publish = () => {
    if (!name.trim()) return;
    const id = `pub-${hash(name + t0).toString(36)}`;
    dispatch({
      type: "provider_publish", objType: kind === "offer" ? "offer" : kind,
      raw: {
        id, n: name.trim(), t: kind === "offer" ? "عرض من مقدّم الخدمة" : "نشاط جديد", nb, cat: kind === "offer" ? "craft" : "craft",
        sc: "workshop", ab: "منشور حديثًا من مقدّم التجربة عبر أدوات النشر.", pr: state.providerId,
        price: Number(price) || 0, dur: 90, su: ["beginners", "small", "noexp"],
        act: kind === "offer" ? "redeem" : "join", tm: kind === "offer" ? WINDOW(0, 7) : WEEKLY(5, 18),
        com: ["craft", "workshops"], nov: 0.9, pop: 0.2, cap: 12, joined: 0,
        fx: [["الموعد", kind === "offer" ? "ساري لمدة أسبوع" : "أسبوعيًا مساء الجمعة", "provider", 0, "F2"],
             ["المستوى", "مبتدئ — لا تحتاج خبرة", "provider", 0, "F4"]],
      },
    });
    toast("نُشر — يظهر الآن في الاكتشاف وفي المجتمعات المرتبطة");
    onClose();
    go({ s: "object", id });
  };
  return (
    <Sheet open={open} onClose={onClose} title="نشر محتوى جديد" tall>
      <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>النوع</div>
      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        {[["activity", "نشاط"], ["experience", "تجربة"], ["offer", "عرض"]].map(([k, l]) => (
          <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{l}</Chip>
        ))}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 8 }}>الاسم</div>
      <input value={name} onChange={(e) => setName(e.target.value)} dir="rtl" placeholder="مثال: ورشة تذهيب للمبتدئين"
        style={{ width: "100%", border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "11px 12px", fontSize: 14, background: T.paper, outline: "none" }} />
      <div style={{ fontSize: 12.5, fontWeight: 800, margin: "16px 0 8px" }}>الحي</div>
      <div className="hs scroll" style={{ gap: 7 }}>
        {NEIGHBORHOODS.filter((n) => n.id !== "haram-area").map((n) => <Chip key={n.id} active={nb === n.id} onClick={() => setNb(n.id)}>{n.name}</Chip>)}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, margin: "16px 0 8px" }}>الرسوم بالريال</div>
      <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric"
        style={{ width: 120, border: `1px solid ${T.line}`, borderRadius: R.ctl, padding: "11px 12px", fontSize: 14, background: T.paper, outline: "none" }} />
      <div style={{ marginTop: 16, padding: "11px 12px", borderRadius: R.box, background: T.sand, fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
        ما تنشره يحمل اسمك كمصدر وتاريخ نشره. لا تعلن عن معلومة لا تملكها، ولا تنسب لجهة رسمية ما لم تصدره.
      </div>
      <button className="press" onClick={publish}
        style={{ width: "100%", marginTop: 16, padding: "13px", borderRadius: R.ctl, background: name.trim() ? T.deep : T.line, color: name.trim() ? "#F6EFE0" : T.muted, fontWeight: 800, fontSize: 14 }}>
        انشر
      </button>
    </Sheet>
  );
}

function ProviderPeople({ mine }) {
  const { state } = useApp();
  const joinables = mine.filter((o) => o.capacity != null || ["activity", "event", "experience", "recurring"].includes(o.type));
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.85, marginBottom: 14 }}>
        نعرض الأعداد وحالات التسجيل فقط. لا تُعرض هويات المشاركين ولا مواقعهم لمقدّم الخدمة ولا لغيره.
      </div>
      {joinables.map((o) => {
        const mineState = state.plan.find((p) => p.obj === o.id);
        const joined = (o.joinedCount ?? 0) + (mineState && ["going", "registered", "confirmed", "active", "completed"].includes(mineState.state) ? 1 : 0);
        const cap = o.capacity ?? null;
        const pct = cap ? clamp(joined / cap, 0, 1) : 0;
        return (
          <div key={o.id} style={{ padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
            <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
              <div className="clamp1" style={{ fontSize: 14, fontWeight: 800 }}>{o.name}</div>
              <span style={{ fontSize: 12.5, color: T.muted, fontWeight: 700, whiteSpace: "nowrap" }}>
                {cap ? `${ar(joined)} / ${ar(cap)}` : `${ar(joined)} مشارك`}
              </span>
            </div>
            {cap && (
              <div style={{ height: 6, borderRadius: 99, background: T.sand, marginTop: 9, overflow: "hidden" }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: pct > 0.85 ? T.warn : T.green }} />
              </div>
            )}
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 7 }}>
              {mineState ? `حالتك أنت: ${PLAN_STATE[mineState.state].label}` : "بيانات المشاركين في هذا النموذج توضيحية"}
            </div>
          </div>
        );
      })}
      {!joinables.length && <EmptyState icon={Users} title="لا تسجيلات بعد" body="عندما ينضم أحد إلى نشاطك ستظهر الأعداد هنا." />}
    </div>
  );
}

function ProviderQuestions({ questions }) {
  const { dispatch, toast, state, go } = useApp();
  const [replyTo, setReplyTo] = useState(null);
  const [text, setText] = useState("");
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.85, marginBottom: 14 }}>
        ردّك يظهر داخل النقاش باسم حسابك كمقدّم خدمة، ولا يستبدل رأي أحد ولا يحذفه.
      </div>
      {questions.map((k) => (
        <div key={k.id} style={{ marginBottom: 14 }}>
          <ContributionCard k={k} onOpen={() => go({ s: "thread", id: k.id })} />
          {state.providerReplies[k.id] ? (
            <div style={{ padding: "10px 12px", borderRadius: R.box, background: `${T.ok}12`, fontSize: 12.5, color: T.ok, fontWeight: 700 }}>
              نُشر ردّك على هذا السؤال.
            </div>
          ) : (
            <button className="press" onClick={() => { setReplyTo(k); setText(""); }}
              style={{ padding: "8px 13px", borderRadius: R.pill, border: `1px solid ${T.line}`, background: T.paper, fontSize: 12.5, fontWeight: 800 }}>
              ردّ على السؤال
            </button>
          )}
        </div>
      ))}
      {!questions.length && <EmptyState icon={MessageCircle} title="لا أسئلة مرتبطة بمحتواك" body="عندما يسأل أحد عن نشاطك سيظهر السؤال هنا." />}

      <Sheet open={!!replyTo} onClose={() => setReplyTo(null)} title="ردّ مقدّم الخدمة">
        <div className="clamp3" style={{ fontSize: 13.5, lineHeight: 1.8, marginBottom: 12 }}>{replyTo?.body}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} dir="rtl" placeholder="اكتب ردًا عمليًا ومباشرًا"
          style={{ width: "100%", border: `1px solid ${T.line}`, borderRadius: R.box, padding: "12px", fontSize: 14, lineHeight: 1.8, background: T.paper, resize: "none", outline: "none" }} />
        <button className="press" onClick={() => { dispatch({ type: "provider_reply", k: replyTo.id, text: text.trim() }); toast("نُشر ردّك داخل النقاش"); setReplyTo(null); }}
          disabled={!text.trim()}
          style={{ width: "100%", marginTop: 14, padding: "13px", borderRadius: R.ctl, background: text.trim() ? T.deep : T.line, color: text.trim() ? "#F6EFE0" : T.muted, fontWeight: 800, fontSize: 14 }}>
          انشر الرد
        </button>
      </Sheet>
    </div>
  );
}

/* Interaction signals — the backend intelligence loop, shown honestly. */
function ProviderSignals() {
  const { state } = useApp();
  const counts = {};
  state.log.forEach((e) => { counts[e.type] = (counts[e.type] || 0) + 1; });
  const funnel = [
    { label: "مشاهدة", n: counts.view || 0 },
    { label: "حفظ", n: counts.save || 0 },
    { label: "إضافة لخطة", n: (counts.plan || 0) + (counts.interested || 0) },
    { label: "انضمام أو تسجيل", n: (counts.join || 0) + (counts.register || 0) },
    { label: "انتقال لحجز", n: counts.book_outbound || 0 },
    { label: "تأكيد", n: counts.book_confirmed || 0 },
    { label: "إكمال", n: counts.complete || 0 },
    { label: "مساهمة", n: (counts.contribute || 0) + (counts.correction || 0) },
  ];
  const max = Math.max(1, ...funnel.map((f) => f.n));
  const cats = {};
  state.log.forEach((e) => { const o = e.obj && getObj(e.obj); if (o) cats[o.category] = (cats[o.category] || 0) + 1; });
  const topCats = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const searches = state.log.filter((e) => e.type === "search").map((e) => e.meta?.q).filter(Boolean);
  const trustEvents = (counts.trust_resolved || 0) + (counts.correction || 0) + (counts.report || 0);

  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ padding: "12px 13px", borderRadius: R.box, background: T.sand, fontSize: 12, color: T.muted, lineHeight: 1.85, marginBottom: 18 }}>
        هذه إشارات جلستك على هذا الجهاز فقط، لتوضيح ما الذي يلتقطه المنتج.
        في التشغيل الفعلي تُجمّع الإشارات وتُحلَّل بشكل مُجمَّع وبحوكمة خصوصية، بلا هويات ولا مواقع دقيقة.
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>من الاهتمام إلى الفعل</div>
      {funnel.map((f) => (
        <div key={f.label} style={{ marginBottom: 10 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{f.label}</span>
            <span style={{ fontSize: 12.5, color: T.muted, fontWeight: 700 }}>{ar(f.n)}</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: T.sand, overflow: "hidden" }}>
            <div style={{ width: `${(f.n / max) * 100}%`, height: "100%", background: T.green, opacity: .85 }} />
          </div>
        </div>
      ))}

      <div style={{ fontSize: 15, fontWeight: 800, margin: "22px 0 10px" }}>أين يقع الاهتمام</div>
      {topCats.length ? topCats.map(([c, n]) => (
        <div key={c} className="row" style={{ justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{CAT[c]?.name || c}</span>
          <span style={{ fontSize: 12.5, color: T.muted, fontWeight: 700 }}>{ar(n)} تفاعل</span>
        </div>
      )) : <div style={{ fontSize: 13, color: T.muted }}>لا تفاعلات كافية بعد.</div>}

      <div style={{ fontSize: 15, fontWeight: 800, margin: "22px 0 10px" }}>ما يبحث عنه الناس</div>
      {searches.length ? (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {uniq(searches).slice(0, 8).map((q) => <Pill key={q} tone={T.clay} bg={`${T.clay}12`}>{q}</Pill>)}
        </div>
      ) : <div style={{ fontSize: 13, color: T.muted }}>لم تُسجَّل عمليات بحث بعد. في التشغيل الفعلي تكشف هذه الإشارة الطلب غير الملبّى.</div>}

      <div style={{ fontSize: 15, fontWeight: 800, margin: "22px 0 10px" }}>جودة المعلومة</div>
      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <Stat n={trustEvents} l="تدخلات ثقة" />
        <Stat n={Object.keys(state.helpful).length} l="مساهمات مفيدة" />
        <Stat n={state.contributions.length} l="مساهماتك" />
        <Stat n={state.plan.filter((p) => p.state === "completed").length} l="رحلات مكتملة" />
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

/* ───────── Notifications — utility only ───────── */

function ScreenNotifications() {
  const { state, dispatch, go } = useApp();
  const list = allNotifications(state);
  useEffect(() => { const t = setTimeout(() => dispatch({ type: "read_all" }), 900); return () => clearTimeout(t); }, [dispatch]);
  return (
    <div className="scroll" style={{ paddingBottom: 96 }}>
      <div style={{ padding: "14px 16px 6px" }} className="row">
        <button className="press" onClick={() => go({ back: true })} aria-label="رجوع" style={{ marginInlineEnd: 10 }}><ChevronRight size={22} /></button>
        <div style={{ fontSize: 20, fontWeight: 800 }}>الإشعارات</div>
      </div>
      {!list.length ? (
        <EmptyState icon={Bell} title="لا إشعارات الآن"
          body="نرسل إشعارًا فقط حين يكون مفيدًا: ردّ على سؤالك، تغيّر في خطتك، أو عرض حفظته على وشك الانتهاء." />
      ) : (
        <div style={{ padding: "0 16px" }}>
          {list.map((n) => (
            <button key={n.id} className="press" onClick={() => { dispatch({ type: "read_notification", id: n.id }); if (n.k) go({ s: "thread", id: n.k }); else if (n.obj) go({ s: "object", id: n.obj }); }}
              style={{ display: "flex", width: "100%", gap: 11, textAlign: "start", padding: "13px 0", borderBottom: `1px solid ${T.lineSoft}` }}>
              <div style={{ width: 32, height: 32, borderRadius: R.pill, background: n.read ? T.sand : `${T.green}18`, display: "grid", placeItems: "center", flex: "0 0 32px" }}>
                {n.kind === "answer" ? <MessageCircle size={15} color={T.green} /> : n.kind === "plan" ? <CalendarCheck size={15} color={T.green} /> : <Bell size={15} color={T.green} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: n.read ? 600 : 800 }}>{n.title}</div>
                <div className="clamp2" style={{ fontSize: 12.5, color: T.muted, marginTop: 3, lineHeight: 1.7 }}>{n.body}</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{agoAr(n.at)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHELL — four jobs in the bottom nav: الرئيسية · اكتشف · المجتمع · خطتي
   Profile lives behind the avatar. No AI tab: AI is horizontal.
   ═══════════════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "discover", label: "اكتشف", icon: Compass },
  { id: "community", label: "المجتمع", icon: Users },
  { id: "plan", label: "خطتي", icon: CalendarCheck },
];

function BottomNav({ tab, onTab, planCount }) {
  return (
    <div style={{
      position: "absolute", insetInline: 0, bottom: 0, zIndex: 50, background: T.paper,
      borderTop: `1px solid ${T.line}`, padding: "7px 8px 9px", display: "flex",
    }}>
      {TABS.map((t) => {
        const on = tab === t.id;
        const Icon = t.icon;
        return (
          <button key={t.id} className="press" data-nav={t.id} onClick={() => onTab(t.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Icon size={21} color={on ? T.green : T.muted} strokeWidth={on ? 2.3 : 1.8} />
              {t.id === "plan" && planCount > 0 && (
                <span style={{ position: "absolute", top: -4, insetInlineEnd: -7, minWidth: 15, height: 15, padding: "0 3px", borderRadius: 99, background: T.clay, color: "#FFF8EA", fontSize: 9.5, fontWeight: 800, display: "grid", placeItems: "center" }}>
                  {ar(planCount)}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600, color: on ? T.green : T.muted }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TAB_OF = { home: "home", discover: "discover", community: "community", family: "community", club: "community", thread: "community", plan: "plan" };

/* A real app fails sometimes; the product should say so and offer a way out. */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.viewKey !== this.props.viewKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: "60px 26px", textAlign: "center" }}>
        <div style={{ width: 54, height: 54, borderRadius: 18, background: `${T.warn}18`, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
          <AlertTriangle size={24} color={T.warn} />
        </div>
        <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 6 }}>تعذّر عرض هذه الشاشة</div>
        <div style={{ fontSize: 13.5, color: T.muted, lineHeight: 1.8 }}>
          حدث خطأ غير متوقع. خطتك ومساهماتك لم تتأثر.
        </div>
        <button className="press" onClick={() => { this.setState({ error: null }); this.props.onReset && this.props.onReset(); }}
          style={{ marginTop: 16, background: T.deep, color: "#F6EFE0", padding: "11px 20px", borderRadius: R.ctl, fontSize: 13.5, fontWeight: 800 }}>
          رجوع إلى الرئيسية
        </button>
      </div>
    );
  }
}

export default function EyeMakkahApp() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const [stack, setStack] = useState([{ s: "home" }]);
  const [toastMsg, setToastMsg] = useState(null);
  const scrollRef = useRef(null);
  const view = stack[stack.length - 1];
  const ctx = useMemo(() => deriveContext(state), [state]);
  const toast = useCallback((m) => setToastMsg(m), []);

  const go = useCallback((next) => {
    if (next?.back) { setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)); return; }
    setStack((st) => [...st, next]);
  }, []);
  const setTab = useCallback((t) => setStack([{ s: t }]), []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [stack.length, view?.s, view?.id]);

  const api = { state, dispatch, ctx, go, setTab, toast };
  const planCount = state.plan.filter((p) => ["planned", "going", "registered", "confirmed", "active", "awaiting"].includes(p.state)).length;
  const tab = TAB_OF[view.s] || (["object", "search", "profile", "notifications", "provider"].includes(view.s) ? TAB_OF[stack[0]?.s] || "home" : "home");
  const hideNav = ["search", "thread", "object"].includes(view.s);
  const ts = state.profile.textScale || 1;

  const render = () => {
    switch (view.s) {
      case "home": return <ScreenHome />;
      case "discover": return <ScreenDiscover params={view} />;
      case "community": return view.id ? <ScreenCommunityDetail id={view.id} /> : <ScreenCommunity />;
      case "family": return <ScreenFamily id={view.id} />;
      case "club": return <ScreenClub id={view.id} />;
      case "thread": return <ScreenThread id={view.id} />;
      case "plan": return <ScreenPlan />;
      case "object": return <ScreenObject id={view.id} />;
      case "search": return <ScreenSearch />;
      case "profile": return <ScreenProfile />;
      case "notifications": return <ScreenNotifications />;
      case "provider": return <ScreenProvider />;
      default: return <ScreenHome />;
    }
  };

  return (
    <App.Provider value={api}>
      <style>{CSS}</style>
      <div className="em" style={{
        minHeight: "100vh", background: `radial-gradient(1200px 700px at 50% -10%, #FBF6EC 0%, #EFE6D5 52%, ${T.sandDeep} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 12px",
      }}>
        <div style={{ width: 412, maxWidth: "100%" }}>
          <div style={{
            position: "relative", height: 844, maxHeight: "calc(100vh - 40px)", borderRadius: 34, overflow: "hidden",
            background: T.limestone, boxShadow: "0 30px 70px -26px rgba(38,28,16,.45)", border: `1px solid ${T.line}`,
          }} dir="rtl">
            {/* text size works the way a device setting does: content reflows to a
                narrower box and is scaled up, so nothing is clipped. */}
            <div ref={scrollRef} className="scroll" key={view.s + (view.id || "")}
              style={{
                position: "absolute", inset: 0, overflowY: "auto", paddingBottom: hideNav ? 0 : 64,
                zoom: ts === 1 ? undefined : ts,
                width: ts === 1 ? undefined : `${100 / ts}%`,
                height: ts === 1 ? undefined : `${100 / ts}%`,
              }}>
              <ErrorBoundary viewKey={view.s + (view.id || "")} onReset={() => setStack([{ s: "home" }])}>
                {render()}
              </ErrorBoundary>
            </div>
            {!hideNav && <BottomNav tab={tab} onTab={setTab} planCount={planCount} />}
            <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />
          </div>
        </div>
      </div>
    </App.Provider>
  );
}


/* debug surface used by scripts/dbg.mjs — tree-shaken out of the app bundle */
export const __debug = { INVENTORY, COMMUNITIES, CONTRIBUTIONS, buildOutings, buildHome, deriveContext, initialState, rank, scoreObject, lifecycleOf, objectTrust, searchAll, CLUBS, getObj, NEIGHBORHOODS, CATEGORIES };
