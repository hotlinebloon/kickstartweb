"use client";

import { useEffect, useState } from "react";
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
  ProductEnvironment,
  EmptyState,
  LoadingState,
  Progress,
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

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading applications" />
        </div>
      </main>
    );
  }

  const applications = state.applications.filter(
    (application) => application.applicantId === state.applicant.id
  );
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
              Browse opportunities
            </Link>
          </div>
        </section>

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Browse an opportunity and send either a focused application or your saved profile."
            action={
              <Link className="btn" href="/applicant/opportunities">
                Open opportunities
              </Link>
            }
          />
        ) : (
          <ProductEnvironment>
            <section className="applications-layout">
              <div className="stack">
              {applications.map((application) => {
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
                        <p className="meta-label">
                          {application.method === "quick" ? "Profile application" : "Focused application"}
                        </p>
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

                    {application.status === "rejected" ? (
                      <div className="owner-action needs-action">
                        <strong>Application closed</strong>
                        <span>The employer has closed this application and will not continue to the next stage.</span>
                      </div>
                    ) : (
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
                        <p className="muted">Employer reviews application</p>
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
                    )}

                    <section className="application-proof-grid">
                      <div className="application-summary-box stack">
                        <h3>Application contents</h3>
                        <p className="muted">
                          {application.method === "quick"
                            ? "Saved profile and portfolio."
                            : `${application.answers.length} answers, one work-scenario response, and one work sample.`}
                        </p>

                        <div className="row">
                          {application.method === "quick" ? (
                            <>
                              <Badge tone="accent">Saved profile</Badge>
                              <Badge tone="accent">Portfolio</Badge>
                            </>
                          ) : (
                            <>
                              <Badge tone="accent">Questions</Badge>
                              <Badge tone="accent">Scenario</Badge>
                              <Badge tone="accent">Proof</Badge>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="application-summary-box stack">
                        <h3>Submitted work sample</h3>
                        <a className="text-link" href={application.proofUrl} target="_blank" rel="noreferrer">
                          Open submitted work sample
                        </a>
                      </div>
                    </section>

                    {application.method !== "quick" ? (
                      <details className="disclosure">
                        <summary>Review submitted answers</summary>
                        <div className="stack">
                          {application.answers.map((answer) => (
                            <div key={answer.question} className="application-answer">
                              <strong>{answer.question}</strong>
                              <p className="muted">{answer.answer}</p>
                            </div>
                          ))}
                          <div className="application-answer">
                            <strong>Scenario response</strong>
                            <p className="muted">{application.scenarioResponse}</p>
                          </div>
                        </div>
                      </details>
                    ) : null}

                    {application.method !== "quick" && application.status === "submitted" ? (
                      <div className="row">
                        <Link
                          className="btn secondary"
                          href={`/applicant/opportunities/${application.opportunityId}/focused-apply`}
                        >
                          Edit application
                        </Link>
                      </div>
                    ) : null}

                    {placement && placementProgress ? (
                      <section className="placement-banner stack">
                        <div className="between">
                          <div>
                            <h3>Application accepted</h3>
                            <p className="muted">
                              Your placement is active. Open placement tasks to
                              review your assigned work.
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
                            Open placement tasks
                          </Link>

                          <Link className="btn secondary" href="/employee/progress">
                            View development record
                          </Link>
                        </div>
                      </section>
                    ) : null}
                  </WorkSurface>
                );
              })}
              </div>

          </section>
          </ProductEnvironment>
        )}
      </div>
    </main>
  );
}
