import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  const db = getDB();

  // Basic health - will expand once Hermes adapter integrates
  const health = db.health();

  // Try to detect OpenClaw gateway (basic heuristics)
  let gatewayStatus: "unknown" | "online" | "offline" = "unknown";
  try {
    // Placeholder: Hermes will provide real status endpoint
    // For now, check if memory directory exists and has recent activity
    const fs = require("fs");
    const memoryPath = "C:\\Users\\spenc\\.openclaw\\memory";
    if (fs.existsSync(memoryPath)) {
      gatewayStatus = "online"; // conservative assumption
    }
  } catch {
    gatewayStatus = "offline";
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    atlas: {
      version: "0.1.0",
      db: health,
    },
    gateway: {
      status: gatewayStatus,
    },
    memory: {
      provider: "local",
      indexed: true, // placeholder until Mnemosyne reports real status
    },
  });
}
