export interface ArtistBase {
  id: string;
  name: string;
}
export interface Song {
  id: number;
  name: string;
  duration: number;
  listenCount: number;
  albumId: number;
  artistId: string;
  artistName: string;
  url: string;
  createdAt: string;
  subArtists: ArtistBase[];
}
