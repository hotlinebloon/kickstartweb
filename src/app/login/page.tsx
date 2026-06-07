"use client";

import { useState } from "react";
import {
  getDefaultRedirect,
  loginAs,
  type DemoRole,
} from "@/lib/auth-store";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<DemoRole>("employer");

  function handleLogin(role: DemoRole) {
    const user = loginAs(role);
    window.location.assign(getDefaultRedirect(user.role));
  }

  return (
    <main className="page auth-page">
      <div className="container auth-shell">
        <section className="stack auth-intro">
          <p className="eyebrow">Sign in to Kickstart</p>
          <h1>Continue your hiring or opportunity search.</h1>
          <p className="lead">
            Employers can manage roles and develop interns. Applicants can
            browse every open opportunity and track their applications.
          </p>
        </section>

        <div className="auth-choice">
          <section className="grid grid-2">
            <button
              type="button"
              className={`card stack role-option ${
                selectedRole === "applicant" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("applicant")}
              aria-pressed={selectedRole === "applicant"}
            >
              <p className="meta-label">Applicant account</p>
              <h2>Browse opportunities</h2>
              <p className="muted">
                Explore every open role and apply with relevant evidence.
              </p>
            </button>

            <button
              type="button"
              className={`card stack role-option ${
                selectedRole === "employer" ? "selected" : ""
              }`}
              onClick={() => setSelectedRole("employer")}
              aria-pressed={selectedRole === "employer"}
            >
              <p className="meta-label">Employer account</p>
              <h2>Hire and develop interns</h2>
              <p className="muted">
                Publish opportunities, compare applicants, and support active placements.
              </p>
            </button>
          </section>

          <section className="auth-action">
            <button className="btn" type="button" onClick={() => handleLogin(selectedRole)}>
              Open {selectedRole === "applicant" ? "opportunities" : "applicants"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
