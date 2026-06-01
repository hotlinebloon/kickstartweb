"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getProgress,
  getState,
  type Application,
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

function getStatusTone(status: Application["status"]) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "danger";
  if (status === "shortlisted" || status === "under_review") return "info";
  return "neutral";
}

function statusIsDone(
  current: Application["status"],
  step: "submitted" | "review" | "accepted" | "growth"
) {
  if (step === "submitted") return true;
  if (step === "review") {
    return (
      current === "under_review" ||
      current === "shortlisted" ||
      current === "accepted" ||
      current === "rejected"
    );
  }
  if (step === "accepted") return current === "accepted";
  return false;
}

export default function ApplicationsPage() {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const stats = useMemo(() => {
    if (!state) {
      return {
        total: 0,
        submitted: 0,
        accepted: 0,
        placements: 0,
      };
    }

    return {
      total: state.applications.length,
      submitted: state.applications.filter((item) => item.status === "submitted")
        .length,
      accepted: state.applications.filter((item) => item.status === "accepted")
        .length,
      placements: state.placements.length,
    };
  }, [state]);

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading applications" />
        </div>
      </main>
    );
  }

  const acceptedPlacement = state.placements[0] ?? null;
  const progress = acceptedPlacement ? getProgress(acceptedPlacement.id, state) : null;

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Application tracking</p>
            <h1>My applications</h1>
            <p className="lead">
              Track what you submitted, what the employer sees, and what unlocks
              after acceptance.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/applicant/opportunities">
              Browse more
            </Link>
          </div>
        </section>

        <section className="grid grid-4">
          <StatCard title="Total" description="Applications sent" value={stats.total} />
          <StatCard
            title="Submitted"
            description="Waiting for review"
            value={stats.submitted}
          />
          <StatCard title="Accepted" description="Approved by employer" value={stats.accepted} />
          <StatCard title="Placements" description="Growth unlocked" value={stats.placements} />
        </section>

        {state.applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Open an opportunity, read the details, answer the employer questions, complete the scenario response, and attach a proof item."
            action={
              <Link className="btn" href="/applicant/opportunities">
                Open opportunities
              </Link>
            }
          />
        ) : (
          <BlueprintEnvironment>
            <section className="applications-layout">
              <div className="stack">
              {state.applications.map((application) => {
                const opportunity = state.opportunities.find(
                  (item) => item.id === application.opportunityId
                );

                const placement =
                  state.placements.find(
                    (item) => item.applicationId === application.id
                  ) ?? null;

                const placementProgress = placement
                  ? getProgress(placement.id, state)
                  : null;

                return (
                  <WorkSurface key={application.id} className="application-card">
                    <div className="between">
                      <div className="stack-sm">
                        <p className="eyebrow">Apply with proof submitted</p>
                        <h2>{opportunity?.title ?? "Opportunity"}</h2>
                        <p className="muted">
                          {state.company.name} · {opportunity?.type ?? "Application"} ·
                          submitted {formatDate(application.submittedAt)}
                        </p>
                      </div>

                      <StatusBadge tone={getStatusTone(application.status)}>
                        {getApplicationStatusLabel(application.status)}
                      </StatusBadge>
                    </div>

                    <div className="application-status-strip">
                      <div
                        className={`status-step ${
                          statusIsDone(application.status, "submitted")
                            ? "done"
                            : ""
                        }`}
                      >
                        <strong>Submitted</strong>
                        <p className="muted">Application sent</p>
                      </div>

                      <div
                        className={`status-step ${
                          statusIsDone(application.status, "review")
                            ? "done"
                            : application.status === "submitted"
                              ? "active"
                              : ""
                        }`}
                      >
                        <strong>Review</strong>
                        <p className="muted">Employer checks proof</p>
                      </div>

                      <div
                        className={`status-step ${
                          statusIsDone(application.status, "accepted")
                            ? "done"
                            : ""
                        }`}
                      >
                        <strong>Accepted</strong>
                        <p className="muted">Placement created</p>
                      </div>

                      <div
                        className={`status-step ${
                          placement ? "done" : application.status === "accepted" ? "active" : ""
                        }`}
                      >
                        <strong>Intern workspace</strong>
                        <p className="muted">Tasks and feedback</p>
                      </div>
                    </div>

                    <section className="application-proof-grid">
                      <div className="application-summary-box stack">
                        <h3>What employer receives</h3>
                        <p className="muted">
                          {application.answers.length} answers, one scenario
                          response, and one proof item.
                        </p>

                        <div className="row">
                          <Badge tone="accent">Questions</Badge>
                          <Badge tone="accent">Scenario</Badge>
                          <Badge tone="accent">Proof</Badge>
                        </div>
                      </div>

                      <div className="application-summary-box stack">
                        <h3>Proof item</h3>
                        <p className="muted" style={{ wordBreak: "break-all" }}>
                          {application.proofUrl}
                        </p>
                      </div>
                    </section>

                    <section className="stack">
                      <h3>Your answers</h3>

                      {application.answers.map((answer) => (
                        <div key={answer.question} className="application-answer">
                          <strong>{answer.question}</strong>
                          <p className="muted" style={{ marginTop: 6 }}>
                            {answer.answer}
                          </p>
                        </div>
                      ))}
                    </section>

                    <section className="application-answer">
                      <strong>Scenario response</strong>
                      <p className="muted" style={{ marginTop: 6 }}>
                        {application.scenarioResponse}
                      </p>
                    </section>

                    {placement && placementProgress ? (
                      <section className="placement-banner stack">
                        <div className="between">
                          <div>
                            <h3>Accepted: intern workspace unlocked</h3>
                            <p className="muted">
                              Intern tasks are now unlocked. This is where
                              Kickstart continues after hiring.
                            </p>
                          </div>

                          <Badge tone="success">
                            {placementProgress.completionRate}% complete
                          </Badge>
                        </div>

                        <Progress value={placementProgress.completionRate} />

                        <div className="row">
                          <Badge>Not started: {placementProgress.notStarted}</Badge>
                          <Badge>Working: {placementProgress.working}</Badge>
                          <Badge>Needs review: {placementProgress.review}</Badge>
                          <Badge>Completed: {placementProgress.completed}</Badge>
                        </div>

                        <div className="row">
                          <Link className="btn" href="/employee/tasks">
                            Open intern tasks
                          </Link>

                          <Link className="btn secondary" href="/employee/progress">
                            View intern progress
                          </Link>
                        </div>
                      </section>
                    ) : null}
                  </WorkSurface>
                );
              })}
              </div>

              <aside className="application-side">
                <WorkSurface className="application-side-card">
                <p className="eyebrow">Next step</p>

                <div className="next-step-box">
                  {acceptedPlacement ? (
                    <>
                      <h3>Start intern tasks</h3>
                      <p className="muted">
                        You were accepted. The intern task board is now
                        available.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>Waiting for employer review</h3>
                      <p className="muted">
                        Your application has been sent. The employer makes the
                        decision from their own workspace.
                      </p>
                    </>
                  )}
                </div>

                {acceptedPlacement ? (
                  <Link className="btn" href="/employee/tasks">
                    Open intern tasks
                  </Link>
                ) : (
                  <Link className="btn secondary" href="/applicant/opportunities">
                    Browse more roles
                  </Link>
                )}
                </WorkSurface>

                <WorkSurface className="application-side-card">
                <p className="eyebrow">Application record</p>
                <h3>Proof stays visible</h3>
                <p className="muted">
                  Each application keeps the role, company, method, submission
                  date, proof item, and current employer decision together.
                </p>
                </WorkSurface>

                <WorkSurface className="application-side-card">
                <p className="eyebrow">Applicant profile</p>
                <h3>{state.applicant.fullName}</h3>
                <p className="muted">{state.applicant.education}</p>
                <p className="muted">{state.applicant.school}</p>

                <div className="row">
                  {state.applicant.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
                </WorkSurface>

              {progress ? (
                <WorkSurface className="application-side-card">
                  <p className="eyebrow">Growth snapshot</p>
                  <h3>{progress.completionRate}% complete</h3>
                  <Progress value={progress.completionRate} />
                  <p className="muted">
                    {progress.completed} of {progress.total} tasks completed.
                  </p>
                </WorkSurface>
              ) : null}
            </aside>
          </section>
          </BlueprintEnvironment>
        )}
      </div>
    </main>
  );
}
