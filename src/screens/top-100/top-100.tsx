import './top-100.css';
import { ButtonBase, Menu, MenuItem } from '@mui/material';
import { List100 } from './components/list/list.tsx';
import { Gallery } from './components/gallery/gallery.tsx';
import { CreatePlaylistDialog } from '../personal/components/create-playlist-dialog/create-playlist-dialog.tsx';
import { usePlaylistDialog, useSongList, useSongOptionMenu } from './top-100.hook';

export const Top100Screen = () => {
  const { songs, mount, toggleMount } = useSongList();
  const { subOptionRef, selectedSong, openSubOptionRef, onSelectSong, closeOption } = useSongOptionMenu();
  const { createPlaylist, playlist, openCreatePlaylist, closeCreatePlaylist, addOneSongToPlaylist } = usePlaylistDialog();

  return (
    <>
      <div className="my-scrollbar ml-scroll-left">
        <div className="ml-scroll-right">
          <div className="header-pai">Nhạc Việt Hôm Nay</div>
          <div>
            {songs.map((e, i) => (
              <List100 key={e.key} index={i + 1} song={e} onPlay={() => {}} />
            ))}
          </div>
          <div className="flex justify-center">
            <ButtonBase className="load-btn" onClick={toggleMount}>
              {mount ? 'Thu Gọn' : 'Xem 100'}
            </ButtonBase>
          </div>
          <div className="header-pai">Khám phá TOP 100</div>
          <Gallery />
        </div>
      </div>

      <Menu
        className="option-ref"
        id="basic-menu"
        anchorEl={subOptionRef}
        open={openSubOptionRef}
        onClose={closeOption}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem className="add-to-list relative" onClick={openCreatePlaylist}>
          <svg className="ref-icon mr-df">
            <use href="#Add" />
          </svg>
          Tạo mới
        </MenuItem>
        {/*{playlist.map((e) => (
          <MenuItem key={e.id} onClick={() => addOneSongToPlaylist(selectedSong!, e.id)}>
            <svg className="ref-icon mr-df">
              <use href="#Playlist" />
            </svg>
            {e.name}
          </MenuItem>
        ))}*/}
      </Menu>
      <CreatePlaylistDialog
        currentSong={selectedSong}
        onClose={() => {
          closeCreatePlaylist();
          closeOption();
        }}
        open={createPlaylist}
      />
    </>
  );
};
