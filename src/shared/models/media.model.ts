import { ArtisBaseInfo } from '@models/artist.model';
import { RefObject } from 'react';


export interface SongBase {
  id: string;
  mainArtist: ArtisBaseInfo,
  artwork: string;
  mediaUrl: string;
  songName: string;
  songDuration: number;
  url: string;
  listenTimes: string;
  subArtist: ArtisBaseInfo[],
  lyric?: {
    text: string;
    time: number;
  }[];
}

export type SongItemProps = Omit<SongBase, 'artwork' | 'index'> & {
  onClick?: () => void
}
