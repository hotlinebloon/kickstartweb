"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDefaultRedirect,
  registerDemoUser,
  type DemoRole,
} from "@/lib/auth-store";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("Arta Krasniqi");
  const [email, setEmail] = useState("arta@example.com");
  const [role, setRole] = useState<DemoRole>("applicant");
  const [error, setError] = useState("");

  function handleRoleChange(nextRole: DemoRole) {
    setRole(nextRole);

    if (nextRole === "applicant") {
      setName("Arta Krasniqi");
      setEmail("arta@example.com");
    } else {
      setName("NovaTech Employer");
      setEmail("employer@novatech.test");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    const user = registerDemoUser({
      name,
      email,
      role,
    });

    router.push(getDefaultRedirect(user.role));
  }

  return (
    <main className="page">
      <div className="container stack-lg" style={{ maxWidth: 760 }}>
        <section className="stack">
          <p className="eyebrow">Demo signup</p>
          <h1>Create a test account</h1>
          <p className="lead">
            Choose Applicant or Employer. Employee access appears later after an
            applicant is accepted into a placement.
          </p>
        </section>

        <section className="grid grid-2">
          <button
            type="button"
            onClick={() => handleRoleChange("applicant")}
            className="card"
            style={{
              textAlign: "left",
              borderColor: role === "applicant" ? "var(--accent)" : undefined,
            }}
          >
            <div className="stack">
              <h3>Applicant</h3>
              <p className="muted">
                Finds opportunities, applies, and later becomes an employee
                after acceptance.
              </p>
              {role === "applicant" ? (
                <span className="badge accent">Selected</span>
              ) : null}
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("employer")}
            className="card"
            style={{
              textAlign: "left",
              borderColor: role === "employer" ? "var(--accent)" : undefined,
            }}
          >
            <div className="stack">
              <h3>Employer</h3>
              <p className="muted">
                Reviews applicants, accepts them, and tracks progress after
                hiring.
              </p>
              {role === "employer" ? (
                <span className="badge accent">Selected</span>
              ) : null}
            </div>
          </button>
        </section>

        <form onSubmit={submit} className="card stack">
          <label>
            Full name
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

          <button className="btn" type="submit">
            Create {role === "applicant" ? "Applicant" : "Employer"} account
          </button>
        </form>
      </div>
    </main>
  );
}