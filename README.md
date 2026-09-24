# EyeMakkah — مجتمع مكة الرقمي

> **EyeMakkah هو مجتمع رقمي لسكان مكة وزوارها**: مكان واحد لاكتشاف الخدمات والتجارب
> ذات الصلة، والتفاعل مع المجتمع، وبناء خطة شخصية — وتفاعلات ذات معنى تدعم التحليلات
> وذكاء الأعمال لاحقًا.

This repository holds the **transformation** of EyeMakkah from the current four-portal
prototype into one consumer product for Makkah residents and visitors, following the
meeting direction and the five transformation groups in `docs/handover/`.

## Deliverables

| Deliverable | Path |
|---|---|
| **Zero-build Vercel drag-and-drop ZIP** | `release/EyeMakkah_Vercel_DragDrop.zip` |
| **Single JSX file for a Claude artifact** | `EyeMakkah-app.jsx` (default export, imports only `react` + `lucide-react`) |

## What is here

| Path | What it is |
|---|---|
| `EyeMakkah-app.jsx` | **The product.** One source file — also the Claude artifact deliverable. |
| `release/` | The packaged drag-and-drop ZIP. |
| `dist/` | **Zero-build Vercel package** (`index.html` + prebuilt `app.js`), the ZIP's contents. |
| `src/main.jsx`, `build/build.mjs` | Mount entry + esbuild bundler that produces `dist/app.js`. |
| `scripts/verify.mjs` | Runtime verification: boots the build in Chromium and walks 23 journeys. |
| `scripts/crawl.mjs` | QA crawl for blank screens, dead ends and console errors. |
| `scripts/shots.mjs` | Screenshot sweep of the main surfaces. |
| `docs/JOURNEYS.md` | The 48 validated Makkah journeys. |
| `baseline/` | The canonical **current** EyeMakkah (`EyeMakkah-app.current.tsx`, `eyemakkah-vercel.current.zip`) kept for comparison. |
| `docs/handover/` | Meeting notes, the five group definitions, product rules, visual system, DO-NOT-DO. |
| `PHOTO_SOURCES.md` | Every bundled photograph: its use, tier (exact / Makkah context / generic) and provenance. |
| `docs/APP_QUALITY_AUDIT.md` | The screen-by-screen visual, responsive, bilingual and media quality audit and its corrections. |
| `scripts/ui-audit.mjs` | The audit harness: 7 viewports × Arabic/English, geometry checks and screenshots of every state. |
| `assets/photos/`, `scripts/photos-build.py`, `scripts/photo-sync.mjs` | The photo library, its manifest-driven builder, and the step that inlines it into the app. |

## Primary navigation

**الرئيسية · اكتشف · المجتمع · خطتي** — Profile sits behind the avatar. There is no AI tab:
AI is horizontal (relevance, trust, journey continuity, translation, community intelligence).

## State semantics that never collapse

> حفظ ≠ أضف إلى خطتي ≠ انضم ≠ سأحضر ≠ حجز ≠ مؤكد ≠ حضرت

Leaving EyeMakkah for an external provider records `انتقلت لإكمال الحجز`. Nothing becomes
`مؤكد` without a real callback or an explicit confirmation from the user.

## The five transformation groups, cumulative in one app

| Group | What it added | Checkpoint |
|---|---|---|
| 1 — Living Makkah | Inventory layer (169 objects, 15 areas, 14 categories), Home compositor, Discover, Search, Map, Decision pages, source claims and freshness classes | `f95bac9` |
| 2 — Community | 8 families / 50 communities / 10 clubs, one Contribution model, editorial community home, club ≠ community ≠ activity | `0da1de6` |
| 3 — Participation | The full loop with distinct states, assembled outings, Plan as a continuity timeline, active and completion states | `929399c` |
| 4 — Trust | Conflict comparison, review queue, archive, visible moderation, safety & privacy centre | `aa63443` |
| 5 — Personalisation | Dismissal with reasons, selective notifications, provider/host role, interaction signals, full state coverage | `92e8e00` |

## Build

```bash
npm install
npm run build             # → dist/app.js
node scripts/verify.mjs   # 23 runtime journeys in Chromium, fails on any console error
node scripts/crawl.mjs    # broad QA crawl for dead ends and blank screens
node scripts/ui-audit.mjs # screen-by-screen layout/media audit, 7 viewports × AR/EN
```

## Prototype honesty

Operational values, offers, participant counts and community contributions are
illustrative prototype content, not live data. Official and transactional services stay
with the authorities and providers that own them; EyeMakkah orchestrates the context
around the decision.
