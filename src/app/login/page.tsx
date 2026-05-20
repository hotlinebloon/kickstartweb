"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDefaultRedirect, loginAs, type DemoRole } from "@/lib/auth-store";

const roles: {
  role: DemoRole;
  title: string;
  subtitle: string;
  description: string;
  startsAt: string;
}[] = [
  {
    role: "applicant",
    title: "Applicant",
    subtitle: "For students and young people",
    description:
      "Browse opportunities, open one role, submit Focused Apply, and track application status. Employee tasks unlock after acceptance.",
    startsAt: "/applicant/opportunities",
  },
  {
    role: "employer",
    title: "Employer",
    subtitle: "For companies and organizations",
    description:
      "Review structured applications, accept applicants, review submitted tasks, and track progress after hiring.",
    startsAt: "/employer/applicants",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("applicant");

  function submit() {
    const user = loginAs(role);
    router.push(getDefaultRedirect(user.role));
  }

  return (
    <main className="page">
      <div className="container stack-lg" style={{ maxWidth: 900 }}>
        <section className="stack">
          <p className="eyebrow">Demo login</p>
          <h1>Choose your side</h1>
          <p className="lead">
            Kickstart has two main account groups in this prototype. Applicants
            apply and become employees after acceptance. Employers review,
            accept, and track progress.
          </p>
        </section>

        <section className="grid grid-2">
          {roles.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => setRole(item.role)}
              className="card"
              style={{
                textAlign: "left",
                borderColor: role === item.role ? "var(--accent)" : undefined,
              }}
            >
              <div className="stack">
                <div>
                  <h3>{item.title}</h3>
                  <p className="eyebrow" style={{ marginTop: 6 }}>
                    {item.subtitle}
                  </p>
                </div>

                <p className="muted">{item.description}</p>

                <p className="muted" style={{ fontSize: 13 }}>
                  Starts at: {item.startsAt}
                </p>

                {role === item.role ? (
                  <span className="badge accent">Selected</span>
                ) : null}
              </div>
            </button>
          ))}
        </section>

        <div className="card">
          <div className="between">
            <div>
              <h3>
                Continue as {role === "applicant" ? "Applicant" : "Employer"}
              </h3>
              <p className="muted">
                This is fake local login for testing. Real authentication comes
                later.
              </p>
            </div>

            <button className="btn" onClick={submit}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}