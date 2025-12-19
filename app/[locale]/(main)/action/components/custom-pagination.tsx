"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("action.table");

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
        {t("showing")} &nbsp;{totalItems > 0 ? startIndex + 1 : 0} &nbsp;{t("to")} &nbsp;
        {Math.min(endIndex, totalItems)} &nbsp;{t("of")} &nbsp;{totalItems} &nbsp;{t("entries")}
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
              className={cn(
                "hover:text-primary hover:bg-transparent",
                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage((p) => p - 1);
              }}
              className={cn(
                "hover:text-primary hover:bg-transparent",
                currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
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
              className={cn(
                "hover:text-primary hover:bg-transparent",
                currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationEnd
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(totalPages);
              }}
              className={cn(
                "hover:text-primary hover:bg-transparent",
                currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { CustomPagination };
