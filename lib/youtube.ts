import { Innertube } from "youtubei.js";

const globalForYoutube = global as unknown as {
  youtubeClient: Innertube | undefined;
};

const getYoutubeClient = async () => {
  if (globalForYoutube.youtubeClient) {
    return globalForYoutube.youtubeClient;
  }

  const newClient = await Innertube.create({
    retrieve_player: false, // 如果不需要解密影片串流(只查資料)，設為 false 可以加速初始化
  });

  if (process.env.NODE_ENV !== "production") {
    globalForYoutube.youtubeClient = newClient;
  }

  return newClient;
};

export default getYoutubeClient;
