/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { SearchDataType } from "@/types/ytmusic.type";

import youtube from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const result = await youtube.music.search(query, { type: "song" });
    const shelf = result.contents?.[0];

    if (!shelf || !shelf.contents) {
      return NextResponse.json([]);
    }

    const songs = shelf.contents.filter((song: any) => !!song.id).slice(0, 10);

    if (songs.length === 0) {
      return NextResponse.json([]);
    }

    const responseData: SearchDataType[] = await Promise.all(
      songs.map(async (song: any) => {
        // Basic Info
        const basicData = {
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

        // Fetch Additional Info in Parallel
        const [lyricsData, albumData, ...artistsData] = await Promise.all([
          // 1. Get Lyrics
          song.id ? youtube.music.getLyrics(song.id).catch(() => null) : Promise.resolve(null),

          // 2. Get Album (for Release Year)
          song.album?.id ? youtube.music.getAlbum(song.album.id).catch(() => null) : Promise.resolve(null),

          // 3. Get Artists (for Unified Name)
          ...(basicData.artists.map((artist: any) =>
            artist.id ? youtube.music.getArtist(artist.id).catch(() => null) : Promise.resolve(null),
          ) || []),
        ]);

        // Process Lyrics
        const lyrics = lyricsData?.description?.text;

        // Process Release Year & Album Name
        let release_year: number | undefined;
        let album_name = basicData.album.name;

        if (albumData) {
          const subtitleRuns = albumData.header?.subtitle?.runs || [];
          const yearStr = subtitleRuns.find((run: any) => /^\d{4}年?$/.test(run.text))?.text;
          if (yearStr) release_year = parseInt(yearStr.replace("年", ""), 10);

          if (albumData.header?.title?.text) {
            album_name = albumData.header.title.text;
          }
        }

        // Process Artists Names
        const enrichedArtists = basicData.artists.map((artist: any, index: number) => {
          const artistDetail = artistsData[index];
          if (artistDetail && artistDetail.header?.title?.text) {
            return { ...artist, name: artistDetail.header.title.text };
          }
          return artist;
        });

        return {
          ...basicData,
          album: {
            ...basicData.album,
            name: album_name,
          },
          artists: enrichedArtists,
          release_year,
          lyrics,
        };
      }),
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
