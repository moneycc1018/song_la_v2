import { NextResponse } from "next/server";

import * as ytmusicService from "@/lib/services/ytmusic.service";

export async function GET() {
  try {
    const tags = await ytmusicService.getAllTags();

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
