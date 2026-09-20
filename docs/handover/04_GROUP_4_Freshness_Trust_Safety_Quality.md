> **STATUS — UPCOMING VISION / TRANSFORMATION**  
> This is **not** the current live EyeMakkah product. It is part of the proposed transformation that follows the meeting direction captured in `../00_MEETING_NOTES_VERBATIM.md`.  
> The two canonical current files are in `01_CURRENT_VERSION__CANONICAL/`.

# New Group 4 — Freshness, Trust, Safety & Quality

## Objective

Make the product dependable over time. Content should age correctly, stale information should stop dominating discovery, conflicting information should be explicit, and community participation should be safe enough for a mainstream consumer product.

## Cumulative rule

This group sits on top of all previous work. It should strengthen existing objects and states rather than creating a separate trust/safety product area.

## Lifecycle models

### Event

Upcoming → Starting Soon → Live → Ended → Archived

### Offer

Active → Ending Soon → Expired

### Recurring Activity

Active → Paused → Dormant → Archived

### Information / claim

Current → Possibly Stale → Conflicting → Unverified

These states should influence discovery ranking and visibility.

## Freshness classes

Use the established model:

- F0 — deterministic validity
- F1 — live operational
- F2 — short-lived
- F3 — routine business
- F4 — stable descriptive

Different fields can have different freshness requirements.

## Trust labels

Use precise provenance labels such as:

- معلومة رسمية
- من مقدم الخدمة
- من المجتمع
- معلومة حديثة
- أكدتها مساهمات حديثة
- توجد معلومات متعارضة
- قد تكون المعلومة قديمة
- لم نتمكن من التحقق

Avoid a generic “Verified” badge that hides the actual source.

## Conflict handling

When official/provider/community sources disagree:

- do not silently pick one
- preserve both source claims
- show which fields conflict
- show dates/source classes
- reduce decision confidence when needed
- recommend verification where appropriate

LLMs may summarize the conflict but should not decide truth without evidence rules.

## Expiry behavior

Expired or stale content must stop contaminating discovery.

Examples:

- expired offer leaves active offer modules
- ended event leaves upcoming feed and becomes archived history
- dormant recurring activity stops being promoted
- inactive community stops being surfaced as a thriving group
- old practical facts may show stale warning until refreshed

## Community corrections

Recent community contributions may flag changed conditions or practical issues. They can trigger review/refresh but should not automatically overwrite higher-authority facts.

## Provider updates

Provider changes should retain source history. Do not silently rewrite authoritative fields without provenance.

## Safety and privacy

Add product-level support for:

- reporting
- moderation states
- community rules
- host controls
- RSVP privacy
- blocking
- contribution integrity
- spam/fraud signals
- source history
- privacy controls

## Explicit prohibitions

Do not build or claim:

- public attendee identity by default
- exact-location broadcasting
- background-check guarantees
- vague global verification
- unreviewed provider facts replacing authoritative sources

## Trust on Decision Pages

Trust should be visible but not visually dominate desirable content.

A good Decision Page should say:

- why this is relevant
- practical facts
- what community says
- where the key facts came from
- whether anything is stale/conflicting

## Acceptance criteria

At the end of Group 4:

- expired content is automatically demoted/removed from active discovery
- lifecycle state is represented for events/offers/recurring activities
- trust/source detail exists at field or claim level
- conflicts are explicit rather than hidden
- moderation/report/block/privacy flows exist
- dormant communities/activities stop being promoted
- provider/community updates preserve provenance
- the product remains visually consumer-first rather than turning into a compliance dashboard
