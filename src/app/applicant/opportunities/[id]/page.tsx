"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDate, getState, type DemoState } from "@/lib/demo-store";
import {
  Badge,
  BlueprintEnvironment,
  EmptyState,
  LoadingState,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = String(params.id);

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
        (application) => application.opportunityId === opportunity.id
      ) ?? null
    );
  }, [state, opportunity]);

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
            description="Return to discovery and choose an available role."
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
            ← Back to opportunities
          </Link>

          <Link className="btn secondary" href="/applicant/applications">
            My applications
          </Link>
        </div>

        <BlueprintEnvironment>
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
                <Badge tone="accent">Apply with proof</Badge>
                <Badge>Focused Apply</Badge>
                <Badge>{opportunity.type}</Badge>
                <Badge>{opportunity.workMode}</Badge>
                <Badge>{opportunity.location}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
                {existingApplication ? (
                  <StatusBadge tone="success">Already applied</StatusBadge>
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
                <h3>What you will do</h3>

                <div className="apply-list">
                  {opportunity.responsibilities.map((item) => (
                    <p key={item} className="apply-list-item">
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="apply-section">
                <h3>What they expect</h3>

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
                <h2>Apply with proof</h2>
                <p className="muted">
                  Focused Apply gives the employer structured answers, a short
                  scenario response, and a proof item they can review.
                </p>
              </div>

              <Link
                className="btn apply-primary-action"
                href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
              >
                Continue to Apply with proof
              </Link>
            </WorkSurface>
          </div>

          <aside className="apply-side">
            <WorkSurface className="apply-side-card">
              <p className="eyebrow">Employer</p>
              <h3>{state.company.name}</h3>
              <p className="muted">{state.company.description}</p>

              <div className="row">
                <Badge>{state.company.industry}</Badge>
                <Badge>{state.company.location}</Badge>
              </div>
            </WorkSurface>

            <WorkSurface className="apply-side-card">
              <div className="apply-proof-box">
                <h3>Proof expectations</h3>
                <p className="muted">
                  Include a link the employer can open. Good proof can be a
                  GitHub repository, portfolio page, shared document, school
                  project, report, or screenshot folder.
                </p>
              </div>
            </WorkSurface>

            <WorkSurface className="apply-side-card">
              <p className="eyebrow">Applicant profile</p>
              <h3>{state.applicant.fullName}</h3>
              <p className="muted">{state.applicant.education}</p>
              <p className="muted">{state.applicant.school}</p>

              <div className="row">
                {state.applicant.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </WorkSurface>
          </aside>
        </section>
        </BlueprintEnvironment>

        <section id="focused-apply" className="apply-entry-grid">
          <WorkSurface className="apply-mode-summary">
            <div className="stack">
              <p className="eyebrow">Primary application path</p>
              <h2>Apply with proof</h2>
              <p className="muted">
                Answer employer questions, complete the scenario task, and add
                a concrete proof item before submitting.
              </p>
            </div>

            <Link
              className="btn apply-primary-action"
              href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
            >
              Start Apply with proof
            </Link>
          </WorkSurface>

          <WorkSurface className="quick-apply-entry">
            <div className="stack-sm">
              <p className="eyebrow">Secondary option</p>
              <h3>Quick Apply</h3>
              <p className="muted">
                Use your saved profile and CV preview. Apply with proof remains
                the stronger option for this role.
              </p>
            </div>

            <Link
              className="btn secondary"
              href={`/applicant/opportunities/${opportunity.id}/quick-apply`}
            >
              Preview Quick Apply
            </Link>
          </WorkSurface>
        </section>
      </div>
    </main>
  );
}
