import './playing-decorator.css';
import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { nameConverter } from '@utils';
import { useAudioStore } from '@zing/zstate';
import type { Song } from '@typing';

interface PlayingDecoratorProps {
  style?: CSSProperties;
  currentSong?: Song;
}

export const PlayingDecorator: FCC<PlayingDecoratorProps> = (pr) => {
  const { currentSong, isPlaying, togglePlaying, currentTime, duration } = useAudioStore((s) => s);

  return (
    <div {...pr} className={`decorate-box${isPlaying && currentSong?.id === pr.currentSong?.id ? ' is-play' : ''} ${pr.className ? ' ' + pr.className : ''}`}>
      <div className="decorator relative">
        <div
          className={`decorate-thumb cs-pointer relative ${isPlaying && currentSong?.id === pr.currentSong?.id ? 'playing' : ''} ${currentSong?.id === pr.currentSong?.id && !isPlaying ? 'off' : ''}`}
          onClick={togglePlaying}
        >
          {/*<img className="decorate-img" src={pr.currentsong?.artwork} alt="" />*/}
          <div className="decorate-thumb-overlay absolute"></div>
        </div>
        {isPlaying && currentSong?.id === pr.currentSong?.id && (
          <svg className="playing-ic-wa absolute-center">
            <use href="#PlayingAnimate" />
          </svg>
        )}
        <svg className={`playing-ic-wa dc-playable absolute-center ${isPlaying && currentSong?.id === pr.currentSong?.id ? 'hidden' : ''}`}>
          <use href="#Playable" />
        </svg>
        {currentSong?.id === pr.currentSong?.id ? (
          <div className={`circular-progress ${isPlaying && currentSong?.id === pr.currentSong?.id ? 'playing' : ''}`}>
            <div
              className="ink-circular-progress"
              style={{ background: `conic-gradient(var(--nav-active-detective) ${(currentTime / duration) * 100 * 3.6}deg, transparent 0deg)` }}
            ></div>
          </div>
        ) : null}
        <div className={`border-protected${isPlaying && currentSong?.id === pr.currentSong?.id ? ' playing' : ''}`}></div>
      </div>
      {pr.currentSong ? (
        <div className="flex flex-col items-center decorator">
          <div className="dc-name">{pr.currentSong.name}</div>
          <Link className="dc-ar base-nav" to={pr.currentSong.artistId}>
            {nameConverter(pr.currentSong.artistName)}
          </Link>
          {/*<div className="dc-sb-ar flex flex-wrap">
              {pr.currentsong?.subArtist.length! > 0 &&
                pr.currentsong?.subArtist.map((e) => (
                  <div className="flex divider-x" key={e.id}>
                    <Link to={e.profileUrl} className="base-nav">
                      {e.name}
                    </Link>
                    <span className="div-x">&nbsp;x&nbsp;</span>
                  </div>
                ))}
            </div>*/}
          <div className="release">Phát hành: 29/04/2022</div>
        </div>
      ) : null}
    </div>
  );
};
