# Kickstart

Kickstart is an employer-first intern hiring and development platform.

It helps employers find emerging talent, review applicants through structured evidence, create placements, assign work, give feedback, and understand whether an intern is developing into a valuable future hire.

Applicants can browse every open opportunity, apply with proof, track decisions, complete placement work, and build a visible development record.

## Product Direction

The current product and design direction is **Precision Growth**:

- Employer value leads the company narrative.
- Applicants are evaluated through evidence and potential.
- Hiring and intern development are one connected lifecycle.
- The interface is professional, clean, structured, and future-facing.
- White surfaces and deep green-black `#1f2421` typography dominate.
- Blueprint blue is `#6c91c2`.
- Full blueprint blue marks commitment, decisions, and progress; tinted blue marks selected or supporting context.
- Blueprint blue owns active states, progress, links, and primary momentum.
- Application workspaces use blueprint-blue backgrounds behind white working surfaces, while employer review stays neutral until the decision point.
- Product workflows use blue semantically and sparingly.
- Bold hierarchy is concentrated in heroes, page headers, review surfaces, and development records.
- All routes share one spacing scale, consistent page headers, predictable main/sidebar proportions, and structural mobile layouts.
- The homepage uses a condensed employer-facing display voice while product workflows retain the familiar product sans.
- The custom brand mark is a touching `KS.` wordmark.

Read the project sources of truth before making product or design changes:

- [PRODUCT.md](./PRODUCT.md): positioning, audiences, principles, and product scope
- [DESIGN.md](./DESIGN.md): visual system, components, layout, and guardrails
- [readforproject.md](./readforproject.md): longer product thesis, market context, and future opportunities

## Core Demo Lifecycle

1. Employer creates and publishes an opportunity.
2. Applicant browses every active opportunity.
3. Applicant opens a role.
4. Applicant submits a focused evidence application or a profile application.
5. Employer reviews structured evidence.
6. Employer accepts, rejects, or shortlists the applicant.
7. Acceptance creates a placement and starter tasks.
8. Intern moves work through task states and submits proof.
9. Employer provides feedback and a rating.
10. Completed work updates the intern development record.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Employer-first company homepage |
| `/login` | Demo role selection |
| `/register` | Demo account creation |
| `/applicant/opportunities` | Browse and filter every opportunity |
| `/applicant/opportunities/[id]` | Review complete opportunity details |
| `/applicant/opportunities/[id]/focused-apply` | Submit a structured application |
| `/applicant/opportunities/[id]/quick-apply` | Submit a profile application |
| `/applicant/applications` | Track applications and decisions |
| `/employer/opportunities` | Create, publish, close, and monitor opportunities |
| `/employer/applicants` | Review applicant evidence and make decisions |
| `/employer/employees` | Review intern work and development |
| `/employee/tasks` | Complete and submit placement work |
| `/employee/progress` | View the intern development record |

## Technology

- Next.js 16
- React 19
- TypeScript
- Local storage demo state
- Fake local role-based authentication

No production database, authentication provider, payments, or API is connected yet.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Contribution Rules

- Preserve employer-first positioning.
- Preserve complete opportunity browsing for applicants.
- Keep hiring and development connected.
- Use evidence and growth signals instead of vague claims.
- Follow `DESIGN.md`; do not reintroduce noticeboard, poster, corporate HR, or generic SaaS styling.
- Keep existing workflows functional when changing visual presentation.
- Treat `src/app/globals.css` as the authoritative shared platform and product-workflow visual layer.
