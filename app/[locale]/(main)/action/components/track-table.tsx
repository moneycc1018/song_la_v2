"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SearchDataType, TrackType } from "@/types/ytmusic.type";

import { CustomPagination } from "./custom-pagination";

interface TrackTableProps {
  data: SearchDataType[] | undefined;
  selectedTracks: SearchDataType[];
  setSelectedTracks: React.Dispatch<React.SetStateAction<SearchDataType[]>>;
  searchType?: string;
  onRefresh?: () => void;
}

// 歌曲列表
function TrackTable(props: TrackTableProps) {
  const { data, selectedTracks, setSelectedTracks, searchType } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const t = useTranslations("action");

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!data) return null;

  const isDbMode = searchType === "db_track";

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = isDbMode ? Math.ceil(totalItems / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = isDbMode ? data.slice(startIndex, endIndex) : data;

  const isAllSelected =
    currentData.length > 0 &&
    currentData.every((track) => selectedTracks.some((selected) => selected.video_id === track.video_id));

  // 選取當前頁面全部歌曲
  function handleSelectAll() {
    if (!currentData) return;

    if (isAllSelected) {
      // Remove current page items from selection
      const currentIds = new Set(currentData.map((t) => t.video_id));
      setSelectedTracks((prev) => prev.filter((t) => !currentIds.has(t.video_id)));
    } else {
      // Add current page items to selection (avoiding duplicates)
      const currentIds = new Set(currentData.map((t) => t.video_id));
      const otherSelected = selectedTracks.filter((t) => !currentIds.has(t.video_id));
      setSelectedTracks([...otherSelected, ...currentData]);
    }
  }

  // 選取單一歌曲
  function handleSelectOne(track: SearchDataType) {
    setSelectedTracks((prev) => {
      const exists = prev.find((item) => item.video_id === track.video_id);

      if (exists) {
        return prev.filter((item) => item.video_id !== track.video_id);
      } else {
        return [...prev, track];
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
              <TableHead className="w-60">{t("track.table.trackNameColumn")}</TableHead>
              <TableHead className="w-40">{t("track.table.albumNameColumn")}</TableHead>
              <TableHead className="w-40">{t("track.table.artistNameColumn")}</TableHead>
              <TableHead className="w-28">{t("track.table.releaseYearColumn")}</TableHead>
              {isDbMode && <TableHead className="w-40">{t("track.table.tagsColumn")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              <>
                {currentData.map((track) => {
                  const isSelected = selectedTracks.some((selected) => selected.video_id === track.video_id); // 檢查該列是否已被選取
                  const trackWithTags = track as TrackType;

                  return (
                    <TableRow
                      key={track.video_id}
                      data-state={isSelected ? "selected" : undefined}
                      className="h-[41px]"
                      onClick={() => handleSelectOne(track)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectOne(track)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="truncate">{track.track_name}</TableCell>
                      <TableCell className="truncate">{track.album.name}</TableCell>
                      <TableCell className="truncate">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </TableCell>
                      <TableCell>{track.release_year}</TableCell>
                      {isDbMode && (
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {trackWithTags.tags?.map((tag) => (
                              <Badge key={`${track.video_id}-${tag.id}`}>{tag.name}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {totalPages > 1 &&
                  isDbMode &&
                  Array.from({ length: Math.max(0, itemsPerPage - currentData.length) }).map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-[41px] border-b-0">
                      <TableCell colSpan={isDbMode ? 6 : 5}>&nbsp;</TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={isDbMode ? 6 : 5} className="h-24 text-center">
                  {t("table.noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {isDbMode && totalPages > 1 && (
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

export { TrackTable };
