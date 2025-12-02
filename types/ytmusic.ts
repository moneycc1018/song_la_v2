export interface SearchShelfType {
  id: string;
  title: string;
  artists: Array<{ channel_id: string; name: string }>;
  album: { id: string; name: string };
  duration: { text: string };
  thumbnail: { contents: Array<{ url: string }> };
}
