"use client";

import { useTransition } from "react";

import { CirclePlusIcon } from "lucide-react";

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
          alert("Tracks added successfully!"); // 建議未來改用 Toast
          onSuccess(); // 通知父元件清空選擇
        } else {
          if (result.duplicates && result.duplicates.length > 0) {
            alert(`Duplicate tracks found: ${result.duplicates.join(", ")}`);
          } else {
            alert(result.error);
          }
        }
      } catch (error) {
        console.error(error);
        alert("An unexpected error occurred.");
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
