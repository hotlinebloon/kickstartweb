"use client";

import { useState } from "react";
import {
  getDefaultRedirect,
  loginAs,
  type DemoRole,
} from "@/lib/auth-store";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<DemoRole>("applicant");

  function handleLogin(role: DemoRole) {
    const user = loginAs(role);
    window.location.assign(getDefaultRedirect(user.role));
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="stack">
          <p className="eyebrow">Demo login</p>
          <h1>Choose your role</h1>
          <p className="lead">
            Log in as an applicant or employer. Applicants get an intern
            workspace only after an employer accepts them.
          </p>
        </section>

        <section className="grid grid-2">
          <button
            type="button"
            className={`card stack ${
              selectedRole === "applicant" ? "blueprint" : ""
            }`}
            onClick={() => setSelectedRole("applicant")}
            style={{ textAlign: "left" }}
          >
            <p className="eyebrow">Applicant</p>
            <h2>Find and apply</h2>
            <p className="muted">
              Browse opportunities, open a role, and submit Apply with proof.
            </p>
          </button>

          <button
            type="button"
            className={`card stack ${
              selectedRole === "employer" ? "blueprint" : ""
            }`}
            onClick={() => setSelectedRole("employer")}
            style={{ textAlign: "left" }}
          >
            <p className="eyebrow">Employer</p>
            <h2>Review and accept</h2>
            <p className="muted">
              Review structured applications, accept applicants, and track
              progress.
            </p>
          </button>
        </section>

        <section className="card stack">
          <h3>
            Continue as{" "}
            {selectedRole === "applicant" ? "Applicant" : "Employer"}
          </h3>

          <button
            className="btn"
            type="button"
            onClick={() => handleLogin(selectedRole)}
          >
            Login
          </button>

          <div className="row">
            <button
              className="btn secondary"
              type="button"
              onClick={() => handleLogin("applicant")}
            >
              Login as Applicant
            </button>

            <button
              className="btn secondary"
              type="button"
              onClick={() => handleLogin("employer")}
            >
              Login as Employer
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
