import type { CSSProperties } from "react";
import { Progress } from "@/components/ui";

export function HomeStageInterface({ index }: { index: number }) {
  return (
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
            <span style={{ "--bar": "88%" } as CSSProperties}>Relevant proof</span>
            <span style={{ "--bar": "76%" } as CSSProperties}>Clear reasoning</span>
            <span style={{ "--bar": "82%" } as CSSProperties}>Learning potential</span>
          </div>
        </>
      ) : null}

      {index === 2 ? (
        <>
          <div className="home-interface-head">
            <span>Decision note</span>
            <strong>Accept applicant</strong>
          </div>
          <blockquote>Strong relevant work, clear reasoning, and a specific learning goal.</blockquote>
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
  );
}
