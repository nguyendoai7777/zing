import './right-sidebar.css';
import { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@store/store.ts';
import { selectMediaPlayer, setCurrentSong } from '@store/slices/media-player.slice.ts';
import { pause, play, selectPlayState } from '@store/slices/play-state.slice.ts';
import type { SongBase } from '@typing';
import { pushOne } from '@store/slices/listened-history.slice.ts';
import { SongInDetail } from '@components/song-in-dt';

interface RightSidebarProps {
  onToggleSidebar?: (currentShow: boolean) => void;
  id?: string;
}

export function RightSidebar({ onToggleSidebar, id }: RightSidebarProps) {
  const dispatch = useAppDispatch();
  const { currentList, currentSong } = useAppSelector(selectMediaPlayer);
  const { playing } = useAppSelector(selectPlayState);

  const [expand, setExpand] = useState(false);

  const playSong = (e: SongBase) => {
    if (currentSong?.id === e.id) {
      dispatch(playing ? pause() : play());
    } else {
      dispatch(pause());
      dispatch(setCurrentSong(e));
      dispatch(pushOne(e));
      const delay = setTimeout(() => {
        dispatch(play());
        clearTimeout(delay);
      }, 100);
    }
  };
  const toggleExpand = () => {
    setExpand(!expand);
  };
  useEffect(() => {
    onToggleSidebar && onToggleSidebar(expand);
  }, [expand]);

  return (
    <>
      <div id={id} className={`rsb-r${expand ? ' expand' : ''}`}>
        <div className="header-pai r-head fa-center relative">
          Danh sách phát
          <ButtonBase className="expand-right absolute" onClick={toggleExpand}>
            <svg>
              <use href="#slide-prev" />
            </svg>
          </ButtonBase>
        </div>
        <div className="scrollable-body my-scrollbar ">
          {(currentList || []).length > 0 ? (
            <>
              {currentList.map((e, i) => (
                <SongInDetail
                  onDbClick={() => playSong(e)}
                  isPlaying={playing && currentSong?.id === e.id}
                  className={currentSong?.id === e.id ? 'playing' : ''}
                  onClick={() => playSong(e)}
                  key={e.id}
                  url={e.url}
                  id={e.id}
                  mainArtist={e.mainArtist}
                  subArtist={e.subArtist}
                  artwork={e.artwork}
                  songName={e.songName}
                />
              ))}
            </>
          ) : (
            <div>Trống</div>
          )}
        </div>
      </div>
      {expand && <div className="drawer-overlay" onClick={toggleExpand}></div>}
    </>
  );
}

export default RightSidebar;
