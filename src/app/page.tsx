import Link from "next/link";
import { Progress } from "@/components/ui";

const stages = [
  {
    number: "01",
    label: "Application",
    title: "Potential enters the system.",
    text: "Applicants choose an open role and submit role-specific thinking, motivation, and relevant proof.",
    detail: "Focused application received",
  },
  {
    number: "02",
    label: "Evidence",
    title: "Employers see more than a CV.",
    text: "Structured answers and work samples make early potential easier to compare and discuss.",
    detail: "Evidence ready for review",
  },
  {
    number: "03",
    label: "Decision",
    title: "A hiring decision creates a plan.",
    text: "The employer records why the applicant stood out. Acceptance creates a placement and starter tasks.",
    detail: "Placement created",
  },
  {
    number: "04",
    label: "Development",
    title: "Real work proves the decision.",
    text: "Tasks, submitted work, feedback, and revisions show whether potential is becoming performance.",
    detail: "Development record active",
  },
];

export default function HomePage() {
  return (
    <main className="page home-page home-overdrive">
      <section className="container home-machine-hero">
        <div className="home-machine-copy">
          <p className="home-machine-label">Kickstart talent system</p>
          <h1>
            <span>Potential</span>
            <span className="home-machine-arrow" aria-hidden="true">→</span>
            <span>Proven.</span>
          </h1>
          <p className="lead">
            Applicants prove what they can do. Employers hire with evidence.
            Kickstart keeps that shared record alive through real work,
            feedback, and development.
          </p>
          <div className="home-audience-pair" aria-label="Kickstart for applicants and employers">
            <div>
              <span>For applicants</span>
              <strong>Turn potential into visible proof.</strong>
            </div>
            <div>
              <span>For employers</span>
              <strong>Find future hires through evidence.</strong>
            </div>
          </div>
          <div className="home-machine-actions">
            <Link href="/login" className="btn">
              Start reviewing talent
            </Link>
            <Link href="/applicant/opportunities" className="btn secondary">
              Browse opportunities
            </Link>
          </div>
        </div>

        <div className="home-candidate-ticket" aria-label="Candidate entering the Kickstart lifecycle">
          <div className="home-ticket-code">KS / CANDIDATE / 0042</div>
          <div className="home-ticket-person">
            <span className="home-ticket-avatar">AK</span>
            <div>
              <strong>Arta Krasniqi</strong>
              <span>Frontend intern candidate</span>
            </div>
          </div>
          <div className="home-ticket-proof">
            <span>Evidence attached</span>
            <strong>3 role answers · 1 scenario · 1 work sample</strong>
          </div>
          <span className="home-ticket-status">Ready for review</span>
        </div>

        <div className="home-machine-rail" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="container home-assembly" aria-labelledby="assembly-title">
        <header className="home-assembly-intro">
          <p className="home-machine-label">One record. Four working stages.</p>
          <h2 id="assembly-title">Hiring and development belong in the same system.</h2>
          <p>
            Kickstart carries the reason someone was hired into the work that
            proves whether the decision was right.
          </p>
        </header>

        <div className="home-assembly-line">
          {stages.map((stage, index) => (
            <article key={stage.number} className="home-stage">
              <div className="home-stage-marker">
                <span>{stage.number}</span>
                <i aria-hidden="true" />
              </div>

              <div className="home-stage-copy">
                <p>{stage.label}</p>
                <h3>{stage.title}</h3>
                <span>{stage.text}</span>
              </div>

              <div className={`home-stage-interface stage-${index + 1}`}>
                {index === 0 ? (
                  <>
                    <div className="home-interface-head">
                      <span>Focused application</span>
                      <strong>Frontend Intern</strong>
                    </div>
                    <div className="home-interface-question">
                      <span>Scenario response</span>
                      <p>Clarify the first action, explain the expected result, and test it with new users.</p>
                    </div>
                    <div className="home-interface-proof">Work sample attached</div>
                  </>
                ) : null}

                {index === 1 ? (
                  <>
                    <div className="home-interface-head">
                      <span>Applicant review</span>
                      <strong>Evidence summary</strong>
                    </div>
                    <div className="home-evidence-bars">
                      <span style={{ "--bar": "88%" } as React.CSSProperties}>Relevant proof</span>
                      <span style={{ "--bar": "76%" } as React.CSSProperties}>Clear reasoning</span>
                      <span style={{ "--bar": "82%" } as React.CSSProperties}>Learning potential</span>
                    </div>
                  </>
                ) : null}

                {index === 2 ? (
                  <>
                    <div className="home-interface-head">
                      <span>Decision note</span>
                      <strong>Accept applicant</strong>
                    </div>
                    <blockquote>
                      Strong relevant work, clear reasoning, and a specific learning goal.
                    </blockquote>
                    <div className="home-decision-actions">
                      <span>Shortlist</span>
                      <strong>Accept + create placement</strong>
                    </div>
                  </>
                ) : null}

                {index === 3 ? (
                  <>
                    <div className="home-interface-head">
                      <span>Active placement</span>
                      <strong>Development record</strong>
                    </div>
                    <div className="home-development-progress">
                      <div>
                        <strong>3 of 4 tasks complete</strong>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div className="home-development-task">
                      <span>Submitted work reviewed</span>
                      <strong>Approved with feedback</strong>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="home-stage-output">
                <span aria-hidden="true">✓</span>
                <strong>{stage.detail}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container home-final-output">
        <div>
          <p className="home-machine-label">The output</p>
          <h2>A future hire backed by evidence, work, and feedback.</h2>
        </div>
        <div className="home-output-record">
          <div>
            <span>Candidate</span>
            <strong>Arta Krasniqi</strong>
          </div>
          <div>
            <span>Placement</span>
            <strong>Frontend Intern</strong>
          </div>
          <div>
            <span>Work completed</span>
            <strong>3 approved tasks · 1 revision</strong>
          </div>
          <div>
            <span>Employer evidence</span>
            <strong>4.7 / 5 average review</strong>
          </div>
          <div>
            <span>Demonstrated strength</span>
            <strong>Clear reasoning under feedback</strong>
          </div>
          <div className="home-output-verdict">
            <span>Future-hire recommendation</span>
            <strong>Ready for another project</strong>
          </div>
          <Link href="/login" className="btn">
            Open Kickstart
          </Link>
        </div>
      </section>
    </main>
  );
}
