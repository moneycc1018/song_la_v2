export interface SearchDataType {
  video_id: string;
  track_name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
  };
  duration: number;
  thumbnail: string;
}
