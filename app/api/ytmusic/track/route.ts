/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { youtube } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("q");

  if (!videoId) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const result = await youtube.music.getInfo(videoId);
    const basic = result.basic_info;
    const upNextTab = await result.getUpNext();
    const currentItem = upNextTab.contents?.find((item: any) => item.video_id === basic.id) as any;

    // Construct basic artists list
    const basicArtists = currentItem?.artists?.map((artist: any) => ({
      id: artist.channel_id,
      name: artist.name,
    })) || [
      {
        id: basic.channel_id,
        name: currentItem?.author || basic.author,
      },
    ];

    // Construct basic album info
    const basicAlbum = currentItem?.album
      ? {
          id: currentItem.album.id,
          name: currentItem.album.name,
        }
      : null;

    // Parallel Fetching: Lyrics, Album, Artists
    const [lyricsData, albumData, ...artistsData] = await Promise.all([
      // 1. Get Lyrics
      videoId ? youtube.music.getLyrics(videoId).catch(() => null) : Promise.resolve(null),

      // 2. Get Album (for Release Year and better name)
      basicAlbum?.id ? youtube.music.getAlbum(basicAlbum.id).catch(() => null) : Promise.resolve(null),

      // 3. Get Artists (for Unified Name)
      ...(basicArtists.map((artist: any) =>
        artist.id ? youtube.music.getArtist(artist.id).catch(() => null) : Promise.resolve(null),
      ) || []),
    ]);

    // Process Lyrics
    const lyrics = lyricsData?.description?.text;

    // Process Release Year & Album Name
    let release_year: number | undefined;
    if (currentItem?.album?.year) {
      const y = parseInt(currentItem.album.year, 10);
      if (!isNaN(y)) release_year = y;
    }

    let album_name = basicAlbum?.name;

    if (albumData) {
      const subtitleRuns = albumData.header?.subtitle?.runs || [];
      const yearStr = subtitleRuns.find((run: any) => /^\d{4}年?$/.test(run.text))?.text;
      if (yearStr) release_year = parseInt(yearStr.replace("年", ""), 10);

      if (albumData.header?.title?.text) {
        album_name = albumData.header.title.text;
      }
    }

    // Process Artists Names
    const enrichedArtists = basicArtists.map((artist: any, index: number) => {
      const artistDetail = artistsData[index];
      if (artistDetail && artistDetail.header?.title?.text) {
        return { ...artist, name: artistDetail.header.title.text };
      }
      return artist;
    });

    const responseData = {
      video_id: basic.id,
      track_name: currentItem?.title?.text || basic.title,
      artists: enrichedArtists,
      album: basicAlbum
        ? {
            id: basicAlbum.id,
            name: album_name,
          }
        : null,
      duration: currentItem?.duration ? parseInt(currentItem.duration.seconds) : basic.duration,
      thumbnail: basic.thumbnail?.[0]?.url,
      release_year,
      lyrics,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
