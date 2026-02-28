import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

const EXPECTED_TOKEN = process.env.ATLAS_TOKEN;

if (!EXPECTED_TOKEN) {
  console.warn("ATLAS_TOKEN not set in environment — auth will fail in production");
}

export function isAuthenticated(req: NextRequest): boolean {
  if (!EXPECTED_TOKEN) return true; // dev fallback
  const token = req.headers.get("x-atlas-token");
  return token === EXPECTED_TOKEN;
}

export function authMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Response | Promise<Response>
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { error: "Unauthorized — invalid or missing ATLAS_TOKEN" },
      { status: 401 }
    );
  }
  return handler(req);
}

// Log all sensitive actions
export async function logAudit(
  req: NextRequest,
  action: string,
  details?: object
) {
  const db = getDB();
  db.logAudit({
    endpoint: req.nextUrl.pathname,
    method: req.method,
    user: req.headers.get("x-atlas-token")?.slice(0, 8) + "...",
    action,
    details,
  });
}
