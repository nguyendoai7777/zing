import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { SongBase } from '@models/media.model';
import { LOCAL_KEY } from '@constants/storage-key.const';
import { DT } from '@modules/feature.module';

export interface CreateNewPlaylistPayload {
  song?: SongBase | null;
  playlistName: string;
  id: string;
}

export interface PlaylistState {
  id: string;
  name: string;
  createAt?: string;
  songs: SongBase[];
}

const PLAYLIST = JSON.parse(localStorage.getItem(LOCAL_KEY.PlayList) || '[]');
if (!PLAYLIST) {
  localStorage.setItem(LOCAL_KEY.PlayList, '[]');
}

const initialState: { playlists: PlaylistState[] } = { playlists: PLAYLIST };

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    createPlaylist: (state, { payload }: PayloadAction<CreateNewPlaylistPayload>) => {
      const playlist = JSON.parse(localStorage.getItem(LOCAL_KEY.PlayList) || '[]') as PlaylistState[];
      playlist.push({
        name: payload.playlistName,
        id: payload.id,
        songs: payload.song ? [payload.song] : [],
        createAt: ` ${DT.now.time} ${DT.now.dateFull}`,
      });
      state.playlists = playlist;
      localStorage.setItem(LOCAL_KEY.PlayList, JSON.stringify(playlist));
    },
    deletePlaylist: () => {
    },
    addOneToPlaylist: (state, action: PayloadAction<{ parentId: string, song: SongBase }>) => {
      const { parentId, song } = action.payload;
      const playlist = JSON.parse(localStorage.getItem(LOCAL_KEY.PlayList) || '[]') as PlaylistState[];
      const curPlaylists = playlist.find(playlist => playlist.id === parentId)!;
      const existedSong = curPlaylists.songs.find(e => e.id === song.id);
      if (!existedSong) {
        curPlaylists.songs.push(action.payload.song);
        localStorage.setItem(LOCAL_KEY.PlayList, JSON.stringify(playlist));
        state.playlists = playlist;
      }
    },
    removeOneToPlaylist: (state, action: PayloadAction<{ parentId: string, childId: string }>) => {
      const { parentId, childId } = action.payload;
      const playlist = JSON.parse(localStorage.getItem(LOCAL_KEY.PlayList) || '[]') as PlaylistState[];
      const curPlaylists = playlist.find(playlist => playlist.id === parentId)!;
      const index = curPlaylists.songs.findIndex(e => e.id === childId);
      curPlaylists.songs.splice(index, 1);
      state.playlists = playlist;
      localStorage.setItem(LOCAL_KEY.PlayList, JSON.stringify(playlist));
    },
    removeThis: (state, { payload }: PayloadAction<string>) => {
      const playlist = JSON.parse(localStorage.getItem(LOCAL_KEY.PlayList) || '[]') as PlaylistState[];
      const index = playlist.findIndex(e => e.id === payload);
      playlist.splice(index, 1);
      state.playlists = playlist;
      localStorage.setItem(LOCAL_KEY.PlayList, JSON.stringify(playlist));
    }
  }
});

export const { deletePlaylist, removeThis, createPlaylist, removeOneToPlaylist, addOneToPlaylist } = playlistSlice.actions;
export const selectPlaylist = (state: RootState) => state.playlist;
export const playlistReducer = playlistSlice.reducer;

