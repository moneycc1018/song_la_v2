"use server";

import * as ytmusicService from "@/lib/services/ytmusic.service";
import { CreateTrackInput, UpdateTrackTagsInput } from "@/lib/services/ytmusic.service";

// 新增歌曲
export async function createTracks(data: CreateTrackInput[]) {
  try {
    const result = await ytmusicService.createTracks(data);

    if (result.duplicates.length > 0) {
      return {
        success: false,
        error: "Duplicate tracks found",
        duplicates: result.duplicates,
      };
    }

    return { success: true, data: result.created };
  } catch (error) {
    console.error("Failed to create tracks:", error);
    return { success: false, error: "Failed to create tracks" };
  }
}

// 更新歌曲標籤
export async function updateTracksTags(data: UpdateTrackTagsInput[]) {
  try {
    const result = await ytmusicService.updateTracksTags(data);

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update track tags:", error);
    return { success: false, error: "Failed to update track tags" };
  }
}

// 移除歌曲
export async function deleteTracks(videoIds: string[]) {
  try {
    await ytmusicService.deleteTracks(videoIds);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete tracks:", error);
    return { success: false, error: "Failed to delete tracks" };
  }
}
