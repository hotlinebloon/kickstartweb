"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatDate, getState, submitFocusedApply, type DemoState } from "@/lib/demo-store";
import { Badge } from "@/components/ui";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [state, setState] = useState<DemoState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scenarioResponse, setScenarioResponse] = useState("I would start by identifying the main goal of the hero section, then build a simple layout with a headline, short value proposition, CTA button, and responsive spacing. I would submit a first version, ask for feedback, and improve it based on the review.");
  const [proofUrl, setProofUrl] = useState("https://github.com/arta-demo/landing-page");
  const [error, setError] = useState("");

  useEffect(() => {
    const current = getState();
    setState(current);
    const opportunity = current.opportunities.find((item) => item.id === id);
    if (opportunity) {
      setAnswers(Object.fromEntries(opportunity.questions.map((question, index) => [question, index === 0 ? "I want to learn through real tasks and feedback instead of only submitting a CV." : index === 1 ? "I built a simple personal portfolio and a small event page for school." : "I want to improve React component structure and responsive design."])));
    }
  }, [id]);

  const opportunity = useMemo(() => state?.opportunities.find((item) => item.id === id) ?? null, [state, id]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!opportunity) return;

    const finalAnswers = opportunity.questions.map((question) => ({ question, answer: answers[question]?.trim() ?? "" }));
    if (finalAnswers.some((item) => !item.answer) || !scenarioResponse.trim() || !proofUrl.trim()) {
      setError("Fill in all answers, scenario response, and proof item.");
      return;
    }

    submitFocusedApply({ opportunityId: opportunity.id, answers: finalAnswers, scenarioResponse, proofUrl });
    router.push("/applicant/applications");
  }

  if (!state) return <main className="page"><div className="container">Loading...</div></main>;

  if (!opportunity) {
    return <main className="page"><div className="container card">Opportunity not found.</div></main>;
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <Link className="btn secondary" href="/applicant/opportunities">← Back to opportunities</Link>

        <section className="grid grid-main-side">
          <div className="stack-lg">
            <div className="stack">
              <p className="eyebrow">Step 2</p>
              <h1>{opportunity.title}</h1>
              <p className="lead">{opportunity.description}</p>
              <div className="row">
                <Badge tone="accent">Focused Apply</Badge>
                <Badge>{opportunity.type}</Badge>
                <Badge>{opportunity.workMode}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
              </div>
            </div>

            <div className="card stack">
              <h3>Responsibilities</h3>
              {opportunity.responsibilities.map((item) => <p key={item} className="muted">• {item}</p>)}
            </div>

            <div className="card stack">
              <h3>Requirements</h3>
              {opportunity.requirements.map((item) => <p key={item} className="muted">• {item}</p>)}
            </div>
          </div>

          <aside className="card stack">
            <h3>Company</h3>
            <p><strong>{state.company.name}</strong></p>
            <p className="muted">{state.company.description}</p>
            <div className="row">{opportunity.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
          </aside>
        </section>

        <form onSubmit={submit} className="card stack-lg">
          <div className="stack">
            <p className="eyebrow">Step 3</p>
            <h2>Submit Focused Apply</h2>
            <p className="muted">This is the main application path for the prototype: questions, scenario response, and proof item.</p>
          </div>

          {opportunity.questions.map((question) => (
            <label key={question}>
              {question}
              <textarea className="textarea" value={answers[question] ?? ""} onChange={(event) => setAnswers((prev) => ({ ...prev, [question]: event.target.value }))} />
            </label>
          ))}

          <label>
            Scenario task: {opportunity.scenarioTask}
            <textarea className="textarea" value={scenarioResponse} onChange={(event) => setScenarioResponse(event.target.value)} />
          </label>

          <label>
            Proof item: {opportunity.proofRequirement}
            <input className="input" value={proofUrl} onChange={(event) => setProofUrl(event.target.value)} />
          </label>

          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}
          <button className="btn" type="submit">Submit Focused Apply</button>
        </form>
      </div>
    </main>
  );
}
