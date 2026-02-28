import { readFile, appendFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

const LOG_DIR = process.env.AUDIT_LOG_DIR || join(process.cwd(), 'data', 'audit');
const LOG_FILE = join(LOG_DIR, 'audit.log');

/**
 * Ensure audit log directory exists
 */
async function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true });
  }
}

/**
 * Log a sensitive action to the audit trail
 *
 * @param action - Action performed (e.g., "restart-gateway")
 * @param userId - Token prefix or user identifier (first 8 chars)
 * @param details - Additional context (endpoint, method, etc.)
 * @param result - "success" or "error"
 * @param errorMessage - Optional error message if result is "error"
 */
export async function logAction(
  action: string,
  userId: string,
  details: { endpoint?: string; method?: string; [key: string]: any } = {},
  result: 'success' | 'error' = 'success',
  errorMessage?: string
) {
  try {
    await ensureLogDir();

    const entry = {
      timestamp: new Date().toISOString(),
      userId: userId?.slice(0, 8) || 'unknown',
      action,
      result,
      ...details,
      ...(errorMessage && { error_message: errorMessage }),
    };

    await appendFile(LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (err: any) {
    // Audit failures should not crash the app, but log to console
    console.error('[AUDIT LOGGING FAILED]', err);
  }
}

/**
 * Read recent audit log entries
 *
 * @param limit - Maximum number of entries to return (default 100)
 * @returns Array of parsed audit log entries (newest last)
 */
export async function getAuditLog(limit = 100): Promise<any[]> {
  try {
    await ensureLogDir();
    const data = await readFile(LOG_FILE, 'utf-8');
    const lines = data.trim().split('\n').filter(line => line.trim());

    // Return last N entries
    const recentLines = lines.slice(-limit);
    return recentLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        // Malformed line - skip
        return { timestamp: null, action: 'PARSE_ERROR', raw: line };
      }
    });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return []; // No log file yet
    }
    throw err;
  }
}

/**
 * Clear audit log (dangerous - only for emergency/reset)
 * WARNING: This deletes all audit history!
 */
export async function clearAuditLog() {
  await ensureLogDir();
  const { unlink } = await import('fs/promises');
  try {
    await unlink(LOG_FILE);
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err;
  }
}
