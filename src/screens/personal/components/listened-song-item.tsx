import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
import type { MouseEvent, Ref } from 'react';
import type { Song } from '@typing';
import { nameConverter, stopParentEvent } from '@utils';
import { useAudioStore } from '@zing/zstate';
import { DIconButton } from '@components/button';
import XSvg from '@components/svg/svg';

interface CombinePropsWithBase {
  ref?: Ref<HTMLDivElement>;
  isPlaying?: boolean;
  onClick?(e: MouseEvent<HTMLElement>): void;
  onOptionClick?(e: MouseEvent<HTMLButtonElement>): void;
  onDoubleClick?(): void;
  mode?: 'delete' | 'small-more';
  isMobile: boolean;
  artwork?: string;
}

type LHBProps = Omit<Song, 'songDuration' | 'listenTimes' | 'key' | 'index' | 'subArtist' | 'mediaUrl'>;

export const ListenedSongItem: FCC<CombinePropsWithBase & LHBProps> = (pr) => {
  const { currentSong } = useAudioStore((s) => s);
  return (
    <div
      ref={pr.ref}
      className={`listened-item flex items-center ${pr.className ? pr.className : ''} ${currentSong?.id === pr.id ? 'selected' : ''}`}
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
              <use href="#PlayingAnimate" />
            </svg>
          )}
        </div>
        <div className="info flex flex-col">
          <Link className="text-decoration-none name text-ellipsis" to={`/s/${pr.id}`} onClick={stopParentEvent}>
            {pr.name}
          </Link>
          <Link className="base-nav artist" to={pr.artistId} onClick={stopParentEvent}>
            {nameConverter(pr.name)}
          </Link>
        </div>
      </ButtonBase>
      {!pr.isMobile && (
        <DIconButton className={`lde RippleColorTheme`} shape="box" onClick={(e) => pr.onOptionClick && pr.onOptionClick(e)}>
          <XSvg src={!pr.mode ? 'SmallMore' : 'Delete'} />
        </DIconButton>
      )}
    </div>
  );
};
