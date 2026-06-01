"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatDate,
  getState,
  submitFocusedApply,
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

const defaultAnswerOne =
  "I want to learn through real tasks and feedback instead of only submitting a CV.";

const defaultAnswerTwo =
  "I built a simple personal portfolio and a small event page for school.";

const defaultAnswerThree =
  "I want to improve React component structure and responsive design.";

const defaultScenario =
  "I would start by identifying the main goal, then break the work into small parts, build a first version, ask for feedback, and improve the result based on the review.";

const scenarioFieldId = "scenario-response";
const proofFieldId = "proof-url";
const proofExpectations =
  "GitHub, portfolio, shared document, school project, certificate, report, design file, website, or demo.";

function answerFieldId(index: number) {
  return `answer-${index}`;
}

export default function FocusedApplyPage() {
  const params = useParams();
  const id = String(params.id);

  const [state, setState] = useState<DemoState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scenarioResponse, setScenarioResponse] = useState(defaultScenario);
  const [proofUrl, setProofUrl] = useState(
    "https://github.com/arta-demo/landing-page"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = getState();
    const opportunity = current.opportunities.find((item) => item.id === id);

    setState(current);

    if (opportunity) {
      setAnswers(
        Object.fromEntries(
          opportunity.questions.map((question, index) => [
            question,
            index === 0
              ? defaultAnswerOne
              : index === 1
                ? defaultAnswerTwo
                : defaultAnswerThree,
          ])
        )
      );
    }
  }, [id]);

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

  function clearFieldError(fieldId: string) {
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!opportunity) return;

    const nextErrors: Record<string, string> = {};
    const finalAnswers = opportunity.questions.map((question) => ({
      question,
      answer: answers[question]?.trim() ?? "",
    }));

    finalAnswers.forEach((item, index) => {
      if (!item.answer) {
        nextErrors[answerFieldId(index)] =
          "Answer this employer question before submitting.";
      }
    });

    if (!scenarioResponse.trim()) {
      nextErrors[scenarioFieldId] =
        "Describe how you would approach the scenario task.";
    }

    if (!proofUrl.trim()) {
      nextErrors[proofFieldId] =
        "Add a proof link the employer can open.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    setErrors({});

    submitFocusedApply({
      opportunityId: opportunity.id,
      answers: finalAnswers,
      scenarioResponse,
      proofUrl,
    });

    window.location.assign("/applicant/applications");
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading Apply with proof" />
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

          <Link className="btn secondary" href="/applicant/applications">
            My applications
          </Link>
        </div>

        <BlueprintEnvironment>
          <section className="focused-apply-layout">
            <form className="apply-form" onSubmit={submit} noValidate>
              <div className="stack">
                <p className="eyebrow">Focused Apply</p>
                <h1>Submit Apply with proof</h1>
                <p className="lead">
                  Give the employer structured answers, scenario thinking, and
                  a proof item they can open.
                </p>
              </div>

              <div className="row">
                <Badge tone="accent">Apply with proof</Badge>
                <Badge>Focused Apply</Badge>
                <Badge>{opportunity.type}</Badge>
                <Badge>{opportunity.workMode}</Badge>
                <Badge>Deadline {formatDate(opportunity.deadline)}</Badge>
                {existingApplication ? (
                  <StatusBadge tone="success">Updating application</StatusBadge>
                ) : null}
              </div>

              {Object.keys(errors).length > 0 ? (
                <div
                  ref={errorSummaryRef}
                  className="error-summary"
                  role="alert"
                  tabIndex={-1}
                  aria-labelledby="apply-error-summary-title"
                >
                  <h3 id="apply-error-summary-title">
                    Complete the missing required fields
                  </h3>
                  <p>
                    Each missing item is listed below and next to its field. Use
                    the links to jump to the field that needs attention.
                  </p>
                  <ul>
                    {Object.entries(errors).map(([fieldId, message]) => (
                      <li key={fieldId}>
                        <a href={`#${fieldId}`}>{message}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <section className="apply-form-step">
                <div className="apply-step-number">1</div>

                <div className="stack">
                  <h2>Employer questions</h2>
                  <p className="muted">
                    Required answers. Be specific enough that the employer can
                    judge motivation, experience, and learning goals.
                  </p>

                  {opportunity.questions.map((question, index) => {
                    const fieldId = answerFieldId(index);
                    const helpId = `${fieldId}-help`;
                    const errorId = `${fieldId}-error`;

                    return (
                      <label key={question} htmlFor={fieldId}>
                        {question}
                        <span id={helpId} className="help-text">
                          Required. Mention a concrete reason, project, tool,
                          or learning goal connected to this role.
                        </span>
                        <textarea
                          id={fieldId}
                          className="textarea"
                          aria-describedby={
                            errors[fieldId] ? `${helpId} ${errorId}` : helpId
                          }
                          aria-invalid={Boolean(errors[fieldId])}
                          value={answers[question] ?? ""}
                          onChange={(event) => {
                            setAnswers((prev) => ({
                              ...prev,
                              [question]: event.target.value,
                            }));
                            clearFieldError(fieldId);
                          }}
                        />
                        {errors[fieldId] ? (
                          <span id={errorId} className="field-error">
                            {errors[fieldId]}
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="apply-form-step">
                <div className="apply-step-number">2</div>

                <div className="stack">
                  <label htmlFor={scenarioFieldId} className="field-title">
                    Scenario task
                  </label>
                  <p className="muted">{opportunity.scenarioTask}</p>
                  <p id={`${scenarioFieldId}-help`} className="help-text">
                    Required. Explain your approach in practical steps so the
                    employer can understand how you think through work.
                  </p>

                  <textarea
                    id={scenarioFieldId}
                    className="textarea"
                    aria-describedby={
                      errors[scenarioFieldId]
                        ? `${scenarioFieldId}-help ${scenarioFieldId}-error`
                        : `${scenarioFieldId}-help`
                    }
                    aria-invalid={Boolean(errors[scenarioFieldId])}
                    value={scenarioResponse}
                    onChange={(event) => {
                      setScenarioResponse(event.target.value);
                      clearFieldError(scenarioFieldId);
                    }}
                  />
                  {errors[scenarioFieldId] ? (
                    <p id={`${scenarioFieldId}-error`} className="field-error">
                      {errors[scenarioFieldId]}
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="apply-form-step">
                <div className="apply-step-number">3</div>

                <div className="stack">
                  <label htmlFor={proofFieldId} className="field-title">
                    Proof item
                  </label>
                  <p className="muted">{opportunity.proofRequirement}</p>
                  <p id={`${proofFieldId}-help`} className="help-text">
                    Required. Add one link the employer can open:{" "}
                    {proofExpectations}
                  </p>

                  <input
                    id={proofFieldId}
                    className="input"
                    aria-describedby={
                      errors[proofFieldId]
                        ? `${proofFieldId}-help ${proofFieldId}-error`
                        : `${proofFieldId}-help`
                    }
                    aria-invalid={Boolean(errors[proofFieldId])}
                    value={proofUrl}
                    onChange={(event) => {
                      setProofUrl(event.target.value);
                      clearFieldError(proofFieldId);
                    }}
                    placeholder="https://github.com/your-project"
                  />
                  {errors[proofFieldId] ? (
                    <p id={`${proofFieldId}-error`} className="field-error">
                      {errors[proofFieldId]}
                    </p>
                  ) : null}
                </div>
              </section>

              <div className="row">
                <button className="btn" type="submit">
                  Submit Apply with proof
                </button>

                <Link
                  className="btn secondary"
                  href={`/applicant/opportunities/${opportunity.id}`}
                >
                  Back to role details
                </Link>
              </div>
            </form>

            <aside className="apply-side">
              <WorkSurface className="apply-side-card">
                <p className="eyebrow">Role</p>
                <h2>{opportunity.title}</h2>
                <p className="muted">
                  {state.company.name} · {opportunity.location}
                </p>
                <div className="row">
                  {opportunity.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </WorkSurface>

              <WorkSurface className="apply-side-card">
                <div className="apply-proof-box">
                  <h3>Proof expectations</h3>
                  <p className="muted">{proofExpectations}</p>
                </div>
              </WorkSurface>

              <WorkSurface className="apply-side-card">
                <p className="eyebrow">Applicant profile</p>
                <h3>{state.applicant.fullName}</h3>
                <p className="muted">{state.applicant.education}</p>
                <p className="muted">{state.applicant.cvName}</p>
              </WorkSurface>
            </aside>
          </section>
        </BlueprintEnvironment>
      </div>
    </main>
  );
}
