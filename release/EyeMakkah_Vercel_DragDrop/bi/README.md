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

## Current cumulative prototype

- Welcome → language → prototype sign-in → Dashboard flow
- Returning visits with a saved language start at sign-in
- Session-only prototype authentication and sign-out
- Arabic RTL + English LTR across platform navigation and analytics
- In-platform user menu, language switching, and session controls
- Shared period, area, category, and audience filters
- Every shared filter recalculates synthetic KPIs, rates, charts, tables, funnels, campaign results, community signals, opportunities, reports, CSV output, and AI-agent answers
- Diversified analytics visualizations: time-series line, donut, stacked audience, grouped demand/supply, bubble chart, funnel, and demand/supply quadrant scatter
- Dashboard includes the EyeMakkah Analytics Assistant (AI Agent) with a fixed question bank; answers are deterministically derived from the active synthetic data and filters
- Dynamic analytical insights derived from the active synthetic results
- Hover/tooltips on chart data points and interactive visual elements
- Filter/page transition states, loading skeleton strip, page motion, chart animation, and reduced-motion support
- Improved empty states with filter reset
- Responsive desktop/tablet/mobile behavior, including mobile account controls
- Reports include concise period summaries, quick trend, report sections, and filtered CSV export
- Synthetic demo data only; no PII and no live operational data
- No pricing, investment amounts, ROI, break-even, revenue projections, or financial-feasibility assumptions

## Files

- `index.html`
- `app.js`
- `styles.css`
- `vercel.json`

The `bi` directory is independently deployable as the Vercel project root.
