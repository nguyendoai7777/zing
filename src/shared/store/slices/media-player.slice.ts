import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Song } from '@typing';
import { StorageKey } from '@const';
import type { RootState } from '../store.ts';

export interface CurrentSong {
  currentSong?: Song;
  currentList: Song[];
}

const currentSongInit = localStorage.getItem(StorageKey.SetCurrentSong);
const currentListSongInit = localStorage.getItem(StorageKey.SetCurrentListSong);
if (!currentListSongInit) {
  localStorage.setItem(StorageKey.SetCurrentListSong, JSON.stringify([]));
}

const initialState: CurrentSong = {
  currentSong: (currentSongInit && JSON.parse(currentSongInit)) || undefined,
  currentList: (currentListSongInit && JSON.parse(currentListSongInit)) || [],
};

export const mediaPlayerSlice = createSlice({
  name: 'mediaPlayer',
  initialState,
  reducers: {
    clear: (state) => {
      state.currentSong = undefined;
    },
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
      /// dispatch(pushOne(action.payload));
      localStorage.setItem(StorageKey.SetCurrentSong, JSON.stringify(action.payload));
    },
    setCurrentLists: (state, action: PayloadAction<Song[]>) => {
      state.currentList = action.payload;
      localStorage.setItem(StorageKey.SetCurrentListSong, JSON.stringify(action.payload));
    },
  },
});

export const { clear, setCurrentSong, setCurrentLists } = mediaPlayerSlice.actions;
export const selectMediaPlayer = (state: RootState) => state.mediaPlayer;
export const mediaPlayerReducer = mediaPlayerSlice.reducer;
