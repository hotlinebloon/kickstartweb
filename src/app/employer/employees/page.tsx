"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  generateWeeklyReviews,
  getProgress,
  getState,
  getTaskStatusLabel,
  saveState,
  updateTask,
  type DemoState,
  type GrowthTask,
  type Placement,
  type WeeklyReview,
} from "@/lib/demo-store";
import {
  ProductEnvironment,
  EmptyState,
  LoadingState,
  Progress,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";

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

function getReviewTone(health: WeeklyReview["health"]) {
  if (health === "on_track") return "success";
  if (health === "needs_attention") return "warning";
  return "danger";
}

function getReviewLabel(health: WeeklyReview["health"]) {
  if (health === "on_track") return "On track";
  if (health === "needs_attention") return "Needs attention";
  return "At risk";
}

export default function EmployerEmployeesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [selectedPlacementId, setSelectedPlacementId] = useState("");
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});
  const [actionNotice, setActionNotice] = useState<{ text: string; undoState: DemoState } | null>(null);

  useEffect(() => {
    const current = getState();
    const missingReview = current.placements.some(
      (placement) =>
        !(current.weeklyReviews ?? []).some(
          (review) => review.placementId === placement.id
        )
    );

    setState(missingReview ? generateWeeklyReviews() : current);
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
      const weeklyReview =
        (state.weeklyReviews ?? []).find(
          (review) => review.placementId === placement.id
        ) ?? null;

      return {
        placement,
        application,
        opportunity,
        tasks,
        progress,
        reviewTasks,
        overdueTasks,
        weeklyReview,
        lastActivity: getLastActivity(tasks, placement),
      };
    }).sort((a, b) => Number(Boolean(b.weeklyReview?.ownerAction)) - Number(Boolean(a.weeklyReview?.ownerAction)));
  }, [state]);

  const activeIntern =
    interns.find((intern) => intern.placement.id === selectedPlacementId) ??
    interns.find((intern) => intern.weeklyReview?.ownerAction) ??
    interns[0] ??
    null;
  const submittedWork = activeIntern?.reviewTasks ?? [];

  function approveTask(taskId: string) {
    const comment = feedback[taskId]?.trim() ?? "";
    const rating = Number(ratings[taskId]);
    if (!comment || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      setFeedbackErrors((current) => ({
        ...current,
        [taskId]: "Add written feedback and a rating from 1 to 5 before approving this task.",
      }));
      return;
    }
    const undoState = state;
    if (!undoState) return;
    const next = updateTask({
      taskId,
      status: "completed",
      feedbackComment: comment,
      rating,
    });

    setState(next);
    setActionNotice({ text: "Task approved. It now counts toward the intern’s development record.", undoState });
    setFeedbackErrors((current) => ({ ...current, [taskId]: "" }));
  }

  function requestRevision(taskId: string) {
    const comment = feedback[taskId]?.trim() ?? "";
    if (!comment) {
      setFeedbackErrors((current) => ({
        ...current,
        [taskId]: "Explain what the intern needs to revise before returning this task.",
      }));
      return;
    }
    const undoState = state;
    if (!undoState) return;
    const next = updateTask({
      taskId,
      status: "working_on_it",
      feedbackComment: comment,
    });

    setState(next);
    setActionNotice({ text: "Task returned for revision. The intern can update and resubmit it.", undoState });
    setFeedbackErrors((current) => ({ ...current, [taskId]: "" }));
  }

  function generateReviews() {
    setState(generateWeeklyReviews());
  }

  function undoTaskAction() {
    if (!actionNotice) return;
    saveState(actionNotice.undoState);
    setState(actionNotice.undoState);
    setActionNotice(null);
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading active interns" />
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
              <p className="eyebrow">Intern development</p>
              <h1>No active interns yet</h1>
              <p className="lead">
                Accepted interns, submitted work, feedback, and development
                signals will appear here after an applicant is accepted.
              </p>
            </div>

          </section>

          <EmptyState
            title="No accepted interns yet"
            description="Accept an applicant to create a placement and begin reviewing their work."
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
            <p className="eyebrow">Intern development</p>
            <h1>Intern attention queue</h1>
            <p className="lead">
              Review submitted work first, then check interns who need support
              or a clearer next step.
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

        {actionNotice ? (
          <div className="notice notice-actions" role="status">
            <span>{actionNotice.text}</span>
            <button className="btn secondary" type="button" onClick={undoTaskAction}>
              Undo last action
            </button>
          </div>
        ) : null}

        <section className="attention-summary" aria-label="Intern attention summary">
          <div>
            <strong>{submittedWork.length}</strong>
            <span>Tasks waiting for review</span>
          </div>
          <div>
            <strong>{interns.filter((intern) => intern.overdueTasks.length > 0).length}</strong>
            <span>Interns with overdue work</span>
          </div>
          <div>
            <strong>{interns.filter((intern) => intern.weeklyReview?.ownerAction).length}</strong>
            <span>Mentor actions suggested</span>
          </div>
        </section>

        <details className="weekly-review-disclosure">
          <summary>View weekly development summaries</summary>
        <section className="weekly-review-section stack">
          <div className="between">
            <div>
              <p className="meta-label">Mentorship summary</p>
              <h2>Weekly development summaries</h2>
              <p className="muted">
                Kickstart turns task activity, deadlines, submissions, ratings,
                and feedback into one review per intern.
              </p>
            </div>

            <StatusBadge
              tone={
                interns.some((intern) => intern.weeklyReview?.ownerAction)
                  ? "warning"
                  : "success"
              }
            >
              {interns.filter((intern) => intern.weeklyReview?.ownerAction).length}{" "}
              mentor actions
            </StatusBadge>
          </div>

          {interns.some((intern) => intern.weeklyReview) ? (
            <div className="weekly-review-grid">
              {interns.map((intern) => {
                const review = intern.weeklyReview;
                if (!review) return null;

                return (
                  <article key={review.id} className="weekly-review-card">
                    <div className="between">
                      <div>
                        <p className="meta-label">
                          {intern.application?.applicantSnapshot.fullName ??
                            "Accepted intern"}{" "}
                          · {intern.placement.roleTitle}
                        </p>
                        <h3>{review.headline}</h3>
                      </div>

                      <StatusBadge tone={getReviewTone(review.health)}>
                        {getReviewLabel(review.health)}
                      </StatusBadge>
                    </div>

                    <p className="muted">{review.summary}</p>

                    <div className="weekly-review-columns">
                      <div className="stack-sm">
                        <strong>What went well</strong>
                        {review.wins.map((item) => (
                          <p key={item} className="muted">
                            {item}
                          </p>
                        ))}
                      </div>

                      <div className="stack-sm">
                        <strong>Needs work</strong>
                        {review.needsWork.map((item) => (
                          <p key={item} className="muted">
                            {item}
                          </p>
                        ))}
                      </div>

                      <div className="stack-sm">
                        <strong>Next focus</strong>
                        {review.nextFocus.map((item) => (
                          <p key={item} className="muted">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`owner-action ${
                        review.ownerAction ? "needs-action" : ""
                      }`}
                    >
                      <strong>
                        {review.ownerAction
                          ? "Mentor action needed"
                          : "No mentor action needed"}
                      </strong>
                      <span>
                        {review.ownerAction ??
                          "No mentor action is suggested before the next review."}
                      </span>
                    </div>

                    <p className="help-text">
                      Generated {formatDate(review.generatedAt)} from{" "}
                      {review.evidence.tasksUpdated} task updates,{" "}
                      {review.evidence.tasksCompleted} completions, and{" "}
                      {review.evidence.tasksWaitingReview} submissions waiting for
                      review.
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="state-surface">
              <h3>No development summary generated yet</h3>
              <p className="muted">
                Generate summaries to get a concise review of every active
                intern and only the actions that need owner attention.
              </p>
              <div className="row">
                <button className="btn" type="button" onClick={generateReviews}>
                  Generate development summaries
                </button>
              </div>
            </div>
          )}
        </section>
        </details>

        <ProductEnvironment>
          <section className="employer-monitor-layout">
            <div className="stack-lg">
              <WorkSurface className="monitor-table-surface">
                <div className="between">
                  <div>
                    <p className="meta-label">Accepted interns</p>
                    <h2>Active intern list</h2>
                  </div>

                  <StatusBadge tone="info">{interns.length} active</StatusBadge>
                </div>

                <div className="intern-table" aria-label="Accepted interns">
                  <div className="intern-table-row intern-table-head" aria-hidden="true">
                    <span>Intern</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Progress</span>
                    <span>Needs review</span>
                    <span>Overdue</span>
                    <span>Last activity</span>
                  </div>

                  {interns.map((intern) => (
                    <button
                      key={intern.placement.id}
                      className={`intern-table-row intern-select-row ${
                        activeIntern?.placement.id === intern.placement.id ? "active" : ""
                      }`}
                      type="button"
                      aria-pressed={activeIntern?.placement.id === intern.placement.id}
                      aria-label={`Open ${intern.application?.applicantSnapshot.fullName ?? "accepted intern"}, ${intern.placement.roleTitle}, ${intern.progress.completionRate}% complete`}
                      onClick={() => setSelectedPlacementId(intern.placement.id)}
                    >
                      <strong>
                        {intern.application?.applicantSnapshot.fullName ??
                          "Accepted intern"}
                      </strong>
                      <span>
                        {intern.opportunity?.title ?? intern.placement.roleTitle}
                      </span>
                      <span>
                        <StatusBadge tone="success">Active</StatusBadge>
                      </span>
                      <span>
                        {intern.progress.completionRate}% complete
                      </span>
                      <span>{intern.reviewTasks.length}</span>
                      <span>{intern.overdueTasks.length}</span>
                      <span>{formatDate(intern.lastActivity)}</span>
                    </button>
                  ))}
                </div>
              </WorkSurface>

              {activeIntern ? (
                <>
                  <WorkSurface className="monitor-profile-surface">
                    <div className="between">
                      <div className="stack-sm">
                        <p className="meta-label">Intern detail</p>
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

                    <div className="metric-strip">
                      <span><strong>{activeIntern.progress.notStarted}</strong> Not started</span>
                      <span><strong>{activeIntern.progress.working}</strong> Working</span>
                      <span><strong>{activeIntern.progress.review}</strong> Needs review</span>
                      <span><strong>{activeIntern.progress.completed}</strong> Completed</span>
                    </div>
                  </WorkSurface>

                  <WorkSurface id="submitted-work" className="monitor-review-surface">
                    <div className="between">
                      <div>
                        <p className="meta-label">Submitted work</p>
                        <h2>Submitted tasks to review</h2>
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
                          This intern has no submitted tasks waiting for review.
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
                              <a className="text-link" href={task.submissionLink} target="_blank" rel="noreferrer">
                                Open submitted work
                              </a>
                            ) : null}

                            <div className="feedback-grid">
                              <label>
                                Feedback comment
                                <textarea
                                  id={`feedback-${task.id}`}
                                  className="textarea"
                                  aria-invalid={Boolean(feedbackErrors[task.id])}
                                  aria-describedby={
                                    feedbackErrors[task.id] ? `feedback-error-${task.id}` : undefined
                                  }
                                  value={
                                    feedback[task.id] ?? ""
                                  }
                                  onChange={(event) => {
                                    setFeedback((prev) => ({
                                      ...prev,
                                      [task.id]: event.target.value,
                                    }));
                                    setFeedbackErrors((current) => ({ ...current, [task.id]: "" }));
                                  }}
                                />
                              </label>

                              <label>
                                Rating
                                <input
                                  id={`rating-${task.id}`}
                                  className="input"
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  aria-invalid={Boolean(feedbackErrors[task.id])}
                                  aria-describedby={
                                    feedbackErrors[task.id] ? `feedback-error-${task.id}` : undefined
                                  }
                                  value={ratings[task.id] ?? ""}
                                  onChange={(event) => {
                                    setRatings((prev) => ({
                                      ...prev,
                                      [task.id]: event.target.value,
                                    }));
                                    setFeedbackErrors((current) => ({ ...current, [task.id]: "" }));
                                  }}
                                />
                              </label>
                            </div>

                            {feedbackErrors[task.id] ? (
                              <p id={`feedback-error-${task.id}`} className="field-error">
                                {feedbackErrors[task.id]}
                              </p>
                            ) : null}

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
                                Request revision
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

          </section>
        </ProductEnvironment>
      </div>
    </main>
  );
}
