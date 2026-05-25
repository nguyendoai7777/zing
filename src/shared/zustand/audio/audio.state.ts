import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import type { AudioState, UnionLoop } from './audio.types';
import { DEFAULT_VOLUME } from '@const';
import type { Song } from '@typing';
import { songFromUrl } from '@utils';

export const audioEngine = new Audio();

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      songList: [],
      currentList: [],
      currentSong: null,
      queueIds: [],
      volume: DEFAULT_VOLUME,
      isMute: false,
      cacheVolume: DEFAULT_VOLUME,
      loop: 0,
      shuffle: false,
      setupAudioListeners: () => {
        audioEngine.ontimeupdate = () => {
          set({ currentTime: audioEngine.currentTime });
        };

        audioEngine.onloadeddata = () => {
          set({ duration: audioEngine.duration || 0 });
        };

        audioEngine.onended = () => {
          const { loop, onNext } = get();
          if (loop === 1) {
            audioEngine.currentTime = 0;
            audioEngine.play().catch(() => {});
          } else {
            onNext();
          }
        };
      },
      initEngine: () => {
        const { volume, isMute, setupAudioListeners, seekTo, togglePlaying, currentSong } = get();
        if (currentSong) {
          audioEngine.volume = isMute ? 0 : volume / 100;
          audioEngine.src = songFromUrl(currentSong);
          set({ duration: currentSong?.duration ?? 0 });
          setupAudioListeners();
          window.onkeydown = (e) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
            switch (e.code) {
              case 'ArrowRight':
                seekTo(audioEngine.currentTime + 2);
                break;
              case 'ArrowLeft':
                seekTo(audioEngine.currentTime - 2);
                break;
              case 'Space':
                e.preventDefault();
                togglePlaying();
                break;
            }
          };
        }
      },

      setSongsData: (songs) => {
        set({
          songList: songs,
        });
        get().syncQueue();
      },

      syncQueue: () => {
        const { songList, queueIds } = get();
        if (songList.length === 0 || queueIds.length === 0) return;
        const fullList = queueIds.map((id) => songList.find((s) => s.id === id)).filter((s): s is Song => !!s);
        set({ currentList: fullList });
      },

      togglePlaying: () => {
        const { isPlaying, currentSong } = get();
        if (!currentSong) return;

        if (isPlaying) {
          audioEngine.pause();
          set({ isPlaying: false });
        } else {
          audioEngine
            .play()
            .then(() => set({ isPlaying: true }))
            .catch(() => set({ isPlaying: false }));
        }
      },

      playThisSong: (song, list) => {
        const { currentSong, volume, isMute } = get();

        if (list && list.length > 0) {
          set({
            currentList: list,
            queueIds: list.map((s) => s.id),
          });
        }

        if (currentSong?.id === song.id) {
          get().togglePlaying();
          return;
        }
        audioEngine.volume = isMute ? 0 : volume / 100;
        audioEngine.src = songFromUrl(song);
        audioEngine.currentTime = 0;
        set({ currentSong: song, isPlaying: false, currentTime: 0, duration: song.duration || 0 });
        get().setupAudioListeners();
        audioEngine
          .play()
          .then(() => set({ isPlaying: true }))
          .catch((e) => {
            console.log(`@@ play error`, e);
            set({ isPlaying: false });
          });
      },

      onNext: () => {
        const { currentList, currentSong, shuffle, loop } = get();
        if (currentList.length === 0) return;

        let nextIndex = 0;
        const currentIndex = currentList.findIndex((s) => s.id === currentSong?.id);

        if (shuffle) {
          nextIndex = Math.floor(Math.random() * currentList.length);
        } else if (currentIndex < currentList.length - 1) {
          nextIndex = currentIndex + 1;
        } else {
          if (loop === 0) {
            audioEngine.pause();
            audioEngine.currentTime = 0;
            set({ isPlaying: false, currentTime: 0 });
            return;
          }
          nextIndex = 0;
        }

        get().playThisSong(currentList[nextIndex]);
      },

      onPrev: () => {
        const { currentList, currentSong } = get();
        if (currentList.length === 0) return;

        const currentIndex = currentList.findIndex((s) => s.id === currentSong?.id);
        let prevIndex = currentList.length - 1;

        if (currentIndex > 0) {
          prevIndex = currentIndex - 1;
        }

        get().playThisSong(currentList[prevIndex]);
      },

      seekTo: (time) => {
        const validTime = Math.max(0, Math.min(get().duration, time));
        audioEngine.currentTime = validTime;
        set({ currentTime: validTime });
      },

      setVolume: (val) =>
        set((state) => {
          const nextVolume = Math.max(0, Math.min(100, val));
          audioEngine.volume = nextVolume / 100;
          return {
            volume: nextVolume,
            isMute: nextVolume === 0,
            cacheVolume: nextVolume !== 0 ? nextVolume : state.cacheVolume,
          };
        }),

      toggleMute: () =>
        set((state) => {
          const nextMute = !state.isMute;
          const targetVolume = nextMute ? 0 : state.cacheVolume;
          audioEngine.volume = targetVolume / 100;
          return {
            isMute: nextMute,
            volume: targetVolume,
          };
        }),

      toggleLoop: () =>
        set((state) => ({
          loop: ((state.loop + 1) % 3) as UnionLoop,
        })),

      toggleShuffle: () =>
        set((state) => ({
          shuffle: !state.shuffle,
        })),
      removeSongFromQueue(song) {
        const { currentList } = get();
        const list = currentList.filter((s) => s.id !== song.id);
        set({ currentList: list });
      },
    }),
    {
      name: 'audio-player-storage',
      partialize: (state) => ({
        currentSong: state.currentSong,
        queueIds: state.queueIds,
        volume: state.volume,
        isMute: state.isMute,
        cacheVolume: state.cacheVolume,
        loop: state.loop,
        shuffle: state.shuffle,
      }),
    }
  )
);
