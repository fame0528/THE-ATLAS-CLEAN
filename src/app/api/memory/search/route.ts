import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Placeholder implementation: local file-based document store
// Mnemosyne will enhance this with real OpenClaw memory_search integration and local embeddings.
// For MVP: documents stored as JSON array in data/documents.json with { id, content, embedding? }.

const DOCS_PATH = join(process.cwd(), "data", "documents.json");

function loadDocuments() {
  if (!existsSync(DOCS_PATH)) {
    return [];
  }
  try {
    const raw = readFileSync(DOCS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDocuments(docs: Array<{ id: string; content: string }>) {
  const dir = require("path").dirname(DOCS_PATH);
  if (!require("fs").existsSync(dir)) {
    require("fs").mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DOCS_PATH, JSON.stringify(docs, null, 2));
}

// Simple keyword search (fallback until embeddings integrated)
function searchDocuments(query: string, docs: Array<{ id: string; content: string }>) {
  const terms = query.toLowerCase().split(/\s+/);
  const scored = docs.map((doc) => {
    const content = doc.content.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (content.includes(term) ? 1 : 0), 0);
    return { doc, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  return scored.map(item => ({
    id: item.doc.id,
    snippet: item.doc.content.slice(0, 200) + (item.doc.content.length > 200 ? "..." : ""),
    score: item.score,
  }));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter: q" },
      { status: 400 }
    );
  }

  const docs = loadDocuments();
  const results = searchDocuments(q, docs);

  return NextResponse.json({ query: q, results });
}

// Admin: add document (auth later)
export async function POST(req: NextRequest) {
  // TODO: auth for future write endpoint
  const body = await req.json();
  const { content } = body;

  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid content" },
      { status: 400 }
    );
  }

  const docs = loadDocuments();
  const newDoc = {
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    content: content.trim(),
  };
  docs.push(newDoc);
  saveDocuments(docs);

  return NextResponse.json({ success: true, id: newDoc.id });
}
