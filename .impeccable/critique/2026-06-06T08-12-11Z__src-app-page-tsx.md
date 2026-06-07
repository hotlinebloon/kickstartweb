---
target: src/app/page.tsx
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-06T08-12-11Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The page clearly labels audiences and preview states, but role-specific routes can open while navigation still reports Public access. |
| 2 | Match System / Real World | 4 | Structured evidence, decision records, placements, and task progress closely match the product model. |
| 3 | User Control and Freedom | 3 | Visitors can choose a relevant route quickly, but direct role routes do not establish or explain session state. |
| 4 | Consistency and Standards | 3 | The page follows the design system, with minor drift in preview semantics and elevation. |
| 5 | Error Prevention | 2 | Employer and applicant entry links can create a role-context mismatch immediately after navigation. |
| 6 | Recognition Rather Than Recall | 4 | Audience choices and the lifecycle are explicit and easy to scan. |
| 7 | Flexibility and Efficiency | 3 | Three direct entry routes are efficient, but the guided demo and direct routes behave differently. |
| 8 | Aesthetic and Minimalist Design | 3 | The narrative is focused and distinctive, with one remaining ghost-card elevation pattern. |
| 9 | Error Recovery | 2 | Users can navigate away, but there is no obvious role correction when a workspace opens under Public access. |
| 10 | Help and Documentation | 3 | The page explains the product and demo route well, but direct-route session behavior remains unexplained. |
| **Total** | | **30/40** | **Strong direction, needs flow and accessibility hardening** |

## Anti-Patterns Verdict

**LLM assessment:** The redesign no longer reads like a generic generated landing page. The repeated card grids, repeated lifecycle explanation, generic noun-only CTAs, and banned “Not just…” copy are gone. The blueprint environment and evidence-led product previews now form a coherent identity. One Codex-specific defect remains: `.home-proof` combines a `1px` border with `--shadow-strong`, whose blur is `20px`, matching the banned ghost-card pattern.

**Deterministic scan:** The bundled detector returned zero findings for `src/app/page.tsx`. It did not catch the ghost-card elevation, role/session mismatch, contrast failure, or semantic progress issue.

**Visual overlays:** Browser automation tooling was unavailable in this session, so no reliable user-visible overlay exists. Source inspection, computed contrast, responsive CSS review, lint, and production build were used as fallback evidence.

## Overall Impression

The homepage now has a clear point of view and a much stronger information hierarchy. It communicates Kickstart as an evidence-to-progress system rather than a generic job board. The biggest remaining opportunity is making the polished entry choices behave as clearly as they read.

## What's Working

- The hero now makes the employer, applicant, and evaluator routes explicit, eliminating the previous ambiguous “Start demo” decision.
- The application review preview is specific enough to demonstrate the product’s structured-proof differentiator.
- The lifecycle rail and growth ledger give separate sections distinct jobs, reducing repetition and cognitive load.

## Priority Issues

### [P1] Role-specific entry routes do not establish matching session state

**Why it matters:** “Review applicants” opens `/employer/applicants` and “Browse opportunities” opens `/applicant/opportunities`, but the global navigation can still show “Public access” and “Not logged in.” This immediately undermines orientation and makes the product model feel inconsistent.

**Fix:** Route both choices through an explicit role-selection action that logs into the selected demo role before redirecting, or make these links clearly labeled read-only previews with navigation that reflects preview mode.

**Suggested command:** `$impeccable harden`

### [P1] Primary employer-entry description misses WCAG AA contrast

**Why it matters:** The descriptive text uses `rgba(255, 255, 255, 0.82)` over `#2563eb`, producing approximately `4.01:1`. This is below the required `4.5:1` for body-sized text.

**Fix:** Use fully opaque white, increase the text weight and size enough to qualify as large text, or darken the blue background while preserving the primary hierarchy.

**Suggested command:** `$impeccable audit`

### [P2] Static previews look like live workspace modules

**Why it matters:** The application proof and growth ledger use the same statuses, controls, and visual vocabulary as functional screens. Without a visible “Preview” label, visitors may expect the modules themselves to be interactive.

**Fix:** Label each composition as a product preview, or make the whole preview link to the relevant live demo route with a clear action label.

**Suggested command:** `$impeccable clarify`

### [P2] Preview accessibility semantics are incomplete

**Why it matters:** The `aria-label` on the plain `.home-proof` div does not create a meaningful landmark. The progress bar uses an `aria-label` without `role="progressbar"` or value attributes, so assistive technology does not receive proper progress semantics.

**Fix:** Use a semantic `figure` with `figcaption` for the preview and add `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` to progress indicators.

**Suggested command:** `$impeccable audit`

### [P3] Main proof panel uses ghost-card elevation

**Why it matters:** The `1px` border plus `20px` blur shadow makes the main preview feel softer and more generic than the border-first product system.

**Fix:** Keep the border and remove the strong shadow, or use the lighter `--shadow` token without the border.

**Suggested command:** `$impeccable quieter`

## Persona Red Flags

**Mira, hiring manager:** Mira selects “Review applicants” and lands in the employer review workspace, but the global role chip can still say “Public access” and “Not logged in.” She cannot tell whether she is reviewing real demo data, a read-only preview, or an authenticated employer state.

**Jordan, first-time applicant:** Jordan can now identify “Browse opportunities” immediately, but entering the applicant workspace without an applicant session creates the same context mismatch. The homepage’s clarity drops at the first navigation step.

**Sam, keyboard and screen-reader user:** Sam can focus the three entry links, but receives no meaningful grouped-preview landmark from the labeled div, and the 75% progress indicator lacks progressbar semantics. The blue employer-entry description also falls below AA body-text contrast.

## Minor Observations

- The responsive structure is substantially improved: the hero, evidence grid, lifecycle, and growth section all reflow deliberately.
- The ordered lifecycle earns its numbering because sequence carries real product meaning.
- The two small `home-kicker` labels are restrained enough to avoid repeated-eyebrow scaffolding.
- Lint and production build pass.

## Questions to Consider

- Should the employer and applicant entry choices create demo sessions immediately, or should they be clearly presented as read-only previews?
- Should the proof and growth compositions remain static illustrations, or become large links into the matching workflows?
- Is the employer-first hierarchy intentional enough to justify making the employer route visually dominant?
