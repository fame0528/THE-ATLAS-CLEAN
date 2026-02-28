import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE ATLAS — Clean Mission Control",
  description: "Local-first swarm control panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}