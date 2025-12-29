import { NextRequest, NextResponse } from "next/server";

import { youtube } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("q");

  if (!videoId) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const result = await youtube.music.getLyrics(videoId);

    const responseData = {
      lyrics: result?.description.text,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
