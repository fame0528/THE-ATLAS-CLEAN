"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Clock, Search, Zap } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Agents", href: "/agents", icon: Users },
  { name: "Tasks", href: "/tasks", icon: Clock },
  { name: "Memories", href: "/memories", icon: Search },
  { name: "Actions", href: "/actions", icon: Zap },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r border-atlas-border bg-atlas-surface p-4 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-bold">THE ATLAS</h1>
        <p className="text-atlas-muted text-xs">Clean Mission Control</p>
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  isActive
                    ? "bg-atlas-border text-atlas-text"
                    : "text-atlas-muted hover:bg-atlas-border hover:text-atlas-text"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
