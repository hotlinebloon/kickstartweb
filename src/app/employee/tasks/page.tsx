"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getPriorityLabel,
  getProgress,
  getState,
  getTaskStatusLabel,
  updateTask,
  type DemoState,
  type GrowthTask,
  type TaskStatus,
} from "@/lib/demo-store";
import { Badge, Progress } from "@/components/ui";

const columns: { id: TaskStatus; title: string; description: string }[] = [
  { id: "havent_started", title: "Haven’t Started", description: "Assigned but not started." },
  { id: "working_on_it", title: "Working On It", description: "Employee is working." },
  { id: "needs_review", title: "Needs Review", description: "Submitted to employer." },
  { id: "completed", title: "Completed", description: "Approved by employer." },
];

function nextStatus(status: TaskStatus): TaskStatus | null {
  if (status === "havent_started") return "working_on_it";
  if (status === "working_on_it") return "needs_review";
  return null;
}

export default function EmployeeTasksPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [updates, setUpdates] = useState<Record<string, string>>({});
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    setState(getState());
  }, []);

  const placement = useMemo(() => state?.placements[0] ?? null, [state]);
  const tasks = useMemo(() => (state && placement ? state.tasks.filter((task) => task.placementId === placement.id) : []), [state, placement]);
  const progress = useMemo(() => (state && placement ? getProgress(placement.id, state) : null), [state, placement]);

  function startOrSubmit(task: GrowthTask) {
    const status = nextStatus(task.status);
    if (!status) return;

    const updateText = updates[task.id]?.trim() || (status === "working_on_it" ? "Started working on this task." : "Submitted task for employer review.");

    const next = updateTask({
      taskId: task.id,
      status,
      updateText,
      submissionLink: links[task.id]?.trim() || undefined,
    });

    setState(next);
    setUpdates((prev) => ({ ...prev, [task.id]: "" }));
  }

  if (!state) return <main className="page"><div className="container">Loading...</div></main>;

  if (!placement) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Steps 8–9</p>
            <h1>No starter tasks yet</h1>
            <p className="lead">The employer must accept an applicant first. That creates the placement and starter tasks.</p>
          </section>
          <div className="card row">
            <Link className="btn" href="/applicant/opportunities">Submit Focused Apply</Link>
            <Link className="btn secondary" href="/employer/applicants">Accept applicant</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Steps 8–9</p>
            <h1>Employee task board</h1>
            <p className="lead">Start a task, add a progress update, and submit it to Needs Review. The employer completes it later.</p>
          </div>
          <Link className="btn secondary" href="/employer/employees">Employer review</Link>
        </section>

        <div className="card stack">
          <div className="between">
            <div>
              <h3>{placement.roleTitle}</h3>
              <p className="muted">Placement started {formatDate(placement.startDate)}</p>
            </div>
            <Badge tone="accent">{progress?.completionRate ?? 0}% complete</Badge>
          </div>
          <Progress value={progress?.completionRate ?? 0} />
          <div className="row">
            <Badge>Not started: {progress?.notStarted ?? 0}</Badge>
            <Badge>Working: {progress?.working ?? 0}</Badge>
            <Badge>Review: {progress?.review ?? 0}</Badge>
            <Badge>Completed: {progress?.completed ?? 0}</Badge>
          </div>
        </div>

        <section className="grid grid-4">
          {columns.map((column) => (
            <div key={column.id} className="card stack" style={{ alignSelf: "start" }}>
              <div>
                <div className="between">
                  <h3>{column.title}</h3>
                  <Badge>{tasks.filter((task) => task.status === column.id).length}</Badge>
                </div>
                <p className="muted" style={{ marginTop: 6 }}>{column.description}</p>
              </div>

              {tasks.filter((task) => task.status === column.id).length === 0 ? (
                <div className="notice muted">No tasks here.</div>
              ) : (
                tasks.filter((task) => task.status === column.id).map((task) => (
                  <div key={task.id} className="notice stack">
                    <div className="between">
                      <strong>{task.title}</strong>
                      <Badge>{getPriorityLabel(task.priority)}</Badge>
                    </div>
                    <p className="muted">{task.description}</p>
                    <p className="muted">Due {formatDate(task.dueDate)}</p>
                    {task.latestUpdate ? <p><strong>Update:</strong> {task.latestUpdate}</p> : null}
                    {task.submissionLink ? <p className="muted" style={{ wordBreak: "break-all" }}><strong>Submission:</strong> {task.submissionLink}</p> : null}
                    {task.feedbackComment ? <p><strong>Employer feedback:</strong> {task.feedbackComment}</p> : null}
                    {task.status !== "completed" && task.status !== "needs_review" ? (
                      <>
                        <textarea
                          className="textarea"
                          placeholder="Write progress update..."
                          value={updates[task.id] ?? ""}
                          onChange={(event) => setUpdates((prev) => ({ ...prev, [task.id]: event.target.value }))}
                        />
                        <input
                          className="input"
                          placeholder="Proof/submission link"
                          value={links[task.id] ?? ""}
                          onChange={(event) => setLinks((prev) => ({ ...prev, [task.id]: event.target.value }))}
                        />
                        <button className="btn" onClick={() => startOrSubmit(task)}>
                          {task.status === "havent_started" ? "Move to Working On It" : "Submit to Needs Review"}
                        </button>
                      </>
                    ) : null}
                    {task.status === "needs_review" ? <Badge tone="warning">Waiting for employer review</Badge> : null}
                    {task.status === "completed" ? <Badge tone="success">Counts toward progress profile</Badge> : null}
                  </div>
                ))
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
