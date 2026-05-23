import { type MouseEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '@store/store';
import { addOneToPlaylist, type PlaylistState } from '@store/slices/playlist.slice';
import { generateSongsByAmount } from '@const';
import { uuid } from '@utils';
import type { SongBase } from '@typing';

export function useSongList() {
  const song10 = generateSongsByAmount(10).map((e) => ({ ...e, key: uuid() }));
  const song100 = generateSongsByAmount(100).map((e) => ({ ...e, key: uuid() }));
  const [songs, setSongs] = useState(song10);
  const [mount, setMount] = useState(false);

  const toggleMount = () => {
    setMount(!mount);
  };

  useEffect(() => {
    setSongs(mount ? song100 : song10);
  }, [mount]);

  return { songs, mount, toggleMount };
}

export function useSongOptionMenu() {
  const [subOptionRef, setSubOptionRef] = useState<null | HTMLElement>(null);
  const [selectedSong, setSelectedSong] = useState<SongBase | null>(null);
  const openSubOptionRef = Boolean(subOptionRef);

  const onSelectSong = (e: MouseEvent<HTMLElement>, currentSong: SongBase) => {
    setSubOptionRef(e.currentTarget);
    setSelectedSong(currentSong);
  };

  const closeOption = () => {
    setSubOptionRef(null);
    setSelectedSong(null);
  };

  return { subOptionRef, selectedSong, openSubOptionRef, onSelectSong, closeOption };
}

export function usePlaylistDialog() {
  const dispatch = useAppDispatch();
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [playlist] = useState<PlaylistState[]>([]);

  const openCreatePlaylist = () => setCreatePlaylist(true);
  const closeCreatePlaylist = () => setCreatePlaylist(false);

  const addOneSongToPlaylist = (song: SongBase, parentId: string) => {
    dispatch(addOneToPlaylist({ song, parentId }));
  };

  return { createPlaylist, playlist, openCreatePlaylist, closeCreatePlaylist, addOneSongToPlaylist };
}
