> **STATUS — UPCOMING VISION / TRANSFORMATION**  
> This is **not** the current live EyeMakkah product. It is part of the proposed transformation that follows the meeting direction captured in `../00_MEETING_NOTES_VERBATIM.md`.  
> The two canonical current files are in `01_CURRENT_VERSION__CANONICAL/`.

# New Group 5 — Personalization, Retention & Full Consumer Experience

## Objective

Complete EyeMakkah as a mature consumer product that learns from meaningful behavior, brings people back for useful reasons, supports providers/hosts, and covers the non-happy-path product states required for a believable application.

## Cumulative rule

This is the final product layer. It must preserve and integrate everything from:

- old cumulative baseline
- New Group 1 rich inventory/discovery
- New Group 2 community
- New Group 3 participation/plan
- New Group 4 freshness/trust/safety

## AI principle

AI is horizontal and largely invisible.

**You don't go to the AI in EyeMakkah. The AI works quietly across EyeMakkah for you.**

Avoid a separate AI destination unless a specific product function genuinely requires it.

## Personalization signals

Learn from meaningful actions such as:

viewed → saved → dismissed → joined → booked → completed → helpful → contributed

Do not overweight passive views. Stronger explicit/behavioral signals should matter more.

A single dismissal is not a permanent dislike.

## Context differences

Recommendations should adapt based on explicit/current context such as:

- resident vs visitor
- first-time vs repeat visitor
- family context
- student context
- solo activity preference
- time available
- current Journey
- completed experiences
- saved/active plans
- area selected by the user

Avoid sensitive inference. Do not infer health, religion, identity or other sensitive traits from behavior.

## Novelty and progression

A repeat visitor or resident should not be trapped in the same obvious tourist loop.

If a user has completed major obvious sites, the system should increasingly surface:

- less-obvious experiences
- neighborhood discovery
- local food
- recurring activities
- clubs/communities
- seasonal/temporary opportunities
- things similar in intent but new in content

## Retention philosophy

Bring users back for **utility**, not generic engagement pressure.

Good notification examples:

- نشاط حفظته يبدأ التسجيل له
- شخص رد على سؤالك
- نشاط مجموعتك هذا الأسبوع
- العرض الذي حفظته ينتهي الليلة
- فعالية تناسب اهتمامك أضيفت هذا المساء

Avoid generic “We miss you!” notifications.

## Provider / host tools

Add the minimum credible provider/host capability needed to support a living ecosystem:

- create/publish content
- update practical information
- create activities/events/offers
- manage source ownership/provenance
- view participant/registration state where applicable
- respond to community questions where appropriate
- pause/archive recurring activities

Do not turn the consumer app into a B2B dashboard. Provider tools can be a separate role/surface.

## Contribution prompts

After meaningful moments, ask for high-value contributions rather than generic reviews:

- photo
- practical tip
- correction
- answer to an open question
- short experience note

## Analytics and instrumentation

The backend should capture interaction events sufficient for:

- funnel analysis
- discovery quality
- save/join/book/complete conversion
- community helpfulness
- freshness/trust interventions
- retention
- recommendation quality
- journey completion

Use append-only action/event semantics where possible.

## Full-state coverage

Add believable:

- loading states
- empty states
- no-result search states
- error states
- permission states
- offline/degraded states where relevant
- external handoff failures
- stale/conflict warnings
- moderation/report confirmations
- translation states
- accessibility states

## Multilingual behavior

Translation is a convenience layer. Preserve original community voice and allow translated viewing rather than rewriting identity/tone.

## Accessibility

Support explicit accessibility preferences and constraints in ranking and practical facts. Do not infer health information.

## Motion and polish

At this stage, refine transitions, sheets, save/plan feedback, active journey changes and state progression. Motion should clarify state, not become decoration.

## Final journey coverage

Expand the total product validation to roughly **40–50 complete Makkah journeys** covering residents, visitors, families, students, solo users, repeat visitors, tonight, food, culture, community, volunteering, booking, trust conflict, accessibility, returning users and provider/host interactions.

## Final integration QA

Test at minimum:

- resident
- visitor
- first-time visitor
- repeat visitor
- family
- student
- solo user
- returning user
- tonight intent
- food intent
- community question
- volunteering
- saved offer
- active plan
- completed activity
- stale/conflicting fact
- external booking handoff

Repair:

- dead ends
- repeated content
- thin pages
- unclear navigation
- broken state transitions
- false confirmation
- stale discovery
- disconnected community/activity/plan flows

## Acceptance criteria

At the end of Group 5:

- the product feels personalized without creepy inference
- notifications are selective and useful
- provider/host publishing is credible
- analytics/instrumentation supports BI and future intelligence
- empty/error/loading/accessibility/multilingual states exist
- 40–50 journeys validate the cumulative product
- final UX feels like one coherent app, not five bolted-on prototypes
- the final deliverable can be packaged as one cumulative ZIP
