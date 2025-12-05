import { NextRequest, NextResponse } from "next/server";

import getYoutubeClient from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const artistId = searchParams.get("q");

  if (!artistId) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const youtube = await getYoutubeClient();

    const result = await youtube.music.getArtist(artistId);

    const responseData = {
      artist_id: artistId,
      artist_name: result.header?.title?.text,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
