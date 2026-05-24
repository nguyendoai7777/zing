import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '@typing';
import { StorageKey } from '@const';
import { DT } from '@utils';
import type { RootState } from '../store.ts';

export interface CreateNewPlaylistPayload {
  song?: Song | null;
  playlistName: string;
  id: string;
}

export interface PlaylistState {
  id: string;
  name: string;
  createAt?: string;
  songs: Song[];
}

const PLAYLIST = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]');
if (!PLAYLIST) {
  localStorage.setItem(StorageKey.PlayList, '[]');
}

const initialState: { playlists: PlaylistState[] } = { playlists: PLAYLIST };

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    createPlaylist: (state, { payload }: PayloadAction<CreateNewPlaylistPayload>) => {
      const playlist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
      playlist.push({
        name: payload.playlistName,
        id: payload.id,
        songs: payload.song ? [payload.song] : [],
        createAt: ` ${DT.now.time} ${DT.now.dateFull}`,
      });
      state.playlists = playlist;
      localStorage.setItem(StorageKey.PlayList, JSON.stringify(playlist));
    },
    deletePlaylist: () => {},
    addOneToPlaylist: (state, action: PayloadAction<{ parentId: string; song: Song }>) => {
      const { parentId, song } = action.payload;
      const playlist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
      const curPlaylists = playlist.find((playlist) => playlist.id === parentId)!;
      const existedSong = curPlaylists.songs.find((e) => e.id === song.id);
      if (!existedSong) {
        curPlaylists.songs.push(action.payload.song);
        localStorage.setItem(StorageKey.PlayList, JSON.stringify(playlist));
        state.playlists = playlist;
      }
    },
    removeOneToPlaylist: (state, action: PayloadAction<{ parentId: string; childId: string }>) => {
      const { parentId, childId } = action.payload;
      const playlist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
      const curPlaylists = playlist.find((playlist) => playlist.id === parentId)!;
      const index = curPlaylists.songs.findIndex((e) => e.id === childId);
      curPlaylists.songs.splice(index, 1);
      state.playlists = playlist;
      localStorage.setItem(StorageKey.PlayList, JSON.stringify(playlist));
    },
    removeThis: (state, { payload }: PayloadAction<string>) => {
      const playlist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
      const index = playlist.findIndex((e) => e.id === payload);
      playlist.splice(index, 1);
      state.playlists = playlist;
      localStorage.setItem(StorageKey.PlayList, JSON.stringify(playlist));
    },
  },
});

export const { deletePlaylist, removeThis, createPlaylist, removeOneToPlaylist, addOneToPlaylist } = playlistSlice.actions;
export const selectPlaylist = (state: RootState) => state.playlist;
export const playlistReducer = playlistSlice.reducer;
