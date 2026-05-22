import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import { forwardRef, type MouseEvent } from 'react';
import { useAppSelector } from '@store/store';
import { selectMediaPlayer } from '@store/slices/media-player.slice';
import type { SongBase } from '@typing';
import { nameConverter, stopParentEvent } from '@utils';
import DIconButton from '@components/icon-button';

interface CombinePropsWithBase {
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onOptionClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  mode?: 'delete' | 'small-more';
  isPlaying?: boolean;
  onDoubleClick?: () => void;
  isMobile: boolean;
}

type LHBProps = Omit<SongBase, 'songDuration' | 'listenTimes' | 'key' | 'index' | 'subArtist' | 'mediaUrl'>;

export const ListenedSongItem = forwardRef<HTMLDivElement, CombinePropsWithBase & LHBProps>((pr, ref) => {
  const { currentSong } = useAppSelector(selectMediaPlayer);
  return (
    <div
      ref={ref}
      className={`listened-item fa-center ${pr.className ? pr.className : ''} ${currentSong?.id === pr.id ? 'selected' : ''}`}
      onDoubleClick={() => pr.onDoubleClick && pr.onDoubleClick()}
    >
      <ButtonBase
        className="justify-content-start RippleColorTheme"
        onClick={(e) => {
          pr.onClick && pr.onClick(e);
        }}
      >
        <div className="relative inline-flex">
          <img src={pr.artwork} alt="" />
          {pr.isPlaying && (
            <svg className="playing-animate absolute-center">
              <use href="#playing-animate" />
            </svg>
          )}
        </div>
        <div className="info flex flex-col">
          <Link className="text-decoration-none name text-ellipsis" to={`/s/${pr.id}`} onClick={stopParentEvent}>
            {pr.songName}
          </Link>
          <Link className="base-nav artist" to={pr.mainArtist.profileUrl} onClick={stopParentEvent}>
            {nameConverter(pr.mainArtist.name)}
          </Link>
        </div>
      </ButtonBase>
      {!pr.isMobile && (
        <DIconButton className={`lde RippleColorTheme`} shape="box" onClick={(e) => pr.onOptionClick && pr.onOptionClick(e)}>
          <svg>
            <use href={`#${!pr.mode ? 'small-more' : 'delete'}`} />
          </svg>
        </DIconButton>
      )}
    </div>
  );
});
