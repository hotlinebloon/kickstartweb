"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDate, getProgress, getState, getTaskStatusLabel, type DemoState } from "@/lib/demo-store";
import { Badge, Progress, StatCard } from "@/components/ui";

export default function EmployeeProgressPage() {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const placement = useMemo(() => state?.placements[0] ?? null, [state]);
  const application = useMemo(() => state && placement ? state.applications.find((item) => item.id === placement.applicationId) ?? null : null, [state, placement]);
  const tasks = useMemo(() => state && placement ? state.tasks.filter((task) => task.placementId === placement.id) : [], [state, placement]);
  const progress = useMemo(() => state && placement ? getProgress(placement.id, state) : null, [state, placement]);

  if (!state) return <main className="page"><div className="container">Loading...</div></main>;

  if (!placement || !application || !progress) {
    return (
      <main className="page">
        <div className="container stack-lg">
          <section className="stack">
            <p className="eyebrow">Step 11</p>
            <h1>No progress profile yet</h1>
            <p className="lead">Accept an applicant and complete at least one task to see progress update.</p>
          </section>
          <div className="card row">
            <Link className="btn" href="/applicant/opportunities">Start from opportunities</Link>
            <Link className="btn secondary" href="/employer/applicants">Employer review</Link>
          </div>
        </div>
      </main>
    );
  }

  const completedTasks = tasks.filter((task) => task.status === "completed");
  const feedbackTasks = tasks.filter((task) => task.feedbackComment);

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Step 11</p>
            <h1>Progress profile</h1>
            <p className="lead">This is the proof that Kickstart continues after hiring: tasks, feedback, ratings, and visible growth.</p>
          </div>
          <Link className="btn secondary" href="/employee/tasks">Back to task board</Link>
        </section>

        <section className="card stack">
          <div className="between">
            <div>
              <h2>{application.applicantSnapshot.fullName}</h2>
              <p className="muted">{placement.roleTitle} at {state.company.name} · started {formatDate(placement.startDate)}</p>
            </div>
            <Badge tone="success">{progress.completionRate}% complete</Badge>
          </div>
          <Progress value={progress.completionRate} />
        </section>

        <section className="grid grid-4">
          <StatCard title="Completed" description="Approved tasks" value={`${progress.completed}/${progress.total}`} />
          <StatCard title="Needs review" description="Waiting employer" value={progress.review} />
          <StatCard title="Working" description="Currently active" value={progress.working} />
          <StatCard title="Average rating" description="Reviewed tasks" value={progress.averageRating ?? "—"} />
        </section>

        <section className="grid grid-2">
          <div className="card stack-lg">
            <div>
              <h2>Task breakdown</h2>
              <p className="muted">Current state of all placement tasks.</p>
            </div>
            {tasks.map((task) => (
              <div key={task.id} className="notice stack">
                <div className="between">
                  <strong>{task.title}</strong>
                  <Badge tone={task.status === "completed" ? "success" : task.status === "needs_review" ? "warning" : "default"}>{getTaskStatusLabel(task.status)}</Badge>
                </div>
                <p className="muted">{task.description}</p>
                {task.submissionLink ? <p className="muted" style={{ wordBreak: "break-all" }}><strong>Submission:</strong> {task.submissionLink}</p> : null}
              </div>
            ))}
          </div>

          <div className="card stack-lg">
            <div>
              <h2>Feedback and best work</h2>
              <p className="muted">Completed work becomes proof for future opportunities.</p>
            </div>

            {completedTasks.length === 0 ? (
              <div className="notice stack">
                <strong>No completed tasks yet.</strong>
                <p className="muted">Submit a task for review, then the employer must mark it Completed.</p>
                <Link className="btn secondary" href="/employer/employees">Employer review page</Link>
              </div>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="notice stack">
                  <div className="between">
                    <strong>{task.title}</strong>
                    <Badge tone="success">{task.rating ?? "—"}/5</Badge>
                  </div>
                  {task.feedbackComment ? <p className="muted"><strong>Feedback:</strong> {task.feedbackComment}</p> : null}
                  {task.submissionLink ? <p className="muted" style={{ wordBreak: "break-all" }}><strong>Best work:</strong> {task.submissionLink}</p> : null}
                </div>
              ))
            )}

            <div className="divider" />
            <div className="stack">
              <h3>Recent feedback</h3>
              {feedbackTasks.length === 0 ? <p className="muted">No feedback yet.</p> : feedbackTasks.map((task) => <p key={task.id} className="muted">• {task.feedbackComment}</p>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
