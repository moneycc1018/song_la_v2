/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { getYoutubeClient } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("q");

  if (!videoId) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const youtube = await getYoutubeClient();

    const result = await youtube.music.getInfo(videoId);
    const basic = result.basic_info;
    const upNextTab = await result.getUpNext();
    const currentItem = upNextTab.contents[0] as any;

    const responseData = {
      video_id: basic.id,
      track_name: basic.title,
      artists: currentItem?.artists?.map((artist: any) => ({
        id: artist.channel_id,
        name: artist.name,
      })) || [{ id: basic.channel_id, name: basic.author }],
      album: currentItem?.album
        ? {
            name: currentItem.album.name,
            id: currentItem.album.id,
            year: currentItem.album.year,
          }
        : null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
