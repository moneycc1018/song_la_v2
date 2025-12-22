"use client";

import { useTransition } from "react";

import { CirclePlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { createTracks } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

import { SearchDataType } from "@/types/ytmusic.type";

import { toast } from "@/lib/toast";

interface AddTracksButtonProps {
  selectedTracks: SearchDataType[];
  onSuccess: () => void;
}

// 加入歌曲按鈕
function AddTracksButton(props: AddTracksButtonProps) {
  const { selectedTracks, onSuccess } = props;
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  // 加入歌曲
  function handleAdd() {
    if (selectedTracks.length === 0) return;

    startTransition(async () => {
      try {
        const result = await createTracks(selectedTracks);

        if (result.success) {
          toast("success", t("track.message.addTracksSuccess"));
          onSuccess(); // 通知父元件清空選擇
        } else {
          if (result.duplicates && result.duplicates.length > 0) {
            toast("warning", `${t("track.message.duplicateTracks")} ${result.duplicates.join(", ")}`);
          } else {
            toast("error", result.error);
          }
        }
      } catch (error) {
        console.error(error);
        toast("error", t("track.message.unexpectedError"));
      }
    });
  }

  return (
    <Button variant="outline" className="cursor-pointer" onClick={handleAdd} disabled={isPending}>
      {isPending ? <Spinner /> : <CirclePlusIcon />}
      <span>{t("button.add")}</span>
    </Button>
  );
}

export { AddTracksButton };
