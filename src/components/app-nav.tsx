"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout, type DemoUser } from "@/lib/auth-store";
import { getState } from "@/lib/demo-store";
import { KickstartLogo } from "@/components/kickstart-logo";

function isActive(pathname: string, href: string) {
  return pathname === href;
}

function roleLabel(user: DemoUser | null) {
  if (!user) return "Not logged in";
  return user.role === "applicant"
    ? `Applicant · ${user.name}`
    : `Employer · ${user.name}`;
}

function roleContext(user: DemoUser | null, hasPlacement: boolean) {
  if (!user) return "Public access";
  if (user.role === "applicant") {
    return hasPlacement ? "Applicant account · Intern workspace unlocked" : "Applicant account";
  }
  return "Employer account";
}

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<DemoUser | null>(null);
  const [hasPlacement, setHasPlacement] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const state = getState();

    setUser(currentUser);

    const placement = state.placements.find(
      (item) =>
        item.applicantId === state.applicant.id && item.status === "active"
    );

    setHasPlacement(Boolean(placement));
  }, [pathname]);

  const links = useMemo(() => {
    if (!user) {
      return [
        { href: "/", label: "Home" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Signup" },
      ];
    }

    if (user.role === "applicant") {
      const applicantLinks = [
        { href: "/applicant/opportunities", label: "Opportunities" },
        { href: "/applicant/applications", label: "Applications" },
      ];

      if (hasPlacement) {
        applicantLinks.push(
          { href: "/employee/tasks", label: "Intern tasks" },
          { href: "/employee/progress", label: "Intern progress" }
        );
      }

      return applicantLinks;
    }

    return [
      { href: "/employer/applicants", label: "Review applicants" },
      { href: "/employer/employees", label: "Monitor interns" },
    ];
  }, [user, hasPlacement]);

  function handleLogout() {
    logout();
    setUser(null);
    router.push("/login");
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-top">
          <Link href="/" className="logo">
            <KickstartLogo />
            <span>Kickstart</span>
          </Link>

          <div className="nav-actions">
            <span className="role-chip">
              <span className="role-chip-context">{roleContext(user, hasPlacement)}</span>
              <span>{roleLabel(user)}</span>
            </span>

            {user ? (
              <button className="btn secondary" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="btn secondary">
                  Login
                </Link>

                <Link href="/register" className="btn">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <span className="nav-label">
            {user?.role === "employer" ? "Employer workspace" : "Applicant workspace"}
          </span>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive(pathname, link.href) ? "active" : ""}`}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user?.role === "applicant" && !hasPlacement ? (
          <p className="muted" style={{ fontSize: 13 }}>
            Intern workspace unlocks after an employer accepts your application.
          </p>
        ) : null}
      </div>
    </header>
  );
}
