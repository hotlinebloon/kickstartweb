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
import { Badge, Progress, StatCard } from "@/components/ui";

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

function getTimelineDot(status: GrowthTask["status"]) {
  if (status === "completed") return "done";
  if (status === "needs_review" || status === "working_on_it") return "active";
  return "";
}

export default function EmployeeProgressPage() {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const placement = useMemo(() => state?.placements[0] ?? null, [state]);

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

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const reviewedTasks = tasks.filter((task) => task.rating || task.feedbackComment);
  const bestWork = completedTasks[0] ?? reviewedTasks[0] ?? tasks[0] ?? null;

  if (!state) {
    return (
      <main className="page">
        <div className="container">Loading...</div>
      </main>
    );
  }

  if (!placement || !application || !progress) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Step 11 · Progress profile</p>
            <h1>No progress profile yet</h1>
            <p className="lead">
              The progress profile unlocks after the employer accepts the
              applicant and creates a placement.
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
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Step 11 · Proof of growth</p>
            <h1>Progress profile</h1>
            <p className="lead">
              This page turns early work into visible proof: completed tasks,
              feedback, ratings, submissions, and growth signals.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/employee/tasks">
              Intern task board
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
                      <p className="eyebrow">Accepted intern</p>
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
              <div className="between">
                <div>
                  <p className="eyebrow">Task status</p>
                  <h2>Growth dashboard summary</h2>
                </div>

                <Badge tone="accent">{progress.total} total tasks</Badge>
              </div>

              <div className="grid grid-4">
                <StatCard
                  title="Not started"
                  description="Assigned"
                  value={progress.notStarted}
                />
                <StatCard
                  title="Working"
                  description="In progress"
                  value={progress.working}
                />
                <StatCard
                  title="Review"
                  description="Needs employer"
                  value={progress.review}
                />
                <StatCard
                  title="Completed"
                  description="Approved"
                  value={progress.completed}
                />
              </div>
            </section>

            <section className="card stack">
              <div>
                <p className="eyebrow">Proof of work</p>
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
                      <p className="muted" style={{ wordBreak: "break-all" }}>
                        <strong>Proof:</strong> {task.submissionLink}
                      </p>
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
                <p className="eyebrow">Growth timeline</p>
                <h2>From accepted to proving work</h2>
              </div>

              <div className="timeline">
                {tasks.map((task, index) => (
                  <div key={task.id} className="timeline-item">
                    <div className={`timeline-dot ${getTimelineDot(task.status)}`}>
                      {index + 1}
                    </div>

                    <div className="timeline-content stack-sm">
                      <div className="between">
                        <h3>{task.title}</h3>
                        <Badge tone={getTaskTone(task.status)}>
                          {getTaskStatusLabel(task.status)}
                        </Badge>
                      </div>

                      <p className="muted">
                        Due {formatDate(task.dueDate)} ·{" "}
                        {getPriorityLabel(task.priority)}
                      </p>

                      {task.latestUpdate ? (
                        <p>
                          <strong>Latest update:</strong> {task.latestUpdate}
                        </p>
                      ) : (
                        <p className="muted">No update submitted yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card stack">
              <div>
                <p className="eyebrow">Recent feedback</p>
                <h2>What the employer has said</h2>
              </div>

              <div className="feedback-list">
                {reviewedTasks.length === 0 ? (
                  <div className="notice">
                    No employer feedback yet. Submit a task to Needs Review,
                    then mark it Completed from the employer page.
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

          <aside className="profile-side">
            <section className="profile-side-card">
              <p className="eyebrow">Intern profile</p>
              <h3>{applicant.fullName}</h3>
              <p className="muted">{applicant.education}</p>
              <p className="muted">{applicant.school}</p>

              <div className="skills-cloud">
                {applicant.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </section>

            <section className="profile-side-card">
              <p className="eyebrow">Placement</p>
              <h3>{placement.roleTitle}</h3>
              <p className="muted">
                Started {formatDate(placement.startDate)}
              </p>
              <p className="muted">Manager: {placement.managerName}</p>

              <Badge tone="success">{placement.status}</Badge>
            </section>

            <section className="profile-side-card">
              <p className="eyebrow">Best submitted work</p>

              {bestWork ? (
                <>
                  <h3>{bestWork.title}</h3>
                  <p className="muted">{bestWork.description}</p>

                  {bestWork.submissionLink ? (
                    <p className="muted" style={{ wordBreak: "break-all" }}>
                      {bestWork.submissionLink}
                    </p>
                  ) : (
                    <p className="muted">No proof link submitted yet.</p>
                  )}

                  <Badge tone={getTaskTone(bestWork.status)}>
                    {getTaskStatusLabel(bestWork.status)}
                  </Badge>
                </>
              ) : (
                <p className="muted">No work available yet.</p>
              )}
            </section>

            <section className="profile-side-card">
              <p className="eyebrow">Why this matters</p>
              <h3>Proof beyond a CV</h3>
              <p className="muted">
                This is the final Kickstart promise: the intern leaves with
                visible progress, not just a line that says they were accepted.
              </p>
            </section>

            <section className="profile-side-card">
              <p className="eyebrow">Intern workspace</p>

              <Link className="btn" href="/employee/tasks">
                Continue task flow
              </Link>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
