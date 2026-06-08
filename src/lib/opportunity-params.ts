export const opportunityIds = [
  "opp-frontend-intern",
  "opp-data-assistant",
  "opp-ux-research",
  "opp-qa-tester",
  "opp-content-creator",
  "opp-support-associate",
  "opp-finance-operations",
  "opp-community-coordinator",
] as const;

export function generateOpportunityParams() {
  return opportunityIds.map((id) => ({ id }));
}
