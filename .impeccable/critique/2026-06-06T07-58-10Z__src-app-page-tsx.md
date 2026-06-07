---
target: src/app/page.tsx
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-06T07-58-10Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Role-aware navigation and lifecycle language orient users, but the homepage does not explain what “Start demo” will do. |
| 2 | Match System / Real World | 3 | The application-to-placement model is concrete and understandable. |
| 3 | User Control and Freedom | 2 | Applicant, employer, and evaluator entry paths are present but not clearly framed as distinct choices. |
| 4 | Consistency and Standards | 3 | Buttons, badges, cards, and status vocabulary are consistent. |
| 5 | Error Prevention | 2 | Little risk exists on this page, but destination and account-role consequences are unclear before entry. |
| 6 | Recognition Rather Than Recall | 3 | The product lifecycle is repeated visibly, though repetition becomes excessive. |
| 7 | Flexibility and Efficiency | 2 | Several routes exist, but the most efficient route for each audience is not obvious. |
| 8 | Aesthetic and Minimalist Design | 2 | Strong visual system, weakened by repeated card grids and too many equal-weight modules. |
| 9 | Error Recovery | 2 | Navigation permits recovery, but the homepage offers no preview of demo state or role switching. |
| 10 | Help and Documentation | 3 | The page explains the concept well, but not how to enter the prototype confidently. |
| **Total** | | **25/40** | **Usable, coherent, needs stronger prioritization** |

## Anti-Patterns Verdict

**LLM assessment:** The page is coherent and clearly follows a real design system, but it still has recognizable generated-landing-page grammar: an eyebrow-led hero, three identical explainer cards, a stack of card-based product mockups, another four-card process grid, and a final promise card. The repeated card vocabulary makes the page feel assembled rather than directed. The phrase “Not just hiring. Growth after hiring.” is also a banned AI-copy construction.

**Deterministic scan:** The bundled detector returned zero findings for `src/app/page.tsx`. It did not catch the repeated card grammar, repeated eyebrow cadence, or copy issue, so these remain design-review findings rather than deterministic violations.

**Visual overlays:** No browser automation surface was available in this session, so no reliable user-visible overlay exists. Source inspection and responsive CSS were used as fallback evidence.

## Overall Impression

Kickstart has a credible visual foundation: the blueprint environment, restrained blue palette, and structured proof language support the “clear, serious, growing” brief. The homepage’s biggest opportunity is editorial prioritization. It currently explains every stage with equal visual weight instead of helping each visitor choose the right first action.

## What's Working

- The blueprint background and white operational surfaces form a recognizable product identity without compromising readability.
- The lifecycle from discovery through post-hire growth is concrete, differentiated, and easy to understand.
- Component vocabulary is consistent across buttons, badges, cards, task columns, and responsive breakpoints.

## Priority Issues

### [P1] The primary entry decision is ambiguous

**Why it matters:** Applicants, employers, and demo evaluators have different goals, but “Start demo” does not reveal which role, state, or workflow it opens. Visitors must infer which of several links is right.

**Fix:** Turn the hero into an explicit audience decision. Use one dominant route based on the primary business audience and two clearly labeled secondary routes such as “Browse opportunities,” “Review applicants,” and “Open guided demo.” State what demo data or account role each route opens.

**Suggested command:** `$impeccable clarify`

### [P1] Repeated cards flatten the narrative

**Why it matters:** Three hero cards, four mock cards, four process cards, and a final card all compete with nearly equal depth and spacing. The eye has no decisive focal point, and the distinctive blueprint concept becomes background decoration.

**Fix:** Keep one strong product proof composition in the hero, replace the three explainer cards with a compact lifecycle strip, and turn the lower process into a more directional timeline or two-sided applicant/employer flow.

**Suggested command:** `$impeccable layout`

### [P2] The page repeats the same lifecycle rather than adding evidence

**Why it matters:** “Discover, apply, review, grow” appears in the hero cards, mock stack, process section, and final promise. Repetition adds scroll length without increasing trust.

**Fix:** Give each section a different job: hero for positioning and entry, middle for a real structured-application example, lower section for post-hire proof and employer accountability.

**Suggested command:** `$impeccable distill`

### [P2] Generic scaffold copy weakens an otherwise serious product

**Why it matters:** Repeated eyebrow labels and “Not just hiring. Growth after hiring.” make the page feel templated. Noun-only CTA labels such as “Applicant flow” and “Employer flow” do not say what happens.

**Fix:** Remove most eyebrow labels, rewrite the promise as a specific capability, and use verb-object CTA labels.

**Suggested command:** `$impeccable clarify`

## Persona Red Flags

**Jordan, first-time applicant:** Jordan sees a message partly addressed to employers (“Find young talent”) and partly addressed to applicants. “Start demo” gives no clue whether it creates an account, opens a guided state, or asks them to choose a role. They may choose “Explore opportunities,” but the page has not made that the obvious applicant route.

**Mira, hiring manager:** Mira understands structured review and post-hire tracking, but the homepage gives no concrete employer proof such as review time saved, decision controls, or what monitoring looks like. She must scan multiple mock cards before finding an employer route at the bottom.

**Leon, demo evaluator:** Leon can understand the full lifecycle, but the repeated sections make the intended 11-step prototype route feel longer and less guided than necessary. The main CTA does not set expectations for the demo sequence or initial role.

## Minor Observations

- The responsive CSS collapses the hero and card grids cleanly at `920px`; no obvious heading overflow risk was found.
- The hero mock stack is source-order friendly, but on mobile it creates a long block before the next meaningful section.
- The design documentation specifies rounded pill buttons, while the implementation uses the compact shared radius. The implementation is more serious, but the mismatch should be resolved in the design system.
- The page contains no motion, so reduced-motion handling is not currently required here.

## Questions to Consider

- Which audience must understand the value within five seconds: employers, applicants, or demo evaluators?
- What is the single strongest piece of product evidence that proves Kickstart is more than a job board?
- Could the entire homepage make its case with one product proof composition and one audience-choice section?
