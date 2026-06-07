"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getProgress,
  getState,
  saveState,
  updateApplication,
  type Application,
  type ApplicationStatus,
  type DemoState,
} from "@/lib/demo-store";
import {
  Badge,
  ProductEnvironment,
  EmptyState,
  LoadingState,
  Progress,
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
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [opportunityFilter, setOpportunityFilter] = useState("all");

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

  useEffect(() => {
    function navigateQueue(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;
      if (event.key === "ArrowLeft") {
        setCurrentIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === "ArrowRight") {
        const count =
          state?.applications.filter(
            (item) =>
              (statusFilter === "all" || item.status === statusFilter) &&
              (opportunityFilter === "all" || item.opportunityId === opportunityFilter)
          ).length ?? 0;
        setCurrentIndex((index) => Math.min(index + 1, Math.max(count - 1, 0)));
      }
    }
    window.addEventListener("keydown", navigateQueue);
    return () => window.removeEventListener("keydown", navigateQueue);
  }, [state, statusFilter, opportunityFilter]);

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading applicant review" />
        </div>
      </main>
    );
  }

  const applications = state.applications.filter(
    (item) =>
      (statusFilter === "all" || item.status === statusFilter) &&
      (opportunityFilter === "all" || item.opportunityId === opportunityFilter)
  );
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
        text: "Applicant accepted. Their placement and starter tasks are ready.",
      });
    } else if (status === "shortlisted") {
      setNotice({ text: "Applicant added to the shortlist." });
    } else if (status === "rejected") {
      setNotice({ text: "Application rejected. The applicant will see the final decision." });
    } else {
      setNotice({ text: "Application marked as under review." });
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
      setDecisionError("Add a decision note before accepting or rejecting this applicant.");
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
          ? "Applicant accepted. Their placement and starter tasks are ready."
          : "Application rejected. The applicant will see the final decision.",
      undoState,
    });
  }

  function undoDecision(undoState: DemoState) {
    saveState(undoState);
    setState(undoState);
    setPendingDecision(null);
    setDecisionError("");
    setNotice({
      text: "Decision undone. The application returned to its previous status.",
    });
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Applicant review</p>
            <h1>Review applicants</h1>
            <p className="lead">
              Compare how each person thinks, review relevant proof, and make
              a confident decision based on potential and evidence.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/employer/opportunities">
              Manage opportunities
            </Link>
            <label className="compact-field">
              Opportunity
              <select
                className="input"
                value={opportunityFilter}
                onChange={(event) => {
                  setOpportunityFilter(event.target.value);
                  setCurrentIndex(0);
                }}
              >
                <option value="all">All opportunities</option>
                {state.opportunities.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>
            <label className="compact-field">
              Review queue
              <select
                className="input"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as "all" | ApplicationStatus);
                  setCurrentIndex(0);
                }}
              >
                <option value="all">All applications</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <Link className="btn secondary" href="/employer/employees">
              See team progress
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

        {applications.length === 0 ? (
          <EmptyState
            title={state.applications.length === 0 ? "No applications yet" : "No applications match this filter"}
            description={
              state.applications.length === 0
                ? "Publish an opportunity and share it with applicants to begin receiving applications."
                : "Choose another queue status to continue reviewing applications."
            }
            action={
              state.applications.length === 0 ? (
                <Link className="btn" href="/employer/opportunities">
                  Manage opportunities
                </Link>
              ) : (
                <button className="btn secondary" type="button" onClick={() => setStatusFilter("all")}>
                  Show all applications
                </button>
              )
            }
          />
        ) : (
          <ProductEnvironment>
            <WorkSurface className="review-card">
              <div className="between">
                <div className="stack-sm">
                  <p className="meta-label">
                    Applicant {safeIndex + 1} of {applications.length}
                  </p>

                  <h2>{application.applicantSnapshot.fullName}</h2>

                  <p className="muted">
                    {opportunity?.title ?? "Opportunity no longer available"} ·{" "}
                    {state.company.name} · submitted{" "}
                    {formatDate(application.submittedAt)}
                  </p>
                </div>

                <div className="row">
                  <Badge tone="accent">
                    {application.method === "quick" ? "Profile application" : "Focused application"}
                  </Badge>
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
                  {application.method === "quick" ? (
                    <section className="review-section review-evidence-section review-section-quiet stack">
                      <h3>Profile application contents</h3>
                      <p className="muted">
                        This applicant sent their saved profile and portfolio
                        without role-specific answers or a scenario response.
                      </p>
                      <a className="text-link" href={application.proofUrl} target="_blank" rel="noreferrer">
                        Open submitted portfolio
                      </a>
                    </section>
                  ) : (
                  <>
                  <section className="review-section review-evidence-section review-section-quiet stack">
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
                      <a className="text-link" href={application.applicantSnapshot.portfolioUrl} target="_blank" rel="noreferrer">
                        Open portfolio
                      </a>
                    </p>
                  </div>

                  <p className="muted">{application.applicantSnapshot.bio}</p>

                  <div className="row">
                    {application.applicantSnapshot.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                  </section>

                  <section className="review-section review-evidence-section review-section-quiet stack">
                  <div className="between">
                    <div>
                      <h3>Application answers</h3>
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
                        <p className="section-support-text">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  </section>

                <div className="grid grid-2">
                  <section className="review-section review-evidence-section review-section-quiet stack">
                    <h3>Scenario response</h3>
                    <p className="muted">{application.scenarioResponse}</p>
                  </section>

                  <section className="review-section review-evidence-section review-section-quiet stack">
                    <h3>Submitted work sample</h3>
                    <a className="text-link" href={application.proofUrl} target="_blank" rel="noreferrer">
                      Open submitted work sample
                    </a>
                  </section>
                </div>
                </>
                )}

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
                        Open active intern
                      </Link>
                    </div>
                  </section>
                  ) : null}
                </div>

              <aside className="decision-panel">
                <section className="review-section decision-section stack">
                  <div className="stack-sm">
                    <h3>Record a decision</h3>
                    <p className="muted">
                      Add a note that explains your decision. Accepting creates
                      a placement and starter tasks.
                    </p>
                  </div>

                  <label htmlFor="employer-note">
                    Decision note (required to accept or reject)
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
                      placeholder="Strong relevant work and clear learning goals."
                    />
                  </label>
                  <p id="decision-note-help" className="help-text">
                    Record the evidence behind your decision for future review.
                  </p>

                  {pendingDecision ? (
                    <section
                      className="decision-confirm stack"
                      aria-labelledby="decision-confirm-title"
                    >
                      <div className="stack-sm">
                        <p className="meta-label">Confirm decision</p>
                        <h3 id="decision-confirm-title">
                          {pendingDecision === "accepted"
                            ? "Accept applicant?"
                            : "Reject application?"}
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
                            ? "Kickstart will create an active placement and starter tasks."
                            : "This is a final decision. The applicant will see that the application was rejected."}
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
                          Keep reviewing
                        </button>
                        <button
                          className={
                            pendingDecision === "rejected" ? "btn danger" : "btn"
                          }
                          type="button"
                          onClick={confirmDecision}
                        >
                          {pendingDecision === "accepted"
                            ? "Accept applicant"
                            : "Reject application"}
                        </button>
                      </div>
                    </section>
                  ) : null}

                  <div className="action-grid">
                    <button
                      className="action-button reject"
                      type="button"
                      disabled={application.status === "accepted"}
                      onClick={() => startDecision("rejected")}
                    >
                      Reject application
                    </button>

                    <button
                      className="action-button hold"
                      type="button"
                      disabled={application.status === "accepted"}
                      onClick={() => setStatus(application.id, "shortlisted")}
                    >
                      Add to shortlist
                    </button>

                    <button
                      className="action-button accept"
                      type="button"
                      disabled={application.status === "accepted"}
                      onClick={() => startDecision("accepted")}
                    >
                      Accept applicant
                    </button>
                  </div>
                </section>

                <section className="review-section stack">
                  <h3>Review queue</h3>
                  <p className="muted">
                    Applicant {safeIndex + 1} of {applications.length}. Use the
                    arrow keys to move through the queue.
                  </p>

                  <div className="row">
                    <button
                      className="btn secondary"
                      type="button"
                      onClick={movePrevious}
                      disabled={safeIndex === 0}
                    >
                      Previous applicant
                    </button>

                    <button
                      className="btn secondary"
                      type="button"
                      onClick={moveNext}
                      disabled={safeIndex === applications.length - 1}
                    >
                      Next applicant
                    </button>
                  </div>
                </section>
              </aside>
            </div>
            </WorkSurface>
          </ProductEnvironment>
        )}
      </div>
    </main>
  );
} 
