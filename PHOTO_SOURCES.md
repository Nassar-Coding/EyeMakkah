# EyeMakkah — media layer and photography

Photography is product content in EyeMakkah, not decoration. This prototype uses two
media layers, and it is explicit with the user about which one it is showing.

## 1. Editorial artwork (default)

Every inventory object renders a **deterministic, drawn editorial scene** built in SVG
inside the app (`Scene` / `SceneBody` in `EyeMakkah-app.jsx`). Scene kind comes from the
object (`sc`), and the seed comes from the object id, so:

- every object gets a visually distinct image and nothing repeats across the app;
- images work offline and never depend on a third-party host;
- **a drawn scene is never presented as a photograph of a specific business or event.**
  Decision pages state this in plain Arabic under the hero:
  «صورة تعبيرية مرسومة داخل التطبيق — ليست صورة فوتوغرافية لهذا المكان».

Scene kinds: `haram · mountain · alley · market · food · cafe · workshop · library ·
museum · hall · volunteer · garden · kids · sport · stay · skyline`.

## 2. Real photography (only for real, named, public subjects)

| Key | Subject | Source |
|---|---|---|
| `haram` | المسجد الحرام | Wikimedia Commons — `المسجد_الحرام٣.jpg` |
| `clock` | برج الساعة وأبراج البيت | Wikimedia Commons — `Makkah_clock_tower_with_Abraj_Al_Bait_Towers.jpg` |

These are loaded remotely and attributed in the app (the credit line appears under the
hero, and the source is visible in the object's source sheet). If a remote image fails to
load, the drawn scene underneath remains — the layout never breaks.

The Group 1/2/3 handover prototypes referenced additional remote images from Hihala, SPA,
Discover Makkah, Al Riyadh, Arab News, Al Yaum and hotel/editorial CDNs. They are **not**
hotlinked here: the session that built this could not reach those hosts to verify them,
and hotlinking third-party editorial media is not appropriate for a deployable build.

## Production requirement

Before any public release, replace this entire media layer with imagery your organization
**owns or has explicitly licensed**, hosted on your own CDN, covering: Makkah places,
neighborhoods, food and restaurants, heritage, markets, experiences, workshops,
volunteering, families, students, evening life, cafés, local businesses and crafts.

Do not attach a generic image to a specific named restaurant, event or provider.
