"use client";

import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEnd,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationStart,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SearchDataType } from "@/types/ytmusic.type";

import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

// 客製化分頁
function CustomPagination(props: CustomPaginationProps) {
  const { currentPage, setCurrentPage, totalPages, startIndex, endIndex, totalItems } = props;

  // Pagination Logic Helpers
  const pageIndex = currentPage - 1;
  const pageIndexLast = totalPages - 1;
  const correctedNumber =
    pageIndex > 1
      ? pageIndex === pageIndexLast
        ? pageIndex - 4
        : pageIndex === pageIndexLast - 1
          ? pageIndex - 3
          : pageIndex - 2
      : 0;

  return (
    <div className="font-roboto flex flex-col items-center justify-between gap-2 py-1 md:flex-row">
      <div className="flex-1 text-sm">
        Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of {totalItems} entries
      </div>
      <Pagination className="w-fit">
        <PaginationContent>
          <PaginationItem>
            <PaginationStart
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage((p) => p - 1);
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {totalPages > 5
            ? Array.from({ length: 5 }).map((_, index) => {
                const targetPage = index + correctedNumber + 1;

                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === targetPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(targetPage);
                      }}
                      className={cn(
                        "hover:text-primary cursor-pointer select-none hover:bg-transparent",
                        currentPage === targetPage ? "border" : "border-transparent",
                      )}
                    >
                      {targetPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })
            : Array.from({ length: totalPages }).map((_, index) => {
                const targetPage = index + 1;

                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === targetPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(targetPage);
                      }}
                      className="hover:text-primary cursor-pointer select-none hover:bg-transparent"
                    >
                      {targetPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage((p) => p + 1);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEnd
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface DataTableProps {
  data: SearchDataType[] | undefined;
  selectedTracks: SearchDataType[];
  setSelectedTracks: React.Dispatch<React.SetStateAction<SearchDataType[]>>;
  searchType?: string;
}

// 歌曲列表
function DataTable(props: DataTableProps) {
  const { data, selectedTracks, setSelectedTracks, searchType } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  if (!data) return null;

  const isDbMode = searchType === "db";

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
            <TableRow>
              <TableHead className="w-8">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-60">Track Name</TableHead>
              <TableHead className="w-40">Album Name</TableHead>
              <TableHead className="w-40">Artist Name</TableHead>
              <TableHead className="w-28">Release Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              <>
                {currentData.map((track) => {
                  const isSelected = selectedTracks.some((selected) => selected.video_id === track.video_id); // 檢查該列是否已被選取

                  return (
                    <TableRow
                      key={track.video_id}
                      data-state={isSelected ? "selected" : undefined}
                      className="h-[41px]"
                    >
                      <TableCell>
                        <Checkbox checked={isSelected} onCheckedChange={() => handleSelectOne(track)} />
                      </TableCell>
                      <TableCell className="truncate">{track.track_name}</TableCell>
                      <TableCell className="truncate">{track.album.name}</TableCell>
                      <TableCell className="truncate">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </TableCell>
                      <TableCell>{track.release_year}</TableCell>
                    </TableRow>
                  );
                })}
                {isDbMode &&
                  Array.from({ length: Math.max(0, itemsPerPage - currentData.length) }).map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-[41px] border-b-0">
                      <TableCell colSpan={5}>&nbsp;</TableCell>
                    </TableRow>
                  ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No Data Found.
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

export { DataTable };
