# EyeMakkah — media accuracy audit

**Branch:** `claude/upbeat-bell-hkmvzy` (the phone app) · **Baseline:** `55482ca`
**Trigger:** stakeholder report that some images depict Al Madinah or other cities instead of Makkah.
**Rule applied:** a photograph is shown as a place only when it is that place. Otherwise the media is generic non-place imagery, a verified Makkah photograph captioned as context, or a labelled illustration.

## 1. Scope and method

| Layer | What was checked |
|---|---|
| Render path | Every raster image goes through one component, `Photo` (the app's only `<img>`), via one resolver, `photoForKind`. No remote image URLs, no CSS `background-image`. The favicon is an inline SVG. The BI web app (`bi/`) is on another branch and out of scope. |
| Call sites | All 24 `<Photo>` call sites: object cards, rails and heroes; decision pages; search rows; neighbourhood cards; community, family and club cards and heroes; community member-photo tiles; Landing and Language covers. |
| Data layer | Every mapping resolved programmatically from the shipped source: **253 mappings**, covering 169 inventory objects, 15 neighbourhoods, 50 community rows (incl. 8 family rows), 8 family cards, 10 clubs and 1 cover. Object `pt` keys, kind-level pools, neighbourhood logic and fallbacks were all traced. |
| Assets | All **47** library photographs inspected visually. Subjects were confirmed by what is in frame, not by filename. Also reviewed: 5 candidate additions (1 Jabal al-Nour, 4 generic coffee). |
| Rendered app | Chromium at 390×844: Landing, Language, Home, Discover, Search, 12 decision pages, the neighbourhood rail, Community, Plan and the provider tools. |

## 2. What was wrong

**Root cause.** Photos were chosen per *scene kind* from shared pools. Those pools mixed Madinah photographs and location-unverified "Makkah" photographs in with generic imagery. As a result, any object of that kind (real named Makkah places included) inherited them. Two objects also referenced photo keys that no longer existed (`haram`, `clock`), so they fell silently into those pools.

**142 of 253 mappings rendered a photograph that has now been removed; 73 of those were Madinah.**

| Case | Evidence | Where it appeared (examples) |
|---|---|---|
| Prophet's Mosque, Madinah (Green Dome) | Green Dome in frame | **المسجد الحرام** decision page; "أول عمرة" community |
| Uhud, Madinah | Mosque below Mount Uhud | **معرض عمارة الحرمين الشريفين**; a guide profile |
| Masjid an-Nabawi umbrellas ×3 | Nabawi umbrella canopy | 50 surfaces, incl. neighbourhoods العزيزية، النسيم، المسفلة، الرصيفة، التنعيم, **عين زبيدة**, حديقة النسيم, clubs |
| Madinah street | Source filename "Madinah-Street" | **محيط الحرم** and بطحاء قريش neighbourhoods |
| Savva café, Madinah ×3 | Brand name on the storefront | 15 Makkah cafés, incl. محمصة مكة |
| "Makkah" street façades ×2 | Madinah-style hotel arches; location unconfirmed | 32 surfaces, incl. الحديبية, سوق الذهب — جرول, سوق التمور |
| Unverified sites ×4 (camels, desert lot, rock face, hill with pole) | Location not identifiable | **جبل النور، جبل ثور**, **حي حراء الثقافي**, **متحف مكة المكرمة**, وادي العسيلة, clubs |
| Other specific venues ×4 | An Indian operator's branded coach, a group in ihram, a Sri Lankan restaurant interior, a named hotel's terrace | Transport, volunteering, events, stays |
| Other | An iStock comp with no reuse basis; a distinctly foreign textile | A Hijazi restaurant; **مجمع كسوة الكعبة المشرفة** |
| Real places on generic pools | e.g. a foreign library interior as **مكتبة مكة المكرمة** | 12 more real/public places |
| Member photos | Stock photos presented as a member's own photo | "صور من المجتمع" rail, contribution tiles |
| Landing cover | Resolved through a pool rather than an explicit verified image | Landing, Language |

## 3. What changed

**Removed from the library (21):** `mosque_evening`, `mosque_red_mountain`, `courtyard_umbrellas`, `courtyard_people_sitting`, `gathering_evening`, `street_transfer_day`, `cafe_interior`, `cafe_front_day`, `cafe_front_night`, `makkah_street_day`, `makkah_street_hotels`, `makkah_camel_site`, `makkah_historic_site`, `makkah_mountain_view`, `makkah_ziyarat_route`, `makkah_coach_group`, `makkah_coach_outside`, `makkah_terrace_dining`, `dining_room_warm`, `food_spread_top`, `craft_loom_colours`. They are deleted from `assets/photos/` and from the inline data. The bundle was scanned to confirm none remain.

**Added (5):**
- **`makkah_jabal_nour`**: Jabal al-Nour, Wikimedia Commons, Selami Akceylan, CC BY 3.0. Verified by the summit profile and the pilgrim path to Hira.
- Four generic coffee photographs (Open Images, CC BY 2.0, authors recorded).

**Root fixes in `EyeMakkah-app.jsx`:**
1. **Pools hold only safe imagery:**
   - non-place generic subjects: dishes, coffee, crafts, books, a hotel room
   - verified Makkah landmarks, for city-level content only (the Haram, Abraj Al Bait, the skyline)

   Kinds with no safe imagery return no photo, so the labelled illustration shows.
2. **`expand()` rule:** objects flagged `real`, and place-type objects other than eateries, cafés and stays, get the illustration unless they carry their own exact photograph. A real named place can no longer inherit a pool photo.
3. **Exact photographs:**
   - المسجد الحرام → Haram/Kaaba
   - متحف برج الساعة → Abraj Al Bait (the museum is in the tower)
   - جبل النور → Jabal al-Nour
4. **Context photographs** (`ptc`), always captioned as not the subject itself:
   - حي حراء الثقافي → Jabal al-Nour (the district sits at its foot)
   - حافلة معالم مكة → the Makkah skyline
5. **Neighbourhoods and their communities:** a photograph only where the landmark is in that district. محيط الحرم gets the Haram; أجياد gets Abraj Al Bait. The other 13 get the illustration.
6. **Member-photo tiles** are always illustrated.
7. **Landing and Language** use the verified Makkah skyline explicitly.
8. **Honest labelling.** The decision-page caption now states the tier: «الصورة: …» / «صورة سياقية: … ليست صورة … نفسه» / «صورة عامة للتوضيح …» / «رسم توضيحي … لا تتوفر صورة موثّقة …». It also handles Arabic gender (نفسه/نفسها). The media badge reads صورة حقيقية / صورة عامة / رسم توضيحي. English strings were added.

**Result (253 mappings):** 6 exact · 2 contextual · 117 generic · 128 illustration. There are 0 references to missing keys, and every library photo is reachable.

## 4. Kept generic or illustrative on purpose

- **Generic, acceptable because the UI captions it as generic and it depicts no identifiable place:**
  - food (10)
  - coffee (6)
  - crafts (5)
  - library/books (3)
  - hotel room (1)

  Some are subject-approximate rather than exact. For example, a calligraphy workshop can draw a pottery image from the crafts pool, and South Asian dishes appear on Hijazi restaurants. These are subject mismatches, not location claims.
- **Contextual Makkah landmarks** on city-level content: visitor communities, the photography club, transport, and the rooftop-café offers in Ajyad.
- **Illustrated because no verified photograph was available:** جبل ثور، عين زبيدة، وادي العسيلة، الحديبية، متحف مكة المكرمة، مجمع كسوة الكعبة، مكتبة مكة المكرمة، معرض عمارة الحرمين، معرض الوحي، على خطاه، سوق العتيبية, the named souqs and parks, and 13 neighbourhoods.

## 5. Sources and licensing

Per-file provenance is in `PHOTO_SOURCES.md`:
- Open Images photos carry author, CC BY 2.0 and the original Flickr page, taken from the dataset's own metadata.
- Unsplash and Pexels photos carry photographer and licence.
- Jabal al-Nour carries its Commons attribution.
- Makkah landmark photos from public GitHub repositories have **no recorded creator or licence**, and the file says so.

The project owner has stated that rights are assumed for this prototype, so nothing was removed on licensing grounds alone. The single exception is the iStock comp, removed because it had no reuse basis at all.

## 6. Could not be confidently verified

- **Creator/licence** of the GitHub-sourced Makkah landmark photos (`makkah_city_dusk`, `makkah_clocktower_day`, `makkah_clocktower_night`, `makkah_tower_night_wide`, `makkah_haram_courtyard`) and of the restaurant-template food photos. Their *subjects* are verified; their provenance is recorded only as far as the source repositories go. `makkah_city_dusk` is credited by its repository to Expedia.
- **Jabal al-Nour's Commons page** was not reachable from the build environment. Attribution is taken from the vendoring repository's `ASSETS.md`, and the subject was confirmed visually.
- **Exact photographs for the illustrated places above** could not be sourced: Wikimedia Commons and stock hosts are blocked by this environment's network policy, and no verified alternative was found.
