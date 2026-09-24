# EyeMakkah — photo sources

Every photograph the application can render is listed below: 44 files in
`assets/photos/`. `scripts/photos-build.py` builds them from `assets/photos/manifest.json`,
and `scripts/photo-sync.mjs` inlines them into `EyeMakkah-app.jsx` as `PHOTO_DATA`. As a
result, neither the JSX artifact nor the zero-build package needs an image host. The app
has no remote image URLs and no CSS background images.

- `docs/MEDIA_AUDIT.md` records the accuracy audit that removed the Madinah and other
  wrong-place photographs.
- `docs/APP_QUALITY_AUDIT.md` records the quality pass that replaced every remaining
  drawn illustration with real photography.

## How media is chosen (the rule the code enforces)

All content imagery is photographic. The drawn scene engine stays in the code only as
the fallback if a photograph fails to decode. The final QA pass counted 0 drawn media
across every screen audited.

| Tier | When | What the decision page says |
|---|---|---|
| **Exact** | The object's own `pt` names a photograph of that very subject | «الصورة: …» / "Photo: …" |
| **Context** | A verified photograph of Makkah that frames the object without being it. Sources: `pt` + `ptc`, a per-object pick, a neighbourhood, or the Makkah pools for city-level content | «صورة سياقية من مكة: … — ليست صورة … نفسه» / "Context photo from Makkah: … — not a photo of … itself." |
| **Generic** | Subject imagery that shows no identifiable place (dishes, coffee, crafts, books, desert terrain, halls, a hotel room), picked per object (`PHOTO_PICK`) or per kind (`PHOTO_POOLS`) | «صورة عامة للتوضيح — ليست صورة … نفسه» / "Generic photo — not a photo of … itself." |

Rules the code keeps:
- **No other city.** No photograph of Madinah or any other city is in the library.
- **No borrowed places.** No named place is shown with another named place's photograph.
- **Neighbourhoods.** Two districts show their own landmark: محيط الحرم (the Haram) and
  أجياد (Abraj Al Bait). The other 13 show a verified Makkah photograph as city context,
  varied along the rail.
- **Community member photos** (the «صور من المجتمع» rail and the photo tiles on
  contributions) use pool imagery and are labelled as illustrative in this prototype.

**Resolved mappings (253 surfaces):**

| Tier | Surfaces |
|---|---|
| Exact | 5 |
| Context | 70 |
| Generic | 178 |
| Drawn | 0 |

The surfaces cover:
- 169 inventory objects
- 15 neighbourhoods
- 50 communities
- 8 family cards
- 10 clubs
- the Landing/Language cover

Before this pass there were 128 illustration mappings.

## Library

Terms used in the table:
- **"Exact"** and **"context"** describe how a photograph is used.
- **"Verified Makkah"** means the subject was confirmed visually (the Kaaba, Abraj Al
  Bait or Jabal al-Nour's profile is in frame), not only by filename.
- **"Application use"** is computed from the shipped mapping.

| File | Application use | Depicted subject / location | Source | Creator | Licence / reuse basis | Classification |
|---|---|---|---|---|---|---|
| `assets/photos/coffee_black_cup.webp` | 3 surfaces: 3 objects — e.g. قهوة الصباح، تبادل لغوي — عربي/إنجليزي، ركن الشطرنج | Lemongrass & Ginger tea. Pulled from garden. (generic) | https://www.flickr.com/photos/32552299@N04/6778001966 (Open Images V6 image `ac2a19be6aa6e088`) | Lucy Kalantari | CC BY 2.0 | Generic |
| `assets/photos/coffee_cup.webp` | 5 surfaces: 5 objects — e.g. محمصة مكة، مقهى الليل — أجياد، جلسة قهوة وحكايات الحارة | cafe (generic) | https://www.flickr.com/photos/60986678@N08/5551396998 (Open Images V6 image `17416c467792e70f`) | berta_pastor | CC BY 2.0 | Generic |
| `assets/photos/coffee_cup_dark.webp` | 0 surfaces today (kept in its kind's pool for new content) | Eric's Latte Art (generic) | https://www.flickr.com/photos/redbandcoffee/4877591846 (Open Images V6 image `7facac4942003401`) | Redband Coffee Co. | CC BY 2.0 | Generic |
| `assets/photos/coffee_latte_heart.webp` | 2 surfaces: 2 objects — e.g. مقهى الدراسة — الششة، ركن القهوة — المسفلة | Coffee love! (generic) | https://www.flickr.com/photos/dcadenas/5587600775 (Open Images V6 image `dcb9db5b0ab1bc7b`) | Daniel Cadenas | CC BY 2.0 | Generic |
| `assets/photos/coffee_latte_white.webp` | 4 surfaces: 4 objects — e.g. قهوة الحارة، مقهى العائلة — النسيم، مقهى مخصص للنساء — العوالي | Mug Shots with George Howell (generic) | https://www.flickr.com/photos/breville/16913117516 (Open Images V6 image `a8b14d4a442bf4a8`) | Breville USA | CC BY 2.0 | Generic |
| `assets/photos/coffee_small_ornate.webp` | 7 surfaces: 5 objects, 1 community, 1 club — e.g. قهوة التراث — جرول، زيارة كبار السن، لقاء الوافدين الجدد لمكة | Turkish coffee (generic) | https://www.flickr.com/photos/absolutsara/17070965382 (Open Images V6 image `921f8ec5e40246cd`) | Sara D. | CC BY 2.0 | Generic |
| `assets/photos/craft_loom_frame.webp` | 4 surfaces: 2 objects, 2 communities — e.g. ورشة جلود تقليدية، معرض الحرف الموسمي | P1040182.JPG (generic) | https://www.flickr.com/photos/bradspry/4736630383 (Open Images V6 image `2e80e093d1965563`) | Brad Spry | CC BY 2.0 | Generic |
| `assets/photos/craft_loom_hands.webp` | 4 surfaces: 4 objects — e.g. مجمع كسوة الكعبة المشرفة، ورشة السدو للمبتدئين، معرض الحرف السابق | Hands in Motion (generic) | https://www.flickr.com/photos/kretyen/5953163896 (Open Images V6 image `0c0d68281631c4eb`) | Ken Bosma | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_bowls.webp` | 5 surfaces: 3 objects, 2 communities — e.g. سوق الحرفيين المسائي، سوق العطارة، تركيب عطر شخصي | Rustic pots and dishes (generic) | https://www.flickr.com/photos/bonitalabanane/2472056158 (Open Images V6 image `65892cd9e4f9852b`) | Bonita de Boer | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_wheel.webp` | 4 surfaces: 3 objects, 1 club — e.g. حلقة الحرفيين، مقعدان بسعر واحد، ورشة فخار — أول قطعة | Hágalo usted mismo (generic) | https://www.flickr.com/photos/solrobayo/2960806084 (Open Images V6 image `ab552f0453075570`) | Sol Robayo | CC BY 2.0 | Generic |
| `assets/photos/craft_pottery_wheel2.webp` | 0 surfaces today (kept in its kind's pool for new content) | North Carolina Potter (generic) | https://www.flickr.com/photos/46183897@N00/3492636579 (Open Images V6 image `f02e5fa4cf9459c7`) | Robert Nunnally | CC BY 2.0 | Generic |
| `assets/photos/food_bakery_rounds.webp` | 4 surfaces: 3 objects, 1 family card — e.g. حلويات جرول، خصم الحلويات بعد العشاء، بقالة الحي الكبيرة — أجياد | ... Faschingkrapfen im Café Luitpold ... (generic) | https://www.flickr.com/photos/14646075@N03/5506895777 (Open Images V6 image `ca0c7a2b10950385`) | digital cat | CC BY 2.0 | Generic |
| `assets/photos/food_bowl.webp` | 3 surfaces: 2 objects, 1 community — e.g. نباتي هندي — الرصيفة، مطبخ الأسرة — الكعكية | Bowl meal with fresh sides (generic) | https://unsplash.com/photos/1SPu0KT-Ejg (file via github.com/aloukikjoshi/Restaurant-website images/edgar-castrejon-1SPu0KT-Ejg-unsplash.jpg) | Edgar Castrejon | Unsplash License | Generic |
| `assets/photos/food_bread_loaf.webp` | 4 surfaces: 2 objects, 2 communities — e.g. مطبخ الحجاز — العوالي، مطبخ تركي — العزيزية | it's about the crust (generic) | https://www.flickr.com/photos/yutakaseki/16971567450 (Open Images V6 image `519802347d9a5fcf`) | Yutaka Seki | CC BY 2.0 | Generic |
| `assets/photos/food_grill.webp` | 7 surfaces: 7 objects — e.g. سفرة العوالي، مندي الهجرة، ضيافة أسرة مكية | Grilled meat on a board (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/8.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_platter_rice.webp` | 2 surfaces: 2 objects — e.g. شوربة وسلطات — جرول، مطعم الركن — بطحاء قريش | Rice platter with sides (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/1.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_platter_sides.webp` | 4 surfaces: 4 objects — e.g. مشاوي بطحاء قريش، مطبخ نباتي — الششة، مطعم الليل — العزيزية | Rice dish with accompaniments (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/team/3.jpg | not recorded by the source | Repository is Apache-2.0; photograph origin not recorded | Generic |
| `assets/photos/food_prep_hands.webp` | 6 surfaces: 5 objects, 1 family card — e.g. مطبخ مكي — درس عملي، برجر الحي — النسيم، فطور التنعيم | Hands preparing food in a kitchen (generic) | https://www.pexels.com/photo/8951136/ (file via github.com/aloukikjoshi/Restaurant-website images/pexels-ivan-samkov-8951136.jpg) | Ivan Samkov | Pexels License | Generic |
| `assets/photos/food_shared_table.webp` | 4 surfaces: 4 objects — e.g. فول ومعصوب الحارة، برياني الرصيفة، مطعم العائلة — العوالي | Shared table: curries, rice, flatbread (generic) | https://github.com/adeeshperera/restaurant-website-template/blob/main/assets/img/slider/1.jpg | not recorded by the source | Repository is Apache-2.0; the photograph's own origin is not recorded | Generic |
| `assets/photos/food_skewers_grill.webp` | 6 surfaces: 6 objects — e.g. بيت السليق، سمك البحر الأحمر، كبدة الشوقية | DSCF1978 (generic) | https://www.flickr.com/photos/liormasculine/4364686222 (Open Images V6 image `c479a061acbf7ee6`) | Liormasculine | CC BY 2.0 | Generic |
| `assets/photos/food_skewers_tray.webp` | 3 surfaces: 3 objects — e.g. شاورما النسيم، سمك مقلي — الكعكية، بيت الطباخ — العوالي | veggie kabobs (generic) | https://www.flickr.com/photos/gottshar/17316948902 (Open Images V6 image `2bdfe9748821f5d0`) | SharonaGott | CC BY 2.0 | Generic |
| `assets/photos/garden_palm_grove.webp` | 20 surfaces: 11 objects, 6 communities, 3 clubs — e.g. مبادرة تنظيف الحي، مشي مسائي — مجموعة نسائية، نادي مشي مكة | Palm grove with planted beds (generic) | https://www.flickr.com/photos/masterplaan/3784809202/ (Open Images V6 image `7a3a82c259dc7d72`) | Joonas Plaan | CC BY 2.0 | Generic |
| `assets/photos/hall_auditorium.webp` | 3 surfaces: 2 objects, 1 community — e.g. ملتقى الأندية الطلابية، لقاء التقنية الشهري | Auditorium seating and stage (generic) | https://www.flickr.com/photos/u-suke/2682177354 (Open Images V6 image `78d3d0b88b2fa091`) | Yusuke Kawasaki | CC BY 2.0 | Generic |
| `assets/photos/hall_seats_white.webp` | 3 surfaces: 3 objects — e.g. إسعافات أولية — أساسيات، أمسية شعرية، حملة تبرع بالدم | Small hall with white seats (generic) | https://www.flickr.com/photos/98360501@N03/14885801152 (Open Images V6 image `3c6e2a7df352f53b`) | cruisedotco | CC BY 2.0 | Generic |
| `assets/photos/hall_theatre.webp` | 4 surfaces: 3 objects, 1 club — e.g. مسرح الأطفال، محاضرة: مسارات الحج القديمة، نادي المسرح — متوقف مؤقتًا | Theatre stage and seating (generic) | https://www.flickr.com/photos/cpflcultura/3794861209 (Open Images V6 image `c53e9e5ce002345f`) | CPFL Cultura | CC BY 2.0 | Generic |
| `assets/photos/heritage_lantern.webp` | 11 surfaces: 7 objects, 2 communities, 2 family cards — e.g. مشية مكة القديمة، ليلة التراث في جرول، سعيد — مرشد محلي | Ornate wall lantern and carved lattice (generic) | https://www.flickr.com/photos/kewl/5315696058 (Open Images V6 image `1f0e7b8d37fec45b`) | Tristan Schmurr | CC BY 2.0 | Generic |
| `assets/photos/kids_play_frame.webp` | 6 surfaces: 6 objects — e.g. ليلة العائلة في النسيم، رعاية أطفال أثناء الفعاليات، حديقة النسيم | Children's climbing frame (generic) | https://www.flickr.com/photos/62030038@N02/8400425275 (Open Images V6 image `275a14535ec8b689`) | Hobbies on a Budget | CC BY 2.0 | Generic |
| `assets/photos/library_old_books.webp` | 9 surfaces: 8 objects, 1 family card — e.g. متحف مكة المكرمة للتراث والحضارة، ورشة خط عربي للمبتدئين، أمسية قرائية | Book Stacks (generic) | https://www.flickr.com/photos/monkeymyshkin/468730533 (Open Images V6 image `cf2b1577b88dae7e`) | MonkeyMyshkin | CC BY 2.0 | Generic |
| `assets/photos/library_reading_room.webp` | 13 surfaces: 9 objects, 2 communities, 2 clubs — e.g. مكتبة مكة المكرمة، لقاء: عمارة مكة القديمة، محاضرة: تاريخ الأسواق | Librería Desnivel de Madrid (generic) | https://www.flickr.com/photos/ofernandezberrios/7899374124 (Open Images V6 image `bb10f3e84b54bfc7`) | Olga Berrios | CC BY 2.0 | Generic |
| `assets/photos/library_shelves.webp` | 2 surfaces: 2 objects — e.g. مقهى الكتاب — الششة، مترجم مرافق | Book Barn (generic) | https://www.flickr.com/photos/chillihead/1778980935 (Open Images V6 image `7566d3b732a9e208`) | Chilli Head | CC BY 2.0 | Generic |
| `assets/photos/makkah_city_dusk.webp` | 22 surfaces: 10 objects, 7 communities, 4 neighbourhoods, 1 cover — e.g. جبل ثور، وادي العسيلة، حافلة معالم مكة | Makkah at dusk: Abraj Al Bait Clock Tower and Masjid al-Haram | https://github.com/Wa7eed1234/vision-world-hotels/blob/main/public/assets/makkah.jpg — repo README credits its Makkah hero to https://www.expedia.com/Things-To-Do-In-Makkah.d178043.Travel-Guide-Activities | not recorded by the source | Not stated (repo has no licence file); used under the project owner's rights assumption | Verified Makkah — context |
| `assets/photos/makkah_clocktower_day.webp` | 11 surfaces: 4 objects, 4 neighbourhoods, 2 communities, 1 club — e.g. متحف برج الساعة، نادي تصوير مكة، تذكرة عائلية | Abraj Al Bait Clock Tower face, daylight (Ajyad, Makkah) | https://github.com/bkcarwash/taxibhi/blob/main/public/images/hero/makkah-clock-tower-day.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — exact for متحف برج الساعة and أجياد; context elsewhere |
| `assets/photos/makkah_clocktower_night.webp` | 15 surfaces: 5 objects, 4 communities, 3 neighbourhoods, 3 family cards — e.g. جولة تصوير مسائية، نقل مرخّص داخل مكة، سوق الذهب — جرول | Clock Tower and the Kaaba at night, Masjid al-Haram | https://github.com/shafiqahmed73188-art/seair/blob/main/gallery-1.jpeg | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — context |
| `assets/photos/makkah_haram_courtyard.webp` | 11 surfaces: 7 communities, 3 objects, 1 neighbourhood — e.g. المسجد الحرام، معرض عمارة الحرمين الشريفين، تأجير كرسي متحرك | Masjid al-Haram courtyard with the Kaaba and worshippers | https://github.com/shafiqahmed73188-art/seair/blob/main/index%20hajj.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — exact for المسجد الحرام and محيط الحرم; context elsewhere |
| `assets/photos/makkah_jabal_nour.webp` | 4 surfaces: 4 objects — e.g. حي حراء الثقافي، جبل النور، معرض الوحي | Jabal al-Nour (Mountain of Light), Makkah, with pilgrims on the path to Hira — letterbox bands trimmed | https://commons.wikimedia.org/wiki/File:HAC_2010_MEKKE_NUR_DAGINA_BAKIS_-_panoramio_(1).jpg (file obtained via https://github.com/MorhafGhziel/saudinationalday/blob/main/public/worlds/makkah/land-still0.webp, whose ASSETS.md records this attribution) | Selami Akceylan | CC BY 3.0 (per the Commons attribution recorded in ASSETS.md; the Commons page itself was not reachable from the build environment) | Verified Makkah — exact for جبل النور; context for حي حراء الثقافي and its exhibitions |
| `assets/photos/makkah_stay_room.webp` | 5 surfaces: 4 objects, 1 community — e.g. حفظ أمتعة، إقامة أجياد — قريب من الحرم، شقق العزيزية المخدومة | Hotel room interior — generic, not identifiable | https://github.com/shafiqahmed73188-art/seair/blob/main/Swiss%C3%B4tel%20Makkah.jpg | not recorded by the source | Not stated (no licence file); owner's rights assumption | Generic |
| `assets/photos/makkah_tower_night_wide.webp` | 12 surfaces: 5 objects, 4 communities, 3 neighbourhoods — e.g. عين زبيدة، الحديبية، مسار عين زبيدة التراثي | Abraj Al Bait Clock Tower lit green at night | https://github.com/bkcarwash/taxibhi/blob/main/public/images/hero/makkah-clock-tower-night.webp | not recorded by the source | Not stated (no licence file); owner's rights assumption | Verified Makkah — context |
| `assets/photos/market_dates.webp` | 11 surfaces: 7 objects, 4 communities — e.g. سوق العتيبية، وردية سقيا وإفطار، سوق الشوقية الشعبي | Dates in a glass bowl (generic) | https://www.flickr.com/photos/raucousrage/16226438781 (Open Images V6 image `2114f350f99f5b90`) | Laura Hadden | CC BY 2.0 | Generic |
| `assets/photos/museum_diorama.webp` | 1 surface: 1 object — e.g. ورشة علوم للأطفال | Museum gallery with lit display cases (generic) | https://www.flickr.com/photos/dugsong/4168000887 (Open Images V6 image `12380704ef402ba8`) | Dug Song | CC BY 2.0 | Generic |
| `assets/photos/outdoor_desert_peak.webp` | 2 surfaces: 1 object, 1 community — e.g. مشي جبلي عند الشروق | Conical peak in open desert (generic terrain, location not identifiable) | https://www.flickr.com/photos/mikewise/491595084 (Open Images V6 image `76466b5d007e49db`) | Mike Seidman | CC BY 2.0 | Generic |
| `assets/photos/outdoor_desert_peak2.webp` | 1 surface: 1 community | Desert plain with a distant mountain (generic terrain, location not identifiable) | https://www.flickr.com/photos/mattkrause/8124916391 (Open Images V6 image `6b8b527a9b230af2`) | Matt Krause | CC BY 2.0 | Generic |
| `assets/photos/sport_bike_tyre.webp` | 4 surfaces: 3 objects, 1 club — e.g. نادي الدراجات — الشوقية، صالة الحي الرياضية، جولة دراجات عائلية | Mountain-bike wheel (generic) | https://www.flickr.com/photos/sharadaprasad/3668313524 (Open Images V6 image `65d11302b2f7d6d1`) | Sharada Prasad CS | CC BY 2.0 | Generic |
| `assets/photos/sport_pool.webp` | 1 surface: 1 object — e.g. حصة سباحة — للنساء | Swimming-pool water — cropped to the water only; the source's sea view is left out (generic) | https://www.flickr.com/photos/noramorgan/11900033975 (Open Images V6 image `5377c7f4cf087d12`) | Nora Morgan | CC BY 2.0 | Generic |
| `assets/photos/volunteer_water_caps.webp` | 1 surface: 1 object — e.g. يوم تطوعي: خدمة الزوار | Bottled water (generic) | https://www.flickr.com/photos/smithser/7239957418 (Open Images V6 image `ee322603860d9c7a`) | Brian Smithson | CC BY 2.0 | Generic |

**Open Images.**
- The photographs are served from `https://open-images-dataset.s3.amazonaws.com/<split>/<id>.jpg`.
- Author, licence and the original Flickr page come from the dataset's own
  `*-images-with-rotation.csv` metadata.
- Sources are downloaded once into the git-ignored `assets/photos/src/`.
- Each photograph is cover-cropped to its slot: hero 820×512 or card 576×432.
  `sport_pool` is first cropped to the pool water by the manifest's `box`.

**Jabal al-Nour letterbox.** `makkah_jabal_nour` had black letterbox bands of 17 px
at the top and 32 px at the bottom. This pass trimmed them from the committed original
and re-fitted the image to 820×512.

## Where a real photograph is still generic or contextual

These named places still show a generic or contextual photograph, each captioned as such:

| Named place | Photograph shown | Tier |
|---|---|---|
| جبل ثور | Makkah at dusk | context |
| عين زبيدة | Abraj Al Bait at night | context |
| وادي العسيلة | Makkah at dusk | context |
| الحديبية | Abraj Al Bait at night | context |
| متحف مكة المكرمة | old books | generic |
| مجمع كسوة الكعبة المشرفة | hands at a loom | generic |
| مكتبة مكة المكرمة | reading room | generic |
| معرض عمارة الحرمين الشريفين | the Haram | context |
| معرض الوحي | Jabal al-Nour | context |
| على خطاه | Jabal al-Nour | context |
| سوق العتيبية | dates | generic |
| سوق الذهب — جرول | Abraj Al Bait and the Kaaba at night | context |
| the named parks and souqs | category imagery | generic |
| 13 neighbourhoods | Makkah city context | context |

Named sites in the open use Makkah itself as context rather than a generic landscape,
because a desert photograph from elsewhere would pose as the site.

**Why they are not exact.** The build environment's network policy denies every
image host that carries exact photographs of these places: Wikimedia Commons, Flickr,
Openverse, Unsplash, Pexels and Google. Pulling photographs out of unrelated third-party
code repositories was not used as a source for new images.

**How to upgrade one.** Add a `url` entry for the place's photograph to
`assets/photos/manifest.json` (for example its Wikimedia Commons file), then:
1. Run `python3 scripts/photos-build.py --only <slot>` and `node scripts/photo-sync.mjs`.
2. Set that object's `pt` to the slot.

The caption then says «الصورة: …» automatically.

## Reuse basis

The project owner has stated that the prototype has the rights it needs to use suitable
real photography, so no photograph was excluded purely on licensing grounds. Where a
source records no creator or licence, this file says so rather than inventing one.

Before a public release:
- Confirm rights for every row marked "not stated".
- Keep the rules above: an exact photograph must show that subject, and nothing else
  may be presented as a specific place.
