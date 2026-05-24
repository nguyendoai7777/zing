import { createRef, useEffect, useRef, useState } from 'react';
import type { WheelEvent, RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import type { Song } from '@typing';

type SongRef<T = any> = Record<string, RefObject<T>>;

export function useNameOverflow(crSong: Song | null) {
  const nameWrapperRef = useRef<HTMLDivElement>();
  const nameRef = useRef<HTMLDivElement>();
  const [needDoubleName, setNeedDoubleName] = useState(false);

  useEffect(() => {
    setNeedDoubleName(nameWrapperRef.current?.offsetWidth < nameRef.current?.offsetWidth);
  }, [crSong]);

  return { nameWrapperRef, nameRef, needDoubleName };
}

// ─── Mobile Drawer / Detail Sheet ───────────────────────────────────

export function useMobileDrawer(crSong: Song | null, crListSong: Song[], scrollContainerRef: RefObject<HTMLDivElement | null>, refs: SongRef<HTMLElement>) {
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

  useEffect(() => {
    setShowBody(displayLyric || displayCurrentList);
  }, [displayLyric, displayCurrentList]);

  useEffect(() => {
    if (displayCurrentList) setDisplayLyric(false);
  }, [displayCurrentList]);
  useEffect(() => {
    if (displayLyric) setDisplayCurrentList(false);
  }, [displayLyric]);

  useEffect(() => {
    if (detailOfSong && displayLyric && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: cacheScrollPosition + 6, left: 0, behavior: 'smooth' });
    }
  }, [detailOfSong, displayLyric]);

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

export function useSongRefs(crListSong: Song[]) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const refs = crListSong.reduce((acc: SongRef, value) => {
    acc[value.id] = createRef();
    return acc;
  }, {});

  return { scrollContainerRef, refs };
}
