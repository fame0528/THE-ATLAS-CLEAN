'use client';

export default function QuickActions() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-col gap-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Sync Nexus
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Index Memory
        </button>
        <button className="px-4 py-2 bg-danger text-danger-foreground rounded">
          Restart Gateway
        </button>
      </div>
    </div>
  );
}
