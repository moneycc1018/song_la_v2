import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { SearchDataType } from "@/types/ytmusic.types";

interface DataTableProps {
  data: SearchDataType[];
  selectedTracks: SearchDataType[];
  setSelectedTracks: React.Dispatch<React.SetStateAction<SearchDataType[]>>;
}

export default function DataTable({ data, selectedTracks, setSelectedTracks }: DataTableProps) {
  const isAllSelected =
    data.length > 0 && data.every((track) => selectedTracks.some((selected) => selected.video_id === track.video_id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(data);
    }
  };

  const handleSelectOne = (track: SearchDataType) => {
    setSelectedTracks((prev) => {
      const exists = prev.find((item) => item.video_id === track.video_id);

      if (exists) {
        return prev.filter((item) => item.video_id !== track.video_id);
      } else {
        return [...prev, track];
      }
    });
  };

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((track) => {
            const isSelected = selectedTracks.some((selected) => selected.video_id === track.video_id);

            return (
              <TableRow key={track.video_id} data-state={isSelected ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={isSelected} onCheckedChange={() => handleSelectOne(track)} />
                </TableCell>
                <TableCell className="truncate">{track.track_name}</TableCell>
                <TableCell className="truncate">{track.album.name}</TableCell>
                <TableCell className="truncate">{track.artists.map((artist) => artist.name).join(", ")}</TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No Data Found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
