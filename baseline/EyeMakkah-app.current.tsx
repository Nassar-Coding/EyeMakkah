import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import {
  Home, Map as MapIcon, Wallet, Sparkles, Bell, Search, ChevronRight, ChevronLeft,
  Navigation, Users, Zap, Luggage, BookOpen, Heart, Utensils, Landmark, HeartPulse,
  GraduationCap, Moon, CreditCard, Briefcase, Car, BedDouble, Star, MapPin, Mic,
  Camera, Send, ArrowUpRight, TrendingUp, Shield, Gift, Ticket, Languages,
  Accessibility, Radio, Building2, BarChart3, Compass, Plus, Footprints,
  ParkingCircle, Bus, Sun, Phone, AlertTriangle, WifiOff, Lock, HelpCircle,
  CheckCircle2, Share2, Store, ShoppingBag, Plane, CalendarDays, Video, Scan,
  Bookmark, SunMedium, MoonStar, Pill, Baby, Minus, Target, Scale, Clock3
} from "lucide-react";

/* ═════════════════════════════════════════════
   EyeMakkah — منظومة رقمية متكاملة لمكة المكرمة
   Bilingual (AR ⇄ EN, RTL ⇄ LTR) · Light/Dark
   Stack navigation · 12 clickable service worlds
═════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');

.imk * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
.imk { font-family: 'Outfit','IBM Plex Sans Arabic',sans-serif; }
.imk[dir="rtl"], .imk [dir="rtl"] { font-family: 'IBM Plex Sans Arabic','Outfit',sans-serif; }
.imk .display { font-family: 'Marcellus','Amiri',serif; letter-spacing: 0.02em; }
[dir="rtl"] .display { font-family: 'Amiri','Marcellus',serif; letter-spacing: 0; }
.imk .arabic { font-family: 'Amiri', serif; }
.imk ::-webkit-scrollbar { display: none; }
.imk * { scrollbar-width: none; }

@keyframes imkTwinkle { 0%,100%{opacity:.15} 50%{opacity:.9} }
@keyframes imkFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes imkPulseRing { 0%{transform:scale(.6);opacity:.8} 100%{transform:scale(2.1);opacity:0} }
@keyframes imkOrbGlow { 0%,100%{box-shadow:0 0 24px 4px rgba(216,178,92,.45), inset 0 0 18px rgba(255,255,255,.25)} 50%{box-shadow:0 0 44px 10px rgba(216,178,92,.7), inset 0 0 24px rgba(255,255,255,.4)} }
@keyframes imkShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes imkTawaf { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes imkBreathe { 0%,100%{opacity:.5} 50%{opacity:1} }
@keyframes imkEnter { from{opacity:0; transform:translateY(18px)} to{opacity:1; transform:translateY(0)} }
@keyframes imkEnterScale { from{opacity:0; transform:scale(.96) translateY(10px)} to{opacity:1; transform:scale(1) translateY(0)} }
@keyframes imkScanLine { 0%{top:12%} 50%{top:82%} 100%{top:12%} }
@keyframes imkTicker { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
@keyframes imkSpin { to { transform: rotate(360deg) } }
@keyframes agScan { 0%{transform:translateY(-6%); opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateY(106%); opacity:0} }
@keyframes agDraw { to { stroke-dashoffset: 0 } }
@keyframes agRise { from{opacity:0; transform:translateY(10px) scale(.97)} to{opacity:1; transform:translateY(0) scale(1)} }
@keyframes agSwap { 0%{opacity:1; transform:translateY(0)} 45%{opacity:0; transform:translateY(-7px)} 55%{opacity:0; transform:translateY(7px)} 100%{opacity:1; transform:translateY(0)} }
@keyframes agFlow { 0%{stroke-dashoffset:44; opacity:0} 20%{opacity:1} 100%{stroke-dashoffset:0; opacity:.85} }
@keyframes agBarGrow { from{transform:scaleY(0)} to{transform:scaleY(1)} }
@keyframes agHalo { 0%{transform:scale(.8); opacity:.55} 100%{transform:scale(1.9); opacity:0} }
@keyframes agTick { 0%{transform:scale(.4); opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1); opacity:1} }
@keyframes agDots { 0%,80%,100%{opacity:.25} 40%{opacity:1} }
@keyframes auraOut { to { opacity: 0 } }
@keyframes auraRun { to { stroke-dashoffset: -700 } }
@keyframes haramSweep { from { transform: translateY(0) } to { transform: translateY(430px) } }
@keyframes routeFade { to { opacity: .16 } }
@keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
@keyframes confirmIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
@keyframes confirmOut { to{opacity:0; transform:translateY(-6px)} }
@keyframes lensConverge { to { top: 20px; inset-inline-end: 26px; transform: scale(.35); opacity: 0 } }
@keyframes lensRun { 0%{transform:translateX(0); opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateX(calc(var(--flip,1) * 240px)); opacity:0} }
@keyframes shockRun { 0%{transform:translateX(-100%); opacity:0} 20%{opacity:1} 100%{transform:translateX(100%); opacity:0} }
@keyframes scopeLock { from{opacity:0; transform:translateX(-14px)} to{opacity:1; transform:translateX(0)} }
@keyframes synthDrop { 0%{opacity:0; transform:scale(.14) translateY(-34px)} 55%{opacity:1} 100%{opacity:1; transform:scale(1) translateY(0)} }
@keyframes flowRun { from { stroke-dashoffset: 900 } to { stroke-dashoffset: -60 } }
@keyframes fxFadeIn { from{opacity:0} to{opacity:1} }
@keyframes fxLift { from{opacity:0; transform:translateY(14px) scale(.96)} to{opacity:1; transform:translateY(0) scale(1)} }
@keyframes scriptRunR {
  0%   { opacity:0; transform: translate(352px, var(--ly,0)) translateX(0) scale(.72) }
  22%  { opacity:.95 }
  62%  { opacity:.95; transform: translate(352px, var(--ly,0)) translateX(var(--dx)) scale(1) }
  78%  { opacity:.75; transform: translate(352px, var(--ly,0)) translateX(calc(var(--dx) * 1.25)) scale(1.02) }
  100% { opacity:0;  transform: translate(352px, var(--ly,0)) translateX(calc(var(--dx) * 1.5)) scale(.94) }
}
@keyframes scriptRunL {
  0%   { opacity:0; transform: translate(38px, var(--ly,0)) translateX(0) scale(.72) }
  22%  { opacity:.95 }
  62%  { opacity:.95; transform: translate(38px, var(--ly,0)) translateX(var(--dx)) scale(1) }
  78%  { opacity:.75; transform: translate(38px, var(--ly,0)) translateX(calc(var(--dx) * 1.25)) scale(1.02) }
  100% { opacity:0;  transform: translate(38px, var(--ly,0)) translateX(calc(var(--dx) * 1.5)) scale(.94) }
}
@keyframes langFlowR { from{stroke-dashoffset:-460} to{stroke-dashoffset:390} }
@keyframes langFlowL { from{stroke-dashoffset:460} to{stroke-dashoffset:-390} }
@keyframes imkSlideIn { from{transform:translateX(-100%); opacity:.6} to{transform:translateX(0); opacity:1} }
@keyframes agFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }

@keyframes imkAIShimmer { 0%{background-position:-160% 0} 100%{background-position:260% 0} }
@keyframes imkRise { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
@keyframes imkGlowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(79,207,166,.35)} 50%{box-shadow:0 0 0 9px rgba(79,207,166,0)} }
@keyframes imkPop { 0%{transform:scale(.4);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }

.imk .screen { animation: imkEnter .45s cubic-bezier(.22,.9,.3,1) both; }
.imk .stagger > * { animation: imkEnterScale .5s cubic-bezier(.22,.9,.3,1) both; }
.imk .stagger > *:nth-child(1){animation-delay:.03s}
.imk .stagger > *:nth-child(2){animation-delay:.09s}
.imk .stagger > *:nth-child(3){animation-delay:.15s}
.imk .stagger > *:nth-child(4){animation-delay:.21s}
.imk .stagger > *:nth-child(5){animation-delay:.27s}
.imk .stagger > *:nth-child(6){animation-delay:.33s}

.imk .glass {
  background: var(--pnl);
  border: 1px solid var(--pbr);
  backdrop-filter: blur(18px);
  box-shadow: var(--psh);
}
.imk .gold-text {
  background: linear-gradient(100deg,var(--g1) 20%,var(--g2) 45%,var(--g1) 70%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: imkShimmer 5s linear infinite;
}
.imk .ai-shimmer {
  background: linear-gradient(90deg, transparent 20%, rgba(255,255,255,.30) 50%, transparent 80%);
  background-size: 220% 100%;
  animation: imkAIShimmer 1.5s linear infinite;
}
.imk .hairline { height:1px; background: linear-gradient(90deg, transparent, var(--hl), transparent); }
.imk button { cursor: pointer; transition: transform .18s ease, box-shadow .18s ease, opacity .18s; font-family: inherit; }
.imk button:active { transform: scale(.96); }
.imk input { font-family: inherit; }
@media (prefers-reduced-motion: reduce) {
  .imk .ag-seq, .imk .ag-scan, .imk .ag-flow { animation: none !important; }
  .imk *, .imk *::before, .imk *::after { animation-duration: .001s !important; animation-iteration-count: 1 !important; }
}
`;

/* ── Theme engine ── */
const THEMES = {
  dark: {
    mode: "dark",
    bg: "#070B14", bg2: "#0B1120",
    text: "#F4EDDE", dim: "rgba(244,237,222,.58)", faint: "rgba(244,237,222,.34)",
    gold: "#D8B25C", goldHi: "#F0D48A", ink: "#161005",
    emerald: "#2FA98C", coral: "#E8896B", blue: "#7C9CE8", cyan: "#5CC8D8",
    purple: "#B08CE8", pink: "#E87C9C", lime: "#C8D85C", mint: "#5CD8B2", grey: "#C8C8C8",
    /* الأخضر الداكن — لون الذكاء الاصطناعي (من هوية العرض) */
    ai: "#4FCFA6", aiDeep: "#0C3A2E", aiInk: "#EAF6F1",
    aiGrad: "linear-gradient(135deg,#0F4636 0%,#0A2E24 100%)",
    vars: {
      "--pnl": "linear-gradient(150deg, rgba(255,255,255,.07), rgba(255,255,255,.025))",
      "--pbr": "rgba(244,237,222,.09)",
      "--psh": "none",
      "--g1": "#D8B25C", "--g2": "#F6E3A8",
      "--hl": "rgba(216,178,92,.35)",
    },
    goldGrad: "linear-gradient(120deg,#D8B25C,#B8923C)",
    mapBg: "radial-gradient(circle at 50% 46%, #121a2e 0%, #0A0F1E 55%, #070B14 100%)",
    line: "rgba(244,237,222,.07)",
    frame: "linear-gradient(160deg,#1c2232,#0a0d16)",
    stage: "radial-gradient(1100px 700px at 50% -8%, #141c36 0%, #070a12 55%, #04060b 100%)",
  },
  light: {
    mode: "light",
    bg: "#F6F1E4", bg2: "#FFFDF6",
    text: "#241B0B", dim: "rgba(36,27,11,.62)", faint: "rgba(36,27,11,.4)",
    gold: "#9A742A", goldHi: "#7A5A18", ink: "#FFFDF4",
    emerald: "#0F7A5C", coral: "#B04E2E", blue: "#3D62B8", cyan: "#1E7E96",
    purple: "#6F4BB2", pink: "#B0446E", lime: "#6E7E1E", mint: "#0F8E6A", grey: "#5A5348",
    /* الأخضر الداكن — لون الذكاء الاصطناعي (من هوية العرض) */
    ai: "#0E4A38", aiDeep: "#0C3A2E", aiInk: "#EAF6F1",
    aiGrad: "linear-gradient(135deg,#10503D 0%,#0A3125 100%)",
    vars: {
      "--pnl": "linear-gradient(150deg, rgba(255,255,255,.92), rgba(255,252,242,.78))",
      "--pbr": "rgba(36,27,11,.1)",
      "--psh": "0 8px 26px -12px rgba(90,66,20,.22)",
      "--g1": "#8A671E", "--g2": "#C29A3E",
      "--hl": "rgba(138,103,30,.4)",
    },
    goldGrad: "linear-gradient(120deg,#B8923C,#8A671E)",
    mapBg: "radial-gradient(circle at 50% 46%, #FFFDF4 0%, #F3ECDA 55%, #EBE2CC 100%)",
    line: "rgba(36,27,11,.09)",
    frame: "linear-gradient(160deg,#E8E0CE,#CDC3AC)",
    stage: "radial-gradient(1100px 700px at 50% -8%, #FDF9EE 0%, #EFE7D2 60%, #E2D6BC 100%)",
  },
};

/* ── App context: language, theme, navigation ── */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

/* تحويل الأرقام إلى الأرقام العربية الهندية (مع الفاصلة العشرية العربية) */
const AR_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
const toAr = (val) => String(val).replace(/[0-9]/g, (d) => AR_DIGITS[+d]).replace(/\./g, "٫");

/* ── Shared pieces ── */
const LiveDot = ({ color }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: color, animation: "imkPulseRing 1.8s ease-out infinite" }} />
    <span style={{ position: "relative", width: 8, height: 8, borderRadius: 99, background: color }} />
  </span>
);

const Fwd = ({ size = 14, color }) => {
  const { isAr } = useApp();
  return isAr ? <ChevronLeft size={size} color={color} /> : <ChevronRight size={size} color={color} />;
};

const SectionTitle = ({ eyebrow, title, action, onAction }) => {
  const { T } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "26px 24px 14px" }}>
      <div>
        {eyebrow && <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: T.gold, marginBottom: 4, fontWeight: 600 }}>{eyebrow}</div>}
        <div className="display" style={{ fontSize: 19, color: T.text }}>{title}</div>
      </div>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none", color: T.dim, fontSize: 12, display: "flex", alignItems: "center", gap: 2, padding: 4 }}>
          {action} <Fwd size={13} />
        </button>
      )}
    </div>
  );
};

const Chip = ({ children, active, onClick, icon: Icon }) => {
  const { T } = useApp();
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 99,
      fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
      background: active ? (T.mode === "dark" ? "linear-gradient(120deg, rgba(216,178,92,.28), rgba(216,178,92,.12))" : "linear-gradient(120deg, rgba(154,116,42,.22), rgba(154,116,42,.1))") : (T.mode === "dark" ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.7)"),
      border: `1px solid ${active ? T.gold + "88" : T.mode === "dark" ? "rgba(244,237,222,.1)" : "rgba(36,27,11,.12)"}`,
      color: active ? T.goldHi : T.dim,
    }}>
      {Icon && <Icon size={13} />} {children}
    </button>
  );
};


/* ═════════════════════════════════════════════
   وكيل الذكاء — شخصية المساعد الذكي
   الصور مقتَطَعة من عرض EyeMakkah لضمان التطابق
═════════════════════════════════════════════ */
/* رسم متجهي حيّ — يرمش ويشير · حاد عند أي حجم */
const AGENT_IMG = "data:image/webp;base64,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";

/* أفاتار وكيل الذكاء */
const AgentAvatar = ({ size = 46, live = true, ring = true }) => {
  const { T } = useApp();
  return (
    <span style={{ position: "relative", width: size, height: size, flexShrink: 0, display: "inline-block", animation: "agFloat 5s ease-in-out infinite" }}>
      {ring && (
        <span style={{
          position: "absolute", inset: -3, borderRadius: 99,
          background: `conic-gradient(from 0deg, ${T.ai}, #F0D48A, ${T.ai})`,
          animation: "imkSpin 7s linear infinite", opacity: .9,
        }} />
      )}
      <img src={AGENT_IMG} alt="" style={{
        position: "relative", display: "block", width: size, height: size,
        borderRadius: 99, objectFit: "cover",
        border: `2.5px solid ${T.aiDeep}`, background: "#FFFFFF",
      }} />
      {live && (
        <span style={{
          position: "absolute", insetInlineEnd: -1, bottom: -1,
          width: Math.max(11, size * 0.27), height: Math.max(11, size * 0.27), borderRadius: 99,
          background: "#4FCFA6", border: `2px solid ${T.aiDeep}`, display: "grid", placeItems: "center",
        }}>
          <Sparkles size={Math.max(6, size * 0.14)} color="#0A2E24" />
        </span>
      )}
    </span>
  );
};

/* ═════════════════════════════════════════════
   نظام إشارة الذكاء الاصطناعي
   قاعدة: يظهر فقط حيث تصرّف النظام فعلاً
═════════════════════════════════════════════ */

/* شارة القدرة — بالأخضر الداكن، بحجم يُقرأ */
const AIChip = ({ ar, en, solid }) => {
  const { T, t } = useApp();
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
      fontSize: 10.5, fontWeight: 700, letterSpacing: "0.01em",
      padding: "5px 11px", borderRadius: 99, whiteSpace: "nowrap",
      background: solid ? T.aiGrad : (T.mode === "dark" ? "rgba(79,207,166,.13)" : "rgba(14,74,56,.09)"),
      color: solid ? T.aiInk : T.ai,
      border: `1px solid ${solid ? "transparent" : T.ai + "44"}`,
    }}>
      <Sparkles size={11} /> {t(en, ar)}
    </span>
  );
};

/* تأكيد عابر — لا يدّعي حفظاً دائماً */
const Confirm = ({ show, ar, en }) => {
  const { T, t } = useApp();
  if (!show) return null;
  return (
    <div style={{
      position: "absolute", insetInlineStart: 24, insetInlineEnd: 24, bottom: 96, zIndex: 60,
      display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 14,
      background: T.mode === "dark" ? "rgba(24,20,10,.96)" : "rgba(255,252,244,.98)",
      border: `1px solid ${T.gold}66`, pointerEvents: "none",
      boxShadow: T.mode === "dark" ? "0 12px 30px -14px rgba(0,0,0,.7)" : "0 12px 30px -14px rgba(90,66,20,.4)",
      animation: "confirmIn .3s both, confirmOut .35s 2.1s both",
    }}>
      <CheckCircle2 size={14} color={T.gold} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 11.5, color: T.text, lineHeight: 1.5 }}>{t(en, ar)}</span>
    </div>
  );
};

/* سطر تفسير القرار — نصّ سياقي خفيف يلتصق بالنتيجة، لا بطاقة */
const DecisionReason = ({ ar, en, whyAr, whyEn, align = "start" }) => {
  const { T, t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, justifyContent: align }}>
        <Sparkles size={11} color={T.ai} style={{ flexShrink: 0, marginTop: 2.5 }} />
        <span style={{ fontSize: 10.5, color: T.dim, lineHeight: 1.6, flex: 1 }}>{t(en, ar)}</span>
        {(whyAr || whyEn) && (
          <button onClick={() => setOpen(!open)} style={{
            background: "transparent", border: "none", padding: 0, flexShrink: 0,
            fontSize: 10, fontWeight: 700, color: T.ai, textDecoration: "underline", textUnderlineOffset: 3,
          }}>{t("Why?", "لماذا؟")}</button>
        )}
      </div>
      {open && (whyAr || whyEn) && (
        <div style={{
          marginTop: 7, padding: "9px 11px", borderRadius: 11,
          background: T.mode === "dark" ? "rgba(79,207,166,.08)" : "rgba(14,74,56,.055)",
          border: `1px solid ${T.ai}2e`, fontSize: 10, color: T.dim, lineHeight: 1.7,
          animation: "imkRise .26s both",
        }}>{t(whyEn, whyAr)}</div>
      )}
    </div>
  );
};

/* زرّ «لماذا؟» — الشفافية التي يطلبها المستخدم */
const WhyBadge = ({ ar, en }) => {
  const { T, t } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 9 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "inline-flex", alignItems: "center", gap: 5, background: "transparent",
        border: `1px solid ${T.ai}44`, color: T.ai, fontSize: 10, fontWeight: 700,
        padding: "4px 10px", borderRadius: 99,
      }}>
        <HelpCircle size={10} /> {t("Why?", "لماذا؟")}
      </button>
      {open && (
        <div style={{
          marginTop: 8, padding: "10px 12px", borderRadius: 12,
          background: T.mode === "dark" ? "rgba(79,207,166,.08)" : "rgba(14,74,56,.06)",
          border: `1px solid ${T.ai}33`, fontSize: 10.5, color: T.dim, lineHeight: 1.65,
          animation: "imkRise .28s both",
        }}>
          {t(en, ar)}
        </div>
      )}
    </div>
  );
};

/* شريط المنصات المتصلة — يثبت أنها طبقة تنسيق لا تطبيق خدمات */
const ConnectedPlatforms = () => {
  const { T, t } = useApp();
  const items = [
    { ar: "نسك", en: "Nusuk" },
    { ar: "بوابة الزيارات", en: "Visits Gateway" },
    { ar: "حافلات مكة", en: "Makkah Buses" },
    { ar: "أجرة مكة", en: "Makkah Taxi" },
    { ar: "قطار الحرمين", en: "Haramain Train" },
  ];
  return (
    <div style={{ margin: "0 20px", borderRadius: 20, padding: "14px 16px", background: T.aiGrad, border: `1px solid ${T.ai}3d`, overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: T.ai, animation: "imkGlowPulse 2.4s infinite" }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: T.aiInk, letterSpacing: "0.04em" }}>
          {t("ORCHESTRATES ACROSS", "تُنسّق عبر")}
        </span>

      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {items.map((x, i) => (
          <span key={i} style={{
            fontSize: 10.5, fontWeight: 600, color: "rgba(234,246,241,.9)",
            background: "rgba(255,255,255,.08)", border: "1px solid rgba(234,246,241,.16)",
            padding: "5px 11px", borderRadius: 99,
          }}>{t(x.en, x.ar)}</span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: "rgba(234,246,241,.55)", marginTop: 10, lineHeight: 1.55 }}>
        {t("EyeMakkah coordinates the journey across existing platforms — without replacing them.",
           "تنسّق EyeMakkah الرحلة عبر الأنظمة القائمة دون استبدالها.")}
      </div>
    </div>
  );
};

/* شريط القدرات التي بنت المخرَج */
const AIUsedStrip = ({ caps }) => {
  const { T, t } = useApp();
  return (
    <div style={{ margin: "16px 24px 0", borderRadius: 18, padding: "14px 15px", background: T.aiGrad, border: `1px solid ${T.ai}3d` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(234,246,241,.7)", letterSpacing: "0.08em", marginBottom: 10 }}>
        {t("INTELLIGENCE APPLIED HERE", "الذكاء المستخدم في هذه الخطة")}
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {caps.map((c, i) => (
          <span key={i} style={{
            fontSize: 10, fontWeight: 600, color: "rgba(234,246,241,.92)",
            background: "rgba(255,255,255,.09)", border: "1px solid rgba(234,246,241,.16)",
            padding: "5px 10px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4,
          }}><Sparkles size={9} /> {t(c.en, c.ar)}</span>
        ))}
      </div>
    </div>
  );
};

/* Feature pills — surfaces which Excel features power a page */
const FeaturePills = ({ items }) => {
  const { T } = useApp();
  return (
    <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 24px", marginTop: 12 }}>
      {items.map((f, i) => (
        <span key={i} style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", color: T.gold, background: T.mode === "dark" ? "rgba(216,178,92,.1)" : "rgba(154,116,42,.1)", border: `1px solid ${T.gold}44`, padding: "5px 10px", borderRadius: 99 }}>
          {f}
        </span>
      ))}
    </div>
  );
};

/* Back header — mirrors correctly for RTL */
const BackHeader = ({ eyebrow, title, right }) => {
  const { T, back, isAr } = useApp();
  return (
    <div style={{ padding: "18px 24px 0", display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={back} className="glass" aria-label="Back" style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center", flexShrink: 0 }}>
        {isAr ? <ChevronRight size={19} color={T.text} /> : <ChevronLeft size={19} color={T.text} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{ fontSize: 10, letterSpacing: "0.18em", color: T.gold, fontWeight: 600 }}>{eyebrow}</div>}
        <div className="display" style={{ fontSize: 20, color: T.text, lineHeight: 1.3 }}>{title}</div>
      </div>
      {right}
    </div>
  );
};

/* Verified badge (Trust & Verification Layer) */
const Verified = () => {
  const { T, t } = useApp();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 700, color: T.emerald, background: T.emerald + "1a", border: `1px solid ${T.emerald}55`, padding: "3px 8px", borderRadius: 99 }}>
      <Shield size={10} /> {t("Verified", "موثّق")}
    </span>
  );
};

const Rating = ({ v, n }) => {
  const { T, t } = useApp();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: T.dim }}>
      <Star size={11} fill={T.gold} color={T.gold} /> <b style={{ color: T.text }}>{t(v, toAr(v))}</b> ({t(n, toAr(n))})
    </span>
  );
};

/* ═════════════════════════════════════════════
   PRODUCT DATA — 12 service areas (bilingual)
═════════════════════════════════════════════ */
const SERVICES = [
  { id: "haram", name: { en: "Al-Haram Live", ar: "الحرم مباشر" }, icon: Radio, ring: "gold", tag: { en: "Live now", ar: "مباشر الآن" }, grad: ["#2b2410", "#0e0c06"], gradL: ["#F3E7C8", "#E9DAB2"] },
  { id: "stay", name: { en: "Stay", ar: "الإقامة" }, icon: BedDouble, ring: "blue", tag: { en: "1,240 options", ar: "١٬٢٤٠ خيار" }, grad: ["#1a2340", "#0d1220"], gradL: ["#E3EAF8", "#D2DDF2"] },
  { id: "move", name: { en: "Move", ar: "التنقّل" }, icon: Car, ring: "emerald", tag: { en: "Light traffic", ar: "حركة خفيفة" }, grad: ["#123430", "#0a1a17"], gradL: ["#DDF0E9", "#C8E5DA"] },
  { id: "eat", name: { en: "Eat & Shop", ar: "الطعام والتسوق" }, icon: Utensils, ring: "coral", tag: { en: "Open nearby", ar: "مفتوح قريباً منك" }, grad: ["#3a2418", "#170e09"], gradL: ["#F6E3D8", "#EED2C0"] },
  { id: "discover", name: { en: "Discover", ar: "استكشف" }, icon: Landmark, ring: "purple", tag: { en: "3 events today", ar: "٣ فعاليات اليوم" }, grad: ["#2c2140", "#120d1c"], gradL: ["#EAE2F6", "#DCD0F0"] },
  { id: "give", name: { en: "Give", ar: "العطاء" }, icon: Heart, ring: "pink", tag: { en: "Verified causes", ar: "حملات موثّقة" }, grad: ["#3a1a26", "#170a10"], gradL: ["#F6DFE8", "#F0CCD9"] },
  { id: "health", name: { en: "Health & Safety", ar: "الصحة والسلامة" }, icon: HeartPulse, ring: "cyan", tag: { en: "24/7 support", ar: "دعم ٢٤/٧" }, grad: ["#123040", "#08141c"], gradL: ["#DCEEF4", "#C6E2EC"] },
  { id: "learn", name: { en: "Learn", ar: "التعلّم" }, icon: GraduationCap, ring: "lime", tag: { en: "New courses", ar: "دورات جديدة" }, grad: ["#2a2e14", "#12140a"], gradL: ["#EDF0D8", "#E0E6BE"] },
  { id: "islamic", name: { en: "Islamic Services", ar: "الخدمات الإسلامية" }, icon: Moon, ring: "mint", tag: { en: "Prayer times", ar: "مواقيت الصلاة" }, grad: ["#142a2e", "#0a1416"], gradL: ["#DBF0EA", "#C5E6DC"] },
  { id: "pay", name: { en: "Pay", ar: "الدفع" }, icon: CreditCard, ring: "gold", tag: { en: "Smart Wallet", ar: "المحفظة الذكية" }, grad: ["#2e2214", "#160f08"], gradL: ["#F3E7C8", "#EADCB4"] },
  { id: "ask", name: { en: "Ask & Navigate", ar: "اسأل وتنقّل" }, icon: Compass, ring: "blue", tag: { en: "AI Assistant", ar: "المساعد الذكي" }, grad: ["#1c2a3a", "#0c1219"], gradL: ["#E0E9F5", "#CFDDF0"] },
];

/* Where each service tile navigates */
const SVC_ROUTE = { haram: "haram", pay: "wallet", ask: "assistant" };
const svcTarget = (id) => SVC_ROUTE[id] || `svc:${id}`;

/* ── Per-area subpage content (Excel "What it includes" → blocks) ── */
const DETAIL = {
  stay: {
    features: { en: ["Booking Engine", "Reviews & Ratings", "Favorites", "Accessibility Mode", "Personalization"], ar: ["محرك الحجز", "التقييمات والمراجعات", "المفضلة", "وضع الوصول الشامل", "التخصيص"] },
    blocks: [
      { type: "quick", items: [
        { icon: Building2, en: "Hotels", ar: "فنادق", c: "blue" }, { icon: Home, en: "Apartments", ar: "شقق مفروشة", c: "emerald" },
        { icon: CalendarDays, en: "Long stay", ar: "إقامة طويلة", c: "gold" }, { icon: Luggage, en: "Luggage", ar: "حفظ الأمتعة", c: "coral" },
      ]},
      { type: "listings", title: { en: "Matched to you tonight", ar: "مختارة لك الليلة" }, eyebrow: { en: "Personalization Engine", ar: "محرك التخصيص" }, items: [
        { en: "Serviced apartments · Ajyad", ar: "شقق مخدومة — أجياد", sub: { en: "480 m to Haram · family rooms · late check-in", ar: "٤٨٠ م إلى الحرم — غرف عائلية — تسجيل دخول متأخر" }, price: { en: "420 SAR", ar: "٤٢٠ ر.س" }, rating: "4.8", n: "612", verified: true, access: true },
        { en: "Licensed accommodation · Al-Aziziyyah", ar: "إسكان مرخّص — العزيزية", sub: { en: "Aziziyah · shuttle every 15 min · kitchenette", ar: "العزيزية — نقل كل ١٥ دقيقة — مطبخ صغير" }, price: { en: "260 SAR", ar: "٢٦٠ ر.س" }, rating: "4.6", n: "284", verified: true },
      ]},
      { type: "banner", icon: Accessibility, c: "purple", en: "Wheelchair-friendly stays, ground-floor rooms and step-free routes — one tap.", ar: "خيارات إقامة مهيّأة للكراسي المتحركة وغرف أرضية ومسارات بلا درج — بلمسة واحدة.", cta: { en: "Accessible filter", ar: "فلتر الوصول الشامل" } },
    ],
  },
  move: {
    features: { en: ["Smart Map", "Booking Engine", "Location Sharing", "Offline Mode", "Predictive AI"], ar: ["الخريطة الذكية", "محرك الحجز", "مشاركة الموقع", "وضع عدم الاتصال", "الذكاء التنبؤي"] },
    blocks: [
      { type: "quick", items: [
        { icon: Car, en: "Makkah Taxi", ar: "أجرة مكة", c: "gold" }, { icon: Bus, en: "Makkah Buses", ar: "حافلات مكة", c: "blue" },
        { icon: ParkingCircle, en: "Parking", ar: "المواقف", c: "coral" }, { icon: Ticket, en: "Haramain Train", ar: "قطار الحرمين", c: "emerald" },
      ]},
      { type: "banner", icon: TrendingUp, c: "emerald", en: "Predictive AI: Ibrahim Al-Khalil Rd clears in 20 min — leaving at 7:05 saves you 12 minutes.", ar: "الذكاء التنبؤي: طريق إبراهيم الخليل يخفّ خلال ٢٠ دقيقة — الانطلاق في ٧:٠٥ يوفّر لك ١٢ دقيقة.", cta: { en: "Set smart alert", ar: "تفعيل تنبيه ذكي" } },
      { type: "listings", title: { en: "Best ways to the Haram", ar: "أفضل الطرق إلى الحرم" }, eyebrow: { en: "Optimization AI", ar: "ذكاء التحسين" }, items: [
        { en: "Shuttle 4 → Bab Ali", ar: "الحافلة ٤ → باب علي", sub: { en: "3 min wait · 11 min ride · shaded stop", ar: "انتظار ٣ د — رحلة ١١ د — محطة مظللة" }, price: { en: "4 SAR", ar: "٤ ر.س" }, rating: "4.7", n: "1.2k", verified: true },
        { en: "Walk via Ajyad St", ar: "مشياً عبر شارع أجياد", sub: { en: "18 min · water point on route · well lit", ar: "١٨ دقيقة — نقطة مياه على المسار — إنارة جيدة" }, price: { en: "Free", ar: "مجاناً" }, rating: "4.9", n: "3.4k" },
      ]},
    ],
  },
  eat: {
    features: { en: ["Camera Mode", "Live Translation", "Reviews", "Smart Wallet", "Loyalty & Rewards"], ar: ["وضع الكاميرا", "الترجمة الفورية", "التقييمات", "المحفظة الذكية", "الولاء والمكافآت"] },
    blocks: [
      { type: "quick", items: [
        { icon: Utensils, en: "Restaurants", ar: "مطاعم", c: "coral" }, { icon: Store, en: "Cafés", ar: "مقاهٍ", c: "gold" },
        { icon: ShoppingBag, en: "Markets", ar: "أسواق", c: "purple" }, { icon: Gift, en: "Local products", ar: "منتجات محلية", c: "emerald" },
      ]},
      { type: "camera-banner" },
      { type: "listings", title: { en: "Near you, open now", ar: "قريب منك ومفتوح الآن" }, eyebrow: { en: "Recommendation AI", ar: "ذكاء التوصيات" }, items: [
        { en: "Traditional mandi restaurant", ar: "مطعم مندي تقليدي", sub: { en: "6 min walk · quiet at 7:40 · pay with wallet", ar: "٦ د مشياً — هادئ في ٧:٤٠ — ادفع بالمحفظة" }, price: { en: "~62 SAR", ar: "~٦٢ ر.س" }, rating: "4.7", n: "980", verified: true },
        { en: "Local dates market", ar: "سوق التمور المحلي", sub: { en: "Ajwa & Sukkari · gift boxes · 2× Noor points", ar: "عجوة وسكري — علب هدايا — نقاط نور مضاعفة" }, price: { en: "From 35 SAR", ar: "ابتداءً من ٣٥ ر.س" }, rating: "4.8", n: "445", verified: true },
      ]},
    ],
  },
  discover: {
    features: { en: ["Content Hub", "AR / VR Layer", "Itinerary Planner", "Booking Engine", "City Pass"], ar: ["مركز المحتوى", "طبقة الواقع المعزز", "مخطط الرحلات", "محرك الحجز", "بطاقة المدينة"] },
    blocks: [
      { type: "hcards", title: { en: "Today in the city", ar: "اليوم في المدينة" }, eyebrow: { en: "Events & experiences", ar: "فعاليات وتجارب" }, items: [
        { en: "Haramain Architecture Exhibition", ar: "معرض عمارة الحرمين الشريفين", sub: { en: "Your appointment · 4:30 PM", ar: "موعدك — ٤:٣٠ م" }, c: "gold", icon: Landmark, booked: true, goTo: "itinerary" },
        { en: "Makkah Museum", ar: "متحف مكة المكرمة", sub: { en: "Open till 11 PM", ar: "حتى ١١ مساءً" }, c: "purple", icon: Landmark },
        { en: "Kiswa Factory tour", ar: "جولة مصنع الكسوة", sub: { en: "8:30 PM · 12 seats", ar: "٨:٣٠ م — ١٢ مقعداً" }, c: "gold", icon: Ticket },
        { en: "Hira Cultural District", ar: "حي حراء الثقافي", sub: { en: "Exhibition · free", ar: "معرض — مجاني" }, c: "emerald", icon: BookOpen },
      ]},
      { type: "banner", icon: Video, c: "purple", en: "AR walk: stand anywhere and watch old Makkah rebuild itself around you.", ar: "جولة واقع معزز: قف في أي مكان وشاهد مكة القديمة تُبنى من حولك.", cta: { en: "Start AR story", ar: "ابدأ قصة الواقع المعزز" } },
      { type: "banner", icon: CalendarDays, c: "gold", en: "Let the Itinerary Planner weave these into your evening around prayer times.", ar: "دع مخطط الرحلات ينسج هذه التجارب في مسائك حول مواقيت الصلاة.", cta: { en: "Plan my day", ar: "خطط يومي" }, goTo: "itinerary" },
    ],
  },
  give: {
    features: { en: ["Trust & Verification", "Smart Wallet", "Impact Tracking", "Smart Notifications"], ar: ["التحقق والموثوقية", "المحفظة الذكية", "تتبع الأثر", "الإشعارات الذكية"] },
    blocks: [
      { type: "progress", title: { en: "Verified campaigns", ar: "حملات موثّقة" }, eyebrow: { en: "Trust AI · licensed charities only", ar: "ذكاء الموثوقية — جمعيات مرخّصة فقط" }, items: [
        { en: "Meals for pilgrims — licensed campaign", ar: "إفطار ضيوف الرحمن — حملة مرخّصة", pct: 70, sub: { en: "350 / 500 SAR · your meals reached 40 pilgrims", ar: "٣٥٠ / ٥٠٠ ر.س — وجباتك وصلت إلى ٤٠ حاجاً" }, c: "pink" },
        { en: "Zamzam wheelchairs fund", ar: "صندوق كراسي زمزم المتحركة", pct: 42, sub: { en: "12,400 / 30,000 SAR · 96 chairs delivered", ar: "١٢٬٤٠٠ / ٣٠٬٠٠٠ ر.س — تم توفير ٩٦ كرسياً" }, c: "cyan" },
      ]},
      { type: "banner", icon: Heart, c: "pink", en: "Volunteer this week: guide elderly visitors from Gate 79 after Isha.", ar: "تطوّع هذا الأسبوع: مرافقة كبار السن من باب ٧٩ بعد العشاء.", cta: { en: "Makkah Volunteers", ar: "عبر مكة تتطوع" } },
    ],
  },
  health: {
    features: { en: ["Emergency Mode", "Smart Map", "Location Sharing", "Camera Mode", "Accessibility"], ar: ["وضع الطوارئ", "الخريطة الذكية", "مشاركة الموقع", "وضع الكاميرا", "الوصول الشامل"] },
    blocks: [
      { type: "emergency-banner" },
      { type: "quick", items: [
        { icon: Building2, en: "Hospitals", ar: "مستشفيات", c: "cyan" }, { icon: Pill, en: "Pharmacies", ar: "صيدليات", c: "emerald" },
        { icon: HeartPulse, en: "Clinics", ar: "عيادات", c: "coral" }, { icon: Plus, en: "First aid", ar: "إسعافات أولية", c: "pink" },
      ]},
      { type: "listings", title: { en: "Nearest to you", ar: "الأقرب إليك" }, eyebrow: { en: "Geospatial AI", ar: "الذكاء الجغرافي" }, items: [
        { en: "Nearest emergency hospital", ar: "أقرب مستشفى طوارئ", sub: { en: "1.2 km · ER open · wheelchair access", ar: "١٫٢ كم — طوارئ مفتوحة — مهيّأ للكراسي المتحركة" }, price: { en: "24/7", ar: "٢٤/٧" }, rating: "4.5", n: "820", verified: true, access: true },
        { en: "Nearest pharmacy", ar: "أقرب صيدلية", sub: { en: "300 m · scan a medicine box to check availability", ar: "٣٠٠ م — صوّر علبة الدواء للتحقق من توفره" }, price: { en: "Open", ar: "مفتوحة" }, rating: "4.6", n: "1.5k", verified: true },
      ]},
    ],
  },
  learn: {
    features: { en: ["Content Hub", "Booking Engine", "Itinerary Planner", "Multi-language"], ar: ["مركز المحتوى", "محرك الحجز", "مخطط الرحلات", "تعدد اللغات"] },
    blocks: [
      { type: "quick", items: [
        { icon: GraduationCap, en: "Courses", ar: "دورات", c: "lime" }, { icon: Mic, en: "Lectures", ar: "محاضرات", c: "gold" },
        { icon: Baby, en: "Children", ar: "برامج الأطفال", c: "coral" }, { icon: BookOpen, en: "City knowledge", ar: "معرفة المدينة", c: "blue" },
      ]},
      { type: "listings", title: { en: "Picked for your interests", ar: "مختارة حسب اهتماماتك" }, eyebrow: { en: "Personalization AI", ar: "ذكاء التخصيص" }, items: [
        { en: "History of the Two Holy Mosques", ar: "تاريخ الحرمين الشريفين", sub: { en: "Umm Al-Qura short course · Arabic & English", ar: "دورة قصيرة من أم القرى — بالعربية والإنجليزية" }, price: { en: "Free", ar: "مجاناً" }, rating: "4.9", n: "2.1k", verified: true },
        { en: "Kids: Manners of the Haram", ar: "للأطفال: آداب الحرم", sub: { en: "Ages 6–10 · Saturday 5 PM · Hira District", ar: "من ٦ إلى ١٠ سنوات — السبت ٥ م — حي حراء" }, price: { en: "20 SAR", ar: "٢٠ ر.س" }, rating: "4.8", n: "312", verified: true },
      ]},
    ],
  },
  islamic: {
    features: { en: ["Prayer Times", "Mosque Finder", "Official Fatwa", "Trust & Governance AI", "Translation"], ar: ["مواقيت الصلاة", "مكتشف المساجد", "الفتوى الرسمية", "ذكاء الموثوقية والحوكمة", "الترجمة"] },
    blocks: [
      { type: "prayers" },
      { type: "quick", items: [
        { icon: MapPin, en: "Mosque finder", ar: "مكتشف المساجد", c: "mint", goTo: "map" }, { icon: BookOpen, en: "Quran services", ar: "خدمات القرآن", c: "emerald" },
        { icon: Shield, en: "Official fatwa", ar: "الفتوى الرسمية", c: "gold" }, { icon: GraduationCap, en: "Islamic learning", ar: "التعلم الإسلامي", c: "blue" },
      ]},
      { type: "banner", icon: Shield, c: "gold", en: "Religious answers come only from approved official sources — governed, never generated.", ar: "الإجابات الشرعية من المصادر الرسمية المعتمدة فقط — بحوكمة كاملة، لا تُولَّد آلياً.", cta: { en: "Ask via official channel", ar: "اسأل عبر القناة الرسمية" } },
    ],
  },
};

/* ═════════════════════════════════════════════
   SIGNATURE — AL-HARAM DIGITAL TWIN
   The whole complex: plaza, prayer halls, mataf,
   Kaaba, Masa'a (Safa⇄Marwah), minarets, gates
═════════════════════════════════════════════ */
const TawafRing = ({ cx, cy, r, count, dur, color, size = 2.2, delay = 0 }) => (
  <g style={{ animation: `imkTawaf ${dur}s linear infinite`, animationDelay: `${delay}s`, transformOrigin: `${cx}px ${cy}px` }}>
    {Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2 + (i % 3) * 0.14;
      const rr = r + ((i * 7) % 7) - 3;
      return <circle key={i} cx={cx + rr * Math.cos(a)} cy={cy + rr * Math.sin(a)} r={size - (i % 3) * 0.4} fill={color} opacity={0.5 + (i % 4) * 0.13} />;
    })}
  </g>
);

const HaramTwin = ({ compact, load }) => {
  const { T, t, isAr } = useApp();
  const L = load || { mataf: "busy", masa: "calm", roof: "calm" };
  const CC = { calm: T.emerald, busy: T.gold, dense: T.coral };
  const matafC = CC[L.mataf] || T.gold;
  const masaC  = CC[L.masa]  || T.emerald;
  const dark = T.mode === "dark";
  const marble = dark ? "rgba(244,237,222," : "rgba(60,46,16,";
  const hall = dark ? "rgba(244,237,222,.05)" : "rgba(154,116,42,.1)";
  const CX = 186, CY = 168; // mataf centre
  const lbl = (x, y, en, ar, anchor = "middle") =>
    !compact && <text x={x} y={y} textAnchor={anchor} fill={marble + ".62)"} fontSize="9.5" fontFamily={isAr ? "IBM Plex Sans Arabic" : "Outfit"}>{t(en, ar)}</text>;
  return (
    <svg viewBox="0 0 420 336" style={{ width: "100%", display: "block" }}>
      <defs>
        <radialGradient id="twinGlow" cx="44%" cy="50%">
          <stop offset="0%" stopColor={dark ? "#F4EDDE" : "#9A742A"} stopOpacity={dark ? "0.13" : "0.16"} />
          <stop offset="100%" stopColor={dark ? "#070B14" : "#F6F1E4"} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={CX} cy={CY} rx="200" ry="164" fill="url(#twinGlow)" />

      {/* Outer plaza (courtyards) */}
      <rect x="20" y="22" width="332" height="292" rx="56" fill="none" stroke={marble + ".14)"} strokeWidth="1.4" strokeDasharray="3 7" />
      {lbl(70, 44, "Plaza", "الساحات", "start")}

      {/* Prayer halls — the mosque building as a ring */}
      <path d="M52,52 h268 a34,34 0 0 1 34,34 v164 a34,34 0 0 1 -34,34 h-268 a34,34 0 0 1 -34,-34 v-164 a34,34 0 0 1 34,-34 Z
               M114,116 h144 a22,22 0 0 1 22,22 v60 a22,22 0 0 1 -22,22 h-144 a22,22 0 0 1 -22,-22 v-60 a22,22 0 0 1 22,-22 Z"
        fillRule="evenodd" fill={hall} stroke={marble + ".2)"} strokeWidth="1.2" />
      {lbl(186, 78, "Prayer halls · expansion", "المصلّيات — التوسعات")}

      {/* Live crowd density on hall corridors */}
      <path d="M52,52 h268 a34,34 0 0 1 34,34 v40" fill="none" stroke={masaC} strokeOpacity=".55" style={{ transition: "stroke .6s" }} strokeWidth="8" strokeLinecap="round" />
      <path d="M354,214 v36 a34,34 0 0 1 -34,34 h-96" fill="none" stroke={matafC} strokeOpacity=".6" style={{ transition: "stroke .6s" }} strokeWidth="8" strokeLinecap="round" />
      <path d="M150,284 h-64 a34,34 0 0 1 -34,-34 v-30" fill="none" stroke={matafC} strokeOpacity=".6" style={{ transition: "stroke .6s" }} strokeWidth="8" strokeLinecap="round" />

      {/* Mataf courtyard */}
      <circle cx={CX} cy={CY} r="52" fill={dark ? "rgba(244,237,222,.06)" : "rgba(255,253,246,.9)"} stroke={marble + ".26)"} strokeWidth="1.2" />
      {lbl(CX, CY + 74, "Mataf", "المطاف")}

      {/* Tawaf — counterclockwise living crowd */}
      <TawafRing cx={CX} cy={CY} r={42} count={22} dur={52} color={dark ? "#F4EDDE" : "#8A671E"} />
      <TawafRing cx={CX} cy={CY} r={30} count={15} dur={36} color={dark ? "#F0D48A" : "#B8923C"} delay={-9} />

      {/* The Kaaba */}
      <g transform={`rotate(45 ${CX} ${CY})`}>
        <rect x={CX - 11} y={CY - 11} width="22" height="22" rx="2" fill={dark ? "#0a0a0d" : "#1c1a16"} stroke={dark ? "#D8B25C" : "#9A742A"} strokeWidth="1.4" />
        <rect x={CX - 11} y={CY - 7} width="22" height="4" fill="none" stroke={dark ? "#D8B25C" : "#C29A3E"} strokeWidth="1.2" />
      </g>

      {/* Masa'a — Safa ⇄ Marwah corridor with live sa'i motion */}
      <rect x="300" y="128" width="104" height="22" rx="11" fill={hall} stroke={marble + ".24)"} strokeWidth="1.2" />
      <circle cx="312" cy="139" r="4" fill={T.emerald} />
      <circle cx="392" cy="139" r="4" fill={T.emerald} />
      <circle r="3" fill={dark ? "#F0D48A" : "#8A671E"}>
        <animate attributeName="cx" values="314;390;314" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="139;139;139" dur="7s" repeatCount="indefinite" />
      </circle>
      {lbl(352, 122, "Masa'a", "المسعى")}
      {lbl(312, 165, "Safa", "الصفا")}
      {lbl(392, 165, "Marwah", "المروة")}

      {/* Minarets */}
      {[[52, 52], [320, 52], [52, 284], [320, 284], [186, 30]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="4.5" fill={dark ? "#D8B25C" : "#9A742A"} /><circle cx={x} cy={y} r="2" fill={dark ? "#070B14" : "#FFFDF6"} /></g>
      ))}

      {/* Gates with live status */}
      {[
        { x: 186, y: 314, en: "King Abdulaziz Gate", ar: "باب الملك عبدالعزيز", ok: true },
        { x: 20, y: 168, en: "Umrah Gate", ar: "باب العمرة", ok: false },
        { x: 260, y: 22, en: "King Fahd Gate", ar: "باب الملك فهد", ok: true },
      ].map((g, i) => (
        <g key={i}>
          <circle cx={g.x} cy={g.y} r="4.6" fill={g.ok ? T.emerald : T.coral} />
          <circle cx={g.x} cy={g.y} r="4.6" fill="none" stroke={g.ok ? T.emerald : T.coral} strokeWidth="1">
            <animate attributeName="r" values="5;13" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".8;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {!compact && <text x={g.x + (g.x < 60 ? 10 : 0)} y={g.y - 9 + (g.y > 300 ? 20 : 0)} textAnchor={g.x < 60 ? "start" : "middle"} fill={marble + ".66)"} fontSize="9.5" fontFamily={isAr ? "IBM Plex Sans Arabic" : "Outfit"}>{t(g.en, g.ar)}</text>}
        </g>
      ))}
    </svg>
  );
};

const CrowdForecast = () => {
  const { T, t } = useApp();
  const hours = [
    { en: "6p", ar: "٦م", v: 58 }, { en: "7p", ar: "٧م", v: 84, now: true }, { en: "8p", ar: "٨م", v: 92 }, { en: "9p", ar: "٩م", v: 71 },
    { en: "10p", ar: "١٠م", v: 46, best: true }, { en: "11p", ar: "١١م", v: 38, best: true }, { en: "12a", ar: "١٢ص", v: 33 }, { en: "1a", ar: "١ص", v: 41 },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 78, padding: "0 4px" }}>
      {hours.map((x, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div style={{
            width: "100%", height: `${x.v * 0.62}px`, borderRadius: 5,
            background: x.now ? T.goldGrad : x.best ? `linear-gradient(180deg,${T.emerald}E6,${T.emerald}66)` : (T.mode === "dark" ? "rgba(244,237,222,.14)" : "rgba(36,27,11,.12)"),
            boxShadow: x.now ? `0 0 14px ${T.gold}80` : "none",
            animation: x.now ? "imkBreathe 2.4s ease-in-out infinite" : "none",
          }} />
          <span style={{ fontSize: 9, color: x.now ? T.goldHi : x.best ? T.emerald : T.faint, fontWeight: x.now || x.best ? 600 : 400 }}>{t(x.en, x.ar)}</span>
        </div>
      ))}
    </div>
  );
};

/* ═════ SCREEN — AL-HARAM LIVE EXPERIENCE ═════ */
const ScreenHaram = () => {
  const { T, t, tt, go } = useApp();
  const [slot, setSlot] = useState(0);
  const fc = useSequence(2, 700);

  const PERIODS = [
    { l:{en:"Now",ar:"الآن"}, tm:{en:"9:00 AM",ar:"٩:٠٠ ص"}, inside:{en:"412k",ar:"٤١٢ ألف"},
      mataf:{s:"busy", l:{en:"Busy",ar:"مزدحم"}, c:T.gold},
      masa:{s:"calm", l:{en:"Flowing",ar:"انسيابي"}, c:T.emerald},
      roof:{s:"calm", l:{en:"Calm",ar:"هادئ"}, c:T.emerald} },
    { l:{en:"+1 hour",ar:"بعد ساعة"}, tm:{en:"10:00 AM",ar:"١٠:٠٠ ص"}, inside:{en:"486k",ar:"٤٨٦ ألف"},
      mataf:{s:"dense", l:{en:"Dense",ar:"شديد الازدحام"}, c:T.coral},
      masa:{s:"busy", l:{en:"Busy",ar:"مزدحم"}, c:T.gold},
      roof:{s:"calm", l:{en:"Calm",ar:"هادئ"}, c:T.emerald} },
    { l:{en:"+2 hours",ar:"بعد ساعتين"}, tm:{en:"11:00 AM",ar:"١١:٠٠ ص"}, inside:{en:"338k",ar:"٣٣٨ ألف"},
      mataf:{s:"calm", l:{en:"Calm",ar:"هادئ"}, c:T.emerald},
      masa:{s:"calm", l:{en:"Flowing",ar:"انسيابي"}, c:T.emerald},
      roof:{s:"calm", l:{en:"Calm",ar:"هادئ"}, c:T.emerald} },
  ];
  const P = PERIODS[slot];
  const calmest = 2;

  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader
        eyebrow={t("The Grand Mosque now", "المسجد الحرام الآن")}
        title={<span>{t("Al-Haram", "الحرم")} <span className="gold-text">{t("Live", "مباشر")}</span></span>}
        right={
          <div className="glass" style={{ borderRadius: 14, padding: "8px 12px", textAlign: "center", minWidth: 68 }}>
            <SwapValue k={"n" + slot} size={16} color={T.goldHi}>{tt(P.inside)}</SwapValue>
            <div style={{ fontSize: 8.5, color: T.faint, letterSpacing: "0.06em", marginTop: 2 }}>
              {slot === 0 ? t("INSIDE NOW", "بالداخل الآن") : t("FORECAST", "متوقّع")}
            </div>
          </div>
        }
      />

      <div style={{ display: "flex", gap: 8, padding: "12px 24px 0" }}>
        {PERIODS.map((p, i) => (
          <button key={i} onClick={() => setSlot(i)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 13, textAlign: "center",
            background: slot === i ? T.goldGrad : "transparent",
            border: `1.3px solid ${slot === i ? "transparent" : T.line}`,
            transition: "background .35s, border-color .35s" }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: slot === i ? T.ink : T.dim }}>{tt(p.l)}</span>
            <span style={{ display: "block", fontSize: 9, color: slot === i ? "rgba(22,15,4,.65)" : T.faint, marginTop: 2 }}>{tt(p.tm)}</span>
          </button>
        ))}
      </div>

      <div style={{ margin: "10px 8px 0", position: "relative" }}>
        <HaramTwin load={{ mataf: P.mataf.s, masa: P.masa.s, roof: P.roof.s }} />

        {/* موجة تحليل مكانية + حقول كثافة حول المناطق */}
        {!wantsStill() && (
          <svg viewBox="0 0 420 336" key={"fx" + slot} aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <defs>
              <radialGradient id="hotG">
                <stop offset="0%" stopColor={P.mataf.c} stopOpacity=".34" />
                <stop offset="100%" stopColor={P.mataf.c} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="sweepG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F0D48A" stopOpacity="0" />
                <stop offset="50%" stopColor="#F0D48A" stopOpacity=".26" />
                <stop offset="100%" stopColor="#F0D48A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* حقل كثافة يتنفّس حول المطاف */}
            <circle cx="186" cy="168" r={P.mataf.s === "dense" ? 108 : P.mataf.s === "busy" ? 84 : 62}
              fill="url(#hotG)" style={{ transition: "r .8s cubic-bezier(.22,.9,.3,1)" }} />
            <SpatialPulse cx={186} cy={168} r={P.mataf.s === "dense" ? 126 : 96} color={P.mataf.c} rings={3} dur={1700} delay={300} />
            {/* موجة المسح تمرّ مرة عند كل فترة */}
            <rect x="0" y="-90" width="420" height="90" fill="url(#sweepG)"
              style={{ animation: "haramSweep 1.25s .15s cubic-bezier(.4,0,.3,1) forwards" }} />
          </svg>
        )}
        {slot > 0 && (
          <span className="ag-seq" style={{ position: "absolute", top: 10, insetInlineEnd: 18, fontSize: 9.5, fontWeight: 700,
            color: T.ink, background: T.goldGrad, padding: "4px 10px", borderRadius: 99, animation: "agRise .35s both" }}>
            {t("Forecast", "توقّع")}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", padding: "8px 24px 0" }}>
        {[[t("Calm", "هادئ"), T.emerald], [t("Busy", "مزدحم"), T.gold], [t("Dense", "شديد الازدحام"), T.coral]].map(([x, c]) => (
          <span key={x} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: T.dim }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: c }} /> {x}
          </span>
        ))}
      </div>

      <div className="glass" style={{ margin: "10px 24px 0", borderRadius: 18, padding: "14px 16px", display: "flex", justifyContent: "space-between" }}>
        {[[t("Mataf", "المطاف"), P.mataf], [t("Masa'a", "المسعى"), P.masa], [t("Roof level", "السطح"), P.roof]].map(([a, z]) => (
          <div key={a} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10.5, color: T.faint, marginBottom: 4 }}>{a}</div>
            <SwapValue k={a + slot} size={13} color={z.c}>{tt(z.l)}</SwapValue>
          </div>
        ))}
      </div>

      <div style={{ margin: "14px 24px 0", minHeight: 96 }}>
        {fc < 2 ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 24 }}>
            <Thinking label={t("Reading crowd state and forecasting", "قراءة حالة الازدحام والتوقّع")} />
          </div>
        ) : (
          <div className="ag-seq" style={{ borderRadius: 20, padding: 16, background: T.aiGrad, border: `1px solid ${T.ai}3d`, animation: "agRise .5s both" }}>
            <div style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "#7FE8C6", fontWeight: 700, marginBottom: 8 }}>
              {t("CALMEST WINDOW", "النافذة الأهدأ")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#F6F1E3" }}>
                  {t("Best time to visit: ", "أفضل وقت للزيارة: ")}{tt(PERIODS[calmest].tm)}
                </div>
                <div style={{ fontSize: 11, color: "rgba(234,246,241,.72)", marginTop: 5, lineHeight: 1.6 }}>
                  {t("The mataf clears after the morning peak — density drops by about a third.",
                     "يخفّ المطاف بعد ذروة الصباح — تنخفض الكثافة نحو الثلث.")}
                </div>
              </div>
              <button onClick={() => setSlot(calmest)} style={{
                padding: "10px 14px", borderRadius: 12, border: "none", background: T.goldGrad,
                color: T.ink, fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
                {t("Show", "اعرضها")}
              </button>
            </div>
          </div>
        )}
      </div>

      <SectionTitle eyebrow={t("Getting in", "الوصول")} title={t("Recommended entry", "الدخول المقترح")} />
      <button onClick={() => go("map")} className="glass" style={{ margin: "0 24px", width: "calc(100% - 48px)", borderRadius: 20, padding: 16, display: "flex", alignItems: "center", gap: 13, textAlign: "start", border: `1px solid ${T.gold}55` }}>
        <div style={{ width: 44, height: 44, borderRadius: 15, display: "grid", placeItems: "center", background: `${T.gold}1f`, border: `1px solid ${T.gold}55`, flexShrink: 0, position: "relative" }}>
          <MapPin size={19} color={T.gold} />
          <span style={{ position: "absolute", inset: -4, borderRadius: 99, border: `1px solid ${T.gold}55`, animation: "imkPulseRing 2.6s ease-out infinite" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{t("King Abdulaziz Gate", "باب الملك عبدالعزيز")}</div>
          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 3, lineHeight: 1.5 }}>
            {t("Closest to the calmer section at this hour — 6 min walk", "الأقرب إلى القسم الأهدأ في هذه الساعة — ٦ دقائق مشياً")}
          </div>
        </div>
        <Fwd size={15} color={T.gold} />
      </button>

      <button onClick={() => go("booking")} style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", padding: 15, borderRadius: 18, border: "none", background: T.goldGrad, color: T.ink, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 28px ${T.gold}4d` }}>
        <Car size={16} /> {t("Book an electric cart", "احجز عربة كهربائية")}
      </button>
    </div>
  );
};

const ScreenHome = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  /* ١ قرأ الموعد · ٢ طابق المواقيت · ٣ استقرّ على التوصية */
  const hs = useSequence(3, 620);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      {/* صدارة الوكيل — بديل صورة السماء */}
      <div style={{ position: "relative", margin: "8px 20px 0", borderRadius: 26, padding: "18px 18px 20px", background: T.aiGrad, border: `1px solid ${T.ai}3d`, boxShadow: `0 18px 44px -18px ${T.mode === "dark" ? "rgba(0,0,0,.85)" : "rgba(10,49,37,.5)"}`, overflow: "hidden" }}>
        {/* شريط علوي: القائمة + ترحيب + أدوات */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 10 }}>
          <MenuButton onClick={onMenu} onDark />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#F6F1E3" }}>{t("Welcome", "أهلاً بك")}</div>
            <button onClick={() => go("profile")} style={{ background: "none", border: "none", padding: 0, fontSize: 10.5, color: "rgba(234,246,241,.6)", marginTop: 3 }}>{t("Profile", "الملف الشخصي")}</button>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            {[{ i: Search, go: "search" }].map((x, i) => (
              <button key={i} onClick={() => x.menu ? onMenu() : go(x.go)} aria-label={x.menu ? "Portals" : "tool"} style={{ width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", position: "relative", background: x.gold ? "rgba(240,212,138,.16)" : "rgba(255,255,255,.09)", border: `1px solid ${x.gold ? "rgba(240,212,138,.5)" : "rgba(234,246,241,.16)"}` }}>
                <x.i size={15} color={x.gold ? "#F0D48A" : "rgba(234,246,241,.9)"} />
                {x.dot && <span style={{ position: "absolute", top: 7, insetInlineEnd: 7, width: 6, height: 6, borderRadius: 99, background: T.coral }} />}
              </button>
            ))}
          </div>
        </div>

        {/* الوكيل كبيراً + الرسالة */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
          <AgentAvatar size={104} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "#6FE0BC", animation: "imkGlowPulse 2.4s infinite" }} />
              <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "#7FE8C6", fontWeight: 700 }}>{t("AI ASSISTANT", "المساعد الذكي")}</span>
            </div>

            {/* تسلسل: قراءة الموعد ثم المواقيت ثم التوصية */}
            <div style={{ marginTop: 8, minHeight: 62, position: "relative" }}>
              {hs < 3 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    { at: 0, ar: "قراءة موعدك المؤكد", en: "Reading your confirmed appointment" },
                    { at: 1, ar: "مطابقة مواقيت الصلاة والطريق", en: "Matching prayer times and road state" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7,
                      opacity: hs >= s.at ? 1 : 0, transform: hs >= s.at ? "translateY(0)" : "translateY(6px)",
                      transition: "opacity .4s, transform .4s" }}>
                      {hs > s.at
                        ? <CheckCircle2 size={12} color="#6FE0BC" />
                        : <span style={{ display: "flex", gap: 3 }}>{[0,1,2].map(d => (
                            <span key={d} className="ag-seq" style={{ width: 3.5, height: 3.5, borderRadius: 99, background: "#6FE0BC", animation: `agDots 1.1s ${d*0.16}s infinite` }} />
                          ))}</span>}
                      <span style={{ fontSize: 11, color: "rgba(246,241,227,.78)" }}>{t(s.en, s.ar)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ag-seq" style={{ fontSize: 13, color: "#F6F1E3", lineHeight: 1.65, animation: "agRise .5s both" }}>
                  {t("Your exhibition appointment is at ", "موعدك في المعرض الساعة ")}
                  <b style={{ color: "#F0D48A" }}>{t("5:00 PM", "٥:٠٠ م")}</b>
                  {t(". I've built your day around it.", ". رتّبتُ يومك حوله.")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => go("customize")} style={{ flex: 1, padding: "11px 14px", borderRadius: 99, border: "none", background: T.goldGrad, color: T.ink, fontSize: 12.5, fontWeight: 700 }}>{t("Personalize my day", "خصّص يومي")}</button>
          <button onClick={() => go("assistant")} style={{ padding: "11px 16px", borderRadius: 99, background: "transparent", border: "1px solid rgba(234,246,241,.3)", color: "rgba(234,246,241,.9)", fontSize: 12.5 }}>{t("Ask", "اسأل")}</button>
        </div>

        {/* شريط الصلاة والطقس */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(234,246,241,.14)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "rgba(234,246,241,.55)" }}>{t("NEXT PRAYER", "الصلاة القادمة")}</div>
            <div className="display" style={{ fontSize: 20, color: "#F6F1E3", marginTop: 3 }}>
              {t("12:19", "١٢:١٩")}<span style={{ fontSize: 12, color: "#F0D48A", marginInlineStart: 8, fontFamily: "inherit" }}>{t("Dhuhr", "الظهر")}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(234,246,241,.8)" }}>
            <Sun size={14} color="#F0D48A" /> {t("34°", "٣٤°")} <span style={{ fontSize: 10.5, color: "rgba(234,246,241,.5)" }}>{t("Clear", "صحو")}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14 }} data-morph-target="citizen"><ConnectedPlatforms /></div>

      {/* Makkah pulse */}
      <SectionTitle eyebrow={t("The city, breathing", "المدينة تنبض")} title={t("Makkah now", "مكة الآن")} action={t("Open twin", "افتح التوأم")} onAction={() => go("haram")} />
      <div className="stagger" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 4px" }}>
        <button onClick={() => go("haram")} className="glass" style={{ minWidth: 172, borderRadius: 22, padding: 0, overflow: "hidden", textAlign: "start", border: `1px solid ${T.gold}55`, flexShrink: 0 }}>
          <div style={{ height: 104, margin: "-8px -30px -16px", pointerEvents: "none" }}><HaramTwin compact /></div>
          <div style={{ padding: "10px 15px 14px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><LiveDot color={T.emerald} /><span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{t("Al-Haram", "الحرم")}</span></div>
            <div style={{ fontSize: 10.5, color: T.gold, marginTop: 3 }}>{t("Busy · calms at 10 PM", "مزدحم — يهدأ في ١٠ م")}</div>
          </div>
        </button>
        {[
          { icon: Footprints, tEn: "To Haram", tAr: "إلى الحرم", v: { en: "18 min", ar: "١٨ د" }, s: { en: "shaded walk", ar: "مسار مظلل" }, c: T.emerald, goTo: "map" },
          { icon: Bus, tEn: "Shuttle 4", tAr: "الحافلة ٤", v: { en: "3 min", ar: "٣ د" }, s: { en: "at your stop", ar: "عند محطتك" }, c: T.blue, goTo: "svc:move" },
          { icon: ParkingCircle, tEn: "Ajyad P3", tAr: "مواقف أجياد ٣", v: { en: "128", ar: "١٢٨" }, s: { en: "spots free", ar: "موقفاً متاحاً" }, c: T.coral, goTo: "svc:move" },
        ].map((x, i) => (
          <button key={i} onClick={() => go(x.goTo)} className="glass" style={{ minWidth: 120, borderRadius: 22, padding: 15, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", textAlign: "start", flexShrink: 0 }}>
            <x.icon size={17} color={x.c} />
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 600, color: T.text, lineHeight: 1 }}>{tt(x.v)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 4 }}>{t(x.tEn, x.tAr)} · {tt(x.s)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Service constellation — all clickable */}
      <SectionTitle eyebrow={t("Everything Makkah offers", "كل ما تقدمه مكة")} title={t("Your city, one orbit", "مدينتك في مدار واحد")} action={t(`All ${SERVICES.length}`, `الكل ${toAr(SERVICES.length)}`)} onAction={() => go("services")} />
      <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "4px 24px 10px" }}>
        {SERVICES.slice(0, 8).map((s, i) => (
          <button key={s.id} onClick={() => go(svcTarget(s.id))} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 66, animation: `imkFloat ${4.5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`, flexShrink: 0 }}>
            <div style={{ width: 58, height: 58, borderRadius: 22, background: `linear-gradient(140deg,${T.mode === "dark" ? s.grad[0] : s.gradL[0]},${T.mode === "dark" ? s.grad[1] : s.gradL[1]})`, border: `1px solid ${T[s.ring]}66`, display: "grid", placeItems: "center", boxShadow: `0 8px 22px -6px ${T[s.ring]}44` }}>
              <s.icon size={22} color={T[s.ring]} />
            </div>
            <span style={{ fontSize: 10.5, color: T.dim, whiteSpace: "nowrap" }}>{tt(s.name)}</span>
          </button>
        ))}
      </div>

      {/* Composed for you */}
      <SectionTitle eyebrow={t("Composed for you", "منسّق خصيصاً لك")} title={t("Your evening", "مساؤك")} action={t("Itinerary", "خطة اليوم")} onAction={() => go("itinerary")} />
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px" }}>
        {[
          { icon: Landmark, k: { en: "SUGGESTED", ar: "مقترح" }, tEn: "After the exhibition", tAr: "بعد زيارة المعرض", sEn: "Makkah Museum — open until 11 PM", sAr: "متحف مكة المكرمة — مفتوح حتى ١١ مساءً", c: T.purple, cta: { en: "View", ar: "اعرض" }, goTo: "svc:discover" },
          { icon: Bus, k: { en: "DEPARTURE 4:20 PM", ar: "التحرك ٤:٢٠ م" }, tEn: "Your route to the exhibition", tAr: "طريقك إلى المعرض", sEn: "Makkah Buses — 28 minutes", sAr: "حافلات مكة — ٢٨ دقيقة", c: T.blue, cta: { en: "Route", ar: "المسار" }, goTo: "itinerary" },
          { icon: Heart, k: { en: "IMPACT UPDATE", ar: "تحديث الأثر" }, tEn: "Your iftar meals reached 40 pilgrims", tAr: "وجباتك وصلت إلى ٤٠ حاجاً", sEn: "Licensed charitable association", sAr: "جمعية خيرية مرخّصة", c: T.pink, cta: { en: "Give again", ar: "تبرّع مجدداً" }, goTo: "svc:give" },
        ].map((x, i) => (
          <button key={i} onClick={() => go(x.goTo)} className="glass" style={{ borderRadius: 20, padding: 15, display: "flex", alignItems: "center", gap: 13, textAlign: "start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 15, flexShrink: 0, display: "grid", placeItems: "center", background: `${x.c}1c`, border: `1px solid ${x.c}4d` }}><x.icon size={19} color={x.c} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", color: x.c, fontWeight: 700 }}>{tt(x.k)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 3, lineHeight: 1.35 }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 3, lineHeight: 1.45 }}>{t(x.sEn, x.sAr)}</div>
            </div>
            <span style={{ padding: "8px 13px", borderRadius: 99, border: `1px solid ${x.c}55`, color: T.text, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{tt(x.cta)}</span>
          </button>
        ))}
      </div>

      {/* Provider bridge */}
    </div>
  );
};

/* ═════ SCREEN — SMART MAP · MAKKAH CITY ═════ */
const ScreenMap = () => {
  const { T, t, go } = useApp();
  const [layer, setLayer] = useState("crowd");
  const dark = T.mode === "dark";
  const layers = [
    { id: "crowd", l: { en: "Crowd", ar: "الازدحام" }, icon: Users },
    { id: "eat", l: { en: "Food", ar: "الطعام" }, icon: Utensils },
    { id: "mosque", l: { en: "Mosques", ar: "المساجد" }, icon: Moon },
    { id: "health", l: { en: "Health", ar: "الصحة" }, icon: HeartPulse },
    { id: "providers", l: { en: "Providers", ar: "مزوّدو الخدمات" }, icon: Store },
    { id: "access", l: { en: "Accessible", ar: "الوصول الشامل" }, icon: Accessibility },
  ];
  const pins = {
    crowd: [{ x: 195, y: 205, c: T.gold, big: 1 }, { x: 132, y: 150, c: T.emerald }, { x: 262, y: 168, c: T.coral }, { x: 168, y: 292, c: T.emerald }],
    eat: [{ x: 118, y: 246, c: T.coral, big: 1 }, { x: 236, y: 262, c: T.coral }, { x: 288, y: 208, c: T.coral }, { x: 150, y: 188, c: T.coral }],
    mosque: [{ x: 195, y: 205, c: T.emerald, big: 1 }, { x: 96, y: 176, c: T.mint }, { x: 276, y: 288, c: T.mint }],
    health: [{ x: 250, y: 128, c: T.cyan, big: 1 }, { x: 122, y: 302, c: T.cyan }, { x: 300, y: 246, c: T.cyan }],
    providers: [{ x: 160, y: 250, c: T.purple, big: 1 }, { x: 240, y: 150, c: T.purple }, { x: 100, y: 120, c: T.purple }, { x: 290, y: 300, c: T.purple }],
    access: [{ x: 178, y: 236, c: T.purple, big: 1 }, { x: 226, y: 172, c: T.purple }, { x: 140, y: 128, c: T.purple }],
  };
  const road = dark ? "rgba(244,237,222," : "rgba(36,27,11,";
  return (
    <div className="screen" style={{ paddingBottom: 118, position: "relative" }}>
      <div style={{ position: "relative", height: 424, overflow: "hidden", borderRadius: "0 0 30px 30px", background: T.mapBg }}>
        <svg viewBox="0 0 390 424" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <g stroke={road + (dark ? ".1)" : ".12)")} strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M195,205 L40,60" /><path d="M195,205 L360,44" /><path d="M195,205 L385,258" />
            <path d="M195,205 L152,420" /><path d="M195,205 L18,318" /><path d="M195,205 L268,424" />
          </g>
          <g stroke={road + ".05)"} strokeWidth="3.4" fill="none">
            <circle cx="195" cy="205" r="70" /><circle cx="195" cy="205" r="128" /><circle cx="195" cy="205" r="188" />
            <path d="M60,120 Q140,96 226,64" /><path d="M300,330 Q240,356 160,346" />
          </g>
          <g fill={road + ".05)"}>
            <path d="M0,90 L46,34 L92,86 Z" /><path d="M320,380 L358,330 L392,384 Z" /><path d="M330,90 L356,58 L384,94 Z" />
          </g>
          <circle cx="195" cy="205" r="34" fill={T.gold + "24"}><animate attributeName="r" values="30;40;30" dur="4s" repeatCount="indefinite" /></circle>
          <g transform="rotate(45 195 205)"><rect x="187" y="197" width="16" height="16" rx="1.5" fill={dark ? "#0a0a0d" : "#1c1a16"} stroke={T.gold} strokeWidth="1.3" /></g>
          <text x="195" y="252" textAnchor="middle" fill={road + ".6)"} fontSize="10">{t("Al-Haram", "الحرم")}</text>
          {/* district labels */}
          <text x="86" y="292" fill={road + ".42)"} fontSize="9.5">{t("Ajyad", "أجياد")}</text>
          <text x="292" y="112" fill={road + ".42)"} fontSize="9.5">{t("Aziziyah", "العزيزية")}</text>
          <text x="60" y="150" fill={road + ".42)"} fontSize="9.5">{t("Shubaikah", "الشبيكة")}</text>
          {layer === "crowd" && [0, 1, 2].map((i) => (
            <circle key={i} r="3" fill={dark ? "#F0D48A" : "#8A671E"} opacity="0.85">
              <animateMotion dur={`${5 + i * 2}s`} repeatCount="indefinite" path={["M40,60 L195,205", "M152,420 L195,205", "M360,44 L195,205"][i]} />
            </circle>
          ))}
          {pins[layer].map((p, i) => (
            <g key={layer + i} style={{ animation: "imkEnterScale .4s both", animationDelay: `${i * 0.06}s` }}>
              <circle cx={p.x} cy={p.y} r={p.big ? 8 : 5.5} fill={p.c} stroke={dark ? "#070B14" : "#FFFDF6"} strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r={p.big ? 8 : 5.5} fill="none" stroke={p.c}>
                <animate attributeName="r" values="8;20" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".7;0" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          <circle cx="150" cy="330" r="6" fill={T.blue} stroke={dark ? "#F4EDDE" : "#FFFDF6"} strokeWidth="2" />
          <text x="150" y="352" textAnchor="middle" fill={road + ".6)"} fontSize="10">{t("You", "أنت")}</text>
        </svg>

        <div style={{ position: "relative", padding: "18px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.16em", color: T.gold, fontWeight: 700 }}>{t("MAKKAH CITY", "مدينة مكة المكرمة")}</div>
              <div className="display" style={{ fontSize: 23, color: T.text }}>{t("Smart Map", "الخريطة الذكية")}</div>
              <div style={{ marginTop: 7 }}><AIChip ar="ذكاء التحليل المكاني" en="Geospatial AI" /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => go("camera")} aria-label="Camera" className="glass" style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center" }}><Camera size={17} color={T.text} /></button>
              <button onClick={() => go("emergency")} aria-label="Emergency" className="glass" style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center", border: `1px solid ${T.coral}66` }}><AlertTriangle size={16} color={T.coral} /></button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto", paddingBottom: 4 }}>
            {layers.map((l) => <Chip key={l.id} icon={l.icon} active={layer === l.id} onClick={() => setLayer(l.id)}>{t(l.l.en, l.l.ar)}</Chip>)}
          </div>
        </div>
      </div>

      <div className="glass" style={{ margin: "-30px 20px 0", borderRadius: 24, padding: 18, position: "relative" }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: T.faint, margin: "0 auto 14px", opacity: .5 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Sparkles size={14} color={T.gold} />
          <span style={{ fontSize: 12, color: T.dim }}>{t("The assistant reads the city with you", "المساعد الذكي يقرأ المدينة معك")}</span>
        </div>
        {[
          { tEn: "Shaded walking route to the Haram", tAr: "مسار مشي مظلل إلى الحرم", sEn: "Via Ajyad St · water point on the way · +3 min", sAr: "عبر شارع أجياد — نقطة مياه في الطريق — +٣ د", icon: Footprints, c: T.emerald },
          { tEn: "Share precise location for pickup", tAr: "شارك موقعك الدقيق للاستقبال", sEn: "One-time link · expires in 30 min", sAr: "رابط لمرة واحدة — تنتهي صلاحيته خلال ٣٠ دقيقة", icon: Share2, c: T.blue },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 0", borderTop: i ? `1px solid ${T.line}` : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center", background: `${x.c}1c`, border: `1px solid ${x.c}4a`, flexShrink: 0 }}><x.icon size={17} color={x.c} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{t(x.sEn, x.sAr)}</div>
            </div>
            <Fwd size={16} color={T.faint} />
          </div>
        ))}
        <button onClick={() => go("haram")} style={{ width: "100%", marginTop: 8, padding: 14, borderRadius: 16, border: `1px solid ${T.gold}66`, background: `${T.gold}1a`, color: T.goldHi, fontWeight: 600, fontSize: 13, display: "flex", justifyContent: "center", alignItems: "center", gap: 7 }}>
          <Radio size={15} /> {t("Open Al-Haram Digital Twin — a different map, for the mosque itself", "افتح التوأم الرقمي للحرم — خريطة مستقلة للمسجد نفسه")}
        </button>
      </div>
    </div>
  );
};

/* ═════ SCREEN — SUHAYB, THE AI COMPANION ═════ */
const ScreenAssistant = () => {
  const { T, t, tt, go } = useApp();
  /* ١ فهم الطلب · ٢ قراءة السياق · ٣ الرد · ٤ بطاقة الإجراء */
  const as = useSequence(4, 560);
  const [typed, setTyped] = useState("");
  return (
    <div className="screen" style={{ paddingBottom: 118, display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ textAlign: "center", padding: "26px 24px 8px" }}>
        <div style={{ display: "inline-block", position: "relative" }}>
          <AgentAvatar size={84} />
          <span style={{ position: "absolute", inset: -14, borderRadius: 99, border: `1px solid ${T.ai}55`, animation: "imkPulseRing 3s ease-out infinite", pointerEvents: "none" }} />
        </div>
        <div className="display" style={{ fontSize: 22, color: T.text, marginTop: 16 }}>{t("AI Assistant", "المساعد الذكي")}</div>
        <div style={{ fontSize: 12, color: T.faint, marginTop: 3 }}>{t("Conversational & Multimodal AI", "ذكاء المحادثة ومتعدد الوسائط")}</div>
      </div>

      <div style={{ flex: 1, padding: "8px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "80%", background: `linear-gradient(120deg, ${T.gold}3d, ${T.gold}1a)`, border: `1px solid ${T.gold}59`, borderRadius: "20px 20px 5px 20px", padding: "11px 15px", fontSize: 13, color: T.text, lineHeight: 1.6 }}>
          {t("How do I get to the exhibition before my appointment?", "كيف أصل إلى المعرض قبل موعدي؟")}
        </div>

        {as < 3 && (
          <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 8 }}>
            <Thinking done={as >= 1} label={t("Understanding your request", "فهم طلبك")} />
            {as >= 1 && <Thinking done={as >= 2} label={t("Reading your appointment and prayer times", "قراءة موعدك ومواقيت الصلاة")} />}
          </div>
        )}

        {as >= 3 && (
        <div className="glass ag-seq" style={{ alignSelf: "flex-start", maxWidth: "94%", borderRadius: "20px 20px 20px 5px", padding: 16, animation: "agRise .45s both" }}>
          <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.7 }}>
            {t("Your appointment is at 5:00 PM. Leaving at 4:20 by Makkah Buses gets you there before it begins — and Asr comes first.",
               "موعدك الساعة ٥:٠٠ م. الانطلاق ٤:٢٠ بحافلات مكة يوصلك قبل بدايته — وصلاة العصر قبله.")}
          </div>
          <div style={{ marginTop: 14, position: "relative", paddingInlineStart: 20 }}>
            <span style={{ position: "absolute", insetInlineStart: 5, top: 8, bottom: 8, width: 2, background: `linear-gradient(180deg,${T.emerald},${T.blue},${T.gold})`, borderRadius: 99, opacity: .55 }} />
            {[
              { tm:{en:"3:46",ar:"٣:٤٦"}, w:{en:"Asr",ar:"صلاة العصر"}, s:{en:"Nearest mosque to you",ar:"أقرب مسجد إليك"}, c:T.emerald },
              { tm:{en:"4:20",ar:"٤:٢٠"}, w:{en:"Departure",ar:"وقت التحرك"}, s:{en:"Makkah Buses — 28 min",ar:"حافلات مكة — ٢٨ دقيقة"}, c:T.blue },
              { tm:{en:"5:00",ar:"٥:٠٠"}, w:{en:"Exhibition appointment",ar:"موعد المعرض"}, s:{en:"Confirmed via Visits Gateway",ar:"مؤكد عبر بوابة الزيارات"}, c:T.gold },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", position: "relative" }}>
                <span style={{ position: "absolute", insetInlineStart: -19, top: 13, width: 8, height: 8, borderRadius: 99, background: x.c, boxShadow: `0 0 8px ${x.c}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: x.c, minWidth: 40 }}>{tt(x.tm)}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{tt(x.w)}</div>
                  <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{tt(x.s)}</div>
                </div>
              </div>
            ))}
          </div>
          <Step at={4} now={as}>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={() => go("itinerary")} style={{ flex: 1, padding: 11, borderRadius: 13, border: "none", background: T.goldGrad, color: T.ink, fontWeight: 700, fontSize: 12 }}>{t("Add to my day", "أضِفها إلى خطة يومي")}</button>
              <button style={{ padding: "11px 16px", borderRadius: 13, background: "transparent", border: `1px solid ${T.faint}`, color: T.dim, fontSize: 12 }}>{t("Adjust", "تعديل")}</button>
            </div>
          </Step>
        </div>
        )}

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {[
            { l:{en:"Translate a sign",ar:"ترجم لوحة إرشادية"}, goTo:"camera" },
            { l:{en:"Nearest prayer place",ar:"أقرب مصلى"}, goTo:"map" },
            { l:{en:"After the exhibition",ar:"بعد المعرض"}, goTo:"svc:discover" },
          ].map((s, i) => <Chip key={i} onClick={() => go(s.goTo)}>{tt(s.l)}</Chip>)}
        </div>
      </div>

      <div style={{ padding: "10px 20px 0" }}>
        <div className="glass" style={{ borderRadius: 99, padding: "6px 6px", paddingInlineStart: 18, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.gold}44` }}>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={t("Ask anything about Makkah…", "اسأل عن أي شيء في مكة…")} style={{ flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, minWidth: 0 }} />
          <button onClick={() => go("camera")} aria-label="Camera" style={{ width: 34, height: 34, borderRadius: 99, display: "grid", placeItems: "center", background: "transparent", border: `1px solid ${T.faint}`, flexShrink: 0 }}><Camera size={15} color={T.dim} /></button>
          <button aria-label="Voice" style={{ width: 34, height: 34, borderRadius: 99, display: "grid", placeItems: "center", background: "transparent", border: `1px solid ${T.faint}`, flexShrink: 0 }}><Mic size={15} color={T.dim} /></button>
          <button aria-label="Send" style={{ width: 40, height: 40, borderRadius: 99, display: "grid", placeItems: "center", background: T.goldGrad, border: "none", boxShadow: `0 4px 14px ${T.gold}66`, flexShrink: 0 }}><Send size={16} color={T.ink} style={{ transform: "scaleX(var(--flip,1))" }} /></button>
        </div>
      </div>
    </div>
  );
};

/* ═════ SCREEN — SMART WALLET ═════ */
const ScreenWallet = () => {
  const { T, t, go } = useApp();
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <div style={{ padding: "18px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="display" style={{ fontSize: 24, color: T.text }}>{t("Smart", "المحفظة")} <span className="gold-text">{t("Wallet", "الذكية")}</span></div>
        <button onClick={() => go("profile")} aria-label="Privacy" className="glass" style={{ width: 38, height: 38, borderRadius: 13, display: "grid", placeItems: "center" }}><Shield size={16} color={T.emerald} /></button>
      </div>

      {/* Kiswa card — stays black-and-gold in both themes, like the kiswa itself */}
      <div style={{ margin: "18px 24px 0", borderRadius: 26, padding: 22, position: "relative", overflow: "hidden", background: "linear-gradient(140deg,#15130c 0%, #0a0908 60%)", border: "1px solid rgba(216,178,92,.5)", boxShadow: `0 18px 44px -14px ${T.gold}55` }}>
        <svg viewBox="0 0 340 180" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .5 }}>
          <defs>
            <pattern id="kiswaPat" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M17 2 L32 17 L17 32 L2 17 Z" fill="none" stroke="rgba(216,178,92,.22)" strokeWidth="1" />
              <circle cx="17" cy="17" r="2.4" fill="rgba(216,178,92,.2)" />
            </pattern>
          </defs>
          <rect width="340" height="180" fill="url(#kiswaPat)" />
          <rect y="26" width="340" height="14" fill="none" stroke="rgba(216,178,92,.35)" strokeWidth="1" />
        </svg>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "#D8B25C" }}>{t("EYEMAKKAH BALANCE", "رصيد EyeMakkah")}</span>
            <span className="arabic" style={{ fontSize: 14, color: "rgba(216,178,92,.8)" }}>مكة</span>
          </div>
          <div className="display" style={{ fontSize: 38, color: "#F4EDDE", margin: "14px 0 2px", direction: "ltr", textAlign: "start" }}>
            {t("1,284", "١٬٢٨٤")}<span style={{ fontSize: 16, color: "#D8B25C", marginInlineStart: 7, fontFamily: "Outfit" }}>{t("SAR", "ر.س")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 11, color: "rgba(244,237,222,.5)" }}>{t("EyeMakkah Wallet ·· 4821", "محفظة EyeMakkah ٤٨٢١••")}</span>
            <div style={{ textAlign: "end" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F0D48A", display: "flex", alignItems: "center", gap: 5 }}><Star size={13} fill="#F0D48A" color="#F0D48A" /> {t("2,410", "٢٬٤١٠")}</div>
              <div style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(244,237,222,.5)" }}>{t("NOOR POINTS", "نقاط نور")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stagger" style={{ display: "flex", gap: 10, padding: "16px 24px 0" }}>
        {[
          { icon: Zap, l: { en: "Cart", ar: "عربة" }, c: T.gold, goTo: "booking" },
          { icon: ParkingCircle, l: { en: "Parking", ar: "مواقف" }, c: T.blue, goTo: "svc:move" },
          { icon: Heart, l: { en: "Donate", ar: "تبرّع" }, c: T.pink, goTo: "svc:give" },
          { icon: Ticket, l: { en: "Tickets", ar: "تذاكر" }, c: T.emerald, goTo: "svc:discover" },
        ].map((x, i) => (
          <button key={i} onClick={() => go(x.goTo)} className="glass" style={{ flex: 1, borderRadius: 18, padding: "14px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <x.icon size={19} color={x.c} />
            <span style={{ fontSize: 10.5, color: T.dim }}>{t(x.l.en, x.l.ar)}</span>
          </button>
        ))}
      </div>

      <div className="glass" style={{ margin: "16px 24px 0", borderRadius: 22, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke={T.line} strokeWidth="6" />
          <circle cx="36" cy="36" r="30" fill="none" stroke={T.pink} strokeWidth="6" strokeLinecap="round" strokeDasharray="132 188" transform="rotate(-90 36 36)">
            <animate attributeName="stroke-dasharray" values="0 188;132 188" dur="1.4s" fill="freeze" />
          </circle>
          <text x="36" y="41" textAnchor="middle" fill={T.text} fontSize="15" fontWeight="600">{t("70%", "٧٠٪")}</text>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", color: T.pink, fontWeight: 700 }}>{t("SADAQAH GOAL", "هدف الصدقة")}</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, marginTop: 4 }}>{t("350 of 500 SAR given", "تم التبرع بـ ٣٥٠ من ٥٠٠ ر.س")}</div>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{t("Your giving fed 40 pilgrims this month", "عطاؤك أطعم ٤٠ حاجاً هذا الشهر")}</div>
        </div>
        <button onClick={() => go("svc:give")} style={{ padding: "9px 14px", borderRadius: 99, border: `1px solid ${T.pink}77`, background: `${T.pink}1a`, color: T.pink, fontSize: 11.5, fontWeight: 700 }}>+٥٠</button>
      </div>

      {/* Rewards — Loyalty */}
      <div className="glass" style={{ margin: "12px 24px 0", borderRadius: 20, padding: 15, display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ width: 44, height: 44, borderRadius: 15, display: "grid", placeItems: "center", background: `${T.gold}1c`, border: `1px solid ${T.gold}4d` }}><Gift size={19} color={T.gold} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t("Reward unlocked: free cart ride", "مكافأة جديدة: رحلة عربة مجانية")}</div>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{t("Tawaf streak · redeem within 7 days", "سلسلة الطواف — استبدلها خلال ٧ أيام")}</div>
        </div>
        <button onClick={() => go("booking")} style={{ padding: "8px 13px", borderRadius: 99, border: "none", background: T.goldGrad, color: T.ink, fontSize: 11, fontWeight: 700 }}>{t("Redeem", "استبدال")}</button>
      </div>

      <SectionTitle eyebrow={t("Across the city", "عبر المدينة")} title={t("Recent activity", "آخر العمليات")} action={t("All", "الكل")} />
      <div className="stagger" style={{ padding: "0 24px", display: "flex", flexDirection: "column" }}>
        {[
          { icon: Zap, tEn: "Electric cart · Gate 79", tAr: "عربة كهربائية — باب ٧٩", d: { en: "Today 5:12 PM", ar: "اليوم ٥:١٢ م" }, v: { en: "−20", ar: "−٢٠" }, c: T.gold },
          { icon: Utensils, tEn: "Restaurant · reservation", tAr: "مطعم — حجز", d: { en: "Today 4:48 PM", ar: "اليوم ٤:٤٨ م" }, v: { en: "−12", ar: "−١٢" }, c: T.coral },
          { icon: Heart, tEn: "Charitable donation · meals", tAr: "تبرّع خيري — إفطار", d: { en: "Yesterday", ar: "أمس" }, v: { en: "−50", ar: "−٥٠" }, c: T.pink },
          { icon: Gift, tEn: "Noor reward · tawaf streak", tAr: "مكافأة نور — سلسلة الطواف", d: { en: "Yesterday", ar: "أمس" }, v: { en: "+120 pts", ar: "+١٢٠ نقطة" }, c: T.emerald, plus: 1 },
          { icon: BedDouble, tEn: "Accommodation · refund", tAr: "إسكان — استرداد", d: { en: "Mon", ar: "الاثنين" }, v: { en: "+180", ar: "+١٨٠" }, c: T.blue, plus: 1 },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderBottom: `1px solid ${T.line}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: `${x.c}1a`, border: `1px solid ${x.c}44` }}><x.icon size={17} color={x.c} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{t(x.d.en, x.d.ar)}</div>
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: x.plus ? T.emerald : T.text }}>{t(x.v.en, x.v.ar)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═════ SCREEN — ALL 12 SERVICES ═════ */
const ScreenServices = () => {
  const { T, t, tt, go } = useApp();
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader title={<span>{t("Everything", "كل ما في")} <span className="gold-text">{t("Makkah", "مكة")}</span></span>} eyebrow={t(`${SERVICES.length} SERVICE WORLDS`, `${toAr(SERVICES.length)} عوالم من الخدمات`)} />
      <button onClick={() => go("search")} className="glass" style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", borderRadius: 99, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, textAlign: "start" }}>
        <Search size={16} color={T.faint} />
        <span style={{ fontSize: 13, color: T.faint, flex: 1 }}>{t("Search stays, transport, food, events…", "ابحث عن إقامة، تنقّل، طعام، فعاليات…")}</span>
        <Mic size={15} color={T.gold} />
      </button>
      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "18px 24px 0" }}>
        {SERVICES.map((s) => (
          <button key={s.id} onClick={() => go(svcTarget(s.id))} style={{
            borderRadius: 22, padding: 16, textAlign: "start",
            background: `linear-gradient(140deg,${T.mode === "dark" ? s.grad[0] : s.gradL[0]},${T.mode === "dark" ? s.grad[1] : s.gradL[1]})`,
            border: `1px solid ${T[s.ring]}55`, position: "relative", overflow: "hidden", minHeight: 118,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ position: "absolute", top: -22, insetInlineEnd: -22, width: 84, height: 84, borderRadius: 99, background: `radial-gradient(circle, ${T[s.ring]}30, transparent 70%)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <s.icon size={22} color={T[s.ring]} />
              <Fwd size={15} color={T[s.ring]} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{tt(s.name)}</div>
              <div style={{ fontSize: 10, color: T[s.ring], marginTop: 3, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                {s.id === "haram" && <LiveDot color={T[s.ring]} />}{tt(s.tag)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═════ GENERIC SERVICE SUBPAGE (data-driven) ═════ */
const PrayerRow = () => {
  const { T, t } = useApp();
  const prayers = [
    { en: "Fajr", ar: "الفجر", tm: { en: "4:48", ar: "٤:٤٨" } }, { en: "Dhuhr", ar: "الظهر", tm: { en: "12:19", ar: "١٢:١٩" } },
    { en: "Asr", ar: "العصر", tm: { en: "3:46", ar: "٣:٤٦" } }, { en: "Maghrib", ar: "المغرب", tm: { en: "6:32", ar: "٦:٣٢" }, next: true },
    { en: "Isha", ar: "العشاء", tm: { en: "8:02", ar: "٨:٠٢" } },
  ];
  return (
    <div className="glass" style={{ margin: "16px 24px 0", borderRadius: 20, padding: "16px 10px", display: "flex", justifyContent: "space-around" }}>
      {prayers.map((p, i) => (
        <div key={i} style={{ textAlign: "center", padding: "4px 6px", borderRadius: 12, background: p.next ? `${T.gold}1f` : "transparent", border: p.next ? `1px solid ${T.gold}55` : "1px solid transparent" }}>
          <div style={{ fontSize: 10.5, color: p.next ? T.goldHi : T.faint, fontWeight: p.next ? 700 : 500 }}>{t(p.en, p.ar)}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: p.next ? T.goldHi : T.text, marginTop: 3 }}>{t(p.tm.en, p.tm.ar)}</div>
        </div>
      ))}
    </div>
  );
};

const ScreenService = ({ id }) => {
  const { T, t, tt, lang, go } = useApp();
  const svc = SERVICES.find((s) => s.id === id);
  const d = DETAIL[id];
  if (!svc || !d) return null;
  const ring = T[svc.ring];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader
        eyebrow={t("SERVICE AREA", "مجال الخدمة")}
        title={tt(svc.name)}
        right={<div style={{ width: 42, height: 42, borderRadius: 15, display: "grid", placeItems: "center", background: `${ring}1f`, border: `1px solid ${ring}55` }}><svc.icon size={20} color={ring} /></div>}
      />
      <div style={{ padding: "10px 24px 0" }}><AIChip ar="ذكاء التخصيص" en="Personalization AI" /></div>
      <FeaturePills items={d.features[lang]} />
      <div className="stagger">
        {d.blocks.map((b, bi) => {
          if (b.type === "quick") return (
            <div key={bi} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px 24px 0" }}>
              {b.items.map((x, i) => (
                <button key={i} onClick={() => x.goTo && go(x.goTo)} className="glass" style={{ borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 11, textAlign: "start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: `${T[x.c]}1f`, border: `1px solid ${T[x.c]}55`, flexShrink: 0 }}><x.icon size={16} color={T[x.c]} /></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{t(x.en, x.ar)}</span>
                </button>
              ))}
            </div>
          );
          if (b.type === "listings") return (
            <div key={bi}>
              <SectionTitle eyebrow={tt(b.eyebrow)} title={tt(b.title)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px" }}>
                {b.items.map((x, i) => (
                  <button key={i} onClick={() => go("booking")} className="glass" style={{ borderRadius: 20, padding: 16, textAlign: "start" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t(x.en, x.ar)}</div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: ring, whiteSpace: "nowrap" }}>{tt(x.price)}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: T.dim, marginTop: 4, lineHeight: 1.5 }}>{tt(x.sub)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <Rating v={x.rating} n={x.n} />
                      {x.verified && <Verified />}
                      {x.access && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 700, color: T.purple, background: `${T.purple}1a`, border: `1px solid ${T.purple}55`, padding: "3px 8px", borderRadius: 99 }}><Accessibility size={10} /> {t("Accessible", "مهيّأ")}</span>}
                      <span style={{ marginInlineStart: "auto", fontSize: 11, fontWeight: 600, color: ring, display: "flex", alignItems: "center", gap: 3 }}>{t("Book", "احجز")} <Fwd size={12} color={ring} /></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
          if (b.type === "banner") return (
            <button key={bi} onClick={() => b.goTo && go(b.goTo)} className="glass" style={{ margin: "16px 24px 0", width: "calc(100% - 48px)", borderRadius: 20, padding: 16, display: "flex", gap: 13, alignItems: "flex-start", textAlign: "start", border: `1px solid ${T[b.c]}44` }}>
              <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: `${T[b.c]}1c`, border: `1px solid ${T[b.c]}55`, flexShrink: 0 }}>{React.createElement(b.icon, { size: 18, color: T[b.c] })}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.55 }}>{t(b.en, b.ar)}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T[b.c], marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>{tt(b.cta)} <Fwd size={12} color={T[b.c]} /></div>
              </div>
            </button>
          );
          if (b.type === "camera-banner") return (
            <button key={bi} onClick={() => go("camera")} style={{ margin: "16px 24px 0", width: "calc(100% - 48px)", borderRadius: 20, padding: 16, display: "flex", gap: 13, alignItems: "center", textAlign: "start", background: T.goldGrad, border: "none", boxShadow: `0 8px 26px ${T.gold}4d` }}>
              <Scan size={22} color={T.ink} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>{t("Point your camera at any menu", "وجّه كاميرتك نحو أي قائمة طعام")}</div>
                <div style={{ fontSize: 11, color: T.ink, opacity: .75, marginTop: 2 }}>{t("Instant translation & dish explanations", "ترجمة فورية وشرح للأطباق")}</div>
              </div>
              <Camera size={18} color={T.ink} />
            </button>
          );
          if (b.type === "emergency-banner") return (
            <button key={bi} onClick={() => go("emergency")} style={{ margin: "16px 24px 0", width: "calc(100% - 48px)", borderRadius: 20, padding: 16, display: "flex", gap: 13, alignItems: "center", textAlign: "start", background: `linear-gradient(120deg,${T.coral},${T.mode === "dark" ? "#B05336" : "#8E3C20"})`, border: "none", boxShadow: `0 8px 26px ${T.coral}59` }}>
              <AlertTriangle size={22} color="#FFF6EC" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#FFF6EC" }}>{t("Emergency Mode", "وضع الطوارئ")}</div>
                <div style={{ fontSize: 11, color: "#FFF6EC", opacity: .85, marginTop: 2 }}>{t("One tap: nearest help + share your precise location", "لمسة واحدة: أقرب جهة إسعاف + مشاركة موقعك الدقيق")}</div>
              </div>
              <Fwd size={16} color="#FFF6EC" />
            </button>
          );
          if (b.type === "prayers") return <PrayerRow key={bi} />;
          if (b.type === "progress") return (
            <div key={bi}>
              <SectionTitle eyebrow={tt(b.eyebrow)} title={tt(b.title)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px" }}>
                {b.items.map((x, i) => (
                  <div key={i} className="glass" style={{ borderRadius: 20, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{t(x.en, x.ar)}</div>
                      <Verified />
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: T.line, margin: "12px 0 8px", overflow: "hidden" }}>
                      <div style={{ width: `${x.pct}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${T[x.c]},${T[x.c]}88)` }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: T.dim, lineHeight: 1.4 }}>{tt(x.sub)}</span>
                      <button onClick={() => go("wallet")} style={{ padding: "7px 13px", borderRadius: 99, border: "none", background: T.goldGrad, color: T.ink, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{t("Donate", "تبرّع")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          if (b.type === "hcards") return (
            <div key={bi}>
              <SectionTitle eyebrow={tt(b.eyebrow)} title={tt(b.title)} />
              <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 4px" }}>
                {b.items.map((x, i) => (
                  <button key={i} onClick={() => go(x.goTo || "booking")} className="glass" style={{ minWidth: x.booked ? 186 : 150, borderRadius: 20, padding: 15, textAlign: "start", flexShrink: 0, border: x.booked ? `1px solid ${T.gold}77` : undefined }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: `${T[x.c]}1f`, border: `1px solid ${T[x.c]}55`, marginBottom: 12 }}>{React.createElement(x.icon, { size: 16, color: T[x.c] })}</div>
                      {x.booked && <span style={{ fontSize: 8.5, fontWeight: 700, color: T.gold, background: `${T.gold}1c`, border: `1px solid ${T.gold}55`, padding: "3px 7px", borderRadius: 99 }}>{t("BOOKED", "محجوز")}</span>}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{t(x.en, x.ar)}</div>
                    <div style={{ fontSize: 10.5, color: x.booked ? T.gold : T.faint, marginTop: 3, fontWeight: x.booked ? 600 : 400 }}>{tt(x.sub)}</div>
                    {x.booked && <div style={{ fontSize: 9.5, color: T.faint, marginTop: 5 }}>{t("via Visits Gateway", "عبر بوابة الزيارات")}</div>}
                  </button>
                ))}
              </div>
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
};

/* ═════ SCREEN — PROFILE (language, theme, privacy, offline, accessibility, saved, support) ═════ */
const ScreenProfile = () => {
  const { T, t, lang, setLang, mode, setMode, go } = useApp();
  const langs = [
    { id: "ar", label: "العربية", on: true }, { id: "en", label: "English", on: true },
    { id: "ur", label: "اردو" }, { id: "id", label: "Bahasa" }, { id: "tr", label: "Türkçe" },
    { id: "fr", label: "Français" }, { id: "bn", label: "বাংলা" }, { id: "ms", label: "Melayu" },
  ];
  const [access, setAccess] = useState(false);
  const [offline, setOffline] = useState(true);
  const Toggle = ({ on, set }) => (
    <button onClick={() => set(!on)} aria-label="toggle" style={{ width: 44, height: 26, borderRadius: 99, border: "none", background: on ? T.goldGrad : T.line, position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, insetInlineStart: on ? 21 : 3, width: 20, height: 20, borderRadius: 99, background: on ? T.ink : T.bg2, transition: "all .2s", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }} />
    </button>
  );
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("USER PROFILE", "الملف الشخصي")} title={t("My profile", "ملفي الشخصي")}
        right={<div style={{ width: 46, height: 46, borderRadius: 17, background: "linear-gradient(140deg,#D8B25C,#8A6A2A)", display: "grid", placeItems: "center", fontWeight: 700, color: "#160F04", fontSize: 17 }}>{t("\u2726", "\u2726")}</div>} />

      {/* Language — Multi-language Interface */}
      <SectionTitle eyebrow={t("Multi-language interface", "واجهة متعددة اللغات")} title={t("Language", "اللغة")} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 24px" }}>
        {langs.map((l) => (
          <button key={l.id} onClick={() => l.on && setLang(l.id)} disabled={!l.on} style={{
            padding: "10px 16px", borderRadius: 14, fontSize: 13, fontWeight: 600,
            background: lang === l.id ? T.goldGrad : "transparent",
            border: `1px solid ${lang === l.id ? "transparent" : l.on ? T.gold + "77" : T.line}`,
            color: lang === l.id ? T.ink : l.on ? T.text : T.faint,
            opacity: l.on ? 1 : 0.55, cursor: l.on ? "pointer" : "default",
          }}>
            {l.label}{!l.on && <span style={{ fontSize: 9, marginInlineStart: 5, opacity: .8 }}>{t("soon", "قريباً")}</span>}
          </button>
        ))}
      </div>

      {/* Appearance */}
      <SectionTitle eyebrow={t("Appearance", "المظهر")} title={t("Day & night", "النهار والليل")} />
      <div style={{ display: "flex", gap: 10, padding: "0 24px" }}>
        {[
          { id: "light", icon: SunMedium, l: { en: "Light — Duha", ar: "نهاري — ضُحى" } },
          { id: "dark", icon: MoonStar, l: { en: "Dark — Layl", ar: "ليلي — ليل" } },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} className="glass" style={{ flex: 1, borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 10, border: `1.4px solid ${mode === m.id ? T.gold : "transparent"}`, justifyContent: "center" }}>
            <m.icon size={18} color={mode === m.id ? T.goldHi : T.faint} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: mode === m.id ? T.goldHi : T.dim }}>{t(m.l.en, m.l.ar)}</span>
          </button>
        ))}
      </div>

      {/* Preferences & modes */}
      <SectionTitle eyebrow={t("Personalization & Context AI", "ذكاء التخصيص والسياق")} title={t("My experience", "تجربتي")} />
      <div className="glass" style={{ margin: "0 24px", borderRadius: 20, overflow: "hidden" }}>
        {[
          { icon: Accessibility, tEn: "Accessibility Mode", tAr: "وضع الوصول الشامل", sEn: "Step-free routes, accessible stays & transport", sAr: "مسارات بلا درج وإقامة ونقل مهيّأ", toggle: [access, setAccess], c: T.purple },
          { icon: WifiOff, tEn: "Offline Mode", tAr: "وضع عدم الاتصال", sEn: "Maps, itinerary, tickets & guides saved on device", sAr: "الخرائط والخطة والتذاكر والأدلة محفوظة على جهازك", toggle: [offline, setOffline], c: T.cyan },
          { icon: Bookmark, tEn: "Saved & favorites", tAr: "المحفوظات والمفضلة", sEn: "12 places — 3 events — 2 campaigns", sAr: "١٢ مكاناً — ٣ فعاليات — حملتان", c: T.gold },
          { icon: Lock, tEn: "Consent & Privacy Center", tAr: "مركز الخصوصية والموافقات", sEn: "Location, AI memory, marketing, data deletion", sAr: "الموقع، ذاكرة الذكاء، التسويق، حذف البيانات", c: T.emerald },
          { icon: HelpCircle, tEn: "Help & Support", tAr: "المساعدة والدعم", sEn: "FAQs, tickets, human support", sAr: "الأسئلة الشائعة والتذاكر والدعم البشري", c: T.blue },
        ].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, display: "grid", placeItems: "center", background: `${x.c}1a`, border: `1px solid ${x.c}44`, flexShrink: 0 }}><x.icon size={17} color={x.c} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2, lineHeight: 1.4 }}>{t(x.sEn, x.sAr)}</div>
            </div>
            {x.toggle ? <Toggle on={x.toggle[0]} set={x.toggle[1]} /> : <Fwd size={15} color={T.faint} />}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═════ SCREEN — SMART NOTIFICATIONS ═════ */
const ScreenNotifications = () => {
  const { T, t, tt, go, setReplan } = useApp();
  const ns = useSequence(4, 320);
  const items = [
    { icon: AlertTriangle, k:{en:"NOW · ACTION TAKEN",ar:"الآن — تم التصرف"},
      tEn:"Traffic ahead — your plan was updated", tAr:"ازدحام في طريقك — حُدّثت خطتك",
      sEn:"Departure advanced 15 min — you still arrive before 5:00", sAr:"قُدّم التحرك ١٥ دقيقة — وستصل قبل ٥:٠٠",
      c:T.coral, act:()=>{ setReplan(true); go("itinerary"); } },
    { icon: Clock3, k:{en:"DEPARTURE",ar:"وقت التحرك"},
      tEn:"Time to leave for the exhibition", tAr:"حان وقت التحرك إلى المعرض",
      sEn:"Shuttle 4 from your stop · 22 min door to door", sAr:"الحافلة ٤ من محطتك — ٢٢ دقيقة من الباب للباب",
      c:T.blue, goTo:"svc:move" },
    { icon: Landmark, k:{en:"APPOINTMENT",ar:"موعد"},
      tEn:"Exhibition appointment at 5:00 PM", tAr:"موعد المعرض الساعة ٥:٠٠ م",
      sEn:"Confirmed via Visits Gateway · entry at gate B", sAr:"مؤكد عبر بوابة الزيارات — الدخول من البوابة ب",
      c:T.gold, goTo:"itinerary" },
    { icon: Sparkles, k:{en:"AFTER YOUR VISIT",ar:"بعد زيارتك"},
      tEn:"What would you like next?", tAr:"ما الذي تودّ فعله بعدها؟",
      sEn:"Coffee nearby, or head to the Haram for Maghrib — I can plan either", sAr:"قهوة قريبة، أو التوجه للحرم لصلاة المغرب — أخطط لك أياً منهما",
      c:T.emerald, goTo:"assistant" },
    { icon: Radio, k:{en:"LIVE",ar:"مباشر"},
      tEn:"Mataf calms after Maghrib", tAr:"المطاف يهدأ بعد المغرب",
      sEn:"Best tawaf window tonight: 10:15 PM", sAr:"أفضل نافذة للطواف الليلة: ١٠:١٥ م",
      c:T.goldHi, goTo:"haram" },
    { icon: Heart, k:{en:"IMPACT",ar:"أثر"},
      tEn:"40 meals distributed", tAr:"توزيع ٤٠ وجبة على المستفيدين",
      sEn:"Photos added by the verified charity", sAr:"صور جديدة من الجمعية الموثّقة",
      c:T.pink, goTo:"svc:give" },
  ];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("Your day", "يومك")} title={t("Smart notifications", "التنبيهات الذكية")}
        right={<AIChip ar="ذكاء الاستباق" en="Proactive AI" solid />} />
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "18px 24px 0" }}>
        {items.map((x, i) => (
          <button key={i} onClick={() => x.act ? x.act() : x.goTo && go(x.goTo)} className="glass" style={{ borderRadius: 20, padding: 15, display: "flex", gap: 13, alignItems: "center", textAlign: "start", border: i === 0 ? `1px solid ${T.coral}55` : undefined }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: `${x.c}1a`, border: `1px solid ${x.c}44`, flexShrink: 0 }}><x.icon size={18} color={x.c} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", color: x.c, fontWeight: 700 }}>{tt(x.k)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 3 }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2, lineHeight: 1.45 }}>{t(x.sEn, x.sAr)}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═════ SCREEN — UNIVERSAL SEARCH ═════ */
const ScreenSearch = () => {
  const { T, t, go } = useApp();
  /* ١ استخراج المفاهيم · ٢ مطابقة المجالات · ٣ النتائج */
  const ss = useSequence(3, 520);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("AI Assistant", "المساعد الذكي")} title={t("Universal search", "البحث الشامل")}
        right={<AIChip ar="ذكاء البحث الدلالي" en="Semantic Search AI" solid />} />
      <div className="glass" style={{ margin: "16px 24px 0", borderRadius: 99, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.gold}55` }}>
        <Search size={16} color={T.gold} />
        <input autoFocus placeholder={t("\u201Cquiet family restaurant near Gate 79\u201D", "«مطعم عائلي هادئ قرب باب ٧٩»")} style={{ flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, minWidth: 0 }} />
        <Mic size={15} color={T.dim} />
      </div>
      {/* فهم الاستعلام — المفاهيم المستخرجة */}
      <div style={{ margin: "14px 24px 0", borderRadius: 18, padding: 15, background: T.aiGrad, border: `1px solid ${T.ai}3d` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
          {ss < 3
            ? <span style={{ display: "flex", gap: 3 }}>{[0,1,2].map(d => (
                <span key={d} className="ag-seq" style={{ width: 4, height: 4, borderRadius: 99, background: "#6FE0BC", animation: `agDots 1.1s ${d*0.16}s infinite` }} />
              ))}</span>
            : <CheckCircle2 size={12} color="#6FE0BC" />}
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(234,246,241,.78)" }}>
            {ss < 1 ? t("READING YOUR QUERY", "قراءة استعلامك")
              : ss < 2 ? t("EXTRACTING CONCEPTS", "استخراج المفاهيم")
              : ss < 3 ? t("MATCHING SERVICE AREAS", "مطابقة مجالات الخدمة")
              : t("UNDERSTOOD", "فُهم القصد")}
          </span>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[
            { at:1, ar:"هادئ", en:"quiet" },
            { at:1, ar:"عائلي", en:"family" },
            { at:2, ar:"مطعم", en:"restaurant" },
            { at:2, ar:"قرب باب ٧٩", en:"near Gate 79" },
          ].map((c, i) => (
            <span key={i} style={{
              fontSize: 10.5, fontWeight: 600, color: "#F0D48A",
              background: "rgba(240,212,138,.14)", border: "1px solid rgba(240,212,138,.34)",
              padding: "5px 10px", borderRadius: 99,
              opacity: ss >= c.at ? 1 : 0,
              transform: ss >= c.at ? "translateY(0) scale(1)" : "translateY(6px) scale(.94)",
              transition: `opacity .38s ${i * 0.06}s, transform .38s ${i * 0.06}s cubic-bezier(.34,1.4,.5,1)`,
            }}>{t(c.en, c.ar)}</span>
          ))}
        </div>
      </div>

      <SectionTitle eyebrow={t("You searched before", "بحثت سابقاً عن")} title={t("Recent", "الأخيرة")} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 24px" }}>
        {[{ en: "wheelchair rental", ar: "تأجير كرسي متحرك" }, { en: "sukkari dates", ar: "تمر سكري" }, { en: "kids programs", ar: "برامج أطفال" }].map((s, i) => <Chip key={i} onClick={() => {}}>{t(s.en, s.ar)}</Chip>)}
      </div>
      <SectionTitle eyebrow={t("One coordinated answer", "إجابة واحدة منسّقة")} title={t("Across service areas", "عبر مجالات الخدمة")} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px",
        opacity: ss >= 3 ? 1 : 0, transform: ss >= 3 ? "translateY(0)" : "translateY(12px)",
        transition: "opacity .5s, transform .5s cubic-bezier(.22,.9,.3,1)" }}>
        {[
          { icon: Utensils, tEn: "Restaurant with a family section", tAr: "مطعم بقسم عائلي هادئ", sEn: "Matches \u201Cquiet\u201D + \u201Cfamily\u201D + 340 m from Gate 79", sAr: "يطابق «هادئ» و«عائلي» — ٣٤٠ م من باب ٧٩", c: T.coral, goTo: "svc:eat" },
          { icon: BedDouble, tEn: "Also relevant: family suites nearby", tAr: "قد يهمك: أجنحة عائلية قريبة", sEn: "Because your dates include Friday night", sAr: "لأن إقامتك تشمل ليلة الجمعة", c: T.blue, goTo: "svc:stay" },
          { icon: Compass, tEn: "Ask the assistant to compare & book", tAr: "اطلب من المساعد الذكي المقارنة والحجز", sEn: "One message completes the whole flow", sAr: "رسالة واحدة تُكمل الرحلة كاملة", c: T.gold, goTo: "assistant" },
        ].map((x, i) => (
          <button key={i} onClick={() => go(x.goTo)} className="glass" style={{ borderRadius: 20, padding: 15, display: "flex", gap: 13, alignItems: "center", textAlign: "start" }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: `${x.c}1a`, border: `1px solid ${x.c}44`, flexShrink: 0 }}><x.icon size={18} color={x.c} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2, lineHeight: 1.45 }}>{t(x.sEn, x.sAr)}</div>
            </div>
            <Fwd size={15} color={T.faint} />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═════ SCREEN — CAMERA MODE + LIVE TRANSLATION ═════ */
const ScreenCamera = () => {
  const { T, t } = useApp();
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("Point and ask", "وجّه واسأل")} title={t("Camera mode", "وضع الكاميرا")}
        right={<AIChip ar="ذكاء المحادثة ومتعدد الوسائط" en="Conversational & Multimodal AI" solid />} />
      <div style={{ margin: "16px 24px 0", borderRadius: 26, overflow: "hidden", position: "relative", height: 320, background: "linear-gradient(160deg,#1a1712,#0c0a07)", border: `1px solid ${T.gold}44` }}>
        {/* mock menu inside viewfinder */}
        <div style={{ position: "absolute", inset: 30, borderRadius: 14, background: "linear-gradient(160deg,#2a251c,#171310)", padding: 18, opacity: .9 }}>
          <div className="arabic" style={{ color: "#E8DCC0", fontSize: 17, marginBottom: 12 }}>قائمة المشويات</div>
          {["مندي لحم — ٤٨", "سليق دجاج — ٣٢", "مظبي — ٤٢"].map((l, i) => (
            <div key={i} className="arabic" style={{ color: "rgba(232,220,192,.75)", fontSize: 13.5, padding: "7px 0", borderBottom: "1px solid rgba(232,220,192,.12)" }}>{l}</div>
          ))}
        </div>
        {/* scan corners + line */}
        {[["top", "left"], ["top", "right"], ["bottom", "left"], ["bottom", "right"]].map(([v, h], i) => (
          <span key={i} style={{ position: "absolute", [v]: 16, [h]: 16, width: 26, height: 26, [`border${v[0].toUpperCase() + v.slice(1)}`]: `2.5px solid ${T.goldHi}`, [`border${h[0].toUpperCase() + h.slice(1)}`]: `2.5px solid ${T.goldHi}`, borderRadius: 4 }} />
        ))}
        <div style={{ position: "absolute", left: 20, right: 20, height: 2, background: `linear-gradient(90deg,transparent,${T.goldHi},transparent)`, boxShadow: `0 0 14px ${T.goldHi}`, animation: "imkScanLine 3.4s ease-in-out infinite" }} />
        {/* translation overlay card */}
        <div className="glass" style={{ position: "absolute", bottom: 14, insetInlineStart: 14, insetInlineEnd: 14, borderRadius: 16, padding: 13, background: T.mode === "dark" ? "rgba(10,14,24,.9)" : "rgba(255,253,246,.95)", animation: "imkEnterScale .6s .4s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <Languages size={13} color={T.gold} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: T.gold }}>{t("LIVE TRANSLATION · AR → EN", "ترجمة فورية — إنجليزي ← عربي")}</span>
          </div>
          <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.55 }}>
            {t("Grills Menu — Lamb mandi 48 · Chicken saleeg 32 · Madhbi 42 SAR", "قائمة المشويات — مندي لحم ٤٨ — سليق دجاج ٣٢ — مظبي ٤٢ ر.س")}
          </div>
          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 5 }}>{t("Saleeg is a creamy Hijazi rice dish — mild, great for kids.", "السليق طبق أرز حجازي كريمي — نكهته لطيفة ومناسب للأطفال.")}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "14px 24px 0" }}>
        {[{ l: { en: "Translate", ar: "ترجمة" }, icon: Languages }, { l: { en: "Explain", ar: "اشرح" }, icon: Sparkles }, { l: { en: "Order", ar: "اطلب" }, icon: Utensils }].map((x, i) => (
          <button key={i} className="glass" style={{ flex: 1, borderRadius: 16, padding: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: T.text, fontSize: 12.5, fontWeight: 600, border: i === 0 ? `1px solid ${T.gold}66` : undefined }}>
            <x.icon size={15} color={i === 0 ? T.gold : T.dim} /> {t(x.l.en, x.l.ar)}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: T.faint, textAlign: "center", padding: "14px 40px 0", lineHeight: 1.6 }}>
        {t("Also reads signs, landmarks, products, receipts, documents and medicine boxes.", "يقرأ أيضاً اللوحات والمعالم والمنتجات والفواتير والمستندات وعلب الأدوية.")}
      </div>
    </div>
  );
};


/* ═════════════════════════════════════════════
   خريطة مكة المكرمة — اختيار الوجهة بالدبوس
   الإحداثيات نِسَب مئوية من الصورة (قابلة للضبط)
═════════════════════════════════════════════ */
const MAP_IMG = "data:image/webp;base64,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";

/* مواقع كل غرض — x,y نسبة من الخريطة · slot يحدّد بناء اليوم */
const PLACES = {
  worship: [
    { ar:"المسجد الحرام", en:"The Grand Mosque", x:50, y:50, slot:"haram",
      d:{ar:"الصلوات في المسجد الحرام مع نافذة طواف هادئة",en:"Prayers at the Grand Mosque with a calm tawaf window"} },
    { ar:"مسجد السيدة عائشة", en:"Aisha Mosque", x:34, y:16, slot:"worship",
      d:{ar:"ميقات أهل مكة للعمرة — شمال المدينة",en:"Miqat for Umrah from Makkah — north of the city"} },
    { ar:"مسجد نمرة", en:"Namirah Mosque", x:88, y:82, slot:"worship",
      d:{ar:"في عرفات — شرق مكة المكرمة",en:"In Arafat — east of Makkah"} },
    { ar:"جامع الراجحي", en:"Al-Rajhi Mosque", x:70, y:72, slot:"worship",
      d:{ar:"جامع كبير في العوالي",en:"A large mosque in Al-Awali"} },
  ],
  culture: [
    { ar:"معرض عمارة الحرمين الشريفين", en:"Haramain Architecture Exhibition", x:57, y:59, slot:"afternoon",
      d:{ar:"موعد مؤكد عبر بوابة الزيارات",en:"Confirmed appointment via Visits Gateway"}, gateway:true },
    { ar:"متحف برج الساعة", en:"Clock Tower Museum", x:43, y:42, slot:"afternoon",
      d:{ar:"داخل أبراج البيت — يطل على الحرم",en:"Inside Abraj Al-Bait — overlooking the Haram"} },
    { ar:"متحف حرف الأولين", en:"Heritage Crafts Museum", x:30, y:33, slot:"afternoon",
      d:{ar:"حرف مكة القديمة وأدواتها",en:"Old Makkah crafts and tools"} },
    { ar:"متحف بيت الأصيل", en:"Bait Al-Aseel Museum", x:24, y:64, slot:"afternoon",
      d:{ar:"بيت تراثي يعرض حياة مكة القديمة",en:"A heritage house showing old Makkan life"} },
  ],
  knowledge: [
    { ar:"حي حراء الثقافي", en:"Hira Cultural District", x:76, y:20, slot:"morning",
      d:{ar:"عند جبل النور — معارض ومكتبة",en:"At Jabal Al-Nour — exhibitions and a library"} },
    { ar:"مكتبة الحرم المكي الشريف", en:"Grand Mosque Library", x:53, y:45, slot:"morning",
      d:{ar:"داخل نطاق المسجد الحرام",en:"Within the Grand Mosque precinct"} },
    { ar:"معرض اقرأ", en:"Iqra Exhibition", x:66, y:28, slot:"morning",
      d:{ar:"معرض تفاعلي عن الوحي والقراءة",en:"An interactive exhibition on revelation and reading"} },
    { ar:"متحف الدينار الإسلامي", en:"Islamic Dinar Museum", x:32, y:78, slot:"morning",
      d:{ar:"مقتنيات نقدية إسلامية نادرة",en:"Rare Islamic coinage collection"} },
  ],
  markets: [
    { ar:"سوق العتيبية", en:"Al-Utaybiyyah Market", x:28, y:24, slot:"evening",
      d:{ar:"سوق شعبي شمال غرب المدينة",en:"A popular market northwest of the city"} },
    { ar:"سوق الكعكية للجملة", en:"Al-Kaakiyyah Wholesale Market", x:16, y:54, slot:"evening",
      d:{ar:"أسعار الجملة والمنتجات المحلية",en:"Wholesale prices and local products"} },
    { ar:"سوق العزيزية", en:"Al-Aziziyyah Market", x:82, y:42, slot:"evening",
      d:{ar:"من أنشط أسواق مكة المكرمة",en:"Among the busiest markets in Makkah"} },
    { ar:"سوق الضيافة", en:"Al-Diyafah Market", x:72, y:62, slot:"evening",
      d:{ar:"قريب من مناطق سكن الحجاج",en:"Close to pilgrim accommodation areas"} },
  ],
  food: [
    { ar:"السفرة الحجازية", en:"Al-Sufrah Al-Hijaziyyah", x:46, y:66, slot:"evening",
      d:{ar:"مطبخ حجازي أصيل",en:"Authentic Hijazi cuisine"} },
    { ar:"مركاز الحجاز", en:"Merkaz Al-Hijaz", x:64, y:32, slot:"evening",
      d:{ar:"أطباق حجازية في أجواء تراثية",en:"Hijazi dishes in a heritage setting"} },
    { ar:"أول وتالي", en:"Awwal W Tali", x:36, y:46, slot:"evening",
      d:{ar:"مأكولات شعبية مكية",en:"Traditional Makkan food"} },
    { ar:"قادري", en:"Qadri", x:66, y:70, slot:"evening",
      d:{ar:"من أقدم مطاعم مكة المكرمة",en:"One of the oldest restaurants in Makkah"} },
  ],
};

/* قائمة منسدلة موحّدة */
const Dropdown = ({ label, value, options, onPick, icon: Icon, accent }) => {
  const { T, t, tt } = useApp();
  const [open, setOpen] = useState(false);
  const cur = options[value];
  const c = accent || T.gold;
  return (
    <div style={{ margin: "0 24px 14px", position: "relative", zIndex: open ? 30 : 1 }}>
      {label && <div style={{ fontSize: 11.5, fontWeight: 600, color: T.dim, marginBottom: 8 }}>{tt(label)}</div>}
      <button onClick={() => setOpen(!open)} className="glass" style={{
        width: "100%", borderRadius: 15, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10,
        textAlign: "start", border: `1.4px solid ${open ? c : T.line}`,
      }}>
        {Icon && <Icon size={16} color={c} style={{ flexShrink: 0 }} />}
        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: T.text, lineHeight: 1.5 }}>{tt(cur)}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", display: "grid", placeItems: "center" }}>
          <ChevronRight size={15} color={T.faint} style={{ transform: "rotate(90deg)" }} />
        </span>
      </button>

      {open && (
        <div style={{
          position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, marginTop: 6, borderRadius: 15,
          overflow: "hidden", border: `1px solid ${c}55`, animation: "imkRise .2s both",
          background: T.mode === "dark" ? "#111726" : "#FFFDF7",
          boxShadow: T.mode === "dark" ? "0 18px 44px -12px rgba(0,0,0,.85)" : "0 18px 44px -16px rgba(90,66,20,.45)",
        }}>
          {options.map((o, i) => {
            const on = value === i;
            return (
              <button key={i} onClick={() => { onPick(i); setOpen(false); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9, textAlign: "start",
                padding: "12px 14px", background: on ? `${c}1a` : "transparent",
                borderTop: i ? `1px solid ${T.line}` : "none", border: "none",
              }}>
                <span style={{
                  width: 15, height: 15, borderRadius: 99, flexShrink: 0, display: "grid", placeItems: "center",
                  border: `1.6px solid ${on ? c : T.faint}`, background: on ? c : "transparent",
                }}>{on && <CheckCircle2 size={10} color={T.ink} />}</span>
                <span style={{ fontSize: 12, color: on ? T.text : T.dim, fontWeight: on ? 600 : 400, lineHeight: 1.5, flex: 1 }}>{tt(o)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* سؤال توجيهي لكل غرض — كل جواب يقابل موقعاً بالترتيب */
const GUIDE = {
  worship: {
    q: { ar:"ما نوع الزيارة أو العبادة التي تبحث عنها؟", en:"What kind of visit or worship are you looking for?" },
    a: [
      { ar:"الصلاة والطواف في قلب مكة", en:"Prayer and tawaf in the heart of Makkah" },
      { ar:"الإحرام والاستعداد للعمرة", en:"Ihram and preparing for Umrah" },
      { ar:"زيارة موقع مرتبط بمشاعر الحج وعرفات", en:"A site tied to the Hajj rites and Arafat" },
      { ar:"الصلاة في جامع كبير وهادئ بعيداً عن المنطقة المركزية", en:"A large, quiet mosque away from the central area" },
    ],
  },
  culture: {
    q: { ar:"أي جانب من تاريخ مكة وثقافتها يهمك أكثر؟", en:"Which side of Makkah's history and culture interests you most?" },
    a: [
      { ar:"تطور عمارة الحرمين عبر التاريخ", en:"The evolution of the Haramain architecture" },
      { ar:"الوقت والفلك وقصة برج الساعة", en:"Time, astronomy and the Clock Tower story" },
      { ar:"الحرف والمهن التقليدية القديمة", en:"Traditional crafts and old trades" },
      { ar:"الحياة اليومية والبيت المكي قديماً", en:"Daily life and the old Makkan home" },
    ],
  },
  knowledge: {
    q: { ar:"ما الموضوع الذي ترغب في التعرّف عليه أكثر؟", en:"Which subject would you like to explore most?" },
    a: [
      { ar:"قصة الوحي وبدايات الرسالة", en:"The story of revelation and the early message" },
      { ar:"الكتب والمخطوطات والمعرفة الإسلامية", en:"Books, manuscripts and Islamic knowledge" },
      { ar:"القراءة والثقافة والمعرفة", en:"Reading, culture and knowledge" },
      { ar:"تاريخ العملات والاقتصاد الإسلامي", en:"Islamic coinage and economic history" },
    ],
  },
  markets: {
    q: { ar:"ما الذي تودّ شراءه؟", en:"What would you like to buy?" },
    a: [
      { ar:"ذهب وعطور وهدايا شعبية", en:"Gold, perfumes and traditional gifts" },
      { ar:"كميات كبيرة ومنتجات بأسعار الجملة", en:"Bulk quantities at wholesale prices" },
      { ar:"ملابس ومستلزمات متنوعة", en:"Clothing and general supplies" },
      { ar:"هدايا ومنتجات متنوعة في تجربة تسوق محلية", en:"Gifts and varied products in a local shopping experience" },
    ],
  },
  food: {
    q: { ar:"ما الذي تودّ تناوله؟", en:"What would you like to eat?" },
    a: [
      { ar:"وجبة حجازية عائلية متنوعة", en:"A varied Hijazi family meal" },
      { ar:"أطباق حجازية في جلسة شعبية", en:"Hijazi dishes in a traditional setting" },
      { ar:"أطباق سعودية تقليدية مثل السليق والجريش", en:"Saudi classics such as saleeg and jareesh" },
      { ar:"فطور شعبي مثل الفول والمعصوب والعريكة", en:"A traditional breakfast — foul, maasoub and areekah" },
    ],
  },
};

/* أي قائمة تُعرض حسب الغرض والتفرّع */
const placeKey = (prefs) => prefs.purpose === "local" ? (prefs.sub || "markets") : prefs.purpose;
const placeList = (prefs) => PLACES[placeKey(prefs)] || [];
const chosenPlace = (prefs) => placeList(prefs)[prefs.place] || placeList(prefs)[0];

/* خريطة بدبابيس قابلة للاختيار */
const MapPicker = ({ list, value, onPick }) => {
  const { T, t, tt } = useApp();
  /* عند تغيّر الاختيار: ٠ تقييم المرشّحين · ١ استقرار الوجهة */
  const [phase, setPhase] = useState(1);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(1); return; }
    setPhase(0);
    const id = setTimeout(() => setPhase(1), 620);
    return () => clearTimeout(id);
  }, [value, list]);
  return (
    <div style={{ margin: "0 24px", borderRadius: 20, overflow: "hidden", position: "relative",
      border: `1px solid ${T.line}`, boxShadow: T.mode === "dark" ? "none" : "0 8px 24px -14px rgba(90,66,20,.35)" }}>
      <img src={MAP_IMG} alt="" style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }} />
      {/* تعتيم خفيف ليبرز الدبوس */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,40,31,.10), rgba(8,40,31,.28))" }} />

      {/* حلقة تقييم حول الوجهة المستنتجة */}
      {phase === 0 && list[value] && (
        <span style={{ position: "absolute", left: `${list[value].x}%`, top: `${list[value].y}%`,
          transform: "translate(-50%,-50%)", width: 54, height: 54, borderRadius: 99,
          border: `1.5px solid ${T.gold}`, animation: "agHalo .62s ease-out", pointerEvents: "none", zIndex: 4 }} />
      )}
      {list.map((p, i) => {
        const on = value === i;
        const evaluating = phase === 0;
        return (
          <button key={i} onClick={() => onPick(i)}
            style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-100%)",
              background: "none", border: "none", padding: 0, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, zIndex: on ? 5 : 2,
              opacity: evaluating && !on ? 0.38 : 1,
              transition: "opacity .42s cubic-bezier(.22,.9,.3,1)" }}>
            {/* اسم الموقع */}
            <span style={{
              fontSize: 9, fontWeight: 700, whiteSpace: "nowrap", padding: "4px 8px", borderRadius: 99,
              background: on ? T.goldGrad : "rgba(10,46,36,.88)",
              color: on ? T.ink : "#EAF6F1",
              border: `1px solid ${on ? "transparent" : "rgba(234,246,241,.28)"}`,
              boxShadow: "0 2px 8px rgba(0,0,0,.3)",
              transform: on && phase === 1 ? "scale(1)" : on ? "scale(.92)" : "scale(1)",
              transition: "transform .38s cubic-bezier(.22,.9,.3,1)",
            }}>{tt(p)}</span>
            {/* الدبوس */}
            <span style={{ position: "relative", display: "block", width: on ? 20 : 15, height: on ? 20 : 15,
              transform: on && phase === 1 ? "scale(1)" : "scale(.88)", transition: "transform .4s cubic-bezier(.34,1.4,.5,1)" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)", background: on ? T.goldGrad : "#0E4A38",
                border: `1.5px solid ${on ? "#fff" : "rgba(234,246,241,.6)"}`,
                boxShadow: on ? `0 0 0 5px ${T.gold}33` : "0 2px 6px rgba(0,0,0,.35)" }} />
            </span>
          </button>
        );
      })}

      {/* وسم الخريطة */}
      <span style={{ position: "absolute", bottom: 8, insetInlineStart: 10, fontSize: 8.5, fontWeight: 600,
        color: "rgba(255,255,255,.75)", background: "rgba(8,40,31,.55)", padding: "3px 8px", borderRadius: 99 }}>
        {t("Makkah Al-Mukarramah", "مكة المكرمة")}
      </span>
    </div>
  );
};

/* ═════════════════════════════════════════════
   خصّص يومك — النظام يقترح، والمستخدم يعدّل ويعتمد
   (الإشراف البشري والموافقة — إطار الحوكمة)
═════════════════════════════════════════════ */

/* أغراض الزيارة ← الوجهة المستنتجة */
const PURPOSES = [
  { id:"worship", en:"Worship", ar:"عبادة ونسك",
    dest:{en:"The Grand Mosque",ar:"المسجد الحرام"}, icon: Moon, c:"emerald" },
  { id:"culture", en:"Cultural visit", ar:"زيارة ثقافية",
    dest:{en:"Haramain Architecture Exhibition",ar:"معرض عمارة الحرمين الشريفين"}, icon: Landmark, c:"gold" },
  { id:"knowledge", en:"Knowledge", ar:"معرفة وتعلّم",
    dest:{en:"Hira Cultural District",ar:"حي حراء الثقافي"}, icon: BookOpen, c:"blue" },
  { id:"local", en:"Local experience", ar:"تجربة محلية",
    dest:{en:"Historic markets",ar:"الأسواق التاريخية"}, icon: ShoppingBag, c:"coral" },
];

const OptionRow = ({ label, options, value, onPick, suggested }) => {
  const { T, t, tt } = useApp();
  return (
    <div style={{ margin: "0 24px 18px" }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: T.dim, marginBottom: 9 }}>{tt(label)}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button key={o.id} onClick={() => onPick(o.id)} style={{
              position: "relative", padding: "11px 15px", borderRadius: 14, fontSize: 12.5, fontWeight: 600,
              background: on ? T.goldGrad : "transparent",
              border: `1px solid ${on ? "transparent" : T.line}`,
              color: on ? T.ink : T.dim,
            }}>
              {tt(o)}
              {suggested === o.id && !on && (
                <span style={{ position: "absolute", top: -8, insetInlineEnd: 6, fontSize: 8.5, fontWeight: 700,
                  color: T.gold, background: T.bg2, border: `1px solid ${T.gold}66`, padding: "2px 6px", borderRadius: 99 }}>
                  {t("suggested", "مقترح")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ScreenCustomize = () => {
  const { T, t, tt, go, prefs, setPrefs, runMorph } = useApp();
  const set = (k, v) => setPrefs({ ...prefs, [k]: v });
  const purpose = PURPOSES.find((p) => p.id === prefs.purpose);
  const P = chosenPlace(prefs);

  return (
    <div className="screen" style={{ paddingBottom: 122 }}>
      <BackHeader eyebrow={t("Before you set out", "قبل أن تبدأ")} title={t("Personalize your day", "خصّص يومك")}
        right={<AIChip ar="ذكاء التخصيص الاستباقي" en="Proactive Personalization AI" />} />
      <div style={{ height: 14 }} />

      <Dropdown
        label={{ en:"Purpose of your visit today", ar:"غرض زيارتك اليوم" }}
        value={PURPOSES.findIndex((x) => x.id === prefs.purpose)}
        options={PURPOSES}
        icon={purpose.icon}
        accent={T[purpose.c]}
        onPick={(i) => setPrefs({ ...prefs, purpose: PURPOSES[i].id, place: 0 })}
      />

      {/* تفرّع التجربة المحلية */}
      {prefs.purpose === "local" && (
        <div style={{ display: "flex", gap: 9, margin: "16px 24px 0" }}>
          {[{ id:"markets", ar:"الأسواق المحلية", en:"Local markets", icon: ShoppingBag },
            { id:"food", ar:"المطاعم المحلية", en:"Local restaurants", icon: Utensils }].map((x) => {
            const on = (prefs.sub || "markets") === x.id;
            return (
              <button key={x.id} onClick={() => setPrefs({ ...prefs, sub: x.id, place: 0 })} style={{
                flex: 1, padding: "12px 10px", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: on ? `${T.coral}1f` : "transparent", border: `1.4px solid ${on ? T.coral : T.line}`,
              }}>
                <x.icon size={16} color={on ? T.coral : T.faint} />
                <span style={{ fontSize: 12, fontWeight: 600, color: on ? T.text : T.dim }}>{t(x.en, x.ar)}</span>
              </button>
            );
          })}
        </div>
      )}

      {(() => {
        const g = GUIDE[placeKey(prefs)];
        if (!g) return null;
        return (
          <Dropdown
            label={g.q}
            value={prefs.place}
            options={g.a}
            icon={HelpCircle}
            onPick={(i) => set("place", i)}
          />
        );
      })()}

      {/* الخريطة — تتحرك مع الجواب ويمكن تعديلها يدوياً */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "18px 24px 9px" }}>
        <MapPin size={14} color={T.gold} />
        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.dim, flex: 1 }}>{t("Or adjust it on the map", "أو عدّلها من الخريطة")}</span>
        <AIChip ar="ذكاء التحليل المكاني" en="Geospatial AI" />
      </div>
      <MapPicker list={placeList(prefs)} value={prefs.place} onPick={(i) => set("place", i)} />
      <div className="glass" style={{ margin: "10px 24px 0", borderRadius: 14, padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, border: `1px solid ${T.gold}66` }}>
        <CheckCircle2 size={14} color={T.gold} />
        <span style={{ fontSize: 11, color: T.dim }}>{t("Destination:", "الوجهة:")}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.text, flex: 1 }}>
          {tt(P)}
        </span>
      </div>

      <div className="hairline" style={{ margin: "20px 24px" }} />

      <OptionRow label={{en:"Who is with you",ar:"المرافقون"}} value={prefs.party} suggested="solo"
        onPick={(v) => set("party", v)}
        options={[{id:"solo",en:"On my own",ar:"بمفردي"},{id:"family",en:"Family",ar:"عائلة"},{id:"group",en:"Group",ar:"مجموعة"}]} />

      {/* العدد — كشف تدريجي: يظهر عند الحاجة فقط */}
      {prefs.party !== "solo" && (
        <div className="glass" style={{ margin: "-6px 24px 18px", borderRadius: 16, padding: 13, display: "flex", alignItems: "center", justifyContent: "space-between", animation: "imkEnterScale .35s both" }}>
          <span style={{ fontSize: 12.5, color: T.text }}>{t("Number of people", "عدد الأشخاص")}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => set("count", Math.max(2, prefs.count - 1))} aria-label="-" className="glass" style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center" }}><Minus size={13} color={T.dim} /></button>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text, minWidth: 16, textAlign: "center" }}>{t(prefs.count, toAr(prefs.count))}</span>
            <button onClick={() => set("count", Math.min(9, prefs.count + 1))} aria-label="+" className="glass" style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center" }}><Plus size={13} color={T.dim} /></button>
          </div>
        </div>
      )}

      <OptionRow label={{en:"Budget",ar:"الميزانية"}} value={prefs.budget} suggested="mid"
        onPick={(v) => set("budget", v)}
        options={[{id:"low",en:"Economy",ar:"اقتصادية"},{id:"mid",en:"Moderate",ar:"متوسطة"},{id:"high",en:"Premium",ar:"مرتفعة"}]} />

      {/* الوصول الشامل */}
      <button onClick={() => set("access", !prefs.access)} className="glass" style={{ margin: "0 24px", width: "calc(100% - 48px)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12, textAlign: "start", border: prefs.access ? `1px solid ${T.purple}66` : undefined }}>
        <Accessibility size={17} color={prefs.access ? T.purple : T.faint} />
        <span style={{ fontSize: 12.5, color: T.text, flex: 1, lineHeight: 1.4 }}>{t("Step-free route for elderly and people with disabilities", "مسار ميسّر لكبار السن وذوي الإعاقة")}</span>
        <span style={{ width: 42, height: 25, borderRadius: 99, background: prefs.access ? T.goldGrad : T.line, position: "relative", flexShrink: 0 }}>
          <span style={{ position: "absolute", top: 3, insetInlineStart: prefs.access ? 20 : 3, width: 19, height: 19, borderRadius: 99, background: prefs.access ? T.ink : T.bg2, transition: "all .2s" }} />
        </span>
      </button>

      {/* أثر الاختيار مباشرةً — النقل والتكلفة */}
      {(() => {
        const fam = prefs.party !== "solo";
        const r = prefs.budget === "high"
          ? { n:{en:"Private transfer",ar:"نقل خاص"}, d:{en:"14 min",ar:"١٤ دقيقة"}, cost:120, icon: Car, c:T.gold }
          : (fam || prefs.budget === "mid")
            ? { n:{en:"Makkah Taxi",ar:"أجرة مكة"}, d: fam ? {en:"19 min — family seating",ar:"١٩ دقيقة — مقاعد عائلية"} : {en:"19 min",ar:"١٩ دقيقة"}, cost:34, icon: Car, c:T.gold }
            : { n:{en:"Makkah Buses",ar:"حافلات مكة"}, d:{en:"28 min",ar:"٢٨ دقيقة"}, cost:4, icon: Bus, c:T.emerald };
        const total = prefs.budget === "high" ? r.cost : r.cost + (fam ? 25 : 0);
        const key = prefs.party + prefs.budget + prefs.count;
        return (
          <div className="glass" style={{ margin: "18px 24px 0", borderRadius: 16, padding: "13px 15px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${T.line}` }}>
            <r.icon size={15} color={r.c} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <SwapValue k={key + "n"} size={12} color={T.text} weight={600}>{tt(r.n)}</SwapValue>
              <span style={{ display: "block", fontSize: 10, color: T.faint, marginTop: 2 }}>
                <SwapValue k={key + "d"} size={10} color={T.faint} weight={400}>{tt(r.d)}</SwapValue>
              </span>
            </span>
            <SwapValue k={key + "c"} size={13} color={T.text}>
              {t(`${total} SAR`, `${toAr(total)} ر.س`)}
            </SwapValue>
          </div>
        );
      })()}

      <button onClick={() => go("composing")} style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", padding: 16, borderRadius: 18, border: "none", background: T.goldGrad, color: T.ink, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 30px ${T.gold}59` }}>
        <Sparkles size={16} /> {t("Compose my day", "نسّق خطة يومي")}
      </button>
    </div>
  );
};

/* ═════ لحظة التنسيق — اللقطة البطلة ═════ */
const ScreenComposing = () => {
  const { T, t, tt, go, prefs, runMorph } = useApp();
  const [step, setStep] = useState(0);
  const P = chosenPlace(prefs);

  const steps = [
    { ar:"بوابة الزيارات", en:"Visits Gateway", d:{ar:"قراءة موعدك المؤكد",en:"Reading your confirmed appointment"}, icon: Landmark, skip: !P.gateway },
    { ar:"مواقيت الصلاة", en:"Prayer times", d:{ar:"مطابقة أوقات اليوم",en:"Matching today's times"}, icon: Moon },
    { ar:"حافلات مكة", en:"Makkah Buses", d:{ar:"حساب زمن الرحلة",en:"Calculating travel time"}, icon: Bus },
    { ar:"تنسيق الرحلات الذكي", en:"Journey Orchestration", d:{ar:"بناء خطة يومك",en:"Composing your day"}, icon: Sparkles },
  ].filter(s => !s.skip);

  useEffect(() => {
    if (step < steps.length) {
      const id = setTimeout(() => setStep(step + 1), 780);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      const ax = document.querySelector("[data-compose-axis]");
      let from = null;
      if (ax) {
        const host = document.querySelector("[data-phone-screen]");
        if (host) {
          const h = host.getBoundingClientRect(), r = ax.getBoundingClientRect();
          const cx = r.left + r.width / 2 - h.left;
          const y1 = r.top - h.top, y2 = r.bottom - h.top;
          from = { H: h.width, V: h.height, ax1: cx, ay1: y1, ax2: cx, ay2: y2,
            pts: [0,1,2,3,4].map((i) => ({ x: cx, y: y1 + ((y2 - y1) * (i + 0.5)) / 5 })) };
        }
      }
      runMorph({ kind: "journey", from, target: "[data-morph-target='timeline']" }, () => go("itinerary"));
    }, 700);
    return () => clearTimeout(id);
  }, [step]);

  return (
    <div className="screen" style={{
      position: "absolute", inset: 0, background: T.aiGrad,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 34px", textAlign: "center", overflow: "hidden",
    }}>
      {/* هالة خلفية */}
      <div style={{ position: "absolute", top: "22%", width: 320, height: 320, borderRadius: 99,
        background: "radial-gradient(circle, rgba(79,207,166,.18), transparent 68%)" }} />

      <div style={{ position: "relative" }}>
        <AgentAvatar size={82} />
        <span style={{ position: "absolute", inset: -12, borderRadius: 99, border: "1px solid rgba(79,207,166,.45)", animation: "imkPulseRing 2.4s ease-out infinite", pointerEvents: "none" }} />
      </div>

      <div className="display" style={{ fontSize: 21, color: "#F6F1E3", marginTop: 22, position: "relative" }}>
        {t("Composing your day", "جارٍ تنسيق يومك")}
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(234,246,241,.6)", marginTop: 6, position: "relative" }}>
        {tt(P)}
      </div>

      <div style={{ marginTop: 30, width: "100%", display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
        {/* خيط يصل المصادر ببعضها */}
        <span style={{ position: "absolute", insetInlineStart: 29, top: 24, bottom: 24, width: 1.5, borderRadius: 99,
          background: `linear-gradient(180deg, #4FCFA6 ${Math.min(100, (step / steps.length) * 100)}%, rgba(234,246,241,.12) ${Math.min(100, (step / steps.length) * 100)}%)`,
          transition: "background .5s linear" }} />
        {steps.map((s, i) => {
          const done = i < step, now = i === step;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 14,
              background: now ? "rgba(255,255,255,.09)" : done ? "rgba(255,255,255,.045)" : "transparent",
              border: `1px solid ${now ? "rgba(79,207,166,.45)" : done ? "rgba(234,246,241,.1)" : "transparent"}`,
              opacity: done || now ? 1 : 0.26,
              transition: "all .4s cubic-bezier(.22,.9,.3,1)",
              position: "relative", overflow: "hidden",
            }}>
              {now && <span className="ai-shimmer" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />}
              <span style={{
                width: 30, height: 30, borderRadius: 10, flexShrink: 0, display: "grid", placeItems: "center",
                background: done ? "rgba(79,207,166,.9)" : "rgba(255,255,255,.08)",
                border: `1px solid ${done ? "transparent" : "rgba(234,246,241,.18)"}`,
              }}>
                {done ? <CheckCircle2 size={15} color="#0A2E24" /> : <s.icon size={14} color={now ? "#4FCFA6" : "rgba(234,246,241,.5)"} />}
              </span>
              <div style={{ flex: 1, textAlign: "start", position: "relative" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F6F1E3", lineHeight: 1.3 }}>{t(s.en, s.ar)}</div>
                <div style={{ fontSize: 10, color: "rgba(234,246,241,.55)", marginTop: 2 }}>{tt(s.d)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* المصادر تنساب إلى محور رأسي — يصير هو الخط الزمني */}
      {step >= steps.length && !wantsStill() && (
        <svg viewBox="0 0 300 190" aria-hidden="true"
          style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 54, width: "100%", height: 190, pointerEvents: "none" }}>
          {[0, 1, 2, 3].map((i) => {
            const y = 22 + i * 42;
            return <FlowPath key={i} d={`M40,${y} C118,${y} 130,96 150,96`} color="#4FCFA6" width={1.3}
              dur={520} delay={i * 90} glow opacity={.7} />;
          })}
          <FlowPath d="M150,18 L150,174" color="#F0D48A" width={2.2} dur={640} delay={420} glow />
          <line data-compose-axis x1="150" y1="18" x2="150" y2="174" stroke="none" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx="150" cy={18 + i * 39} r="3.4" fill="#F0D48A" opacity="0"
              style={{ animation: `agTick .4s ${560 + i * 70}ms forwards` }} />
          ))}
        </svg>
      )}

      <div style={{ marginTop: 20, minHeight: 34, position: "relative", textAlign: "center" }}>
        {step >= steps.length ? (
          <div className="ag-seq" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 99,
            background: "rgba(79,207,166,.14)", border: "1px solid rgba(79,207,166,.4)", animation: "agRise .45s both" }}>
            <CheckCircle2 size={13} color="#6FE0BC" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#EAF6F1" }}>
              {t("Signals resolved into one plan", "اجتمعت المصادر في خطة واحدة")}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: "rgba(234,246,241,.45)", lineHeight: 1.6 }}>
            {t("Coordinating across existing platforms — without replacing them.",
               "تنسيق عبر الأنظمة القائمة دون استبدالها.")}
          </span>
        )}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   خطة اليوم — رحلة المستفيد كاملة في شاشة واحدة
   الخطوات الخمس مطابقة لشريحة "كيف يحوّل EyeMakkah رحلة المستفيد؟"
═════════════════════════════════════════════ */

/* وسم المنصة المصدر — يترجم رسالة "التنسيق لا الاستبدال" */
const ViaPlatform = ({ ar, en }) => {
  const { T, t } = useApp();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 600,
      color: T.dim, background: T.mode === "dark" ? "rgba(255,255,255,.05)" : "rgba(36,27,11,.045)",
      border: `1px solid ${T.line}`, padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>
      <Share2 size={9} /> {t("via " + en, "عبر " + ar)}
    </span>
  );
};

/* رأس خطوة — يحمل رقمها واسم القدرة الذكية كما في العرض */
const StepMark = ({ n, cap, capEn }) => {
  const { T, t } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "22px 24px 10px" }}>
      <span style={{ width: 24, height: 24, borderRadius: 99, flexShrink: 0, display: "grid", placeItems: "center",
        background: T.goldGrad, color: T.ink, fontSize: 11, fontWeight: 800 }}>{t(String(n), toAr(n))}</span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: T.gold }}>{t(capEn, cap)}</span>
      <span style={{ flex: 1, height: 1, background: T.line }} />
    </div>
  );
};

const ScreenItinerary = () => {
  const { T, t, tt, go, replan, setReplan, prefs } = useApp();
  const [okMsg, setOkMsg] = useState(null);
  useEffect(() => {
    if (!okMsg) return;
    const id = setTimeout(() => setOkMsg(null), 2500);
    return () => clearTimeout(id);
  }, [okMsg]);
  /* مراحل إعادة التخطيط: ١ مسح · ٢ إزاحة · ٣ تأكيد */
  const rp = useSequence(3, 620, replan);
  const purpose = PURPOSES.find((p) => p.id === prefs.purpose);
  const fam = prefs.party !== "solo";
  const n = fam ? prefs.count : 1;

  /* وسيلة النقل تُشتق من الميزانية وعدد المرافقين */
  const ride = (() => {
    if (prefs.budget === "high") return { n:{en:"Private transfer",ar:"نقل خاص"}, d:{en:"14 min — direct to the gate",ar:"١٤ دقيقة — وصول مباشر للبوابة"}, cost: 120, icon: Car, c:T.gold };
    if (fam || prefs.budget === "mid") return { n:{en:"Makkah Taxi",ar:"أجرة مكة"}, d: fam ? {en:"19 min — family seating",ar:"١٩ دقيقة — مقاعد عائلية"} : {en:"19 min",ar:"١٩ دقيقة"}, cost: 34, icon: Car, c:T.gold };
    return { n:{en:"Makkah Buses",ar:"حافلات مكة"}, d:{en:"28 min",ar:"٢٨ دقيقة"}, cost: 4, icon: Bus, c:T.emerald };
  })();
  const total = prefs.budget === "high" ? ride.cost : ride.cost * (fam ? 1 : 1) + (fam ? 25 : 0);

  /* محطات اليوم تُبنى حول الموقع المختار وموعده */
  const P = chosenPlace(prefs);
  const PR = {
    dhuhr:   { tm:{en:"12:19 PM",ar:"١٢:١٩ م"}, w:{en:"Dhuhr",ar:"صلاة الظهر"}, c:T.emerald, tag:{en:"Prayer",ar:"صلاة"} },
    asr:     { tm:{en:"3:46 PM",ar:"٣:٤٦ م"},  w:{en:"Asr",ar:"صلاة العصر"},  c:T.emerald, tag:{en:"Prayer",ar:"صلاة"} },
    maghrib: { tm:{en:"6:32 PM",ar:"٦:٣٢ م"},  w:{en:"Maghrib at the Grand Mosque",ar:"المغرب في المسجد الحرام"},
               s:{en:"King Abdulaziz Gate",ar:"باب الملك عبدالعزيز"}, c:T.goldHi, tag:{en:"Prayer",ar:"صلاة"} },
  };
  const nearby = { en:"Nearest mosque to you", ar:"أقرب مسجد إليك" };
  const dep = (tm1, tm2) => ({
    tm:tm1, tm2, w:{en:"Departure time",ar:"وقت التحرك"}, s:{...ride.d},
    s2:{en:"Congestion ahead — advanced 15 min",ar:"ازدحام في الطريق — تقديم ١٥ دقيقة"},
    c:ride.c, tag:{en:"Departure",ar:"تحرّك"}, shifts:true,
  });
  const visit = (tm) => ({
    tm, w:{en:P.en,ar:P.ar}, s:{...P.d}, c:T.gold,
    tag: P.gateway ? {en:"Appointment",ar:"موعد"} : {en:"Visit",ar:"زيارة"}, anchor:true,
  });

  let base;
  if (P.slot === "haram") {
    base = [
      { ...PR.dhuhr, w:{en:"Dhuhr at the Grand Mosque",ar:"الظهر في المسجد الحرام"}, s:{en:"Recommended entry — King Abdulaziz Gate",ar:"الدخول المقترح — باب الملك عبدالعزيز"} },
      { tm:{en:"2:00 PM",ar:"٢:٠٠ م"}, w:{en:"Rest and Zamzam",ar:"استراحة وماء زمزم"}, s:{en:"Ground level — less crowded",ar:"الدور الأرضي — أقل ازدحاماً"}, c:T.blue, tag:{en:"Rest",ar:"استراحة"} },
      { ...PR.asr, w:{en:"Asr at the Grand Mosque",ar:"العصر في المسجد الحرام"}, s:{en:"Stay in place",ar:"البقاء في مكانك"} },
      { ...PR.maghrib, s:{en:"Calmer window afterwards",ar:"نافذة أهدأ بعدها"} },
      { tm:{en:"8:15 PM",ar:"٨:١٥ م"}, w:{en:"Tawaf — calm window",ar:"الطواف — نافذة هادئة"}, s:{en:"Electric cart available",ar:"عربة كهربائية متاحة"}, c:T.gold, tag:{en:"Live",ar:"مباشر"}, anchor:true },
    ];
  } else if (P.slot === "worship") {
    base = [
      dep({en:"11:35 AM",ar:"١١:٣٥ ص"}, {en:"11:20 AM",ar:"١١:٢٠ ص"}),
      { ...PR.dhuhr, w:{en:`Dhuhr — ${P.en}`,ar:`الظهر — ${P.ar}`}, s:{...P.d}, anchor:true },
      { tm:{en:"2:00 PM",ar:"٢:٠٠ م"}, w:{en:"Rest nearby",ar:"استراحة قريبة"}, s:{en:"Shaded seating",ar:"جلسة مظللة"}, c:T.blue, tag:{en:"Rest",ar:"استراحة"} },
      { ...PR.asr, s:{...P.d} },
      PR.maghrib,
    ];
  } else if (P.slot === "morning") {
    base = [
      dep({en:"9:30 AM",ar:"٩:٣٠ ص"}, {en:"9:15 AM",ar:"٩:١٥ ص"}),
      visit({en:"10:15 AM",ar:"١٠:١٥ ص"}),
      { ...PR.dhuhr, s:{...nearby} },
      { ...PR.asr, s:{en:"Before returning",ar:"قبل العودة"} },
      PR.maghrib,
    ];
  } else if (P.slot === "afternoon") {
    base = [
      { ...PR.dhuhr, s:{...nearby} },
      { ...PR.asr, s:{en:"Before you set out",ar:"قبل التحرك"} },
      dep({en:"4:20 PM",ar:"٤:٢٠ م"}, {en:"4:05 PM",ar:"٤:٠٥ م"}),
      visit({en:"5:00 PM",ar:"٥:٠٠ م"}),
      PR.maghrib,
    ];
  } else {
    base = [
      { ...PR.dhuhr, s:{...nearby} },
      { ...PR.asr, s:{...nearby} },
      { ...PR.maghrib, s:{en:"Before heading out",ar:"قبل الخروج"} },
      dep({en:"7:40 PM",ar:"٧:٤٠ م"}, {en:"7:25 PM",ar:"٧:٢٥ م"}),
      visit({en:"8:10 PM",ar:"٨:١٠ م"}),
    ];
  }

  const stops = [...base];
  if (fam) stops.splice(stops.length - 1, 0, {
    tm:{en:"6:00 PM",ar:"٦:٠٠ م"}, w:{en:"Family break",ar:"استراحة عائلية"},
    s:{en:"Family section — nearby",ar:"قسم عائلي — قريب"}, c:T.coral, tag:{en:"Added",ar:"مُضاف"}, because:{en:"family",ar:"عائلة"} });

  const chips = [
    tt(purpose),
    fam ? t(`${prefs.count} people`, `${toAr(prefs.count)} أفراد`) : t("On my own", "بمفردي"),
    { low:t("Economy","اقتصادية"), mid:t("Moderate","متوسطة"), high:t("Premium","مرتفعة") }[prefs.budget],
    ...(prefs.access ? [t("Step-free","مسار ميسّر")] : []),
  ];

  return (
    <div className="screen" style={{ paddingBottom: 122 }}>
      <BackHeader eyebrow={t("Today in Makkah", "يومك في مكة")} title={t("My day", "خطة اليوم")}
        right={<AIChip ar="ذكاء تنسيق الرحلات" en="Journey Orchestration AI" solid />} />

      {/* ملخّص التخصيص — يثبت أن الاختيارات وصلت */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center", padding: "12px 24px 0" }}>
        {chips.map((c, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 600, color: T.gold, background: `${T.gold}14`, border: `1px solid ${T.gold}44`, padding: "5px 10px", borderRadius: 99 }}>{c}</span>
        ))}
        <button onClick={() => go("customize")} style={{ marginInlineStart: "auto", background: "none", border: "none", color: T.dim, fontSize: 10.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
          {t("Edit", "تعديل")} <Fwd size={11} color={T.dim} />
        </button>
      </div>

      {/* الوجهة */}
      <div className="glass" style={{ margin: "14px 24px 0", borderRadius: 20, padding: 16, border: `1px solid ${T[purpose.c]}66`, display: "flex", gap: 13, alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: 15, display: "grid", placeItems: "center", background: `${T[purpose.c]}1f`, border: `1px solid ${T[purpose.c]}55`, flexShrink: 0 }}>
          <purpose.icon size={20} color={T[purpose.c]} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9.5, letterSpacing: "0.1em", color: T[purpose.c], fontWeight: 700 }}>{t("DESTINATION", "الوجهة")}</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text, marginTop: 3, lineHeight: 1.35 }}>
            {tt(P)}
          </div>
          {prefs.purpose === "culture" && <div style={{ marginTop: 8 }}><ViaPlatform ar="بوابة الزيارات" en="Visits Gateway" /></div>}
          <DecisionReason
            ar={P.gateway
              ? "بُنيت الخطة حول الموعد، ومواقيت الصلاة، وحالة الطريق."
              : "بُنيت الخطة حول مواقيت الصلاة، وحالة الطريق، ووقت الوجهة."}
            en={P.gateway
              ? "This plan was built around your appointment, prayer times and road conditions."
              : "This plan was built around prayer times, road conditions and the destination's timing."}
            whyAr={`بناءً على اختيار «${tt(purpose)}»، رُتّبت الوجهة والمحطات حولها، ثم ثُبّتت أوقات الصلاة، وحُسب زمن التنقّل عبر ${tt(ride.d)}.`}
            whyEn={`Based on the "${tt(purpose)}" selection, the destination and stops were arranged around it, prayer times were fixed, and travel duration was calculated via ${tt(ride.d)}.`} />
        </div>
      </div>

      {/* التحديث الاستباقي */}
      {replan ? (
        <div style={{ margin: "14px 24px 0", borderRadius: 18, padding: 15, background: `linear-gradient(120deg,${T.coral}22,${T.coral}0d)`, border: `1px solid ${T.coral}66`, display: "flex", gap: 11, alignItems: "flex-start", animation: "imkEnterScale .45s both" }}>
          <AlertTriangle size={16} color={T.coral} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 7, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <AIChip ar="ذكاء الاستباق" en="Proactive AI" />
              {rp < 3 && <Thinking label={t(rp < 1 ? "Scanning your timeline" : "Recalculating", rp < 1 ? "مسح مسار يومك" : "إعادة الحساب")} />}
            </div>
            <div style={{ position: "relative", minHeight: 58 }}>
            {rp < 3 && (
              <div className="ag-seq" style={{ position: "absolute", inset: 0, fontSize: 11.5, color: T.dim, lineHeight: 1.7, animation: "imkEnter .3s both" }}>
                {rp < 1
                  ? t("Checking which stops are affected…", "فحص المحطات المتأثرة…")
                  : rp < 2
                    ? t("Fixed commitments held in place…", "تثبيت الالتزامات الثابتة…")
                    : t("Shifting departure time…", "إزاحة وقت التحرك…")}
              </div>
            )}
            <Step at={3} now={rp}>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>
              {t("Congestion detected. Departure advanced by 15 minutes — the rest of your day is unaffected.",
                 "رُصد ازدحام على طريقك. قُدّم وقت التحرك ١٥ دقيقة — وبقية يومك لم تتأثر.")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 10.5, color: T.emerald, fontWeight: 600 }}>
              <span className="ag-seq" style={{ display: "grid", placeItems: "center", animation: "agTick .5s both" }}><Lock size={11} /></span>
              {t("Your appointment is protected", "موعدك محميّ ولم يتغيّر")}
            </div>
            </Step>
            </div>
            <button onClick={() => { setReplan(false); setOkMsg("revert"); }} style={{ marginTop: 9, padding: "7px 13px", borderRadius: 99, border: `1px solid ${T.coral}66`, background: "transparent", color: T.coral, fontSize: 10.5, fontWeight: 700 }}>
              {t("Show original plan", "اعرض الخطة الأصلية")}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setReplan(true)} className="glass" style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", borderRadius: 18, padding: 14, display: "flex", gap: 11, alignItems: "center", textAlign: "start", border: `1px solid ${T.coral}55` }}>
          <AlertTriangle size={16} color={T.coral} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{t("Traffic delay on the route", "تأخر في الطريق")}</div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{t("See how the plan updates itself", "شاهد كيف تُحدّث الخطة نفسها")}</div>
          </div>
          <Fwd size={14} color={T.coral} />
        </button>
      )}

      {/* المسار */}
      <div style={{ margin: "16px 24px 0", position: "relative", paddingInlineStart: 26 }}>
        {/* الخط القديم يضعف ثم يُرسم مسار جديد مكانه */}
        {replan && !wantsStill() ? (
          <svg viewBox="0 0 18 400" preserveAspectRatio="none" aria-hidden="true"
            style={{ position: "absolute", insetInlineStart: 2, top: 12, bottom: 12, width: 18, pointerEvents: "none" }}>
            <path d="M9,0 L9,400" fill="none" stroke={T.faint} strokeWidth="2" strokeLinecap="round"
              style={{ animation: "routeFade .7s .55s forwards", opacity: .5 }} />
            {rp >= 2 && (
              <path d="M9,0 C9,120 15,150 9,190 C3,230 9,260 9,400" fill="none" stroke={T.coral} strokeWidth="2.4" strokeLinecap="round"
                strokeDasharray="430" strokeDashoffset="430"
                style={{ animation: "agDraw .85s cubic-bezier(.22,.9,.3,1) forwards" }} />
            )}
          </svg>
        ) : (
          <span data-morph-target="timeline" style={{ position: "absolute", insetInlineStart: 8, top: 12, bottom: 12, width: 2, background: `linear-gradient(180deg,${T.emerald},${T[purpose.c]},${T.goldHi})`, borderRadius: 99, opacity: .5 }} />
        )}
        {stops.map((x, i) => {
          const ch = replan && x.shifts;
          return (
            <div key={i} className="glass" style={{ borderRadius: 18, padding: 14, marginBottom: 10, position: "relative", overflow: "hidden",
              border: x.anchor ? `1px solid ${T.gold}66` : ch && rp >= 2 ? `1px solid ${T.coral}66` : x.because ? `1px solid ${T.coral}44` : undefined,
              transition: "border-color .4s" }}>
              {/* شعاع المسح يمرّ على المحطات المتحرّكة */}
              {replan && rp === 1 && x.shifts && (
                <span className="ag-scan" style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, height: "46%",
                  background: `linear-gradient(180deg, transparent, ${T.coral}2e, transparent)`,
                  animation: "agScan 1.05s ease-in-out", pointerEvents: "none" }} />
              )}
              {/* الثوابت تبقى مثبّتة بعلامة ظاهرة */}
              {replan && rp >= 1 && !x.shifts && (
                <span style={{ position: "absolute", insetInlineEnd: 12, bottom: 11, display: "flex", alignItems: "center", gap: 4,
                  fontSize: 8.5, fontWeight: 700, color: T.emerald, opacity: rp >= 2 ? 1 : 0, transition: "opacity .45s" }}>
                  <Lock size={9} /> {t("fixed", "ثابت")}
                </span>
              )}
              <span style={{ position: "absolute", insetInlineStart: -23, top: 18, width: x.anchor ? 12 : 9, height: x.anchor ? 12 : 9, borderRadius: 99,
                background: replan && x.shifts && rp >= 2 ? T.coral : x.c,
                boxShadow: `0 0 9px ${replan && x.shifts && rp >= 2 ? T.coral : x.c}`,
                transform: replan && x.shifts && rp === 1 ? "translateX(3px) scale(1.25)" : "translateX(0) scale(1)",
                transition: "transform .45s cubic-bezier(.34,1.4,.5,1), background .5s, box-shadow .5s" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: ch && rp >= 2 ? T.coral : x.c, display: "flex", alignItems: "center", gap: 6 }}>
                  {ch && rp >= 2 && <span style={{ fontSize: 10, color: T.faint, textDecoration: "line-through" }}>{tt(x.tm)}</span>}
                  {ch && rp >= 2 && x.tm2
                    ? <SwapValue k="new" size={11.5} color={T.coral}>{tt(x.tm2)}</SwapValue>
                    : tt(x.tm)}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: ch ? T.coral : x.c, background: `${ch ? T.coral : x.c}1c`, border: `1px solid ${ch ? T.coral : x.c}44`, padding: "3px 8px", borderRadius: 99 }}>
                  {ch && rp >= 2 ? t("Updated", "محدّث") : tt(x.tag)}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 5, lineHeight: 1.35 }}>{tt(x.w)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{ch && x.s2 ? tt(x.s2) : tt(x.s)}</div>
              {/* سبب الإضافة — ذكاء قابل للتفسير */}
              {x.because && (
                <div style={{ fontSize: 9.5, color: T.coral, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <Sparkles size={10} /> {t("because you chose:", "لأنك اخترت:")} {tt(x.because)}
                </div>
              )}
              {prefs.access && x.tag && tt(x.tag) === t("Departure","تحرّك") && (
                <div style={{ fontSize: 9.5, color: T.purple, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                  <Accessibility size={10} /> {t("Step-free route — accessible gate", "مسار بلا درج — بوابة مهيّأة")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* التكلفة — أوضح دليل على أثر الميزانية والعدد */}
      <div className="glass" style={{ margin: "4px 24px 0", borderRadius: 16, padding: "13px 15px", display: "flex", alignItems: "center", gap: 10 }}>
        <ride.icon size={15} color={ride.c} />
        <span style={{ fontSize: 11.5, color: T.dim, flex: 1 }}>{tt(ride.n)}{fam ? t(` — ${n} people`, ` — ${toAr(n)} أفراد`) : ""}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{t(`${total} SAR`, `${toAr(total)} ر.س`)}</span>
      </div>

      <AIUsedStrip caps={[
        { ar:"ذكاء التخصيص الاستباقي", en:"Proactive Personalization AI" },
        { ar:"ذكاء السياق", en:"Context-Aware AI" },
        { ar:"ذكاء التخطيط", en:"Planning AI" },
      ]} />

      <Confirm show={okMsg === "revert"} ar="تم تطبيق التعديل، وموعدك لم يتغير." en="Change applied. Your appointment is unchanged." />

      <div className="glass" style={{ margin: "10px 24px 0", borderRadius: 16, padding: 13, display: "flex", alignItems: "center", gap: 10 }}>
        <WifiOff size={15} color={T.cyan} />
        <span style={{ fontSize: 11, color: T.dim, flex: 1 }}>{t("Works offline, including tickets and maps.", "تعمل دون اتصال، بما فيها التذاكر والخرائط.")}</span>
        <CheckCircle2 size={15} color={T.emerald} />
      </div>
    </div>
  );
};

/* ═════ SCREEN — BOOKING ENGINE (electric cart) ═════ */
const ScreenBooking = () => {
  const { T, t, go } = useApp();
  const [slot, setSlot] = useState(1);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const slots = [{ en: "9:50 PM", ar: "٩:٥٠ م" }, { en: "10:15 PM", ar: "١٠:١٥ م" }, { en: "10:40 PM", ar: "١٠:٤٠ م" }, { en: "11:05 PM", ar: "١١:٠٥ م" }];
  if (done) return (
    <div className="screen" style={{ paddingBottom: 118, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 560, textAlign: "center", padding: "0 36px" }}>
      <div style={{ width: 92, height: 92, borderRadius: 99, display: "grid", placeItems: "center", background: `${T.emerald}1f`, border: `2px solid ${T.emerald}`, animation: "imkPop .55s cubic-bezier(.3,1.4,.5,1) both", boxShadow: `0 0 44px ${T.emerald}55` }}>
        <CheckCircle2 size={44} color={T.emerald} />
      </div>
      <div className="display" style={{ fontSize: 24, color: T.text, marginTop: 22 }}>{t("Cart confirmed", "تم تأكيد العربة")}</div>
      <div style={{ fontSize: 13, color: T.dim, marginTop: 8, lineHeight: 1.7 }}>
        {t("10:15 PM · King Abdulaziz Gate · driver Yusuf. Added to your itinerary and wallet — works offline.", "١٠:١٥ م — باب الملك عبدالعزيز — السائق يوسف. أُضيفت إلى خطتك ومحفظتك — وتعمل دون اتصال.")}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button onClick={() => go("itinerary")} style={{ padding: "13px 20px", borderRadius: 16, border: "none", background: T.goldGrad, color: T.ink, fontSize: 13, fontWeight: 700 }}>{t("View itinerary", "عرض الخطة")}</button>
        <button onClick={() => setDone(false)} className="glass" style={{ padding: "13px 20px", borderRadius: 16, color: T.dim, fontSize: 13 }}>{t("New booking", "حجز جديد")}</button>
      </div>
    </div>
  );
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("Inside Al-Haram", "داخل الحرم")} title={t("Electric cart", "العربة الكهربائية")}
        right={<AIChip ar="ذكاء تنسيق الرحلات" en="Journey Orchestration AI" solid />} />
      <div className="glass" style={{ margin: "16px 24px 0", borderRadius: 20, padding: 16, display: "flex", gap: 13, alignItems: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 16, display: "grid", placeItems: "center", background: `${T.gold}1f`, border: `1px solid ${T.gold}55` }}><Zap size={21} color={T.gold} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{t("King Abdulaziz Gate → Mataf level", "باب الملك عبدالعزيز ← المطاف")}</div>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 3 }}>{t("6 carts nearby · accessible seating available", "٦ عربات قريبة — مقاعد مهيّأة متاحة")}</div>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.goldHi }}>{t("20", "٢٠")}<span style={{ fontSize: 10, color: T.faint }}> {t("SAR", "ر.س")}</span></span>
      </div>
      <SectionTitle eyebrow={t("Predictive AI picked the calm window", "ذكاء التنبؤ اختار الوقت الأهدأ")} title={t("Choose a time", "اختر وقتاً")} />
      <div style={{ display: "flex", gap: 9, padding: "0 24px", flexWrap: "wrap" }}>
        {slots.map((s, i) => (
          <button key={i} onClick={() => setSlot(i)} style={{ padding: "11px 16px", borderRadius: 14, fontSize: 12.5, fontWeight: 600, background: slot === i ? T.goldGrad : "transparent", color: slot === i ? T.ink : T.dim, border: `1px solid ${slot === i ? "transparent" : T.line}` }}>
            {t(s.en, s.ar)}{i === 1 && <span style={{ fontSize: 9, marginInlineStart: 5, opacity: .85 }}>★</span>}
          </button>
        ))}
      </div>
      <SectionTitle eyebrow={t("Auto-filled from your profile", "معبأة تلقائياً من ملفك")} title={t("Riders", "عدد الركاب")} />
      <div className="glass" style={{ margin: "0 24px", borderRadius: 18, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: T.text }}>{t("Adults", "بالغون")}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="minus" className="glass" style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center" }}><Minus size={14} color={T.dim} /></button>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text, minWidth: 18, textAlign: "center" }}>{t(qty, toAr(qty))}</span>
          <button onClick={() => setQty(Math.min(4, qty + 1))} aria-label="plus" className="glass" style={{ width: 32, height: 32, borderRadius: 10, display: "grid", placeItems: "center" }}><Plus size={14} color={T.dim} /></button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 26px 0", fontSize: 11, color: T.faint }}>
        <Shield size={13} color={T.emerald} /> {t("Pays from Smart Wallet · fraud-protected · instant refund if cancelled", "الدفع من المحفظة الذكية — حماية من الاحتيال — استرداد فوري عند الإلغاء")}
      </div>
      <button onClick={() => setDone(true)} style={{ margin: "16px 24px 0", width: "calc(100% - 48px)", padding: 16, borderRadius: 18, border: "none", background: T.goldGrad, color: T.ink, fontSize: 14, fontWeight: 700, boxShadow: `0 8px 30px ${T.gold}59` }}>
        {t(`Confirm · ${qty * 20} SAR`, `تأكيد — ${["٢٠", "٤٠", "٦٠", "٨٠"][qty - 1]} ر.س`)}
      </button>
    </div>
  );
};

/* ═════ SCREEN — EMERGENCY MODE ═════ */
const ScreenEmergency = () => {
  const { T, t } = useApp();
  const [sharing, setSharing] = useState(true);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BackHeader eyebrow={t("Health & Safety", "الصحة والسلامة")} title={<span style={{ color: T.coral }}>{t("Emergency Mode", "وضع الطوارئ")}</span>}
        right={<AIChip ar="ذكاء السلامة" en="Safety AI" solid />} />
      <div style={{ display: "grid", placeItems: "center", padding: "26px 0 8px" }}>
        <button aria-label="SOS" style={{ width: 132, height: 132, borderRadius: 99, border: `3px solid ${T.coral}`, background: `radial-gradient(circle at 34% 30%, ${T.coral}, ${T.mode === "dark" ? "#7A2E14" : "#8E3C20"})`, color: "#FFF6EC", fontSize: 26, fontWeight: 800, letterSpacing: "0.1em", boxShadow: `0 0 0 14px ${T.coral}1f, 0 0 60px ${T.coral}66`, position: "relative" }}>
          <span style={{ position: "absolute", inset: -3, borderRadius: 99, border: `2px solid ${T.coral}`, animation: "imkPulseRing 1.6s ease-out infinite" }} />
          {t("SOS", "نجدة")}
        </button>
        <div style={{ fontSize: 11.5, color: T.dim, marginTop: 16 }}>{t("Hold 3 seconds to alert emergency services", "اضغط ٣ ثوانٍ لتنبيه جهات الطوارئ")}</div>
      </div>
      <div className="stagger" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "16px 24px 0" }}>
        {[
          { icon: Phone, l: { en: "Ambulance", ar: "إسعاف" }, n: "997" },
          { icon: Shield, l: { en: "Police", ar: "شرطة" }, n: "999" },
          { icon: AlertTriangle, l: { en: "Civil Defense", ar: "دفاع مدني" }, n: "998" },
        ].map((x, i) => (
          <button key={i} className="glass" style={{ borderRadius: 18, padding: "14px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
            <x.icon size={18} color={T.coral} />
            <span style={{ fontSize: 10.5, color: T.dim }}>{t(x.l.en, x.l.ar)}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text, direction: "ltr" }}>{t(x.n, toAr(x.n))}</span>
          </button>
        ))}
      </div>
      <div className="glass" style={{ margin: "16px 24px 0", borderRadius: 20, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Share2 size={17} color={T.blue} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t("Precise Location Sharing", "مشاركة الموقع الدقيق")}</div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{t("Emergency location ready to share · 21.4225 N, 39.8262 E", "موقع الطوارئ جاهز للمشاركة — ٢١٫٤٢٢٥ ش، ٣٩٫٨٢٦٢ ق")}</div>
          </div>
          <button onClick={() => setSharing(!sharing)} style={{ padding: "8px 14px", borderRadius: 99, border: `1px solid ${sharing ? T.emerald : T.faint}`, background: sharing ? `${T.emerald}1f` : "transparent", color: sharing ? T.emerald : T.dim, fontSize: 11, fontWeight: 700 }}>
            {sharing ? t("Sharing", "قيد المشاركة") : t("Share", "شارك")}
          </button>
        </div>
      </div>
      <div className="glass" style={{ margin: "12px 24px 0", borderRadius: 20, padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <MapPin size={17} color={T.cyan} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t("Nearest: Ajyad Emergency Hospital", "الأقرب: مستشفى أجياد للطوارئ")}</div>
          <div style={{ fontSize: 10.5, color: T.faint, marginTop: 2 }}>{t("1.2 km · 4 min by car · ER open", "١٫٢ كم — ٤ دقائق بالسيارة — الطوارئ مفتوحة")}</div>
        </div>
        <Navigation size={16} color={T.cyan} />
      </div>
    </div>
  );
};

/* ═════ SCREEN — PROVIDER & INVESTOR STUDIO ═════ */

/* ═════════════════════════════════════════════
   رحلة الدخول — الغلاف ثم اللغة ثم البوابة
═════════════════════════════════════════════ */

/* ١ — الغلاف */
const ScreenLanding = ({ onEnter, lang }) => {
  const isAr = lang === "ar";
  return (
    <div onClick={onEnter} style={{
      position: "absolute", inset: 0, cursor: "pointer", overflow: "hidden",
      animation: "imkEnter .5s both",
    }}>
      <img src={HERO_IMG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background:
        "linear-gradient(180deg, rgba(6,28,22,.60) 0%, rgba(6,28,22,.14) 34%, rgba(6,28,22,.66) 72%, rgba(5,22,17,.94) 100%)" }} />

      {/* حقل ذكاء مكة — المدينة تستيقظ رقمياً */}
      <ParticleField count={360} seed={19} duration={1900} settle={0.18} color="#F3DCA0" accent="#6FE0BC" />
      <AuraField dur={1700} delay={340} />

      {/* الشعار والسطر — مجموعة واحدة */}
      <div style={{ position: "absolute", top: "14%", insetInlineStart: 0, insetInlineEnd: 0, textAlign: "center" }}>
        <Wordmark size={38} />
        <div style={{ fontSize: 13, color: "rgba(246,241,227,.86)", lineHeight: 1.7, marginTop: 16, padding: "0 40px" }}>
          {isAr ? "منظومة رقمية متكاملة لمكة المكرمة" : "An integrated digital ecosystem for Makkah"}
        </div>
      </div>

      {/* الزر وحده قرب الأسفل */}
      <div style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 54, padding: "0 34px" }}>
        <button onClick={(e) => { e.stopPropagation(); onEnter(); }} style={{
          width: "100%", padding: 16, borderRadius: 99, border: "none",
          background: "linear-gradient(120deg,#E9C86A,#C9A24C)", color: "#14352A",
          fontSize: 14.5, fontWeight: 800, boxShadow: "0 14px 34px -10px rgba(233,200,106,.55)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {isAr ? "ابدأ" : "Enter EyeMakkah"}
          <ChevronLeft size={17} style={{ transform: isAr ? "none" : "rotate(180deg)" }} />
        </button>
      </div>
    </div>
  );
};

/* ٢ — اختيار اللغة */
const ScreenLanguage = ({ onPick }) => {
  const [flow, setFlow] = useState(null); // اتجاه انقلاب المنظومة
  return (
  <div style={{
    position: "absolute", inset: 0, overflow: "hidden",
    display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 30px",
    animation: "imkEnter .4s both",
  }}>
    <img src={HERO_IMG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(2px)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,28,22,.58) 0%, rgba(6,28,22,.74) 45%, rgba(5,22,17,.88) 100%)" }} />

    {/* شظايا الحرف تسير مع التيار ثم تنتظم ثم تذوب */}
    {flow && !wantsStill() && (
      <svg viewBox="0 0 390 844" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4 }}>
        {(flow === "ar"
          /* مقاطع خطّية عربية: استرسال · نبرة · سنّة · حلقة */
          ? [
              { d:"M0,0 c10,0 16,-4 22,-4",        s:1.6 },
              { d:"M0,0 c6,-5 12,-5 18,0",         s:1.5 },
              { d:"M0,0 l5,-7 l5,7",               s:1.5 },
              { d:"M0,0 a4.5,4.5 0 1,0 .1,0",      s:1.4 },
              { d:"M0,0 c8,0 12,5 12,10",          s:1.5 },
              { d:"M0,0 c9,0 14,-3 20,-1",         s:1.6 },
            ]
          /* مقاطع لاتينية: ساق · قوس · شرطة · نقطة */
          : [
              { d:"M0,0 l0,-14",                   s:1.6 },
              { d:"M0,0 a7,7 0 0,1 0,-13",         s:1.5 },
              { d:"M0,0 l13,0",                    s:1.5 },
              { d:"M0,0 l0,-9 l7,9",               s:1.5 },
              { d:"M0,0 a3,3 0 1,0 .1,0",          s:1.4 },
              { d:"M0,0 l0,-11 a6,6 0 0,1 9,5",    s:1.5 },
            ]
        ).flatMap((g, gi) =>
          [0, 1, 2].map((r) => {
            const i = gi * 3 + r;
            const rtl = flow === "ar";
            const lane = 214 + (gi - 2.5) * 52 + r * 15;      // مسارات حول وسط الشاشة
            const x0 = rtl ? 352 : 38;
            const drift = 132 + r * 34 + gi * 8;
            return (
              <path key={i} d={g.d} fill="none" stroke={i % 4 === 1 ? "#6FE0BC" : "#F3DCA0"}
                strokeWidth={g.s} strokeLinecap="round" opacity="0"
                style={{
                  transformBox: "view-box",
                  animation: `scriptRun${rtl ? "R" : "L"} ${560 + r * 70}ms ${gi * 34}ms cubic-bezier(.3,0,.25,1) forwards`,
                  ["--dx"]: `${rtl ? -drift : drift}px`,
                  ["--ly"]: `${lane}px`,
                }} />
            );
          })
        )}
      </svg>
    )}

    {/* انعكاس اتجاه المنظومة عند الاختيار */}
    {flow && !wantsStill() && (
      <svg viewBox="0 0 390 844" preserveAspectRatio="none" aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}>
        {[168, 244, 320, 396, 472, 548, 624].map((y, i) => {
          const rtl = flow === "ar";
          const from = rtl ? 390 : 0, to = rtl ? 0 : 390;
          return (
            <g key={i}>
              <line x1={from} y1={y} x2={to} y2={y} stroke="#F0D48A" strokeWidth="1" opacity=".2" />
              <line x1={from} y1={y} x2={to} y2={y} stroke={i % 3 === 1 ? "#4FCFA6" : "#F0D48A"} strokeWidth="1.8"
                strokeDasharray="70 390" strokeDashoffset={rtl ? -460 : 460} strokeLinecap="round"
                style={{ animation: `langFlow${rtl ? "R" : "L"} .72s ${i * 0.05}s cubic-bezier(.3,0,.2,1) forwards` }} />
            </g>
          );
        })}
      </svg>
    )}

    <div style={{ position: "relative" }}>
      <Wordmark size={26} />
      <div style={{ textAlign: "center", fontSize: 12.5, color: "rgba(246,241,227,.72)", margin: "30px 0 34px", lineHeight: 1.7 }}>
        اختر لغتك <span style={{ opacity: .5 }}>—</span> Choose your language
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {[
          { id: "ar", t: "العربية", f: "'IBM Plex Sans Arabic',sans-serif" },
          { id: "en", t: "English", f: "'Outfit',sans-serif" },
        ].map((x) => (
          <button key={x.id} onClick={() => { setFlow(x.id); setTimeout(() => onPick(x.id), wantsStill() ? 0 : 880); }} style={{
            width: "100%", padding: "17px 20px", borderRadius: 18,
            background: "rgba(255,255,255,.07)", border: "1.4px solid rgba(240,212,138,.36)",
            direction: x.id === "ar" ? "rtl" : "ltr", fontFamily: x.f,
            display: "flex", alignItems: "center", gap: 13,
          }}>
            <Languages size={20} color="#F0D48A" style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 19, fontWeight: 700, color: "#F6F1E3", textAlign: "start" }}>{x.t}</span>
            <ChevronLeft size={17} color="rgba(246,241,227,.5)" style={{ transform: x.id === "ar" ? "none" : "rotate(180deg)", flexShrink: 0 }} />
          </button>
        ))}
      </div>
    </div>
  </div>
  );
};

/* ٣ — اختيار البوابة */
/* شبكة كل بوابة — بنية مختلفة لكل فئة */
const TOPO = {
  citizen:   { nodes:[[52,26],[92,54],[140,34],[128,80],[186,62]], paths:["M52,26 L92,54 L140,34","M92,54 L128,80 L186,62"] },
  business:  { nodes:[[50,72],[88,40],[126,66],[160,36],[192,70]], paths:["M50,72 L88,40 L126,66 L160,36 L192,70"] },
  investor:  { nodes:[[56,30],[56,60],[56,88],[130,44],[190,66]], paths:["M56,30 L130,44 L190,66","M56,60 L130,44","M56,88 L130,44"] },
  developer: { nodes:[[60,58],[112,30],[112,86],[166,44],[166,76]], paths:["M60,58 L112,30 L166,44","M60,58 L112,86 L166,76"] },
};

const ScreenPortals = ({ lang, onPick }) => {
  const isAr = lang === "ar";
  const tx = (en, ar) => (isAr ? ar : en);
  const [picked, setPicked] = useState(null);
  const ts = useSequence(5, 300);
  return (
    <div dir={isAr ? "rtl" : "ltr"} style={{
      position: "absolute", inset: 0, overflow: "hidden", background: "#0A2E24",
      display: "flex", flexDirection: "column", justifyContent: "center",
      animation: "imkEnter .4s both",
      fontFamily: isAr ? "'IBM Plex Sans Arabic',sans-serif" : "'Outfit',sans-serif",
    }}>
      <div style={{ position: "absolute", top: 0, insetInlineStart: 0, insetInlineEnd: 0, height: 300, overflow: "hidden" }}>
        <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .30 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,46,36,.45), #0A2E24)" }} />
      </div>

      <div style={{ position: "relative", padding: "0 22px" }}>
        <Wordmark size={24} />
        <div style={{ position: "relative", textAlign: "center", marginTop: 20, height: 34 }}>
          <svg viewBox="0 0 240 34" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: .6 }}>
            <FlowPath d="M120,6 L64,30" color="#F0D48A" width={1} dur={420} delay={80} run={ts >= 1} glow={false} opacity={.5} />
            <FlowPath d="M120,6 L102,30" color="#F0D48A" width={1} dur={420} delay={140} run={ts >= 1} glow={false} opacity={.5} />
            <FlowPath d="M120,6 L138,30" color="#F0D48A" width={1} dur={420} delay={200} run={ts >= 1} glow={false} opacity={.5} />
            <FlowPath d="M120,6 L176,30" color="#F0D48A" width={1} dur={420} delay={260} run={ts >= 1} glow={false} opacity={.5} />
            <circle cx="120" cy="6" r="3.4" fill="#F0D48A" opacity={ts >= 1 ? 1 : 0} style={{ transition: "opacity .4s" }} />
          </svg>
        </div>
        <div className="display" style={{ fontSize: 22, color: "#F6F1E3", textAlign: "center", marginTop: 6 }}>
          {tx("Choose your portal", "اختر بوابتك")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30 }}>
          {PORTALS.map((p, i) => {
            const topo = TOPO[p.id];
            const on = ts > i + 1;
            const sel = picked === p.id;
            const dim = picked && !sel;
            return (
            <button key={p.id} data-topo={p.id}
              onClick={(ev) => {
                setPicked(p.id);
                const svg = ev.currentTarget.querySelector("svg");
                const m = measureIn(svg);
                const from = m ? {
                  H: m.H, V: m.V,
                  ax1: m.x + m.w * 0.18, ay1: m.y + m.h * 0.22,
                  ax2: m.x + m.w * 0.82, ay2: m.y + m.h * 0.78,
                  pts: topo.nodes.map(([nx, ny]) => ({ x: m.x + (nx / 240) * m.w, y: m.y + (ny / 112) * m.h })),
                } : null;
                setTimeout(() => onPick(p, from), wantsStill() ? 0 : 280);
              }} style={{
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", gap: 14, textAlign: "start",
              padding: "15px 16px", borderRadius: 18,
              background: sel ? "rgba(240,212,138,.14)" : "rgba(255,255,255,.055)",
              border: `1.4px solid ${sel ? "#F0D48A" : "rgba(234,246,241,.14)"}`,
              animation: `imkEnterScale .45s ${i * 0.07}s both`,
              opacity: dim ? .34 : 1,
              transform: sel ? "scale(1.02)" : "scale(1)",
              transition: "opacity .45s, transform .45s cubic-bezier(.34,1.3,.5,1), background .4s, border-color .4s",
            }}>
              {/* شبكة البوابة — ترتسم خلف البطاقة */}
              <svg viewBox="0 0 240 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                  opacity: sel ? .5 : on ? .26 : 0, transition: "opacity .5s", pointerEvents: "none" }}>
                {topo.paths.map((d, k) => (
                  <FlowPath key={k} d={d} color={sel ? "#F0D48A" : "#EAF6F1"} width={sel ? 1.4 : 1}
                    dur={560} delay={140 + k * 110} run={on} glow={sel} opacity={sel ? .9 : .55} />
                ))}
                {topo.nodes.map(([x, y], k) => (
                  <circle key={k} cx={x} cy={y} r={sel ? 2.6 : 2} fill={sel ? "#F0D48A" : "#EAF6F1"}
                    opacity={on ? (sel ? .95 : .6) : 0}
                    style={{ transition: `opacity .4s ${k * 0.05}s, r .4s` }} />
                ))}
                {sel && <SpatialPulse cx={topo.nodes[0][0]} cy={topo.nodes[0][1]} r={54} color="#F0D48A" rings={2} dur={620} />}
              </svg>
              <span style={{ position: "relative", width: 46, height: 46, borderRadius: 15, flexShrink: 0, display: "grid", placeItems: "center",
                background: "linear-gradient(140deg,rgba(240,212,138,.22),rgba(201,162,76,.12))", border: "1px solid rgba(240,212,138,.34)" }}>
                <p.icon size={22} color="#F0D48A" />
              </span>
              <span style={{ position: "relative", flex: 1, minWidth: 0, fontSize: 15, fontWeight: 700, color: "#F6F1E3", lineHeight: 1.45 }}>
                {tx(p.en, p.ar)}
              </span>
              <ChevronLeft size={17} color="rgba(234,246,241,.45)" style={{ transform: isAr ? "none" : "rotate(180deg)", flexShrink: 0, position: "relative" }} />
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   البوابات الأربع — مبدّل ثابت بدرج جانبي
═════════════════════════════════════════════ */
/* الشعار — يُستخدم في الغلاف والقائمة */
const Wordmark = ({ size = 34, light = true }) => {
  const c = light ? "#F6F1E3" : "#0C3A2E";
  return (
    <div style={{ textAlign: "center" }}>
      <div className="display" style={{ fontSize: size, color: c, letterSpacing: "0.01em", lineHeight: 1.1, direction: "ltr" }}>
        Eye<span style={{ color: "#F0D48A" }}>Makkah</span>
      </div>
      <div style={{ width: 46, height: 2, background: "linear-gradient(90deg,transparent,#F0D48A,transparent)", margin: `${size * 0.28}px auto 0` }} />
    </div>
  );
};

/* صورة الغلاف — مكة المكرمة */
const HERO_IMG = "data:image/webp;base64,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";

const PORTALS = [
  { id:"citizen",  home:"home",
    ar:"بوابة سكان مكة وزوارها", en:"Residents & Visitors Portal",
    dAr:"الرحلات والاقتراحات والخريطة والخدمات", dEn:"Journeys, suggestions, map and services",
    icon: Users },
  { id:"business", home:"biz:visibility",
    ar:"بوابة قطاع الأعمال", en:"Business Portal",
    dAr:"الظهور والبحث والتفاعل والطلب والأداء", dEn:"Visibility, search, engagement, demand, performance",
    icon: Store },
  { id:"investor", home:"inv:opportunities",
    ar:"بوابة المستثمرين", en:"Investors Portal",
    dAr:"الفرص ومؤشرات الطلب والمواقع والمقارنات", dEn:"Opportunities, demand, locations, comparisons",
    icon: TrendingUp },
  { id:"developer", home:"dev:apps",
    ar:"بوابة المطورين", en:"Developers Portal",
    dAr:"التطبيقات المصغّرة والتكاملات والنشر والتحليلات", dEn:"Mini-apps, integrations, publishing, analytics",
    icon: Briefcase },
];

const portalOf = (screen) =>
  screen.startsWith("inv:") ? "investor" :
  screen.startsWith("biz:") ? "business" :
  screen.startsWith("dev:") ? "developer" : "citizen";

/* ═══════════════════════════════════════════════════════
   طبقة المؤثرات — أساس موحّد يُوظَّف بطرق مختلفة
   Canvas للجُسيمات · SVG للمسارات · CSS للهالة
═══════════════════════════════════════════════════════ */

/* هل يفضّل المستخدم تقليل الحركة */
const wantsStill = () =>
  typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* عشوائية مُبذّرة — لتكون التسجيلات قابلة للتكرار */
const seeded = (s) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;

/* ── أ) حقل الجُسيمات ── */
const ParticleField = ({
  count = 300, seed = 7, duration = 1800, settle = 0.2,
  link = true, accent = null, color = null, style, mode = "field",
}) => {
  const ref = useRef(null);
  const { T } = useApp();
  const BASE = color || T.gold;
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const host = cv.parentElement;
    const dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
    let W = host.clientWidth, H = host.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);

    const rnd = seeded(seed);
    const n = wantsStill() ? Math.round(count * 0.5) : count;
    const P = new Array(n);
    const CX = W / 2, CY = H * 0.52;
    const SPOKES = 8;                     // محاور تشعّ من الحرم
    for (let i = 0; i < n; i++) {
      const a0 = rnd() * Math.PI * 2;
      const kind = rnd();
      let tx, ty;
      if (kind < 0.42) {
        // حلقتان دائريتان — الطرق الدائرية
        const ring = rnd() < 0.5 ? 0.26 : 0.42;
        const jitter = (rnd() - 0.5) * 0.022;
        tx = CX + Math.cos(a0) * (ring + jitter) * W;
        ty = CY + Math.sin(a0) * (ring + jitter) * H * 0.72;
      } else if (kind < 0.82) {
        // محاور شعاعية — الطرق المؤدّية إلى المركز
        const k = Math.floor(rnd() * SPOKES);
        const a = (k / SPOKES) * Math.PI * 2 + (rnd() - 0.5) * 0.03;
        const r = 0.1 + Math.pow(rnd(), 0.72) * 0.4;
        tx = CX + Math.cos(a) * r * W;
        ty = CY + Math.sin(a) * r * H * 0.72;
      } else {
        // نسيج المدينة بينهما
        const r = Math.pow(rnd(), 0.6) * 0.48;
        tx = CX + Math.cos(a0) * r * W;
        ty = CY + Math.sin(a0) * r * H * 0.72;
      }
      P[i] = {
        tx, ty,
        x: CX + Math.cos(a0) * 5, y: CY + Math.sin(a0) * 5,
        d: rnd() * 0.4,
        s: kind < 0.82 ? 1.0 + rnd() * 0.75 : 0.6 + rnd() * 0.5,
        g: rnd() < 0.13,
        ring: kind < 0.42, onStruct: kind < 0.82,
      };
    }

    if (wantsStill()) {
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        ctx.beginPath(); ctx.arc(p.tx, p.ty, p.s, 0, 6.283);
        ctx.fillStyle = p.g && accent ? accent : BASE;
        ctx.globalAlpha = settle; ctx.fill();
      }
      return;
    }

    let raf = 0, t0 = 0, stop = false;
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const frame = (ts) => {
      if (stop) return;
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / duration);
      ctx.clearRect(0, 0, W, H);
      const linkK = Math.max(0, Math.min(1, (k - 0.34) / 0.22)) * (1 - Math.max(0, (k - 0.76) / 0.24));

      for (let i = 0; i < n; i++) {
        const p = P[i];
        const local = Math.max(0, Math.min(1, (k - p.d) / (1 - p.d)));
        const e = ease(local);
        p.x = W / 2 + (p.tx - W / 2) * e;
        p.y = H / 2 + (p.ty - H / 2) * e;
        const peak = 0.9;
        const a = k < 0.42 ? local * peak
                : k < 0.74 ? peak
                : settle + (peak - settle) * (1 - (k - 0.74) / 0.26);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283);
        ctx.fillStyle = p.g && accent ? accent : BASE;
        ctx.globalAlpha = a; ctx.fill();
      }

      // بنية المدينة: حلقتان ومحاور — تظهر عند الذروة ثم تهدأ
      if (linkK > 0.01) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = BASE;
        for (const ring of [0.26, 0.42]) {
          ctx.beginPath();
          ctx.ellipse(W / 2, H * 0.52, ring * W, ring * H * 0.72, 0, 0, 6.283);
          ctx.globalAlpha = linkK * 0.3; ctx.stroke();
        }
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(W / 2 + Math.cos(a) * 0.1 * W, H * 0.52 + Math.sin(a) * 0.1 * H * 0.72);
          ctx.lineTo(W / 2 + Math.cos(a) * 0.46 * W, H * 0.52 + Math.sin(a) * 0.46 * H * 0.72);
          ctx.globalAlpha = linkK * 0.2; ctx.stroke();
        }
      }

      // روابط قصيرة تلمع ثم تخفت — إيحاء بطبقة مترابطة
      if (link && linkK > 0.01) {
        ctx.lineWidth = 0.55;
        for (let i = 0; i < n; i += 2) {
          const p = P[i], q = P[(i + 7) % n];
          const dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < 3400 && (p.ring === q.ring)) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = (p.g || q.g) && accent ? accent : BASE;
            ctx.globalAlpha = linkK * 0.42 * (1 - d2 / 3400); ctx.stroke();
          }
        }
      }
      if (k < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onVis = () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; } };
    document.addEventListener("visibilitychange", onVis);
    return () => { stop = true; if (raf) cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); };
  }, [count, seed, duration, settle, link, accent, BASE, mode]);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }} />;
};

/* ── ب) هالة المحيط — ضوء يطوف حافة الشاشة مرة واحدة ── */
const AuraField = ({ run = true, dur = 1500, delay = 320 }) => {
  const { T } = useApp();
  if (!run || wantsStill()) return null;
  const W = 390, H = 844, R = 42;
  const per = 2 * ((W - 2 * R) + (H - 2 * R)) + 2 * Math.PI * R;
  const d = `M${R},2 H${W - R} A${R},${R} 0 0 1 ${W - 2},${R} V${H - R} A${R},${R} 0 0 1 ${W - R},${H - 2} H${R} A${R},${R} 0 0 1 2,${H - R} V${R} A${R},${R} 0 0 1 ${R},2 Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 40,
        animation: `auraOut 620ms ${delay + dur - 380}ms both` }}>
      <defs>
        <linearGradient id="auraG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D48A" stopOpacity="0" />
          <stop offset="45%" stopColor="#F0D48A" stopOpacity="1" />
          <stop offset="72%" stopColor={T.ai} stopOpacity=".9" />
          <stop offset="100%" stopColor="#F0D48A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#auraG)" strokeWidth="2.4" strokeLinecap="round"
        strokeDasharray={`${Math.round(per * 0.3)} ${Math.round(per)}`} strokeDashoffset={per}
        style={{ animation: `auraRun ${dur}ms ${delay}ms cubic-bezier(.35,0,.25,1) forwards`, filter: "blur(.4px)" }} />
      <path d={d} fill="none" stroke="#F0D48A" strokeWidth="6" strokeLinecap="round" opacity=".28"
        strokeDasharray={`${Math.round(per * 0.16)} ${Math.round(per)}`} strokeDashoffset={per}
        style={{ animation: `auraRun ${dur}ms ${delay}ms cubic-bezier(.35,0,.25,1) forwards`, filter: "blur(5px)" }} />
    </svg>
  );
};

/* ── ج) مسار متدفّق — رسم ذاتي وضوء يسري ── */
const FlowPath = ({ d, color, width = 2, dur = 800, delay = 0, dash = 0, run = true, glow = true, opacity = 1 }) => {
  const len = 900;
  if (!run) return null;
  const still = wantsStill();
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity}
        strokeDasharray={dash ? dash : len} strokeDashoffset={still ? 0 : (dash ? 0 : len)}
        style={still ? undefined : { animation: `agDraw ${dur}ms ${delay}ms cubic-bezier(.22,.9,.3,1) forwards` }} />
      {glow && !still && (
        <path d={d} fill="none" stroke={color} strokeWidth={width + 1.6} strokeLinecap="round"
          strokeDasharray="26 900" strokeDashoffset={len}
          style={{ animation: `flowRun ${dur + 350}ms ${delay}ms linear forwards`, opacity: .85 }} />
      )}
    </g>
  );
};

/* ── د) نبضة مكانية — حلقات تنتشر من نقطة ── */
const SpatialPulse = ({ cx, cy, r = 70, color, rings = 3, dur = 1500, delay = 0, repeat = false }) => {
  if (wantsStill()) return null;
  return (
    <g style={{ pointerEvents: "none" }}>
      {Array.from({ length: rings }).map((_, i) => (
        <circle key={i} cx={cx} cy={cy} r={6} fill="none" stroke={color} strokeWidth="1.2">
          <animate attributeName="r" values={`6;${r}`} dur={`${dur}ms`}
            begin={`${delay + i * (dur / rings)}ms`} repeatCount={repeat ? "indefinite" : 1} fill="freeze" />
          <animate attributeName="opacity" values=".55;0" dur={`${dur}ms`}
            begin={`${delay + i * (dur / rings)}ms`} repeatCount={repeat ? "indefinite" : 1} fill="freeze" />
        </circle>
      ))}
    </g>
  );
};

/* ═════ أدوات الحركة الذكية ═════ */

/* يتقدّم خطوة كل فترة حتى يبلغ العدد — يُعيد رقم المرحلة */
const useSequence = (steps, gap = 420, active = true) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) { setI(steps); return; }
    setI(0);
    if (typeof window !== "undefined" && window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setI(steps); return; }
    let n = 0;
    const id = setInterval(() => { n += 1; setI(n); if (n >= steps) clearInterval(id); }, gap);
    return () => clearInterval(id);
  }, [steps, gap, active]);
  return i;
};

/* غلاف يكشف محتواه عند بلوغ المرحلة */
const Step = ({ at, now, children, y = 10 }) => (
  <div style={{
    opacity: now >= at ? 1 : 0,
    transform: now >= at ? "translateY(0)" : `translateY(${y}px)`,
    transition: "opacity .42s cubic-bezier(.22,.9,.3,1), transform .42s cubic-bezier(.22,.9,.3,1)",
  }}>{children}</div>
);

/* حالة تفكير قصيرة */
const Thinking = ({ label, done }) => {
  const { T, t } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 99,
      background: T.mode === "dark" ? "rgba(79,207,166,.1)" : "rgba(14,74,56,.07)",
      border: `1px solid ${T.ai}33`, alignSelf: "flex-start" }}>
      {done ? <CheckCircle2 size={12} color={T.ai} /> : (
        <span style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="ag-seq" style={{ width: 4, height: 4, borderRadius: 99, background: T.ai,
              animation: `agDots 1.1s ${i * 0.16}s infinite` }} />
          ))}
        </span>
      )}
      <span style={{ fontSize: 10.5, fontWeight: 600, color: T.ai }}>{label}</span>
    </div>
  );
};

/* رقم يتبدّل بحركة قلب */
const SwapValue = ({ children, k, size = 13, color, weight = 700 }) => (
  <span key={k} className="ag-seq" style={{ fontSize: size, fontWeight: weight, color,
    display: "inline-block", animation: "agSwap .55s both" }}>{children}</span>
);

/* قيمة سوقية تتفكّك ثم تتشكّل في موضعها ذاته */
const Deform = ({ from, to, up, run, delay = 0 }) => {
  const { T } = useApp();
  const [now, setNow] = useState(from);
  const [ph, setPh] = useState(0);   // ٠ ساكن · ١ تفكّك · ٢ تشكّل
  useEffect(() => {
    if (!run) { setNow(from); setPh(0); return; }
    if (wantsStill()) { setNow(to); setPh(2); return; }
    setNow(from); setPh(0);
    const a = setTimeout(() => setPh(1), delay);
    const b = setTimeout(() => { setNow(to); setPh(2); }, delay + 340);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [run, from, to, delay]);
  const c = up ? T.emerald : T.coral;
  return (
    <span style={{ position: "relative", display: "inline-block", minWidth: 34, textAlign: "center" }}>
      <span style={{
        display: "inline-block", fontSize: 15, fontWeight: 800,
        color: ph === 2 ? c : T.text,
        transform: ph === 1 ? (up ? "scaleY(.42) scaleX(1.18)" : "scaleY(1.3) scaleX(.72)") : "scale(1)",
        filter: ph === 1 ? "blur(2.4px)" : "blur(0)",
        opacity: ph === 1 ? 0.18 : 1,
        transition: ph === 1 ? "all .3s cubic-bezier(.5,0,.9,.4)" : "all .42s cubic-bezier(.2,1.35,.4,1)",
      }}>{now}</span>
      {ph === 2 && !wantsStill() && (
        <span aria-hidden="true" style={{
          position: "absolute", insetInlineStart: "50%", top: "50%", width: 30, height: 30,
          marginInlineStart: -15, marginTop: -15, borderRadius: 99, pointerEvents: "none",
          border: `1.4px solid ${c}`, animation: "agHalo .62s ease-out forwards",
        }} />
      )}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════
   جسر الانتقال — هندسة تبقى ظاهرة عبر تغيّر الشاشة
   طبقة جذرية · pointer-events: none · تُلغى عند التنقّل السريع
═══════════════════════════════════════════════════════ */
const MorphCtx = createContext(null);
const useMorph = () => useContext(MorphCtx);

/* يقيس عنصراً بالنسبة إلى إطار الشاشة — إحداثيات محلية بالبكسل */
const measureIn = (el, hostSel = "[data-phone-screen]") => {
  if (!el || typeof document === "undefined") return null;
  const host = document.querySelector(hostSel);
  if (!host) return null;
  const h = host.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height, H: h.width, V: h.height };
};

/* جسر مقيس: يبدأ من موضع المصدر الحقيقي وينتهي على الهدف الحقيقي */
const MorphOverlay = ({ job }) => {
  const { T } = useApp();
  const [to, setTo] = useState(null);
  const [go2, setGo2] = useState(false);

  useEffect(() => {
    setTo(null); setGo2(false);
    if (!job || !job.from) return;
    let raf1 = 0, raf2 = 0, tm = 0;
    /* ننتظر إطارين حتى تُرسم الوجهة ثم نقيس هدفها */
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.querySelector(job.target);
        const m = measureIn(el);
        if (m) setTo(m);
        tm = setTimeout(() => setGo2(true), 30);
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(tm); };
  }, [job]);

  if (!job || !job.from) return null;
  const F = job.from;
  const D = 900;

  /* النقاط: من مواضعها الحقيقية في المصدر إلى مواضعها على هندسة الهدف */
  const pts = F.pts || [];
  const target = to;

  return (
    <svg viewBox={`0 0 ${F.H} ${F.V}`} preserveAspectRatio="none" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 92 }}>
      {/* المحور: يبدأ مطابقاً لهندسة المصدر ثم ينطبق على الهدف */}
      <line
        x1={go2 && target ? target.x + target.w / 2 : F.ax1}
        y1={go2 && target ? target.y : F.ay1}
        x2={go2 && target ? target.x + target.w / 2 : F.ax2}
        y2={go2 && target ? target.y + target.h : F.ay2}
        stroke="#F0D48A" strokeWidth={go2 ? 2 : 2.4} strokeLinecap="round"
        style={{ transition: `all ${D}ms cubic-bezier(.3,0,.2,1), opacity 300ms ${D - 260}ms`,
          opacity: go2 && target ? 0 : .95 }} />

      {pts.map((p, i) => {
        const n = pts.length || 1;
        const tx = target ? target.x + target.w / 2 : p.x;
        const ty = target ? target.y + (target.h * (i + 0.5)) / n : p.y;
        return (
          <circle key={i}
            cx={go2 && target ? tx : p.x}
            cy={go2 && target ? ty : p.y}
            r={go2 ? 4 : 4.4} fill="#F0D48A"
            style={{ transition: `cx ${D}ms ${i * 40}ms cubic-bezier(.3,0,.2,1), cy ${D}ms ${i * 40}ms cubic-bezier(.3,0,.2,1), r ${D}ms, opacity 280ms ${D - 220 + i * 25}ms`,
              opacity: go2 && target ? 0 : 1 }} />
        );
      })}
    </svg>
  );
};

/* ═════ ورقة المنظومة — خمسة أطراف · أربع بوابات ═════ */
const EcosystemSheet = ({ open, onClose, returnFocusTo }) => {
  const { T, t, tt } = useApp();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const first = panel && panel.querySelector(sel);
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll(sel)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (returnFocusTo && returnFocusTo.current) returnFocusTo.current.focus();
    };
  }, [open, onClose, returnFocusTo]);

  if (!open) return null;
  const GROUPS = [
    { icon: Users,      ar:"السكان والزوار",   en:"Residents & Visitors",
      rAr:"يخططون ليومهم في مكة ويتنقّلون فيه", rEn:"Plan and navigate their day in Makkah", portal:true },
    { icon: Store,      ar:"قطاع الأعمال",     en:"Business",
      rAr:"يتابعون الظهور والطلب والأداء",      rEn:"Track visibility, demand and performance", portal:true },
    { icon: Car,        ar:"مقدمو الخدمات",    en:"Service Providers",
      rAr:"يربطون خدماتهم برحلة المستفيد",      rEn:"Connect their services into the journey", portal:false },
    { icon: TrendingUp, ar:"المستثمرون",       en:"Investors",
      rAr:"يقرؤون الطلب والطاقة وفجوات الفرص",  rEn:"Read demand, capacity and opportunity gaps", portal:true },
    { icon: Briefcase,  ar:"المطورون",         en:"Developers",
      rAr:"يبنون خدمات وتطبيقات مصغّرة للمنظومة", rEn:"Build services and mini-apps for the ecosystem", portal:true },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 98 }}>
      <div onClick={onClose} aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(4,16,12,.62)", backdropFilter: "blur(4px)", animation: "imkEnter .25s both" }} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="eco-title" style={{
        position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 0,
        background: T.mode === "dark" ? "#0E1626" : "#FFFCF4",
        borderStartStartRadius: 26, borderStartEndRadius: 26,
        padding: "20px 22px 26px", maxHeight: "82%", overflowY: "auto",
        boxShadow: "0 -18px 50px -16px rgba(0,0,0,.5)",
        animation: "sheetUp .34s cubic-bezier(.22,.9,.3,1) both",
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: T.line, margin: "0 auto 16px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div id="eco-title" className="display" style={{ fontSize: 19, color: T.text }}>
            {t("EyeMakkah Ecosystem", "منظومة EyeMakkah")}
          </div>
          <button onClick={onClose} aria-label="close" style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center", background: T.mode === "dark" ? "rgba(255,255,255,.07)" : "rgba(36,27,11,.06)", border: `1px solid ${T.line}` }}>
            <Plus size={15} color={T.dim} style={{ transform: "rotate(45deg)" }} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
          {GROUPS.map((g, i) => (
            <div key={i} className="glass" style={{
              borderRadius: 15, padding: "12px 13px", display: "flex", alignItems: "center", gap: 11,
              border: `1px solid ${g.portal ? T.gold + "44" : T.line}`,
              animation: `fxLift .4s ${i * 0.055}s both`,
            }}>
              <span style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: "grid", placeItems: "center",
                background: g.portal ? `${T.gold}1c` : (T.mode === "dark" ? "rgba(255,255,255,.05)" : "rgba(36,27,11,.045)"),
                border: `1px solid ${g.portal ? T.gold + "44" : T.line}` }}>
                <g.icon size={15} color={g.portal ? T.gold : T.faint} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{tt(g)}</span>
                  {!g.portal && (
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: T.faint, border: `1px dashed ${T.faint}66`, padding: "2px 7px", borderRadius: 99 }}>
                      {t("no separate portal", "ضمن المنظومة")}
                    </span>
                  )}
                </span>
                <span style={{ display: "block", fontSize: 10, color: T.faint, marginTop: 3, lineHeight: 1.55 }}>
                  {t(g.rEn, g.rAr)}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 13, borderTop: `1px solid ${T.line}`, textAlign: "center", fontSize: 11, fontWeight: 700, color: T.gold }}>
          {t("5 stakeholder groups — 4 digital portals", "٥ أطراف مستفيدة — ٤ بوابات رقمية")}
        </div>
      </div>
    </div>
  );
};

/* ═════ القائمة العامة — طبقة فوق كل البوابات ═════ */
/* إشعارات التطبيق — لكل بوابة مجموعتها */
const PORTAL_NOTIFS = {
  citizen: [
    { id:"c1", icon: Navigation,   c:"blue",
      ar:"تم تحديث خطتك لتناسب حالة الطريق الحالية.",
      en:"Your plan has been updated to match current road conditions." },
    { id:"c2", icon: MapPin,       c:"gold",
      ar:"أصبحت وجهة جديدة متاحة ضمن اقتراحات رحلتك.",
      en:"A new destination is now available among your journey suggestions." },
    { id:"c3", icon: CheckCircle2, c:"emerald",
      ar:"تم حفظ آخر تعديلاتك على خطة اليوم.",
      en:"Your latest changes to today's plan have been saved." },
  ],
  business: [
    { id:"b1", icon: Store,        c:"blue",
      ar:"تم تحديث بيانات نشاطك في EyeMakkah.",
      en:"Your business details on EyeMakkah have been updated." },
    { id:"b2", icon: TrendingUp,   c:"emerald",
      ar:"ارتفع ظهور نشاطك في نتائج البحث خلال الفترة الأخيرة.",
      en:"Your visibility in search results has risen recently." },
    { id:"b3", icon: BarChart3,    c:"gold",
      ar:"أصبح تقرير نشاطك الأخير جاهزًا للمراجعة.",
      en:"Your latest activity report is ready for review." },
  ],
  investor: [
    { id:"i1", icon: Bookmark,     c:"gold",
      ar:"تم تحديث الفرص المحفوظة في حسابك.",
      en:"The opportunities saved in your account have been updated." },
    { id:"i2", icon: BarChart3,    c:"blue",
      ar:"أصبح ملخصك الاستثماري الأخير جاهزًا للمراجعة.",
      en:"Your latest investment summary is ready for review." },
    { id:"i3", icon: CheckCircle2, c:"emerald",
      ar:"تم حفظ تفضيلات القطاعات والمواقع التي اخترتها.",
      en:"Your chosen sector and location preferences have been saved." },
  ],
  developer: [
    { id:"d1", icon: Plus,         c:"blue",
      ar:"تم تحديث حالة أحد تطبيقاتك المصغّرة.",
      en:"The status of one of your mini-apps has been updated." },
    { id:"d2", icon: Share2,       c:"gold",
      ar:"أصبح إصدار جديد من واجهات البرمجة متاحًا.",
      en:"A new version of the APIs is now available." },
    { id:"d3", icon: Shield,       c:"emerald",
      ar:"اكتملت مراجعة أحد تطبيقاتك وانتقل إلى المرحلة التالية.",
      en:"Review of one of your apps is complete and it has moved to the next stage." },
  ],
};

const GlobalSidebar = ({ open, onClose, current, onPick, lang, setLang, go }) => {
  const { T, t, tt } = useApp();
  const [dismissed, setDismissed] = useState({});
  const [eco, setEco] = useState(false);
  const ecoBtnRef = useRef(null);
  if (!open) return null;

  const all = (PORTAL_NOTIFS[current] || []).filter((n) => !dismissed[n.id]);
  const shown = all.slice(0, 3);
  const drop = (id) => setDismissed({ ...dismissed, [id]: true });
  const clearAll = () => {
    const d = { ...dismissed };
    (PORTAL_NOTIFS[current] || []).forEach((n) => { d[n.id] = true; });
    setDismissed(d);
  };
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 95 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(4,16,12,.6)", backdropFilter: "blur(4px)", animation: "imkEnter .25s both" }} />
      <div style={{
        position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: "84%",
        background: "linear-gradient(165deg,#12523E 0%,#0A2E24 62%,#082119 100%)",
        borderStartEndRadius: 26, borderEndEndRadius: 26,
        boxShadow: "0 0 70px rgba(0,0,0,.65)", padding: "52px 18px 30px",
        display: "flex", flexDirection: "column",
        animation: "imkSlideIn .32s cubic-bezier(.22,.9,.3,1) both",
      }} {...(eco ? { inert: "", "aria-hidden": "true" } : {})}>
        {/* ١ — الهوية */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button ref={ecoBtnRef} onClick={() => setEco(true)} aria-haspopup="dialog" aria-expanded={eco} style={{ background: "transparent", border: "none", padding: 0, textAlign: "start", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="display" style={{ fontSize: 20, color: "#F6F1E3", direction: "ltr" }}>
              Eye<span style={{ color: "#F0D48A" }}>Makkah</span>
            </span>
            <ChevronLeft size={14} color="rgba(240,212,138,.75)" style={{ transform: lang === "ar" ? "none" : "rotate(180deg)" }} />
          </button>
          <button onClick={onClose} aria-label="close" style={{ width: 32, height: 32, borderRadius: 11, display: "grid", placeItems: "center", background: "rgba(255,255,255,.09)", border: "1px solid rgba(234,246,241,.18)" }}>
            <Plus size={16} color="#EAF6F1" style={{ transform: "rotate(45deg)" }} />
          </button>
        </div>

        <div style={{ position: "relative", height: 1, background: "rgba(234,246,241,.14)", margin: "14px 0 18px" }} />

        {/* ٢ — البوابات */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 9 }}>
          {PORTALS.map((p) => {
            const on = current === p.id;
            return (
              <button key={p.id} onClick={() => onPick(p)} style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "start",
                padding: "14px 12px", borderRadius: 16, position: "relative", overflow: "hidden",
                background: on ? "rgba(240,212,138,.16)" : "rgba(255,255,255,.045)",
                border: `1.4px solid ${on ? "#F0D48A" : "rgba(234,246,241,.12)"}`,
              }}>
                {on && <span style={{ position: "absolute", insetInlineStart: 0, top: 12, bottom: 12, width: 3, borderRadius: 99, background: "#F0D48A" }} />}
                <span style={{ width: 38, height: 38, borderRadius: 13, flexShrink: 0, display: "grid", placeItems: "center",
                  background: on ? "linear-gradient(140deg,#F0D48A,#C9A24C)" : "rgba(255,255,255,.07)",
                  border: `1px solid ${on ? "transparent" : "rgba(234,246,241,.15)"}` }}>
                  <p.icon size={17} color={on ? "#14352A" : "#EAF6F1"} />
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: on ? 800 : 600, color: "#F6F1E3", lineHeight: 1.45 }}>
                  {tt(p)}
                </span>
                {on && <CheckCircle2 size={15} color="#F0D48A" style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        <div style={{ height: 20 }} />

        {/* ٣ — اللغة */}
        <div style={{ position: "relative", height: 1, background: "rgba(234,246,241,.14)", marginBottom: 16 }} />
        <div style={{ position: "relative", display: "flex", gap: 10 }}>
          {[{ id: "ar", l: "العربية", f: "'IBM Plex Sans Arabic',sans-serif" },
            { id: "en", l: "English", f: "'Outfit',sans-serif" }].map((x) => {
            const on = lang === x.id;
            return (
              <button key={x.id} onClick={() => setLang(x.id)} style={{
                flex: 1, padding: "13px 10px", borderRadius: 14, fontFamily: x.f,
                fontSize: 13, fontWeight: 700,
                background: on ? "linear-gradient(120deg,#E9C86A,#C9A24C)" : "rgba(255,255,255,.055)",
                color: on ? "#14352A" : "rgba(234,246,241,.8)",
                border: `1.3px solid ${on ? "transparent" : "rgba(234,246,241,.14)"}`,
              }}>{x.l}</button>
            );
          })}
        </div>

        {/* ٤ — الإشعارات */}
        <div style={{ position: "relative", height: 1, background: "rgba(234,246,241,.14)", margin: "20px 0 14px" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
          <Bell size={13} color="#F0D48A" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(234,246,241,.85)", flex: 1 }}>
            {t("Notifications", "الإشعارات")}
          </span>
          {all.length > 1 && (
            <button onClick={clearAll} style={{ background: "none", border: "none", padding: 0, fontSize: 10, fontWeight: 600, color: "rgba(234,246,241,.55)" }}>
              {t("Clear all", "مسح الكل")}
            </button>
          )}
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {shown.length === 0 ? (
            <div style={{ fontSize: 10.5, color: "rgba(234,246,241,.45)", padding: "10px 2px", lineHeight: 1.6 }}>
              {t("No new notifications", "لا توجد إشعارات جديدة")}
            </div>
          ) : shown.map((n) => (
            <div key={n.id} style={{
              display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 11px", borderRadius: 14,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(234,246,241,.11)",
              animation: "imkRise .3s both",
            }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, flexShrink: 0, display: "grid", placeItems: "center",
                background: `${T[n.c]}26`, border: `1px solid ${T[n.c]}55` }}>
                <n.icon size={13} color="#F0D48A" />
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 10.5, color: "rgba(246,241,227,.9)", lineHeight: 1.6 }}>
                {tt(n)}
              </span>
              <button onClick={() => drop(n.id)} aria-label="dismiss" style={{
                width: 20, height: 20, borderRadius: 7, flexShrink: 0, display: "grid", placeItems: "center",
                background: "rgba(255,255,255,.07)", border: "1px solid rgba(234,246,241,.15)" }}>
                <Plus size={11} color="rgba(234,246,241,.65)" style={{ transform: "rotate(45deg)" }} />
              </button>
            </div>
          ))}
        </div>

        {all.length > 3 && (
          <button onClick={() => { go("notifications"); onClose(); }} style={{
            position: "relative", marginTop: 10, width: "100%", padding: "11px 12px", borderRadius: 13,
            background: "rgba(240,212,138,.1)", border: "1px solid rgba(240,212,138,.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            fontSize: 11, fontWeight: 700, color: "#F0D48A",
          }}>
            {t("View all notifications", "عرض كل التنبيهات")}
            <ChevronLeft size={13} style={{ transform: lang === "ar" ? "none" : "rotate(180deg)" }} />
          </button>
        )}
      </div>

      <EcosystemSheet open={eco} onClose={() => setEco(false)} returnFocusTo={ecoBtnRef} />
    </div>
  );
};

/* زر القائمة — يمين في العربية ويسار في الإنجليزية */
const MenuButton = ({ onClick, onDark }) => {
  const { T } = useApp();
  const c = onDark ? "#F0D48A" : T.gold;
  return (
    <button onClick={onClick} aria-label="Menu" className={onDark ? "" : "glass"} style={{
      width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", flexShrink: 0, gap: 0,
      background: onDark ? "rgba(255,255,255,.1)" : undefined,
      border: onDark ? "1px solid rgba(240,212,138,.4)" : undefined,
    }}>
      <span style={{ display: "flex", flexDirection: "column", gap: 3.4, width: 15 }}>
        {[13, 15, 10].map((w, i) => (
          <span key={i} style={{ height: 1.9, width: w, borderRadius: 99, background: c, alignSelf: "flex-start" }} />
        ))}
      </span>
    </button>
  );
};

/* ═════════════════════════════════════════════
   INVESTOR PORTAL — a separate world
   5 screens ↔ 5 steps of the investor journey
═════════════════════════════════════════════ */


const OPPS = [
  { id:"catering", icon: Utensils, c:"coral",
    en:"Central catering facilities", ar:"مراكز إعاشة وتموين", short:{en:"Catering",ar:"الإعاشة"},
    where:{en:"Al-Shawqiyyah",ar:"الشوقية"},
    demand:{en:"Capacity below the 30-million Umrah target for 2030",
            ar:"الطاقة الاستيعابية دون مستهدف ٣٠ مليون معتمر بحلول ٢٠٣٠"},
    gap:91,
    volume:{en:"18,400 / month",ar:"١٨٬٤٠٠ شهرياً"},
    trend:{en:"Rising",ar:"مرتفع"},
    coverage:{en:"4.2× capacity",ar:"٤٫٢× الطاقة"},
    footfall:{en:"High",ar:"عالية"},
    licensed:{en:"12 facilities",ar:"١٢ منشأة"},
    peak:{en:"Ramadan & Hajj",ar:"رمضان والحج"},
    signal:{en:"In-app searches and unfulfilled requests",ar:"عمليات البحث والطلبات غير الملبّاة داخل التطبيق"} },

  { id:"mobility", icon: Accessibility, c:"purple",
    en:"Accessible mobility services", ar:"خدمات تنقّل ميسّرة", short:{en:"Mobility",ar:"التنقّل"},
    where:{en:"Central Area",ar:"نطاق المركزية"},
    demand:{en:"A stated priority of the Pilgrim Experience Program",
            ar:"من أولويات برنامج خدمة ضيوف الرحمن"},
    gap:88,
    volume:{en:"12,600 / month",ar:"١٢٬٦٠٠ شهرياً"},
    trend:{en:"Steady",ar:"مستقر"},
    coverage:{en:"3.6× capacity",ar:"٣٫٦× الطاقة"},
    footfall:{en:"Very high",ar:"مرتفعة جداً"},
    licensed:{en:"5 operators",ar:"٥ مشغّلين"},
    peak:{en:"Year-round",ar:"طوال العام"},
    signal:{en:"Accessible-route requests and filter usage",ar:"طلبات المسار الميسّر واستخدام فلتر الوصول الشامل"} },

  { id:"housing", icon: Building2, c:"blue",
    en:"Upgrading licensed accommodation", ar:"إعادة تأهيل وحدات إسكان مرخّصة", short:{en:"Accommodation",ar:"الإسكان"},
    where:{en:"Al-Aziziyyah",ar:"العزيزية"},
    demand:{en:"District holds 37% of licensed pilgrim buildings",
            ar:"يستحوذ الحي على ٣٧٪ من عمائر الحجاج المرخّصة"},
    gap:79,
    volume:{en:"9,200 / month",ar:"٩٬٢٠٠ شهرياً"},
    trend:{en:"Seasonal",ar:"موسمي"},
    coverage:{en:"2.1× capacity",ar:"٢٫١× الطاقة"},
    footfall:{en:"Medium",ar:"متوسطة"},
    licensed:{en:"340 buildings",ar:"٣٤٠ عمارة"},
    peak:{en:"Hajj season",ar:"موسم الحج"},
    signal:{en:"Extended-stay searches and saved listings",ar:"عمليات البحث عن إقامة طويلة والعناصر المحفوظة"} },
];

const InvHeader = ({ eyebrow, title, right, onMenu }) => {
  const { T, t } = useApp();
  return (
    <div style={{ padding: "18px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MenuButton onClick={onMenu} />
        <span style={{ marginInlineStart: "auto", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: T.aiInk, background: T.aiGrad, border: `1px solid ${T.ai}4d`, padding: "6px 11px", borderRadius: 99 }}>
          {t("INVESTOR PORTAL", "بوابة المستثمر")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
        <div>
          {eyebrow && <div style={{ fontSize: 10, letterSpacing: "0.16em", color: T.gold, fontWeight: 700 }}>{eyebrow}</div>}
          <div className="display" style={{ fontSize: 22, color: T.text, marginTop: 2 }}>{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
};

const GapBar = ({ v, c }) => {
  const { T } = useApp();
  return (
    <div style={{ height: 6, borderRadius: 99, background: T.line, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${v}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${T[c]},${T[c]}88)`, transition: "width .7s cubic-bezier(.22,.9,.3,1)" }} />
    </div>
  );
};

/* الخطوة ١ — مطابقة الفرص */
const InvOpportunities = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  /* ١ الطلب · ٢ الطاقة المرخّصة · ٣ الموقع · ٤ مؤشر الفجوة */
  const is = useSequence(4, 480);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <InvHeader onMenu={onMenu} eyebrow={t("Where demand exceeds supply", "حيث يتجاوز الطلب العرض")} title={t("Suitable opportunities", "فرص مناسبة")}
        right={<AIChip ar="ذكاء مطابقة الفرص" en="Opportunity Matching AI" solid />} />
      <div style={{ fontSize: 11.5, color: T.dim, padding: "10px 24px 0", lineHeight: 1.65 }}>
        {t("Derived from in-app behavioural data — searches, requests and unmet needs — measured against licensed capacity.",
           "مستمدّة من البيانات السلوكية داخل التطبيق — عمليات البحث والطلبات والاحتياجات غير الملبّاة — مقارنةً بالطاقة المرخّصة.")}
      </div>

      {/* العوامل المُقيَّمة قبل استقرار المؤشر */}
      <div data-morph-target="investor" style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "13px 24px 0" }}>
        {[
          { at:1, ar:"حجم الطلب", en:"Demand volume" },
          { at:2, ar:"الطاقة المرخّصة", en:"Licensed capacity" },
          { at:3, ar:"الموقع والحركة", en:"Location & footfall" },
          { at:4, ar:"الاحتياج غير الملبّى", en:"Unmet need" },
        ].map((f, i) => {
          const on = is >= f.at;
          return (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 600,
              color: on ? T.ai : T.faint,
              background: on ? `${T.ai}14` : "transparent",
              border: `1px solid ${on ? T.ai + "44" : T.line}`,
              padding: "5px 10px", borderRadius: 99,
              transition: "all .4s cubic-bezier(.22,.9,.3,1)",
            }}>
              {on ? <CheckCircle2 size={9} /> : <span style={{ width:4, height:4, borderRadius:99, background:T.faint }} />}
              {t(f.en, f.ar)}
            </span>
          );
        })}
      </div>
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 24px 0" }}>
        {OPPS.map((o, i) => (
          <button key={i} onClick={() => go("inv:compare")} className="glass" style={{ borderRadius: 20, padding: 16, textAlign: "start", position: "relative", overflow: "hidden" }}>
            {/* عدسة التحليل — تكشف دليلاً مختلفاً في كل طبقة */}
            {is < 4 && !wantsStill() && (() => {
              const L = [
                { at:1, ar:"الطلب",             en:"Demand",            c:T.coral },
                { at:2, ar:"الطاقة المرخّصة",    en:"Licensed capacity", c:T.blue },
                { at:3, ar:"الموقع والحركة",    en:"Geography",         c:T.purple },
                { at:4, ar:"الاحتياج غير الملبّى", en:"Unmet need",      c:T.gold },
              ];
              const cur = L.find((x) => x.at === is + 1) || L[3];
              return (
                <>
                  <span aria-hidden="true" style={{
                    position: "absolute", top: 0, bottom: 0, width: 108, pointerEvents: "none", borderRadius: 20,
                    background: `radial-gradient(ellipse at center, ${cur.c}26, transparent 74%)`,
                    border: `1px solid ${cur.c}4d`, insetInlineStart: 0, zIndex: 2,
                    animation: "lensRun 2.05s cubic-bezier(.4,0,.3,1) forwards",
                    transition: "background .4s, border-color .4s",
                  }} />
                  <span style={{
                    position: "absolute", top: 9, insetInlineEnd: 12, zIndex: 4, pointerEvents: "none",
                    fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                    color: cur.c, background: `${cur.c}1c`, border: `1px solid ${cur.c}4d`,
                  }}>
                    <SwapValue k={"L" + is} size={9} color={cur.c}>{tt(cur)}</SwapValue>
                  </span>

                  {/* الأدلة الأربعة المحلولة تتقارب نحو مؤشر الفجوة */}
                  {is === 3 && (
                    <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
                      {L.map((x, k) => (
                        <span key={k} style={{
                          position: "absolute", width: 6, height: 6, borderRadius: 99, background: x.c,
                          insetInlineEnd: 22, top: 16 + k * 17,
                          animation: `lensConverge .62s ${0.1 + k * 0.05}s cubic-bezier(.4,0,.2,1) forwards`,
                        }} />
                      ))}
                    </span>
                  )}
                  <span style={{ position: "absolute", bottom: 10, insetInlineEnd: 12, display: "flex", gap: 4, zIndex: 4, pointerEvents: "none" }}>
                    {L.map((x, k) => (
                      <span key={k} style={{ width: 5, height: 5, borderRadius: 99,
                        background: is >= x.at ? x.c : T.line, transition: "background .35s" }} />
                    ))}
                  </span>
                </>
              );
            })()}

            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 44, height: 44, borderRadius: 15, display: "grid", placeItems: "center", background: `${T[o.c]}1c`, border: `1px solid ${T[o.c]}4d`, flexShrink: 0 }}>
                <o.icon size={19} color={T[o.c]} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{t(o.en, o.ar)}</div>
                <div style={{ fontSize: 10.5, color: T[o.c], marginTop: 3, fontWeight: 600 }}>{tt(o.where)}</div>
              </div>
              <div style={{ textAlign: "end", flexShrink: 0 }}>
                <div style={{ position: "relative", fontSize: 17, fontWeight: 700, color: T[o.c], lineHeight: 1, minWidth: 38, zIndex: 3 }}>
                  {is >= 4
                    ? <SwapValue k="gap" size={17} color={T[o.c]}>{t(`${o.gap}%`, `${toAr(o.gap)}٪`)}</SwapValue>
                    : <span style={{ opacity: .3 }}>—</span>}
                  {is === 4 && !wantsStill() && (
                    <span aria-hidden="true" style={{ position: "absolute", insetInlineStart: "50%", top: "50%",
                      width: 34, height: 34, marginInlineStart: -17, marginTop: -17, borderRadius: 99,
                      border: `1.4px solid ${T[o.c]}`, animation: "agHalo .7s ease-out forwards", pointerEvents: "none" }} />
                  )}
                </div>
                <div style={{ fontSize: 8.5, color: T.faint, letterSpacing: "0.06em", marginTop: 3 }}>{t("GAP INDEX", "مؤشر الفجوة")}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 10, lineHeight: 1.5 }}>{tt(o.demand)}</div>
            {is >= 4 && (
              <DecisionReason
                ar="يعتمد المؤشر على الطلب، والطاقة المرخّصة، والموقع، والفجوة السوقية."
                en="The index is based on demand, licensed capacity, location and unmet need." />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 11 }}>
              <GapBar v={is >= 4 ? o.gap : 0} c={o.c} />
              <span style={{ fontSize: 10.5, whiteSpace: "nowrap", position: "relative", zIndex: 3,
                color: is === 0 ? T.coral : T.dim,
                fontWeight: is === 0 ? 800 : 400,
                transform: is === 0 ? "scale(1.14)" : "scale(1)",
                opacity: is < 4 && is !== 0 ? .34 : 1,
                transition: "all .42s cubic-bezier(.22,.9,.3,1)" }}>{tt(o.volume)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, paddingTop: 9, borderTop: `1px solid ${T.line}` }}>
              <Sparkles size={10} color={T.ai} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 9.5, lineHeight: 1.45, position: "relative", zIndex: 3,
                color: is === 3 ? T.gold : T.faint,
                fontWeight: is === 3 ? 700 : 400,
                opacity: is < 4 && is !== 3 ? .34 : 1,
                transition: "all .42s cubic-bezier(.22,.9,.3,1)" }}>
                {t("Signal: ", "مصدر المؤشر: ")}{tt(o.signal)}
              </span>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => go("inv:demand")} className="glass" style={{ margin: "16px 24px 0", width: "calc(100% - 48px)", borderRadius: 18, padding: 15, display: "flex", alignItems: "center", gap: 11, textAlign: "start", border: `1px solid ${T.gold}55` }}>
        <BarChart3 size={16} color={T.gold} />
        <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{t("Review the demand indicators", "استعراض مؤشرات الطلب")}</span>
        <Fwd size={15} color={T.gold} />
      </button>
    </div>
  );
};

/* الخطوة ٢ — مؤشرات الطلب */
const InvDemand = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  const [district, setDistrict] = useState(0);
  /* ١ نمو المنحنى · ٢ إبراز الموسمين */
  const cs = useSequence(2, 780);

  /* أشهر السنة الهجرية — الذروة في رمضان وذي الحجة */
  const MONTHS = [
    { ar:"محرم", en:"Muharram", s:"مح" }, { ar:"صفر", en:"Safar", s:"صف" },
    { ar:"ربيع الأول", en:"Rabi I", s:"ر١" }, { ar:"ربيع الآخر", en:"Rabi II", s:"ر٢" },
    { ar:"جمادى الأولى", en:"Jumada I", s:"ج١" }, { ar:"جمادى الآخرة", en:"Jumada II", s:"ج٢" },
    { ar:"رجب", en:"Rajab", s:"رجب" }, { ar:"شعبان", en:"Shaban", s:"شع" },
    { ar:"رمضان", en:"Ramadan", short:{ar:"رمضان",en:"Ramadan"}, season:true }, { ar:"شوال", en:"Shawwal", s:"شو" },
    { ar:"ذو القعدة", en:"Dhul-Qadah", s:"ذق" }, { ar:"ذو الحجة", en:"Dhul-Hijjah", short:{ar:"ذو الحجة",en:"Hijjah"}, season:true },
  ];

  const districts = [
    { l:{en:"Al-Shawqiyyah",ar:"الشوقية"},
      bars:[42,40,44,46,50,54,62,74,96,70,64,88],
      peak:{en:"Ramadan",ar:"رمضان"}, up:{en:"+38%",ar:"+٣٨٪"},
      note:{en:"Catering demand more than doubles in Ramadan",ar:"طلب الإعاشة يتضاعف في رمضان"} },
    { l:{en:"Al-Aziziyyah",ar:"العزيزية"},
      bars:[38,36,38,40,44,48,56,64,78,58,72,96],
      peak:{en:"Dhul-Hijjah",ar:"ذو الحجة"}, up:{en:"+31%",ar:"+٣١٪"},
      note:{en:"Accommodation peaks with the Hajj season",ar:"ذروة الإسكان مع موسم الحج"} },
    { l:{en:"Ajyad",ar:"أجياد"},
      bars:[58,56,58,60,62,66,72,80,90,74,78,94],
      peak:{en:"Dhul-Hijjah",ar:"ذو الحجة"}, up:{en:"+22%",ar:"+٢٢٪"},
      note:{en:"Mobility demand rises across both seasons",ar:"طلب التنقّل يرتفع في الموسمين"} },
  ];
  const d = districts[district];
  const mx = Math.max(...d.bars);

  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <InvHeader onMenu={onMenu} eyebrow={t("Across the Hijri year", "على مدار السنة الهجرية")} title={t("Demand indicators", "مؤشرات الطلب")}
        right={<AIChip ar="ذكاء تحليل الطلب" en="Demand Analytics AI" solid />} />
      <div style={{ display: "flex", gap: 8, padding: "14px 24px 0", overflowX: "auto" }}>
        {districts.map((x, i) => <Chip key={i} active={district === i} onClick={() => setDistrict(i)}>{tt(x.l)}</Chip>)}
      </div>

      <div className="glass" style={{ margin: "14px 20px 0", borderRadius: 22, padding: "18px 12px 14px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, padding: "0 4px" }}>
          <div>
            <div style={{ fontSize: 10, color: T.faint, letterSpacing: "0.08em" }}>{t("PEAK SEASON", "ذروة الموسم")}</div>
            <div className="display" style={{ fontSize: 21, color: T.text, marginTop: 3 }}>{tt(d.peak)}</div>
            <div style={{ fontSize: 10, color: T.gold, marginTop: 4, fontWeight: 600 }}>{t("Hijri year 1448", "السنة الهجرية ١٤٤٨هـ")}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.emerald, display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={14} /> {tt(d.up)}
          </span>
        </div>

        {/* منحنى السنة الهجرية */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 110, padding: "0 2px" }}>
          {d.bars.map((v, i) => {
            const m = MONTHS[i];
            const top = v === mx;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div className="ag-seq" style={{
                  width: "100%", height: `${v * 0.58}px`, borderRadius: 3.5,
                  background: cs >= 2 && (top || m.season) ? (top ? T.goldGrad : `${T.gold}80`) : `${T.gold}2e`,
                  boxShadow: cs >= 2 && top ? `0 0 12px ${T.gold}80` : "none",
                  transformOrigin: "bottom",
                  animation: `agBarGrow .55s ${i * 0.045}s cubic-bezier(.22,.9,.3,1) both`,
                  transition: "background .5s, box-shadow .5s",
                  opacity: cs >= 2 && !m.season && !top ? .5 : 1,
                }} />
                {/* رقم الشهر */}
                <span style={{
                  fontSize: 9.5, fontWeight: m.season ? 800 : 500,
                  color: m.season ? T.gold : T.faint, whiteSpace: "nowrap",
                  background: m.season ? `${T.gold}1f` : "transparent",
                  border: `1px solid ${m.season ? T.gold + "55" : "transparent"}`,
                  borderRadius: 99, padding: m.season ? "1px 5px" : "1px 0", minWidth: 16, textAlign: "center",
                }}>
                  {t(String(i + 1), toAr(i + 1))}
                </span>
                {/* اسم الشهر الموسمي تحت رقمه */}
                <span style={{
                  fontSize: 7.5, fontWeight: 800, color: T.gold, lineHeight: "9px",
                  opacity: m.season ? 1 : 0, height: 18, textAlign: "center", width: "260%",
                }}>{m.short ? tt(m.short) : ""}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
          <span style={{ width: 9, height: 9, borderRadius: 2.5, background: T.goldGrad, flexShrink: 0 }} />
          <span style={{ fontSize: 10.5, color: T.dim, flex: 1, lineHeight: 1.45 }}>{tt(d.note)}</span>
        </div>
        <div style={{ fontSize: 9.5, color: T.faint, marginTop: 8, textAlign: "center" }}>
          {t("Months of the Hijri year 1448 — in-app requests", "أشهر السنة الهجرية ١٤٤٨هـ — طلبات داخل التطبيق")}
        </div>
      </div>

      <SectionTitle eyebrow={t("Demand vs licensed capacity", "الطلب مقابل الطاقة المرخّصة")} title={t("Underserved services", "خدمات دون التغطية")} />
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 24px" }}>
        {[
          { en:"Catering during peak seasons", ar:"خدمات الإعاشة في المواسم", v:{en:"4.2×",ar:"٤٫٢×"}, c:T.coral },
          { en:"Accessible transport", ar:"تنقّل ميسّر لذوي الإعاقة وكبار السن", v:{en:"3.6×",ar:"٣٫٦×"}, c:T.purple },
          { en:"Family units, extended stay", ar:"وحدات عائلية للإقامة الطويلة", v:{en:"2.4×",ar:"٢٫٤×"}, c:T.blue },
          { en:"Baggage & logistics services", ar:"خدمات الحقائب واللوجستيات", v:{en:"1.9×",ar:"١٫٩×"}, c:T.gold },
        ].map((x, i) => (
          <div key={i} className="glass" style={{ borderRadius: 16, padding: "13px 15px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: T.text, flex: 1, lineHeight: 1.4 }}>{t(x.en, x.ar)}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: x.c, whiteSpace: "nowrap" }}>{tt(x.v)}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: T.faint, padding: "10px 26px 0", lineHeight: 1.5 }}>
        {t("Ratio of demand to licensed capacity.", "نسبة الطلب إلى الطاقة الاستيعابية المرخّصة.")}
      </div>

      {/* مصادر الإشارة السلوكية */}
      <div style={{ margin: "18px 24px 0", borderRadius: 20, padding: 16, background: T.aiGrad, border: `1px solid ${T.ai}3d` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(234,246,241,.7)", letterSpacing: "0.06em", marginBottom: 11 }}>
          {t("BEHAVIOURAL SIGNALS BEHIND THESE INDICATORS", "الإشارات السلوكية وراء هذه المؤشرات")}
        </div>
        {[
          { ar:"عمليات البحث داخل التطبيق", en:"In-app searches", v:{ar:"٤٨٬٢٠٠",en:"48,200"} },
          { ar:"طلبات بلا نتيجة مطابقة", en:"Searches with no match", v:{ar:"٧٬٤٠٠",en:"7,400"} },
          { ar:"المسارات المطلوبة نحو النطاق", en:"Routes requested to the district", v:{ar:"١٩٬٦٠٠",en:"19,600"} },
          { ar:"العناصر المحفوظة والمفضلة", en:"Saved and favourited items", v:{ar:"٣٬١٠٠",en:"3,100"} },
        ].map((x,i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: i ? "1px solid rgba(234,246,241,.12)" : "none" }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: "#4FCFA6", flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: "rgba(234,246,241,.88)", flex: 1, lineHeight: 1.4 }}>{t(x.en, x.ar)}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#F0D48A", whiteSpace: "nowrap" }}>{tt(x.v)}</span>
          </div>
        ))}
        <div style={{ fontSize: 9.5, color: "rgba(234,246,241,.5)", marginTop: 10, lineHeight: 1.55 }}>
          {t("Aggregated and anonymised — last 12 Hijri months.", "بيانات مجمّعة ومجهّلة الهوية — آخر اثني عشر شهراً هجرياً.")}
        </div>
      </div>

      <button onClick={() => go("inv:map")} className="glass" style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", borderRadius: 18, padding: 15, display: "flex", alignItems: "center", gap: 11, textAlign: "start", border: `1px solid ${T.gold}55` }}>
        <MapPin size={16} color={T.gold} />
        <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{t("Assess locations on the map", "تقييم المواقع على الخريطة")}</span>
        <Fwd size={15} color={T.gold} />
      </button>
    </div>
  );
};

/* الخطوة ٣ — التحليل المكاني */
const InvMap = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  const [sel, setSel] = useState(0);
  /* ١ قياس الطلب · ٢ قياس الوصول · ٣ استقرار المؤشر */
  const gs = useSequence(3, 560);
  const dark = T.mode === "dark";
  const road = dark ? "rgba(244,237,222," : "rgba(36,27,11,";
  const sites = [
    { x:150, y:262, l:{en:"Al-Shawqiyyah",ar:"الشوقية"}, score:90, c:T.coral,
      why:{en:"On the main arrival corridor · 12 licensed facilities · 14 min to the Central Area",
           ar:"على المسار الرئيس للقادمين — ١٢ منشأة مرخّصة — ١٤ دقيقة إلى نطاق المركزية"} },
    { x:262, y:150, l:{en:"Al-Aziziyyah",ar:"العزيزية"}, score:82, c:T.blue,
      why:{en:"Holds 37% of licensed pilgrim buildings · established services · 18 min to the Haram",
           ar:"يستحوذ على ٣٧٪ من عمائر الحجاج المرخّصة — خدمات قائمة — ١٨ دقيقة إلى الحرم"} },
    { x:112, y:170, l:{en:"Ajyad",ar:"أجياد"}, score:68, c:T.purple,
      why:{en:"Closest to the Haram, but the highest concentration of existing operators",
           ar:"الأقرب إلى الحرم، إلا أنه الأعلى تركّزاً في المنشآت القائمة"} },
  ];
  const s = sites[sel];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <InvHeader onMenu={onMenu} eyebrow={t("District comparison", "مقارنة النطاقات")} title={t("Most suitable location", "الموقع الأنسب")}
        right={<AIChip ar="ذكاء التحليل المكاني" en="Geospatial AI" solid />} />
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "12px 24px 0" }}>
        {[
          { at:1, ar:"كثافة الطلب", en:"Demand density" },
          { at:2, ar:"سهولة الوصول", en:"Accessibility" },
          { at:3, ar:"تركّز المنشآت", en:"Facility concentration" },
        ].map((f,i)=>{
          const on = gs >= f.at;
          return (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, fontWeight:600,
              color: on ? T.ai : T.faint, background: on ? `${T.ai}14` : "transparent",
              border:`1px solid ${on ? T.ai + "44" : T.line}`, padding:"5px 10px", borderRadius:99,
              transition:"all .4s cubic-bezier(.22,.9,.3,1)" }}>
              {on ? <CheckCircle2 size={9} /> : <span style={{ width:4, height:4, borderRadius:99, background:T.faint }} />}
              {t(f.en, f.ar)}
            </span>
          );
        })}
      </div>

      <div style={{ margin: "12px 16px 0", borderRadius: 24, overflow: "hidden", background: T.mapBg, border: `1px solid ${T.line}`, position: "relative", height: 336 }}>
        <svg viewBox="0 0 390 336" style={{ width: "100%", height: "100%" }}>
          <g stroke={road + ".1)"} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M195,170 L40,50" /><path d="M195,170 L360,40" /><path d="M195,170 L370,230" />
            <path d="M195,170 L150,332" /><path d="M195,170 L20,270" />
          </g>
          <g stroke={road + ".05)"} strokeWidth="3" fill="none">
            <circle cx="195" cy="170" r="62" /><circle cx="195" cy="170" r="116" />
          </g>
          {sites.map((p, i) => (
            <circle key={"h"+i} cx={p.x} cy={p.y} r={gs >= 1 ? p.score * 0.42 : 2} fill={p.c}
              opacity={sel === i ? 0.2 : 0.08}
              style={{ transition: `r .8s ${i * 0.12}s cubic-bezier(.22,.9,.3,1)` }} />
          ))}
          {/* قوى مكانية تتنافس حول الموقع المختار */}
          {!wantsStill() && (
            <g key={"gf" + sel}>
              <SpatialPulse cx={sites[sel].x} cy={sites[sel].y} r={112} color={sites[sel].c} rings={3} dur={1700} delay={200} />
              {sites.map((p, i) => i !== sel && (
                <FlowPath key={"pull"+i} d={`M${p.x},${p.y} L${sites[sel].x},${sites[sel].y}`}
                  color={T.faint} width={1} dur={620} delay={520 + i * 110} glow={false} opacity={.22} />
              ))}
              <circle cx={sites[sel].x} cy={sites[sel].y} r="5.5" fill="none" stroke={sites[sel].c} strokeWidth="1.4"
                opacity="0" style={{ animation: "agTick .5s 1.5s forwards" }} />
            </g>
          )}
          <g transform="rotate(45 195 170)">
            <rect x="188" y="163" width="14" height="14" rx="1.5" fill={dark ? "#0a0a0d" : "#1c1a16"} stroke={T.gold} strokeWidth="1.3" />
          </g>
          <text x="195" y="200" textAnchor="middle" fill={road + ".55)"} fontSize="9.5">{t("The Grand Mosque", "المسجد الحرام")}</text>
          {sites.map((p, i) => (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
              <circle cx={p.x} cy={p.y} r={sel === i ? 10 : 7} fill={p.c} stroke={dark ? "#070B14" : "#FFFDF6"} strokeWidth="2.5" />
              {sel === i && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke={p.c}>
                <animate attributeName="r" values="10;24" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values=".7;0" dur="2s" repeatCount="indefinite" />
              </circle>}
              <text x={p.x} y={p.y - 15} textAnchor="middle" fill={road + ".7)"} fontSize="9.5" fontWeight="600">{tt(p.l)}</text>
            </g>
          ))}
        </svg>
        <div className="glass" style={{ position: "absolute", bottom: 10, insetInlineStart: 12, borderRadius: 12, padding: "7px 11px", fontSize: 9.5, color: T.dim }}>
          {t("Circle size reflects the demand gap", "حجم الدائرة يعبّر عن فجوة الطلب")}
        </div>
      </div>
      <div className="glass" style={{ margin: "14px 24px 0", borderRadius: 20, padding: 16, border: `1px solid ${s.c}55` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div className="display" style={{ fontSize: 18, color: T.text }}>{tt(s.l)}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: s.c, background: `${s.c}1c`, border: `1px solid ${s.c}44`, padding: "4px 11px", borderRadius: 99, whiteSpace: "nowrap" }}>
            {t("Site index", "مؤشر الموقع")}{" "}
            {gs >= 3 ? <SwapValue k={"si" + sel} size={11} color={s.c}>{t(s.score, toAr(s.score))}</SwapValue> : <span style={{ opacity: .4 }}>—</span>}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: T.dim, marginTop: 8, lineHeight: 1.6 }}>{tt(s.why)}</div>
      </div>
      <button onClick={() => go("inv:compare")} className="glass" style={{ margin: "14px 24px 0", width: "calc(100% - 48px)", borderRadius: 18, padding: 15, display: "flex", alignItems: "center", gap: 11, textAlign: "start", border: `1px solid ${T.gold}55` }}>
        <Scale size={16} color={T.gold} />
        <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{t("Compare the opportunities", "مقارنة الفرص")}</span>
        <Fwd size={15} color={T.gold} />
      </button>
    </div>
  );
};

/* الخطوة ٤ — دعم اتخاذ القرار */
const InvCompare = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  /* صف يُقيَّم كل خطوة ثم الخلاصة */
  const ks = useSequence(7, 400);
  const rows = [
    { k:{en:"Gap index",ar:"مؤشر الفجوة"}, get:o => t(`${o.gap}%`, `${toAr(o.gap)}٪`), best:0 },
    { k:{en:"In-app monthly demand",ar:"حجم الطلب الشهري داخل التطبيق"}, get:o => tt(o.volume), best:0 },
    { k:{en:"Demand trend",ar:"اتجاه الطلب"}, get:o => tt(o.trend) },
    { k:{en:"Coverage gap",ar:"فجوة التغطية"}, get:o => tt(o.coverage), best:0 },
    { k:{en:"Footfall",ar:"كثافة الحركة"}, get:o => tt(o.footfall) },
    { k:{en:"Peak season",ar:"ذروة الموسم"}, get:o => tt(o.peak) },
  ];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <InvHeader onMenu={onMenu} eyebrow={t("Side by side", "جنباً إلى جنب")} title={t("Comparing opportunities", "مقارنة الفرص")}
        right={<AIChip ar="ذكاء دعم القرار" en="Decision Intelligence AI" solid />} />
      <div style={{ fontSize: 11.5, color: T.dim, padding: "10px 24px 0", lineHeight: 1.65 }}>
        {t("Unified behavioural indicators across the three areas. The system presents the data; the investment decision remains yours.",
           "مؤشرات سلوكية موحّدة للمجالات الثلاثة. المنظومة تعرض البيانات، والقرار الاستثماري يبقى لك.")}
      </div>

      <div className="glass" style={{ margin: "14px 18px 0", borderRadius: 20, padding: "14px 10px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", paddingBottom: 10, borderBottom: `1px solid ${T.line}` }}>
          <div style={{ width: 58, flexShrink: 0 }} />
          {OPPS.map((o, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center", padding: "0 2px" }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, margin: "0 auto 6px", display: "grid", placeItems: "center", background: `${T[o.c]}1c`, border: `1px solid ${T[o.c]}4d` }}>
                <o.icon size={14} color={T[o.c]} />
              </div>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: T.text, lineHeight: 1.25 }}>{tt(o.short)}</div>
            </div>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={ri} style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: ri < rows.length - 1 ? `1px solid ${T.line}` : "none",
            opacity: ks > ri ? 1 : 0.22, transform: ks > ri ? "translateY(0)" : "translateY(4px)",
            transition: "opacity .4s, transform .4s cubic-bezier(.22,.9,.3,1)" }}>
            <div style={{ width: 58, flexShrink: 0, fontSize: 8.5, color: T.faint, lineHeight: 1.3 }}>{tt(r.k)}</div>
            {OPPS.map((o, i) => {
              const isBest = r.best === i;
              return (
                <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center", padding: "0 2px" }}>
                  <span style={{
                    fontSize: 9.5, fontWeight: isBest ? 700 : 500,
                    color: isBest ? T.emerald : T.text,
                    background: isBest ? `${T.emerald}18` : "transparent",
                    border: isBest ? `1px solid ${T.emerald}44` : "1px solid transparent",
                    padding: "4px 5px", borderRadius: 8, display: "inline-block", lineHeight: 1.3,
                  }}>{r.get(o)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ margin: "14px 24px 0", minHeight: 118 }}>
      {ks < 7 ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 30 }}>
          <Thinking label={t("Weighing the indicators", "ترجيح المؤشرات")} />
        </div>
      ) : (
      <div className="ag-seq" style={{ borderRadius: 20, padding: 16, background: T.aiGrad, border: `1px solid ${T.ai}3d`, display: "flex", gap: 12, alignItems: "flex-start", animation: "agRise .45s both" }}>
        <Sparkles size={16} color={T.mode === "dark" ? "#4FCFA6" : "#7FE8C6"} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9.5, letterSpacing: "0.1em", color: T.mode === "dark" ? "#4FCFA6" : "#7FE8C6", fontWeight: 700 }}>{t("ANALYTICAL SUMMARY", "خلاصة تحليلية")}</div>
          <div style={{ fontSize: 12.5, color: "#F6F1E3", marginTop: 6, lineHeight: 1.7 }}>
            {t("Catering in Al-Shawqiyyah shows the highest in-app demand and the widest coverage gap, peaking in Ramadan and Dhul-Hijjah. Mobility demand holds steady year-round, while accommodation concentrates in the Hajj season.",
               "تسجّل الإعاشة في الشوقية أعلى طلب داخل التطبيق وأوسع فجوة تغطية، وتبلغ ذروتها في رمضان وذي الحجة. أما التنقّل فطلبه مستقر طوال العام، والإسكان يتركّز في موسم الحج.")}
          </div>
        </div>
      </div>
      )}
      </div>

      <AIUsedStrip caps={[
        { ar:"ذكاء مطابقة الفرص", en:"Opportunity Matching AI" },
        { ar:"ذكاء تحليل البيانات السلوكية", en:"Behavioural Analytics AI" },
        { ar:"ذكاء التحليل المكاني", en:"Geospatial AI" },
      ]} />
      <button onClick={() => go("inv:alerts")} style={{ margin: "12px 24px 0", width: "calc(100% - 48px)", padding: 15, borderRadius: 18, border: "none", background: T.goldGrad, color: T.ink, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 28px ${T.gold}4d` }}>
        <Bell size={15} /> {t("Follow market alerts", "متابعة تنبيهات السوق")}
      </button>
    </div>
  );
};

/* الخطوة ٥ — التنبيهات الاستباقية */
const InvAlerts = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  const ms = useSequence(3, 560);
  const items = [
    { icon: TrendingUp, k:{en:"DEMAND",ar:"الطلب"}, c:T.coral,
      tEn:"Demand has risen for an activity in an area you follow",
      tAr:"ارتفع الطلب على أحد الأنشطة في منطقة تتابعها",
      sEn:"Catering in Al-Shawqiyyah — gap index",
      sAr:"الإعاشة في الشوقية — مؤشر الفجوة",
      from:{ar:"٩١%",en:"91%"}, to:{ar:"٩٤%",en:"94%"}, up:true },
    { icon: Target, k:{en:"OPPORTUNITY",ar:"فرصة"}, c:T.gold,
      tEn:"A new opportunity has appeared in sectors that interest you",
      tAr:"ظهرت فرصة جديدة ضمن القطاعات التي تهمك",
      sEn:"Accessible mobility — Central Area",
      sAr:"خدمات تنقّل ميسّرة — نطاق المركزية" },
    { icon: BarChart3, k:{en:"INDICATOR",ar:"مؤشر"}, c:T.blue,
      tEn:"A market indicator tied to a saved opportunity has changed",
      tAr:"تغيّر أحد مؤشرات السوق المرتبطة بفرصة محفوظة",
      sEn:"Al-Aziziyyah — site index",
      sAr:"العزيزية — مؤشر الموقع",
      from:{ar:"٧٣",en:"73"}, to:{ar:"٦٨",en:"68"}, up:false },
  ];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <InvHeader onMenu={onMenu} eyebrow={t("What changed", "ما الذي تغيّر")} title={t("Market alerts", "تنبيهات السوق")}
        right={<AIChip ar="ذكاء الاستباق" en="Proactive AI" solid />} />
      <div style={{ fontSize: 11.5, color: T.dim, padding: "10px 24px 0", lineHeight: 1.65 }}>
        {t("Immediate alerts when demand indicators shift or new entities are licensed.",
           "تنبيهات فورية عند تغيّر مؤشرات الطلب أو ترخيص منشآت جديدة.")}
      </div>
      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 24px 0" }}>
        {items.map((x, i) => (
          <button key={i} onClick={() => go("inv:opportunities")} className="glass" style={{ borderRadius: 20, padding: 15, display: "flex", gap: 13, alignItems: "center", textAlign: "start",
            position: "relative", overflow: "hidden",
            opacity: ms > i ? 1 : 0, transform: ms > i ? "translateY(0)" : "translateY(12px)",
            transition: "opacity .45s, transform .45s cubic-bezier(.22,.9,.3,1)" }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: `${x.c}1a`, border: `1px solid ${x.c}44`, flexShrink: 0 }}><x.icon size={18} color={x.c} /></div>
            {ms > i && !wantsStill() && (
              <span aria-hidden="true" style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: "100%",
                pointerEvents: "none", borderRadius: 20,
                background: `linear-gradient(90deg, transparent, ${x.c}1f, transparent)`,
                animation: "shockRun .85s cubic-bezier(.3,0,.3,1) forwards" }} />
            )}
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.1em", color: x.c, fontWeight: 700 }}>{tt(x.k)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text, marginTop: 3, lineHeight: 1.4 }}>{t(x.tEn, x.tAr)}</div>
              <div style={{ fontSize: 10.5, color: T.faint, marginTop: 3, lineHeight: 1.5, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span>{t(x.sEn, x.sAr)}</span>
                {x.from && <Deform from={tt(x.from)} to={tt(x.to)} up={x.up} run={ms > i} delay={260} />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   بوابة قطاع الأعمال — الظهور والطلب والأداء والفرص
═════════════════════════════════════════════ */
const BizHeader = ({ eyebrow, title, right, onMenu }) => {
  const { T, t, tt } = useApp();
  return (
    <div style={{ padding: "18px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MenuButton onClick={onMenu} />
        <span style={{ marginInlineStart: "auto", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: T.aiInk, background: T.aiGrad, border: `1px solid ${T.ai}4d`, padding: "6px 11px", borderRadius: 99 }}>
          {t("BUSINESS PORTAL", "بوابة قطاع الأعمال")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
        <div>
          {eyebrow && <div style={{ fontSize: 10, letterSpacing: "0.14em", color: T.gold, fontWeight: 700 }}>{eyebrow}</div>}
          <div className="display" style={{ fontSize: 22, color: T.text, marginTop: 2 }}>{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
};

/* ١ — الظهور والبحث */
const BizVisibility = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  /* ذكاء الاكتشاف: ١ الاستعلام · ٢ الفهم · ٣ المطابقة · ٤ النتيجة */
  const ds = useSequence(4, 520);
  const matched = false; // هذا المثال يمثّل بحثاً لم يظهر فيه النشاط

  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BizHeader onMenu={onMenu} eyebrow={t("How people find you", "كيف يصل إليك المستفيدون")} title={t("Visibility", "الظهور والبحث")}
        right={<AIChip ar="ذكاء الاكتشاف والبحث" en="Discovery & Search AI" solid />} />

      {/* مسار الاستعلام — بحث يدخل النظام ثم يُطابق أو يفوت */}
      <div data-morph-target="business" className="glass" style={{ margin: "14px 24px 0", borderRadius: 20, padding: 15, border: `1px solid ${matched ? T.emerald : T.coral}44` }}>
        {/* الاستعلام */}
        <div style={{ display: "flex", alignItems: "center", gap: 9,
          opacity: ds >= 0 ? 1 : 0, transform: ds >= 0 ? "translateY(0)" : "translateY(-6px)", transition: "all .4s" }}>
          <Search size={14} color={T.gold} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>
            {t("\u201CFamily restaurant near Al-Haram\u201D", "«مطعم عائلي قرب الحرم»")}
          </span>
        </div>

        {/* الفهم — المفاهيم تُستخرج */}
        <div style={{ marginTop: 11, display: "flex", gap: 6, flexWrap: "wrap", minHeight: 24 }}>
          {[{ at:1, ar:"عائلي", en:"family" }, { at:1, ar:"مطعم", en:"restaurant" }, { at:2, ar:"قرب الحرم", en:"near Al-Haram" }].map((c,i)=>(
            <span key={i} style={{ fontSize: 10, fontWeight: 600, color: T.ai,
              background: `${T.ai}12`, border: `1px solid ${T.ai}3d`, padding: "4px 9px", borderRadius: 99,
              opacity: ds >= c.at ? 1 : 0,
              transform: ds >= c.at ? "translateY(0) scale(1)" : "translateY(5px) scale(.94)",
              transition: `all .35s ${i * 0.07}s cubic-bezier(.34,1.4,.5,1)` }}>{t(c.en, c.ar)}</span>
          ))}
        </div>

        {/* حقل المطابقة — مرشّحون يُقيَّمون ثم يُرفضون أو يتصلون */}
        <div style={{ position: "relative", height: 88, margin: "6px 0 2px" }}>
          <svg viewBox="0 0 300 88" aria-hidden="true" style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
            {/* المرشّحون */}
            {[[92,18],[92,44],[92,70],[168,30],[168,60]].map(([x,y],i)=>{
              const rejected = ds >= 3 && i !== 4;
              return (
                <g key={i} style={{ opacity: ds >= 2 ? (rejected ? .16 : 1) : 0, transition: `opacity .45s ${i*0.05}s` }}>
                  <circle cx={x} cy={y} r="3.4" fill={rejected ? T.faint : T.ai} />
                </g>
              );
            })}
            {/* محاولات الاتصال */}
            {ds >= 2 && [[18,44,92,18],[18,44,92,44],[18,44,92,70]].map((c,i)=>(
              <FlowPath key={"a"+i} d={`M${c[0]},${c[1]} L${c[2]},${c[3]}`} color={T.ai} width={1}
                dur={420} delay={i*70} glow={false} opacity={ds >= 3 && i !== 1 ? .12 : .5} />
            ))}
            {ds >= 3 && [[92,44,168,30],[92,44,168,60]].map((c,i)=>(
              <FlowPath key={"b"+i} d={`M${c[0]},${c[1]} L${c[2]},${c[3]}`} color={i===1?T.coral:T.faint} width={1.2}
                dur={420} delay={120+i*80} glow={i===1} opacity={i===1?.75:.14} />
            ))}
            {/* نشاطك — لم يتصل */}
            <g style={{ opacity: ds >= 3 ? 1 : 0, transition: "opacity .45s" }}>
              <circle cx="252" cy="44" r="6" fill="none" stroke={T.coral} strokeWidth="1.6" strokeDasharray="3 3" />
              <line x1="248" y1="40" x2="256" y2="48" stroke={T.coral} strokeWidth="1.4" />
              <line x1="256" y1="40" x2="248" y2="48" stroke={T.coral} strokeWidth="1.4" />
            </g>
            {ds >= 4 && <SpatialPulse cx={252} cy={44} r={26} color={T.coral} rings={2} dur={900} />}
            <circle cx="18" cy="44" r="4" fill={T.gold} opacity={ds >= 1 ? 1 : 0} style={{ transition:"opacity .4s" }} />
          </svg>
        </div>

        {/* النتيجة والسبب */}
        <div style={{ minHeight: 52 }}>
          {ds < 4 ? (
            <Thinking label={ds < 3 ? t("Matching against your listing", "المطابقة مع ملفك") : t("Checking result", "التحقق من النتيجة")} />
          ) : (
            <div className="ag-seq" style={{ animation: "agRise .4s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 99, display: "grid", placeItems: "center",
                  background: `${T.coral}1f`, border: `1px solid ${T.coral}55` }}>
                  <Plus size={11} color={T.coral} style={{ transform: "rotate(45deg)" }} />
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.coral }}>
                  {t("Your listing did not appear", "لم يظهر نشاطك")}
                </span>
              </div>
              <div style={{ fontSize: 11, color: T.dim, marginTop: 7, lineHeight: 1.6, paddingInlineStart: 30 }}>
                {t("Reason: family seating is not declared on your listing.",
                   "السبب: لم تُحدَّد معلومات القسم العائلي في ملفك.")}
              </div>
              <div style={{ fontSize: 10, color: T.faint, marginTop: 7, paddingInlineStart: 30 }}>
                {t("This search is one of 2,400 you missed this month.",
                   "هذا البحث واحد من ٢٬٤٠٠ بحث فاتك هذا الشهر.")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stagger" style={{ display: "flex", gap: 10, padding: "14px 24px 0" }}>
        {[
          [t("Appearances","مرات الظهور"), t("18,400","١٨٬٤٠٠"), t("+22%","+٢٢٪"), T.emerald],
          [t("Profile views","زيارات الصفحة"), t("4,120","٤٬١٢٠"), t("+9%","+٩٪"), T.blue],
          [t("Missed","بحث فاتك"), t("2,400","٢٬٤٠٠"), t("−","−"), T.coral],
        ].map(([a,v,s2,c],i)=>(
          <div key={i} className="glass" style={{ flex:1, borderRadius:18, padding:14,
            border: i === 2 && ds >= 4 ? `1px solid ${T.coral}55` : undefined, transition: "border-color .5s" }}>
            <div style={{ fontSize:9.5, color:T.faint }}>{a}</div>
            <div style={{ fontSize:19, fontWeight:600, color:T.text, margin:"5px 0 2px" }}>{v}</div>
            <div style={{ fontSize:9.5, color:c, fontWeight:700 }}>{s2}</div>
          </div>
        ))}
      </div>

      <SectionTitle eyebrow={t("Other missed searches", "عمليات بحث أخرى فاتتك")} title={t("And their causes", "وأسبابها")} />
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10, padding:"0 24px" }}>
        {[
          { ar:"مسار ميسّر لذوي الإعاقة", en:"Accessible route", v:{ar:"٢٬٤٠٠",en:"2,400"}, why:{ar:"لم تُحدَّد إمكانية الوصول",en:"Accessibility not declared"} },
          { ar:"توصيل حتى منتصف الليل", en:"Delivery until midnight", v:{ar:"١٬٩٠٠",en:"1,900"}, why:{ar:"ساعات العمل تنتهي ١١ م",en:"Hours end at 11 PM"} },
          { ar:"قوائم بلغات متعددة", en:"Multilingual menu", v:{ar:"١٬٢٠٠",en:"1,200"}, why:{ar:"القائمة بالعربية فقط",en:"Menu is Arabic only"} },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:18, padding:15 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.text, flex:1 }}>{tt(x)}</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.coral }}>{tt(x.v)}</span>
            </div>
            <div style={{ fontSize:10.5, color:T.faint, marginTop:6, display:"flex", alignItems:"center", gap:5 }}>
              <Sparkles size={10} color={T.ai} /> {tt(x.why)}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go("biz:demand")} className="glass" style={{ margin:"16px 24px 0", width:"calc(100% - 48px)", borderRadius:18, padding:15, display:"flex", alignItems:"center", gap:11, textAlign:"start", border:`1px solid ${T.gold}55` }}>
        <BarChart3 size={16} color={T.gold} />
        <span style={{ fontSize:12, color:T.text, flex:1 }}>{t("See the demand around you", "اطّلع على الطلب حولك")}</span>
        <Fwd size={15} color={T.gold} />
      </button>
    </div>
  );
};

/* ٢ — التفاعل والطلب */
const BizDemand = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  /* ١ نمو الأعمدة · ٢ اكتشاف الذروة · ٣ ربطها بالحي */
  const ps = useSequence(3, 700);
  const bars = [34,40,54,74,96,88,62,44,30,26,24,28];
  const hrs = ["١٢ظ","٢م","٤م","٦م","٨م","١٠م","١٢ل","٢ص","٤ص","٦ص","٨ص","١٠ص"];
  const hrsEn = ["12p","2p","4p","6p","8p","10p","12a","2a","4a","6a","8a","10a"];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BizHeader onMenu={onMenu} eyebrow={t("Hour by hour", "ساعة بساعة")} title={t("Engagement & demand", "التفاعل والطلب")}
        right={<AIChip ar="ذكاء تحليل الطلب" en="Demand Analytics AI" solid />} />

      <div className="glass" style={{ margin:"14px 20px 0", borderRadius:22, padding:"18px 14px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14, padding:"0 4px" }}>
          <div>
            <div style={{ fontSize:10, color:T.faint, letterSpacing:"0.08em" }}>{t("PEAK HOUR","ساعة الذروة")}</div>
            <div className="display" style={{ fontSize:21, color:T.text, marginTop:3 }}>{t("8:00 PM","٨:٠٠ م")}</div>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:T.emerald, display:"flex", alignItems:"center", gap:4 }}>
            <TrendingUp size={14}/> {t("+31%","+٣١٪")}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3.5, height:86 }}>
          {bars.map((v,i)=>{
            const mx = Math.max(...bars);
            const peak = v >= mx * 0.8;              // نطاق الذروة ٨–١٠ م
            const lit = ps >= 2 && peak;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div className="ag-seq" style={{ width:"100%", height:`${v*0.62}px`, borderRadius:3.5,
                  background: lit ? T.goldGrad : `${T.gold}2e`,
                  boxShadow: lit ? `0 0 12px ${T.gold}80` : "none",
                  transformOrigin: "bottom",
                  animation: `agBarGrow .5s ${i * 0.035}s cubic-bezier(.22,.9,.3,1) both`,
                  transition: "background .45s, box-shadow .45s",
                  opacity: ps >= 2 && !peak ? .45 : 1 }} />
                <span style={{ fontSize:7.5, color: lit ? T.gold : T.faint, fontWeight: lit ? 800 : 500, transition:"color .4s" }}>{t(hrsEn[i],hrs[i])}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:9.5, color:T.faint, marginTop:12, textAlign:"center" }}>
          {t("Requests across the day — last 30 days","الطلبات على مدار اليوم — آخر ٣٠ يوماً")}
        </div>
      </div>

      {/* إشارة تغادر الذروة نحو الحي */}
      {ps >= 2 && !wantsStill() && (
        <svg viewBox="0 0 300 54" aria-hidden="true" style={{ display:"block", width:"100%", height:54, pointerEvents:"none", marginTop:2 }}>
          <FlowPath d="M150,4 C150,26 92,26 92,50" color={T.gold} width={1.6} dur={620} delay={120} glow />
        </svg>
      )}

      <SectionTitle eyebrow={t("Where requests come from","من أين تأتي الطلبات")} title={t("Requesting districts","الأحياء الطالبة")} />
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10, padding:"0 24px" }}>
        {[
          { ar:"العزيزية", en:"Al-Aziziyyah", p:38, c:T.gold },
          { ar:"الشوقية", en:"Al-Shawqiyyah", p:26, c:T.coral },
          { ar:"أجياد", en:"Ajyad", p:21, c:T.blue },
          { ar:"الششة", en:"Al-Shishah", p:15, c:T.purple },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:16, padding:"13px 15px",
            border: ps >= 3 && i === 0 ? `1px solid ${T.gold}66` : undefined, transition:"border-color .5s",
            opacity: ps >= 3 && i !== 0 ? .58 : 1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:12.5, color:T.text, flex:1 }}>{tt(x)}</span>
              {ps >= 3 && i === 0 && <span className="ag-seq" style={{ fontSize:9, fontWeight:700, color:T.gold, background:`${T.gold}1c`, border:`1px solid ${T.gold}44`, padding:"3px 8px", borderRadius:99, animation:"agTick .4s both" }}>{t("at peak","في الذروة")}</span>}
              <span style={{ fontSize:12.5, fontWeight:700, color:x.c }}>{t(`${x.p}%`, `${toAr(x.p)}٪`)}</span>
            </div>
            <div style={{ height:6, borderRadius:99, background:T.line, overflow:"hidden" }}>
              <div style={{ width: ps >= 1 ? `${x.p}%` : "0%", height:"100%", borderRadius:99, background:`linear-gradient(90deg,${x.c},${x.c}88)`, transition:`width .7s ${i*0.08}s cubic-bezier(.22,.9,.3,1)` }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin:"16px 24px 0", minHeight:92 }}>
        {ps < 3 ? (
          <div style={{ display:"flex", justifyContent:"center", paddingTop:22 }}>
            <Thinking label={ps < 2 ? t("Reading the demand curve", "قراءة منحنى الطلب") : t("Linking peak to district", "ربط الذروة بالحي")} />
          </div>
        ) : (
          <div className="ag-seq" style={{ borderRadius:20, padding:16, background:T.aiGrad, border:`1px solid ${T.ai}3d`, animation:"agRise .45s both" }}>
            <div style={{ fontSize:9.5, letterSpacing:"0.1em", color:"#7FE8C6", fontWeight:700, marginBottom:8 }}>
              {t("PATTERN DETECTED", "نمط مكتشَف")}
            </div>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#F6F1E3", lineHeight:1.5 }}>
              {t("Peak demand — 8:00 to 10:00 PM", "ذروة الطلب — من ٨ إلى ١٠ مساءً")}
            </div>
            <div style={{ fontSize:11, color:"rgba(234,246,241,.72)", marginTop:8, lineHeight:1.7 }}>
              {t("Al-Aziziyyah sends 38% of requests in this window — the strongest district at your peak hour.",
                 "يرسل حي العزيزية ٣٨٪ من الطلبات في هذه النافذة — أقوى حي في ساعة ذروتك.")}
            </div>
          </div>
        )}
      </div>

      <AIUsedStrip caps={[
        { ar:"ذكاء تحليل البيانات السلوكية", en:"Behavioural Analytics AI" },
        { ar:"ذكاء السياق", en:"Context-Aware AI" },
        { ar:"ذكاء التحليل المكاني", en:"Geospatial AI" },
      ]} />
    </div>
  );
};

/* ٣ — الأداء */
const BizPerformance = ({ onMenu }) => {
  const { T, t, tt } = useApp();
  /* ١ قراءة المؤشرات · ٢ رصد المنخفض · ٣ التشخيص */
  const fs = useSequence(3, 640);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BizHeader onMenu={onMenu} eyebrow={t("Service quality", "جودة الخدمة")} title={t("Performance", "الأداء")}
        right={<AIChip ar="ذكاء التشغيل" en="Operational Intelligence AI" solid />} />

      <div className="stagger" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, padding:"16px 24px 0" }}>
        {[
          { ar:"معدّل الاستجابة", en:"Response rate", v:{ar:"٩٤٪",en:"94%"}, s:{ar:"خلال ٥ دقائق",en:"within 5 minutes"}, c:T.emerald, icon: Clock3 },
          { ar:"إتمام الطلبات", en:"Fulfilment", v:{ar:"٩٧٪",en:"97%"}, s:{ar:"دون إلغاء",en:"no cancellations"}, c:T.blue, icon: CheckCircle2 },
          { ar:"التقييم", en:"Rating", v:{ar:"٤٫٧",en:"4.7"}, s:{ar:"١٤٢ مراجعة",en:"142 reviews"}, c:T.gold, icon: Star },
          { ar:"العودة للنشاط", en:"Repeat visits", v:{ar:"٣١٪",en:"31%"}, s:{ar:"خلال ٩٠ يوماً",en:"within 90 days"}, c:T.purple, icon: TrendingUp },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:20, padding:15,
            opacity: fs >= 1 ? 1 : 0, transform: fs >= 1 ? "translateY(0)" : "translateY(10px)",
            transition: `opacity .4s ${i*0.08}s, transform .4s ${i*0.08}s cubic-bezier(.22,.9,.3,1)` }}>
            <div style={{ width:34, height:34, borderRadius:12, display:"grid", placeItems:"center", background:`${x.c}1c`, border:`1px solid ${x.c}4d`, marginBottom:11 }}>
              <x.icon size={16} color={x.c} />
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:T.text }}>{tt(x.v)}</div>
            <div style={{ fontSize:11, color:T.text, marginTop:3, fontWeight:600 }}>{tt(x)}</div>
            <div style={{ fontSize:9.5, color:T.faint, marginTop:2 }}>{tt(x.s)}</div>
          </div>
        ))}
      </div>

      <SectionTitle eyebrow={t("Quality signals","مؤشرات الجودة")} title={t("What reviewers mention","ما يذكره المراجعون")} />
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10, padding:"0 24px" }}>
        {[
          { ar:"سرعة الخدمة", en:"Speed of service", p:82, up:true },
          { ar:"القسم العائلي", en:"Family section", p:74, up:true },
          { ar:"وقت الانتظار في الذروة", en:"Waiting time at peak", p:38, up:false },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:16, padding:"13px 15px", display:"flex", alignItems:"center", gap:10,
            border: fs >= 2 && !x.up ? `1px solid ${T.coral}66` : undefined, transition:"border-color .5s",
            opacity: fs >= 2 && x.up ? .55 : 1 }}>
            <span style={{ fontSize:12.5, color:T.text, flex:1 }}>{tt(x)}</span>
            {fs >= 2 && !x.up && <span style={{ fontSize:9, fontWeight:700, color:T.coral, background:`${T.coral}1c`, border:`1px solid ${T.coral}44`, padding:"3px 8px", borderRadius:99 }}>{t("cause","السبب")}</span>}
            <span style={{ fontSize:12.5, fontWeight:700, color: x.up?T.emerald:T.coral }}>{t(`${x.p}%`, `${toAr(x.p)}٪`)}</span>
            <TrendingUp size={13} color={x.up?T.emerald:T.coral} style={{ transform: x.up?"none":"scaleY(-1)" }} />
          </div>
        ))}
      </div>

      <div style={{ margin:"16px 24px 0", minHeight:110 }}>
      {fs < 3 ? (
        <div style={{ display:"flex", justifyContent:"center", paddingTop:26 }}>
          <Thinking label={fs < 2 ? t("Reading performance indicators", "قراءة مؤشرات الأداء") : t("Diagnosing the cause", "تشخيص السبب")} />
        </div>
      ) : (
      <div className="ag-seq" style={{ borderRadius:20, padding:16, background:T.aiGrad, border:`1px solid ${T.ai}3d`, display:"flex", gap:12, alignItems:"flex-start", animation:"agRise .45s both" }}>
        <Sparkles size={16} color={T.mode==="dark"?"#4FCFA6":"#7FE8C6"} style={{ flexShrink:0, marginTop:2 }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9.5, letterSpacing:"0.1em", color:T.mode==="dark"?"#4FCFA6":"#7FE8C6", fontWeight:700 }}>{t("ANALYTICAL SUMMARY","خلاصة تحليلية")}</div>
          <div style={{ fontSize:12.5, color:"#F6F1E3", marginTop:6, lineHeight:1.7 }}>
            {t("Waiting time at peak is the single factor pulling your rating down. Extending capacity between 8 and 10 PM addresses most of it.",
               "وقت الانتظار في الذروة هو العامل الوحيد الذي يخفض تقييمك. توسيع الطاقة بين ٨ و١٠ مساءً يعالج معظمه.")}
          </div>
        </div>
      </div>
      )}
      </div>
    </div>
  );
};

/* ٤ — الفرص */
const BizOpportunities = ({ onMenu }) => {
  const { T, t, tt } = useApp();
  /* ١ الظهور · ٢ الطلب · ٣ الأداء · ٤ التوصية */
  const bs = useSequence(4, 560);

  const signals = [
    { at:1, icon: Search,     c:T.blue,    ar:"الظهور والبحث", en:"Visibility & search",
      v:{ar:"٢٬٤٠٠ بحث لم تظهر فيه",en:"2,400 searches missed"} },
    { at:2, icon: BarChart3,  c:T.coral,   ar:"الطلب", en:"Demand",
      v:{ar:"الذروة ٨–١٠ مساءً",en:"Peak 8–10 PM"} },
    { at:3, icon: TrendingUp, c:T.purple,  ar:"الأداء", en:"Performance",
      v:{ar:"الانتظار يخفض التقييم",en:"Waiting time lowers rating"} },
  ];

  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <BizHeader onMenu={onMenu} eyebrow={t("From your own signals", "من إشاراتك أنت")} title={t("Opportunities", "الفرص")}
        right={<AIChip ar="ذكاء مطابقة الفرص" en="Opportunity Matching AI" solid />} />
      <div style={{ fontSize:11.5, color:T.dim, padding:"10px 24px 0", lineHeight:1.65 }}>
        {t("Signals are combined, then an action is generated from them.",
           "تُجمَع الإشارات، ثم يُولَّد الإجراء منها.")}
      </div>

      {/* الإشارات الثلاث تُقرأ تباعاً */}
      <div style={{ margin:"16px 24px 0", position:"relative" }}>
        <span style={{ position:"absolute", insetInlineStart:21, top:20, bottom:20, width:1.5, borderRadius:99,
          background:`linear-gradient(180deg, ${T.ai} ${Math.min(100,(bs/3)*100)}%, ${T.line} ${Math.min(100,(bs/3)*100)}%)`,
          transition:"background .5s linear" }} />
        {signals.map((s2, i) => {
          const on = bs >= s2.at;
          return (
            <div key={i} className="glass" style={{ borderRadius:16, padding:"12px 13px", marginBottom:10,
              display:"flex", alignItems:"center", gap:11, position:"relative",
              opacity: on ? 1 : .38, transform: on ? "translateY(0)" : "translateY(6px)",
              transition:"opacity .4s, transform .4s", border: on ? `1px solid ${s2.c}44` : undefined }}>
              <span style={{ width:30, height:30, borderRadius:10, flexShrink:0, display:"grid", placeItems:"center",
                background:`${s2.c}1c`, border:`1px solid ${s2.c}4d`, zIndex:1 }}>
                <s2.icon size={14} color={s2.c} />
              </span>
              <span style={{ flex:1, minWidth:0 }}>
                <span style={{ display:"block", fontSize:11.5, fontWeight:600, color:T.text }}>{tt(s2)}</span>
                <span style={{ display:"block", fontSize:10, color:T.faint, marginTop:2 }}>{tt(s2.v)}</span>
              </span>
              {on && <CheckCircle2 size={14} color={T.ai} className="ag-seq" style={{ animation:"agTick .4s both", flexShrink:0 }} />}
            </div>
          );
        })}
      </div>

      {/* التيّارات الثلاثة تتقارب نحو نقطة تخليق واحدة */}
      {bs >= 3 && !wantsStill() && (
        <svg viewBox="0 0 300 58" aria-hidden="true" style={{ display:"block", width:"100%", height:58, pointerEvents:"none" }}>
          {[10, 29, 48].map((y, i) => (
            <FlowPath key={i} d={`M40,${y} C104,${y} 116,29 150,29`} color={T.ai} width={1.4} dur={480} delay={i*90} glow />
          ))}
          <circle cx="150" cy="29" r="4" fill={T.ai} opacity="0" style={{ animation:"agTick .45s .62s forwards" }} />
          <SpatialPulse cx={150} cy={29} r={30} color={T.ai} rings={2} dur={700} delay={680} />
        </svg>
      )}

      {/* التوصية تُولَّد بعد اكتمال الإشارات */}
      <div style={{ margin:"6px 24px 0", minHeight:150 }}>
        {bs < 4 ? (
          <div style={{ display:"flex", justifyContent:"center", paddingTop:26 }}>
            <Thinking label={t("Generating the recommended action", "توليد الإجراء المقترح")} />
          </div>
        ) : (
          <div className="ag-seq" style={{ borderRadius:20, padding:16, background:T.aiGrad, border:`1px solid ${T.ai}3d`,
            transformOrigin:"50% 0%", animation:"synthDrop .62s cubic-bezier(.24,1.2,.4,1) both" }}>
            <div style={{ fontSize:9.5, letterSpacing:"0.1em", color:"#7FE8C6", fontWeight:700, marginBottom:8 }}>
              {t("RECOMMENDED ACTION", "الإجراء المقترح")}
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:"#F6F1E3", lineHeight:1.5 }}>
              {t("Extend hours to midnight and declare accessibility",
                 "مدّد ساعات العمل حتى منتصف الليل وحدّد إمكانية الوصول")}
            </div>
            <div style={{ fontSize:11, color:"rgba(234,246,241,.72)", marginTop:9, lineHeight:1.7 }}>
              {t("Demand continues past your registered closing time, and 2,400 monthly searches filter for accessibility you have not declared.",
                 "الطلب يستمر بعد وقت إغلاقك المسجّل، و٢٬٤٠٠ بحث شهري يصفّي وفق إمكانية وصول لم تُحدَّد في ملفك.")}
            </div>
            <div style={{ display:"flex", alignItems:"flex-start", gap:6, marginTop:12, paddingTop:11, borderTop:"1px solid rgba(234,246,241,.14)" }}>
              <Sparkles size={11} color="#7FE8C6" style={{ flexShrink:0, marginTop:2.5 }} />
              <span style={{ fontSize:10.5, color:"rgba(234,246,241,.78)", lineHeight:1.6 }}>
                {t("This opportunity combines demand, visibility and performance signals.",
                   "تكوّنت هذه الفرصة من ارتفاع الطلب، وضعف الظهور، ومؤشرات الأداء.")}
              </span>
            </div>
          </div>
        )}
      </div>

      <SectionTitle eyebrow={t("Other actions","إجراءات أخرى")} title={t("From unmet demand","من طلب غير ملبّى")} />
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:12, padding:"0 24px" }}>
        {[
          { icon: Languages, c:T.blue, ar:"أضِف قائمة متعددة اللغات", en:"Add a multilingual menu",
            s:{ar:"٤٢٪ من الزوار يبحثون بلغات غير العربية",en:"42% of visitors search in other languages"} },
          { icon: Plus, c:T.emerald, ar:"أطلق تطبيقاً مصغّراً داخل EyeMakkah", en:"Launch a mini-app inside EyeMakkah",
            s:{ar:"عرض خدمتك داخل رحلة المستفيد",en:"Offer your service inside the user's journey"} },
        ].map((x,i)=>(
          <button key={i} className="glass" style={{ borderRadius:20, padding:15, display:"flex", gap:13, alignItems:"center", textAlign:"start" }}>
            <div style={{ width:44, height:44, borderRadius:15, display:"grid", placeItems:"center", background:`${x.c}1c`, border:`1px solid ${x.c}4d`, flexShrink:0 }}>
              <x.icon size={19} color={x.c} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, lineHeight:1.4 }}>{tt(x)}</div>
              <div style={{ fontSize:10.5, color:T.faint, marginTop:3, lineHeight:1.5 }}>{tt(x.s)}</div>
            </div>
            <Fwd size={15} color={T.faint} />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   بوابة المطورين — التطبيقات والتكاملات والنشر والتحليلات
═════════════════════════════════════════════ */
const DevHeader = ({ eyebrow, title, right, onMenu }) => {
  const { T, t } = useApp();
  return (
    <div style={{ padding: "18px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MenuButton onClick={onMenu} />
        <span style={{ marginInlineStart: "auto", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", color: T.aiInk, background: T.aiGrad, border: `1px solid ${T.ai}4d`, padding: "6px 11px", borderRadius: 99 }}>
          {t("DEVELOPERS PORTAL", "بوابة المطورين")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
        <div>
          {eyebrow && <div style={{ fontSize: 10, letterSpacing: "0.14em", color: T.gold, fontWeight: 700 }}>{eyebrow}</div>}
          <div className="display" style={{ fontSize: 22, color: T.text, marginTop: 2 }}>{title}</div>
        </div>
        {right}
      </div>
    </div>
  );
};

/* ١ — التطبيقات المصغّرة */
const DevApps = ({ onMenu }) => {
  const { T, t, tt, go } = useApp();
  const [creating, setCreating] = useState(false);
  /* ١ فهم الوصف · ٢ البنية · ٣ الواجهات · ٤ الصلاحيات · ٥ الإعداد */
  const cs = useSequence(5, 620, creating);

  const idea = { ar:"تطبيق يساعد الزائر على حجز عربة كهربائية من أقرب باب",
                 en:"An app that helps a visitor book an electric cart from the nearest gate" };

  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <DevHeader onMenu={onMenu} eyebrow={t("Mini-App Marketplace", "سوق التطبيقات المصغّرة")} title={t("My mini-apps", "تطبيقاتي المصغّرة")}
        right={<AIChip ar="ذكاء البناء" en="Build AI" solid />} />

      {creating ? (
        <div style={{ padding: "16px 24px 0" }}>
          {/* الوصف كما كتبه المطوّر */}
          <div className="glass" style={{ borderRadius: 18, padding: 15, border: `1px solid ${T.gold}55` }}>
            <div style={{ fontSize: 9.5, letterSpacing: "0.1em", color: T.gold, fontWeight: 700, marginBottom: 6 }}>
              {t("YOUR DESCRIPTION", "وصفك")}
            </div>
            <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.65 }}>{tt(idea)}</div>
          </div>

          {/* المفاهيم تنفصل من الوصف وتنتظم في معمارية */}
          {cs >= 1 && cs < 5 && !wantsStill() && (
            <svg viewBox="0 0 300 130" aria-hidden="true" style={{ display: "block", width: "100%", height: 130, pointerEvents: "none", marginTop: 8 }}>
              {[
                { x: 54,  y: 22, ar:"عربة", en:"cart" },
                { x: 54,  y: 64, ar:"حجز", en:"booking" },
                { x: 54,  y: 106, ar:"زائر", en:"visitor" },
                { x: 150, y: 44, ar:"واجهات", en:"APIs" },
                { x: 150, y: 86, ar:"صلاحيات", en:"scopes" },
                { x: 246, y: 64, ar:"البنية", en:"structure" },
              ].map((n, i) => {
                const at = i < 3 ? 1 : i < 5 ? 2 : 3;
                return (
                  <g key={i} style={{ opacity: cs >= at ? 1 : 0, transition: `opacity .4s ${i * 0.06}s` }}>
                    <circle cx={n.x} cy={n.y} r="4" fill={i > 2 ? T.ai : T.gold} />
                  </g>
                );
              })}
              {cs >= 2 && [[54,22,150,44],[54,64,150,44],[54,64,150,86],[54,106,150,86]].map((c,i)=>(
                <FlowPath key={"e"+i} d={`M${c[0]},${c[1]} L${c[2]},${c[3]}`} color={T.ai} width={1} dur={420} delay={i*80} glow={false} opacity={.5} />
              ))}
              {cs >= 3 && [[150,44,246,64],[150,86,246,64]].map((c,i)=>(
                <FlowPath key={"f"+i} d={`M${c[0]},${c[1]} L${c[2]},${c[3]}`} color={T.gold} width={1.4} dur={460} delay={i*90} glow />
              ))}
              {cs >= 4 && <SpatialPulse cx={246} cy={64} r={34} color={T.gold} rings={2} dur={800} />}
            </svg>
          )}

          {cs < 5 && (
            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
              <Thinking label={
                cs < 1 ? t("Reading your description", "قراءة وصفك")
                : cs < 2 ? t("Proposing a structure", "اقتراح البنية")
                : cs < 3 ? t("Selecting APIs", "اختيار الواجهات")
                : cs < 4 ? t("Determining scopes", "تحديد الصلاحيات")
                : t("Preparing configuration", "تجهيز الإعداد")} />
            </div>
          )}

          {/* البنية المقترحة */}
          <Step at={2} now={cs}>
            <div style={{ marginTop: 14, borderRadius: 18, padding: 15, background: T.aiGrad, border: `1px solid ${T.ai}3d` }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.08em", color: "#7FE8C6", fontWeight: 700, marginBottom: 10 }}>
                {t("PROPOSED STRUCTURE", "البنية المقترحة")}
              </div>
              {[
                { ar:"شاشة اختيار الباب", en:"Gate selection screen" },
                { ar:"شاشة توفّر العربات", en:"Cart availability screen" },
                { ar:"تأكيد الحجز", en:"Booking confirmation" },
              ].map((x,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0",
                  borderTop: i ? "1px solid rgba(234,246,241,.12)" : "none" }}>
                  <span style={{ width:18, height:18, borderRadius:6, flexShrink:0, display:"grid", placeItems:"center",
                    background:"rgba(255,255,255,.1)", fontSize:9, fontWeight:700, color:"#F0D48A" }}>{t(String(i+1), toAr(i+1))}</span>
                  <span style={{ fontSize:11.5, color:"rgba(246,241,227,.9)" }}>{tt(x)}</span>
                </div>
              ))}
            </div>
          </Step>

          {/* الواجهات المقترحة مع السبب */}
          <Step at={3} now={cs}>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.dim, marginBottom: 9 }}>
                {t("RECOMMENDED APIs", "الواجهات المقترحة")}
              </div>
              {[
                { n:"Places API", ar:"لتحديد أقرب باب إلى المستخدم", en:"to resolve the nearest gate to the user" },
                { n:"Booking API", ar:"لإنشاء الحجز وتأكيده", en:"to create and confirm the booking" },
                { n:"Journey API", ar:"لإدراج الحجز في خطة اليوم", en:"to insert the booking into the day plan" },
              ].map((a,i)=>(
                <div key={i} className="glass" style={{ borderRadius:14, padding:"11px 13px", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Share2 size={13} color={T.blue} />
                    <span style={{ fontSize:11.5, fontWeight:700, color:T.text, direction:"ltr" }}>{a.n}</span>
                  </div>
                  <div style={{ fontSize:10, color:T.faint, marginTop:5, lineHeight:1.5 }}>{t(a.en, a.ar)}</div>
                </div>
              ))}
            </div>
          </Step>

          {/* الصلاحيات */}
          <Step at={4} now={cs}>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: T.dim, marginBottom: 9 }}>
                {t("REQUIRED SCOPES", "الصلاحيات المطلوبة")}
              </div>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {[
                  { ar:"الموقع التقريبي", en:"approximate location" },
                  { ar:"إنشاء حجز", en:"create booking" },
                  { ar:"قراءة خطة اليوم", en:"read day plan" },
                ].map((p,i)=>(
                  <span key={i} style={{ fontSize:10, fontWeight:600, color:T.gold,
                    background:`${T.gold}14`, border:`1px solid ${T.gold}44`, padding:"5px 10px", borderRadius:99 }}>
                    {t(p.en, p.ar)}
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:11, fontSize:10, color:T.dim }}>
                <Lock size={11} color={T.emerald} />
                {t("Each scope requires explicit user consent", "كل صلاحية تتطلب موافقة صريحة من المستفيد")}
              </div>
            </div>
          </Step>

          {/* الإعداد الأولي */}
          <Step at={5} now={cs}>
            <button onClick={() => { setCreating(false); go("dev:publish"); }} style={{
              marginTop: 18, width: "100%", padding: 15, borderRadius: 18, border: "none",
              background: T.goldGrad, color: T.ink, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 8px 28px ${T.gold}4d` }}>
              <CheckCircle2 size={16} /> {t("Create and send for review", "أنشئ وأرسل للمراجعة")}
            </button>
            <button onClick={() => setCreating(false)} style={{
              marginTop: 9, width: "100%", padding: 12, borderRadius: 14, background: "transparent",
              border: `1px solid ${T.line}`, color: T.dim, fontSize: 11.5 }}>
              {t("Back to my apps", "العودة إلى تطبيقاتي")}
            </button>
          </Step>
        </div>
      ) : (
        <>
          <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:12, padding:"16px 24px 0" }}>
            {[
              { ar:"حجز عربة كهربائية", en:"Electric cart booking", st:{ar:"منشور",en:"Live"}, c:T.emerald,
                u:{ar:"١٢٬٤٠٠ استخدام شهرياً",en:"12,400 uses / month"}, v:"v2.4" },
              { ar:"حفظ الأمتعة", en:"Luggage storage", st:{ar:"منشور",en:"Live"}, c:T.emerald,
                u:{ar:"٦٬٨٠٠ استخدام شهرياً",en:"6,800 uses / month"}, v:"v1.9" },
              { ar:"جولة إرشادية بالواقع المعزز", en:"AR guided tour", st:{ar:"قيد المراجعة",en:"In review"}, c:T.gold,
                u:{ar:"بانتظار الاعتماد",en:"Awaiting approval"}, v:"v0.8" },
            ].map((x,i)=>(
              <div key={i} className="glass" style={{ borderRadius:20, padding:15 }}>
                <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                  <div style={{ width:40, height:40, borderRadius:13, display:"grid", placeItems:"center", background:`${T.blue}1a`, border:`1px solid ${T.blue}44`, flexShrink:0 }}>
                    <Plus size={17} color={T.blue} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{tt(x)}</div>
                    <div style={{ fontSize:10.5, color:T.faint, marginTop:3 }}>{tt(x.u)}</div>
                  </div>
                  <div style={{ textAlign:"end", flexShrink:0 }}>
                    <span style={{ fontSize:9.5, fontWeight:700, color:x.c, background:`${x.c}1c`, border:`1px solid ${x.c}44`, padding:"3px 9px", borderRadius:99 }}>{tt(x.st)}</span>
                    <div style={{ fontSize:9, color:T.faint, marginTop:5, direction:"ltr" }}>{x.v}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setCreating(true)} style={{ margin:"18px 24px 0", width:"calc(100% - 48px)", padding:15, borderRadius:18, border:"none", background:T.goldGrad, color:T.ink, fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 8px 28px ${T.gold}4d` }}>
            <Sparkles size={16} /> {t("Describe an app and let AI build it", "صِف تطبيقاً ودع الذكاء يبنيه")}
          </button>
        </>
      )}
    </div>
  );
};

/* ٢ — التكاملات وواجهات البرمجة */
const DevIntegrations = ({ onMenu }) => {
  const { T, t, tt } = useApp();
  /* كل واجهة تُتحقّق صلاحيتها تباعاً */
  const vs = useSequence(4, 480);
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <DevHeader onMenu={onMenu} eyebrow={t("Integration & Interoperability", "التكامل والتشغيل البيني")} title={t("APIs & integrations", "التكاملات وواجهات البرمجة")}
        right={<AIChip ar="ذكاء الحوكمة" en="Governance AI" solid />} />

      {/* حالة الاستخدام → واجهة مقترحة → اتصال → سبب → صلاحية ملتصقة */}
      <div data-morph-target="developer" className="glass" style={{ margin:"14px 24px 0", borderRadius:16, padding:"11px 13px", display:"flex", alignItems:"center", gap:9, border:`1px solid ${T.gold}44` }}>
        <Plus size={13} color={T.gold} />
        <span style={{ fontSize:11, color:T.dim }}>{t("Use case:", "حالة الاستخدام:")}</span>
        <span style={{ fontSize:11.5, fontWeight:700, color:T.text, flex:1 }}>
          {t("Electric cart booking", "حجز عربة كهربائية")}
        </span>
      </div>

      {!wantsStill() && (
        <svg viewBox="0 0 300 176" aria-hidden="true" style={{ display:"block", width:"calc(100% - 48px)", height:176, margin:"10px 24px 0", pointerEvents:"none" }}>
          <circle cx="30" cy="88" r="7.5" fill="none" stroke={T.gold} strokeWidth="1.6"
            opacity={vs >= 1 ? 1 : .3} style={{ transition:"opacity .4s" }} />
          <circle cx="30" cy="88" r="3" fill={T.gold} opacity={vs >= 1 ? 1 : .3} style={{ transition:"opacity .4s" }} />

          {[
            { y:24,  need:1, api:"Places API",  scope:"places:read",
              rAr:"لتحديد أقرب باب", rEn:"locate the nearest gate" },
            { y:72,  need:2, api:"Booking API", scope:"booking:create",
              rAr:"لإنشاء الحجز", rEn:"create the reservation" },
            { y:120, need:3, api:"Journey API", scope:"journey:read",
              rAr:"لربطه بخطة اليوم", rEn:"link it to the day plan" },
            { y:164, need:0, api:"Identity API", scope:null,
              rAr:"غير مطلوبة", rEn:"not required" },
          ].map((a, i) => {
            const on = a.need > 0 && vs >= a.need;
            const d = `M30,88 C104,88 140,${a.y} 196,${a.y}`;
            return (
              <g key={i}>
                {on ? <FlowPath d={d} color={T.ai} width={1.5} dur={520} delay={40} glow />
                    : <path d={d} fill="none" stroke={T.line} strokeWidth="1" strokeDasharray="3 6" opacity=".4" />}

                {/* السبب ملتصق بخطّه */}
                <text x="112" y={a.y > 88 ? a.y - 8 : a.y - 8} textAnchor="middle" fontSize="7.6"
                  fill={on ? T.dim : T.faint} fontFamily="inherit" opacity={on ? 1 : .45}
                  style={{ transition:"opacity .45s" }}>{t(a.rEn, a.rAr)}</text>

                {/* كبسولة الصلاحية تثبت على الخط */}
                {on && a.scope && (
                  <g>
                    <rect x="120" y={a.y + 2} width="64" height="15" rx="7.5"
                      fill={T.mode === "dark" ? "#0F2A22" : "#0E4A38"} stroke={T.ai} strokeWidth=".9"
                      opacity="0" style={{ animation:"scopeLock .5s .58s forwards" }} />
                    <text x="152" y={a.y + 12.4} textAnchor="middle" fontSize="7.2" fontWeight="700"
                      fill="#EAF6F1" fontFamily="Outfit, sans-serif" opacity="0"
                      style={{ animation:"scopeLock .5s .64s forwards" }}>{a.scope}</text>
                    <circle cx="190" cy={a.y} r="0" fill={T.ai} opacity=".9">
                      <animate attributeName="r" values="0;3.2" dur="240ms" begin="0.74s" fill="freeze" />
                    </circle>
                  </g>
                )}

                {/* نقطة الواجهة واسمها */}
                <circle cx="206" cy={a.y} r="4.6"
                  fill={on ? T.ai : "none"} stroke={on ? "none" : T.faint} strokeWidth="1.2"
                  strokeDasharray={a.need === 0 ? "2 2" : "0"}
                  style={{ transition:"fill .45s" }} />
                <text x="216" y={a.y + 3} fontSize="8" fontWeight={on ? 700 : 500}
                  fill={on ? T.text : T.faint} fontFamily="Outfit, sans-serif" opacity={on ? 1 : .5}
                  style={{ transition:"opacity .45s" }} direction="ltr">{a.api}</text>
              </g>
            );
          })}
        </svg>
      )}

      {/* النتيجة أولاً: العدد المطلوب ثم سبب الاختيار */}
      {vs >= 3 && (
        <div className="ag-seq" style={{ margin:"12px 24px 0", animation:"agRise .45s both" }}>
          <div className="display" style={{ fontSize:18, color:T.text }}>
            {t("3 APIs required", "٣ واجهات مطلوبة")}
          </div>
          <DecisionReason
            ar="اختيرت هذه الواجهات لأنها المطلوبة فقط لوظائف التطبيق."
            en="Only the APIs required by this app's functions were selected."
            whyAr="يحتاج حجز العربة إلى تحديد أقرب باب، وإنشاء الحجز، وربطه بخطة اليوم. ولا يحتاج إلى بيانات الهوية، فبقيت واجهتها خاملة."
            whyEn="Cart booking needs to locate the nearest gate, create the booking and link it to the day plan. It does not need identity data, so that API stays dormant." />
        </div>
      )}

      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:11, padding:"14px 24px 0" }}>
        {[
          { n:"Journey API", ar:"واجهة الرحلات", s:{ar:"قراءة حالة الرحلة والخطوة التالية",en:"Read journey state and next step"}, st:{ar:"مفعّلة",en:"Active"}, c:T.emerald },
          { n:"Places API", ar:"واجهة الأماكن", s:{ar:"المواقع والخدمات والتوفر",en:"Locations, services and availability"}, st:{ar:"مفعّلة",en:"Active"}, c:T.emerald },
          { n:"Booking API", ar:"واجهة الحجز", s:{ar:"إنشاء الحجوزات وتأكيدها",en:"Create and confirm bookings"}, st:{ar:"صلاحية محدودة",en:"Scoped"}, c:T.gold },
          { n:"Identity API", ar:"واجهة الهوية", s:{ar:"غير مطلوبة لهذه الحالة",en:"Not required for this use case"}, st:{ar:"خاملة",en:"Dormant"}, c:T.faint, dormant:true },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:18, padding:15,
            opacity: x.dormant ? 0.45 : vs > i ? 1 : 0.3, transition: "opacity .4s",
            border: x.dormant ? `1px dashed ${T.line}` : vs > i ? `1px solid ${x.c}33` : undefined }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.text, direction:"ltr" }}>{x.n}</span>
              <span style={{ fontSize:11, color:T.dim, flex:1 }}>{t("", " — " + x.ar)}</span>
              {x.dormant
                ? <span style={{ fontSize:9.5, fontWeight:700, color:T.faint, background:"transparent", border:`1px dashed ${T.faint}66`, padding:"3px 9px", borderRadius:99, flexShrink:0 }}>{tt(x.st)}</span>
                : vs > i
                ? <span className="ag-seq" style={{ fontSize:9.5, fontWeight:700, color:x.c, background:`${x.c}1c`, border:`1px solid ${x.c}44`, padding:"3px 9px", borderRadius:99, flexShrink:0, animation:"agTick .35s both" }}>{tt(x.st)}</span>
                : <span style={{ display:"flex", gap:3, flexShrink:0 }}>{[0,1,2].map(d=>(
                    <span key={d} className="ag-seq" style={{ width:3.5, height:3.5, borderRadius:99, background:T.faint, animation:`agDots 1.1s ${d*0.16}s infinite` }} />
                  ))}</span>}
            </div>
            <div style={{ fontSize:10.5, color:T.faint, marginTop:6, lineHeight:1.5 }}>{tt(x.s)}</div>
          </div>
        ))}
      </div>

      <div style={{ margin:"16px 24px 0", borderRadius:20, padding:16, background:T.aiGrad, border:`1px solid ${T.ai}3d` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <Shield size={15} color={T.mode==="dark"?"#4FCFA6":"#7FE8C6"} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:"rgba(234,246,241,.75)" }}>
            {t("GOVERNED ACCESS","وصول محكوم")}
          </span>
        </div>
        <div style={{ fontSize:11.5, color:"rgba(234,246,241,.9)", lineHeight:1.7 }}>
          {t("Data stays owned by its entity. Access is granted per purpose, scoped, logged and revocable.",
             "تبقى البيانات مملوكة لجهتها. والوصول يُمنح وفق الغرض، بصلاحية محدّدة، وقابل للتتبّع والإلغاء.")}
        </div>
      </div>
    </div>
  );
};

/* ٣ — النشر والمراجعة */
const DevPublish = ({ onMenu }) => {
  const { T, t, tt } = useApp();
  /* المراحل تتقدّم أمام العين حتى تبلغ التقييم */
  const rs = useSequence(3, 780);
  const steps = [
    { ar:"الفحص التقني", en:"Technical check" },
    { ar:"مراجعة المحتوى", en:"Content review" },
    { ar:"تقييم المخاطر والخصوصية", en:"Risk & privacy assessment" },
    { ar:"مراجعة بشرية", en:"Human review" },
  ].map((s, i) => ({ ...s, done: rs > i, now: rs === i }));
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <DevHeader onMenu={onMenu} eyebrow={t("Before release", "قبل الإطلاق")} title={t("Publishing", "النشر والمراجعة")}
        right={<AIChip ar="ذكاء الإشراف" en="Assurance AI" solid />} />

      <div className="glass" style={{ margin:"16px 24px 0", borderRadius:20, padding:16, border:`1px solid ${T.gold}55` }}>
        <div style={{ fontSize:9.5, letterSpacing:"0.1em", color:T.gold, fontWeight:700 }}>{t("IN REVIEW","قيد المراجعة")}</div>
        <div style={{ fontSize:13.5, fontWeight:700, color:T.text, marginTop:4 }}>{t("AR guided tour — v0.8","جولة إرشادية بالواقع المعزز — v0.8")}</div>
      </div>

      {/* الحزمة تعبر البوابات — وتقف عند الاعتماد البشري */}
      {!wantsStill() && (
        <svg viewBox="0 0 300 46" aria-hidden="true" style={{ display:"block", width:"calc(100% - 48px)", height:46, margin:"12px 24px 0", pointerEvents:"none" }}>
          <line x1="22" y1="23" x2="278" y2="23" stroke={T.line} strokeWidth="1.5" strokeDasharray="4 6" />
          {[86, 150, 214].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="10" x2={x} y2="36" stroke={rs > i ? T.emerald : T.faint} strokeWidth="2" strokeLinecap="round"
                style={{ transition:"stroke .5s", transform: rs > i ? "scaleY(.45)" : "scaleY(1)", transformOrigin: `${x}px 23px` }} />
            </g>
          ))}
          <line x1="266" y1="6" x2="266" y2="40" stroke={T.gold}
            strokeWidth={rs >= 3 ? 3.4 : 2.6} strokeLinecap="round" strokeDasharray={rs >= 3 ? "0" : "3 4"}
            style={{ transition:"stroke-width .5s .55s" }} />
          <circle cx="266" cy="23" r="9" fill="none" stroke={T.gold} strokeWidth="1.2" strokeDasharray="2.6 3"
            opacity={rs >= 3 ? 1 : 0} style={{ transition:"opacity .45s .6s" }} />
          <rect x={[40, 112, 176, 259][Math.min(rs, 3)]} y="16" width="14" height="14" rx="3"
            fill={T.gold} opacity={rs >= 3 ? .85 : 1}
            style={{ transition:"x .7s cubic-bezier(.22,.9,.3,1), opacity .5s .55s" }} />
          
        </svg>
      )}

      <div style={{ margin:"14px 24px 0", position:"relative", paddingInlineStart:26 }}>
        <span style={{ position:"absolute", insetInlineStart:8, top:12, bottom:12, width:2, borderRadius:99, opacity:.75,
          background:`linear-gradient(180deg, ${T.emerald} ${Math.min(rs,3)/4*100}%, ${T.line} ${Math.min(rs,3)/4*100}%)`,
          transition:"background .6s linear" }} />
        {steps.map((s,i)=>(
          <div key={i} className="glass" style={{ borderRadius:18, padding:14, marginBottom:10, position:"relative", border: s.now?`1px solid ${T.gold}66`:undefined }}>
            <span style={{ position:"absolute", insetInlineStart:-23, top:18, width:10, height:10, borderRadius:99,
              background: s.done?T.emerald : s.now?T.gold : T.line,
              boxShadow: (s.done||s.now)?`0 0 9px ${s.done?T.emerald:T.gold}`:"none",
              transition:"background .5s, box-shadow .5s" }} />
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <span style={{ fontSize:12.5, fontWeight:600, color: (s.done||s.now)?T.text:T.faint, flex:1 }}>{tt(s)}</span>
              {s.done && i < 3 && <CheckCircle2 size={15} color={T.emerald} className="ag-seq" style={{ animation:"agTick .4s both" }} />}
              {i === 3 && rs >= 3 && (
                <span style={{ fontSize:9.5, fontWeight:700, color:T.gold, background:`${T.gold}14`, border:`1px dashed ${T.gold}66`, padding:"3px 9px", borderRadius:99 }}>
                  {t("Pending","قيد الانتظار")}
                </span>
              )}
              {s.now && i < 3 && <span style={{ fontSize:9.5, fontWeight:700, color:T.gold, background:`${T.gold}1c`, border:`1px solid ${T.gold}44`, padding:"3px 9px", borderRadius:99 }}>{t("Now","الآن")}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ margin:"4px 24px 0", borderRadius:16, padding:13, display:"flex", alignItems:"center", gap:10 }}>
        <Lock size={15} color={T.emerald} />
        <span style={{ fontSize:11, color:T.dim, flex:1, lineHeight:1.5 }}>
          {t("Human review is required before any release.","المراجعة البشرية مطلوبة قبل أي إطلاق.")}
        </span>
      </div>
    </div>
  );
};

/* ٤ — تحليلات الاستخدام */
const DevAnalytics = ({ onMenu }) => {
  const { T, t, tt } = useApp();
  const us = useSequence(2, 720);
  const bars = [38,44,52,48,60,72,84,78,92,86,74,96];
  return (
    <div className="screen" style={{ paddingBottom: 118 }}>
      <DevHeader onMenu={onMenu} eyebrow={t("How your app is used", "كيف يُستخدم تطبيقك")} title={t("Analytics", "تحليلات الاستخدام")}
        right={<AIChip ar="ذكاء تحليل الاستخدام" en="Usage Analytics AI" solid />} />

      <div className="stagger" style={{ display:"flex", gap:10, padding:"16px 24px 0" }}>
        {[
          [t("Monthly uses","الاستخدام الشهري"), t("19,200","١٩٬٢٠٠"), t("+27%","+٢٧٪"), T.emerald],
          [t("Success rate","معدّل النجاح"), t("98.4%","٩٨٫٤٪"), t("stable","مستقر"), T.blue],
          [t("Avg. response","زمن الاستجابة"), t("240 ms","٢٤٠ م.ث"), t("−12%","−١٢٪"), T.gold],
        ].map(([a,v,s,c],i)=>(
          <div key={i} className="glass" style={{ flex:1, borderRadius:18, padding:14 }}>
            <div style={{ fontSize:9.5, color:T.faint }}>{a}</div>
            <div style={{ fontSize:17, fontWeight:600, color:T.text, margin:"5px 0 2px" }}>{v}</div>
            <div style={{ fontSize:9.5, color:c, fontWeight:700 }}>{s}</div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ margin:"14px 20px 0", borderRadius:22, padding:"18px 14px 14px" }}>
        <div style={{ fontSize:10, color:T.faint, letterSpacing:"0.08em", marginBottom:12, padding:"0 4px" }}>
          {t("USES ACROSS THE HIJRI YEAR","الاستخدام على مدار السنة الهجرية")}
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3.5, height:80 }}>
          {bars.map((v,i)=>{
            const top = v===Math.max(...bars);
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div className="ag-seq" style={{ width:"100%", height:`${v*0.58}px`, borderRadius:3.5,
                  background: us >= 2 && top ? T.goldGrad : `${T.gold}2e`,
                  transformOrigin:"bottom", animation:`agBarGrow .5s ${i*0.04}s cubic-bezier(.22,.9,.3,1) both`,
                  transition:"background .5s" }} />
                <span style={{ fontSize:8.5, color: top?T.gold:T.faint, fontWeight: top?800:500 }}>{t(String(i+1), toAr(i+1))}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* النمط يُعزل ويُترجَم إلى توصية */}
      <div style={{ margin:"14px 24px 0", minHeight:96 }}>
        {us < 2 ? (
          <div style={{ display:"flex", justifyContent:"center", paddingTop:24 }}>
            <Thinking label={t("Reading the usage pattern", "قراءة نمط الاستخدام")} />
          </div>
        ) : (
          <div className="ag-seq" style={{ borderRadius:20, padding:16, background:T.aiGrad, border:`1px solid ${T.ai}3d`, animation:"agRise .45s both" }}>
            <div style={{ fontSize:9.5, letterSpacing:"0.1em", color:"#7FE8C6", fontWeight:700, marginBottom:8 }}>
              {t("PATTERN → RECOMMENDATION", "النمط ← التوصية")}
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:"#F6F1E3", lineHeight:1.5 }}>
              {t("Usage peaks after Maghrib", "ذروة الاستخدام بعد المغرب")}
            </div>
            <svg viewBox="0 0 260 22" aria-hidden="true" style={{ display:"block", width:"100%", height:22, margin:"6px 0" }}>
              <FlowPath d="M14,4 C14,16 120,10 246,18" color="#6FE0BC" width={1.4} dur={620} delay={160} glow />
            </svg>
            <div style={{ fontSize:11, color:"rgba(234,246,241,.75)", lineHeight:1.7 }}>
              {t("Pre-cache cart availability before Maghrib to cut response time at the busiest hour.",
                 "هيّئ بيانات توفّر العربات قبل المغرب لتقليل زمن الاستجابة في أكثر الساعات ازدحاماً.")}
            </div>
          </div>
        )}
      </div>

      <SectionTitle eyebrow={t("Where it is used","أين يُستخدم")} title={t("Journeys embedding your app","الرحلات التي تضمّ تطبيقك")} />
      <div className="stagger" style={{ display:"flex", flexDirection:"column", gap:10, padding:"0 24px" }}>
        {[
          { ar:"رحلة الزيارة الثقافية", en:"Cultural visit journey", p:44, c:T.gold },
          { ar:"رحلة العبادة والنسك", en:"Worship journey", p:33, c:T.emerald },
          { ar:"رحلة التجربة المحلية", en:"Local experience journey", p:23, c:T.coral },
        ].map((x,i)=>(
          <div key={i} className="glass" style={{ borderRadius:16, padding:"13px 15px",
            border: us >= 2 && i === 0 ? `1px solid ${T.gold}66` : undefined, transition:"border-color .5s",
            opacity: us >= 2 && i !== 0 ? .58 : 1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:12.5, color:T.text, flex:1 }}>{tt(x)}</span>
              {us >= 2 && i === 0 && <span style={{ fontSize:9, fontWeight:700, color:T.gold, background:`${T.gold}1c`, border:`1px solid ${T.gold}44`, padding:"3px 8px", borderRadius:99 }}>{t("at peak","في الذروة")}</span>}
              <span style={{ fontSize:12.5, fontWeight:700, color:x.c }}>{t(`${x.p}%`, `${toAr(x.p)}٪`)}</span>
            </div>
            <div style={{ height:6, borderRadius:99, background:T.line, overflow:"hidden" }}>
              <div style={{ width: us >= 1 ? `${x.p}%` : "0%", height:"100%", borderRadius:99, background:`linear-gradient(90deg,${x.c},${x.c}88)`, transition:`width .7s ${i*0.08}s cubic-bezier(.22,.9,.3,1)` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* شريط سفلي موحّد للبوابات */
const PortalDock = ({ screen, go, items }) => {
  const { T, t } = useApp();
  return (
    <div style={{ position: "absolute", bottom: 16, insetInlineStart: 14, insetInlineEnd: 14, zIndex: 40 }}>
      <div className="glass" style={{ borderRadius: 22, padding: "10px 4px", display: "flex", alignItems: "center", justifyContent: "space-around",
        background: T.mode === "dark" ? "linear-gradient(150deg, rgba(16,20,34,.94), rgba(10,13,22,.97))" : "linear-gradient(150deg, rgba(255,253,246,.97), rgba(243,236,218,.95))",
        boxShadow: T.mode === "dark" ? "0 12px 40px -8px rgba(0,0,0,.7)" : "0 12px 36px -10px rgba(90,66,20,.35)",
        border: `1px solid ${T.gold}44` }}>
        {items.map((x) => {
          const active = screen === x.id;
          return (
            <button key={x.id} onClick={() => go(x.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 6px", position: "relative", flex: 1 }}>
              <x.icon size={18} color={active ? T.goldHi : T.faint} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 8.5, color: active ? T.goldHi : T.faint, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{t(x.l.en, x.l.ar)}</span>
              {active && <span style={{ position: "absolute", top: -8, width: 4, height: 4, borderRadius: 99, background: T.gold, boxShadow: `0 0 8px ${T.gold}` }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BIZ_TABS = [
  { id:"biz:visibility",    icon: Search,    l:{en:"Visibility",ar:"الظهور"} },
  { id:"biz:demand",        icon: BarChart3, l:{en:"Demand",ar:"الطلب"} },
  { id:"biz:performance",   icon: TrendingUp,l:{en:"Performance",ar:"الأداء"} },
  { id:"biz:opportunities", icon: Target,    l:{en:"Opportunities",ar:"الفرص"} },
];
const DEV_TABS = [
  { id:"dev:apps",         icon: Plus,      l:{en:"Mini-apps",ar:"التطبيقات"} },
  { id:"dev:integrations", icon: Share2,    l:{en:"APIs",ar:"التكاملات"} },
  { id:"dev:publish",      icon: Shield,    l:{en:"Publishing",ar:"النشر"} },
  { id:"dev:analytics",    icon: BarChart3, l:{en:"Analytics",ar:"التحليلات"} },
];

/* ═════ INVESTOR DOCK — its own navigation ═════ */
const InvDock = ({ screen, go }) => {
  const { T, t } = useApp();
  const items = [
    { id:"inv:opportunities", icon: Target, l:{en:"Opportunities",ar:"الفرص"} },
    { id:"inv:demand",        icon: BarChart3, l:{en:"Demand",ar:"الطلب"} },
    { id:"inv:map",           icon: MapPin, l:{en:"Location",ar:"الموقع"} },
    { id:"inv:compare",       icon: Scale, l:{en:"Compare",ar:"المقارنة"} },
    { id:"inv:alerts",        icon: Bell, l:{en:"Market",ar:"السوق"} },
  ];
  return (
    <div style={{ position: "absolute", bottom: 16, insetInlineStart: 14, insetInlineEnd: 14, zIndex: 40 }}>
      <div className="glass" style={{ borderRadius: 22, padding: "10px 4px", display: "flex", alignItems: "center", justifyContent: "space-around",
        background: T.mode === "dark" ? "linear-gradient(150deg, rgba(16,20,34,.94), rgba(10,13,22,.97))" : "linear-gradient(150deg, rgba(255,253,246,.97), rgba(243,236,218,.95))",
        boxShadow: T.mode === "dark" ? "0 12px 40px -8px rgba(0,0,0,.7)" : "0 12px 36px -10px rgba(90,66,20,.35)",
        border: `1px solid ${T.gold}44` }}>
        {items.map((x) => {
          const active = screen === x.id;
          return (
            <button key={x.id} onClick={() => go(x.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 6px", position: "relative", flex: 1 }}>
              <x.icon size={18} color={active ? T.goldHi : T.faint} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 8.5, color: active ? T.goldHi : T.faint, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{t(x.l.en, x.l.ar)}</span>
              {active && <span style={{ position: "absolute", top: -8, width: 4, height: 4, borderRadius: 99, background: T.gold, boxShadow: `0 0 8px ${T.gold}` }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═════ FLOATING DOCK ═════ */
const Dock = ({ tab, setTab }) => {
  const { T, t } = useApp();
  const items = [
    { id: "home", icon: Home, l: { en: "Home", ar: "الرئيسية" } },
    { id: "map", icon: MapIcon, l: { en: "Map", ar: "الخريطة" } },
    { id: "haram", kaaba: true },
    { id: "wallet", icon: Wallet, l: { en: "Wallet", ar: "المحفظة" } },
    { id: "services", icon: Sparkles, l: { en: "Services", ar: "الخدمات" } },
  ];
  return (
    <div style={{ position: "absolute", bottom: 16, insetInlineStart: 16, insetInlineEnd: 16, zIndex: 40 }}>
      <div className="glass" style={{ borderRadius: 26, padding: "10px 8px", display: "flex", alignItems: "center", justifyContent: "space-around", background: T.mode === "dark" ? "linear-gradient(150deg, rgba(16,20,34,.92), rgba(10,13,22,.96))" : "linear-gradient(150deg, rgba(255,253,246,.96), rgba(243,236,218,.94))", boxShadow: T.mode === "dark" ? "0 12px 40px -8px rgba(0,0,0,.7)" : "0 12px 36px -10px rgba(90,66,20,.35)" }}>
        {items.map((x) => {
          if (x.kaaba) {
            const active = tab === "haram";
            return (
              <button key={x.id} onClick={() => setTab("haram")} aria-label="Al-Haram Live" style={{ width: 56, height: 56, borderRadius: 20, marginTop: -30, background: "linear-gradient(150deg,#1c1a14,#0a0908)", border: `1.6px solid ${T.gold}${active ? "" : "99"}`, display: "grid", placeItems: "center", boxShadow: `0 8px 28px ${T.gold}${active ? "77" : "40"}`, position: "relative" }}>
                {active && <span style={{ position: "absolute", inset: -7, borderRadius: 24, border: `1px solid ${T.gold}66`, animation: "imkPulseRing 2.4s ease-out infinite" }} />}
                <div style={{ width: 22, height: 22, transform: "rotate(45deg)", background: "#0d0c0a", border: "1.4px solid #D8B25C", borderRadius: 3, position: "relative" }}>
                  <span style={{ position: "absolute", top: 4, left: 0, right: 0, height: 3, borderTop: "1.2px solid #D8B25C", borderBottom: "1.2px solid #D8B25C", opacity: .85 }} />
                </div>
              </button>
            );
          }
          const active = tab === x.id;
          return (
            <button key={x.id} onClick={() => setTab(x.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 10px", position: "relative" }}>
              <x.icon size={20} color={active ? T.goldHi : T.faint} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: 9, color: active ? T.goldHi : T.faint, fontWeight: active ? 700 : 500 }}>{t(x.l.en, x.l.ar)}</span>
              {active && <span style={{ position: "absolute", top: -9, width: 4, height: 4, borderRadius: 99, background: T.gold, boxShadow: `0 0 8px ${T.gold}` }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   APP SHELL — language, theme, stack navigation
═════════════════════════════════════════════ */
export default function EyeMakkahApp() {
  const [lang, setLang] = useState("ar");   // مطابق لهوية العرض
  const [mode, setMode] = useState("light"); // وضع "ضُحى" الكريمي
  const [controls, setControls] = useState(false); // وضع العرض النظيف افتراضياً
  const [stack, setStack] = useState(["home"]);
  const [replan, setReplan] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [entry, setEntry] = useState("landing"); // landing · language · portals · app
  const [morph, setMorph] = useState(null);   // { kind, id }
  const morphTimer = useRef(null);
  const runMorph = (job, after, ms = 1050) => {
    if (wantsStill()) { after(); return; }
    if (morphTimer.current) clearTimeout(morphTimer.current);
    setMorph(job);
    after();                                   // الوجهة تُرسم تحت الجسر فوراً
    morphTimer.current = setTimeout(() => { setMorph(null); morphTimer.current = null; }, ms);
  };
  useEffect(() => () => { if (morphTimer.current) clearTimeout(morphTimer.current); }, []);
  const [prefs, setPrefs] = useState({ purpose:"culture", sub:"markets", place:0, party:"solo", count:2, budget:"mid", access:false });
  const T = THEMES[mode];
  const isAr = lang === "ar";
  const t = (en, ar) => (isAr ? ar : en);
  const tt = (obj) => (obj ? (isAr ? obj.ar : obj.en) : "");
  const screen = stack[stack.length - 1];
  const go = (s) => {
    if (morphTimer.current) { clearTimeout(morphTimer.current); morphTimer.current = null; setMorph(null); }
    setStack((st) => (st[st.length - 1] === s ? st : [...st, s]));
  };
  const back = () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st[0] === "home" ? st : ["home"]));
  const setTab = (s) => setStack([s]);

  const BIZ = { "biz:visibility": BizVisibility, "biz:demand": BizDemand, "biz:performance": BizPerformance, "biz:opportunities": BizOpportunities };
  const DEV = { "dev:apps": DevApps, "dev:integrations": DevIntegrations, "dev:publish": DevPublish, "dev:analytics": DevAnalytics };
  const INV = {
    "inv:opportunities": InvOpportunities,
    "inv:demand": InvDemand,
    "inv:map": InvMap,
    "inv:compare": InvCompare,
    "inv:alerts": InvAlerts,
  };
  const inInvestor = screen.startsWith("inv:");
  const inBiz = screen.startsWith("biz:");
  const inDev = screen.startsWith("dev:");
  const openDrawer = () => setDrawer(true);

  const render = () => {
    if (inBiz) { const V = BIZ[screen] || BizVisibility; return <V key={screen + lang} onMenu={openDrawer} />; }
    if (inDev) { const V = DEV[screen] || DevApps; return <V key={screen + lang} onMenu={openDrawer} />; }
    if (inInvestor) { const V = INV[screen] || InvOpportunities; return <V key={screen + lang} onMenu={openDrawer} />; }
    if (screen.startsWith("svc:")) return <ScreenService key={screen + lang} id={screen.slice(4)} />;
    if (screen === "home") return <ScreenHome key={screen + lang} onMenu={openDrawer} />;
    const S = {
      home: ScreenHome, haram: ScreenHaram, map: ScreenMap, assistant: ScreenAssistant,
      wallet: ScreenWallet, services: ScreenServices, profile: ScreenProfile,
      notifications: ScreenNotifications, search: ScreenSearch, camera: ScreenCamera,
      itinerary: ScreenItinerary, booking: ScreenBooking, emergency: ScreenEmergency,
      customize: ScreenCustomize, composing: ScreenComposing,
    }[screen] || ScreenHome;
    return <S key={screen + lang} />;
  };

  const ctx = { lang, setLang, mode, setMode, T, t, tt, isAr, go, back, replan, setReplan, prefs, setPrefs, runMorph };
  const tabs = ["home", "map", "haram", "wallet", "services"];
  const tabFor = tabs.includes(screen) ? screen : tabs.includes(stack[0]) ? stack[0] : "home";

  return (
    <Ctx.Provider value={ctx}>
      <style>{CSS}</style>
      <div className="imk" style={{ minHeight: "100vh", background: T.stage, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>

        {/* مفتاح خفي في زاوية المسرح — بعيد عن إطار الجوال فلا يظهر في التصوير */}
        <button onClick={() => setControls(!controls)} aria-label="settings"
          style={{ position: "fixed", top: 12, insetInlineEnd: 12, width: 26, height: 26, borderRadius: 99,
            border: "none", background: "transparent", opacity: controls ? 0.5 : 0.12, zIndex: 60,
            display: "grid", placeItems: "center", color: mode === "dark" ? "#F4EDDE" : "#241B0B" }}>
          <SunMedium size={13} />
        </button>

        {controls && (
          <div style={{ position: "fixed", top: 44, insetInlineEnd: 12, zIndex: 60, display: "flex", gap: 8, alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", border: `1px solid ${mode === "dark" ? "rgba(216,178,92,.45)" : "rgba(138,103,30,.45)"}` }}>
              {[["ar", "العربية"], ["en", "English"]].map(([id, l]) => (
                <button key={id} onClick={() => setLang(id)} style={{ padding: "7px 14px", fontSize: 11.5, fontWeight: 700, border: "none",
                  fontFamily: id === "ar" ? "'IBM Plex Sans Arabic',sans-serif" : "'Outfit',sans-serif",
                  background: lang === id ? T.goldGrad : (mode === "dark" ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.8)"),
                  color: lang === id ? T.ink : (mode === "dark" ? "rgba(244,237,222,.65)" : "rgba(36,27,11,.6)") }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, fontSize: 11.5, fontWeight: 700,
              border: `1px solid ${mode === "dark" ? "rgba(216,178,92,.45)" : "rgba(138,103,30,.45)"}`,
              background: mode === "dark" ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.8)", color: mode === "dark" ? "#F0D48A" : "#7A5A18" }}>
              {mode === "dark" ? <SunMedium size={13} /> : <MoonStar size={13} />}
              {mode === "dark" ? (isAr ? "نهاري" : "Light") : (isAr ? "ليلي" : "Dark")}
            </button>
          </div>
        )}

        {/* Phone */}
        <div id="eyemakkah-phone" style={{ width: 412, maxWidth: "100%", borderRadius: 54, padding: 11, background: T.frame, boxShadow: "0 42px 90px -22px rgba(0,0,0,.55)" }}>
          <div dir={isAr ? "rtl" : "ltr"} style={{ "--flip": isAr ? -1 : 1, ...T.vars, borderRadius: 44, overflow: "hidden", background: entry === "app" ? T.bg : "#07231B", position: "relative", height: 844, color: T.text }} data-phone-screen>
            {/* Status bar */}
            <div style={{ position: "relative", zIndex: 96, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 28px 0", fontSize: 12.5, fontWeight: 600, color: (entry !== "app" || drawer) ? "#F6F1E3" : T.text }}>
              <span>{isAr ? "٩:٠٠ ص" : "9:00 AM"}</span>
              <div style={{ width: 108, height: 27, borderRadius: 99, background: (entry !== "app" || drawer) ? "rgba(6,20,16,.9)" : mode === "dark" ? "#04060B" : "#241B0B", position: "absolute", insetInlineStart: "50%", transform: "translateX(" + (isAr ? "50%" : "-50%") + ")", top: 9 }} />
              {/* مؤشرات محايدة لا تحتاج ترجمة: شبكة وبطارية */}
              <svg width="46" height="12" viewBox="0 0 46 12" fill="none">
                <rect x="0"  y="7.5" width="3" height="4.5" rx="1" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} />
                <rect x="5"  y="5.5" width="3" height="6.5" rx="1" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} />
                <rect x="10" y="3"   width="3" height="9"   rx="1" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} />
                <rect x="15" y="0.5" width="3" height="11.5" rx="1" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} opacity="0.35" />
                <rect x="25" y="1.5" width="17" height="9" rx="2.6" fill="none" stroke={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} strokeWidth="1.1" opacity="0.5" />
                <rect x="26.5" y="3" width="12" height="6" rx="1.5" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} />
                <rect x="43" y="4.5" width="1.6" height="3" rx="0.8" fill={(entry !== "app" || drawer) ? "#F6F1E3" : T.text} opacity="0.5" />
              </svg>
            </div>
            {/* Screen */}
            {entry === "app" && (
              <div style={{ position: "absolute", inset: 0, top: 0, overflowY: "auto", paddingTop: 44 }}>
                {render()}
              </div>
            )}
            {entry !== "app" ? null : screen === "composing" ? null
              : inBiz ? <PortalDock screen={screen} go={(s)=>setStack([s])} items={BIZ_TABS} />
              : inDev ? <PortalDock screen={screen} go={(s)=>setStack([s])} items={DEV_TABS} />
              : inInvestor ? <InvDock screen={screen} go={(s)=>setStack([s])} />
              : <Dock tab={tabFor} setTab={setTab} />}
            <MorphOverlay job={morph} />

            <GlobalSidebar open={drawer} onClose={() => setDrawer(false)} current={portalOf(screen)}
              lang={lang} setLang={setLang} go={(s) => setStack([s])}
              onPick={(p) => { setStack([p.home]); setDrawer(false); }} />

            {entry !== "app" && (
              <div style={{ position: "absolute", inset: 0, background: "#07231B", zIndex: 80 }}>
                {entry === "landing"  && <ScreenLanding lang={lang} onEnter={() => setEntry("language")} />}
                {entry === "language" && <ScreenLanguage onPick={(l) => { setLang(l); setEntry("portals"); }} />}
                {entry === "portals"  && <ScreenPortals lang={lang} onPick={(p, from) => runMorph(
              { kind: "portal", id: p.id, from, target: `[data-morph-target="${p.id}"]` },
              () => { setStack([p.home]); setEntry("app"); })} />}
              </div>
            )}
            {/* Home indicator */}
            <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: 120, height: 4.5, borderRadius: 99, background: entry !== "app" ? "rgba(246,241,227,.5)" : mode === "dark" ? "rgba(244,237,222,.32)" : "rgba(36,27,11,.3)", zIndex: 97 }} />
          </div>
        </div>

      </div>
    </Ctx.Provider>
  );
}
