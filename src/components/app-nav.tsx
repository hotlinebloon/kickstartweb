"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout, type DemoUser } from "@/lib/auth-store";
import { getState } from "@/lib/demo-store";
import { KickstartLogo } from "@/components/kickstart-logo";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function roleLabel(user: DemoUser) {
  return user.role === "applicant" ? "Applicant account" : "Employer account";
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
        { href: "/#lifecycle", label: "Hiring process" },
        { href: "/#development", label: "Intern development" },
        { href: "/applicant/opportunities", label: "Opportunities" },
      ];
    }

    if (user.role === "applicant") {
      const applicantLinks = [
        { href: "/applicant/opportunities", label: "Opportunities" },
        { href: "/applicant/applications", label: "Applications" },
      ];

      if (hasPlacement) {
        applicantLinks.push(
          { href: "/employee/tasks", label: "Placement tasks" },
          { href: "/employee/progress", label: "Development record" }
        );
      }

      return applicantLinks;
    }

    return [
      { href: "/employer/opportunities", label: "Opportunities" },
      { href: "/employer/applicants", label: "Applicants" },
      { href: "/employer/employees", label: "Active interns" },
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
        <div className="nav-main">
          <Link href="/" className="logo">
            <KickstartLogo />
            <span className="sr-only">Kickstart home</span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
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

          <div className="nav-actions">
            {user ? (
              <>
                <span className="role-chip">
                  <strong>{user.name}</strong>
                  <span>{roleLabel(user)}</span>
                </span>
                <button className="nav-account-action" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-account-action">
                  Log in
                </Link>

                <Link href="/register" className="nav-primary-action">
                  Create employer account
                </Link>
              </>
            )}
          </div>
        </div>

        {user?.role === "applicant" && !hasPlacement ? (
          <p className="nav-hint">
            Tasks and feedback appear here after your first placement.
          </p>
        ) : null}
      </div>
    </header>
  );
}
