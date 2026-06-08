import { generateOpportunityParams } from "@/lib/opportunity-params";
import { OpportunityDetailClient } from "./opportunity-detail-client";

export const generateStaticParams = generateOpportunityParams;

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OpportunityDetailClient id={id} />;
}
