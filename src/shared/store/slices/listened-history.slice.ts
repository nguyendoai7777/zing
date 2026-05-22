import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SongBase } from '@typing';
import { StorageKey } from '@const';
import type { RootState } from '../store.ts';

export interface ListenedHistory {
  currentHistoryList: SongBase[];
}

const currentHistoryList = JSON.parse(localStorage.getItem(StorageKey.SetHistoryList) || '[]');
if (!currentHistoryList) {
  localStorage.setItem(StorageKey.SetHistoryList, JSON.stringify([]));
}

const initialState: ListenedHistory = {
  currentHistoryList,
};

export const listenedHistorySlice = createSlice({
  name: 'listenedHistorySlice',
  initialState,
  reducers: {
    removeOne: (state, { payload }: PayloadAction<string>) => {
      const cr = JSON.parse(localStorage.getItem(StorageKey.SetHistoryList) || '[]') as SongBase[];
      const index = cr.findIndex((s) => s.id === payload);
      state.currentHistoryList.splice(index, 1);
      localStorage.setItem(StorageKey.SetHistoryList, JSON.stringify(state.currentHistoryList));
    },
    pushOne: (state, action: PayloadAction<SongBase>) => {
      const cr = JSON.parse(localStorage.getItem(StorageKey.SetHistoryList) || '[]') as SongBase[];
      if (cr.length <= 0) {
        cr.push(action.payload);
      } else {
        const existed = cr.find((e) => e.id === action.payload.id);
        // const existed = cr.find(e => e.songName === action.payload.songName);
        if (!existed) {
          cr.push(action.payload);
        }
      }

      state.currentHistoryList = cr;
      localStorage.setItem(StorageKey.SetHistoryList, JSON.stringify(cr /*state.currentHistoryList*/));
    },
    clear: (state) => {
      state.currentHistoryList = [];
      localStorage.setItem(StorageKey.SetHistoryList, JSON.stringify([]));
    },
  },
});

export const { removeOne, pushOne, clear } = listenedHistorySlice.actions;
export const selectListenedList = (state: RootState) => state.listenedHistory;
export const selectListenedReducer = listenedHistorySlice.reducer;
