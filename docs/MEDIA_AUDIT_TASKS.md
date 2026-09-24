# Media audit — task list

Branch: `claude/upbeat-bell-hkmvzy` (the phone app; `BI-Platform` is the separate BI web app and is out of scope).

## Inventory
- [x] Confirm the active phone-app branch and baseline commit (`55482ca`)
- [x] Find every raster/media path: one `<img>` (inside `Photo`), no CSS `background-image`, no remote image URLs, SVG favicon only
- [x] List all 24 `<Photo>` call sites and what each passes (`kind`, `seed`, `photo`)
- [x] Resolve every rendered mapping programmatically (253: 169 objects, 15 neighbourhoods, 50 communities incl. 8 family rows, 8 family cards, 10 clubs, landing cover)
- [x] Visually inspect all 47 library photographs and classify each

## Findings to fix
- [x] Madinah imagery in pools: Prophet's Mosque (Green Dome), Uhud, Nabawi umbrellas ×3, Madinah street, Savva café ×3 (named Madinah business)
- [x] `المسجد الحرام` object rendered the Prophet's Mosque (stale `pt: "haram"` key fell through to a pool)
- [x] `متحف برج الساعة` object pointed at a removed key (`pt: "clock"`)
- [x] `محيط الحرم` and other neighbourhoods rendered Madinah / unverified streets
- [x] Real named places (جبل النور، جبل ثور، حي حراء، متحف مكة، مجمع الكسوة، مكتبة مكة، عين زبيدة…) inherited unrelated pool photos
- [x] Location-unverified "Makkah" photos (streets ×2, camels, historic site, mountain ×2) presented as specific places
- [x] Foreign/branded venues: Indian operator coach ×2, Sri Lankan restaurant interior, named-hotel terrace
- [x] iStock comp with no reuse basis (`food_spread_top`); distinctly foreign textile (`craft_loom_colours`)
- [x] Community "member photos" filled with stock photos (implied documentary UGC)
- [x] Landing/Language cover resolved through a pool instead of an explicit verified image

## Root fixes
- [x] Remove every incorrect/unverified photo from the library (assets + inline data + credits)
- [x] Pools hold only generic non-place imagery, plus verified Makkah landmarks for city-level content
- [x] `photoForKind` returns no photo for kinds without a safe pool → labelled illustration
- [x] Rule in `expand()`: real places and public-place objects use an exact photo or the illustration, never a pool photo
- [x] Neighbourhood + neighbourhood-community imagery: verified photo only for محيط الحرم and أجياد, illustration elsewhere
- [x] Exact photos for المسجد الحرام, متحف برج الساعة; contextual skyline for حافلة معالم مكة
- [x] Landing/Language use the verified Makkah skyline explicitly
- [x] Decision-page caption and media badge distinguish exact / illustrative photo / illustration
- [x] Add three generic coffee photographs (Open Images, attributed) to reduce duplication in the café pool

## Records
- [x] Recover per-image author/licence for Open Images photos from the dataset metadata
- [x] Rewrite `PHOTO_SOURCES.md`
- [x] Write `docs/MEDIA_AUDIT.md`
- [x] English strings for new captions/badges

## Verification
- [x] Re-resolve all mappings: no removed slot referenced, no Madinah/unverified photo reachable
- [x] Build + `npm run check`
- [x] `verify.mjs` journeys, `entry-check.mjs`, `mobile-audit.mjs`
- [x] Screenshot sweep: Landing, Home, Discover, Search, several decision pages, neighbourhoods, Community, Plan, provider
- [x] Package ZIP and test the unzipped copy separately (both languages, broken-image scan)
- [x] Commit + push to `claude/upbeat-bell-hkmvzy`
