import { NextRequest, NextResponse } from "next/server";

import { getYoutubeClient } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const albumId = searchParams.get("q");

  if (!albumId) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const youtube = await getYoutubeClient();

    const result = await youtube.music.getAlbum(albumId);
    const subtitleRuns = result.header?.subtitle?.runs || [];
    const year = subtitleRuns.find((run) => /^\d{4}$/.test(run.text))?.text;

    const responseData = {
      album_id: albumId,
      album_name: result.header?.title?.text,
      release_year: year,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
