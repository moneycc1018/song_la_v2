"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Artist } from "@/types/ytmusic.type";

import { cn } from "@/lib/utils";

interface SelectArtistsAreaProps {
  selectedArtists: Artist[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
}

function SelectArtistsArea(props: SelectArtistsAreaProps) {
  const { selectedArtists, setSelectedArtists } = props;
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const { data: queryResult = [] } = useQuery<Artist[]>({
    queryKey: ["artists"],
    queryFn: async () => {
      const response = await fetch("/api/ytmusic/artists");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();

      return result;
    },
  });

  function handleSelect(artist: Artist) {
    setSelectedArtists((prev) => {
      if (prev.some((a) => a.id === artist.id)) return prev;
      return [...prev, artist];
    });
    setOpen(false);
    setInputValue("");
  }

  function handleRemove(artistId: string) {
    setSelectedArtists((prev) => prev.filter((artist) => artist.id !== artistId));
  }

  // Filter out already selected artists from the list
  const availableArtists = queryResult.filter(
    (artist) => !selectedArtists.some((selected) => selected.id === artist.id),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Artists</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="bg-background border-foreground flex w-full items-center gap-2 rounded-md border">
          <Input
            className="border-0 focus-visible:ring-0"
            placeholder="Artist Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
          <button className="hover:text-destructive mr-2" onClick={() => setInputValue("")}>
            <XIcon />
          </button>
        </div>
        <div className="relative">
          {availableArtists.length > 0 && (
            <div
              className={cn(
                "border-foreground bg-background absolute z-10 h-[180px] w-full overflow-hidden rounded-md border select-none",
                open ? "block" : "hidden",
              )}
            >
              <ScrollArea className={cn("flex flex-col", availableArtists.length > 4 ? "h-[180px]" : "h-auto")}>
                {availableArtists
                  .filter((artist) => artist.name.includes(inputValue))
                  .map((artist) => (
                    <div
                      key={artist.id}
                      className="hover:bg-primary hover:text-background cursor-pointer px-3 py-2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(artist);
                      }}
                    >
                      {artist.name}
                    </div>
                  ))}
              </ScrollArea>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedArtists.map((artist) => (
            <Badge key={artist.id} variant="secondary" className="gap-1 pr-1">
              {artist.name}
              <button
                className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                onClick={() => handleRemove(artist.id)}
              >
                <XIcon className="text-muted-foreground hover:text-foreground h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { SelectArtistsArea };
