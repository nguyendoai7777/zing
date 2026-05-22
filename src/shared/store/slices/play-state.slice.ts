import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store.ts';
export interface PlayState {
  id?: string;
  playing: boolean;
}

const initialState: PlayState = {
  id: undefined,
  playing: false,
};

export const playStateSlice = createSlice({
  name: 'playState',
  initialState,
  reducers: {
    play: (state) => {
      state.playing = true;
    },
    pause: (state) => {
      state.playing = false;
    },
  },
});

export const { pause, play } = playStateSlice.actions;
export const selectPlayState = (state: RootState) => state.playState;
export const playStateReducer = playStateSlice.reducer;
