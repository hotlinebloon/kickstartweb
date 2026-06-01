"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getState,
  type DemoState,
  type Opportunity,
} from "@/lib/demo-store";
import {
  Badge,
  BlueprintEnvironment,
  EmptyState,
  LoadingState,
  StatusBadge,
  WorkSurface,
} from "@/components/ui";

function getSafeIndex(index: number, opportunities: Opportunity[]) {
  if (opportunities.length === 0) return 0;
  if (index < 0) return 0;
  if (index >= opportunities.length) return opportunities.length - 1;
  return index;
}

export default function OpportunitiesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);

  useEffect(() => {
    setState(getState());
  }, []);

  const opportunities = state?.opportunities ?? [];
  const safeIndex = getSafeIndex(currentIndex, opportunities);
  const opportunity = opportunities[safeIndex] ?? null;

  const appliedIds = useMemo(() => {
    if (!state) return [];

    return state.applications.map((application) => application.opportunityId);
  }, [state]);

  function moveNext() {
    setCurrentIndex((index) =>
      opportunities.length === 0
        ? 0
        : Math.min(index + 1, opportunities.length - 1)
    );
  }

  function movePrevious() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function saveOpportunity(id: string) {
    setSavedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    moveNext();
  }

  function skipOpportunity(id: string) {
    setSkippedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    moveNext();
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading opportunities" />
        </div>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState
            title="No opportunities found"
            description="New roles will appear here when employers publish openings."
          />
        </div>
      </main>
    );
  }

  const isApplied = appliedIds.includes(opportunity.id);
  const isSaved = savedIds.includes(opportunity.id);
  const isSkipped = skippedIds.includes(opportunity.id);

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="page-header between">
          <div className="stack">
            <p className="eyebrow">Applicant discovery</p>
            <h1>Browse opportunities</h1>
            <p className="lead">
              Move through opportunity cards quickly, but with purpose. Save
              what fits, skip what does not, and open the full role before
              applying.
            </p>
          </div>

          <Link className="btn secondary" href="/applicant/applications">
            My applications
          </Link>
        </section>

        <BlueprintEnvironment>
          <section className="discovery-layout">
            <WorkSurface className="discovery-card">
              <div className="discovery-card-header">
                <div className="stack-sm">
                  <p className="eyebrow">
                    Opportunity {safeIndex + 1} of {opportunities.length}
                  </p>

                  <h2 className="discovery-title">{opportunity.title}</h2>

                  <p className="muted">
                    {state.company.name} · {opportunity.location} ·{" "}
                    {opportunity.workMode}
                  </p>
                </div>

                <div className="company-mark">
                  {state.company.name.slice(0, 1)}
                </div>
              </div>

              <div className="discovery-meta">
                <Badge tone="accent">Apply with proof</Badge>
                <Badge>Focused Apply</Badge>
                <Badge>{opportunity.type}</Badge>
                <Badge>{opportunity.workMode}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
                {isApplied ? <StatusBadge tone="success">Applied</StatusBadge> : null}
                {isSaved && !isApplied ? (
                  <StatusBadge tone="success">Saved</StatusBadge>
                ) : null}
                {isSkipped ? <StatusBadge>Skipped</StatusBadge> : null}
              </div>

              <p className="lead">{opportunity.description}</p>

              <section className="discovery-skills stack-sm">
                <h3>Skills required</h3>

                <div className="row">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </section>

              <section className="discovery-brief grid grid-2">
                <div className="stack">
                  <h3>What you will do</h3>

                  {opportunity.responsibilities.slice(0, 3).map((item) => (
                    <p key={item} className="muted">
                      {item}
                    </p>
                  ))}
                </div>

                <div className="stack">
                  <h3>What they expect</h3>

                  {opportunity.requirements.slice(0, 3).map((item) => (
                    <p key={item} className="muted">
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <div className="discovery-actions">
                <Link
                  className="btn discovery-primary-action"
                  href={`/applicant/opportunities/${opportunity.id}`}
                >
                  Open details and Apply with proof
                </Link>

                <div className="choice-row">
                  <button
                    className="choice-button skip"
                    type="button"
                    onClick={() => skipOpportunity(opportunity.id)}
                  >
                    Skip role
                  </button>

                  <button
                    className="choice-button save"
                    type="button"
                    onClick={() => saveOpportunity(opportunity.id)}
                  >
                    Save role
                  </button>
                </div>
              </div>
            </WorkSurface>

            <aside className="discovery-side">
              <WorkSurface>
              <h3>Opportunity queue</h3>
              <p className="muted">
                Compare each role, keep promising matches, and open the full
                details when the fit looks strong.
              </p>

              <div className="row">
                <button
                  className="btn secondary"
                  type="button"
                  onClick={movePrevious}
                  disabled={safeIndex === 0}
                >
                  Previous
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={moveNext}
                  disabled={safeIndex === opportunities.length - 1}
                >
                  Next
                </button>
              </div>

              <div className="mini-list">
                {opportunities.map((item, index) => {
                  const itemApplied = appliedIds.includes(item.id);
                  const itemSaved = savedIds.includes(item.id);
                  const itemSkipped = skippedIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      className={`mini-opportunity ${
                        index === safeIndex ? "active" : ""
                      }`}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                    >
                      <strong>{item.title}</strong>

                      <span className="muted">
                        {item.type} · {item.workMode}
                      </span>

                      <span className="row">
                        {itemApplied ? (
                          <StatusBadge tone="success">Applied</StatusBadge>
                        ) : itemSaved ? (
                          <StatusBadge tone="success">Saved</StatusBadge>
                        ) : itemSkipped ? (
                          <StatusBadge>Skipped</StatusBadge>
                        ) : (
                          <StatusBadge>Not opened</StatusBadge>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              </WorkSurface>
            </aside>
          </section>
        </BlueprintEnvironment>
      </div>
    </main>
  );
}
