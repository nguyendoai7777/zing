import { SongBase } from '@models/media.model';

export interface ArtisBaseInfo {
  id: string;
  name: string;
  profileUrl: string
}

export interface ArtisProfile extends ArtisBaseInfo {
  description: string;
  artwork: string;
  subArtwork?: string;
  songs: SongBase[];
  birthdate: string;
  nativePlace: string;
  realName: string;
}
