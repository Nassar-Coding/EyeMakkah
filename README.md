# EyeMakkah — مجتمع مكة الرقمي

> **EyeMakkah هو مجتمع رقمي لسكان مكة وزوارها**: مكان واحد لاكتشاف الخدمات والتجارب
> ذات الصلة، والتفاعل مع المجتمع، وبناء خطة شخصية — وتفاعلات ذات معنى تدعم التحليلات
> وذكاء الأعمال لاحقًا.

This repository holds the **transformation** of EyeMakkah from the current four-portal
prototype into one consumer product for Makkah residents and visitors, following the
meeting direction and the five transformation groups in `docs/handover/`.

## What is here

| Path | What it is |
|---|---|
| `EyeMakkah-app.jsx` | **The product.** One source file — also the Claude artifact deliverable. |
| `dist/` | **Zero-build Vercel drag-and-drop package** (`index.html` + prebuilt `app.js`). |
| `src/main.jsx`, `build/build.mjs` | Mount entry + esbuild bundler that produces `dist/app.js`. |
| `scripts/verify.mjs` | Runtime verification: boots the build in Chromium and walks core journeys. |
| `baseline/` | The canonical **current** EyeMakkah (`EyeMakkah-app.current.tsx`, `eyemakkah-vercel.current.zip`) kept for comparison. |
| `docs/handover/` | Meeting notes, the five group definitions, product rules, visual system, DO-NOT-DO. |
| `PHOTO_SOURCES.md` | The media layer and what must be replaced before a public release. |

## Primary navigation

**الرئيسية · اكتشف · المجتمع · خطتي** — Profile sits behind the avatar. There is no AI tab:
AI is horizontal (relevance, trust, journey continuity, translation, community intelligence).

## State semantics that never collapse

> حفظ ≠ أضف إلى خطتي ≠ انضم ≠ سأحضر ≠ حجز ≠ مؤكد ≠ حضرت

Leaving EyeMakkah for an external provider records `انتقلت لإكمال الحجز`. Nothing becomes
`مؤكد` without a real callback or an explicit confirmation from the user.

## Build

```bash
npm install
npm run build        # → dist/app.js
node scripts/verify.mjs   # boots the build in Chromium and checks core journeys
```

## Prototype honesty

Operational values, offers, participant counts and community contributions are
illustrative prototype content, not live data. Official and transactional services stay
with the authorities and providers that own them; EyeMakkah orchestrates the context
around the decision.
