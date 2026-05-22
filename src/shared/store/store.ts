import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { mediaPlayerReducer } from './slices/media-player.slice.ts';
import { playStateReducer } from './slices/play-state.slice.ts';
import { selectListenedReducer } from './slices/listened-history.slice.ts';
import { playlistReducer } from './slices/playlist.slice.ts';
import { loopReducer } from '@store/slices/loop-state.slice.ts';

export const store = configureStore({
  reducer: {
    mediaPlayer: mediaPlayerReducer,
    playState: playStateReducer,
    loop: loopReducer,
    listenedHistory: selectListenedReducer,
    playlist: playlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;

/**
 *  hooks for redux/toolkit
 *
 */
export const useAppDispatch: () => DispatchType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
