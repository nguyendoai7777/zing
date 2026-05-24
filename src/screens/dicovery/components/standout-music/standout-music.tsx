import './standout-music.css';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@store/store';
import { setCurrentLists, setCurrentSong } from '@store/slices/media-player.slice';
import { pause, play } from '@store/slices/play-state.slice';
import { pushOne } from '@store/slices/listened-history.slice';
import type { Song } from '@typing';
import { durationConverter, nameConverter, stopParentEvent } from '@utils';
import { DIS_STANDOUT_SONG_LIST } from '@const';
import { type ComponentProps, useEffect, useState } from 'react';
import { http } from '@zing/http';

interface _SongEvent extends Pick<ComponentProps<'div'>, 'onClick'> {}

interface SongItem extends _SongEvent {}
interface SongItem extends Song {}

const Song: FCC<SongItem> = (pr) => {
  return (
    <div className="standout-song fa-center fj-between cs-pointer" onClick={pr.onClick}>
      <div className="flex song-wrapper">
        <Link onClick={stopParentEvent} className="main-artist text-nowrap" to={pr.artistName}>
          {pr.artistName}
        </Link>
        —<span className="song-name name-oversize text-nowrap">{pr.name}</span>
        {/*{pr.subArtist.length > 0 && (
          <span className="sub-art">
            (
            {pr.subArtist.map((sa, i) => (
              <span key={sa.id} className="divider-x text-nowrap">
                <Link onClick={stopParentEvent} className="sub-artist" to={sa.profileUrl}>
                  {nameConverter(sa.name)}
                </Link>
                <span className="div-x">&nbsp;x&nbsp;</span>
              </span>
            ))}
            )
          </span>
        )}*/}
      </div>
      <div className="tail fa-center">
        <div className="fas-info mr-7">{durationConverter(pr.duration)}</div>
        <div className="triangle-play" style={{ transform: 'translateY(-1px)' }}></div>
        <div className="fas-info">{pr.listenCount}</div>
      </div>
    </div>
  );
};

export const StandoutMusic = () => {
  const dispatch = useAppDispatch();

  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    http.get<Song[]>('/api/albums?type=VRM').then((c) => {
      console.log(`@@ song list`, c.data);
      setSongs(c.data);
    });
  }, []);
  return (
    <>
      <div className="standout-ms-box flex">
        <img src="https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg" alt="" />
        <div className="aud-list">
          {songs.map((s) => (
            <Song
              key={s.id}
              {...s}
              onClick={() => {
                dispatch(pause());
                dispatch(setCurrentSong(s));
                dispatch(pushOne(s));
                const delay = setTimeout(() => {
                  dispatch(play());
                  clearTimeout(delay);
                }, 100);
                dispatch(setCurrentLists(DIS_STANDOUT_SONG_LIST));
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};
