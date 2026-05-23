import { createRef, useEffect, useRef, useState } from 'react';
import type { WheelEvent, RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_VOLUME, StorageKey } from '@const';
import { pause, play, selectPlayState } from '@store/slices/play-state.slice.ts';
import { selectMediaPlayer, setCurrentLists, setCurrentSong } from '@store/slices/media-player.slice.ts';
import { pushOne } from '@store/slices/listened-history.slice.ts';
import { onActivateEffect, saveVolumeToLocal } from '@utils';
import type { Prettify, SongBase } from '@typing';
import { useAppDispatch, useAppSelector } from '@store/store.ts';
import { selectLoopState, setLoop, setShuffle, type UnionLoop } from '@store/slices/loop-state.slice.ts';

type SongRef<T = any> = Record<string, RefObject<T>>;

const VOLUME_ICON_MAP = (vol: number) => (vol === 0 ? 'Mute' : vol < 30 ? 'Min' : vol < 75 ? 'Medium' : 'Max');

// ─── Volume ──────────────────────────────────────────────────────────

export function useVolume() {
  const localVolumeState = +(localStorage.getItem(StorageKey.SetVolume) || DEFAULT_VOLUME);
  const mp3Audio = document.querySelector('audio')!;
  const [mute, setMute] = useState((localStorage.getItem(StorageKey.SetMute) || '0') === '1');
  const [volume, setVolume] = useState(localVolumeState);

  const volumeIcon = `Volume${VOLUME_ICON_MAP(volume)}`;
  const toggleMute = () => setMute(!mute);

  const onVolumeChange = (value: number) => {
    setVolume(value);
    saveVolumeToLocal(value);
  };

  const onWheelChange = (e: WheelEvent) => {
    const delta = e.deltaY < 0 ? 1 : -1;
    const next = Math.max(0, Math.min(100, volume + delta));
    if (next !== volume) {
      setVolume(next);
      saveVolumeToLocal(next);
    }
  };

  useEffect(() => {
    const cacheVolume = +(localStorage.getItem(StorageKey.SetCacheVolume) || DEFAULT_VOLUME);
    setVolume(mute ? 0 : cacheVolume);
    localStorage.setItem(StorageKey.SetMute, mute ? '1' : '0');
  }, [mute]);

  useEffect(() => {
    mp3Audio.volume = volume / 100;
  }, [volume]);

  return { volume, mute, volumeIcon, toggleMute, onVolumeChange, onWheelChange };
}

// ─── Playback Controls ──────────────────────────────────────────────

export function usePlaybackControls() {
  const dispatch = useAppDispatch();
  const playSelector = useAppSelector(selectPlayState);
  const mediaSelector = useAppSelector(selectMediaPlayer);
  const mediaControlSelector = useAppSelector(selectLoopState);
  const crSong = mediaSelector.currentSong;
  const crListSong = mediaSelector.currentList;
  const mp3Audio = document.querySelector('audio')!;

  const isPlaying = playSelector.playing;
  const loop = mediaControlSelector.loop;
  const shuffle = mediaControlSelector.shuffle;

  const setPlayDelay = () => {
    const delay = setTimeout(() => {
      dispatch(play());
      clearTimeout(delay);
    }, 100);
  };

  const togglePlaying = () => {
    dispatch(isPlaying ? pause() : play());
  };

  const onNext = () => {
    const currentIndex = crListSong.findIndex((e) => e.id === crSong?.id);
    dispatch(pause());
    if (currentIndex < crListSong.length - 1) {
      mp3Audio.currentTime = 0;
      dispatch(setCurrentSong(crListSong[currentIndex + 1]));
      setPlayDelay();
    } else {
      dispatch(setCurrentSong(crListSong[0]));
    }
  };

  const onPrev = () => {
    const currentIndex = crListSong.findIndex((e) => e.id === crSong?.id);
    dispatch(pause());
    if (currentIndex > 0) {
      dispatch(setCurrentSong(crListSong[currentIndex - 1]));
      setPlayDelay();
    } else {
      dispatch(setCurrentSong(crListSong[crListSong.length - 1]));
      setPlayDelay();
    }
  };

  const playThisSong = (s: SongBase, e?: any) => {
    if ((crSong?.id || '') === s.id) {
      dispatch(isPlaying ? pause() : play());
    } else {
      dispatch(pause());
      dispatch(setCurrentSong(s));
      dispatch(pushOne(s));
      const delay = setTimeout(() => {
        dispatch(play());
        dispatch(setCurrentLists(crListSong));
        clearTimeout(delay);
      }, 100);
      e && onActivateEffect(e, s.artwork);
    }
  };

  const toggleLoop = () => {
    dispatch(setLoop(((loop + 1) % 3) as UnionLoop));
  };

  const toggleShuffle = () => {
    dispatch(setShuffle(!shuffle));
  };

  return {
    isPlaying,
    loop,
    shuffle,
    crSong,
    crListSong,
    togglePlaying,
    onNext,
    onPrev,
    playThisSong,
    toggleLoop,
    toggleShuffle,
  };
}

// ─── Audio Engine (duration, time tracking, keyboard, loop behavior) ─

export function useAudioEngine(crSong: SongBase | undefined, crListSong: SongBase[], mediaLoop: number, onNext: () => void) {
  const dispatch = useAppDispatch();
  const playSelector = useAppSelector(selectPlayState);
  const mp3Audio = document.querySelector('audio')!;

  const [duration, setDuration] = useState(0);
  const [currentPlayingTime, setCurrentPlayingTime] = useState(0);

  const seekTo = (value: number) => {
    mp3Audio.currentTime = value;
    setCurrentPlayingTime(value);
  };

  // keyboard shortcuts + init
  useEffect(() => {
    let playState = playSelector.playing;
    if (innerWidth <= 700) {
      document.querySelector('html')!.classList.add('on-mb');
    }
    window.onkeydown = (e) => {
      switch (e.code) {
        case 'ArrowRight':
          mp3Audio.currentTime += 2;
          break;
        case 'ArrowLeft':
          mp3Audio.currentTime -= 2;
          break;
        case 'Space':
          dispatch(playState ? pause() : play());
          playState = !playState;
          break;
      }
    };
  }, []);

  // media source sync
  useEffect(() => {
    mp3Audio.src = crSong?.mediaUrl!;
    mp3Audio.loop = mediaLoop === 1;
    mp3Audio.onloadeddata = () => setDuration(mp3Audio.duration || 0);
    mp3Audio.ontimeupdate = () => setCurrentPlayingTime(mp3Audio.currentTime);
  }, [crSong]);

  // loop behavior
  useEffect(() => {
    mp3Audio.loop = mediaLoop === 1;
    switch (mediaLoop) {
      case 0: {
        const currentIndex = crListSong.findIndex((e) => e.id === crSong?.id);
        mp3Audio.onended = () => {
          if (currentIndex === crListSong.length - 1) {
            dispatch(pause());
            mp3Audio.currentTime = 0;
            dispatch(setCurrentSong(crListSong[0]));
          } else {
            onNext();
          }
        };
        break;
      }
      case 1:
        break;
      case 2:
        mp3Audio.onended = () => {
          mp3Audio.currentTime = 0;
          onNext();
        };
        break;
    }
  }, [mediaLoop]);

  // play/pause sync
  useEffect(() => {
    if (playSelector.playing) {
      void mp3Audio.play();
    } else {
      mp3Audio.pause();
    }
  }, [playSelector.playing]);

  return { duration, currentPlayingTime, seekTo };
}

// ─── Song Name Overflow Detection ───────────────────────────────────

export function useNameOverflow(crSong: SongBase | undefined) {
  const nameWrapperRef = useRef<HTMLDivElement>();
  const nameRef = useRef<HTMLDivElement>();
  const [needDoubleName, setNeedDoubleName] = useState(false);

  useEffect(() => {
    setNeedDoubleName(nameWrapperRef.current?.offsetWidth < nameRef.current?.offsetWidth);
  }, [crSong]);

  return { nameWrapperRef, nameRef, needDoubleName };
}

// ─── Mobile Drawer / Detail Sheet ───────────────────────────────────

export function useMobileDrawer(
  crSong: SongBase | undefined,
  crListSong: SongBase[],
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  refs: SongRef<HTMLElement>
) {
  const [detailOfSong, setDetailOfSong] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(innerWidth - 24);
  const [showBody, setShowBody] = useState(false);
  const [displayLyric, setDisplayLyric] = useState(false);
  const [displayCurrentList, setDisplayCurrentList] = useState(false);
  const [cacheScrollPosition, setCacheScrollPosition] = useState(0);
  const location = useLocation();

  const toggleDrawer = (open: boolean) => () => setDetailOfSong(open);
  const closeDrawer = () => setDetailOfSong(false);
  const toggleLyric = () => setDisplayLyric(!displayLyric);
  const toggleCurrentList = () => setDisplayCurrentList(!displayCurrentList);
  const onScrollCapture = () => {
    if (displayLyric) {
      setCacheScrollPosition(scrollContainerRef.current?.scrollTop || 0);
    }
  };

  // resize + popstate
  useEffect(() => {
    window.onresize = () => setDeviceWidth(innerWidth - 24);
    window.onload = () => setDeviceWidth(innerWidth - 24);
    window.onpopstate = () => setDetailOfSong(false);
  }, []);

  // close on route change
  useEffect(() => {
    setDetailOfSong(false);
  }, [location]);

  // auto-scroll to current song in list
  useEffect(() => {
    if (detailOfSong && displayCurrentList && showBody) {
      const current = crListSong.find((e) => e.id === crSong?.id);
      const currentIndex = crListSong.findIndex((e) => e.id === crSong?.id);
      if (current) {
        const { height } = refs[current.id].current.getBoundingClientRect();
        scrollContainerRef.current?.scrollTo({
          top: ((currentIndex <= 0 ? 1 : currentIndex) - 1) * height,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [detailOfSong, displayCurrentList, showBody]);

  // showBody derived from lyric/list toggle
  useEffect(() => {
    setShowBody(displayLyric || displayCurrentList);
  }, [displayLyric, displayCurrentList]);

  // mutual exclusion: lyric vs currentList
  useEffect(() => {
    if (displayCurrentList) setDisplayLyric(false);
  }, [displayCurrentList]);
  useEffect(() => {
    if (displayLyric) setDisplayCurrentList(false);
  }, [displayLyric]);

  // restore lyric scroll position
  useEffect(() => {
    if (detailOfSong && displayLyric && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: cacheScrollPosition + 6, left: 0, behavior: 'smooth' });
    }
  }, [detailOfSong, displayLyric]);

  // mobile class toggle
  useEffect(() => {
    const html = document.querySelector('html')!;
    if (detailOfSong) {
      html.classList.add('on-mb');
    } else if (!document.body.classList.contains('on-mb')) {
      html.classList.remove('on-mb');
    }
  }, [detailOfSong]);

  return {
    detailOfSong,
    deviceWidth,
    showBody,
    displayLyric,
    displayCurrentList,
    toggleDrawer,
    closeDrawer,
    toggleLyric,
    toggleCurrentList,
    onScrollCapture,
  };
}

// ─── Song Refs ──────────────────────────────────────────────────────

export function useSongRefs(crListSong: SongBase[]) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const refs = crListSong.reduce((acc: SongRef, value) => {
    acc[value.id] = createRef();
    return acc;
  }, {});

  return { scrollContainerRef, refs };
}
