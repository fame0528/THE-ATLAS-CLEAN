import { NextResponse } from "next/server";
import { getHealthData } from "@/lib/openclaw";

export async function GET() {
  const data = await getHealthData();
  return NextResponse.json({ success: true, status: data });
}