import { NavSidebar } from "@/components/NavSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-atlas-bg text-atlas-text">
      <NavSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
