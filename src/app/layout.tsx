import type { Metadata, Viewport } from "next";

import "./globals.css";

import { AppShell } from "@/src/presentation/layout/app-shell";
import { WorkspaceProvider } from "@/src/presentation/providers/workspace-provider";

export const metadata: Metadata = {
  title: {
    default: "Legacy House",
    template: "%s · Legacy House",
  },
  description: "Groomed Gent Co. Product Intelligence OS",
  icons: { icon: "/emblem" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050506",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <WorkspaceProvider>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
