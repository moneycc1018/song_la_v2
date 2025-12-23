"use client";

import { useEffect, useState, useTransition } from "react";

import { PencilIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { updateTag } from "@/actions/ytmusic.action";

import { Spinner } from "@/components/spinner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TagType } from "@/types/ytmusic.type";

import { toast } from "@/lib/toast";

interface UpdateTagButtonProps {
  selectedTag: TagType;
  onSuccess: () => void;
}

function UpdateTagButton(props: UpdateTagButtonProps) {
  const { selectedTag, onSuccess } = props;
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState(selectedTag.name);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  useEffect(() => {
    if (open) {
      setTagName(selectedTag.name);
    }
  }, [open, selectedTag]);

  function handleUpdate() {
    if (!tagName.trim()) {
      toast("warning", t("tag.message.message1"));
      return;
    }

    if (tagName.trim() === selectedTag.name && !selectedTag.deprecated) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateTag(selectedTag.id, tagName.trim());

        if (result.success) {
          toast("success", t("tag.message.updateTagSuccess"));
          setOpen(false);
          onSuccess();
        } else {
          if (result.duplicate && result.duplicate !== "") {
            toast("warning", `${t("tag.message.duplicateTag")} ${result.duplicate}`);
          } else {
            toast("error", result.error);
          }
        }
      } catch (error) {
        console.error(error);
        toast("error", t("tag.message.unexpectedError"));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <PencilIcon />
          <span>{t("button.update")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-80">
        <DialogHeader>
          <DialogTitle>{t("tag.title.update")}</DialogTitle>
          <DialogDescription>{t("tag.description.update")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label htmlFor="name" className="whitespace-nowrap">
            {t("tag.label.tagName")}
          </Label>
          <Input
            id="name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder={t("tag.label.placeholder")}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={handleUpdate} disabled={isPending}>
            {isPending ? <Spinner /> : <SaveIcon />}
            <span>{t("button.save")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateTagButton };
