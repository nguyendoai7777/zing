import { Link } from 'react-router-dom';
import './song-in-dt.css';
import type { Song } from '@typing';
import type { ReactNode } from 'react';
import { nameConverter } from '@utils';

interface CombinePropsWithBase {
  onClick: () => void;
  className?: string;
  isPlaying: boolean;
  onDelete?: () => void;
  children?: ReactNode;
  onDbClick?: () => void;
}

type Props = Song;

export const SongInDetail = (pr: Props & CombinePropsWithBase) => {
  return (
    <div className={`flex items-center sil ${pr.className ? pr.className : ''}`} onDoubleClick={() => pr.onDbClick && pr.onDbClick()}>
      <div className="can-play" onClick={pr.onClick}>
        <img src="https://i1.sndcdn.com/artworks-000474463272-eg4f29-t500x500.jpg" alt="" />
        <div className="playable">
          <svg>
            <use href={`#${pr.isPlaying ? 'Pauseable' : 'Playable'}`} />
          </svg>
        </div>
        <div className="playable-overlay"></div>
      </div>
      <div className="detail flex justify-between flex-col">
        <Link className="text-decoration-none" to={`/s/${pr.id}`}>
          <div className="name line-clamp-1">{pr.name}</div>
        </Link>
        <Link className="base-nav" to={pr.artistId}>
          <div className="artist">{nameConverter(pr.artistName)}</div>
        </Link>
        {/*{pr.subArtist!.length > 0 && (
          <div className="flex">
            {pr.subArtist?.map((e) => (
              <span className="sub-artist divider-x" key={e.id}>
                <Link className="base-nav" to={e.profileUrl}>
                  {nameConverter(e.name)}
                </Link>
                <span className="div-x">&nbsp;x&nbsp;</span>
              </span>
            ))}
          </div>
        )}*/}
      </div>
      {pr.children && pr.children}
    </div>
  );
};
