import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { authMiddleware, logAudit } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const db = getDB();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const agentId = searchParams.get("agent_id");

  let tasks;
  if (agentId) {
    const stmt = db.prepare(
      "SELECT * FROM tasks WHERE agent_id = ? ORDER BY created_at DESC LIMIT ?"
    );
    tasks = stmt.all(agentId, limit);
  } else {
    tasks = db.getTasks(limit);
  }

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  return authMiddleware(req, async (req) => {
    const db = getDB();
    const body = await req.json();

    const { agent_id, payload } = body;

    if (!agent_id || !payload) {
      return NextResponse.json(
        { error: "Missing required fields: agent_id, payload" },
        { status: 400 }
      );
    }

    const taskId = db.createTask(agent_id, payload);

    await logAudit(req, "task_create", { taskId, agent_id });

    return NextResponse.json({ success: true, taskId });
  });
}
