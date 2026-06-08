import { generateOpportunityParams } from "@/lib/opportunity-params";
import { QuickApplyClient } from "./quick-apply-client";

export const generateStaticParams = generateOpportunityParams;

export default async function QuickApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <QuickApplyClient id={id} />;
}
