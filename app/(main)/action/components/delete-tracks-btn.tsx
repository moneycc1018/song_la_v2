"use client";

import { useTransition } from "react";

import { CircleMinusIcon } from "lucide-react";

import { deleteTracks } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

import { SearchDataType } from "@/types/ytmusic.type";

interface DeleteTracksButtonProps {
  selectedTracks: SearchDataType[];
  onSuccess: () => void;
}

// 移除歌曲按鈕
function DeleteTracksButton(props: DeleteTracksButtonProps) {
  const { selectedTracks, onSuccess } = props;
  const [isPending, startTransition] = useTransition();

  // 移除歌曲
  function handleDelete() {
    if (selectedTracks.length === 0) return;

    const selectedVideoIds = selectedTracks.map((track) => track.video_id);

    startTransition(async () => {
      try {
        const result = await deleteTracks(selectedVideoIds);

        if (result.success) {
          alert("Tracks deleted successfully!");
          onSuccess();
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error(error);
        alert("An unexpected error occurred.");
      }
    });
  }

  return (
    <Button
      variant="outline"
      className="text-destructive border-destructive hover:bg-destructive cursor-pointer"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? <Spinner className="text-destructive" /> : <CircleMinusIcon />}
      <span>Delete</span>
    </Button>
  );
}

export { DeleteTracksButton };
