/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackData } from "@/types/ytmusic.type";

import { prisma } from "@/lib/prisma";

// Input types for CRUD
export type CreateTrackInput = TrackData;

// Only tags can be updated
export interface UpdateTrackTagsInput {
  video_id: string;
  tags: string[];
}

const mapDbToTrackData = (dbTrack: any): TrackData => {
  return {
    video_id: dbTrack.video_id,
    track_name: dbTrack.track_name,
    artists: dbTrack.ytmusic_track_artists.map((a: any) => ({
      id: a.artist_id,
      name: a.artist_name,
    })),
    album: {
      id: dbTrack.album_id,
      name: dbTrack.album_name,
    },
    release_year: dbTrack.release_year ?? undefined,
    tags: (dbTrack.tags as string[]) ?? [],
    lyrics: dbTrack.lyrics ?? undefined,
  };
};

// 新增歌曲
export async function createTracks(
  dataList: CreateTrackInput[],
): Promise<{ created: TrackData[]; duplicates: string[] }> {
  const videoIds = dataList.map((d) => d.video_id);

  // Check for duplicates
  const existingTracks = await prisma.ytmusic_info.findMany({
    select: { video_id: true, track_name: true },
    where: {
      video_id: { in: videoIds },
    },
  });

  if (existingTracks.length > 0) {
    return {
      created: [],
      duplicates: existingTracks.map((t) => t.track_name),
    };
  }

  // Proceed with creation if no duplicates
  return await prisma.$transaction(async (tx) => {
    const results: TrackData[] = [];

    for (const data of dataList) {
      const track = await tx.ytmusic_info.create({
        data: {
          video_id: data.video_id,
          track_name: data.track_name,
          album_id: data.album.id,
          album_name: data.album.name,
          release_year: data.release_year,
          tags: data.tags ?? [],
          lyrics: data.lyrics,
          ytmusic_track_artists: {
            create: data.artists.map((artist) => ({
              artist_id: artist.id,
              artist_name: artist.name,
            })),
          },
        },
        include: {
          ytmusic_track_artists: true,
        },
      });
      results.push(mapDbToTrackData(track));
    }
    return { created: results, duplicates: [] };
  });
}

// 查詢歌曲
export async function getTracks(query?: string) {
  const whereClause = query
    ? {
        OR: [
          { track_name: { contains: query, mode: "insensitive" as const } },
          { album_name: { contains: query, mode: "insensitive" as const } },
          {
            ytmusic_track_artists: {
              some: {
                artist_name: { contains: query, mode: "insensitive" as const },
              },
            },
          },
        ],
      }
    : {};

  const tracks = await prisma.ytmusic_info.findMany({
    include: {
      ytmusic_track_artists: true,
    },
    where: whereClause,
    orderBy: {
      release_year: "desc",
    },
  });
  return tracks.map(mapDbToTrackData);
}

// 更新歌曲標籤
export async function updateTracksTags(dataList: UpdateTrackTagsInput[]) {
  const updatedDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const results = [];
    for (const data of dataList) {
      const track = await tx.ytmusic_info.update({
        data: {
          tags: data.tags,
          updated_at: updatedDate,
        },
        include: {
          ytmusic_track_artists: true,
        },
        where: { video_id: data.video_id },
      });
      results.push(mapDbToTrackData(track));
    }
    return results;
  });
}

// 移除歌曲
export async function deleteTracks(videoIds: string[]) {
  return await prisma.ytmusic_info.deleteMany({
    where: {
      video_id: {
        in: videoIds,
      },
    },
  });
}

// 根據歌手 ID 列表查詢歌曲
export async function getTracksByArtists(artistIds: string[]) {
  const tracks = await prisma.ytmusic_info.findMany({
    where: {
      ytmusic_track_artists: {
        some: {
          artist_id: {
            in: artistIds,
          },
        },
      },
    },
    include: {
      ytmusic_track_artists: true,
    },
  });

  return tracks.map(mapDbToTrackData);
}

// 查詢歌手
export async function getAllUniqueArtists() {
  const artists = await prisma.ytmusic_track_artists.findMany({
    distinct: ["artist_id"],
    select: {
      artist_id: true,
      artist_name: true,
    },
    orderBy: {
      artist_name: "asc",
    },
  });

  return artists.map((a) => ({
    id: a.artist_id,
    name: a.artist_name,
  }));
}
