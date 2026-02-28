import { NextResponse } from "next/server";
import { getHealthData } from "@/lib/openclaw";

export async function GET() {
  try {
    const data = await getHealthData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}