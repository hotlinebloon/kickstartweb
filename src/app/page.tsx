import Link from "next/link";
import { KickstartLogo } from "@/components/kickstart-logo";

const steps = [
  {
    title: "Find an opportunity",
    text: "Applicants browse youth opportunities and open a role that fits their skills.",
  },
  {
    title: "Apply with proof",
    text: "Focused Apply uses questions, a scenario task, and a proof item instead of only a CV.",
  },
  {
    title: "Get reviewed properly",
    text: "Employers review structured applications and accept applicants into placements.",
  },
  {
    title: "Grow after hiring",
    text: "Accepted interns get tasks, submit work, receive feedback, and build a progress profile.",
  },
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="container hero">
        <div className="hero-copy stack-lg">
          <div className="stack">
            <p className="eyebrow">Youth opportunity + growth platform</p>

            <h1 className="hero-title">
              Find young talent. Help them <span>grow.</span>
            </h1>

            <p className="lead">
              Kickstart helps young people find opportunities, prove their
              skills through Focused Apply, get reviewed properly, and continue
              growing after they are accepted.
            </p>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="btn">
              Start demo
            </Link>

            <Link href="/applicant/opportunities" className="btn secondary">
              Explore opportunities
            </Link>
          </div>

          <div className="grid grid-3">
            <div className="card soft">
              <p className="eyebrow">01</p>
              <h3>Discover</h3>
              <p className="muted">
                Browse internships, micro-projects, and entry-level roles.
              </p>
            </div>

            <div className="card soft">
              <p className="eyebrow">02</p>
              <h3>Apply with proof</h3>
              <p className="muted">
                Answer questions, complete a short scenario, and attach proof.
              </p>
            </div>

            <div className="card soft">
              <p className="eyebrow">03</p>
              <h3>Grow after hiring</h3>
              <p className="muted">
                Move tasks through a Growth Dashboard and receive feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="node-path">
            <svg viewBox="0 0 600 560">
              <path d="M90 80 C220 110 210 250 330 240 C460 230 430 410 535 450" />
              <circle cx="90" cy="80" r="10" />
              <circle cx="330" cy="240" r="10" />
              <circle cx="535" cy="450" r="10" />
            </svg>
          </div>

          <div className="mock-stack">
            <div className="card blueprint mock-card one stack">
              <div className="between">
                <div>
                  <p className="eyebrow">Opportunity</p>
                  <h3>Frontend Intern</h3>
                </div>
                <span className="badge accent">Focused Apply</span>
              </div>

              <p className="muted">
                NovaTech · Prishtina / Hybrid · React, UI, CSS
              </p>

              <div className="nav-actions">
                <span className="badge">Internship</span>
                <span className="badge blue">Deadline soon</span>
              </div>
            </div>

            <div className="card mock-card two stack">
              <p className="eyebrow">Focused Apply</p>
              <h3>Show more than a CV</h3>

              <div className="stack-sm">
                <div className="card soft">
                  Why are you interested in this role?
                </div>
                <div className="card soft">
                  Scenario: improve our landing page.
                </div>
                <div className="card soft">Proof: GitHub or portfolio link</div>
              </div>
            </div>

            <div className="card mock-card three stack">
              <p className="eyebrow">Employer review</p>
              <h3>Arta Krasniqi</h3>
              <p className="muted">
                Strong project, clear motivation, good proof item.
              </p>

              <div className="nav-actions">
                <span className="badge blue">Shortlist</span>
                <span className="badge accent">Accept</span>
              </div>
            </div>

            <div className="card blueprint mock-card four stack">
              <div className="between">
                <div>
                  <p className="eyebrow">Growth Dashboard</p>
                  <h3>Task progress</h3>
                </div>
                <KickstartLogo />
              </div>

              <div className="task-columns" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="task-column">
                  <p className="badge">Working</p>
                  <div className="task-card" style={{ marginTop: 10 }}>
                    Build landing page hero
                  </div>
                </div>
                <div className="task-column">
                  <p className="badge accent">Needs Review</p>
                  <div className="task-card" style={{ marginTop: 10 }}>
                    Submit GitHub link
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container stack-lg" style={{ marginTop: 70 }}>
        <div className="between">
          <div className="stack">
            <p className="eyebrow">The core demo path</p>
            <h2>From first application to first real progress.</h2>
          </div>

          <Link href="/login" className="btn">
            Try the prototype
          </Link>
        </div>

        <div className="grid grid-4">
          {steps.map((step, index) => (
            <div key={step.title} className="card">
              <div className="stack">
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container stack-lg" style={{ marginTop: 70 }}>
        <div className="card blueprint">
          <div className="between">
            <div className="stack">
              <p className="eyebrow">Product promise</p>
              <h2>Not just hiring. Growth after hiring.</h2>
              <p className="lead">
                Kickstart does not stop when a company accepts an applicant.
                New interns get tasks, feedback, and a visible progress profile
                that can become proof for future opportunities.
              </p>
            </div>

            <div className="nav-actions">
              <Link href="/applicant/opportunities" className="btn">
                Applicant flow
              </Link>
              <Link href="/employer/applicants" className="btn secondary">
                Employer flow
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}