---
name: Kickstart Precision Growth
description: Employer-first intern hiring and development platform with a clean, structured, future-facing identity.
colors:
  background: "#ffffff"
  surface: "#ffffff"
  ink: "#1f2421"
  blueprint: "#6c91c2"
---

# Kickstart Precision Growth

## North Star

Kickstart is a professional platform where applicants prove their potential and employers develop promising interns into future hires. The interface should help applicants present meaningful evidence and help hiring managers compare that evidence, make a decision, and follow growth after acceptance.

The visual foundation is clean and highly structured, inspired by Behamics. White and deep green-black `#1f2421` establish precision. Blueprint blue `#6c91c2` appears when applicants commit to a role and when employers make a decision.

## Identity

The brand mark is a custom touching `KS.` wordmark. It should feel precise, compact, and credible at navigation and favicon sizes. The dot carries the blueprint-blue accent.

## Visual System

- White surfaces and `#1f2421` typography dominate.
- Blueprint blue owns commitment, decisions, progress, links, and identity markers.
- Full `#6c91c2` is reserved for decisive moments; selected rows, supporting summaries, and routine context use blue-tinted surfaces.
- Primary actions use `#1f2421` so blueprint blue remains meaningful instead of becoming a default button color.
- Focused and profile application workspaces use a blueprint grid behind white working surfaces.
- Employer applicant review stays white and evidence-first; only the decision control becomes blueprint blue.
- Status meaning always includes labels or symbols, never color alone.
- Restrained green, amber, and red accents may clarify success, attention, and destructive states. They remain limited to status and action feedback rather than decorative surfaces.
- Fine dividers, alignment, and whitespace establish hierarchy.
- Shadows are minimal and functional.
- Corners are compact and consistent.
- Status badges use readable text plus semantic color.

## Boldness Strategy

Precision Growth should feel confident rather than quiet.

- The public hero is a full-width blueprint-blue brand moment that gives applicant opportunity and employer value equal prominence.
- Blueprint blue owns primary momentum and the strongest active states.
- Major page headers use confident type, a fine baseline, and enough vertical space to orient the user without competing with the workflow.
- Application and decision focal surfaces use strong black frames and committed blueprint-blue states.
- Dense workflows amplify the current task, selected record, and primary action while keeping supporting information restrained.
- Empty states, active placements, and monitoring summaries use stronger scale jumps so the next action remains obvious.
- Routine controls and supporting records remain restrained so the important moments retain impact.
- Motion is limited to purposeful state feedback, such as an opportunity row shifting slightly when actively explored.

## Layout

- Every screen has one obvious primary purpose.
- Marketing surfaces use generous whitespace and disciplined asymmetric grids.
- Authenticated workflows use predictable grids, rows, and familiar controls.
- Opportunity and applicant records are comparable list entries, not decorative mixed card layouts.
- Deep green-black sections are reserved for lifecycle stories, orientation, and important summaries.
- Use cards only for distinct actionable records.

### Spacing And Rhythm

- Use the shared 4px-based spacing scale from `--space-2xs` through `--space-3xl`.
- Keep related content tight at 8px to 16px.
- Separate major workflow sections by 32px to 48px.
- Separate major marketing sections with fluid 48px to 96px spacing.
- Page headers use one consistent two-column structure: purpose and description on the left, actions or filters on the right.
- Dense boards, tables, task records, and form controls use tighter product spacing than marketing surfaces.

### Page Structures

- Employer and applicant workflow pages use a maximum content width of 76rem.
- Each workflow page gives one primary task the full readable width.
- Context sidebars are reserved for information required to complete the primary task, such as employer identity on an opportunity detail or decision controls during applicant review.
- Forms use one wide readable column with clearly separated steps. They do not repeat opportunity or profile details already shown in the flow.
- Mobile layouts recompose structurally into one column. Task boards retain horizontal scrolling because column order carries meaning.

## Typography

Use one clean sans-serif family with clear weight contrast. Headings are concise and confident. Product labels remain familiar and quiet. Body copy stays under 75 characters per line and avoids HR jargon.

### Homepage Typography

The homepage has a distinct marketing display voice while authenticated product UI remains in the standard product sans.

- Employer-facing display statements use a confident condensed grotesque stack led by Nimbus Sans Narrow.
- Evidence labels, process numbers, and compact marketing context use the product sans at smaller, firmer weights.
- Interface previews retain the standard product sans so they read as real product surfaces.

### Homepage Layout

- The homepage uses one blueprint narrative from potential to proven talent.
- The hero pairs one compact message block with one candidate record; neither should float in unused space.
- Lifecycle stages keep copy and interface previews aligned on desktop, then recompose into a readable single column before tablet widths become cramped.
- Related interface content stays tight, while the hero, lifecycle, and final output use generous separation.
- Hero messaging is composed in intentional line-level beats rather than relying on browser wrapping.
- Display headings use tight but readable line-height and never exceed the 6rem ceiling.
- Blueprint blue may emphasize one meaningful display line, not individual decorative words.
- Light text on `#1f2421` uses slightly increased line-height, tracking, and weight.
- Homepage leads stay between 48ch and 50ch.
- Evidence previews keep the product sans, stronger title weight, and tabular numerals.

## Components

- Primary button: `#1f2421` fill, white label, blueprint-blue hover.
- Bold primary button: blueprint-blue fill with `#1f2421` text; `#1f2421` on hover.
- Secondary button: white fill, fine neutral border.
- Inputs: white surface, compact radius, visible focus ring.
- Navigation: neutral white sticky masthead with a compact `KS.` signature, precise dividers, a restrained blue active state, and one black employer action. It should frame the product professionally rather than behave like a marketing banner.
- Progress: slim blueprint-blue track.
- Lifecycle: restrained `#1f2421` section with a connected horizontal sequence.
- Records: aligned rows with metadata, evidence, status, and a clear action.

## Guardrails

- No noticeboard, poster, art-publication, collage, or discography styling.
- No generic SaaS metric hero, glass panels, purple gradients, or identical feature-card grids.
- No decorative offset shadows, rotations, textures, or stamp labels.
- No indiscriminate boldness. `#1f2421`, `#6c91c2`, and oversized type must identify a real focal point.
- No color-only status meaning.
- Applicants can always browse every open opportunity.
- Employer value and future talent development lead the product narrative.

## Route Application

- `/`: Balanced applicant-and-employer marketing surface with a clear shared value proposition, applicant evidence preview, connected lifecycle, development proof, and actions for both audiences.
- `/employer/opportunities`: Employer starting workspace for creating roles, managing lifecycle state, and understanding applicant interest.
- `/employer/applicants`: Evidence-first applicant review with deliberate decisions and clear notes.
- `/employer/employees`: Action-first development queue for submitted work, overdue activity, and mentor attention.
- `/applicant/opportunities`: Search-led opportunity list with optional secondary filters and no skip restrictions.
- `/applicant/applications`: Clear status, submitted evidence, and next actions.
- `/employee/tasks`: Familiar task workflow focused on delivery and review.
- `/employee/progress`: Development record connecting work, feedback, and future value.
- `/login` and `/register`: Structured role entry with employers visually prioritized.

## Distillation Decisions

- Opportunity discovery leads with search, filters, and the opportunity list. Summary metrics do not interrupt browsing.
- Application and apply routes avoid repeating opportunity, profile, status, or next-action context in sidebars.
- Employer development monitoring keeps the intern queue, selected record, and review controls in the main flow. Historical summaries use progressive disclosure.
- Intern task and development routes avoid duplicate status summaries. The task board and development record remain the source of truth.
- Secondary information is removed when it does not change the next decision.

## Decision History

An early blueprint treatment was rejected because blue spread across the entire product and weakened hierarchy.

A creative opportunity-noticeboard direction was then explored. Its energy and plain-language copy were useful, but poster layouts, offset shadows, stamps, rotations, and mixed card compositions made the company feel like an art publication.

The confirmed system is Precision Growth: clean Behamics-inspired structure, a dominant `#ffffff`, `#1f2421`, and `#6c91c2` palette, restrained semantic status accents, blueprint workspaces for serious applications and hiring decisions, stronger hierarchy, and a shared applicant-to-future-hire narrative.

`src/app/globals.css` is the authoritative styling layer for the shared platform and product workflows.
