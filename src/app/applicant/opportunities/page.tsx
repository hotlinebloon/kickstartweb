"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, getState, type DemoState } from "@/lib/demo-store";
import { Badge } from "@/components/ui";

export default function OpportunitiesPage() {
  const [state, setState] = useState<DemoState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return <main className="page"><div className="container">Loading...</div></main>;

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="between">
          <div className="stack">
            <p className="eyebrow">Step 1</p>
            <h1>Open opportunities</h1>
            <p className="lead">Pick one opportunity. The prototype is focused on Focused Apply because it shows answers, scenario thinking, and proof of work.</p>
          </div>
          <Link className="btn secondary" href="/applicant/applications">My applications</Link>
        </section>

        <section className="grid grid-2">
          {state.opportunities.map((opportunity) => {
            const applied = state.applications.some((application) => application.opportunityId === opportunity.id);
            return (
              <article key={opportunity.id} className="card stack">
                <div className="between">
                  <div className="row">
                    <Badge tone="accent">Focused Apply</Badge>
                    <Badge>{opportunity.type}</Badge>
                    <Badge>{opportunity.workMode}</Badge>
                  </div>
                  {applied ? <Badge tone="success">Applied</Badge> : null}
                </div>
                <div className="stack">
                  <h2>{opportunity.title}</h2>
                  <p className="muted">{state.company.name} · {opportunity.location} · Deadline {formatDate(opportunity.deadline)}</p>
                  <p className="muted">{opportunity.description}</p>
                </div>
                <div className="row">
                  {opportunity.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
                </div>
                <Link className="btn" href={`/applicant/opportunities/${opportunity.id}`}>Open opportunity</Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
