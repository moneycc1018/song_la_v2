"use client";

import { useTransition } from "react";

import { CircleMinusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { deleteTracks } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SearchDataType } from "@/types/ytmusic.type";

import { toast } from "@/lib/toast";

interface DeleteTracksButtonProps {
  selectedTracks: SearchDataType[];
  onSuccess: () => void;
}

// 移除歌曲按鈕
function DeleteTracksButton(props: DeleteTracksButtonProps) {
  const { selectedTracks, onSuccess } = props;
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  // 移除歌曲
  function handleDelete() {
    if (selectedTracks.length === 0) return;

    const selectedVideoIds = selectedTracks.map((track) => track.video_id);

    startTransition(async () => {
      try {
        const result = await deleteTracks(selectedVideoIds);

        if (result.success) {
          toast("success", t("track.message.deleteTracksSuccess"));
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer" disabled={isPending || selectedTracks.length === 0}>
          {isPending ? <Spinner className="text-destructive" /> : <CircleMinusIcon />}
          <span>
            {t("button.delete")} ({selectedTracks.length})
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("track.title.delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("track.description.delete", { count: selectedTracks.length })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">{t("button.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-primary-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {t("button.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteTracksButton };
