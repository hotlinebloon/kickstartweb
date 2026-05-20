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
} from "@/lib/demo-store";
import { Badge, Progress } from "@/components/ui";

export default function EmployerEmployeesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, string>>({});

  useEffect(() => {
    setState(getState());
  }, []);

  const placement = useMemo(() => state?.placements[0] ?? null, [state]);
  const application = useMemo(() => state && placement ? state.applications.find((item) => item.id === placement.applicationId) ?? null : null, [state, placement]);
  const tasks = useMemo(() => state && placement ? state.tasks.filter((task) => task.placementId === placement.id) : [], [state, placement]);
  const progress = useMemo(() => state && placement ? getProgress(placement.id, state) : null, [state, placement]);

  function completeTask(taskId: string) {
    const rating = Number(ratings[taskId] ?? "5");
    const next = updateTask({
      taskId,
      status: "completed",
      feedbackComment: feedback[taskId]?.trim() || "Approved. Good work.",
      rating: Number.isFinite(rating) ? rating : 5,
    });
    setState(next);
  }

  function sendBack(taskId: string) {
    const next = updateTask({
      taskId,
      status: "working_on_it",
      feedbackComment: feedback[taskId]?.trim() || "Needs revision. Please improve and submit again.",
    });
    setState(next);
  }

  if (!state) return <main className="page"><div className="container">Loading...</div></main>;

  if (!placement || !application) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Step 10</p>
            <h1>No employee yet</h1>
            <p className="lead">Accept an applicant first. Then this page will show their submitted tasks for review.</p>
          </section>
          <div className="card row">
            <Link className="btn" href="/employer/applicants">Review applicants</Link>
            <Link className="btn secondary" href="/applicant/opportunities">Submit application first</Link>
          </div>
        </div>
      </main>
    );
  }

  const reviewTasks = tasks.filter((task) => task.status === "needs_review");

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Step 10</p>
            <h1>Employer reviews tasks</h1>
            <p className="lead">Review submitted work, add feedback, mark it completed, and update the progress profile.</p>
          </div>
          <Link className="btn secondary" href="/employee/progress">Employee progress</Link>
        </section>

        <section className="card stack">
          <div className="between">
            <div>
              <h2>{application.applicantSnapshot.fullName}</h2>
              <p className="muted">{placement.roleTitle} · started {formatDate(placement.startDate)}</p>
            </div>
            <Badge tone="accent">{progress?.completionRate ?? 0}% complete</Badge>
          </div>
          <Progress value={progress?.completionRate ?? 0} />
          <div className="row">
            <Badge>Not started: {progress?.notStarted ?? 0}</Badge>
            <Badge>Working: {progress?.working ?? 0}</Badge>
            <Badge>Needs review: {progress?.review ?? 0}</Badge>
            <Badge>Completed: {progress?.completed ?? 0}</Badge>
            <Badge>Rating: {progress?.averageRating ?? "—"}</Badge>
          </div>
        </section>

        <section className="grid grid-2">
          <div className="card stack-lg">
            <div>
              <h2>Tasks needing review</h2>
              <p className="muted">These were submitted by the employee.</p>
            </div>

            {reviewTasks.length === 0 ? (
              <div className="notice stack">
                <strong>No tasks waiting for review.</strong>
                <p className="muted">Go to the employee task board and submit a task to Needs Review.</p>
                <Link className="btn secondary" href="/employee/tasks">Open employee tasks</Link>
              </div>
            ) : (
              reviewTasks.map((task) => (
                <div key={task.id} className="notice stack">
                  <div className="between">
                    <strong>{task.title}</strong>
                    <Badge>{getTaskStatusLabel(task.status)}</Badge>
                  </div>
                  <p className="muted">{task.description}</p>
                  {task.latestUpdate ? <p><strong>Employee update:</strong> {task.latestUpdate}</p> : null}
                  {task.submissionLink ? <p className="muted" style={{ wordBreak: "break-all" }}><strong>Submission:</strong> {task.submissionLink}</p> : null}
                  <label>
                    Feedback
                    <textarea className="textarea" value={feedback[task.id] ?? "Good structure. Improve mobile spacing next time."} onChange={(event) => setFeedback((prev) => ({ ...prev, [task.id]: event.target.value }))} />
                  </label>
                  <label>
                    Rating
                    <input className="input" type="number" min="1" max="5" step="0.5" value={ratings[task.id] ?? "4.5"} onChange={(event) => setRatings((prev) => ({ ...prev, [task.id]: event.target.value }))} />
                  </label>
                  <div className="row">
                    <button className="btn" onClick={() => completeTask(task.id)}>Mark Completed</button>
                    <button className="btn secondary" onClick={() => sendBack(task.id)}>Send back to Working On It</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card stack-lg">
            <div>
              <h2>All placement tasks</h2>
              <p className="muted">A quick employer overview.</p>
            </div>
            {tasks.map((task) => (
              <div key={task.id} className="notice stack">
                <div className="between">
                  <strong>{task.title}</strong>
                  <Badge tone={task.status === "completed" ? "success" : task.status === "needs_review" ? "warning" : "default"}>{getTaskStatusLabel(task.status)}</Badge>
                </div>
                {task.feedbackComment ? <p className="muted"><strong>Feedback:</strong> {task.feedbackComment}</p> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
