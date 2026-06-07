import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intern development",
};

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
