"use client";

import { FormEvent, useState } from "react";
import {
  getDefaultRedirect,
  registerDemoUser,
  type DemoRole,
} from "@/lib/auth-store";

export default function RegisterPage() {
  const [role, setRole] = useState<DemoRole>("employer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string } = {};
    if (!name.trim()) nextErrors.name = "Enter your name.";
    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter an email address like name@example.com.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const user = registerDemoUser({
      name,
      email,
      role,
    });

    window.location.assign(getDefaultRedirect(user.role));
  }

  return (
    <main className="page auth-page">
      <div className="container auth-shell">
        <section className="stack auth-intro">
          <p className="eyebrow">Create a Kickstart account</p>
          <h1>Start hiring or find your next opportunity.</h1>
          <p className="lead">
            Choose the workspace you need. You can begin immediately.
          </p>
        </section>

        <form className="card stack-lg auth-form" onSubmit={handleSubmit}>
          <section className="grid grid-2">
            <button
              className={`card stack role-option ${role === "applicant" ? "selected" : ""}`}
              type="button"
              onClick={() => setRole("applicant")}
              aria-pressed={role === "applicant"}
            >
              <p className="meta-label">Applicant account</p>
              <h3>Browse paid opportunities</h3>
              <p className="muted">
                Browse every active role, apply, and track employer decisions.
              </p>
            </button>

            <button
              className={`card stack role-option ${role === "employer" ? "selected" : ""}`}
              type="button"
              onClick={() => setRole("employer")}
              aria-pressed={role === "employer"}
            >
              <p className="meta-label">Employer account</p>
              <h3>Hire and develop interns</h3>
              <p className="muted">
                Publish opportunities, review applicants, and track development.
              </p>
            </button>
          </section>

          <section className="grid grid-2">
            <label>
              Name <span className="required-label">Required</span>
              <input
                className="input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: undefined }));
                }}
                placeholder="Gerti Kida"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "register-name-error" : undefined}
              />
              {errors.name ? <span id="register-name-error" className="field-error">{errors.name}</span> : null}
            </label>

            <label>
              Email <span className="required-label">Required</span>
              <input
                className="input"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined }));
                }}
                placeholder="gerti@example.com"
                type="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
              />
              {errors.email ? <span id="register-email-error" className="field-error">{errors.email}</span> : null}
            </label>
          </section>

          <button className="btn" type="submit">
            Create {role} account
          </button>

        </form>
      </div>
    </main>
  );
}
