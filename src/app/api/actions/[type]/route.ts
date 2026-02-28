import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { authMiddleware, logAudit } from "@/lib/auth";

const execFileAsync = promisify(execFile);

// Ares-approved safe actions only. No arbitrary commands.
const ALLOWED_ACTIONS: Record<string, { cmd: string; args: string[] }> = {
  "restart-gateway": {
    cmd: "pm2",
    args: ["restart", "openclaw-gateway"],
  },
  "savepoint-stop": {
    // Path to the savepoint batch file (verify existence on target machine)
    cmd: "C:\\Path\\To\\Stop_OpenClaw_Savepoint.bat",
    args: [],
  },
  "index-memory": {
    // Re-run OpenClaw memory index (adjust to actual CLI)
    cmd: "npx",
    args: ["openclaw", "memory", "index"],
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  return authMiddleware(req, async (req) => {
    const { type } = params;
    const action = ALLOWED_ACTIONS[type];

    if (!action) {
      return NextResponse.json(
        { error: `Unknown action: ${type}` },
        { status: 400 }
      );
    }

    // Execute command
    try {
      const { stdout, stderr } = await execFileAsync(action.cmd, action.args, {
        maxBuffer: 1024 * 1024, // 1MB
        timeout: 30000,
      });

      await logAudit(req, "action_exec", { type, stdout, stderr });

      return NextResponse.json({
        success: true,
        type,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
      });
    } catch (err: any) {
      await logAudit(req, "action_failed", { type, error: err.message });
      return NextResponse.json(
        { error: `Action failed: ${err.message}`, type },
        { status: 500 }
      );
    }
  });
}
