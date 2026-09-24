# EyeMakkah — app quality audit and correction pass

**Branch:** `claude/upbeat-bell-hkmvzy` (the phone app) · **Baseline:** `edf3858`
**Scope:** a screen-by-screen visual, responsive, content-presentation and media audit of
the existing app. Product strategy, primary navigation (الرئيسية / اكتشف / المجتمع /
خطتي, Profile behind the avatar), journeys, semantics, trust/provenance and the content
model are unchanged.

Task list: `docs/APP_QUALITY_AUDIT_TASKS.md`. Photo provenance: `PHOTO_SOURCES.md`.

## 1. Method

**Harness: `scripts/ui-audit.mjs` (new).**

It drives the built app in Chromium across 7 viewports:
- 360×740, 375×667, 390×844, 393×852, 412×915 and 430×932 (phone emulation, DPR 2)
- 1280×800 (the framed desktop view)

It runs in both **Arabic (RTL)** and **English (LTR)**, so each viewport/language pass
walks 59 screen states:

| Screen family | States covered |
|---|---|
| Entry | Landing, Language |
| Home | 4 scroll positions |
| Discover | browse, scrolled, filter sheet, map |
| Search | empty, results, no results |
| Decision pages | place, restaurant, café, experience, event, market, offer, stay — each at top, middle and end |
| Trust | conflicting-sources sheet |
| Community | for-you, all communities, browse (+ scrolled) |
| Neighbourhoods | family page, community page, thread |
| Plan | empty, with items (going / planned / awaiting confirmation) |
| Profile | 3 positions |
| Other | notifications; provider tools (content, participants, questions, signals, publish sheet); dismiss sheet |

At every state it records:
- page-level horizontal overflow
- text cut by the phone frame
- text cut inside a horizontal rail outside the edge fade
- text clipped by its own box
- truncated text
- tap targets under 44 px
- broken images
- drawn (non-photographic) content media

It also saves a screenshot of every state. The screenshots were reviewed as contact
sheets: 360 AR, 390 EN, 412/430 and desktop, the decision pages, and the journey states.

**Existing suites**, re-run on every build:
- `verify.mjs`: 23 journeys, including join → start → complete, the booking handoff, and
  plan states saved / planned / confirmed / completed
- `entry-check.mjs`
- `mobile-audit.mjs`
- `media-check.mjs`: extended to count drawn media and to open سوق العتيبية, جبل ثور,
  عين زبيدة and معرض عمارة الحرمين

**Baseline (`edf3858`, Arabic, 360 / 430 / desktop, 177 states):**

| Check | Count |
|---|---|
| Page overflow | 0 |
| Frame-cut text | 0 |
| Rail-cut text | 77 |
| Truncations | 180 |
| Small targets | 225 |
| Broken images | 0 |
| Drawn content media | 240 |

## 2. Systemic issues, root causes and corrections

| # | Issue (where seen) | Root cause | Correction (shared component) |
|---|---|---|---|
| 1 | Rail cards amputated at the edge: Home «يبدأ قريبًا», «أقل شهرة», neighbourhood and club rails | Fixed-pixel card widths (172–190 px) with no edge treatment. On a 360–430 px screen, the card crossing the edge showed half a title. | Card widths size to the phone frame (CSS container units): tiles show 2.3 per screen and feature cards 1.28. `useRailFades` adds an edge fade only while content continues past that edge, and sizes the fade to the actual visible peek. The first selected chip of a rail is scrolled into view. |
| 2 | Profile «حيّك أو منطقتك الحالية» cut «النسيم» | A form choice (15 districts) was built as a horizontal scroll rail | Form selectors wrap: Home time chips, Profile district, linked communities on decision pages, the Ask sheet's type/target chips, the provider publish district chips. Discover intents and the source-sheet fields stay rails, with fades. |
| 3 | Sheets opened at the bottom of the page, under the bottom nav, or (on desktop) across the whole browser window | Sheets were `absolute` inside a scroll container. The `fill-mode: both` entrance animations created stacking contexts that trapped them under the nav. `container-type` alone does not contain fixed descendants. | Sheets are `position: fixed` and the phone frame has `contain: layout`, so every sheet and scrim covers exactly the visible frame. Entrance animations use `fill-mode: backwards`. |
| 4 | Tile titles and metadata cut in English («Talk: the architecture of o…», «… — SAR…») | 2-line clamps sized for Arabic | Tile titles are never clamped. Tile metadata gets 3 lines. |
| 5 | Location prompt cut its own action in English («… turn on location fo…») | Single-line clamp | The prompt wraps. |
| 6 | Home title broke «Al-Awali» at its hyphen | Plain string | The district name is kept whole. |
| 7 | Toast «أُضيف إلى خطتي …» lingered over later screens (Profile, Plan) | The shell passed a new `onDone` on every render, which restarted the timer | The timer depends only on the message; it dismisses after 2.4 s. |
| 8 | English search found nothing («cafe», «Sufrat Al-Awali») | Search matched Arabic source text only | Search matches every field in Arabic and in its English form, case- and accent-insensitively. Suggested searches use the reading language. |
| 9 | Composed names shown in Arabic in English («مطعم الركن — العوالي»), «٢١ وجدوها مفيدة», ~140 JSX strings | Composed strings and untracked JSX text | `enText()` translates composed « — » names part by part. Counters and ~120 strings were added to `i18n/en.json`. Composites use `tx()`. |
| 10 | Chevrons pointed the wrong way in English; the send arrow pointed away from the text in Arabic | Icons drawn for one direction | Chevrons mirror in LTR; the send icon mirrors in RTL. |
| 11 | Text fields forced RTL in English (the placeholder was cut from the start; typed Latin text was right-aligned) | Hard-coded `dir="rtl"` on 7 fields | `dir="auto"`: fields follow what is typed, and an empty field follows the reading direction. The placeholder uses an ellipsis. |
| 12 | Mixed-direction credit reordered its parentheses in Arabic («(3.0 …») | Latin runs inside an RTL sentence | The Latin runs are wrapped in bidi isolates. |
| 13 | Tap targets under 44 px (225 at baseline) | Icon buttons at 36–40 px; tabs at 40 px; text links at 32 px | A 44 × 44 tap area (`.tap`) on header, search, hero-back and section-action buttons, links and pins (36 px on the map). Tabs are 44 px. The notifications back button went from 22 px to a full target. Unlabelled hero back buttons got `aria-label`. |
| 14 | Content showed through the sticky headers | 92 % background | 97.5 %. |
| 15 | Drawn illustrations as content imagery (240 drawn surfaces at baseline) | The illustration tier of the media rule | Real photography everywhere (section 4). |
| 16 | English only: a second bottom nav stacked on the first, and on decision pages the nav stayed on screen and hid the action bar (Directions / Add to my plan) | The English localizer re-created each component element with `key: null`. `createElement` turns that into the string "null", so unkeyed siblings shared one key and React kept stale copies. | The element's key is passed on only when it has one. Verified: 4 nav buttons on every tab and 0 on search and decision pages, in both languages. |
| 17 | English handoff sheet and action-bar footers stayed Arabic («تابع إلى …», «يكتمل لدى …») | Template strings around a partner name | `tx()` plus `partnerEn()` («Continue to the booking platform»). Names inside English sentences go through `D()`. |
| 18 | English search could not find an Arabic query, and vice versa | Object, community and contribution fields are language-aware getters, so search saw only one language | Search reads each field's Arabic source and its English form, in either reading language. |
| 19 | A redeploy could keep serving the previous `app.js` to returning visitors | `vercel.json` marked a non-hashed `app.js` as `immutable` for a year | `app.js` now revalidates (`max-age=0, must-revalidate`). |

## 3. Responsive and layout results

The final full matrix and its numbers are in section 6. What changed for each width:

- **360 / 375 px:**
  - Rails show two whole cards and a faded peek.
  - Time chips fit on one row.
  - District chips wrap to four rows.
  - Decision-page action bars fit.
- **412 / 430 px:**
  - Cards grow with the screen, up to 204 px for tiles and 340 px for feature cards.
  - The fade covers the wider peek (it was hard-cut before, the "rail cut" count at 412/430 in the pre-fix run).
- **Desktop (1280 × 800):**
  - The app is a 390 px framed phone.
  - Sheets and scrims stay inside the frame.
- **English LTR:** rails start at the left with the fade on the right, and search, names, counters, chevrons and fields read left-to-right.

## 4. Photography

**Before:**
- 31 photographs
- 128 of 253 media mappings drawn as editorial illustrations: 13 neighbourhoods, most
  named places, communities, clubs and member-photo tiles

**After:**
- 44 photographs
- 0 drawn mappings

| Tier | Mappings | What it is |
|---|---|---|
| Exact | 5 | المسجد الحرام، متحف برج الساعة، جبل النور, and the landmark districts محيط الحرم and أجياد |
| Context | 70 | A verified photograph of Makkah, captioned «صورة سياقية من مكة: … — ليست صورة … نفسه»: 13 neighbourhoods and their communities, visitor/Hajj communities, city-level content, the Hira district and its exhibitions, the named outdoor sites |
| Generic | 178 | Subject imagery with no identifiable place (dishes, coffee, crafts, books, halls, desert terrain for unnamed hikes), captioned «صورة عامة للتوضيح — ليست صورة … نفسه» |

**Library changes:**
- **13 photographs added** (Open Images, CC BY 2.0, authors and Flickr pages recorded):
  dates, palm grove, playground, museum gallery, lantern, two desert peaks, bike wheel,
  pool water, bottled water, and three halls/theatres.
- A 14th candidate (Death Valley scrub) was added and then removed: after named sites
  moved to Makkah context it was unused, and it was the most "elsewhere" of the set.

**Mapping rules:**
- `PHOTO_PICK` gives 73 objects a subject-appropriate photo where the kind's pool fit
  badly. For example: a blood drive gets a hall, not a food photo; the gold souq gets
  Makkah context; a women's swim gets pool water; calligraphy gets books, not pottery; Sadu gets a loom; playgrounds get a playground. Services with no fitting subject photograph (repair, a pharmacy, a laundry, a photographer, wheelchair rental) take Makkah as context rather than an unrelated craft. Clubs show their activity's own photograph.
- **Named sites in the open** (جبل ثور، عين زبيدة، وادي العسيلة، الحديبية، مطل مكة
  الشمالي، مسار عين زبيدة) use Makkah itself as context. A desert photograph from
  elsewhere would pose as the site.
- **Member-photo tiles and the «صور من المجتمع» rail** use pool photography and say so:
  «الصور في هذا النموذج توضيحية».

**Fixes to individual photos:**
- Jabal al-Nour: black letterbox bands (17 px top, 32 px bottom) trimmed.
- The pool photo: cropped to the water, so the Caribbean sea view behind it is gone.
- Every photograph was re-inspected for cultural fit.

**Pipeline:**
- `assets/photos/manifest.json` + `scripts/photos-build.py` build slots, with optional
  `box` crops and `--only`.
- `scripts/photo-sync.mjs` inlines them. Its end-of-block detection was fixed.

**Network limit.** Exact photographs of the remaining named places could not be sourced.
- The build environment's network policy denies Wikimedia Commons, Flickr, Openverse,
  Unsplash, Pexels and Google.
- Pulling images out of unrelated third-party code repositories was not used.

`PHOTO_SOURCES.md` lists every such place and the upgrade step (a manifest `url` plus the
object's `pt`).

## 5. Intentionally unchanged

- **Rails that stay rails:**
  - Discover intents («الليلة / هذا الأسبوع / …»)
  - source-sheet fields
  - card carousels

  These are browse controls, not form fields. They scroll with fades and every item is
  reachable.
- **Intentional ellipsis on secondary text:**
  - contribution excerpts (3 lines; the thread shows the full text)
  - row taglines (1 line)
  - neighbourhood blurbs and "why" lines (2 lines)

  Names, actions and prices in tiles are not clamped.
- **The drawn scene engine** stays in the code, but only as the fallback if a
  photograph fails to decode.
- **The map** remains a schematic prototype map. In the densest spot, labels can sit
  under pins.
- **Brief toasts** («أُضيف إلى خطتي …») sit above the nav for 2.4 s by design.

## 6. Verification

Final build `dist/app.js`, 2233.5 KB, 44 inlined photographs:
- `verify.mjs`: 23/23 journeys, 0 runtime errors
- `entry-check.mjs`: 12/12, 0 runtime errors
- `mobile-audit.mjs`: 0 findings
- `media-check.mjs`: 0 drawn media, 0 broken images, 0 illustration captions, 0 runtime errors

The full UI matrix and the package test are recorded in section 7.

## 7. Final matrix and package

(filled in from the final run; see below)

## 8. Could not be confirmed

- **Exact photographs** for the named places listed in `PHOTO_SOURCES.md`: every image
  host is blocked by the network policy.
- **Real devices.** Everything was verified in Chromium phone emulation and a desktop
  window. iOS Safari, Android Chrome and physical safe areas were not run.
- **Screen readers** (VoiceOver / TalkBack) were not run. Only labels and roles were
  checked.
- **Creator/licence** of the GitHub-sourced Makkah photographs, as recorded since the
  media audit (`PHOTO_SOURCES.md`).
