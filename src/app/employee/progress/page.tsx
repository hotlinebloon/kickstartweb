"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getPriorityLabel,
  getProgress,
  getState,
  getTaskStatusLabel,
  type DemoState,
  type GrowthTask,
} from "@/lib/demo-store";
import { Badge, LoadingState, Progress } from "@/components/ui";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTaskTone(status: GrowthTask["status"]) {
  if (status === "completed") return "success";
  if (status === "needs_review") return "warning";
  if (status === "working_on_it") return "accent";
  return "default";
}

export default function EmployeeProgressPage() {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const placement = useMemo(
    () =>
      state?.placements.find(
        (item) => item.applicantId === state.applicant.id
      ) ?? null,
    [state]
  );

  const application = useMemo(() => {
    if (!state || !placement) return null;

    return (
      state.applications.find((item) => item.id === placement.applicationId) ??
      null
    );
  }, [state, placement]);

  const tasks = useMemo(() => {
    if (!state || !placement) return [];

    return state.tasks.filter((task) => task.placementId === placement.id);
  }, [state, placement]);

  const progress = useMemo(() => {
    if (!state || !placement) return null;

    return getProgress(placement.id, state);
  }, [state, placement]);

  const reviewedTasks = tasks.filter((task) => task.rating || task.feedbackComment);

  if (!state) {
    return (
      <main className="page">
        <div className="container"><LoadingState label="Loading development record" /></div>
      </main>
    );
  }

  if (!placement || !application || !progress) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Development record</p>
            <h1>No development record yet</h1>
            <p className="lead">
              Your development record begins after an employer accepts your
              application and creates a placement.
            </p>
          </section>

          <section className="card row">
            <Link className="btn" href="/applicant/opportunities">
              Browse opportunities
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const applicant = application.applicantSnapshot;

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Development record</p>
            <h1>Track the work and feedback from this placement.</h1>
            <p className="lead">
              Completed tasks, employer feedback, and ratings show what you
              contributed and where you improved.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/employee/tasks">
              Placement tasks
            </Link>
          </div>
        </section>

        <section className="profile-layout">
          <div className="stack-lg">
            <section className="profile-hero">
              <div className="profile-top">
                <div className="stack">
                  <div className="row">
                    <div className="profile-avatar">
                      {getInitials(applicant.fullName)}
                    </div>

                    <div>
                      <p className="meta-label">Accepted intern</p>
                      <h2>{applicant.fullName}</h2>
                      <p className="muted">
                        {placement.roleTitle} · {state.company.name}
                      </p>
                    </div>
                  </div>

                  <p className="muted">{applicant.bio}</p>
                </div>

                <Badge tone="success">Placement active</Badge>
              </div>

              <Progress value={progress.completionRate} />

              <div className="profile-metrics">
                <div className="profile-metric">
                  <strong>{progress.completionRate}%</strong>
                  <p className="muted">Completion rate</p>
                </div>

                <div className="profile-metric">
                  <strong>{progress.completed}</strong>
                  <p className="muted">Completed tasks</p>
                </div>

                <div className="profile-metric">
                  <strong>{progress.averageRating ?? "—"}</strong>
                  <p className="muted">Average rating</p>
                </div>

                <div className="profile-metric">
                  <strong>{reviewedTasks.length}</strong>
                  <p className="muted">Feedback items</p>
                </div>
              </div>
            </section>

            <section className="card stack">
              <div>
                <p className="meta-label">Proof of work</p>
                <h2>Submitted and completed work</h2>
              </div>

              <div className="proof-grid">
                {tasks.map((task) => (
                  <article
                    key={task.id}
                    className={`proof-card ${
                      task.status === "completed" ? "completed" : ""
                    }`}
                  >
                    <div className="between">
                      <h3>{task.title}</h3>
                      <Badge tone={getTaskTone(task.status)}>
                        {getTaskStatusLabel(task.status)}
                      </Badge>
                    </div>

                    <p className="muted">{task.description}</p>

                    <div className="row">
                      <Badge>{getPriorityLabel(task.priority)}</Badge>
                      <Badge>Due {formatDate(task.dueDate)}</Badge>
                      {task.rating ? <Badge tone="success">{task.rating}/5</Badge> : null}
                    </div>

                    {task.submissionLink ? (
                      <a className="text-link" href={task.submissionLink} target="_blank" rel="noreferrer">
                        Open submitted work
                      </a>
                    ) : null}

                    {task.feedbackComment ? (
                      <p>
                        <strong>Feedback:</strong> {task.feedbackComment}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="card stack">
              <div>
                <p className="meta-label">Recent feedback</p>
                <h2>Employer feedback</h2>
              </div>

              <div className="feedback-list">
                {reviewedTasks.length === 0 ? (
                  <div className="notice">
                    No employer feedback yet. Submit work for review to receive
                    feedback and a rating.
                  </div>
                ) : (
                  reviewedTasks.map((task) => (
                    <article key={task.id} className="feedback-card">
                      <div className="between">
                        <h3>{task.title}</h3>
                        {task.rating ? (
                          <Badge tone="success">{task.rating}/5</Badge>
                        ) : null}
                      </div>

                      <p className="muted">
                        {task.feedbackComment ?? "No written feedback."}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>

        </section>
      </div>
    </main>
  );
}
