import { NextResponse } from "next/server";

import * as ytmusicService from "@/lib/services/ytmusic.service";

export async function GET() {
  try {
    const artists = await ytmusicService.getAllUniqueArtists();

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
