import { type MouseEvent, useEffect, useState } from 'react';
import { generateSongsByAmount } from '@const';
import { uuid } from '@utils';
import type { Song } from '@typing';

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
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const openSubOptionRef = Boolean(subOptionRef);

  const onSelectSong = (e: MouseEvent<HTMLElement>, currentSong: Song) => {
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
  const [createPlaylist, setCreatePlaylist] = useState(false);

  const openCreatePlaylist = () => setCreatePlaylist(true);
  const closeCreatePlaylist = () => setCreatePlaylist(false);

  const addOneSongToPlaylist = (song: Song, parentId: string) => {};

  return { createPlaylist, openCreatePlaylist, closeCreatePlaylist, addOneSongToPlaylist };
}
