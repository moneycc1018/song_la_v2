import { NextRequest, NextResponse } from "next/server";

import * as ytmusicService from "@/lib/services/ytmusic.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || undefined;

  try {
    const tags = await ytmusicService.getTags(query);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
