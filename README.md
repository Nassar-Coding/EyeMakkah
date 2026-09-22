# EyeMakkah — مجتمع مكة الرقمي

> **EyeMakkah هو مجتمع رقمي لسكان مكة وزوارها**: مكان واحد لاكتشاف الخدمات والتجارب ذات الصلة، والتفاعل مع المجتمع، وبناء خطة شخصية — وتفاعلات ذات معنى تدعم التحليلات وذكاء الأعمال.

This branch contains two Vercel-ready experiences in one repository:

- **Consumer EyeMakkah** at `/`
- **EyeMakkah Business Intelligence** at `/bi`

The BI experience is a **static browser application**. It has no Python application server, no separate backend requirement, and no server-side dashboard runtime. All demo data is deterministic synthetic data generated in the browser.

## Vercel deployment

### Git-connected deployment

Import the repository in Vercel and select branch `BI-Platform`. The root `vercel.json` runs:

```bash
npm run build
```

and publishes `dist/`.

### Drag-and-drop package

The branch also produces a zero-build package at:

```text
release/EyeMakkah_Vercel_DragDrop.zip
```

Its contents are prebuilt static files and can be deployed without a Node or Python runtime.

## Business Intelligence platform

Source: `bi/`

The BI prototype is Arabic/RTL and includes:

- Executive dashboard
- Demand and search analysis
- Area analysis
- Activities and experiences with distinct Save / Plan / Join / Action / Complete semantics
- Communities and interests
- Campaigns and offers
- Opportunity/gap decision-support signals
- Reports and client-side CSV export
- Shared filters for period, area, category and audience
- Responsive desktop/mobile layout
- Deterministic synthetic data only; no PII and no live operational data

The BI source is intentionally dependency-free browser JavaScript so it can be served directly by Vercel as static assets.

## Repository map

| Path | What it is |
|---|---|
| `EyeMakkah-app.jsx` | Consumer product source |
| `src/main.jsx` | Consumer mount entry |
| `bi/` | Static BI platform source |
| `build/build.mjs` | Builds consumer bundle and copies BI into `dist/bi` |
| `dist/` | Vercel output (`/` + `/bi`) |
| `release/EyeMakkah_Vercel_DragDrop.zip` | Zero-build deployment ZIP |
| `scripts/` | QA and verification utilities |
| `docs/` | Product journeys and handover material |
| `baseline/` | Canonical previous EyeMakkah baseline for comparison |

## Build and validation

```bash
npm ci
npm run check
npm run build
```

`npm run check` validates the React consumer imports and syntax-checks the BI browser application. `npm run build` bundles the consumer app and copies the BI static application to `dist/bi`.

## Primary consumer navigation

**الرئيسية · اكتشف · المجتمع · خطتي** — Profile sits behind the avatar. AI remains horizontal rather than a standalone tab.

## State semantics that never collapse

> حفظ ≠ أضف إلى خطتي ≠ انضم ≠ سأحضر ≠ حجز ≠ مؤكد ≠ حضرت

Leaving EyeMakkah for an external provider records `انتقلت لإكمال الحجز`. Nothing becomes `مؤكد` without a real callback or an explicit confirmation from the user.

## Prototype honesty

Operational values, offers, participant counts, BI metrics and community contributions are illustrative prototype content, not live data. Official and transactional services stay with the authorities and providers that own them; EyeMakkah orchestrates the context around the decision.
