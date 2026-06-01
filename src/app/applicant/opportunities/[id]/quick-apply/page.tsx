"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatDate,
  getState,
  type DemoState,
} from "@/lib/demo-store";
import {
  Badge,
  BlueprintEnvironment,
  EmptyState,
  LoadingState,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";

const quickAppliesLeftToday = 3;

export default function QuickApplyPage() {
  const params = useParams();
  const id = String(params.id);
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  const opportunity = useMemo(() => {
    return state?.opportunities.find((item) => item.id === id) ?? null;
  }, [state, id]);

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading Quick Apply" />
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
            description="Return to discovery and choose an available role before applying."
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
          <Link
            className="btn secondary"
            href={`/applicant/opportunities/${opportunity.id}`}
          >
            Back to role details
          </Link>

          <Link
            className="btn"
            href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
          >
            Use Apply with proof
          </Link>
        </div>

        <BlueprintEnvironment>
          <section className="quick-apply-layout">
            <WorkSurface className="quick-apply-card">
              <div className="stack">
                <p className="eyebrow">Secondary application option</p>
                <h1>Quick Apply</h1>
                <p className="lead">
                  This uses your saved profile and CV preview. It is faster, but
                  it gives the employer less evidence than Apply with proof.
                </p>
              </div>

              <div className="row">
                <StatusBadge tone="info">
                  {quickAppliesLeftToday} quick applies left today
                </StatusBadge>
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
                  <p className="eyebrow">CV preview</p>
                  <h3>{state.applicant.cvName}</h3>
                  <p className="muted">{state.applicant.portfolioUrl}</p>
                </div>

                <div className="row">
                  {state.applicant.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </section>

              <div className="row">
                <Link
                  className="btn"
                  href={`/applicant/opportunities/${opportunity.id}/focused-apply`}
                >
                  Continue with Apply with proof
                </Link>

                <Link
                  className="btn secondary"
                  href="/applicant/opportunities"
                >
                  Back to discovery
                </Link>
              </div>
            </WorkSurface>

            <WorkSurface className="apply-side-card">
              <p className="eyebrow">Role preview</p>
              <h2>{opportunity.title}</h2>
              <p className="muted">
                {state.company.name} · {opportunity.location} ·{" "}
                {opportunity.workMode}
              </p>
              <p className="muted">{opportunity.description}</p>
            </WorkSurface>
          </section>
        </BlueprintEnvironment>
      </div>
    </main>
  );
}
