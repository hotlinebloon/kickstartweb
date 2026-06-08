import { OpportunityDetailClient } from "./opportunity-detail-client";

export function generateStaticParams() {
  return [
    { id: "opp-frontend-intern" },
    { id: "opp-data-assistant" },
  ];
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OpportunityDetailClient id={id} />;
}
