# EyeMakkah — media layer and photography

Real photography is the **normal** media experience in EyeMakkah. Every media surface —
Home, Discover, Search, map/decision context, decision pages, restaurants and food,
activities, experiences, events, communities, neighborhoods, markets, cultural places and
Plan — renders a real photograph from the bundled library below. The deterministic drawn
scene engine (`Scene` / `SceneBody`) still exists, but only underneath, as the technical
fallback that shows if an image fails to decode.

## 1. How a photograph is chosen

1. If the object carries its own `photo` key, that exact photograph is used and the
   decision page credits it by name. This is reserved for a photograph of the actual
   subject.
2. Otherwise the object's scene kind resolves to a pool of real photographs
   (`PHOTO_POOLS`) and a deterministic hash of the object id picks one, so the same
   object always shows the same photograph and neighbouring cards do not repeat.
3. Pool photographs are labelled **صورة تعبيرية** in the media badge, and the decision
   page says in plain Arabic that the photograph is a real, illustrative image from the
   prototype library and **not** a photograph of that place itself, followed by its source.
   No generic photograph is ever presented as the exact named business or place.

## 2. Where the assets live

- `assets/photos/*.webp` — the processed library (820×512 for hero crops, 576×432 for
  cards, WebP q52).
- `assets/photo-data.js` — the same images base64-encoded; the generator inlines this into
  `EyeMakkah-app.jsx` as `PHOTO_DATA`, so the single-file JSX artifact and the zero-build
  Vercel package both carry their own photography and need no image host at runtime.

## 3. The library (47 photographs)

| Key | Subject | Source repository / dataset | Path or image id |
|---|---|---|---|
| `cafe_front_day` | Specialty coffee shop storefront, day | github.com/MuradBadaev/savva-cafe | `photos/storefront-day.jpg` |
| `cafe_front_night` | Specialty coffee shop storefront, night | github.com/MuradBadaev/savva-cafe | `photos/storefront-night.jpg` |
| `cafe_interior` | Specialty coffee shop interior (Savva, Madinah) | github.com/MuradBadaev/savva-cafe | `photos/interior.jpg` |
| `coffee_cup` | Cup of coffee | Open Images Dataset V6 (CC BY 4.0) | `test/17416c467792e70f` |
| `coffee_cup_dark` | Cup of coffee, dark background | Open Images Dataset V6 (CC BY 4.0) | `test/7facac4942003401` |
| `courtyard_people_sitting` | People sitting together under courtyard umbrellas | github.com/bkcarwash/taxibhi | `public/images/hero/madinah-nabawi-pilgrims-umbrellas.webp` |
| `courtyard_umbrellas` | Shade umbrellas over a mosque courtyard | github.com/bkcarwash/taxibhi | `public/images/ziyarat/madinah-nabawi-umbrella-courtyard.webp` |
| `craft_loom_colours` | Coloured warp on a loom | Open Images Dataset V6 (CC BY 4.0) | `test/41997dbb05aaf10b` |
| `craft_loom_frame` | Loom frame with woven cloth | Open Images Dataset V6 (CC BY 4.0) | `test/2e80e093d1965563` |
| `craft_loom_hands` | Hands weaving on a hand loom | Open Images Dataset V6 (CC BY 4.0) | `test/0c0d68281631c4eb` |
| `craft_pottery_bowls` | Finished pottery bowls on a workshop table | Open Images Dataset V6 (CC BY 4.0) | `test/65892cd9e4f9852b` |
| `craft_pottery_wheel` | Hands shaping clay on a wheel | Open Images Dataset V6 (CC BY 4.0) | `test/ab552f0453075570` |
| `craft_pottery_wheel2` | Throwing a pot on the wheel | Open Images Dataset V6 (CC BY 4.0) | `test/f02e5fa4cf9459c7` |
| `dining_room_warm` | Warm restaurant dining room | github.com/adeeshperera/restaurant-website-template | `assets/img/slider/3.jpg` |
| `food_bakery_rounds` | Bakery breads on a tray | Open Images Dataset V6 (CC BY 4.0) | `test/ca0c7a2b10950385` |
| `food_bowl` | Bowl meal with fresh sides | github.com/aloukikjoshi/Restaurant-website | `images/edgar-castrejon-1SPu0KT-Ejg-unsplash.jpg` |
| `food_bread_loaf` | Fresh bread loaf | Open Images Dataset V6 (CC BY 4.0) | `test/519802347d9a5fcf` |
| `food_grill` | Grilled meat on a board | github.com/adeeshperera/restaurant-website-template | `assets/img/team/8.jpg` |
| `food_platter_rice` | Rice platter with side dishes | github.com/adeeshperera/restaurant-website-template | `assets/img/team/1.jpg` |
| `food_platter_sides` | Rice dish with accompaniments | github.com/adeeshperera/restaurant-website-template | `assets/img/team/3.jpg` |
| `food_prep_hands` | Hands preparing food in a kitchen | github.com/aloukikjoshi/Restaurant-website | `images/pexels-ivan-samkov-8951136.jpg` |
| `food_shared_table` | Shared table — curries, rice and flatbread | github.com/adeeshperera/restaurant-website-template | `assets/img/slider/1.jpg` |
| `food_skewers_grill` | Skewers over a grill | Open Images Dataset V6 (CC BY 4.0) | `test/c479a061acbf7ee6` |
| `food_skewers_tray` | Skewers on a tray | Open Images Dataset V6 (CC BY 4.0) | `test/2bdfe9748821f5d0` |
| `food_spread_top` | Table spread from above | github.com/aloukikjoshi/Restaurant-website | `images/istockphoto-1317255793-612x612.jpg` |
| `gathering_evening` | Large evening gathering | github.com/umair986/MuftiTravels | `public/gallery/3.jpg` |
| `library_old_books` | Stacks of old bound books | Open Images Dataset V6 (CC BY 4.0) | `test/cf2b1577b88dae7e` |
| `library_reading_room` | Library reading room shelves | Open Images Dataset V6 (CC BY 4.0) | `test/bb10f3e84b54bfc7` |
| `library_shelves` | Library shelving | Open Images Dataset V6 (CC BY 4.0) | `test/7566d3b732a9e208` |
| `makkah_camel_site` | Camels on the outskirts of Makkah | github.com/bkcarwash/taxibhi | `public/images/ziyarat/makkah-camel-site-tour.webp` |
| `makkah_city_dusk` | Makkah skyline at dusk — Clock Tower, Haram and the city | github.com/Wa7eed1234/vision-world-hotels | `public/assets/makkah.jpg` |
| `makkah_clocktower_day` | Abraj Al Bait Clock Tower, daylight | github.com/bkcarwash/taxibhi | `public/images/hero/makkah-clock-tower-day.webp` |
| `makkah_clocktower_night` | Clock Tower and the Haram at night | github.com/shafiqahmed73188-art/seair | `gallery-1.jpeg` |
| `makkah_coach_group` | Group travelling together inside a coach | github.com/shafiqahmed73188-art/seair | `gallery-2.jpeg` |
| `makkah_coach_outside` | Licensed coach, Makkah transport | github.com/shafiqahmed73188-art/seair | `gallery-6.jpeg` |
| `makkah_haram_courtyard` | Haram courtyard, people at prayer | github.com/shafiqahmed73188-art/seair | `index hajj.webp` |
| `makkah_historic_site` | Historic site entrance on the city's edge | github.com/bkcarwash/taxibhi | `public/images/ziyarat/makkah-historical-site-entrance.webp` |
| `makkah_mountain_view` | Rocky Makkah mountains | github.com/bkcarwash/taxibhi | `public/images/ziyarat/makkah-mountain-view.webp` |
| `makkah_stay_room` | Accommodation room in Makkah | github.com/shafiqahmed73188-art/seair | `Swissôtel Makkah.jpg` |
| `makkah_street_day` | Makkah street, daytime | github.com/umair986/MuftiTravels | `public/packages/package1.webp` |
| `makkah_street_hotels` | Makkah building facades and street traffic | github.com/umair986/MuftiTravels | `public/packages/package2.webp` |
| `makkah_terrace_dining` | Terrace seating overlooking the Haram | github.com/shafiqahmed73188-art/seair | `Raffles Makkah Palace.jpg` |
| `makkah_tower_night_wide` | Abraj Al Bait at night, wide | github.com/bkcarwash/taxibhi | `public/images/hero/makkah-clock-tower-night.webp` |
| `makkah_ziyarat_route` | Makkah ziyarat route, hillside monument | github.com/bkcarwash/taxibhi | `public/images/ziyarat/makkah-ziyarat-route.webp` |
| `mosque_evening` | Mosque courtyard in the evening (Madinah) | github.com/umair986/MuftiTravels | `public/Hero/hero1.jpg` |
| `mosque_red_mountain` | Mosque against a red mountain (Uhud, Madinah) | github.com/bkcarwash/taxibhi | `public/images/ziyarat/madinah-uhud-sunset.webp` |
| `street_transfer_day` | Private transfer vehicle on a city street | github.com/bkcarwash/taxibhi | `public/Taxi-Bhai-GMC-SUV-Madinah-Street-Private-Transfer.jpg` |

Open Images entries are fetched from `https://open-images-dataset.s3.amazonaws.com/<split>/<id>.jpg`;
the dataset's image-level annotations are CC BY 4.0 and the photographs are CC BY 2.0 from
their original Flickr authors. GitHub entries are files committed to the public
repositories named above.

## 4. What this environment could and could not reach

The build environment's egress policy denies every stock-photo and media CDN
(`images.unsplash.com`, `images.pexels.com`, `cdn.pixabay.com`, `live.staticflickr.com`,
`i.imgur.com`, `media.istockphoto.com`) and all of Wikimedia (`upload.wikimedia.org`,
`commons.wikimedia.org`, `api.wikimedia.org`), so the previous Wikimedia hotlinks were
removed. GitHub, Amazon S3 and Google Cloud Storage are reachable, which is why the
library above is sourced from public GitHub repositories and the Open Images dataset.

Consequences worth knowing before a public release:

- **Exact-subject photography is thin.** Makkah's real named places (Hira Cultural
  District, the Clock Tower Museum, the Kiswah complex, individual restaurants and cafés)
  have no exact photograph in the library, so they render a labelled illustrative
  photograph rather than a false claim.
- **Everyday Makkah life is under-represented.** Local markets, family and student scenes,
  neighbourhood streets and volunteering could not be sourced at an acceptable standard;
  those surfaces currently draw on the nearest appropriate real photography (courtyards,
  streets, crafts, food) rather than Makkah-specific imagery.

## 5. Production requirement

Before any public release, replace this library with imagery your organization **owns or
has explicitly licensed**, hosted on your own CDN, covering: Makkah places and landmarks,
named partner restaurants and cafés, markets and craftspeople, neighbourhoods and streets,
families, students, workshops, community activity and evening life. Keep the two rules the
prototype already enforces: an exact-subject photograph is credited as such, and anything
else is visibly labelled illustrative.
