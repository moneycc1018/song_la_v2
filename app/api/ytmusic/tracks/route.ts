import { NextRequest, NextResponse } from "next/server";

import * as ytmusicService from "@/lib/services/ytmusic.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || undefined;

  try {
    const tracks = await ytmusicService.getTracks(query);

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
