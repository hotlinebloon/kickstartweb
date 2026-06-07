"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatDate,
  getApplicationStatusLabel,
  getState,
  updateOpportunityPreference,
  type Application,
  type DemoState,
  type Opportunity,
} from "@/lib/demo-store";
import {
  Badge,
  EmptyState,
  LoadingState,
  StatusBadge,
} from "@/components/ui";

type OpportunityTypeFilter = "all" | Opportunity["type"];
type WorkModeFilter = "all" | Opportunity["workMode"];
type ViewFilter = "all" | "recommended" | "saved" | "not_applied";
type SortOption = "match" | "deadline" | "title";

function getApplicationTone(status: Application["status"]) {
  if (status === "accepted") return "success";
  if (status === "rejected") return "danger";
  if (status === "shortlisted" || status === "under_review") return "info";
  return "neutral";
}

function getMatchCount(opportunity: Opportunity, applicantSkills: string[]) {
  const skills = new Set(applicantSkills.map((skill) => skill.toLowerCase()));
  return opportunity.skills.filter((skill) => skills.has(skill.toLowerCase())).length;
}

function daysUntil(dateString: string) {
  const deadline = new Date(`${dateString}T23:59:59`);
  return Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86400000));
}

export default function OpportunitiesPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityTypeFilter>("all");
  const [workModeFilter, setWorkModeFilter] = useState<WorkModeFilter>("all");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [sort, setSort] = useState<SortOption>("match");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setState(getState());
  }, []);

  const applicantApplications = useMemo(() => {
    if (!state) return [];
    return state.applications.filter(
      (application) => application.applicantId === state.applicant.id
    );
  }, [state]);

  const applicationByOpportunity = useMemo(
    () =>
      new Map(
        applicantApplications.map((application) => [
          application.opportunityId,
          application,
        ])
      ),
    [applicantApplications]
  );

  const filteredOpportunities = useMemo(() => {
    if (!state) return [];

    const normalizedQuery = query.trim().toLowerCase();
    const savedIds = new Set(state.savedOpportunityIds);

    return state.opportunities
      .filter((opportunity) => {
        if ((opportunity.status ?? "active") !== "active") return false;
        const matchCount = getMatchCount(opportunity, state.applicant.skills);
        const searchableText = [
          opportunity.title,
          opportunity.type,
          opportunity.location,
          opportunity.workMode,
          opportunity.description,
          ...opportunity.skills,
        ]
          .join(" ")
          .toLowerCase();

        if (normalizedQuery && !searchableText.includes(normalizedQuery)) return false;
        if (typeFilter !== "all" && opportunity.type !== typeFilter) return false;
        if (workModeFilter !== "all" && opportunity.workMode !== workModeFilter) return false;
        if (viewFilter === "recommended" && matchCount === 0) return false;
        if (viewFilter === "saved" && !savedIds.has(opportunity.id)) return false;
        if (viewFilter === "not_applied" && applicationByOpportunity.has(opportunity.id)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "deadline") return a.deadline.localeCompare(b.deadline);
        if (sort === "title") return a.title.localeCompare(b.title);
        return (
          getMatchCount(b, state.applicant.skills) -
            getMatchCount(a, state.applicant.skills) ||
          a.deadline.localeCompare(b.deadline)
        );
      });
  }, [
    applicationByOpportunity,
    query,
    sort,
    state,
    typeFilter,
    viewFilter,
    workModeFilter,
  ]);

  function toggleSaved(opportunityId: string) {
    if (!state) return;
    const isSaved = state.savedOpportunityIds.includes(opportunityId);
    setState(
      updateOpportunityPreference({
        opportunityId,
        preference: isSaved ? "clear" : "saved",
      })
    );
    setNotice(isSaved ? "Role removed from saved opportunities." : "Role saved.");
  }

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
    setWorkModeFilter("all");
    setViewFilter("all");
    setSort("match");
  }

  if (!state) {
    return (
      <main className="page">
        <div className="container">
          <LoadingState label="Loading opportunities" />
        </div>
      </main>
    );
  }

  const hasActiveFilters =
    query ||
    typeFilter !== "all" ||
    workModeFilter !== "all" ||
    viewFilter !== "all";

  return (
    <main className="page">
      <div className="container stack-lg">
        <section className="opportunity-dashboard-header">
          <div className="stack">
            <p className="eyebrow">Open opportunities</p>
            <h1>Find your next opportunity.</h1>
            <p className="lead">
              Search every paid role, project, and internship. Review the full
              details before deciding where to apply.
            </p>
          </div>
        </section>

        {notice ? (
          <div className="notice notice-actions" role="status">
            <span>{notice}</span>
            <button className="btn secondary" type="button" onClick={() => setNotice("")}>
              Dismiss message
            </button>
          </div>
        ) : null}

        <section className="opportunity-toolbar" aria-label="Opportunity filters">
          <label className="opportunity-search">
            <span>Search opportunities</span>
            <input
              className="input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, skill, location, or keyword"
            />
          </label>

          <details className="opportunity-filter-disclosure">
            <summary>Filter and sort opportunities</summary>
          <div className="opportunity-filter-grid">
            <label>
              Opportunity type
              <select
                className="input"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as OpportunityTypeFilter)
                }
              >
                <option value="all">All types</option>
                <option value="Internship">Internships</option>
                <option value="Micro-project">Micro-projects</option>
                <option value="Entry-level">Entry-level roles</option>
              </select>
            </label>

            <label>
              Work mode
              <select
                className="input"
                value={workModeFilter}
                onChange={(event) =>
                  setWorkModeFilter(event.target.value as WorkModeFilter)
                }
              >
                <option value="all">All work modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </label>

            <label>
              Show
              <select
                className="input"
                value={viewFilter}
                onChange={(event) => setViewFilter(event.target.value as ViewFilter)}
              >
                <option value="all">All opportunities</option>
                <option value="recommended">Matching my skills</option>
                <option value="saved">Saved opportunities</option>
                <option value="not_applied">Not applied yet</option>
              </select>
            </label>

            <label>
              Sort by
              <select
                className="input"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                <option value="match">Best skill match</option>
                <option value="deadline">Deadline soonest</option>
                <option value="title">Title A to Z</option>
              </select>
            </label>
          </div>
          </details>
        </section>

        <div className="opportunity-results-heading">
          <div>
            <h2>
              {filteredOpportunities.length}{" "}
              {filteredOpportunities.length === 1 ? "opportunity" : "opportunities"}
            </h2>
            <p className="muted">
              Open any role to review the full details and application requirements.
            </p>
          </div>

          <div className="row">
            {hasActiveFilters ? (
              <button className="btn secondary" type="button" onClick={clearFilters}>
                Clear filters
              </button>
            ) : null}
            <Link className="btn secondary" href="/applicant/applications">
              Track applications
            </Link>
          </div>
        </div>

        {filteredOpportunities.length === 0 ? (
          <EmptyState
            title="No opportunities match these filters"
            description="Try a broader search or clear the filters to see every open role."
            action={
              <button className="btn" type="button" onClick={clearFilters}>
                Show all opportunities
              </button>
            }
          />
        ) : (
          <section className="opportunity-grid" aria-label="Available opportunities">
            {filteredOpportunities.map((opportunity) => {
              const application = applicationByOpportunity.get(opportunity.id);
              const matchCount = getMatchCount(opportunity, state.applicant.skills);
              const isSaved = state.savedOpportunityIds.includes(opportunity.id);
              const remainingDays = daysUntil(opportunity.deadline);

              return (
                <article key={opportunity.id} className="opportunity-card">
                  <div className="opportunity-card-top">
                    <div className="opportunity-company-mark" aria-hidden="true">
                      {state.company.name.slice(0, 1)}
                    </div>
                    <button
                      className={`save-opportunity-button ${isSaved ? "saved" : ""}`}
                      type="button"
                      aria-pressed={isSaved}
                      onClick={() => toggleSaved(opportunity.id)}
                    >
                      {isSaved ? "Remove saved role" : "Save role"}
                    </button>
                  </div>

                  <div className="stack-sm">
                    <div className="row">
                      <Badge>{opportunity.type}</Badge>
                      <Badge>{opportunity.workMode}</Badge>
                      {matchCount > 0 ? (
                        <Badge tone="accent">
                          {matchCount} skill {matchCount === 1 ? "match" : "matches"}
                        </Badge>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="opportunity-card-title">{opportunity.title}</h3>
                      <p className="muted">
                        {state.company.name} · {opportunity.location}
                      </p>
                    </div>
                  </div>

                  <p className="opportunity-card-description">{opportunity.description}</p>

                  <div className="opportunity-skill-list" aria-label="Required skills">
                    {opportunity.skills.map((skill) => (
                      <span
                        key={skill}
                        className={
                          state.applicant.skills.some(
                            (applicantSkill) =>
                              applicantSkill.toLowerCase() === skill.toLowerCase()
                          )
                            ? "matched"
                            : ""
                        }
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="opportunity-card-footer">
                    <div className="opportunity-deadline">
                      <span>Apply by {formatDate(opportunity.deadline)}</span>
                      <strong>
                        {remainingDays === 0
                          ? "Closes today"
                          : `${remainingDays} days remaining`}
                      </strong>
                    </div>

                    {application ? (
                      <StatusBadge tone={getApplicationTone(application.status)}>
                        {getApplicationStatusLabel(application.status)}
                      </StatusBadge>
                    ) : null}
                  </div>

                  <Link
                    className={application ? "btn secondary" : "btn"}
                    href={`/applicant/opportunities/${opportunity.id}`}
                  >
                    {application ? "View opportunity details" : "Review opportunity"}
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
