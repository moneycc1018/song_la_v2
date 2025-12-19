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
  duration?: number;
  thumbnail?: string;
  release_year?: number;
  lyrics?: string;
}

export interface TrackType extends SearchDataType {
  tags?: TagType[];
}

export interface ArtistType {
  id: string;
  name: string;
}

export interface TagType {
  id: number;
  name: string;
  deprecated?: boolean;
  track_count?: number;
}
