import { HomeStageInterface } from "./home-stage-interface";

const stages = [
  ["01", "Application", "Potential enters the system.", "Applicants choose an open role and submit role-specific thinking, motivation, and relevant proof.", "Focused application received"],
  ["02", "Evidence", "Employers see more than a CV.", "Structured answers and work samples make early potential easier to compare and discuss.", "Evidence ready for review"],
  ["03", "Decision", "A hiring decision creates a plan.", "The employer records why the applicant stood out. Acceptance creates a placement and starter tasks.", "Placement created"],
  ["04", "Development", "Real work proves the decision.", "Tasks, submitted work, feedback, and revisions show whether potential is becoming performance.", "Development record active"],
] as const;

export function HomeAssembly() {
  return (
    <section className="container home-assembly" aria-labelledby="assembly-title">
      <header className="home-assembly-intro">
        <p className="home-machine-label">One record. Four working stages.</p>
        <h2 id="assembly-title">Hiring and development belong in the same system.</h2>
        <p>Kickstart carries the reason someone was hired into the work that proves whether the decision was right.</p>
      </header>

      <div className="home-assembly-line">
        {stages.map(([number, label, title, text, detail], index) => (
          <article key={number} className="home-stage">
            <div className="home-stage-marker">
              <span>{number}</span>
              <i aria-hidden="true" />
            </div>
            <div className="home-stage-copy">
              <p>{label}</p>
              <h3>{title}</h3>
              <span>{text}</span>
            </div>
            <HomeStageInterface index={index} />
            <div className="home-stage-output">
              <span aria-hidden="true">✓</span>
              <strong>{detail}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
