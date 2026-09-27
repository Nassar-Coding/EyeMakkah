# EyeMakkah Business Analytics Platform

**الاسم:** منصة EyeMakkah لتحليلات الأعمال  
**English:** EyeMakkah Business Analytics Platform

This folder contains only the Business Analytics Platform prototype. It does not contain or modify the EyeMakkah consumer application.

## Vercel deployment

Connect the `BI-Platform` branch and set **Root Directory** to:

```
bi
```

No backend, database, Python runtime, or environment variables are required.

## Phase 1 implemented

- Welcome + language selection flow
- Arabic RTL and English LTR
- Prototype sign-in screen (no live authentication backend)
- Session-only sign-in and sign-out
- In-platform user menu
- Dynamic shared filters for period, area, category, and audience
- Deterministic synthetic calculations across KPIs, charts, tables, funnels, campaigns, communities, opportunities, and reports
- Diversified analytics charts: time-series line, donut, stacked audience, grouped demand/supply, bubble chart, funnel, and demand/supply scatter
- Hover/tooltips on visual data points
- Premium, restrained motion system with reduced-motion support
- CSV export follows active filters and language
- Synthetic demo data only; no PII and no live operational data
- No pricing, investment, ROI, revenue projections, or financial-feasibility assumptions
