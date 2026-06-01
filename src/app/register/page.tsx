"use client";

import { FormEvent, useState } from "react";
import {
  getDefaultRedirect,
  registerDemoUser,
  type DemoRole,
} from "@/lib/auth-store";

export default function RegisterPage() {
  const [role, setRole] = useState<DemoRole>("applicant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = registerDemoUser({
      name,
      email,
      role,
    });

    window.location.assign(getDefaultRedirect(user.role));
  }

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="stack">
          <p className="eyebrow">Demo signup</p>
          <h1>Create demo account</h1>
          <p className="lead">
            This signup is local-only for the prototype. It stores a demo user
            in your browser and sends you into the correct flow.
          </p>
        </section>

        <form className="card stack-lg" onSubmit={handleSubmit}>
          <section className="grid grid-2">
            <button
              className={`card stack ${role === "applicant" ? "blueprint" : ""}`}
              type="button"
              onClick={() => setRole("applicant")}
              style={{ textAlign: "left" }}
            >
              <p className="eyebrow">Applicant</p>
              <h3>I want opportunities</h3>
              <p className="muted">
                Apply first. The intern workspace unlocks after acceptance.
              </p>
            </button>

            <button
              className={`card stack ${role === "employer" ? "blueprint" : ""}`}
              type="button"
              onClick={() => setRole("employer")}
              style={{ textAlign: "left" }}
            >
              <p className="eyebrow">Employer</p>
              <h3>I want to review talent</h3>
              <p className="muted">
                Review applicants, accept one, and track their progress.
              </p>
            </button>
          </section>

          <section className="grid grid-2">
            <label>
              Name
              <input
                className="input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Gerti Kida"
              />
            </label>

            <label>
              Email
              <input
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="gerti@example.com"
                type="email"
              />
            </label>
          </section>

          <button className="btn" type="submit">
            Create demo account
          </button>

          <div className="row">
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                const user = registerDemoUser({
                  name: "Demo Applicant",
                  email: "applicant@kickstart.local",
                  role: "applicant",
                });

                window.location.assign(getDefaultRedirect(user.role));
              }}
            >
              Quick signup as Applicant
            </button>

            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                const user = registerDemoUser({
                  name: "Demo Employer",
                  email: "employer@kickstart.local",
                  role: "employer",
                });

                window.location.assign(getDefaultRedirect(user.role));
              }}
            >
              Quick signup as Employer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
