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
| `scripts/verify.mjs` | Runtime verification: signs in to a seeded test account and walks 23 journeys. |
| `scripts/auth-check.mjs`, `scripts/entry-check.mjs` | Account flows in Arabic and English against `scripts/lib/firebase-test-server.mjs`, a local service with the same REST contract as Firebase. |
| `scripts/lib/browser.mjs`, `scripts/package.mjs` | The shared Chromium launcher and static server for every QA script (`CHROMIUM_PATH` optional), and the release packager. |
| `scripts/crawl.mjs` | QA crawl for blank screens, dead ends and console errors. |
| `scripts/shots.mjs` | Screenshot sweep of the main surfaces. |
| `docs/JOURNEYS.md` | The 48 validated Makkah journeys. |
| `docs/ACCOUNTS.md`, `dist/config.js` | Sign-in, sign-up, recovery and account profile: the flows, the configuration file, and the Firebase / Google / Apple setup still required. |
| `docs/AGENT_AND_OFFERS.md` | The shared offers model and the free-text EyeMakkah Assistant (Intent Bank pipeline, follow-ups, actions, limits). |
| `assets/agent/`, `scripts/agent-sync.mjs` | The four Agent Bank JSON files (150 intents, 2,123 AR/EN examples) and the step that inlines them into the app. |
| `baseline/` | The canonical **current** EyeMakkah (`EyeMakkah-app.current.tsx`, `eyemakkah-vercel.current.zip`) kept for comparison. |
| `docs/handover/` | Meeting notes, the five group definitions, product rules, visual system, DO-NOT-DO. |
| `PHOTO_SOURCES.md` | Every bundled photograph: its use, tier (exact / Makkah context / generic) and provenance. |
| `docs/APP_QUALITY_AUDIT.md` | The screen-by-screen visual, responsive, bilingual and media quality audit and its corrections. |
| `scripts/ui-audit.mjs` | The audit harness: 7 viewports × Arabic/English, geometry checks and screenshots of every state. |
| `assets/photos/`, `scripts/photos-build.py`, `scripts/photo-sync.mjs` | The photo library, its manifest-driven builder, and the step that inlines it into the app. |

## Primary navigation

Entry is **Start → Language → Sign in / Create account → (email, mobile + SMS code, Apple or Google) → Profile setup → Home**, plus *Forgot password* and *Browse without an account*. Accounts use Firebase Authentication and Firestore, configured in `dist/config.js`. While that file is empty, no method signs anyone in. The app shell is not mounted until someone is signed in or browsing as a guest. The account screen covers details, editing, password change, sign-out and deletion. See `docs/ACCOUNTS.md`.

**الرئيسية · اكتشف · المجتمع · خطتي** — Profile sits behind the avatar. There is no AI tab:
AI is horizontal (relevance, trust, journey continuity, translation, community intelligence).
The EyeMakkah Assistant opens from the Home assistant card (and from search) as a single
free-text conversation — no fifth tab, no floating bubble.

## Offers & the Assistant

Offers and discounts are one shared model (`DEALS`: 64 illustrative records across
restaurants, cafés, stays, culture, experiences, activities, events, markets and services)
read by cards, decision pages, the Home and Discover deal rails, My Plan and the Assistant.
The Assistant matches free Arabic/English text against the full four-part Intent Bank and
answers from the same objects, offers and plan state. See `docs/AGENT_AND_OFFERS.md`.

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
node scripts/agent-sync.mjs  # inline assets/agent/*.json as AGENT_BANK (after editing the bank)
npm run build             # → dist/app.js
node scripts/verify.mjs   # 23 runtime journeys in Chromium, fails on any console error
node scripts/auth-check.mjs   # sign-in / sign-up / recovery / account flows, AR + EN
node scripts/package.mjs  # refresh release/ and the drag-and-drop ZIP
node scripts/crawl.mjs    # broad QA crawl for dead ends and blank screens
node scripts/ui-audit.mjs # screen-by-screen layout/media audit, 7 viewports × AR/EN
```

## Prototype honesty

Operational values, offers, participant counts and community contributions are
illustrative prototype content, not live data. Official and transactional services stay
with the authorities and providers that own them; EyeMakkah orchestrates the context
around the decision.
