"use client";

interface Props {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: Props) {
  return <>{children}</>;