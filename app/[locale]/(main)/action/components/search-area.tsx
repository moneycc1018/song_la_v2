"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SearchDataType, TagType } from "@/types/ytmusic.type";

import { AddTagButton } from "./add-tag-btn";
import { AddTracksButton } from "./add-tracks-btn";
import { DeleteTagsButton } from "./delete-tags-btn";
import { DeleteTracksButton } from "./delete-tracks-btn";
import { TagTable } from "./tag-table";
import { TrackTable } from "./track-table";
import { UpdateTagButton } from "./update-tag-btn";

// 搜尋區域
function SearchArea() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("yt");
  const [selectedTracks, setSelectedTracks] = useState<SearchDataType[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const t = useTranslations("action");

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
  } = useQuery({
    queryKey: [`search-${searchType}`, searchValue],
    queryFn: async () => {
      let endpoint = "";
      if (searchType === "yt") endpoint = "/api/ytmusic/search";
      else if (searchType === "db_track") endpoint = "/api/ytmusic/tracks";
      else if (searchType === "db_tag") endpoint = "/api/ytmusic/tags";

      const response = await fetch(`${endpoint}?q=${searchValue}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();

      return result;
    },
    enabled: searchValue !== "" || searchType === "db_track" || searchType === "db_tag",
  });

  useEffect(() => {
    setSelectedTracks([]);
    setSelectedTags([]);
  }, [queryResult, searchType]);

  const isTagMode = searchType === "db_tag";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <Input
          className="max-w-60"
          placeholder={t("placeholder")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Select
          defaultValue="yt"
          value={searchType}
          onValueChange={(value) => {
            setSearchType(value);
            setSearchValue("");
            setInputValue("");
          }}
        >
          <SelectTrigger className="w-40 min-w-32 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yt" className="cursor-pointer">
              {t("ytmusic")}
            </SelectItem>
            <SelectItem value="db_track" className="cursor-pointer">
              {t("databaseTrack")}
            </SelectItem>
            <SelectItem value="db_tag" className="cursor-pointer">
              {t("databaseTag")}
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
          <span>{t("search")}</span>
        </Button>
      </div>
      {isError && <p>{error?.message}</p>}

      {queryResult && (
        <>
          {isTagMode ? (
            <TagTable data={queryResult as TagType[]} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          ) : (
            <TrackTable
              data={queryResult as SearchDataType[]}
              selectedTracks={selectedTracks}
              setSelectedTracks={setSelectedTracks}
              searchType={searchType}
            />
          )}
        </>
      )}

      {/* Buttons Area */}
      <div className="flex justify-end gap-2">
        {selectedTracks.length > 0 && searchType === "yt" && (
          <AddTracksButton selectedTracks={selectedTracks} onSuccess={() => setSelectedTracks([])} />
        )}
        {selectedTracks.length > 0 && searchType === "db_track" && (
          <DeleteTracksButton
            selectedTracks={selectedTracks}
            onSuccess={() => {
              setSelectedTracks([]);
              refetch();
            }}
          />
        )}
        {isTagMode && (
          <div className="flex gap-2">
            <AddTagButton onSuccess={refetch} />
            {selectedTags.length > 0 && (
              <>
                {selectedTags.length === 1 && (
                  <UpdateTagButton
                    selectedTag={selectedTags[0]}
                    onSuccess={() => {
                      setSelectedTags([]);
                      refetch();
                    }}
                  />
                )}
                <DeleteTagsButton
                  selectedTags={selectedTags}
                  onSuccess={() => {
                    setSelectedTags([]);
                    refetch();
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { SearchArea };
