import { generateOpportunityParams } from "@/lib/opportunity-params";
import { FocusedApplyClient } from "./focused-apply-client";

export const generateStaticParams = generateOpportunityParams;

export default async function FocusedApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <FocusedApplyClient id={id} />;
}
