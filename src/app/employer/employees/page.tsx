"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getProgress,
  getState,
  getTaskStatusLabel,
  updateTask,
  type DemoState,
  type GrowthTask,
  type Placement,
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

function getTaskTone(status: GrowthTask["status"]) {
  if (status === "completed") return "success";
  if (status === "needs_review") return "warning";
  if (status === "working_on_it") return "info";
  return "neutral";
}

function isOverdue(task: GrowthTask) {
  if (task.status === "completed") return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

function getLastActivity(tasks: GrowthTask[], placement: Placement) {
  const timestamps = tasks.map((task) => task.updatedAt);
  timestamps.push(placement.startDate);
  return timestamps.sort().at(-1) ?? placement.startDate;
}

export default function EmployerEmployeesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, string>>({});

  useEffect(() => {
    setState(getState());
  }, []);

  const interns = useMemo(() => {
    if (!state) return [];

    return state.placements.map((placement) => {
      const application =
        state.applications.find((item) => item.id === placement.applicationId) ??
        null;
      const opportunity =
        state.opportunities.find((item) => item.id === placement.opportunityId) ??
        null;
      const tasks = state.tasks.filter((task) => task.placementId === placement.id);
      const progress = getProgress(placement.id, state);
      const reviewTasks = tasks.filter((task) => task.status === "needs_review");
      const overdueTasks = tasks.filter(isOverdue);

      return {
        placement,
        application,
        opportunity,
        tasks,
        progress,
        reviewTasks,
        overdueTasks,
        lastActivity: getLastActivity(tasks, placement),
      };
    });
  }, [state]);

  const activeIntern = interns[0] ?? null;
  const submittedWork = activeIntern?.reviewTasks ?? [];
  const reviewedTasks =
    activeIntern?.tasks.filter((task) => task.feedbackComment || task.rating) ?? [];

  function approveTask(taskId: string) {
    const rating = Number(ratings[taskId] ?? "5");
    const next = updateTask({
      taskId,
      status: "completed",
      feedbackComment: feedback[taskId]?.trim() || "Approved. Good work.",
      rating: Number.isFinite(rating) ? rating : 5,
    });

    setState(next);
  }

  function requestRevision(taskId: string) {
    const next = updateTask({
      taskId,
      status: "working_on_it",
      feedbackComment:
        feedback[taskId]?.trim() ||
        "Needs revision. Please improve and submit again.",
    });

    setState(next);
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading intern monitoring" />
        </div>
      </main>
    );
  }

  if (interns.length === 0) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="page-header between">
            <div className="stack">
              <p className="eyebrow">Employer workspace</p>
              <h1>Intern monitoring</h1>
              <p className="lead">
                Accepted interns, submitted work, feedback, and progress will
                appear here after an applicant is accepted.
              </p>
            </div>

            <Link className="btn secondary" href="/employer/applicants">
              Review applicants
            </Link>
          </section>

          <EmptyState
            title="No accepted interns yet"
            description="Accept an applicant from the employer review queue before monitoring intern work."
            action={
              <Link className="btn" href="/employer/applicants">
                Review applicants
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Employer workspace</p>
            <h1>Intern monitoring</h1>
            <p className="lead">
              Monitor active interns, see what needs review, and respond to
              submitted work with feedback.
            </p>
          </div>

          <div className="row">
            {submittedWork.length > 0 ? (
              <a className="btn" href="#submitted-work">
                Review submitted work
              </a>
            ) : null}

            <Link className="btn secondary" href="/employer/applicants">
              Back to applicants
            </Link>
          </div>
        </section>

        <BlueprintEnvironment>
          <section className="employer-monitor-layout">
            <div className="stack-lg">
              <WorkSurface className="monitor-table-surface">
                <div className="between">
                  <div>
                    <p className="eyebrow">Accepted interns</p>
                    <h2>Active intern list</h2>
                  </div>

                  <StatusBadge tone="info">{interns.length} active</StatusBadge>
                </div>

                <div className="intern-table" role="table" aria-label="Accepted interns">
                  <div className="intern-table-row intern-table-head" role="row">
                    <span role="columnheader">Intern</span>
                    <span role="columnheader">Role</span>
                    <span role="columnheader">Status</span>
                    <span role="columnheader">Progress</span>
                    <span role="columnheader">Needs review</span>
                    <span role="columnheader">Overdue</span>
                    <span role="columnheader">Last activity</span>
                  </div>

                  {interns.map((intern) => (
                    <div
                      key={intern.placement.id}
                      className="intern-table-row"
                      role="row"
                    >
                      <strong role="cell">
                        {intern.application?.applicantSnapshot.fullName ??
                          "Accepted intern"}
                      </strong>
                      <span role="cell">
                        {intern.opportunity?.title ?? intern.placement.roleTitle}
                      </span>
                      <span role="cell">
                        <StatusBadge tone="success">Active</StatusBadge>
                      </span>
                      <span role="cell">
                        {intern.progress.completionRate}% complete
                      </span>
                      <span role="cell">{intern.reviewTasks.length}</span>
                      <span role="cell">{intern.overdueTasks.length}</span>
                      <span role="cell">{formatDate(intern.lastActivity)}</span>
                    </div>
                  ))}
                </div>
              </WorkSurface>

              {activeIntern ? (
                <>
                  <WorkSurface className="monitor-profile-surface">
                    <div className="between">
                      <div className="stack-sm">
                        <p className="eyebrow">Intern detail</p>
                        <h2>
                          {activeIntern.application?.applicantSnapshot.fullName ??
                            "Accepted intern"}
                        </h2>
                        <p className="muted">
                          {activeIntern.placement.roleTitle} · started{" "}
                          {formatDate(activeIntern.placement.startDate)}
                        </p>
                      </div>

                      <StatusBadge tone="success">Placement active</StatusBadge>
                    </div>

                    <Progress value={activeIntern.progress.completionRate} />

                    <div className="grid grid-4">
                      <StatCard
                        title="Haven't started"
                        description="Assigned tasks"
                        value={activeIntern.progress.notStarted}
                      />
                      <StatCard
                        title="Working"
                        description="In progress"
                        value={activeIntern.progress.working}
                      />
                      <StatCard
                        title="Needs review"
                        description="Employer action"
                        value={activeIntern.progress.review}
                      />
                      <StatCard
                        title="Completed"
                        description="Approved work"
                        value={activeIntern.progress.completed}
                      />
                    </div>
                  </WorkSurface>

                  <WorkSurface id="submitted-work" className="monitor-review-surface">
                    <div className="between">
                      <div>
                        <p className="eyebrow">Submitted work</p>
                        <h2>Tasks needing employer review</h2>
                      </div>

                      <StatusBadge
                        tone={submittedWork.length > 0 ? "warning" : "success"}
                      >
                        {submittedWork.length} waiting
                      </StatusBadge>
                    </div>

                    {submittedWork.length === 0 ? (
                      <div className="state-surface">
                        <h3>No tasks needing review</h3>
                        <p className="muted">
                          This intern has no submitted work waiting for employer
                          review right now.
                        </p>
                      </div>
                    ) : (
                      <div className="stack">
                        {submittedWork.map((task) => (
                          <article key={task.id} className="task-review-card">
                            <div className="between">
                              <div>
                                <h3>{task.title}</h3>
                                <p className="muted">{task.description}</p>
                              </div>

                              <StatusBadge tone="warning">
                                {getTaskStatusLabel(task.status)}
                              </StatusBadge>
                            </div>

                            {task.latestUpdate ? (
                              <p>
                                <strong>Intern update:</strong>{" "}
                                {task.latestUpdate}
                              </p>
                            ) : null}

                            {task.submissionLink ? (
                              <p className="muted proof-link">
                                <strong>Submission:</strong>{" "}
                                {task.submissionLink}
                              </p>
                            ) : null}

                            <div className="feedback-grid">
                              <label>
                                Feedback comment
                                <textarea
                                  className="textarea"
                                  value={
                                    feedback[task.id] ??
                                    "Good structure. Improve mobile spacing next time."
                                  }
                                  onChange={(event) =>
                                    setFeedback((prev) => ({
                                      ...prev,
                                      [task.id]: event.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <label>
                                Rating
                                <input
                                  className="input"
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  value={ratings[task.id] ?? "4.5"}
                                  onChange={(event) =>
                                    setRatings((prev) => ({
                                      ...prev,
                                      [task.id]: event.target.value,
                                    }))
                                  }
                                />
                              </label>
                            </div>

                            <div className="row">
                              <button
                                className="btn"
                                type="button"
                                onClick={() => approveTask(task.id)}
                              >
                                Approve task
                              </button>
                              <button
                                className="btn secondary"
                                type="button"
                                onClick={() => requestRevision(task.id)}
                              >
                                Needs revision
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </WorkSurface>
                </>
              ) : null}
            </div>

            <aside className="monitor-side">
              <WorkSurface>
                <p className="eyebrow">Attention next</p>
                <h3>
                  {submittedWork.length > 0
                    ? `${submittedWork.length} task${
                        submittedWork.length === 1 ? "" : "s"
                      } waiting for review`
                    : "No review queue right now"}
                </h3>
                <p className="muted">
                  Approve submitted work when it meets expectations, or request
                  revision with a clear feedback comment.
                </p>
              </WorkSurface>

              <WorkSurface>
                <p className="eyebrow">All placement tasks</p>
                <div className="stack-sm">
                  {activeIntern?.tasks.map((task) => (
                    <div key={task.id} className="monitor-task-row">
                      <div>
                        <strong>{task.title}</strong>
                        <p className="muted">Due {formatDate(task.dueDate)}</p>
                      </div>

                      <StatusBadge tone={getTaskTone(task.status)}>
                        {getTaskStatusLabel(task.status)}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </WorkSurface>

              <WorkSurface>
                <p className="eyebrow">Feedback history</p>
                {reviewedTasks.length === 0 ? (
                  <p className="muted">No feedback has been sent yet.</p>
                ) : (
                  <div className="stack-sm">
                    {reviewedTasks.map((task) => (
                      <div key={task.id} className="monitor-task-row">
                        <div>
                          <strong>{task.title}</strong>
                          <p className="muted">
                            {task.feedbackComment ?? "No written feedback."}
                          </p>
                        </div>
                        {task.rating ? (
                          <Badge tone="success">{task.rating}/5</Badge>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </WorkSurface>
            </aside>
          </section>
        </BlueprintEnvironment>
      </div>
    </main>
  );
}
