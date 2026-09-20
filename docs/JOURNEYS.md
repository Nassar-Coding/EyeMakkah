# EyeMakkah — journey coverage

The cumulative product is validated against **48 Makkah journeys**. Each one is a real
path through the shipped app, not a showcase state. Journeys marked ✅ are also walked
automatically by `scripts/verify.mjs`; the rest are manual paths that use the same
surfaces and state machine.

Legend for entry points: **ر** الرئيسية · **ك** اكتشف · **م** المجتمع · **خ** خطتي ·
**ح** حسابي · **ب** البحث

## Residents

| # | Journey | Entry | What it exercises |
|---|---|---|---|
| R1 | مقيم في العوالي يبحث عن عشاء الليلة | ر | nearby module, open-now ranking, community context on a restaurant |
| R2 | مقيم يريد شيئًا جديدًا لم يجربه | ر | novelty ranking, completed-suppression |
| R3 | ✅ مقيم يخفي فئة لا تناسبه ثم يتراجع | ر → ح | dismissal with reason, reversibility from Profile |
| R4 | مقيم يخطط نهاية الأسبوع | ك | temporal browse, event lifecycle, register handoff |
| R5 | مقيم ينضم لمبادرة تنظيف حيّه | م → ك | community → activity → join |
| R6 | مقيم يتابع نادي المشي أسبوعيًا | م | club ≠ community ≠ activity, next occurrence |
| R7 | مقيم يرى عرضًا ويتأكد من صلاحيته | ر | offer lifecycle, provider claim, terms |
| R8 | مقيم يكتشف أن العرض انتهى | ك | expired demotion, archive |
| R9 | مقيم يسأل عن مكان هادئ للدراسة | م | question → answer → linked object |
| R10 | مقيم يصحّح معلومة ساعات عمل | ك → مساهمة | correction → review queue, provenance kept |
| R11 | مقيم جديد في مكة يبحث عن خدمات الحي | م | newcomers community, services |
| R12 | مقيم يحجز صالة رياضية | ك | book handoff, unconfirmed → confirmed |
| R13 | مقيم يتطوع في وردية سقيا | ك | authorized organiser, official source class |
| R14 | مقيم يضيف خطة مساء كاملة | ر | assembled outing → multi-item plan |
| R15 | مقيم يلغي عنصرًا من خطته | خ | plan state machine, removal |

## Visitors

| # | Journey | Entry | What it exercises |
|---|---|---|---|
| V1 | ✅ زائر يفتح صفحة قرار لحي حراء | ب | all decision layers in order |
| V2 | ✅ زائر يحجز معرض الوحي ويعود بلا تأكيد | ب | outbound handoff, «انتقلت لإكمال الحجز» |
| V3 | ✅ زائر يؤكد الحجز بنفسه | خ | explicit confirmation only |
| V4 | زائر يبدأ زيارته ثم يكملها | خ | active state, practical-only view, completion |
| V5 | ✅ زائر يواجه ساعات عمل متعارضة | ب | conflict comparison, reduced confidence |
| V6 | ✅ زائر يستلم تحديثًا من المصدر | trust sheet | resolution propagates |
| V7 | زائر يبحث عن أكل مكي أصيل | ب | multi-object search, community "what to order" |
| V8 | زائر لا يتحدث العربية يقرأ إجابة مترجمة | م | translation as a view, original preserved |
| V9 | زائر يسأل بالإنجليزية | م | original-language contribution |
| V10 | زائر متكرر يبحث عن تجربة أقل شهرة | ر | novelty seeking, completed exclusion |
| V11 | زائر يتحقق من ترخيص مرشد | ك | provider provenance, official claim |
| V12 | زائر يطلب اتجاهات ويعود | ك | map handoff keeps context |
| V13 | زائر يستخدم الخريطة لاستكشاف محيطه | ك | map as a Discover mode |
| V14 | زائر يضيف مطعمًا بعد التجربة | خ | completion → contribution |
| V15 | زائر أول زيارة يفعّل وضع أول زيارة | ح | first-time ranking, explanatory copy |
| V16 | زائر بلا اتصال | any | degraded banner, no outbound promises |

## Families, students, solo, accessibility

| # | Journey | Entry | What it exercises |
|---|---|---|---|
| F1 | عائلة تبحث عن مخرج الليلة خلال ساعتين | ر | time-available context, family suitability |
| F2 | عائلة تقرأ تجربة عائلة أخرى عن الزحام | ك | structured experience report |
| F3 | عائلة تحجز مسرح أطفال | ك | capacity as declared prototype data |
| F4 | عائلة تخطط نشاطًا ثم عشاءً | ر | assembled outing for kids context |
| S1 | ✅ طالب ينضم لورشة خط للمبتدئين | ب | join ≠ booking, participation context |
| S2 | ✅ طالب يبدأ الورشة ثم يكملها | ب | active → completed → prompts |
| S3 | طالب يسجّل في ملتقى الأندية | ك | registration handoff |
| S4 | طالب يبحث عن مجموعة مذاكرة | م | student community, capacity |
| S5 | طالب يستخدم خصم الطلاب | ك | offer eligibility terms |
| O1 | شخص يحضر بمفرده بلا حرج | ك | «مناسب للحضور منفردًا» stated by organiser |
| O2 | امرأة تبحث عن نشاط نسائي | ح → ك | women-only preference, unpublished attendee list |
| O3 | مستخدم يتحقق من خصوصية قائمة المشاركين | م | privacy answer in thread |
| A1 | زائر مع كرسي متحرك يقارن مسارين | ح → ك | step-free preference, access facts first |
| A2 | زائر يقرأ تجربة وصول حديثة | ك | community lived context outranks map distance |
| A3 | مستخدم يكبّر النص | ح | text size like a device setting |

## Trust, safety, retention, provider

| # | Journey | Entry | What it exercises |
|---|---|---|---|
| T1 | مستخدم يبلغ عن ترويج غير مفصح عنه | م | report → human review, no auto-delete |
| T2 | مستخدم يحظر حسابًا | م | blocking removes content from his feed |
| T3 | ✅ محتوى محجوب يظهر بحالته وسببه | م | moderation as a visible state |
| T4 | خطة تحمل معلومة متعارضة | خ | warning propagates into Plan |
| T5 | ✅ محتوى منتهٍ ينتقل إلى الأرشيف | ك | lifecycle demotion |
| N1 | ✅ إشعار مفيد عن خطة أو سؤال | ر | selective notifications only |
| N2 | مستخدم يوقف التخصيص | ح | generic ranking, explanations disappear |
| N3 | مستخدم يصحّح ما فهمه التطبيق عنه | ح | inferred interests are editable |
| P1 | ✅ مقدّم خدمة ينشر نشاطًا جديدًا | ح → أدوات | publish enters the shared inventory |
| P2 | مقدّم خدمة يحدّث معلومة عملية | ح → أدوات | dated provider claim, history kept |
| P3 | مقدّم خدمة يردّ على سؤال مجتمعي | ح → أدوات | provider reply inside the thread |
| P4 | مقدّم خدمة يوقف مجموعة متكررة | ح → أدوات | paused → not promoted |
| P5 | ✅ مقدّم خدمة يقرأ إشارات التفاعل | ح → أدوات | the interaction → intelligence loop |
