"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getState,
  isApplicationFinal,
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

export function OpportunityDetailClient({ id }: { id: string }) {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const opportunity = useMemo(() => {
    return state?.opportunities.find((item) => item.id === id) ?? null;
  }, [state, id]);

  const existingApplication = useMemo(() => {
    if (!state || !opportunity) return null;

    return (
      state.applications.find(
        (application) =>
          application.opportunityId === opportunity.id &&
          application.applicantId === state.applicant.id
      ) ?? null
    );
  }, [state, opportunity]);

  const existingApplicationTone =
    existingApplication?.status === "accepted"
      ? "success"
      : existingApplication?.status === "rejected"
        ? "danger"
        : "info";

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading opportunity details" />
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
            description="Return to opportunities and choose an active role."
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

  return (
    <main className="page">
      <div className="container stack-lg">
        <div className="row">
          <Link className="btn secondary" href="/applicant/opportunities">
            Back to opportunities
          </Link>

          <Link className="btn secondary" href="/applicant/applications">
            My applications
          </Link>
        </div>

        <ProductEnvironment>
          <section className="apply-detail-layout">
            <div className="stack-lg">
              <WorkSurface className="apply-hero">
              <div className="apply-hero-top">
                <div className="stack">
                  <p className="eyebrow">Opportunity details</p>

                  <h1 className="apply-title">{opportunity.title}</h1>

                  <p className="lead">{opportunity.description}</p>
                </div>

                <div className="apply-company-mark">
                  {state.company.name.slice(0, 1)}
                </div>
              </div>

              <div className="apply-meta">
                <Badge tone="accent">Focused application</Badge>
                <Badge>{opportunity.type}</Badge>
                <Badge>{opportunity.workMode}</Badge>
                <Badge>{opportunity.location}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
                {existingApplication ? (
                  <StatusBadge tone={existingApplicationTone}>
                    {getApplicationStatusLabel(existingApplication.status)}
                  </StatusBadge>
                ) : null}
              </div>

              <section className="apply-section soft">
                <h3>Skills required</h3>

                <div className="row">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </section>
              </WorkSurface>

            <section className="grid grid-2">
              <div className="apply-section">
                <h3>Responsibilities</h3>

                <div className="apply-list">
                  {opportunity.responsibilities.map((item) => (
                    <p key={item} className="apply-list-item">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="apply-section">
                <h3>Requirements</h3>

                <div className="apply-list">
                  {opportunity.requirements.map((item) => (
                    <p key={item} className="apply-list-item">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </section>

            <WorkSurface className="apply-mode-summary">
              <div className="stack">
                <h2>Submit a focused application</h2>
                <p className="muted">
                  Answer the employer’s questions, explain your approach to a
                  work scenario, and include one relevant work sample.
                </p>
              </div>

              {existingApplication ? (
                <Link className="btn apply-primary-action" href="/applicant/applications">
                  View {getApplicationStatusLabel(existingApplication.status).toLowerCase()} application
                </Link>
              ) : (
                <Link
                  className="btn apply-primary-action"
                  href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
                >
                  Start focused application
                </Link>
              )}
            </WorkSurface>
          </div>

          <aside className="apply-side">
            <WorkSurface className="apply-side-card">
              <p className="meta-label">Employer</p>
              <h3>{state.company.name}</h3>
              <p className="muted">{state.company.description}</p>

              <div className="row">
                <Badge>{state.company.industry}</Badge>
                <Badge>{state.company.location}</Badge>
              </div>
            </WorkSurface>

          </aside>
        </section>
        </ProductEnvironment>

        {!existingApplication ? (
        <section className="apply-entry-grid secondary-options">
          <WorkSurface className="quick-apply-entry">
            <div className="stack-sm">
              <h3>Profile application</h3>
              <p className="muted">
                Send your saved profile and portfolio. This option does not
                include role-specific answers or a scenario response.
              </p>
            </div>

            <Link
              className="btn secondary"
              href={`/applicant/opportunities/${opportunity.id}/quick-apply`}
            >
              Review profile application
            </Link>
          </WorkSurface>
        </section>
        ) : isApplicationFinal(existingApplication.status) ? (
          <div className="notice" role="status">
            This application has a final decision and can no longer be changed.
          </div>
        ) : null}
      </div>
    </main>
  );
}
