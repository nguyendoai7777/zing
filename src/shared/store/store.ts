import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { mediaPlayerReducer } from '@store/slices/media-player.slice';
import { playStateReducer } from '@store/slices/play-state.slice';
import { mediaControlReducer } from './slices/loop-state.slice';
import { selectListenedReducer } from '@store/slices/listened-history.slice';
import { playlistReducer } from '@store/slices/playlist.slice';

export const store = configureStore({
  reducer: {
    mediaPlayer: mediaPlayerReducer,
    playState: playStateReducer,
    loop: mediaControlReducer,
    listenedHistory: selectListenedReducer,
    playlist: playlistReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch;


/**
 *  hooks for redux/toolkit
 *
 */
export const useAppDispatch: () => DispatchType = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
