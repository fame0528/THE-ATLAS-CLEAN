import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder: real queue from `/api/queue`
  const queue = {
    depth: 0,
    recentTasks: [],
  };
  return NextResponse.json(queue);
}