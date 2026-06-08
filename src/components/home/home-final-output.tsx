import Link from "next/link";

const output = [
  ["Candidate", "Arta Krasniqi"],
  ["Placement", "Frontend Intern"],
  ["Work completed", "3 approved tasks · 1 revision"],
  ["Employer evidence", "4.7 / 5 average review"],
  ["Demonstrated strength", "Clear reasoning under feedback"],
] as const;

export function HomeFinalOutput() {
  return (
    <section className="container home-final-output">
      <div>
        <p className="home-machine-label">The output</p>
        <h2>A future hire backed by evidence, work, and feedback.</h2>
      </div>
      <div className="home-output-record">
        {output.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
        <div className="home-output-verdict">
          <span>Future-hire recommendation</span>
          <strong>Ready for another project</strong>
        </div>
        <Link href="/login" className="btn">Open Kickstart</Link>
      </div>
    </section>
  );
}
