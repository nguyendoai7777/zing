import { type MouseEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import { pushOne, removeOne, selectListenedList } from '@store/slices/listened-history.slice';
import { Menu, MenuItem } from '@mui/material';
import { addOneToPlaylist, type PlaylistState } from '@store/slices/playlist.slice';
import { pause, play, selectPlayState } from '@store/slices/play-state.slice';
import { selectMediaPlayer, setCurrentLists, setCurrentSong } from '@store/slices/media-player.slice';
import type { Song } from '@typing';
import { onActivateEffect } from '@utils';
import { StorageKey } from '@const';
import { ListenedSongItem } from '../listened-song-item.tsx';
import { CreatePlaylistDialog } from '../create-playlist-dialog/create-playlist-dialog.tsx';

export const ListenedHistory = () => {
  const [optionRef, setOptionRef] = useState<null | HTMLElement>(null);
  const [subOptionRef, setSubOptionRef] = useState<null | HTMLElement>(null);
  const [subOptionActive, setSubOptionActive] = useState(false);
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistState[]>([]);

  const { currentHistoryList } = useAppSelector(selectListenedList);
  const { currentSong } = useAppSelector(selectMediaPlayer);
  const { playing } = useAppSelector(selectPlayState);

  const dispatch = useAppDispatch();
  const openOptionRef = Boolean(optionRef);
  const openSubOptionRef = Boolean(subOptionRef);

  const onSelectSong = (e: MouseEvent<HTMLButtonElement>, currentSong: Song) => {
    setOptionRef(e.currentTarget);
    setSelectedSong(currentSong);
  };
  const closeOption = () => {
    setOptionRef(null);
    setSelectedSong(null);
  };

  const playThisSong = (s: Song, e?: any) => {
    if ((currentSong?.id || '') === s.id) {
      dispatch(playing ? pause() : play());
    } else {
      dispatch(pause());
      dispatch(setCurrentSong(s));
      dispatch(pushOne(s));
      const delay = setTimeout(() => {
        dispatch(play());
        dispatch(setCurrentLists(currentHistoryList));
        clearTimeout(delay);
      }, 100);
      e && onActivateEffect(e, s.artwork);
    }
  };

  const addOneSongToPlaylist = (song: Song, parentId: string) => {
    dispatch(addOneToPlaylist({ song, parentId }));
  };

  const deleteOneSong = (index: string) => {
    dispatch(removeOne(index));
    closeOption();
  };

  useEffect(() => {
    const rawPlaylist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
    setPlaylist(rawPlaylist);
  }, []);

  return (
    <>
      <div className="flex flex-wrap listened-list" style={{ marginTop: '6px' }}>
        {currentHistoryList.length > 0 ? (
          <>
            {currentHistoryList.map((e) => (
              <ListenedSongItem
                isMobile={false}
                key={e.id}
                id={e.id}
                artwork={e.artwork}
                url={e.url}
                mainArtist={e.mainArtist}
                songName={e.songName}
                onClick={(ev) => playThisSong(e, ev)}
                isPlaying={playing && e.id === currentSong?.id}
                onOptionClick={(ev) => onSelectSong(ev, e)}
              />
            ))}
          </>
        ) : (
          <div>Trống</div>
        )}
      </div>

      <Menu
        className="option-ref"
        id="basic-menu"
        anchorEl={optionRef}
        open={openOptionRef}
        onClose={closeOption}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => deleteOneSong(selectedSong?.id!)}>
          <svg className="ref-icon mr-df">
            <use href="#Delete" />
          </svg>
          Xóa
        </MenuItem>
        <MenuItem
          className={`add-to-list relative ${subOptionActive ? 'active' : ''}`}
          onClick={(e) => {
            setSubOptionRef(e.currentTarget);
            setSubOptionActive(true);
          }}
          /*onMouseEnter={(e) => setSubOptionRef(e.currentTarget)}
        onMouseLeave={(e) => setSubOptionRef(null)}*/
        >
          <svg className="ref-icon mr-df">
            <use href="#Add" />
          </svg>
          Thêm vào playlist
        </MenuItem>
      </Menu>
      <Menu
        className="option-ref"
        id="basic-menu"
        anchorEl={subOptionRef}
        open={openSubOptionRef}
        onClose={() => {
          setSubOptionRef(null);
          setSubOptionActive(false);
          closeOption();
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem className="add-to-list relative" onClick={(e) => setCreatePlaylist(true)}>
          <svg className="ref-icon mr-df">
            <use href="#Add" />
          </svg>
          Tạo mới
        </MenuItem>
        {playlist.map((e) => (
          <MenuItem key={e.id} onClick={() => addOneSongToPlaylist(selectedSong!, e.id)}>
            <svg className="ref-icon mr-df">
              <use href="#Playlist" />
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
          setSubOptionActive(false);
          closeOption();
        }}
        open={createPlaylist}
      />
    </>
  );
};
