import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kickstart | Find and develop future talent",
    template: "%s | Kickstart",
  },
  description:
    "Kickstart helps employers find promising interns, review real evidence, and develop future talent.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppNav />
        {children}
      </body>
    </html>
  );
}
