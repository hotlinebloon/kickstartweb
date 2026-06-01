"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getProgress,
  getState,
  resetState,
  saveState,
  updateApplication,
  type Application,
  type ApplicationStatus,
  type DemoState,
} from "@/lib/demo-store";
import {
  Badge,
  BlueprintEnvironment,
  EmptyState,
  LoadingState,
  Progress,
  StatCard,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";

function getCurrentIndex(index: number, applications: Application[]) {
  if (applications.length === 0) return 0;
  if (index < 0) return 0;
  if (index >= applications.length) return applications.length - 1;
  return index;
}

type PendingDecision = Extract<ApplicationStatus, "accepted" | "rejected">;

function getStatusTone(status: ApplicationStatus) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "danger";
  if (status === "shortlisted" || status === "under_review") return "info";
  return "neutral";
}

export default function EmployerApplicantsPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{
    text: string;
    undoState?: DemoState;
  } | null>(null);
  const [pendingDecision, setPendingDecision] = useState<PendingDecision | null>(
    null
  );
  const [decisionError, setDecisionError] = useState("");

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
        <div className="container">
          <LoadingState label="Loading applicant review" />
        </div>
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
    setPendingDecision(null);
    setDecisionError("");

    if (status === "accepted") {
      setNotice({
        text: "Applicant accepted. Placement and starter tasks were created.",
      });
    } else if (status === "shortlisted") {
      setNotice({ text: "Applicant moved to Shortlisted." });
    } else if (status === "rejected") {
      setNotice({ text: "Applicant rejected." });
    } else {
      setNotice({ text: "Application moved under review." });
    }
  }

  function startDecision(status: PendingDecision) {
    if (!application || application.status === "accepted") return;

    setPendingDecision(status);
    setDecisionError("");
    setNotice(null);
  }

  function confirmDecision() {
    if (!application || !state || !pendingDecision) return;

    const note = notes[application.id]?.trim() ?? "";

    if (!note) {
      setDecisionError("Add a note before confirming this decision.");
      return;
    }

    const undoState = state;
    const next = updateApplication({
      applicationId: application.id,
      status: pendingDecision,
      employerNote: note,
    });

    setState(next);
    setPendingDecision(null);
    setDecisionError("");

    setNotice({
      text:
        pendingDecision === "accepted"
          ? "Applicant accepted. Placement and starter tasks were created."
          : "Applicant rejected. Their application status is now Rejected.",
      undoState,
    });
  }

  function undoDecision(undoState: DemoState) {
    saveState(undoState);
    setState(undoState);
    setPendingDecision(null);
    setDecisionError("");
    setNotice({
      text: "Decision undone. The previous application state was restored.",
    });
  }

  function resetDemo() {
    const reset = resetState();
    setState(reset);
    setCurrentIndex(0);
    setNotes({});
    setNotice({
      text: "Review data reset. Submit an Apply with proof application first.",
    });
    setPendingDecision(null);
    setDecisionError("");
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Employer review queue</p>
            <h1>Review applicants</h1>
            <p className="lead">
              Review one structured application at a time. Compare proof,
              add notes, and make accountable hiring decisions.
            </p>
          </div>

          <div className="row">
            <button className="btn secondary" onClick={resetDemo}>
              Reset data
            </button>

            <Link className="btn secondary" href="/employer/employees">
              Monitor interns
            </Link>
          </div>
        </section>

        {notice ? (
          <div className="notice notice-actions" role="status">
            <span>{notice.text}</span>
            {notice.undoState ? (
              <button
                className="btn secondary"
                type="button"
                onClick={() => notice.undoState && undoDecision(notice.undoState)}
              >
                Undo decision
              </button>
            ) : null}
          </div>
        ) : null}

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
          <EmptyState
            title="No applications yet"
            description="Go through the applicant flow first: open an opportunity and submit Apply with proof."
            action={
              <Link className="btn" href="/applicant/opportunities">
                Start applicant flow
              </Link>
            }
          />
        ) : (
          <BlueprintEnvironment>
            <WorkSurface className="review-card">
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
                  <Badge tone="accent">Apply with proof</Badge>
                  <Badge>Focused Apply</Badge>
                  <StatusBadge tone={getStatusTone(application.status)}>
                    {getApplicationStatusLabel(application.status)}
                  </StatusBadge>
                  {placement ? (
                    <StatusBadge tone="success">Placement created</StatusBadge>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-main-side">
                <div className="stack-lg">
                  <section className="review-section review-evidence-section stack">
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

                  <section className="review-section review-evidence-section stack">
                  <div className="between">
                    <div>
                      <h3>Apply with proof answers</h3>
                      <p className="muted">
                        Proof, motivation, and scenario thinking in one place.
                      </p>
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
                  <section className="review-section review-evidence-section stack">
                    <h3>Scenario response</h3>
                    <p className="muted">{application.scenarioResponse}</p>
                  </section>

                  <section className="review-section review-evidence-section stack">
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
                          Starter tasks are now available in the intern
                          workspace.
                        </p>
                      </div>

                      <Badge tone="success">{progress.total} tasks</Badge>
                    </div>

                    <Progress value={progress.completionRate} />

                    <div className="row">
                      <Link className="btn secondary" href="/employer/employees">
                        Monitor intern progress
                      </Link>
                    </div>
                  </section>
                  ) : null}
                </div>

              <aside className="decision-panel">
                <section className="review-section decision-section stack">
                  <div className="stack-sm">
                    <h3>Decision review</h3>
                    <p className="muted">
                      Add a note, then shortlist, accept, or reject with a
                      confirmed decision.
                    </p>
                  </div>

                  <label htmlFor="employer-note">
                    Employer note (required for accept or reject)
                    <textarea
                      id="employer-note"
                      className="textarea"
                      aria-describedby={
                        pendingDecision
                          ? decisionError
                            ? "decision-note-help decision-note-error"
                            : "decision-note-help"
                          : "decision-note-help"
                      }
                      aria-invalid={Boolean(decisionError)}
                      value={notes[application.id] ?? ""}
                      onChange={(event) => {
                        setNotes((prev) => ({
                          ...prev,
                          [application.id]: event.target.value,
                        }));
                        if (decisionError) setDecisionError("");
                      }}
                      placeholder="Strong project, good motivation..."
                    />
                  </label>
                  <p id="decision-note-help" className="help-text">
                    Add the reason behind the decision so the review stays
                    accountable.
                  </p>

                  {pendingDecision ? (
                    <section
                      className="decision-confirm stack"
                      aria-labelledby="decision-confirm-title"
                    >
                      <div className="stack-sm">
                        <p className="eyebrow">Confirm decision</p>
                        <h3 id="decision-confirm-title">
                          {pendingDecision === "accepted"
                            ? "Confirm accept"
                            : "Confirm reject"}
                        </h3>
                        <p className="muted">
                          {application.applicantSnapshot.fullName} will be marked{" "}
                          <strong>
                            {pendingDecision === "accepted"
                              ? "Accepted"
                              : "Rejected"}
                          </strong>
                          .{" "}
                          {pendingDecision === "accepted"
                            ? "This creates the accepted intern flow with a placement and starter tasks."
                            : "Their application status will become Rejected."}
                        </p>
                      </div>

                      {decisionError ? (
                        <p id="decision-note-error" className="field-error">
                          {decisionError}
                        </p>
                      ) : null}

                      <div className="row">
                        <button
                          className="btn secondary"
                          type="button"
                          onClick={() => {
                            setPendingDecision(null);
                            setDecisionError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className={
                            pendingDecision === "rejected" ? "btn danger" : "btn"
                          }
                          type="button"
                          onClick={confirmDecision}
                        >
                          {pendingDecision === "accepted"
                            ? "Confirm accept"
                            : "Confirm reject"}
                        </button>
                      </div>
                    </section>
                  ) : null}

                  <div className="action-grid">
                    <button
                      className="action-button reject"
                      disabled={application.status === "accepted"}
                      onClick={() => startDecision("rejected")}
                    >
                      Reject
                    </button>

                    <button
                      className="action-button hold"
                      disabled={application.status === "accepted"}
                      onClick={() => setStatus(application.id, "shortlisted")}
                    >
                      Shortlist
                    </button>

                    <button
                      className="action-button accept"
                      disabled={application.status === "accepted"}
                      onClick={() => startDecision("accepted")}
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
            </WorkSurface>
          </BlueprintEnvironment>
        )}
      </div>
    </main>
  );
} 
