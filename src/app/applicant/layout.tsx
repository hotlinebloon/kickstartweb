import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applicant workspace",
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
