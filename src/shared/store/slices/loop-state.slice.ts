import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { StorageKey } from '@const';
import type { RootState } from '../store.ts';

export type UnionLoop = 0 | 1 | 2;

export interface LoopState {
  loop: UnionLoop;
  shuffle: boolean;
}

const initialState: LoopState = {
  loop: +(localStorage.getItem(StorageKey.SetLoop) || 0) as UnionLoop,
  shuffle: (localStorage.getItem(StorageKey.SetShuffle) || '0') === '1',
};

export const mediaControlSlice = createSlice({
  name: 'loopSlice',
  initialState,
  reducers: {
    setLoop: (state, action: PayloadAction<UnionLoop>) => {
      state.loop = action.payload;
      localStorage.setItem(StorageKey.SetLoop, JSON.stringify(action.payload));
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
      localStorage.setItem(StorageKey.SetShuffle, JSON.stringify(action.payload ? 1 : 0));
    },
  },
});

export const { setLoop, setShuffle } = mediaControlSlice.actions;
export const selectLoopState = (state: RootState) => state.loop;
export const loopReducer = mediaControlSlice.reducer;
