"use client";

import { useState, useTransition } from "react";

import { CirclePlusIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { createTag } from "@/actions/ytmusic.action";

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

import { toast } from "@/lib/toast";

interface AddTagButtonProps {
  onSuccess: () => void;
}

function AddTagButton(props: AddTagButtonProps) {
  const { onSuccess } = props;
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  function handleAdd() {
    if (!tagName.trim()) {
      toast("warning", t("tag.message.message1"));
      return;
    }

    startTransition(async () => {
      try {
        const result = await createTag(tagName.trim());

        if (result.success) {
          toast("success", t("tag.message.addTagSuccess"));
          setOpen(false);
          setTagName("");
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
          <CirclePlusIcon />
          <span>{t("button.add")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-80">
        <DialogHeader>
          <DialogTitle>{t("tag.title.add")}</DialogTitle>
          <DialogDescription>{t("tag.description.add")}</DialogDescription>
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
          <Button variant="outline" className="cursor-pointer" onClick={handleAdd} disabled={isPending}>
            {isPending ? <Spinner /> : <SaveIcon />}
            <span>{t("button.save")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddTagButton };
