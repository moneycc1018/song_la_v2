"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import * as ytmusicService from "@/lib/services/ytmusic.service";
import { CreateTrackInput, UpdateTrackTagsInput } from "@/lib/services/ytmusic.service";

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userEmail = session?.user?.email;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!userEmail || userEmail !== adminEmail) {
    throw new Error("Unauthorized: You are not an admin.");
  }
}

// 批量新增歌曲
export async function createTracks(data: CreateTrackInput[]) {
  try {
    await checkAdmin();
    const result = await ytmusicService.createTracks(data);

    if (result.duplicates.length > 0) {
      return {
        success: false,
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

// 批量更新歌曲標籤
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

// 批量移除歌曲
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

// 新增標籤
export async function createTag(tagName: string) {
  try {
    await checkAdmin();
    const result = await ytmusicService.createTag(tagName);

    if (result.duplicate) {
      return { success: false, duplicate: result.duplicate };
    }

    return { success: true, data: result.created };
  } catch (error) {
    console.error("Failed to create tag:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to create tag" };
  }
}

// 更新標籤
export async function updateTag(tagId: number, tagName: string) {
  try {
    await checkAdmin();
    const result = await ytmusicService.updateTag(tagId, tagName);

    if (result.duplicate) {
      return { success: false, duplicate: result.duplicate };
    }

    return { success: true, data: result.updated };
  } catch (error) {
    console.error("Failed to update tag:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to update tag" };
  }
}

// 批量刪除標籤(棄用)
export async function deleteTags(tagIds: number[]) {
  try {
    await checkAdmin();
    await ytmusicService.deleteTags(tagIds);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete tags:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete tags" };
  }
}
