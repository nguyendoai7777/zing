import './playing-decorator.css';
import { useAppDispatch, useAppSelector } from '@store/store';
import { pause, play, selectPlayState } from '@store/slices/play-state.slice';
import { type CSSProperties, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectMediaPlayer, setCurrentSong } from '@store/slices/media-player.slice';
import type { Song } from '@typing';
import { audioElement } from '@const';
import { nameConverter } from '@utils';

export interface PlayingDecoratorProps {
  className?: string;
  style?: CSSProperties;
  currentsong?: Song;
}

export const PlayingDecorator = (pr: PlayingDecoratorProps) => {
  const [clicked, setClicked] = useState(0);
  const [currentTime, setCurrentTime] = useState(0.1);
  const [duration, setDuration] = useState(10000);

  const { playing } = useAppSelector(selectPlayState);
  const { currentSong } = useAppSelector(selectMediaPlayer);
  const dispatch = useAppDispatch();
  const setPlaying = () => {
    if (pr.currentsong?.id !== (currentSong?.id || '')) {
      dispatch(setCurrentSong(pr!.currentsong!));
      setClicked(2);
      dispatch(pause());
      const t = setTimeout(() => {
        dispatch(play());
        clearTimeout(t);
      }, 0);
    } else {
      dispatch(playing ? pause() : play());
    }
  };

  useEffect(() => {
    audioElement.duration && setDuration(audioElement.duration);
    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration);
    });
    audioElement.addEventListener('timeupdate', () => {
      setCurrentTime(audioElement.currentTime);
    });
  }, []);

  useEffect(() => {
    if (playing) {
      setClicked(2);
    } else {
      setClicked(clicked + 1);
    }
  }, [playing]);

  return (
    <div {...pr} className={`decorate-box${playing && currentSong?.id === pr.currentsong?.id ? ' is-play' : ''} ${pr.className ? ' ' + pr.className : ''}`}>
      <div className="decorator relative">
        <div
          className={`decorate-thumb cs-pointer relative ${playing && currentSong?.id === pr.currentsong?.id ? 'playing' : ''} ${currentSong?.id === pr.currentsong?.id && clicked > 1 && !playing ? 'off' : ''}`}
          onClick={setPlaying}
        >
          <img className="decorate-img" src={pr.currentsong?.artwork} alt="" />
          <div className="decorate-thumb-overlay absolute"></div>
        </div>
        {playing && currentSong?.id === pr.currentsong?.id && (
          <svg className="playing-ic-wa absolute-center">
            <use href="#PlayingAnimate" />
          </svg>
        )}
        <svg className={`playing-ic-wa dc-playable absolute-center ${playing && currentSong?.id === pr.currentsong?.id ? 'hidden' : ''}`}>
          <use href="#Playable" />
        </svg>
        {currentSong?.id === pr.currentsong?.id ? (
          <div className={`circular-progress ${playing && currentSong?.id === pr.currentsong?.id ? 'playing' : ''}`}>
            <div
              className="ink-circular-progress"
              style={{ background: `conic-gradient(var(--nav-active-detective) ${(currentTime / duration) * 100 * 3.6}deg, transparent 0deg)` }}
            ></div>
          </div>
        ) : null}
        <div className={`border-protected${playing && currentSong?.id === pr.currentsong?.id ? ' playing' : ''}`}></div>
      </div>
      <div className="flex flex-col align-items-center decorator">
        <div className="dc-name">{pr.currentsong?.songName}</div>
        <Link className="dc-ar base-nav" to={pr.currentsong?.mainArtist!.profileUrl!}>
          {nameConverter(pr.currentsong?.mainArtist.name)}
        </Link>
        <div className="dc-sb-ar flex flex-wrap">
          {pr.currentsong?.subArtist.length! > 0 &&
            pr.currentsong?.subArtist.map((e) => (
              <div className="flex divider-x" key={e.id}>
                <Link to={e.profileUrl} className="base-nav">
                  {e.name}
                </Link>
                <span className="div-x">&nbsp;x&nbsp;</span>
              </div>
            ))}
        </div>
        <div className="release">Phát hành: 29/04/2022</div>
      </div>
    </div>
  );
};
