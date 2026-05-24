import './standout-music.css';
import { Link } from 'react-router-dom';
import { durationConverter, stopParentEvent } from '@utils'; // Bỏ songFromUrl nếu store đã tự xử lý url
import { type ComponentProps, useEffect, useState } from 'react';
import { http } from '@zing/http';
import { useAudioStore } from '@zing/zstate/audio';
import type { Song } from '@typing';

interface _SongEvent extends Pick<ComponentProps<'div'>, 'onClick'> {}

interface SongItem extends _SongEvent, Song {
  isPlaying: boolean;
  currentSong: Song | null;
}

const SongItem: FCC<SongItem> = ({ artistName, listenCount, duration, currentSong, isPlaying, artistId, id, name, onClick }) => {
  return (
    <div className={`standout-song flex justify-between items-center cursor-pointer ${currentSong?.id === id ? 'playing' : ''}`} onClick={onClick}>
      <div className="flex lg:max-w-[70%] flex-1">
        <Link onClick={stopParentEvent} className="main-artist whitespace-nowrap" to={artistId}>
          {artistName}
        </Link>
        — <span className="px-2 song-name name-oversize whitespace-nowrap">{name}</span>
      </div>
      <div className="tail flex items-center">
        <div className="fas-info mr-7">{durationConverter(duration)}</div>
        <div className={isPlaying && currentSong?.id === id ? 'shape-bars' : 'shape-triangle'} style={{ transform: 'translateY(-1px)' }}></div>
        <div className="fas-info">{listenCount}</div>
      </div>
    </div>
  );
};

export const StandoutMusic = () => {
  const { playThisSong, isPlaying, currentSong } = useAudioStore((s) => s);

  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    http.get<Song[]>('/api/albums?type=VRM').then((c) => {
      setSongs(c.data);
    });
  }, []);

  return (
    <>
      <div className="standout-ms-box flex">
        <img src="https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg" alt="" />
        <div className="aud-list">
          {songs.map((s) => (
            <SongItem
              isPlaying={isPlaying}
              currentSong={currentSong}
              key={s.id}
              {...s}
              onClick={() => {
                playThisSong(s, songs);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};
