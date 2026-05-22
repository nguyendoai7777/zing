import './top-100.css';
import { type MouseEvent, useEffect, useState } from 'react';
import { ButtonBase, Menu, MenuItem } from '@mui/material';
import { useAppDispatch } from '@store/store';
import { setCurrentLists } from '@store/slices/media-player.slice';
import { addOneToPlaylist, type PlaylistState } from '@store/slices/playlist.slice';
import { generateSongsByAmount } from '@const';
import { uuid } from '@utils';
import type { SongBase } from '@typing';
import { List100 } from './components/list/list.tsx';
import { Gallery } from './components/gallery/gallery.tsx';
import { CreatePlaylistDialog } from '../personal/components/create-playlist-dialog/create-playlist-dialog.tsx';

export const Top100Screen = () => {
  const song10 = generateSongsByAmount(10).map((e) => ({ ...e, key: uuid() }));
  const song100 = generateSongsByAmount(100).map((e) => ({ ...e, key: uuid() }));
  const [songs, setSongs] = useState(song10);
  const [mount, setMount] = useState(false);
  const [subOptionRef, setSubOptionRef] = useState<null | HTMLElement>(null);
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongBase | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistState[]>([]);
  const openSubOptionRef = Boolean(subOptionRef);

  const dispatch = useAppDispatch();
  const setList = () => {
    setMount(!mount);
  };
  const onSelectSong = (e: MouseEvent<HTMLElement>, currentSong: SongBase) => {
    setSubOptionRef(e.currentTarget);
    setSelectedSong(currentSong);
  };
  const closeOption = () => {
    setSubOptionRef(null);
    setSelectedSong(null);
  };

  const addOneSongToPlaylist = (song: SongBase, parentId: string) => {
    dispatch(addOneToPlaylist({ song, parentId }));
  };

  useEffect(() => {
    setSongs(mount ? song100 : song10);
  }, [mount]);

  return (
    <>
      <div className="my-scrollbar ml-scroll-left">
        <div className="ml-scroll-right">
          <div className="header-pai">Nhạc Việt Hôm Nay</div>
          <div>
            {songs.map((e, i) => (
              <List100 key={e.key} index={i + 1} song={e} onPlay={() => dispatch(setCurrentLists(songs))} onAdd={(ev) => onSelectSong(ev, e)} />
            ))}
          </div>
          <div className="flex justify-content-center">
            <ButtonBase className="load-btn" onClick={setList}>
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
        onClose={() => {
          setSubOptionRef(null);
          closeOption();
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem className="add-to-list relative" onClick={(e) => setCreatePlaylist(true)}>
          <svg className="ref-icon mr-df">
            <use href="#add" />
          </svg>
          Tạo mới
        </MenuItem>
        {playlist.map((e) => (
          <MenuItem key={e.id} onClick={() => addOneSongToPlaylist(selectedSong!, e.id)}>
            <svg className="ref-icon mr-df">
              <use href="#playlist" />
            </svg>
            {e.name}
          </MenuItem>
        ))}
      </Menu>
      <CreatePlaylistDialog
        currentSong={selectedSong}
        onClose={() => {
          setCreatePlaylist(false);
          setSubOptionRef(null);
          closeOption();
        }}
        open={createPlaylist}
      />
    </>
  );
};
