import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// GET /api/tasks
// Returns recent tasks from local DB
export async function GET() {
  try {
    const db = getDB();
    const tasks = db.getTasks(50);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST /api/tasks
// Enqueue a new task for an agent
export async function POST(request: NextRequest) {
  const token = request.headers.get("X-ATLAS-TOKEN");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = token.slice(0, 8);

  try {
    const body = await request.json();
    const { agent_id, payload } = body;

    if (!agent_id || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Missing agent_id or invalid payload' },
        { status: 400 }
      );
    }

    const db = getDB();
    const taskId = db.createTask(agent_id, payload);

    return NextResponse.json({ taskId, status: "queued" });
  } catch (error: any) {
    console.error("Task creation failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}