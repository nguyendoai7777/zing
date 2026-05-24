import type { Song } from './song.types';

export interface ArtisBaseInfo {
  id: string;
  name: string;
  profileUrl: string;
}

export interface ArtisProfile extends ArtisBaseInfo {
  description: string;
  artwork: string;
  subArtwork?: string;
  songs: Song[];
  birthdate: string;
  nativePlace: string;
  realName: string;
}
