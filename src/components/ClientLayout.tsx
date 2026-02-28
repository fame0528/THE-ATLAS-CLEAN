"use client";

import { NavSidebar } from "@/components/NavSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-atlas-bg text-atlas-text">
        <NavSidebar />
        <main className="ml-64 p-8">{children}</main>
      </body>
    </html>
  );
}
