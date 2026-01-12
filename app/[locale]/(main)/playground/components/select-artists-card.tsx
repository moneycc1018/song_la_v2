"use client";

import { useState } from "react";

import { CircleMinusIcon, CirclePlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ArtistType } from "@/types/ytmusic.type";

import { cn } from "@/lib/utils";

interface SelectArtistsCardProps {
  artistData: ArtistType[];
  selectedArtists: ArtistType[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<ArtistType[]>>;
}

function SelectArtistsCard(props: SelectArtistsCardProps) {
  const { artistData, selectedArtists, setSelectedArtists } = props;
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const t = useTranslations("playground.artist");

  function handleSelect(artist: ArtistType) {
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
  const availableArtists = artistData.filter(
    (artist) => !selectedArtists.some((selected) => selected.id === artist.id),
  );

  function handleSelectAll() {
    setSelectedArtists(artistData);
  }

  function handleRemoveAll() {
    setSelectedArtists([]);
  }

  return (
    <Accordion
      type="single"
      defaultValue="artist"
      className="bg-card text-card-foreground h-fit w-full rounded-xl border shadow-[0_0_2px]"
      collapsible
    >
      <AccordionItem value="artist" className="border-b-0">
        <AccordionTrigger className="cursor-pointer px-4 hover:no-underline">
          {t("title")} ({selectedArtists.length}/{artistData.length})
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1 px-4 pb-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="bg-background border-foreground flex h-9 w-full items-center gap-1 rounded-md border shadow-[0_0_2px]">
              <Input
                className="border-0 pr-1 focus-visible:ring-0"
                placeholder={t("placeholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onBlur={() => setOpen(false)}
              />
              <button className="hover:text-destructive mr-2" onClick={() => setInputValue("")}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="cursor-pointer" onClick={handleSelectAll}>
                <CirclePlusIcon />
                <span>{t("selectAll")}</span>
              </Button>
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive cursor-pointer"
                onClick={handleRemoveAll}
              >
                <CircleMinusIcon />
                <span>{t("removeAll")}</span>
              </Button>
            </div>
          </div>
          <div className="relative">
            {availableArtists.length > 0 && (
              <div
                className={cn(
                  "border-foreground bg-background absolute z-10 max-h-[180px] w-full overflow-hidden rounded-md border font-medium shadow-[0_0_2px] select-none",
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
          {selectedArtists.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedArtists.map((artist) => (
                <Badge key={artist.id} className="gap-2 py-1 pr-2 pl-3">
                  {artist.name}
                  <button className="rounded-full outline-none" onClick={() => handleRemove(artist.id)}>
                    <XIcon size={16} className="text-primary-foreground hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export { SelectArtistsCard };
