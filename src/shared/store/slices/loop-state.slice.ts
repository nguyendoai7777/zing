import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/store';
import { LOCAL_KEY } from '@constants/storage-key.const';

export type UnionLoop = 0 | 1 | 2;

export interface LoopState {
  loop: UnionLoop;
  shuffle: boolean;
}

const initialState: LoopState = {
  loop: +(localStorage.getItem(LOCAL_KEY.SetLoop) || 0) as UnionLoop,
  shuffle: (localStorage.getItem(LOCAL_KEY.SetShuffle) || '0') === '1'
};

export const mediaControlSlice = createSlice({
  name: 'loopSlice',
  initialState,
  reducers: {
    setLoop: (state, action: PayloadAction<UnionLoop>) => {
      state.loop = action.payload;
      localStorage.setItem(LOCAL_KEY.SetLoop, JSON.stringify(action.payload));
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
      localStorage.setItem(LOCAL_KEY.SetShuffle, JSON.stringify(action.payload ? 1 : 0));
    }
  }
});

export const { setLoop, setShuffle } = mediaControlSlice.actions;
export const selectLoopState = (state: RootState) => state.loop;
export const mediaControlReducer = mediaControlSlice.reducer;
