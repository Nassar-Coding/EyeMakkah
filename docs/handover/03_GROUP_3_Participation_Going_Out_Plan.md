> **STATUS — UPCOMING VISION / TRANSFORMATION**  
> This is **not** the current live EyeMakkah product. It is part of the proposed transformation that follows the meeting direction captured in `../00_MEETING_NOTES_VERBATIM.md`.  
> The two canonical current files are in `01_CURRENT_VERSION__CANONICAL/`.

# New Group 3 — Participation, Going Out & Plan

## Objective

Turn discovery and community into real participation. EyeMakkah should help someone move from “this looks interesting” to actually going, joining, completing and continuing.

## Cumulative rule

This group sits on top of:

**Old baseline + New Group 1 rich discovery + New Group 2 community.**

Do not simplify prior states.

## Core action loop

**Interested → Save → Join/Going → Register/Book → Add to Plan → Active → Complete → Contribute → What next**

Different object types may use different subsets, but state semantics remain distinct.

## Critical state distinctions

**Save ≠ Join ≠ Booking ≠ Confirmed ≠ Attended.**

Do not infer attendance from booking.
Do not infer booking from an outbound click.
Do not infer confirmed attendance from a user saving something.

## Plan information architecture

Plan should support these meaningful buckets/states:

- الآن
- اليوم
- قادم
- مهتم به
- محفوظ لوقت لاحق
- مؤكد
- مكتمل
- ماذا بعد؟

Plan should feel like a timeline and continuity surface, not a generic saved-items list.

## Social activation

Make it easy to understand the social friction of an activity.

Example treatment:

> ورشة خط للمبتدئين  
> الجمعة 6:00  
> مجموعة صغيرة  
> 7 مشاركين  
> مناسب للحضور منفردًا  
> لا تحتاج خبرة

Participant counts or availability must be clearly prototype/actual source data rather than fabricated live facts.

## Going-out prompts

Home should support low-friction prompts such as:

- عندك ساعتين؟
- وش تسوي الليلة؟

EyeMakkah can assemble combinations like:

- قهوة → ورشة → عشاء
- معرض → مشي قصير → مطعم قريب

These are contextual journey constructions, not static itinerary templates.

## Joining / registration / booking

Action semantics depend on the object:

- free activity → Join / Going
- registration event → Register
- bookable experience → Book
- external provider → outbound handoff
- place → Go / Directions

After external handoff, use the established booking semantics:

`انتقلت لإكمال الحجز`

Only move to confirmed if there is a real callback or explicit user confirmation.

## Active state

When an item is active, surface useful immediate information:

- timing
- meeting point / access context
- practical reminders
- provider contact if appropriate
- trust/source context
- community tips
- next step

Do not clutter active states with irrelevant discovery modules.

## Completion state

After completion, ask lightweight questions:

- استمتعت؟
- شارك صورة
- اكتب نصيحة
- ساعد شخصًا يسأل
- شوف نشاطًا مشابهًا الأسبوع القادم

Completion should naturally feed New Group 2 Community and New Group 5 personalization later.

## What next

A completed experience should not end in a dead screen.

Use context to offer:

- similar activity
- nearby food
- another community/club event
- something new the user has not done
- continuation of the same recurring club

## Journey continuity

Preserve state across screens and external handoffs.

Example:

Home → activity → Decision Page → Join/Register → Plan → Active → Complete → Contribution → next recommendation

## Acceptance criteria

At the end of Group 3:

- Save, Join, Booking, Confirmed, Active and Completed are visibly distinct
- Plan is a real continuity system rather than a favorites tab
- at least several journeys can run end to end from discovery to completion
- external handoff does not create false confirmation
- completed activities generate contribution/continuation prompts
- community, discovery and plan are linked rather than siloed
- old 15 journeys still work
