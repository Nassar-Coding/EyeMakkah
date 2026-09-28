# Offers layer and the EyeMakkah Assistant

Both live in `EyeMakkah-app.jsx`, read the same inventory and user state as every other
screen, and run entirely on the device. No LLM, backend or external API is connected, and
the assistant says so if asked.

## 1. Offers & discounts: one shared model

`DEALS` (built from `OFFER_SEED`, section "4.8 Offers & deals") is the only place offer
content is defined. Every surface reads it through the same helpers:

| Helper | Purpose |
|---|---|
| `offerFor(obj)` | The best live offer for an object (exclusive first, then value). The older offer-type objects (`o-*`) share a record through `offerObj`, so a place and its offer page always agree. |
| `offerStatus(of)` | `active` / `ending` (< 36 h left) / `upcoming` / `expired`, from validity against the prototype clock. |
| `liveOffers()` · `rankedDeals(ctx)` | Only `active` and `ending` offers, ranked for the person. Expired and upcoming offers are never promoted. |
| `offerPrice(of)` · `offerExpiry(of)` · `offerSummary(of)` | Previous/new price (only from represented prices), validity text, one-line summary. |

A record holds the following fields:
- `id` and the linked object `obj`
- `kind`: percent / fixed / package / bundle / special
- `pct` or `now`/`was`
- `badge`, `title`, `desc` and `terms`, each in AR/EN
- `incl` (package contents) and `who` (eligibility)
- `exclusive` (حصري عبر EyeMakkah) and `when` (morning / evening / weekend)
- `start`/`end` validity and `redeem` (booking / venue / code)
- `source: "prototype"`

**Content:** 64 records on 64 objects, of which 62 are live. The other two are one expired offer and one that hasn't started yet, both kept to prove the lifecycle. The live ones break down as:
- 17 restaurants and 9 cafés
- 3 stays, including stay + breakfast and a family package
- 13 experiences, 3 activities and 2 events
- 4 culture tickets
- 6 markets and 5 services

By type there are 28 percentage discounts, 14 packages, 12 bundles, 8 special prices and 2 fixed-value offers. 14 are EyeMakkah-exclusive.

**Surfaces:**

| Surface | What it shows |
|---|---|
| Hero and tile cards | `DealBadge` on the photo |
| Row cards and My Plan rows | `DealLine` |
| Decision page | `DealPanel`, which covers value, previous/new price, contents, who, validity, how to use, terms and a prototype disclaimer |
| Home | «عروض وخصومات» rail |
| Discover | «عليه عرض» chip and a «عروض وخصومات» rail |
| Assistant | Answer cards and offer detail |

Using an offer never changes plan state beyond the existing reducer actions. Booking still hands off and records «انتقلت لإكمال الحجز»; it never records «تم الحجز».

## 2. The assistant: free text over the Intent Bank

**Source of truth**

The Agent Bank lives in `assets/agent/eyemakkah_app_agent_bank_0{1..4}_*.json`, which holds:
- 150 intents with 2,123 AR/EN example utterances
- keywords, response variants and required context
- follow-up routing, confidence thresholds and contextual suggestions
- 12 alias groups

`node scripts/agent-sync.mjs` inlines all of it, unreduced, as `AGENT_BANK` between the `AGENT_BANK:start/end` markers, so the artifact stays one file. Re-run it after editing the JSON.

**Pipeline** (`AGENT`, `agentTurn`)
1. Normalise:
   - diacritics and tatweel
   - missing or variant hamza, ى/ي and ة/ه
   - Arabic digits
   - letters repeated three or more times, as in «ابيييي»
   - punctuation
2. Detect the language from the script, and answer in that language.
3. Resolve aliases and entities from bank 04:
   - neighbourhoods, party, time windows, content types, categories, suitability
   - offer terms, plan states, actions and modes
   - known places and every inventory object's AR/EN name
   - communities
   - ordinals (الأول / الثاني / الثالث)
4. Score intents: exact match, then token-F1 plus character-trigram similarity against every example, plus a keyword boost and a priority tie-break. Intents whose `required_context` is missing are down-weighted.
5. Route follow-ups. A short or referential turn («طيب أقرب», «شي أهدأ», «والثاني؟», «بالعوالي؟», «وعليه عرض؟») reuses the previous query and applies only what changed; explicit new information overrides the old context. Action verbs with a referent become actions. An unclear referent gets a clarifying question instead of a guess.
6. Run the handler. Dynamic handlers query the live inventory, `DEALS`, `rank`/`scoreObject`, `buildOutings`, plan state and contributions: the same objects and state the UI shows.
7. Answer in natural language. Placeholders in the bank's response variants are filled with real names, values and validity.
8. Update session memory (`AGENT_SESSION.mem`, following the bank 04 schema):
   - last intent, query, ranked and shown results
   - last object, offer, outing and action
   - last entities and answer shape
   - recent suggestions

**Actions (`agentAct`, and the buttons on answer cards)**

Each action dispatches the app's own reducer actions and guards what each one means:

| Action | Behaviour |
|---|---|
| Save | Toggles the saved state only |
| Add to my plan | Moves the item to `planned` only |
| Join | Only for joinable items |
| Booking | Only for book / register / redeem / contact items; opens the same `HandoffSheet`, which records `awaiting` («انتقلت لإكمال الحجز») |
| «تم الحجز» | Confirms only an item that is `awaiting`; otherwise it refuses |
| Directions and details | Open the decision page |
| Alternative, another offer, what people say | Continue the conversation |

**UI**
- It is entered from the Home assistant card: «خصّص يومي» sends «رتب لي يومي», and «اسأل» opens an empty chat. Search also offers «اسأل المساعد: …».
- There is one input («اسأل EyeMakkah...»), with 0–2 contextual suggestions from the bank. It never shows a question grid, and the Intent Bank is never displayed.
- There is no fifth tab and no floating bubble. The bottom nav hides on this screen, as it does on search and decision pages.

## Limits (honest)

- Matching is lexical and similarity-based, not generative. Unusual phrasings fall back to a clarifying answer rather than an invented one.
- Proximity is by neighbourhood centroid unless location is granted, and never "precise".
- Offers, prices, validity and availability are illustrative prototype data, and the UI says so.
