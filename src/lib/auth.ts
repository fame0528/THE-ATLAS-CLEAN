import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(request: NextRequest) {
  const token = request.headers.get("x-atlas-token") ?? request.cookies.get("atlas-token")?.value;
  const expected = process.env.ATLAS_TOKEN;

  if (!expected) {
    console.warn("ATLAS_TOKEN not set in environment");
  }

  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}