/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { SearchDataType } from "@/types/ytmusic.type";

import { getYoutubeClient } from "@/lib/youtube";

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

    const songs = shelf.contents.slice(0, 10);

    const enrichedSongs: SearchDataType[] = await Promise.all(
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

        // Process Release Year
        let release_year: number | undefined;
        if (albumData) {
          const subtitleRuns = albumData.header?.subtitle?.runs || [];
          const yearStr = subtitleRuns.find((run: any) => /^\d{4}$/.test(run.text))?.text;
          if (yearStr) release_year = parseInt(yearStr, 10);
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
          artists: enrichedArtists,
          release_year,
          lyrics,
        };
      }),
    );

    return NextResponse.json(enrichedSongs);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
