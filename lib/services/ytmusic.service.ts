/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackType } from "@/types/ytmusic.type";

import { prisma } from "@/lib/prisma";

export type CreateTrackInput = TrackType;

export interface UpdateTrackTagsInput {
  video_id: string;
  tags: number[];
}

const mapDbToTrackData = (dbTrack: any): TrackType => {
  return {
    video_id: dbTrack.video_id,
    track_name: dbTrack.track_name,
    artists: dbTrack.ytmusic_track_artists.map((ta: any) => ({
      id: ta.ytmusic_artists.artist_id,
      name: ta.ytmusic_artists.artist_name,
    })),
    album: {
      id: dbTrack.album_id,
      name: dbTrack.album_name,
    },
    release_year: dbTrack.release_year ?? undefined,
    tags: dbTrack.ytmusic_track_tags.map((tt: any) => ({
      id: tt.ytmusic_tags.id,
      name: tt.ytmusic_tags.tag_name,
    })),
    lyrics: dbTrack.lyrics ?? undefined,
  };
};

// 新增歌曲
export async function createTracks(
  dataList: CreateTrackInput[],
): Promise<{ created: TrackType[]; duplicates: string[] }> {
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

  // Proceed with creation
  return await prisma.$transaction(
    async (tx) => {
      const results: TrackType[] = [];

      for (const data of dataList) {
        // 1. Create or ensure Artists exist
        for (const artist of data.artists) {
          // Upsert artist
          await tx.ytmusic_artists.upsert({
            where: { artist_id: artist.id },
            update: { artist_name: artist.name }, // Update name if changed
            create: {
              artist_id: artist.id,
              artist_name: artist.name,
            },
          });
        }

        // 2. Create Track Info
        const track = await tx.ytmusic_info.create({
          data: {
            video_id: data.video_id,
            track_name: data.track_name,
            album_id: data.album.id,
            album_name: data.album.name,
            release_year: data.release_year,
            lyrics: data.lyrics,
            // Create Artist Relations
            ytmusic_track_artists: {
              create: data.artists.map((artist) => ({
                artist_id: artist.id,
              })),
            },
          },
          include: {
            ytmusic_track_artists: {
              include: { ytmusic_artists: true },
            },
            ytmusic_track_tags: {
              include: { ytmusic_tags: true },
            },
          },
        });

        // Re-read to get full relation data including the just-added tags
        const fullTrack = await tx.ytmusic_info.findUnique({
          where: { video_id: track.video_id },
          include: {
            ytmusic_track_artists: {
              include: { ytmusic_artists: true },
            },
            ytmusic_track_tags: {
              include: { ytmusic_tags: true },
            },
          },
        });

        if (fullTrack) {
          results.push(mapDbToTrackData(fullTrack));
        }
      }
      return { created: results, duplicates: [] };
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
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
                ytmusic_artists: {
                  artist_name: { contains: query, mode: "insensitive" as const },
                },
              },
            },
          },
        ],
      }
    : {};

  const tracks = await prisma.ytmusic_info.findMany({
    include: {
      ytmusic_track_artists: {
        include: { ytmusic_artists: true },
      },
      ytmusic_track_tags: {
        include: { ytmusic_tags: true },
      },
    },
    where: whereClause,
    orderBy: [{ release_year: "desc" }, { track_name: "asc" }],
  });
  return tracks.map(mapDbToTrackData);
}

// Filter tracks by Artists AND Tags (Intersection)
export async function getGameTracks(artistIds: string[], tagIds: number[]) {
  const andConditions: any[] = [];

  if (artistIds.length > 0) {
    andConditions.push({
      ytmusic_track_artists: {
        some: {
          artist_id: {
            in: artistIds,
          },
        },
      },
    });
  }

  if (tagIds.length > 0) {
    andConditions.push({
      ytmusic_track_tags: {
        some: {
          tag_id: { in: tagIds },
        },
      },
    });
  }

  const tracks = await prisma.ytmusic_info.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    include: {
      ytmusic_track_artists: {
        include: { ytmusic_artists: true },
      },
      ytmusic_track_tags: {
        include: { ytmusic_tags: true },
      },
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
      // 1. Delete existing tag relations
      await tx.ytmusic_track_tags.deleteMany({
        where: { video_id: data.video_id },
      });

      // 2. Create new relations
      // Assuming data.tags are Tag IDs
      if (data.tags && data.tags.length > 0) {
        await tx.ytmusic_track_tags.createMany({
          data: data.tags.map((tagId) => ({
            video_id: data.video_id,
            tag_id: tagId,
          })),
        });
      }

      // 3. Update timestamp
      await tx.ytmusic_info.update({
        data: {
          updated_at: updatedDate,
        },
        where: { video_id: data.video_id },
      });

      // 4. Return updated track
      const track = await tx.ytmusic_info.findUnique({
        where: { video_id: data.video_id },
        include: {
          ytmusic_track_artists: {
            include: { ytmusic_artists: true },
          },
          ytmusic_track_tags: {
            include: { ytmusic_tags: true },
          },
        },
      });

      if (track) {
        results.push(mapDbToTrackData(track));
      }
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
      ytmusic_track_artists: {
        include: { ytmusic_artists: true },
      },
      ytmusic_track_tags: {
        include: { ytmusic_tags: true },
      },
    },
  });

  return tracks.map(mapDbToTrackData);
}

// 查詢歌手
export async function getAllUniqueArtists() {
  const artists = await prisma.ytmusic_artists.findMany({
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

// 查詢標籤
export async function getAllTags() {
  const tags = await prisma.ytmusic_tags.findMany({
    select: {
      id: true,
      tag_name: true,
      deprecated: true,
      _count: {
        select: {
          ytmusic_track_tags: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return tags.map((t) => ({
    id: t.id,
    name: t.tag_name,
    deprecated: t.deprecated,
    track_count: t._count.ytmusic_track_tags,
  }));
}

// 新增標籤
export async function createTag(tagName: string) {
  const existingTag = await prisma.ytmusic_tags.findUnique({
    where: { tag_name: tagName },
  });

  if (existingTag) {
    return { success: false, error: "Tag already exists" };
  }

  const newTag = await prisma.ytmusic_tags.create({
    data: {
      tag_name: tagName,
    },
  });

  return { success: true, data: { id: newTag.id, name: newTag.tag_name } };
}

// 更新標籤
export async function updateTag(tagId: number, tagName: string) {
  const existingTag = await prisma.ytmusic_tags.findUnique({
    where: { tag_name: tagName },
  });

  if (existingTag && existingTag.id !== tagId) {
    return { success: false, error: "Tag already exists" };
  }

  const updatedTag = await prisma.ytmusic_tags.update({
    where: { id: tagId },
    data: {
      tag_name: tagName,
      deprecated: false,
      updated_at: new Date(),
    },
  });

  return { success: true, data: { id: updatedTag.id, name: updatedTag.tag_name } };
}

// 批量刪除標籤 (軟刪除)
export async function deleteTags(tagIds: number[]) {
  const updatedDate = new Date();

  return await prisma.$transaction(async (tx) => {
    // 1. Remove relations from tracks
    await tx.ytmusic_track_tags.deleteMany({
      where: { tag_id: { in: tagIds } },
    });

    // 2. Mark tags as deprecated
    await tx.ytmusic_tags.updateMany({
      where: { id: { in: tagIds } },
      data: {
        deprecated: true,
        updated_at: updatedDate,
      },
    });

    return { success: true };
  });
}
