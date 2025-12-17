"use client";

import { useTransition } from "react";

import { CirclePlusIcon } from "lucide-react";
import { toast } from "sonner";

import { createTracks } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

import { SearchDataType } from "@/types/ytmusic.type";

interface AddTracksButtonProps {
  selectedTracks: SearchDataType[];
  onSuccess: () => void;
}

// 加入歌曲按鈕
function AddTracksButton(props: AddTracksButtonProps) {
  const { selectedTracks, onSuccess } = props;
  const [isPending, startTransition] = useTransition();

  // 加入歌曲
  function handleAdd() {
    if (selectedTracks.length === 0) return;

    startTransition(async () => {
      try {
        const result = await createTracks(selectedTracks);

        if (result.success) {
          toast.success("Tracks added successfully!", {
            position: "top-center",
            duration: 3000,
          });
          onSuccess(); // 通知父元件清空選擇
        } else {
          if (result.duplicates && result.duplicates.length > 0) {
            toast.warning(`Duplicate tracks found: ${result.duplicates.join(", ")}`, {
              position: "top-center",
              duration: 3000,
            });
          } else {
            toast.error(result.error, {
              position: "top-center",
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred.", {
          position: "top-center",
          duration: 3000,
        });
      }
    });
  }

  return (
    <Button variant="outline" className="cursor-pointer" onClick={handleAdd} disabled={isPending}>
      {isPending ? <Spinner /> : <CirclePlusIcon />}
      <span>Add</span>
    </Button>
  );
}

export { AddTracksButton };
