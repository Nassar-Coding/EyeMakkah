# EyeMakkah — photo sources

Every photograph the application can render is listed below — 31 files in
`assets/photos/`, inlined into `EyeMakkah-app.jsx` as `PHOTO_DATA` by
`scripts/photo-sync.mjs` so the JSX artifact and the zero-build package need no image
host. There are no remote image URLs and no CSS background images in the app.

The accuracy audit that produced this library is in `docs/MEDIA_AUDIT.md`.

## How media is chosen (the rule the code enforces)

| Tier | When | What the user is told |
|---|---|---|
| **Exact** | The object's own `pt` names a photograph of that very subject | Caption: «الصورة: …» with the subject; badge «صورة حقيقية» |
| **Contextual** | `pt` + `ptc`: a verified Makkah photograph that frames the object without being it | Caption: «صورة سياقية: … — ليست صورة المكان نفسه» |
| **Generic** | Non-place imagery (dishes, coffee, crafts, books, a hotel room) or verified Makkah landmarks for city-level content | Caption: «صورة عامة للتوضيح — ليست صورة … نفسه»; badge «صورة عامة» |
| **Illustration** | Everything else | The drawn editorial scene; caption «رسم توضيحي داخل التطبيق — لا تتوفر صورة موثّقة …»; badge «رسم توضيحي» |

Real named places (`real: true`) and public-place objects never take a generic pool
photograph. Neighbourhoods show a photograph only where the pictured landmark is in that
district (محيط الحرم, أجياد). Community "member photos" are always illustrated, because no
stock photograph can stand in for what a member shared. No photograph of Madinah or any
other city is in the library.

## Library

"Exact" and "contextual" describe how a photograph is used; "Verified Makkah" means the
subject was confirmed visually (the Kaaba, Abraj Al Bait or Jabal al-Nour's profile is in
frame), not only by filename.

| File | Application use | Depicted subject / location | Source | Creator | Licence / reuse basis | Classification |
|---|---|---|---|---|---|---|
| `assets/photos/coffee_black_cup.webp` | cafe pool | Lemongrass & Ginger tea. Pulled from garden. (generic) | https://www.flickr.com/photos/32552299@N04/6778001966 (Open Images V6 image `ac2a19be6aa6e088`) | Lucy Kalantari | CC BY 2.0 | Generic |
| `assets/photos/coffee_cup.webp` | cafe pool | cafe (generic) | https://www.flickr.com/photos/60986678@N08/5551396998 (Open Images V6 image `17416c467792e70f`) | berta_pastor | CC BY 2.0 | Generic |
| `assets/photos/coffee_cup_dark.webp` | cafe pool | Eric's Latte Art (generic) | https://www.flickr.com/photos/redbandcoffee/4877591846 (Open Images V6 image `7facac4942003401`) | Redband Coffee Co. | CC BY 2.0 | Generic |
| `assets/photos/coffee_latte_heart.webp` | cafe pool | Coffee love! (generic) | https://www.flickr.com/photos/dcadenas/5587600775 (Open Images V6 image `dcb9db5b0ab1bc7b`) | Daniel Cadenas | CC BY 2.0 | Generic |
| `assets/photos/coffee_latte_white.webp` | cafe pool | Mug Shots with George Howell (generic) | https://www.flickr.com/photos/breville/16913117516 (Open Images V6 image `a8b14d4a442bf4a8`) | Breville USA | CC BY 2.0 | Generic |
| `assets/photos/coffee_small_ornate.webp` | cafe pool | Turkish coffee (generic) | https://www.flickr.com/photos/absolutsara/17070965382 (Open Images V6 image `921f8ec5e40246cd`) | Sara D. | CC BY 2.0 | Generic |
| `assets/photos/craft_loom_frame.webp` | workshop pool | P1040182.JPG (generic) | https://www.flickr.com/photos/bradspry/4736630383 (Open Images V6 image `2e80e093d1965563`) | Brad Spry | CC BY 2.0 | Generic |
| `assets/photos/craft_loom_hands.webp` | workshop pool | Hands in Motion (generic) | https://www.flickr.com/photos/kretyen/5953163896 (Open Images V6 image `0c0d68281631c4eb`) | Ken Bosma | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_bowls.webp` | workshop pool | Rustic pots and dishes (generic) | https://www.flickr.com/photos/bonitalabanane/2472056158 (Open Images V6 image `65892cd9e4f9852b`) | Bonita de Boer | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_wheel.webp` | workshop pool | Hágalo usted mismo (generic) | https://www.flickr.com/photos/solrobayo/2960806084 (Open Images V6 image `ab552f0453075570`) | Sol Robayo | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_wheel2.webp` | workshop pool | North Carolina Potter (generic) | https://www.flickr.com/photos/46183897@N00/3492636579 (Open Images V6 image `f02e5fa4cf9459c7`) | Robert Nunnally | CC BY 2.0 | Generic |
| `assets/photos/food_bakery_rounds.webp` | food pool | ... Faschingkrapfen im Café Luitpold ... (generic) | https://www.flickr.com/photos/14646075@N03/5506895777 (Open Images V6 image `ca0c7a2b10950385`) | digital cat | CC BY 2.0 | Generic |
| `assets/photos/food_bowl.webp` | food pool | Bowl meal with fresh sides (generic) | https://unsplash.com/photos/1SPu0KT-Ejg (file via github.com/aloukikjoshi/Restaurant-website images/edgar-castrejon-1SPu0KT-Ejg-unsplash.jpg) | Edgar Castrejon | Unsplash License | Generic |
| `assets/photos/food_bread_loaf.webp` | food pool | it's about the crust (generic) | https://www.flickr.com/photos/yutakaseki/16971567450 (Open Images V6 image `519802347d9a5fcf`) | Yutaka Seki | CC BY 2.0 | Generic |
| `assets/photos/food_grill.webp` | food pool | Grilled meat on a board (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/8.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_platter_rice.webp` | food pool | Rice platter with sides (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/1.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_platter_sides.webp` | food pool | Rice dish with accompaniments (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/3.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_prep_hands.webp` | food pool | Hands preparing food in a kitchen (generic) | https://www.pexels.com/photo/8951136/ (file via github.com/aloukikjoshi/Restaurant-website images/pexels-ivan-samkov-8951136.jpg) | Ivan Samkov | Pexels License | Generic |
| `assets/photos/food_shared_table.webp` | food pool | Shared table: curries, rice, flatbread (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/slider/1.jpg | not recorded by the source | Repository is Apache-2.0; the photograph's own origin is not recorded | Generic |
| `assets/photos/food_skewers_grill.webp` | food pool | DSCF1978 (generic) | https://www.flickr.com/photos/liormasculine/4364686222 (Open Images V6 image `c479a061acbf7ee6`) | Liormasculine | CC BY 2.0 | Generic |
| `assets/photos/food_skewers_tray.webp` | food pool | veggie kabobs (generic) | https://www.flickr.com/photos/gottshar/17316948902 (Open Images V6 image `2bdfe9748821f5d0`) | SharonaGott | CC BY 2.0 | Generic |
| `assets/photos/library_old_books.webp` | library pool | Book Stacks (generic) | https://www.flickr.com/photos/monkeymyshkin/468730533 (Open Images V6 image `cf2b1577b88dae7e`) | MonkeyMyshkin | CC BY 2.0 | Generic |
| `assets/photos/library_reading_room.webp` | library pool | Librería Desnivel de Madrid (generic) | https://www.flickr.com/photos/ofernandezberrios/7899374124 (Open Images V6 image `bb10f3e84b54bfc7`) | Olga Berrios | CC BY 2.0 | Generic |
| `assets/photos/library_shelves.webp` | library pool | Book Barn (generic) | https://www.flickr.com/photos/chillihead/1778980935 (Open Images V6 image `7566d3b732a9e208`) | Chilli Head | CC BY 2.0 | Generic |
| `assets/photos/makkah_city_dusk.webp` | Landing + Language cover; skyline pool; context photo for حافلة معالم مكة | Makkah at dusk: Abraj Al Bait Clock Tower and Masjid al-Haram | https://github.com/Wa7eed1234/vision-world-hotels/blob/main/public/assets/makkah.jpg — repo README credits its Makkah hero to https://www.expedia.com/Things-To-Do-In-Makkah.d178043.Travel-Guide-Activities | not recorded by the source | Not stated (repo has no licence file); used under the project owner's rights assumption | Verified Makkah — contextual (city-wide) |
| `assets/photos/makkah_clocktower_day.webp` | Exact photo for متحف برج الساعة; neighbourhood أجياد; skyline pool | Abraj Al Bait Clock Tower face, daylight (Ajyad, Makkah) | https://github.com/bkcarwash/taxibhi/blob/main/public/images/hero/makkah-clock-tower-day.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — exact for the Clock Tower / its museum building |
| `assets/photos/makkah_clocktower_night.webp` | haram + skyline pools (visitor communities, city-level content) | Clock Tower and the Kaaba at night, Masjid al-Haram | https://github.com/shafiqahmed73188-art/seair/blob/main/gallery-1.jpeg | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — contextual |
| `assets/photos/makkah_haram_courtyard.webp` | Exact photo for المسجد الحرام; neighbourhood محيط الحرم; haram pool | Masjid al-Haram courtyard with the Kaaba and worshippers | https://github.com/shafiqahmed73188-art/seair/blob/main/index%20hajj.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — exact for المسجد الحرام |
| `assets/photos/makkah_jabal_nour.webp` | Exact photo for جبل النور; context photo for حي حراء الثقافي | Jabal al-Nour (Mountain of Light), Makkah, with pilgrims on the path to Hira | https://commons.wikimedia.org/wiki/File:HAC_2010_MEKKE_NUR_DAGINA_BAKIS_-_panoramio_(1).jpg (file obtained via https://github.com/MorhafGhziel/saudinationalday/blob/main/public/worlds/makkah/land-still0.webp, whose ASSETS.md records this attribution) | Selami Akceylan | CC BY 3.0 (per the Commons attribution recorded in ASSETS.md; the Commons page itself was not reachable from the build environment) | Verified Makkah — exact for جبل النور |
| `assets/photos/makkah_stay_room.webp` | stay pool (stays, stay-type services, the housing community) | Hotel room interior — generic, not identifiable | https://github.com/shafiqahmed73188-art/seair/blob/main/Swiss%C3%B4tel%20Makkah.jpg | not recorded by the source | Not stated (no licence file); owner's rights assumption | Generic |
| `assets/photos/makkah_tower_night_wide.webp` | skyline pool | Abraj Al Bait Clock Tower lit green at night | https://github.com/bkcarwash/taxibhi/blob/main/public/images/hero/makkah-clock-tower-night.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — contextual |

Open Images photographs are served from `https://open-images-dataset.s3.amazonaws.com/<split>/<id>.jpg`;
author, licence and original Flickr page come from the dataset's own
`*-images-with-rotation.csv` metadata.

## Reuse basis

The project owner has stated that the prototype has the rights it needs to use suitable
real photography, so no photograph was excluded purely on licensing grounds. Where a
source records no creator or licence, this file says so rather than inventing one. Before
a public release, confirm rights for every row marked "not stated", and keep the two
rules above: an exact photograph must show that subject, and nothing else may be
presented as a specific place.
