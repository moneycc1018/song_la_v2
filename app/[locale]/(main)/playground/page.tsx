import * as ytmusicService from "@/lib/services/ytmusic.service";

import { PlaygroundArea } from "./components/playground-area";

export default async function PlaygroundPage() {
  const artistData = await ytmusicService.getAllUniqueArtists();
  const tagData = await ytmusicService.getAllTags();

  return <PlaygroundArea artistData={artistData} tagData={tagData} />;
}
