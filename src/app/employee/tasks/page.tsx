"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getPriorityLabel,
  getProgress,
  getState,
  updateTask,
  type DemoState,
  type GrowthTask,
  type TaskStatus,
} from "@/lib/demo-store";
import { Badge, LoadingState, Progress } from "@/components/ui";

const columns: {
  id: TaskStatus;
  title: string;
  description: string;
}[] = [
  {
    id: "havent_started",
    title: "Assigned",
    description: "Tasks ready for you to start.",
  },
  {
    id: "working_on_it",
    title: "In progress",
    description: "Tasks you are actively working on.",
  },
  {
    id: "needs_review",
    title: "Submitted",
    description: "Work waiting for employer review.",
  },
  {
    id: "completed",
    title: "Completed",
    description: "Approved work in your development record.",
  },
];

function nextStatus(status: TaskStatus): TaskStatus | null {
  if (status === "havent_started") return "working_on_it";
  if (status === "working_on_it") return "needs_review";
  return null;
}

function actionLabel(status: TaskStatus) {
  if (status === "havent_started") return "Start task";
  if (status === "working_on_it") return "Submit work for review";
  return "No action available";
}

export default function EmployeeTasksPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [updates, setUpdates] = useState<Record<string, string>>({});
  const [links, setLinks] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

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

  function startOrSubmit(task: GrowthTask) {
    const status = nextStatus(task.status);

    if (!status) return;

    const updateText = updates[task.id]?.trim() ?? "";
    const submissionLink = links[task.id]?.trim() ?? "";
    if (!updateText) {
      setErrors((current) => ({ ...current, [task.id]: "Add a progress update before changing this task’s status." }));
      return;
    }
    if (status === "needs_review") {
      try {
        const url = new URL(submissionLink);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        setErrors((current) => ({ ...current, [task.id]: "Add a complete work link starting with https:// or http:// before submitting." }));
        return;
      }
    }

    const next = updateTask({
      taskId: task.id,
      status,
      updateText,
      submissionLink:
        status === "needs_review"
          ? submissionLink
          : submissionLink || undefined,
    });

    setState(next);
    setNotice(status === "working_on_it" ? "Task started. Add updates here as your work progresses." : "Work submitted. The employer can now review it.");
    setErrors((current) => ({ ...current, [task.id]: "" }));

    setUpdates((prev) => ({
      ...prev,
      [task.id]: "",
    }));

    setLinks((prev) => ({
      ...prev,
      [task.id]: "",
    }));
  }

  function retractSubmission(task: GrowthTask) {
    setState(updateTask({
      taskId: task.id,
      status: "working_on_it",
      updateText: "Submission withdrawn for editing.",
    }));
    setNotice("Submission withdrawn. You can edit the work and submit it again.");
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container"><LoadingState label="Loading placement tasks" /></div>
      </main>
    );
  }

  if (!placement || !application) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Intern workspace</p>
            <h1>No placement tasks yet</h1>
            <p className="lead">
              The employer must accept an applicant first. That creates the
              placement and unlocks the intern workspace.
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

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Intern workspace</p>
            <h1>Placement tasks</h1>
            <p className="lead">
              Start assigned tasks, share progress updates, and submit work for
              employer review.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/employee/progress">
              View development record
            </Link>
          </div>
        </section>

        {notice ? <div className="notice" role="status">{notice}</div> : null}

        <section className="growth-summary">
          <div className="growth-hero-card">
            <div className="between">
              <div className="stack-sm">
                <p className="meta-label">Active placement</p>
                <h2>{placement.roleTitle}</h2>
                <p className="muted">
                  {application.applicantSnapshot.fullName} · {state.company.name} ·
                  started {formatDate(placement.startDate)}
                </p>
              </div>

              <Badge tone="accent">{progress?.completionRate ?? 0}% complete</Badge>
            </div>

            <Progress value={progress?.completionRate ?? 0} />

          </div>
        </section>

        <section className="growth-board">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);

            return (
              <div key={column.id} className="growth-column">
                <div className="growth-column-header">
                  <div>
                    <h3>{column.title}</h3>
                    <p className="section-support-text">
                      {column.description}
                    </p>
                  </div>

                  <Badge>{columnTasks.length}</Badge>
                </div>

                {columnTasks.length === 0 ? (
                  <div className="empty-column">No tasks in this status.</div>
                ) : (
                  columnTasks.map((task) => (
                    <article key={task.id} className="growth-task">
                      <div className="growth-task-title">
                        <strong>{task.title}</strong>
                        <Badge>{getPriorityLabel(task.priority)}</Badge>
                      </div>

                      <p className="muted">{task.description}</p>

                      <div className="task-meta-grid">
                        <div className="task-meta-box">
                          <p className="meta-label">Due</p>
                          <p>{formatDate(task.dueDate)}</p>
                        </div>

                        <div className="task-meta-box">
                          <p className="meta-label">Priority</p>
                          <p>{getPriorityLabel(task.priority)}</p>
                        </div>
                      </div>

                      {task.latestUpdate ? (
                        <p>
                          <strong>Update:</strong> {task.latestUpdate}
                        </p>
                      ) : null}

                      {task.submissionLink ? (
                        <a className="text-link" href={task.submissionLink} target="_blank" rel="noreferrer">
                          Open submitted work
                        </a>
                      ) : null}

                      {task.feedbackComment ? (
                        <p>
                          <strong>Employer feedback:</strong>{" "}
                          {task.feedbackComment}
                        </p>
                      ) : null}

                      {task.status === "havent_started" ||
                      task.status === "working_on_it" ? (
                        <div className="task-action-area">
                          <label>
                            Progress update
                          <textarea
                            id={`task-update-${task.id}`}
                            className="textarea"
                            aria-invalid={Boolean(errors[task.id])}
                            aria-describedby={errors[task.id] ? `task-error-${task.id}` : undefined}
                            placeholder={
                              task.status === "havent_started"
                                ? "What will you start with?"
                                : "What did you finish or learn?"
                            }
                            value={updates[task.id] ?? ""}
                            onChange={(event) => {
                              setUpdates((prev) => ({
                                ...prev,
                                [task.id]: event.target.value,
                              }));
                              setErrors((current) => ({ ...current, [task.id]: "" }));
                            }}
                          />
                          </label>

                          <label>
                            Work link {task.status === "working_on_it" ? <span className="required-label">Required to submit</span> : null}
                          <input
                            id={`task-proof-${task.id}`}
                            className="input"
                            type="url"
                            aria-invalid={Boolean(errors[task.id])}
                            aria-describedby={errors[task.id] ? `task-error-${task.id}` : undefined}
                            placeholder="https://example.com/your-work"
                            value={links[task.id] ?? ""}
                            onChange={(event) => {
                              setLinks((prev) => ({
                                ...prev,
                                [task.id]: event.target.value,
                              }));
                              setErrors((current) => ({ ...current, [task.id]: "" }));
                            }}
                          />
                          </label>

                          {errors[task.id] ? (
                            <p id={`task-error-${task.id}`} className="field-error">
                              {errors[task.id]}
                            </p>
                          ) : null}

                          <button
                            className="btn"
                            type="button"
                            onClick={() => startOrSubmit(task)}
                          >
                            {actionLabel(task.status)}
                          </button>
                        </div>
                      ) : null}

                      {task.status === "needs_review" ? (
                        <div className="row">
                          <Badge tone="warning">Submitted for review</Badge>
                          <button className="btn secondary" type="button" onClick={() => retractSubmission(task)}>
                            Withdraw submission
                          </button>
                        </div>
                      ) : null}

                      {task.status === "completed" ? (
                        <Badge tone="success">
                          Added to development record
                        </Badge>
                      ) : null}
                    </article>
                  ))
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
