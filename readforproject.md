# Kickstart Extended Project Brief

This document records the complete product thesis, market logic, confirmed redesign direction, current prototype scope, and future roadmap.

For implementation rules, read `DESIGN.md`. For the concise product source of truth, read `PRODUCT.md`.

## Executive Summary

Kickstart is an employer-first intern hiring and development platform.

The product helps employers:

- Find promising interns
- Evaluate potential through structured evidence
- Make confident applicant decisions
- Create accountable placements
- Review submitted work
- Give useful feedback
- Understand whether an intern is improving
- Identify people who may become valuable future hires

Applicants remain an important secondary audience. They can browse every open opportunity, apply with evidence, receive feedback, and build a development record that supports later opportunities.

The primary market-facing promise is:

> Find interns with potential. Help them prove it.

## Confirmed Strategic Direction

### Primary Audience

Employers are the main customer and the main audience of the company website.

The homepage, positioning, and main product narrative must explain how Kickstart helps employers find and develop future talent. Applicant value remains visible but secondary.

### Company Persona

Kickstart must feel:

- Professional
- Structured
- Credible
- Future-facing
- Optimistic about growth
- Clear without becoming cold

Kickstart must not feel like:

- A generic B2B SaaS startup
- A corporate white-collar HR portal
- An art publication or discography
- A playful noticeboard
- A swipe-based job feed
- A school LMS
- A task-board clone
- An AI wrapper

### Confirmed Visual Direction

The final visual direction is **Precision Growth**.

It uses:

- Behamics-inspired structural discipline
- Clean white and neutral surfaces
- Fine dividers and strong alignment
- Restrained electric growth green
- Near-black graphite for important lifecycle sections
- Generous whitespace on marketing surfaces
- Denser, predictable layouts in authenticated workflows
- Minimal functional shadows
- Compact, consistent radii
- One clear purpose per screen

The bolder expression of Precision Growth adds:

- A full-width graphite employer-first hero
- A large background `KS.` signature used only at major brand moments
- Growth green as the decisive primary-action color
- Stronger page-title scale and header markers
- More commanding applicant-review and development focal surfaces
- Subtle active movement on opportunity records

Boldness must remain concentrated. Utility controls, supporting metadata, and routine records stay calm so the brand moments retain meaning.

The layout system supports that hierarchy through:

- A shared 4px-based spacing scale
- Generous marketing-section rhythm
- Tighter authenticated workflow density
- Consistent page-header zones
- Flexible main columns with 21rem context sidebars
- Sticky decision and context panels on desktop
- Structural one-column tablet and mobile layouts
- Horizontal mobile task boards where workflow order must remain visible

Homepage typography is intentionally separate from product typography. Condensed display statements give the employer-facing company story a precise, forward-looking voice, while evidence previews and authenticated workflows keep the familiar product sans for trust and readability.

The previous creative noticeboard direction was intentionally rejected. It had energy, but its poster layouts, offset shadows, stamps, rotations, and mixed card compositions made Kickstart feel like an art publication rather than a professional product company.

### Logo

The confirmed logo is a custom touching `KS.` wordmark.

- The `K` and `S` visually connect.
- The mark stays compact and precise.
- The dot carries the growth-green accent.
- The mark must work in navigation, favicon, and larger brand contexts.
- The previous asterisk symbol is retired.

## The Market Problem

Intern and junior hiring is difficult for both sides.

Employers struggle because:

- CVs and portfolios are weak signals for beginner talent.
- Polished applications may not reflect genuine understanding.
- Small teams often lack a repeatable intern-management process.
- Managers forget to give feedback.
- Progress updates are vague.
- It is difficult to know who is improving, stuck, unreliable, or worth retaining.

Applicants struggle because:

- They need experience to get experience.
- Beginner portfolios are difficult to trust.
- Mass applications create noise.
- Internships often provide weak structure and limited feedback.
- Completed placements do not always produce useful proof for future roles.

Kickstart addresses the connected problem:

> Employers need a better way to identify potential and help it become performance.

## Product Thesis

The opportunity list is not the whole product.

The strongest product is the complete lifecycle:

> discover potential → review evidence → make a decision → start a placement → review work → give feedback → record growth

Hiring and development support one larger promise:

> Build trusted proof of growth for junior talent.

## Core Product Concepts

### Evidence-Based Applicant Review

Employers should review more than CV claims.

Useful evidence includes:

- Employer-specific answers
- Scenario reasoning
- Motivation and context
- Relevant proof links
- Applicant communication
- Structured employer notes
- Clear decisions

### Focused Apply

Focused Apply is the strongest application path.

It should prioritize:

- Role-specific questions
- Scenario responses
- Proof items
- Intent
- Context
- Reflection
- Optional tool-use disclosure

Profile Apply remains available as a lower-effort path, but it should never become the primary product story.

### Focused Internship

The structured experience continues after acceptance.

Useful placement structure includes:

- Starter tasks
- Expectations and due dates
- Intern updates
- Blocker reports
- Proof submissions
- Employer feedback
- Ratings
- Revision requests
- Weekly reviews
- Progress summaries

### Growth Record

The growth record connects the full lifecycle:

- Application evidence
- Employer decision
- Placement start
- Assigned tasks
- Submitted work
- Feedback
- Ratings
- Revisions
- Completion history
- Development signals

It helps employers understand future potential and helps interns leave with evidence rather than only a title.

## Current Prototype

The current prototype demonstrates:

1. Applicant opportunity discovery
2. Opportunity detail review
3. Focused Apply
4. Profile Apply
5. Employer applicant review
6. Accept, reject, shortlist, and review decisions
7. Placement creation
8. Starter tasks
9. Intern task updates
10. Work submission
11. Employer feedback and ratings
12. Intern development record

The prototype uses local storage and fake local authentication.

It does not yet include:

- A production database
- Real authentication
- Payments
- Employer opportunity creation
- Notifications
- File uploads
- Real analytics
- Multi-company tenancy

## Route Responsibilities

### Public

- `/`: Explain employer value and the potential-to-proven lifecycle.
- `/login`: Let demo users choose the correct role.
- `/register`: Create a demo role and enter the correct product flow.

### Applicant

- `/applicant/opportunities`: Browse and filter every open opportunity.
- `/applicant/opportunities/[id]`: Understand the complete role.
- `/applicant/opportunities/[id]/focused-apply`: Submit structured evidence.
- `/applicant/opportunities/[id]/quick-apply`: Submit a profile-based application.
- `/applicant/applications`: Track status, evidence, and next actions.

### Employer

- `/employer/opportunities`: Create, publish, close, and monitor opportunities.
- `/employer/applicants`: Compare potential and evidence, then make decisions.
- `/employer/employees`: Review intern work, feedback needs, and development.

### Intern

- `/employee/tasks`: Complete work and submit proof.
- `/employee/progress`: Review completed work, feedback, and growth evidence.

## Employer Experience Requirements

The employer experience is the commercial center of the product.

It must:

- Make applicant potential easy to compare
- Surface evidence before secondary profile metadata
- Make decisions deliberate and accountable
- Show who needs attention
- Make feedback timely and specific
- Connect placement activity to future-hire potential
- Avoid generic HR dashboard density

## Applicant Experience Requirements

Applicants must:

- Browse every opportunity without skip restrictions
- Understand pay, location, mode, deadline, and expectations
- Know what an application requires before starting
- Understand what the employer received
- Track application state and next action
- Receive feedback after acceptance
- Build evidence for future opportunities

## Agent And Automation Direction

AI can support the product, but it must not become the product identity.

Kickstart should not claim to perfectly detect AI-generated work. It should make the human learning process visible through structured evidence and revision history.

Useful future agent features include:

- Weekly intern summaries
- Missed update alerts
- Vague update detection
- Feedback draft suggestions
- Risk and attention flags
- Suggested next tasks
- End-of-placement summary drafts

Agent output must be grounded in structured product data.

## Future Product Opportunities

### Employer Attention View

Show:

- Who needs feedback
- Who is blocked
- Who missed updates
- Who is improving
- Who is ready for more responsibility

### Revision History

Connect:

- Original submission
- Employer feedback
- Revised submission
- Improvement note

### Review Rubrics

Evaluate:

- Clarity
- Effort
- Quality
- Communication
- Reliability
- Response to feedback

### Internship Quality

Hold employers accountable too:

- Were tasks clear?
- Was feedback timely?
- Were blockers resolved?
- Was there visible growth?

### Shareable Development Record

Give interns a credible record of completed work, proof, feedback, ratings, and growth.

## Target Customers

Best early customer segments:

- Small software agencies
- Startups hiring junior talent
- Internship programs
- Coding schools
- Universities with practical placements
- NGOs supporting youth employment
- Bootcamps
- Local companies without formal intern-management systems

Strong early-market wedge:

> Small tech teams in the Balkans that want interns but do not have a reliable system for evaluating and developing them.

## Success Criteria

Kickstart is successful when:

- Employers trust it enough to use for real intern decisions.
- Employers understand potential faster than they would from CVs alone.
- Intern work receives clearer and more timely feedback.
- Employers can identify who needs attention and who may be worth retaining.
- Applicants leave placements with useful evidence.
- The full lifecycle feels connected rather than split across unrelated tools.

## Final Decision Record

Confirmed decisions:

- Employer-first positioning
- Applicants as the secondary audience
- Professional growth and future-talent narrative
- Precision Growth visual system
- Behamics-inspired structure
- Restrained graphite lifecycle sections
- Electric growth-green accent
- Custom touching `KS.` logo
- Complete opportunity browsing for applicants
- Hiring and development treated as one connected product

Rejected directions:

- Corporate white-and-blue HR SaaS
- Blueprint workspace styling
- Creative noticeboard and art-discography styling
- Swipe or skip opportunity discovery
- Generic dashboard card grids
- AI-first product positioning
