"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { TrackData } from "@/types/ytmusic.type";
import { Artist } from "@/types/ytmusic.type";

import { GameArea } from "./game-area";
import { SelectArtistsArea } from "./select-artists-area";
import { SelectTagsArea } from "./select-tags-area";

function PlaygroundArea() {
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [playlist, setPlaylist] = useState<TrackData[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const artistIdsString = selectedArtists.map((a) => a.id).join("!@!");

  // Reset game state when artists change
  useEffect(() => {
    setPlaylist([]);
    setCurrentTrack(null);
    setPlayedIds(new Set());
  }, [selectedArtists]);

  // 根據所選歌手取得歌曲
  const { refetch, isFetching } = useQuery({
    queryKey: ["game-tracks", artistIdsString],
    queryFn: async () => {
      const response = await fetch(`/api/ytmusic/tracks?artistIds=${artistIdsString}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return response.json() as Promise<TrackData[]>;
    },
    enabled: false,
    retry: false,
  });

  // 洗亂歌曲順序
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  };

  // 播放下一首歌曲
  const handleNextTrack = async () => {
    if (selectedArtists.length === 0) {
      alert("Please select at least one artist.");
      return;
    }

    // 1. Try to get from current playlist
    if (playlist.length > 0) {
      const nextTrack = playlist[0];
      const remainingPlaylist = playlist.slice(1);

      setPlaylist(remainingPlaylist);
      setCurrentTrack(nextTrack);
      setPlayedIds((prev) => new Set(prev).add(nextTrack.video_id));

      return;
    }

    // 2. Playlist is empty.
    // If we have already played some songs, it means we have exhausted the previous fetch.
    if (playedIds.size > 0) {
      alert("No more songs available for selected artists!");
      setCurrentTrack(null);
      return;
    }

    // 3. First time start (playedIds is empty), so fetch tracks.
    try {
      const { data: tracks, isSuccess, isError, error } = await refetch();

      if (isSuccess && tracks) {
        // Filter out already played tracks (though playedIds is likely empty here due to reset)
        const newTracks = tracks.filter((track) => !playedIds.has(track.video_id));

        if (newTracks.length === 0) {
          alert("No songs found for these artists!");
          setCurrentTrack(null);
        } else {
          const shuffled = shuffleArray(newTracks);

          const nextTrack = shuffled[0];
          const remainingPlaylist = shuffled.slice(1);

          setPlaylist(remainingPlaylist);
          setCurrentTrack(nextTrack);
          setPlayedIds((prev) => new Set(prev).add(nextTrack.video_id));
        }
      } else if (isError) {
        alert(error.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GameArea currentTrack={currentTrack} onNext={handleNextTrack} />
      <div className="grid grid-cols-2 gap-4">
        <SelectArtistsArea selectedArtists={selectedArtists} setSelectedArtists={setSelectedArtists} />
        <SelectTagsArea />
      </div>
      {isFetching && <div className="text-muted-foreground text-center text-sm">Loading tracks...</div>}
    </div>
  );
}

export { PlaygroundArea };
