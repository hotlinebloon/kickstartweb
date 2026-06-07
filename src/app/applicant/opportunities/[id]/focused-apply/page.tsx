"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  formatDate,
  getState,
  isApplicationFinal,
  submitFocusedApply,
  type DemoState,
} from "@/lib/demo-store";
import {
  Badge,
  ProductEnvironment,
  EmptyState,
  LoadingState,
  StatusBadge,
} from "@/components/ui";

const scenarioFieldId = "scenario-response";
const proofFieldId = "proof-url";
const proofExpectations =
  "GitHub, portfolio, shared document, school project, certificate, report, design file, website, or demo.";

function answerFieldId(index: number) {
  return `answer-${index}`;
}

function readDraft(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw) as {
          answers?: Record<string, string>;
          scenarioResponse?: string;
          proofUrl?: string;
        })
      : null;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export default function FocusedApplyPage() {
  const params = useParams();
  const id = String(params.id);

  const [state, setState] = useState<DemoState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scenarioResponse, setScenarioResponse] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const current = getState();
    const opportunity = current.opportunities.find((item) => item.id === id);

    setState(current);

    if (opportunity) {
      const existing = current.applications.find(
        (application) =>
          application.opportunityId === opportunity.id &&
          application.applicantId === current.applicant.id
      );
      const draftKey = `kickstart_application_draft_${opportunity.id}`;
      const draft = readDraft(draftKey);
      setAnswers(
        draft?.answers ??
          Object.fromEntries(
            opportunity.questions.map((question) => [
              question,
              existing?.answers.find((answer) => answer.question === question)?.answer ?? "",
            ])
          )
      );
      setScenarioResponse(draft?.scenarioResponse ?? existing?.scenarioResponse ?? "");
      setProofUrl(draft?.proofUrl ?? existing?.proofUrl ?? "");
      initializedRef.current = true;
    }
  }, [id]);

  useEffect(() => {
    if (!initializedRef.current) return;
    window.localStorage.setItem(
      `kickstart_application_draft_${id}`,
      JSON.stringify({ answers, scenarioResponse, proofUrl })
    );
  }, [answers, scenarioResponse, proofUrl, id]);

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      const hasDraft =
        Object.values(answers).some((answer) => answer.trim()) ||
        scenarioResponse.trim() ||
        proofUrl.trim();
      if (!hasDraft || submittedRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [answers, scenarioResponse, proofUrl]);

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
        "Add a work sample link the employer can open.";
    } else {
      try {
        const url = new URL(proofUrl);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        nextErrors[proofFieldId] =
          "Enter a complete link starting with https:// or http://.";
      }
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

    submittedRef.current = true;
    window.localStorage.removeItem(`kickstart_application_draft_${opportunity.id}`);
    window.location.assign("/applicant/applications");
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading application" />
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

  if (existingApplication && isApplicationFinal(existingApplication.status)) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState
            title="This application is locked"
            description="The employer has made a final decision, so this application can no longer be changed."
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

          <Link className="btn secondary" href="/applicant/applications">
            My applications
          </Link>
        </div>

        <ProductEnvironment>
          <section className="focused-apply-layout">
            <form className="apply-form" onSubmit={submit} noValidate>
              <div className="stack">
                <p className="eyebrow">Focused application</p>
                <h1>Complete your application</h1>
                <p className="lead">
                  Answer the employer’s questions, explain how you would
                  approach the work, and include one relevant work sample.
                </p>
              </div>

              <div className="row">
                <Badge tone="accent">Focused application</Badge>
                <Badge>Your draft saves automatically</Badge>
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
                    Complete the required fields
                  </h3>
                  <p>
                    Use the links below to open each field that needs attention.
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
                  <h2>Questions from the employer</h2>
                  <p className="muted">
                    Use specific examples so the employer can understand your
                    motivation, relevant experience, and learning goals.
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
                    Work scenario
                  </label>
                  <p className="muted">{opportunity.scenarioTask}</p>
                  <p id={`${scenarioFieldId}-help`} className="help-text">
                    Explain the practical steps you would take and what you
                    would clarify before starting.
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
                    Work sample link
                  </label>
                  <p className="muted">{opportunity.proofRequirement}</p>
                  <p id={`${proofFieldId}-help`} className="help-text">
                    Add one link the employer can open:{" "}
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
                  {existingApplication ? "Update application" : "Send application"}
                </button>
              </div>
            </form>

          </section>
        </ProductEnvironment>
      </div>
    </main>
  );
}
