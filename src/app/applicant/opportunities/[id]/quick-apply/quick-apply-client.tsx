"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getState,
  submitQuickApply,
  type DemoState,
} from "@/lib/demo-store";
import {
  Badge,
  ProductEnvironment,
  EmptyState,
  LoadingState,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";
import { hardNavigate } from "@/lib/navigation";

export function QuickApplyClient({ id }: { id: string }) {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const opportunity = useMemo(() => {
    return state?.opportunities.find((item) => item.id === id) ?? null;
  }, [state, id]);

  const existingApplication = useMemo(() => {
    return (
      state?.applications.find(
        (item) =>
          item.opportunityId === id && item.applicantId === state.applicant.id
      ) ?? null
    );
  }, [state, id]);

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading profile application" />
        </div>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState
            title="Opportunity not found"
            description="Return to opportunities and choose an active role before applying."
            action={
              <Link className="btn" href="/applicant/opportunities">
                Back to opportunities
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  if (existingApplication) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState
            title="You already applied"
            description="Only one application can be submitted for each opportunity. Open your application to review its current status."
            action={
              <Link className="btn" href="/applicant/applications">
                View application
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  function submit() {
    if (!opportunity) return;
    submitQuickApply(opportunity.id);
    hardNavigate("/applicant/applications");
  }

  return (
    <main className="page blueprint-page">
      <div className="container stack-lg">
        <div className="row">
          <Link
            className="btn secondary"
            href={`/applicant/opportunities/${opportunity.id}`}
          >
            Back to opportunity details
          </Link>

        </div>

        <ProductEnvironment>
          <section className="quick-apply-layout">
            <WorkSurface className="quick-apply-card">
              <div className="stack">
                <p className="meta-label">Profile application</p>
                <h1>Apply with your saved profile</h1>
                <p className="lead">
                  Send your saved profile and portfolio without adding
                  role-specific answers or a scenario response.
                </p>
              </div>

              <div className="row">
                <StatusBadge tone="warning">Profile and portfolio only</StatusBadge>
                <Badge>{opportunity.type}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
              </div>

              <section className="quick-profile-preview">
                <div className="stack-sm">
                  <h2>{state.applicant.fullName}</h2>
                  <p className="muted">{state.applicant.education}</p>
                  <p className="muted">{state.applicant.school}</p>
                </div>

                <div className="quick-cv-box">
                  <p className="meta-label">Saved CV</p>
                  <h3>{state.applicant.cvName}</h3>
                  <a className="text-link" href={state.applicant.portfolioUrl} target="_blank" rel="noreferrer">
                    Open portfolio
                  </a>
                </div>

                <div className="row">
                  {state.applicant.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </section>

              <div className="row">
                <button className="btn" type="button" onClick={submit}>
                  Send profile application
                </button>

                <Link
                  className="btn secondary"
                  href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
                >
                  Complete focused application instead
                </Link>
              </div>
            </WorkSurface>

          </section>
        </ProductEnvironment>
      </div>
    </main>
  );
}
