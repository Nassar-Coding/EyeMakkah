> **STATUS:** Upcoming transformation guidance — not a description of the current live version.

# EyeMakkah — Product Rules & State Semantics

## State integrity

Never collapse these states:

**Interested → Save → Join/Going → Register/Book → Add to Plan → Active → Complete → Contribute → What next**

Some objects will skip steps, but the underlying semantics must remain distinct.

Especially:

**Save ≠ Join ≠ Booking ≠ Confirmed ≠ Attended.**

## Booking handoff

If EyeMakkah sends a user to another service:

- log `book_outbound`
- show `انتقلت لإكمال الحجز`
- do not mark the object confirmed automatically
- only show `تم الحجز` after a valid callback or explicit user confirmation

## Journey

A Journey is a stateful orchestration around a user's goal, not merely a list of itinerary items.

## Contribution

A Contribution can be:

- post
- question
- answer
- review
- tip
- update
- photo
- experience report

## User Context

Use minimal explicit and derived context with permissions. The product must still work without precise location.

## Trust

Source claims and trust context operate at field/claim level. Provider updates should not silently override higher-authority facts. Community evidence can refresh context but must retain provenance.

## Freshness classes

- F0 deterministic validity
- F1 live operational
- F2 short-lived
- F3 routine business
- F4 stable descriptive

## Home precedence

active Journey → safety/official → time-critical → immediate/nearby → community → personalized discovery → offers → inspiration → participation

## Decision Page order

identity/desirability → why it fits → practical facts → community lived context → trust/provenance → action → what next
