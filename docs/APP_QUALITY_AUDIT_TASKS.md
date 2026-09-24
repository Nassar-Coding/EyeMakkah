# App quality audit — task list

Branch `claude/upbeat-bell-hkmvzy`, starting from `edf3858` (verified == origin before work began).
Findings, root causes and results: `docs/APP_QUALITY_AUDIT.md`.

## 0. Setup
- [x] Verify branch + HEAD against origin
- [x] Check media download channels. All image hosts are blocked by the environment's network policy; only code/package hosts are reachable.
- [x] Build a screen-by-screen UI audit harness: `scripts/ui-audit.mjs`, with a 7-viewport × 2-language matrix, geometry checks and screenshots

## 1. Known defects (from stakeholder screenshots)
- [x] Profile «حيّك أو منطقتك الحالية» chip row cut «النسيم» at the screen edge. The chips now wrap.
- [x] Home «يبدأ قريبًا» card rail amputated titles at the edge. Fixes:
  - card widths now size to the screen
  - edge fades now cover the actual peek
  - titles are no longer clamped
- [x] Drawn illustrations used as content imagery (سوق العتيبية, «يبدأ قريبًا» cards). All content imagery is now photographic, with 0 drawn media.

## 2. Systemic UI audit (all screen families, 360–430 px + wide)
- [x] Rails: chip rails, filter rows and card carousels. Checked:
  - edge padding and reachability
  - fades sized to the peek
  - RTL start
  - selected item scrolled into view
- [x] Settings-style selectors wrap instead of scrolling where the choice set is a form field
- [x] Cards: tile titles are never clamped, metadata gets 3 lines in narrow tiles, and badge/dismiss/bookmark positions were reviewed
- [x] Typography: Arabic line-height, long names and mixed-direction text. Fixes:
  - bidi isolates in the credit line
  - district name kept whole in the Home title
- [x] Sheets/modals: fixed to the phone frame (layout containment), above the nav, including on wide screens
- [x] Fixed bars: the bottom nav and sticky action bars never cover content, and toasts no longer linger over later screens
- [x] Touch targets ≥ 44 px, via real size or an extended tap area
- [x] Empty / loading / error / archived states reviewed (search none, plan empty, provider questions empty, notifications empty)
- [x] English LTR pass. Fixes:
  - bilingual search
  - composed names translated
  - chevrons mirrored
  - text fields follow the typed direction
  - untranslated counters fixed

## 3. Photography
- [x] Replace every illustration-tier mapping with real photography: 128 drawn mappings went to 0
- [x] Neighbourhoods, communities, clubs and member-photo tiles
- [x] Update captions so contextual photos never claim to be the named place («صورة سياقية من مكة … ليست صورة … نفسه»)
- [x] Named outdoor sites take Makkah itself as context rather than a landscape from elsewhere
- [x] Remove the letterbox bands from the Jabal al-Nour photo, and crop the resort sea view out of the pool photo
- [x] PHOTO_SOURCES.md (44 photos, per-photo use, tiers, provenance, what is still generic and why)

## 4. Verification & delivery
- [ ] Regression suites (verify, entry-check, mobile-audit, media-check)
- [ ] UI audit harness clean at every viewport; screenshots reviewed
- [ ] docs/APP_QUALITY_AUDIT.md
- [ ] Commit + push
- [ ] Package ZIP; test the unzipped copy separately
