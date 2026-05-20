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
          { href: "/employee/tasks", label: "Employee Tasks" },
          { href: "/employee/progress", label: "Progress" }
        );
      }

      return applicantLinks;
    }

    return [
      { href: "/employer/applicants", label: "Review Applicants" },
      { href: "/employer/employees", label: "Employee Progress" },
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
            Kickstart
          </Link>

          <div className="nav-actions">
            <span className="badge">{roleLabel(user)}</span>

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

        <div className="nav-links">
          <span className="nav-label">
            {user?.role === "employer" ? "Employer flow" : "Applicant flow"}
          </span>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`btn ${isActive(pathname, link.href) ? "" : "ghost"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {user?.role === "applicant" && !hasPlacement ? (
          <p className="muted" style={{ fontSize: 13 }}>
            Employee tasks unlock after the employer accepts your application.
          </p>
        ) : null}
      </div>
    </header>
  );
}