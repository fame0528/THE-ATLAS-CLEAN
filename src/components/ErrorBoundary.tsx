'use client';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  // In Next.js 14+, use client component with error boundary
  // This is a simplified wrapper; actual boundary uses `useEffect` to catch errors
  return <>{children}</>;
}
