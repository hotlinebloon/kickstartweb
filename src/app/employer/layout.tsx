import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer workspace",
};

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
