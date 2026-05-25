import './right-sidebar.css';
import { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';
import { SongInDetail } from '@components/song-in-dt';
import { useAudioStore } from '@zing/zstate';
import { Scrollable } from 'rx-scrollable';

interface RightSidebarProps {
  onToggleSidebar?: (currentShow: boolean) => void;
  id?: string;
}

export const PlaylistSidebar: FCC<RightSidebarProps> = ({ onToggleSidebar, id }) => {
  const currentList = useAudioStore((state) => state.currentList);
  const currentSong = useAudioStore((state) => state.currentSong);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const playThisSong = useAudioStore((state) => state.playThisSong);

  const [expand, setExpand] = useState(false);

  const handlePlaySong = (song: (typeof currentList)[number]) => {
    playThisSong(song);
  };

  const toggleExpand = () => {
    setExpand(!expand);
  };

  useEffect(() => {
    if (onToggleSidebar) {
      onToggleSidebar(expand);
    }
  }, [expand, onToggleSidebar]);

  return (
    <>
      <div id={id} className={`rsb-r${expand ? ' expand' : ''}`}>
        <div className="header-pai r-head flex items-center relative">
          Danh sách phát
          <ButtonBase className="expand-right absolute" onClick={toggleExpand}>
            <svg>
              <use href="#SlidePrev" />
            </svg>
          </ButtonBase>
        </div>
        <Scrollable className="scrollable-body my-scrollbar">
          {(currentList || []).length > 0 ? (
            <>
              {currentList.map((song) => (
                <SongInDetail
                  onDbClick={() => handlePlaySong(song)}
                  isPlaying={isPlaying && currentSong?.id === song.id}
                  className={currentSong?.id === song.id ? 'playing' : ''}
                  onClick={() => handlePlaySong(song)}
                  key={song.id}
                  {...song}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">Trống</div>
          )}
        </Scrollable>
      </div>
      {expand && <div className="drawer-overlay" onClick={toggleExpand}></div>}
    </>
  );
};
