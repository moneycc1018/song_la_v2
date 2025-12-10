"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SearchDataType } from "@/types/ytmusic.type";

import { AddTracksButton } from "./add-tracks-btn";
import { DataTable } from "./data-table";
import { DeleteTracksButton } from "./delete-tracks-btn";

// 搜尋區域
function SearchArea() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("yt");
  const [selectedTracks, setSelectedTracks] = useState<SearchDataType[]>([]);

  // 搜尋歌曲
  function handleSearch() {
    setSearchValue(inputValue);
  }

  // 取得搜尋結果
  const {
    isLoading,
    isError,
    error,
    data: queryResult,
    refetch,
  } = useQuery<SearchDataType[]>({
    queryKey: [`search-${searchType}`, searchValue],
    queryFn: async () => {
      const endpoint = searchType === "yt" ? "/api/ytmusic/search" : "/api/ytmusic/tracks"; // 依搜尋類型決定api
      const response = await fetch(`${endpoint}?q=${searchValue}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();

      return result;
    },
    enabled: searchValue !== "" || searchType === "db",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <Input
          className="max-w-60"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Select
          defaultValue="yt"
          value={searchType}
          onValueChange={(value) => {
            setSearchType(value);
            setSearchValue("");
            setSelectedTracks([]);
          }}
        >
          <SelectTrigger className="w-40 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yt" className="cursor-pointer">
              YT Music
            </SelectItem>
            <SelectItem value="db" className="cursor-pointer">
              Database
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={isLoading ? undefined : handleSearch}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <SearchIcon />}
          <span>Search</span>
        </Button>
      </div>
      {isError && <p>{error?.message}</p>}
      {
        <>
          {queryResult && (
            <DataTable data={queryResult} selectedTracks={selectedTracks} setSelectedTracks={setSelectedTracks} />
          )}
          {selectedTracks.length > 0 && searchType === "yt" && (
            <div className="flex justify-end">
              <AddTracksButton selectedTracks={selectedTracks} onSuccess={() => setSelectedTracks([])} />
            </div>
          )}
          {selectedTracks.length > 0 && searchType === "db" && (
            <div className="flex justify-end">
              <DeleteTracksButton
                selectedTracks={selectedTracks}
                onSuccess={() => {
                  setSelectedTracks([]);
                  refetch();
                }}
              />
            </div>
          )}
        </>
      }
    </div>
  );
}

export { SearchArea };
