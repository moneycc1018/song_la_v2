import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SearchDataType } from "@/types/ytmusic.type";

interface DataTableProps {
  data: SearchDataType[];
  selectedTracks: SearchDataType[];
  setSelectedTracks: React.Dispatch<React.SetStateAction<SearchDataType[]>>;
}

// 歌曲列表
function DataTable(props: DataTableProps) {
  const { data, selectedTracks, setSelectedTracks } = props;
  const isAllSelected =
    data.length > 0 && data.every((track) => selectedTracks.some((selected) => selected.video_id === track.video_id));

  // 選取全部歌曲
  function handleSelectAll() {
    if (isAllSelected) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(data);
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
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">
            <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
          </TableHead>
          <TableHead>Track Name</TableHead>
          <TableHead>Album Name</TableHead>
          <TableHead>Artist Name</TableHead>
          <TableHead className="w-32">Release Year</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((track) => {
            const isSelected = selectedTracks.some((selected) => selected.video_id === track.video_id); // 檢查該列是否已被選取

            return (
              <TableRow key={track.video_id} data-state={isSelected ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={isSelected} onCheckedChange={() => handleSelectOne(track)} />
                </TableCell>
                <TableCell className="truncate">{track.track_name}</TableCell>
                <TableCell className="truncate">{track.album.name}</TableCell>
                <TableCell className="truncate">{track.artists.map((artist) => artist.name).join(", ")}</TableCell>
                <TableCell>{track.release_year}</TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No Data Found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export { DataTable };
