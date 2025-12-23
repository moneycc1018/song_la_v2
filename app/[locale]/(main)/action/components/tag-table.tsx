"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { TagType } from "@/types/ytmusic.type";

import { CustomPagination } from "./custom-pagination";

interface TagTableProps {
  data: TagType[] | undefined;
  selectedTags: TagType[];
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
}

// 標籤列表
function TagTable(props: TagTableProps) {
  const { data, selectedTags, setSelectedTags } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const t = useTranslations("action");

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!data) return null;

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const isAllSelected =
    currentData.length > 0 && currentData.every((tag) => selectedTags.some((selected) => selected.id === tag.id));

  // 選取當前頁面全部標籤
  function handleSelectAll() {
    if (!currentData) return;

    if (isAllSelected) {
      // Remove current page items from selection
      const currentIds = new Set(currentData.map((t) => t.id));
      setSelectedTags((prev) => prev.filter((t) => !currentIds.has(t.id)));
    } else {
      // Add current page items to selection (avoiding duplicates)
      const currentIds = new Set(currentData.map((t) => t.id));
      const otherSelected = selectedTags.filter((t) => !currentIds.has(t.id));
      setSelectedTags([...otherSelected, ...currentData]);
    }
  }

  // 選取單一標籤
  function handleSelectOne(tag: TagType) {
    setSelectedTags((prev) => {
      const exists = prev.find((item) => item.id === tag.id);

      if (exists) {
        return prev.filter((item) => item.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  }

  return (
    <div className="w-full">
      <ScrollArea className="w-full">
        <Table className="mb-3 w-full table-fixed">
          <TableHeader>
            <TableRow onClick={handleSelectAll}>
              <TableHead className="w-8">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableHead>
              <TableHead className="w-60 md:w-full">{t("tag.table.tagNameColumn")}</TableHead>
              <TableHead className="w-32">{t("tag.table.deprecatedColumn")}</TableHead>
              <TableHead className="w-32">{t("tag.table.trackCountColumn")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              <>
                {currentData.map((tag) => {
                  const isSelected = selectedTags.some((selected) => selected.id === tag.id);

                  return (
                    <TableRow
                      key={tag.id}
                      data-state={isSelected ? "selected" : undefined}
                      className="h-[41px]"
                      onClick={() => handleSelectOne(tag)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectOne(tag)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="truncate">{tag.name}</TableCell>
                      <TableCell>{tag.deprecated ? "Y" : "N"}</TableCell>
                      <TableCell className="text-right">{tag.track_count}</TableCell>
                    </TableRow>
                  );
                })}
                {totalPages > 1 &&
                  Array.from({ length: Math.max(0, itemsPerPage - currentData.length) }).map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-[41px] border-b-0">
                      <TableCell colSpan={2}>&nbsp;</TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  {t("table.noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}
    </div>
  );
}

export { TagTable };
