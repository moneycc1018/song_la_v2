"use client";

import { useEffect, useState, useTransition } from "react";

import { useQuery } from "@tanstack/react-query";
import { SaveIcon, TagIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { updateTracksTags } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TagType, TrackType } from "@/types/ytmusic.type";

import { toast } from "@/lib/toast";

interface UpdateTrackTagsButtonProps {
  selectedTrack: TrackType;
  onSuccess: () => void;
}

function UpdateTrackTagsButton(props: UpdateTrackTagsButtonProps) {
  const { selectedTrack, onSuccess } = props;
  const [open, setOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  // Fetch all tags using useQuery
  const { data: queryResult = [], isLoading } = useQuery<TagType[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/ytmusic/tags");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();

      return result;
    },
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      // Initialize selected tags from the track (so they show as default badges)
      setSelectedTagIds(selectedTrack.tags?.map((t) => t.id) || []);
    }
  }, [open, selectedTrack]);

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const result = await updateTracksTags([
          {
            video_id: selectedTrack.video_id,
            tags: selectedTagIds,
          },
        ]);

        if (result.success) {
          toast("success", t("track.message.updateTagsSuccess"));
          setOpen(false);
          onSuccess();
        } else {
          toast("error", result.error);
        }
      } catch (error) {
        console.error(error);
        toast("error", t("track.message.unexpectedError"));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <TagIcon />
          <span>{t("track.title.manageTags")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-80">
        <DialogHeader>
          <DialogTitle>{t("track.title.manageTags")}</DialogTitle>
          <DialogDescription>{t("track.description.manageTags")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
          ) : queryResult.length > 0 ? (
            queryResult.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);

              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer select-none hover:opacity-80"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              );
            })
          ) : (
            <p className="w-full text-center text-sm">{t("table.noData")}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSave} disabled={isPending || isLoading} className="cursor-pointer">
            {isPending ? <Spinner /> : <SaveIcon />}
            {t("button.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateTrackTagsButton };
