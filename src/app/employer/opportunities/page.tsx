"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  createOpportunity,
  formatDate,
  getState,
  updateOpportunityStatus,
  type DemoState,
  type Opportunity,
} from "@/lib/demo-store";
import { EmptyState, LoadingState, StatusBadge } from "@/components/ui";

type OpportunityStatus = NonNullable<Opportunity["status"]>;

function statusTone(status: OpportunityStatus) {
  if (status === "active") return "success";
  if (status === "draft") return "warning";
  return "neutral";
}

export default function EmployerOpportunitiesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setState(getState());
  }, []);

  const roleRows = useMemo(() => {
    if (!state) return [];
    return state.opportunities.map((opportunity) => ({
      opportunity,
      applications: state.applications.filter(
        (application) => application.opportunityId === opportunity.id
      ),
    }));
  }, [state]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const location = String(data.get("location") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const deadline = String(data.get("deadline") ?? "");
    const skills = String(data.get("skills") ?? "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const nextErrors: Record<string, string> = {};
    if (!title) nextErrors.title = "Enter a role title.";
    if (!location) nextErrors.location = "Enter a location.";
    if (!description) nextErrors.description = "Describe the opportunity.";
    if (!deadline) nextErrors.deadline = "Choose an application deadline.";
    if (skills.length === 0) nextErrors.skills = "Add at least one relevant skill.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const next = createOpportunity({
      title,
      location,
      description,
      deadline,
      skills,
      type: String(data.get("type")) as Opportunity["type"],
      workMode: String(data.get("workMode")) as Opportunity["workMode"],
    });
    setState(next);
    setShowCreate(false);
    setErrors({});
    setNotice(`${title} is now open for applications.`);
    event.currentTarget.reset();
  }

  function changeStatus(opportunity: Opportunity, status: OpportunityStatus) {
    setState(updateOpportunityStatus(opportunity.id, status));
    setNotice(
      status === "active"
        ? `${opportunity.title} is open and visible to applicants.`
        : status === "closed"
          ? `${opportunity.title} is closed and no longer visible to applicants.`
          : `${opportunity.title} moved to draft and is no longer visible to applicants.`
    );
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container"><LoadingState label="Loading employer opportunities" /></div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Employer workspace</p>
            <h1>Manage opportunities</h1>
            <p className="lead">
              Publish roles, track applicant interest, and move each opportunity
              through its hiring lifecycle.
            </p>
          </div>
          <button className="btn" type="button" onClick={() => setShowCreate((open) => !open)}>
            {showCreate ? "Keep opportunities list" : "Create opportunity"}
          </button>
        </section>

        {notice ? <div className="notice" role="status">{notice}</div> : null}

        {showCreate ? (
          <form className="work-surface employer-opportunity-form stack-lg" onSubmit={submit} noValidate>
            <div className="between">
              <div>
                <h2>Create an opportunity</h2>
                <p className="muted">Add the essential role details. Kickstart will add starter application questions and work-sample requirements.</p>
              </div>
              <StatusBadge tone="info">Publishes immediately</StatusBadge>
            </div>
            <div className="grid grid-2">
              <label>Role title<input className="input" name="title" aria-invalid={Boolean(errors.title)} />{errors.title ? <span className="field-error">{errors.title}</span> : null}</label>
              <label>Location<input className="input" name="location" aria-invalid={Boolean(errors.location)} />{errors.location ? <span className="field-error">{errors.location}</span> : null}</label>
              <label>Opportunity type<select className="input" name="type" defaultValue="Internship"><option>Internship</option><option>Micro-project</option><option>Entry-level</option></select></label>
              <label>Work mode<select className="input" name="workMode" defaultValue="Hybrid"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
              <label>Application deadline<input className="input" name="deadline" type="date" aria-invalid={Boolean(errors.deadline)} />{errors.deadline ? <span className="field-error">{errors.deadline}</span> : null}</label>
              <label>Relevant skills<input className="input" name="skills" placeholder="React, Communication, GitHub" aria-invalid={Boolean(errors.skills)} />{errors.skills ? <span className="field-error">{errors.skills}</span> : null}</label>
            </div>
            <label>Opportunity description<textarea className="textarea" name="description" aria-invalid={Boolean(errors.description)} />{errors.description ? <span className="field-error">{errors.description}</span> : null}</label>
            <div className="row"><button className="btn" type="submit">Publish opportunity</button><button className="btn secondary" type="button" onClick={() => setShowCreate(false)}>Keep opportunities list</button></div>
          </form>
        ) : null}

        {roleRows.length === 0 ? (
          <EmptyState title="No opportunities yet" description="Create the first role to begin receiving applicants." />
        ) : (
          <section className="employer-role-list" aria-label="Company opportunities">
            {roleRows.map(({ opportunity, applications }) => {
              const status = opportunity.status ?? "active";
              return (
                <article className="employer-role-row" key={opportunity.id}>
                  <div className="stack-sm">
                    <div className="row">
                      <StatusBadge tone={statusTone(status)}>{status}</StatusBadge>
                      <span className="muted">{opportunity.type} · {opportunity.workMode} · {opportunity.location}</span>
                    </div>
                    <h2>{opportunity.title}</h2>
                    <p className="muted">{opportunity.description}</p>
                  </div>
                  <div className="employer-role-data">
                    <div><strong>{applications.length}</strong><span>Applicants</span></div>
                    <div><strong>{applications.filter((application) => application.status === "shortlisted").length}</strong><span>Shortlisted</span></div>
                    <div><strong>{formatDate(opportunity.deadline)}</strong><span>Deadline</span></div>
                  </div>
                  <div className="row employer-role-actions">
                    <Link className="btn" href="/employer/applicants">Review role applicants</Link>
                    {status !== "active" ? <button className="btn secondary" type="button" onClick={() => changeStatus(opportunity, "active")}>Open applications</button> : null}
                    {status === "active" ? <button className="btn secondary" type="button" onClick={() => changeStatus(opportunity, "closed")}>Close applications</button> : null}
                    {status !== "draft" ? <button className="btn secondary" type="button" onClick={() => changeStatus(opportunity, "draft")}>Unpublish opportunity</button> : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
