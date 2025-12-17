"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import * as ytmusicService from "@/lib/services/ytmusic.service";
import { CreateTrackInput, UpdateTrackTagsInput } from "@/lib/services/ytmusic.service";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!userEmail || userEmail !== adminEmail) {
    throw new Error("Unauthorized: You are not an admin.");
  }
}

// 新增歌曲
export async function createTracks(data: CreateTrackInput[]) {
  try {
    await checkAdmin();
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
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create tracks" };
  }
}

// 更新歌曲標籤
export async function updateTracksTags(data: UpdateTrackTagsInput[]) {
  try {
    await checkAdmin();
    const result = await ytmusicService.updateTracksTags(data);

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update track tags:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update track tags" };
  }
}

// 移除歌曲
export async function deleteTracks(videoIds: string[]) {
  try {
    await checkAdmin();
    await ytmusicService.deleteTracks(videoIds);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete tracks:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete tracks" };
  }
}
