"use client";

import { useTransition } from "react";

import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { deleteTags } from "@/actions/ytmusic.action";

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

import { TagType } from "@/types/ytmusic.type";

interface DeleteTagsButtonProps {
  selectedTags: TagType[];
  onSuccess: () => void;
}

function DeleteTagsButton(props: DeleteTagsButtonProps) {
  const { selectedTags, onSuccess } = props;
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("action");

  function handleDelete() {
    if (selectedTags.length === 0) return;

    startTransition(async () => {
      try {
        const tagIds = selectedTags.map((t) => t.id);
        const result = await deleteTags(tagIds);

        if (result.success) {
          toast.success(t("tag.message.deleteTagSuccess"), {
            position: "top-center",
            duration: 3000,
          });
          onSuccess();
        } else {
          toast.error(result.error, {
            position: "top-center",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error(t("tag.message.unexpectedError"), {
          position: "top-center",
          duration: 3000,
        });
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer" disabled={isPending || selectedTags.length === 0}>
          {isPending ? <Spinner /> : <TrashIcon />}
          <span>
            {t("button.delete")} ({selectedTags.length})
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("tag.title.delete")}</AlertDialogTitle>
          <AlertDialogDescription>{t("tag.description.delete", { count: selectedTags.length })}</AlertDialogDescription>
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

export { DeleteTagsButton };
