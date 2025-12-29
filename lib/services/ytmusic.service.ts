/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrackType } from "@/types/ytmusic.type";

import { prisma } from "@/lib/prisma";

export type CreateTrackInput = TrackType;

export interface UpdateTrackTagsInput {
  video_id: string;
  tags: number[];
}

// 將資料庫歌曲資料轉換為TrackType
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
    tags: dbTrack.ytmusic_track_tags
      .map((tt: any) => ({
        id: tt.ytmusic_tags.id,
        name: tt.ytmusic_tags.tag_name,
      }))
      .sort((t1: any, t2: any) => t1.id - t2.id),
    lyrics: dbTrack.lyrics ?? undefined,
  };
};

// 批量新增歌曲
export async function createTracks(
  dataList: CreateTrackInput[],
): Promise<{ created: TrackType[]; duplicates: string[] }> {
  const videoIds = dataList.map((d) => d.video_id);

  // 檢查是否有重複歌曲
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

  // 新增歌曲
  return await prisma.$transaction(
    async (tx) => {
      const result: TrackType[] = [];

      for (const data of dataList) {
        // 1. 新增或更新歌手
        for (const artist of data.artists) {
          await tx.ytmusic_artists.upsert({
            where: { artist_id: artist.id },
            update: { artist_name: artist.name },
            create: {
              artist_id: artist.id,
              artist_name: artist.name,
            },
          });
        }

        // 2. 新增歌曲資訊
        const newTrack = await tx.ytmusic_info.create({
          data: {
            video_id: data.video_id,
            track_name: data.track_name,
            album_id: data.album.id,
            album_name: data.album.name,
            release_year: data.release_year,
            lyrics: data.lyrics,
            // 3. 新增歌手與歌曲的關聯
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

        // 取得完整的歌曲資訊
        const fullTrack = await tx.ytmusic_info.findUnique({
          where: { video_id: newTrack.video_id },
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
          result.push(mapDbToTrackData(fullTrack));
        }
      }

      return { created: result, duplicates: [] };
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

// 查詢歌曲
export async function getTracks(query?: string) {
  // 搜尋條件
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

  // 查詢歌曲
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

// 查詢歌曲(by artistIds, tagIds)
export async function getGameTracks(artistIds: string[], tagIds: number[]) {
  const andConditions: any[] = [];

  // 篩選條件(artistIds)
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

  // 篩選條件(tagIds)
  if (tagIds.length > 0) {
    andConditions.push({
      ytmusic_track_tags: {
        some: {
          tag_id: { in: tagIds },
        },
      },
    });
  }

  // 查詢歌曲
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

// 批量更新歌曲標籤
export async function updateTracksTags(dataList: UpdateTrackTagsInput[]) {
  const updatedDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const result = [];

    for (const data of dataList) {
      // 1. 刪除所有歌曲與標籤的關聯
      await tx.ytmusic_track_tags.deleteMany({
        where: { video_id: data.video_id },
      });

      // 2. 新增歌曲與標籤的關聯
      if (data.tags && data.tags.length > 0) {
        await tx.ytmusic_track_tags.createMany({
          data: data.tags.map((tagId) => ({
            video_id: data.video_id,
            tag_id: tagId,
          })),
        });
      }

      // 3. 更新歌曲資訊的更新時間
      await tx.ytmusic_info.update({
        data: {
          updated_at: updatedDate,
        },
        where: { video_id: data.video_id },
      });

      // 4. 取得完整的歌曲資訊
      const fullTrack = await tx.ytmusic_info.findUnique({
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

      if (fullTrack) {
        result.push(mapDbToTrackData(fullTrack));
      }
    }

    return result;
  });
}

// 批量移除歌曲
export async function deleteTracks(videoIds: string[]) {
  return await prisma.ytmusic_info.deleteMany({
    where: {
      video_id: {
        in: videoIds,
      },
    },
  });
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
    orderBy: [{ deprecated: "asc" }, { tag_name: "asc" }],
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
  // 檢查是否有重複標籤
  const existingTag = await prisma.ytmusic_tags.findUnique({
    where: { tag_name: tagName },
  });

  if (existingTag) {
    return { duplicate: tagName };
  }

  // 新增標籤
  const newTag = await prisma.ytmusic_tags.create({
    data: {
      tag_name: tagName,
    },
  });

  return { created: { id: newTag.id, name: newTag.tag_name } };
}

// 更新標籤
export async function updateTag(tagId: number, tagName: string) {
  // 檢查是否有重複標籤
  const existingTag = await prisma.ytmusic_tags.findUnique({
    where: { tag_name: tagName },
  });

  if (existingTag && existingTag.id !== tagId) {
    return { duplicate: tagName };
  }

  // 更新標籤
  const updatedTag = await prisma.ytmusic_tags.update({
    where: { id: tagId },
    data: {
      tag_name: tagName,
      deprecated: false,
      updated_at: new Date(),
    },
  });

  return { updated: { id: updatedTag.id, name: updatedTag.tag_name } };
}

// 批量刪除標籤 (棄用)
export async function deleteTags(tagIds: number[]) {
  const updatedDate = new Date();

  return await prisma.$transaction(async (tx) => {
    // 1. 刪除歌曲與標籤的關聯
    await tx.ytmusic_track_tags.deleteMany({
      where: { tag_id: { in: tagIds } },
    });

    // 2. 將標籤標記為已棄用
    await tx.ytmusic_tags.updateMany({
      where: { id: { in: tagIds } },
      data: {
        deprecated: true,
        updated_at: updatedDate,
      },
    });
  });
}
