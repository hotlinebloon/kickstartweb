"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, getApplicationStatusLabel, getState, type DemoState } from "@/lib/demo-store";
import { Badge } from "@/components/ui";

export default function ApplicationsPage() {
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
            <p className="eyebrow">Application tracking</p>
            <h1>My applications</h1>
            <p className="lead">After submitting Focused Apply, the employer can review and accept it.</p>
          </div>
          <Link className="btn secondary" href="/employer/applicants">Go to employer review</Link>
        </section>

        {state.applications.length === 0 ? (
          <div className="card stack">
            <h3>No applications yet</h3>
            <p className="muted">Open an opportunity and submit Focused Apply first.</p>
            <Link className="btn" href="/applicant/opportunities">Open opportunities</Link>
          </div>
        ) : (
          <section className="grid">
            {state.applications.map((application) => {
              const opportunity = state.opportunities.find((item) => item.id === application.opportunityId);
              return (
                <div key={application.id} className="card stack">
                  <div className="between">
                    <div>
                      <h3>{opportunity?.title ?? "Opportunity"}</h3>
                      <p className="muted">{state.company.name} · submitted {formatDate(application.submittedAt)}</p>
                    </div>
                    <Badge tone={application.status === "accepted" ? "success" : application.status === "rejected" ? "warning" : "accent"}>
                      {getApplicationStatusLabel(application.status)}
                    </Badge>
                  </div>
                  <p className="muted">Focused Apply with {application.answers.length} answers, scenario response, and proof item.</p>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
