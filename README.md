# Kickstart 11-Step Prototype

This is a clean Next.js prototype focused only on the core Kickstart demo path:

1. Applicant opens opportunities
2. Applicant opens one opportunity
3. Applicant submits Focused Apply
4. Employer reviews applicant
5. Employer accepts applicant
6. Placement is created
7. Starter tasks appear
8. Employee moves task to Working On It
9. Employee submits task to Needs Review
10. Employer reviews and marks Completed
11. Progress profile updates

It also includes fake local login/signup pages for switching between Applicant, Employer, and Employee views.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Main routes

- `/login`
- `/register`
- `/applicant/opportunities`
- `/applicant/opportunities/[id]`
- `/applicant/applications`
- `/employer/applicants`
- `/employee/tasks`
- `/employer/employees`
- `/employee/progress`

This project uses localStorage only. No real database/auth yet.
