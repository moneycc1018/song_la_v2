"use client";

import { useState } from "react";

import { CircleMinusIcon, CirclePlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { TagType } from "@/types/ytmusic.type";

import { cn } from "@/lib/utils";

interface SelectTagsCardProps {
  tagData: TagType[];
  selectedTags: TagType[];
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
}

function SelectTagsCard(props: SelectTagsCardProps) {
  const { tagData, selectedTags, setSelectedTags } = props;
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const t = useTranslations("playground.tag");

  const activeTags = tagData.filter((tag) => !tag.deprecated);

  function handleSelect(tag: TagType) {
    setSelectedTags((prev) => {
      if (prev.some((t) => t.id === tag.id)) return prev;
      return [...prev, tag];
    });
    setOpen(false);
    setInputValue("");
  }

  function handleRemove(tagId: number) {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  }

  // Filter out already selected tags from the list
  const availableTags = activeTags.filter((tag) => !selectedTags.some((selected) => selected.id === tag.id));

  function handleSelectAll() {
    setSelectedTags(activeTags);
  }

  function handleRemoveAll() {
    setSelectedTags([]);
  }

  return (
    <Accordion
      type="single"
      defaultValue="tag"
      className="bg-card text-card-foreground h-fit w-full rounded-xl border shadow-[0_0_2px]"
      collapsible
    >
      <AccordionItem value="tag" className="border-b-0">
        <AccordionTrigger className="cursor-pointer px-4 hover:no-underline">
          {t("title")} ({selectedTags.length}/{activeTags.length})
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1 px-4 pb-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="bg-background border-foreground flex h-9 w-full items-center gap-2 rounded-md border shadow-[0_0_2px]">
              <Input
                className="border-0 focus-visible:ring-0"
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
            {availableTags.length > 0 && (
              <div
                className={cn(
                  "border-foreground bg-background absolute z-10 max-h-[180px] w-full overflow-hidden rounded-md border font-medium shadow-[0_0_2px] select-none",
                  open ? "block" : "hidden",
                )}
              >
                <ScrollArea className={cn("flex flex-col", availableTags.length > 4 ? "h-[180px]" : "h-auto")}>
                  {availableTags
                    .filter((tag) => tag.name.includes(inputValue))
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="hover:bg-primary hover:text-background cursor-pointer px-3 py-2"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(tag);
                        }}
                      >
                        {tag.name}
                      </div>
                    ))}
                </ScrollArea>
              </div>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag.id} className="gap-2 py-1 pr-2 pl-3">
                  {tag.name}
                  <button className="rounded-full outline-none" onClick={() => handleRemove(tag.id)}>
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

export { SelectTagsCard };
