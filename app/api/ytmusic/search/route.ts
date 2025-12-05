/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { SearchDataType } from "@/types/ytmusic.types";

import getYoutubeClient from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const youtube = await getYoutubeClient();

    const result = await youtube.music.search(query, { type: "song" });
    const shelf = result.contents?.[0];

    if (!shelf || !shelf.contents) {
      return NextResponse.json([]);
    }

    const responseData: SearchDataType[] = shelf.contents.slice(0, 10).map((song: any) => {
      return {
        video_id: song.id,
        track_name: song.title,
        artists:
          song.artists?.map((artist: any) => ({
            id: artist.channel_id,
            name: artist.name,
          })) || [],
        album: {
          id: song.album?.id,
          name: song.album?.name,
        },
        duration: song.duration?.seconds,
        thumbnail: song.thumbnail?.contents?.[0]?.url,
      };
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
