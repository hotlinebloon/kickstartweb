# Kickstart Product Direction

## Register

product

## Product Definition

Kickstart is an employer-first platform for finding interns, evaluating their potential through evidence, and developing them into proven future talent.

The product covers the complete internship lifecycle:

1. Employers publish paid opportunities.
2. Applicants browse every available opportunity.
3. Applicants apply through structured questions, scenario reasoning, and proof.
4. Employers compare evidence and make a clear decision.
5. Accepted applicants become active placements.
6. Interns complete tasks and submit work.
7. Employers provide feedback, ratings, and revision requests.
8. Kickstart records progress and development over time.

Kickstart is not only a job board. The strongest value is the connected path from early potential to visible performance.

## Primary Audience

Employers are the primary audience.

Kickstart is designed for hiring managers, founders, team leads, internship coordinators, and small teams that want to hire interns but need a clearer way to evaluate and develop them.

Their primary questions are:

- Which applicants show genuine potential?
- What evidence supports that judgment?
- Who needs feedback or attention?
- Is this intern improving?
- Could this person become a valuable future hire?

## Secondary Audience

Applicants and interns are the secondary audience.

They need to:

- Browse every open opportunity without artificial feed restrictions.
- Understand the role before applying.
- Show how they think, not only what their CV claims.
- Track application status and next actions.
- Receive useful feedback.
- Build proof that supports their next opportunity.

## Positioning

Primary market-facing statement:

> Find interns with potential. Help them prove it.

Supporting statement:

> Kickstart helps employers discover emerging talent, review real evidence, and turn placements into a reliable path toward future hires.

The product should communicate professional growth and future value. It should feel credible enough for employers to use for real hiring decisions while remaining clear and encouraging for applicants.

## Company Persona

Professional. Structured. Optimistic. Credible.

Kickstart is future-facing without appearing experimental. It is clear without becoming cold. It should communicate that internships are an investment in future talent, not administrative work or temporary help.

## Product Principles

1. **Lead with employer value.** Finding, evaluating, and developing interns is the main commercial story.
2. **Show potential through evidence.** Structured answers, scenarios, proof, tasks, feedback, and revisions matter more than vague profile claims.
3. **Connect hiring to development.** Acceptance begins the most valuable part of the product rather than ending the workflow.
4. **Keep opportunities open.** Applicants can browse every available role and choose what to apply for.
5. **Make growth visible.** Employers and interns should understand progress, feedback, blockers, and next actions.
6. **Hold both sides accountable.** Interns submit proof and updates; employers provide timely feedback and clear decisions.
7. **Preserve clarity under density.** Workflows may contain meaningful detail, but the primary action and current state must remain obvious.

## Signature Product Concepts

### Evidence-Based Applicant Review

Employers compare scenario reasoning, structured answers, relevant proof, and motivation before making a decision.

### Focused Apply

Focused Apply is the serious application path. It prioritizes employer-specific questions, scenario thinking, intent, and evidence over one-click applications.

Profile Apply is the secondary path for roles where an applicant's saved profile and portfolio provide enough initial evidence. The interface must explain the tradeoff clearly without framing the applicant as making a wrong choice.

## Interface Terminology

- **Opportunity**: A role published by an employer.
- **Focused application**: An application with employer questions, a work-scenario response, and a work sample.
- **Profile application**: An application containing the applicant's saved profile and portfolio.
- **Work sample**: A link that shows relevant previous work.
- **Submitted work**: Placement work sent to an employer for review.
- **Placement**: The active working period created after an employer accepts an applicant.
- **Development record**: Completed tasks, ratings, feedback, and progress from a placement.
- **Development summary**: A generated review of recent placement activity and suggested mentor actions.

Use these terms consistently in navigation, headings, labels, actions, status messages, and documentation.

### Intern Development

Accepted applicants receive structured tasks, expectations, review states, feedback, ratings, and revision opportunities.

### Growth Record

The growth record connects application evidence, placement activity, completed work, feedback, ratings, and progress. It helps employers understand future potential and gives interns proof for later opportunities.

## Anti-Goals

Kickstart must not feel like:

- A generic SaaS startup template
- A corporate HR portal
- A decorative art publication or discography
- A swipe or skip job feed
- A school learning-management system
- A Trello clone
- An AI wrapper that replaces human judgment

## Accessibility And Inclusion

- Target WCAG AA contrast and interaction standards.
- Support keyboard navigation and reduced motion.
- Pair status colors with text, symbols, or explicit labels.
- Keep touch targets at least 44 by 44 pixels where practical.
- Support long names, descriptions, skills, feedback, and dynamic content.
- Make empty, loading, error, success, and disabled states understandable.

## Current Scope

The current prototype uses local storage and fake authentication. It demonstrates the full employer opportunity-to-applicant-to-growth lifecycle, including local opportunity creation and status management. It does not yet include a real backend, payments, production authentication, multi-company data, or production-grade opportunity editing.
