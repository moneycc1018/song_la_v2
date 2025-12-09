"use client";

import { useState } from "react";

import { Artist } from "@/types/ytmusic.type";

import { SelectArtistsArea } from "./select-artists-area";
import { SelectTagsArea } from "./select-tags-area";

function GameArea() {
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectArtistsArea selectedArtists={selectedArtists} setSelectedArtists={setSelectedArtists} />
      <SelectTagsArea />
    </div>
  );
}

export { GameArea };
