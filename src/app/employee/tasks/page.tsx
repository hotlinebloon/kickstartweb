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
import { Badge, Progress, StatCard } from "@/components/ui";

const columns: {
  id: TaskStatus;
  title: string;
  description: string;
}[] = [
  {
    id: "havent_started",
    title: "Haven’t Started",
    description: "Assigned starter tasks.",
  },
  {
    id: "working_on_it",
    title: "Working On It",
    description: "Tasks currently being worked on.",
  },
  {
    id: "needs_review",
    title: "Needs Review",
    description: "Submitted work waiting for employer review.",
  },
  {
    id: "completed",
    title: "Completed",
    description: "Approved work that counts toward progress.",
  },
];

function nextStatus(status: TaskStatus): TaskStatus | null {
  if (status === "havent_started") return "working_on_it";
  if (status === "working_on_it") return "needs_review";
  return null;
}

function actionLabel(status: TaskStatus) {
  if (status === "havent_started") return "Move to Working On It";
  if (status === "working_on_it") return "Submit to Needs Review";
  return "Locked";
}

export default function EmployeeTasksPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [updates, setUpdates] = useState<Record<string, string>>({});
  const [links, setLinks] = useState<Record<string, string>>({});

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

  function startOrSubmit(task: GrowthTask) {
    const status = nextStatus(task.status);

    if (!status) return;

    const updateText =
      updates[task.id]?.trim() ||
      (status === "working_on_it"
        ? "Started working on this task."
        : "Submitted task for employer review.");

    const next = updateTask({
      taskId: task.id,
      status,
      updateText,
      submissionLink:
        status === "needs_review"
          ? links[task.id]?.trim() || "https://github.com/arta-demo/submission"
          : links[task.id]?.trim() || undefined,
    });

    setState(next);

    setUpdates((prev) => ({
      ...prev,
      [task.id]: "",
    }));

    setLinks((prev) => ({
      ...prev,
      [task.id]: "",
    }));
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">Loading...</div>
      </main>
    );
  }

  if (!placement || !application) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Intern workspace</p>
            <h1>No starter tasks yet</h1>
            <p className="lead">
              The employer must accept an applicant first. That creates the
              placement and unlocks the intern task board.
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
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Intern workspace</p>
            <h1>Intern task board</h1>
            <p className="lead">
              Move starter tasks from assigned work to active progress, then
              submit proof for employer review.
            </p>
          </div>

          <div className="row">
            <Link className="btn secondary" href="/employee/progress">
              Intern progress
            </Link>
          </div>
        </section>

        <section className="growth-summary">
          <div className="growth-hero-card">
            <div className="between">
              <div className="stack-sm">
                <p className="eyebrow">Active placement</p>
                <h2>{placement.roleTitle}</h2>
                <p className="muted">
                  {application.applicantSnapshot.fullName} · {state.company.name} ·
                  started {formatDate(placement.startDate)}
                </p>
              </div>

              <Badge tone="accent">{progress?.completionRate ?? 0}% complete</Badge>
            </div>

            <Progress value={progress?.completionRate ?? 0} />

            <div className="grid grid-4">
              <StatCard
                title="Not started"
                description="Assigned"
                value={progress?.notStarted ?? 0}
              />
              <StatCard
                title="Working"
                description="In progress"
                value={progress?.working ?? 0}
              />
              <StatCard
                title="Review"
                description="Waiting employer"
                value={progress?.review ?? 0}
              />
              <StatCard
                title="Completed"
                description="Approved"
                value={progress?.completed ?? 0}
              />
            </div>
          </div>

          <aside className="side-panel">
            <section className="side-panel-card">
              <p className="eyebrow">How to demo this</p>
              <h3>Move one task through the board</h3>
              <p className="muted">
                Start with a task in Haven’t Started, move it to Working On It,
                then submit it to Needs Review. The employer completes it on the
                review page.
              </p>
            </section>

            <section className="side-panel-card">
              <p className="eyebrow">Why it matters</p>
              <h3>Kickstart continues after hiring</h3>
              <p className="muted">
                The intern does not disappear after being accepted. Their work,
                feedback, and proof become visible progress.
              </p>
            </section>
          </aside>
        </section>

        <section className="growth-board">
          {columns.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);

            return (
              <div key={column.id} className="growth-column">
                <div className="growth-column-header">
                  <div>
                    <h3>{column.title}</h3>
                    <p className="muted" style={{ marginTop: 6 }}>
                      {column.description}
                    </p>
                  </div>

                  <Badge>{columnTasks.length}</Badge>
                </div>

                {columnTasks.length === 0 ? (
                  <div className="empty-column">No tasks here.</div>
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
                          <p className="eyebrow">Due</p>
                          <p>{formatDate(task.dueDate)}</p>
                        </div>

                        <div className="task-meta-box">
                          <p className="eyebrow">Priority</p>
                          <p>{getPriorityLabel(task.priority)}</p>
                        </div>
                      </div>

                      {task.latestUpdate ? (
                        <p>
                          <strong>Update:</strong> {task.latestUpdate}
                        </p>
                      ) : null}

                      {task.submissionLink ? (
                        <p className="muted proof-link">
                          <strong>Submission:</strong> {task.submissionLink}
                        </p>
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
                          <textarea
                            className="textarea"
                            placeholder={
                              task.status === "havent_started"
                                ? "What will you start with?"
                                : "What did you finish or learn?"
                            }
                            value={updates[task.id] ?? ""}
                            onChange={(event) =>
                              setUpdates((prev) => ({
                                ...prev,
                                [task.id]: event.target.value,
                              }))
                            }
                          />

                          <input
                            className="input"
                            placeholder="Proof/submission link"
                            value={links[task.id] ?? ""}
                            onChange={(event) =>
                              setLinks((prev) => ({
                                ...prev,
                                [task.id]: event.target.value,
                              }))
                            }
                          />

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
                        <Badge tone="warning">Waiting for employer review</Badge>
                      ) : null}

                      {task.status === "completed" ? (
                        <Badge tone="success">
                          Counts toward progress profile
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
