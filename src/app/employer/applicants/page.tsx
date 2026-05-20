"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getProgress,
  getState,
  resetState,
  updateApplication,
  type Application,
  type ApplicationStatus,
  type DemoState,
} from "@/lib/demo-store";
import { Badge, Progress, StatCard } from "@/components/ui";

function getCurrentIndex(index: number, applications: Application[]) {
  if (applications.length === 0) return 0;
  if (index < 0) return 0;
  if (index >= applications.length) return applications.length - 1;
  return index;
}

export default function EmployerApplicantsPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  function load() {
    const current = getState();

    setState(current);

    setNotes(
      Object.fromEntries(
        current.applications.map((application) => [
          application.id,
          application.employerNote ?? "",
        ])
      )
    );
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    if (!state) {
      return {
        total: 0,
        submitted: 0,
        inReview: 0,
        accepted: 0,
      };
    }

    return {
      total: state.applications.length,
      submitted: state.applications.filter(
        (item) => item.status === "submitted"
      ).length,
      inReview: state.applications.filter(
        (item) =>
          item.status === "under_review" || item.status === "shortlisted"
      ).length,
      accepted: state.applications.filter((item) => item.status === "accepted")
        .length,
    };
  }, [state]);

  if (!state) {
    return (
      <main className="page">
        <div className="container">Loading...</div>
      </main>
    );
  }

  const applications = state.applications;
  const safeIndex = getCurrentIndex(currentIndex, applications);
  const application = applications[safeIndex] ?? null;

  const opportunity = application
    ? state.opportunities.find((item) => item.id === application.opportunityId)
    : null;

  const placement = application
    ? state.placements.find((item) => item.applicationId === application.id)
    : null;

  const progress = placement ? getProgress(placement.id, state) : null;

  function moveNext() {
    setCurrentIndex((index) =>
      applications.length === 0
        ? 0
        : Math.min(index + 1, applications.length - 1)
    );
  }

  function movePrevious() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function setStatus(applicationId: string, status: ApplicationStatus) {
    const next = updateApplication({
      applicationId,
      status,
      employerNote: notes[applicationId],
    });

    setState(next);

    if (status === "accepted") {
      setMessage("Applicant accepted. Placement and starter tasks were created.");
    } else if (status === "shortlisted") {
      setMessage("Applicant moved to Hold / Shortlisted.");
    } else if (status === "rejected") {
      setMessage("Applicant rejected.");
    } else {
      setMessage("Application moved under review.");
    }
  }

  function makeDecision(status: ApplicationStatus) {
    if (!application || application.status === "accepted") return;

    setStatus(application.id, status);

    if (safeIndex < applications.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  }

  function resetDemo() {
    const reset = resetState();
    setState(reset);
    setCurrentIndex(0);
    setNotes({});
    setMessage("Demo reset. Submit a Focused Apply as applicant first.");
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Employer review queue</p>
            <h1>Review applicants</h1>
            <p className="lead">
              Review one structured application at a time. This keeps the
              swipe-card idea, but uses buttons instead of dragging for better
              performance.
            </p>
          </div>

          <div className="row">
            <button className="btn secondary" onClick={resetDemo}>
              Reset demo
            </button>

            <Link className="btn secondary" href="/employer/employees">
              Employee progress
            </Link>
          </div>
        </section>

        {message ? <div className="notice">{message}</div> : null}

        <section className="grid grid-4">
          <StatCard title="Total" description="Applications" value={stats.total} />
          <StatCard
            title="Submitted"
            description="Waiting for review"
            value={stats.submitted}
          />
          <StatCard title="Hold" description="Shortlisted" value={stats.inReview} />
          <StatCard
            title="Accepted"
            description="Placements created"
            value={stats.accepted}
          />
        </section>

        {applications.length === 0 ? (
          <section className="card stack">
            <h3>No applications yet</h3>
            <p className="muted">
              Go through the applicant flow first: open an opportunity and
              submit Focused Apply.
            </p>

            <Link className="btn" href="/applicant/opportunities">
              Start applicant flow
            </Link>
          </section>
        ) : (
          <section className="card review-card">
            <div className="between">
              <div className="stack-sm">
                <p className="eyebrow">
                  Applicant {safeIndex + 1} of {applications.length}
                </p>

                <h2>{application.applicantSnapshot.fullName}</h2>

                <p className="muted">
                  {opportunity?.title ?? "Unknown opportunity"} ·{" "}
                  {state.company.name} · submitted{" "}
                  {formatDate(application.submittedAt)}
                </p>
              </div>

              <div className="row">
                <Badge tone="accent">Focused Apply</Badge>
                <Badge>{getApplicationStatusLabel(application.status)}</Badge>
                {placement ? <Badge tone="success">Placement created</Badge> : null}
              </div>
            </div>

            <div className="grid grid-main-side">
              <div className="stack-lg">
                <section className="review-section stack">
                  <div className="between">
                    <div>
                      <h3>Applicant profile</h3>
                      <p className="muted">
                        CV/profile snapshot used for review.
                      </p>
                    </div>

                    <Badge>{application.applicantSnapshot.location}</Badge>
                  </div>

                  <div className="grid grid-2">
                    <p>
                      <strong>Education:</strong>{" "}
                      {application.applicantSnapshot.education}
                    </p>

                    <p>
                      <strong>School:</strong>{" "}
                      {application.applicantSnapshot.school}
                    </p>

                    <p>
                      <strong>CV:</strong>{" "}
                      {application.applicantSnapshot.cvName}
                    </p>

                    <p>
                      <strong>Portfolio:</strong>{" "}
                      {application.applicantSnapshot.portfolioUrl}
                    </p>
                  </div>

                  <p className="muted">{application.applicantSnapshot.bio}</p>

                  <div className="row">
                    {application.applicantSnapshot.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </section>

                <section className="review-section stack">
                  <div className="between">
                    <div>
                      <h3>Focused Apply answers</h3>
                      <p className="muted">More signal than a generic CV.</p>
                    </div>

                    <Badge tone="accent">Structured review</Badge>
                  </div>

                  <div className="stack">
                    {application.answers.map((answer) => (
                      <div key={answer.question} className="answer-card">
                        <strong>{answer.question}</strong>
                        <p className="muted" style={{ marginTop: 6 }}>
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-2">
                  <section className="review-section stack">
                    <h3>Scenario response</h3>
                    <p className="muted">{application.scenarioResponse}</p>
                  </section>

                  <section className="review-section stack">
                    <h3>Proof item</h3>
                    <p className="muted" style={{ wordBreak: "break-all" }}>
                      {application.proofUrl}
                    </p>
                  </section>
                </div>

                {placement && progress ? (
                  <section className="placement-banner stack">
                    <div className="between">
                      <div>
                        <h3>Placement created</h3>
                        <p className="muted">
                          Starter tasks are now available on the employee task
                          board.
                        </p>
                      </div>

                      <Badge tone="success">{progress.total} tasks</Badge>
                    </div>

                    <Progress value={progress.completionRate} />

                    <div className="row">
                      <Link className="btn" href="/employee/tasks">
                        Open employee tasks
                      </Link>

                      <Link className="btn secondary" href="/employer/employees">
                        Review progress
                      </Link>
                    </div>
                  </section>
                ) : null}
              </div>

              <aside className="decision-panel">
                <section className="review-section stack">
                  <div className="stack-sm">
                    <p className="eyebrow">Employer-only card review</p>
                    <h3>Quick decision, structured review</h3>
                    <p className="muted">
                      This keeps the swipe-style card idea without the
                      performance cost of real dragging.
                    </p>
                  </div>

                  <label>
                    Employer note
                    <textarea
                      className="textarea"
                      value={notes[application.id] ?? ""}
                      onChange={(event) =>
                        setNotes((prev) => ({
                          ...prev,
                          [application.id]: event.target.value,
                        }))
                      }
                      placeholder="Strong project, good motivation..."
                    />
                  </label>

                  <div className="action-grid">
                    <button
                      className="action-button reject"
                      disabled={application.status === "accepted"}
                      onClick={() => makeDecision("rejected")}
                    >
                      Reject
                    </button>

                    <button
                      className="action-button hold"
                      disabled={application.status === "accepted"}
                      onClick={() => setStatus(application.id, "shortlisted")}
                    >
                      Hold
                    </button>

                    <button
                      className="action-button accept"
                      disabled={application.status === "accepted"}
                      onClick={() => makeDecision("accepted")}
                    >
                      Accept
                    </button>
                  </div>
                </section>

                <section className="review-section stack">
                  <h3>Queue controls</h3>
                  <p className="muted">
                    Move between applications without leaving the review page.
                  </p>

                  <div className="row">
                    <button
                      className="btn secondary"
                      onClick={movePrevious}
                      disabled={safeIndex === 0}
                    >
                      Previous
                    </button>

                    <button
                      className="btn secondary"
                      onClick={moveNext}
                      disabled={safeIndex === applications.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}