"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { CirclePlusIcon, SearchIcon } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SearchDataType } from "@/types/ytmusic.types";

import DataTable from "./data-table";

export default function SearchArea() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("yt");
  const [selectedTracks, setSelectedTracks] = useState<SearchDataType[]>([]);

  const handleSearch = () => {
    setSearchValue(inputValue);
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      const response = await fetch(`/api/ytmusic/search?q=${inputValue}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result: SearchDataType[] = await response.json();

      return result;
    },
    enabled: searchValue !== "",
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
        <Select defaultValue="yt" value={searchType} onValueChange={setSearchType}>
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
        <Button variant="outline" className="cursor-pointer" onClick={isLoading ? undefined : handleSearch}>
          {isLoading ? <Spinner className="size-4" /> : <SearchIcon />}
          <span>Search</span>
        </Button>
      </div>
      {isError && <p>{error?.message}</p>}
      {data && (
        <>
          <DataTable data={data} selectedTracks={selectedTracks} setSelectedTracks={setSelectedTracks} />
          {selectedTracks.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" className="cursor-pointer" onClick={() => console.log("Save", selectedTracks)}>
                <CirclePlusIcon />
                <span>Add</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
