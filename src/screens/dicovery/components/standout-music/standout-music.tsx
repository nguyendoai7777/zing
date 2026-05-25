import './standout-music.css';
import { Link } from 'react-router-dom';
import { durationConverter, stopParentEvent } from '@utils'; // Bỏ songFromUrl nếu store đã tự xử lý url
import { type ComponentProps, useEffect, useState } from 'react';
import { httpWithCache } from '@zing/http';
import { useAudioStore } from '@zing/zstate/audio';
import type { Song } from '@typing';

interface SongItem extends Pick<ComponentProps<'div'>, 'onClick'>, Song {
  isPlaying: boolean;
  currentSong: Song | null;
}

const SongItem: FCC<SongItem> = ({ artistName, listenCount, duration, currentSong, isPlaying, artistId, id, name, onClick, subArtists }) => {
  return (
    <div className={`standout-song flex justify-between items-center cursor-pointer ${currentSong?.id === id ? 'playing' : ''}`} onClick={onClick}>
      <div className="flex lg:max-w-[70%] flex-1">
        <Link onClick={stopParentEvent} className="main-artist whitespace-nowrap" to={artistId}>
          {artistName}
        </Link>
        — <span className="px-2 song-name name-oversize whitespace-nowrap">{name}</span>
        {subArtists.length ? (
          <div className="flex items-center">
            (
            {subArtists.map((art, ix) => (
              <>
                <div className="flex items-center" key={art.id}>
                  <Link className="text-(--standout-main-atist)!" onClick={stopParentEvent} to={`/profile/${art.id}`}>
                    {art.name}
                  </Link>
                  {ix !== subArtists.length - 1 && <span className="px-2">x</span>}
                </div>
              </>
            ))}
            )
          </div>
        ) : (
          <></>
        )}
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
  const { playThisSong, isPlaying, currentSong, songList } = useAudioStore((s) => s);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    httpWithCache
      .get<Song[]>('/api/song/list?album=VRM', { signal: controller.signal })
      .then((c) => {
        setSongs(c.data);
      })
      .catch((err) => {
        /*if (!axios.isCancel(err)) console.error(err);*/
      });

    return () => controller.abort();
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
