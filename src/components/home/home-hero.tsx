import Link from "next/link";

export function HomeHero() {
  return (
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
          Kickstart keeps that shared record alive through real work, feedback,
          and development.
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
          <Link href="/login" className="btn">Start reviewing talent</Link>
          <Link href="/applicant/opportunities" className="btn secondary">Browse opportunities</Link>
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
  );
}
