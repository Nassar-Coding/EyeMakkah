> **STATUS — UPCOMING VISION / TRANSFORMATION**  
> This is **not** the current live EyeMakkah product. It is part of the proposed transformation that follows the meeting direction captured in `../00_MEETING_NOTES_VERBATIM.md`.  
> The two canonical current files are in `01_CURRENT_VERSION__CANONICAL/`.

# New Group 1 — Living Makkah / Content & Discovery Foundation

## Objective

Make EyeMakkah feel like a rich, living consumer product rather than a prototype with a handful of repeated objects.

This group builds the content/data foundation first, then rebuilds the high-traffic consumer surfaces on top of it.

## Non-negotiable cumulative rule

Start from the full old cumulative baseline:

**Old G1 architecture + Old G2 journeys + Old G3 visual fidelity.**

Do not remove existing states or the 15 journey scenarios.

## Required content inventory

Seed roughly **150–200 realistic content objects** across:

- Places
- Restaurants
- Experiences
- Events
- Activities
- Recurring Activities
- Offers
- Services
- Providers / Hosts
- Neighborhoods
- Categories

The inventory should also include relationships and metadata for:

- category
- neighborhood / area
- provider or host
- timing / recurrence
- source provenance
- freshness class
- eligibility / suitability
- practical facts
- image references
- trust state
- relationship to communities
- relationship to Plan/Journey

Use real named entities where they can be represented truthfully. Use clearly prototype/synthetic content where current live facts cannot be substantiated. Do not invent current opening hours, availability, discounts, event dates, participant counts or real-time claims as factual.

## Photography requirement

This group must use **a lot of photography**.

Photography is part of the product foundation, not visual filler.

Use varied, contextually relevant photography for:

- Makkah places
- neighborhoods
- food/restaurants
- heritage/culture
- markets
- experiences
- workshops
- volunteering
- families
- students
- evening activities
- cafés
- local businesses
- crafts
- street-level Makkah context

Avoid recycling the same five generic images across the whole app.

For prototype remote photography, maintain a source file and a clear production note that assets must be replaced by owned/licensed CDN media.

## Screens to deepen

### Home

Home should become dense and alive. Possible modules include:

- الليلة في مكة
- يبدأ قريبًا
- قريب منك
- جديد في مكة
- أهل مكة يقترحون
- تجارب تستحق
- مطاعم وأكل
- هذا الأسبوع
- فعاليات وأنشطة
- عروض حالية
- من المجتمع

Do not mechanically show every module. The compositor should select modules based on context.

### Discover

Discover must support continuous browsing across the larger inventory.

Support:

- editorial browse
- category browse
- neighborhood browse
- activity/intent browse
- temporal browse (tonight, weekend, soon)
- food/restaurant browse
- community-linked discovery
- diversity/novelty handling so results do not feel repetitive

### Search

Search should work across object types and expose the correct object identity.

Examples:

- place
- restaurant
- event
- activity
- community
- service
- provider

### Map

Map is a contextual discovery view, not a replacement for the product hierarchy.

Map entries should open the same Decision Page object and preserve trust, Plan and community context.

### Decision Pages

Decision Pages need to feel complete and object-aware.

Order:

1. identity / desirability
2. why it fits this user/context
3. practical facts
4. community lived context
5. source/trust provenance
6. one primary action
7. next step / Plan / Journey continuity

Do not make star ratings the dominant decision mechanism.

## Ranking direction

Use the established sequence:

hard constraints → intent → Journey → eligibility/current → trust/freshness → suitability → distance/time → personalization → community → quality/popularity → novelty/diversity

## Data architecture expectations

Do not hardcode all content directly into screen markup. Create a reusable inventory/data layer suitable for filtering, ranking and reuse across Home, Discover, Search, Map and Decision Pages.

Recommended entities include:

- `Place`
- `Restaurant`
- `Experience`
- `Event`
- `Activity`
- `RecurringActivity`
- `Offer`
- `Service`
- `ProviderHost`
- `Neighborhood`
- `Category`
- `SourceClaim`
- `TrustContext`

## Acceptance criteria

At the end of Group 1:

- user can browse for several minutes without immediately seeing the same 10–15 items
- Home visibly changes by context rather than showing a static card grid
- Search returns mixed object types correctly
- Map and Decision Pages use the same underlying inventory
- photography is abundant and varied
- no existing old-group states have disappeared
- all 15 old journey scenarios still work
- no false live/current claims are introduced

## Do not add yet

Do not implement the full new social participation loop, advanced freshness lifecycle, full retention system or final personalization layer in this group. Create the data hooks they will need, but keep implementation sequencing clean.
