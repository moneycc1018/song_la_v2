import { Innertube } from "youtubei.js";

async function youtubeClientSingleton() {
  return await Innertube.create({
    lang: "zh-TW",
    retrieve_player: false, // 如果不需要解密影片串流，設為 false 可加速
  });
}

const globalForYoutube = global as unknown as { youtube: Innertube };

export const youtube = globalForYoutube.youtube ?? (await youtubeClientSingleton());

if (process.env.NODE_ENV !== "production") globalForYoutube.youtube = youtube;
