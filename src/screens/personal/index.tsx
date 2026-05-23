import './personal.css';
import { useState } from 'react';
import { ButtonBase } from '@mui/material';
import { ListenedHistory } from './components/listened-history/listened-history.tsx';
import { Playlist } from './components/playlist/playlist.tsx';
import { CreatePlaylistDialog } from './components/create-playlist-dialog/create-playlist-dialog.tsx';

export const PersonalScreen = () => {
  const [createPlaylist, setCreatePlaylist] = useState(false);

  return (
    <>
      <div className="my-scrollbar ml-scroll-left personal">
        <div className="ml-scroll-right">
          <div className="header-pai fj-between align-items-center">
            Đã nghe gần đây
            <ButtonBase className="heading-button">
              <div className="text">Xem Thêm</div>
              <svg className="rotate-180">
                <use href="#SlidePrev" />
              </svg>
            </ButtonBase>
          </div>
          <ListenedHistory />
          <div className="header-pai fj-between align-items-center">
            PlayList
            <ButtonBase className="heading-button" onClick={() => setCreatePlaylist(true)}>
              <div className="text">Tạo mới</div>
              <svg>
                <use href="#Add" />
              </svg>
            </ButtonBase>
          </div>
          <Playlist />
        </div>
      </div>
      <CreatePlaylistDialog onClose={() => setCreatePlaylist(false)} open={createPlaylist} />
    </>
  );
};
