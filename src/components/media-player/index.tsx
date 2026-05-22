import './media-player.css';
import { createRef, type RefObject, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonBase, Slider, SwipeableDrawer } from '@mui/material';
import { DEFAULT_VOLUME, MB_VOLUME_SX, SLIDER_SX, StorageKey, VOLUME_SX } from '@const';
import { pause, play, selectPlayState } from '@store/slices/play-state.slice.ts';
import { selectMediaPlayer, setCurrentLists, setCurrentSong } from '@store/slices/media-player.slice.ts';
import { pushOne } from '@store/slices/listened-history.slice.ts';
import { durationConverter, isAppleFk, nameConverter, onActivateEffect, saveVolumeToLocal } from '@utils';
import type { SongBase } from '@typing';
import { useAppDispatch, useAppSelector } from '@store/store.ts';
import { type LoopState, selectLoopState, setLoop, setShuffle, type UnionLoop } from '@store/slices/loop-state.slice.ts';
import { BottomNav } from '@components/bottom-nav';
import { ListenedSongItem } from '../../screens/personal/components/listened-song-item.tsx';

type SongRef = { [key: string | number]: RefObject<unknown> | any };

export const MediaPlayer = () => {
  const localVolumeState = +(localStorage.getItem(StorageKey.SetVolume) || DEFAULT_VOLUME);
  const nameWrapperRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mp3Audio = document.querySelector('audio')!;
  const [needDoubleName, setNeedDoubleName] = useState(false);
  const [mute, setMute] = useState((localStorage.getItem(StorageKey.SetMute) || '0') === '1');
  const [volume, setVolume] = useState(localVolumeState);
  const [duration, setDuration] = useState(0);
  const [currentPlayingTime, setCurrentPlayingTime] = useState(0);
  const [detailOfSong, setDetailOfSong] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(innerWidth - 24);
  const [showBody, setShowBody] = useState(false);
  const [displayLyric, setDisplayLyric] = useState(false);
  const [displayCurrentList, setDisplayCurrentList] = useState(false);
  const [cacheScrollPosition, setCacheScrollPosition] = useState(0);
  const [lActive, setLActive] = useState(-1);
  const playSelector = useAppSelector(selectPlayState);
  const mediaControlSelector = useAppSelector(selectLoopState);
  const mediaSelector = useAppSelector(selectMediaPlayer);
  const crSong = mediaSelector.currentSong;
  const crListSong = mediaSelector.currentList;
  const dispatch = useAppDispatch();

  let c = -1;

  const refs = crListSong.reduce(
    (acc: SongBase & SongRef, value) => {
      acc[value.id] = createRef();
      return acc;
    },
    {} as SongBase & SongRef
  ) as SongBase & SongRef;

  const onVolumeChange = (value: number) => {
    setVolume(value);
    saveVolumeToLocal(value);
  };

  const onWheelChange = (e: any) => {
    const event = e as unknown as WheelEvent;
    if (event.deltaY < 0) {
      if (volume >= 0 && volume < 100) {
        setVolume(volume + 1);
        saveVolumeToLocal(volume);
      }
    } else {
      if (volume > 0 && volume <= 100) {
        setVolume(volume - 1);
        saveVolumeToLocal(volume);
      }
    }
  };

  const setPlaying = () => {
    const t = !playSelector.playing;
    dispatch(t ? play() : pause());
  };

  const setPlayDelay = () => {
    const delay = setTimeout(() => {
      dispatch(play());
      clearTimeout(delay);
    }, 100);
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

  const setLoopState = () => {
    const l = mediaControlSelector.loop;
    dispatch(setLoop(((l + 1) % 3) as UnionLoop));
  };

  const setShuffleState = () => {
    const s = mediaControlSelector.shuffle;
    dispatch(setShuffle(!s));
  };

  const container = window !== undefined ? () => window.document.body : undefined;

  const toggleDrawer = (newOpen: boolean) => () => {
    setDetailOfSong(newOpen);
  };

  const playThisSong = (s: SongBase, e?: any) => {
    if ((crSong?.id || '') === s.id) {
      dispatch(playSelector.playing ? pause() : play());
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

  useEffect(() => {
    let playState = playSelector.playing;
    window.onresize = () => {
      setDeviceWidth(innerWidth - 24);
    };
    window.onload = () => {
      setDeviceWidth(innerWidth - 24);
    };
    window.onpopstate = () => {
      toggleDrawer(false)();
    };
    if (innerWidth <= 700) {
      const html = document.querySelector('html');
      html!.classList.add('on-mb');
    }
    window.onkeydown = (e) => {
      switch (e.code) {
        case 'ArrowRight': {
          mp3Audio.currentTime += 2;
          break;
        }
        case 'ArrowLeft': {
          mp3Audio.currentTime -= 2;
          break;
        }
        /*   case 'ArrowUp': {
             onVolumeChange(volume + 2);
             break;
           }
           case 'ArrowDown': {
             onVolumeChange(volume - 2);
             break;
           }*/
        case 'Space': {
          dispatch(playState ? pause() : play());
          playState = !playState;
          break;
        }
      }
    };
  }, []);
  useEffect(() => {
    toggleDrawer(false)();
  }, [useLocation()]);

  useEffect(() => {
    if (detailOfSong && displayCurrentList && showBody) {
      const current = crListSong.find((e) => e.id === crSong?.id);
      const currentIndex = crListSong.findIndex((e) => e.id === crSong?.id);
      if (current) {
        const { height } = refs[current.id].current.getBoundingClientRect() as DOMRect;
        scrollContainerRef.current?.scrollTo({ top: ((currentIndex <= 0 ? 1 : currentIndex) - 1) * height, left: 0, behavior: 'smooth' });
      }
    }
  }, [detailOfSong, displayCurrentList, showBody]);

  useEffect(() => {
    const cacheVolume = +(localStorage.getItem(StorageKey.SetCacheVolume) || DEFAULT_VOLUME);
    setVolume(mute ? 0 : cacheVolume);
    localStorage.setItem(StorageKey.SetMute, mute ? '1' : '0');
  }, [mute]);
  useEffect(() => {
    mp3Audio.loop = mediaControlSelector.loop === 1;
    switch (mediaControlSelector.loop) {
      case 0: {
        // no loop
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
      case 1: {
        break;
      }
      case 2: {
        // loop all
        mp3Audio.onended = () => {
          mp3Audio.currentTime = 0;
          onNext();
        };
        break;
      }
    }
  }, [mediaControlSelector.loop]);
  useEffect(() => {
    setNeedDoubleName(nameWrapperRef.current?.offsetWidth! < nameRef.current?.offsetWidth!);
    mp3Audio.src = crSong?.mediaUrl!;
    mp3Audio.loop = mediaControlSelector.loop === 1;
    mp3Audio.onloadeddata = () => {
      setDuration(mp3Audio.duration || 0);
    };
    mp3Audio.ontimeupdate = () => {
      setCurrentPlayingTime(mp3Audio.currentTime);
    };
  }, [mediaSelector]);
  useEffect(() => {
    mp3Audio.volume = volume / 100;
  }, [volume]);
  useEffect(() => {
    c = -1;
    const p = playSelector.playing;
    if (p) {
      void mp3Audio.play();
    } else {
      mp3Audio.pause();
    }
  }, [playSelector.playing]);
  useEffect(() => {
    if (displayLyric || displayCurrentList) {
      setShowBody(true);
    }
    if (!displayLyric && !displayCurrentList) {
      setShowBody(false);
    }
  }, [displayLyric, displayCurrentList]);
  useEffect(() => {
    if (displayCurrentList) {
      setDisplayLyric(false);
    }
  }, [displayCurrentList]);
  useEffect(() => {
    if (displayLyric) {
      setDisplayCurrentList(false);
    }
  }, [displayLyric]);
  useEffect(() => {
    detailOfSong &&
      displayLyric &&
      scrollContainerRef &&
      scrollContainerRef.current &&
      scrollContainerRef.current?.scrollTo({ top: cacheScrollPosition + 6, left: 0, behavior: 'smooth' });
  }, [detailOfSong, displayLyric]);
  useEffect(() => {
    const html = document.querySelector('html');

    if (detailOfSong) {
      html!.classList.add('on-mb');
    } else {
      if (!document.body.classList.contains('on-mb')) {
        html!.classList.remove('on-mb');
      }
    }
  }, [detailOfSong]);

  return (
    <>
      <div className={`media-player flex`}>
        <div className="mp-left fa-center">
          {crSong && (
            <>
              <img className="song-thumb" src={crSong?.artwork} alt="" title="thumbnail" />
              <div className="info-group">
                <Link className="text-decoration-none w-fit" to={crSong?.mainArtist.profileUrl || ''}>
                  <div className="gb-artist-name text-nowrap w-fit">{nameConverter(crSong?.mainArtist.name)}</div>
                </Link>
                <div className={`name-wrapper ${needDoubleName ? 'auto-text' : ''}`} ref={nameWrapperRef}>
                  <Link to={`/s/${crSong.id}`} className="text-decoration-none flex">
                    <div className="gb-song-name text-nowrap w-fit" ref={nameRef}>
                      {crSong?.songName}
                    </div>
                    {needDoubleName && <div className="gb-song-name text-nowrap w-fit">&nbsp;&nbsp;&nbsp;&nbsp;{crSong?.songName}</div>}
                  </Link>
                </div>
                <div className="flex ">
                  {crSong?.subArtist.map((e) => (
                    <div key={e.id} className="gb-sub-name divider-x text-nowrap">
                      <Link className="text-decoration-none gb-sub-artist-name text-nowrap" to={e.profileUrl}>
                        {e.name}
                      </Link>
                      <span className="div-x">&nbsp;x&nbsp;</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mp-center">
          <div className={`control-head fj-center relative align-items-center${crSong ? '' : ' disable-event-all'}`}>
            <ButtonBase className="mobile-vol-btn absolute">
              <div className="relative flex mobile-vol-root">
                <svg className={`volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={() => setMute(!mute)}>
                  <use href={`#volume-${volume === 0 ? 'mute' : volume < 30 ? 'min' : volume >= 30 && volume < 75 ? 'medium' : 'max'}`} />
                </svg>
                <div className="mobile-volume absolute">
                  <div className="mc-fv">
                    <Slider
                      orientation="vertical"
                      style={{ height: '100px' }}
                      className=""
                      aria-label="time-indicator"
                      size="medium"
                      value={volume}
                      min={0}
                      step={1}
                      max={100}
                      onChange={(_, value) => onVolumeChange(value as number)}
                      onWheel={(e) => onWheelChange(e)}
                      sx={VOLUME_SX}
                    />
                  </div>
                </div>
              </div>
            </ButtonBase>
            <ButtonBase className={`RippleColorTheme circle-corners ctrl-btn ${mediaControlSelector.shuffle ? 'looped' : ''}`} onClick={setShuffleState}>
              <svg className="ctrl-icon">
                <use href="#shuffle" />
              </svg>
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={onPrev}>
              <svg className="ctrl-icon">
                <use href="#ctrl" />
              </svg>
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={setPlaying}>
              <svg className="ctrl-icon">
                <use href={`#ctrl-${playSelector.playing ? 'playing' : 'paused'}`} />
              </svg>
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={onNext}>
              <svg className="ctrl-icon">
                <use href="#ctrl" />
              </svg>
            </ButtonBase>
            <ButtonBase
              className={`RippleColorTheme circle-corners ctrl-btn relative ${mediaControlSelector.loop !== 0 ? 'looped' : ''}`}
              onClick={setLoopState}
            >
              <svg className="ctrl-icon">
                <use href={`#loop${mediaControlSelector.loop === 1 ? '-1' : ''}`} />
              </svg>
              {mediaControlSelector.loop === 1 && <div className="loop-1-sym">1</div>}
            </ButtonBase>
          </div>
          <div className="time-controller fj-center align-items-center">
            <div className="duration-text">{durationConverter(currentPlayingTime)}</div>
            <div className="control-main">
              <Slider
                aria-label="time-indicator"
                size="small"
                value={currentPlayingTime}
                min={0}
                step={1}
                max={duration}
                onChange={(_, value) => {
                  mp3Audio.currentTime = value as number;
                  setCurrentPlayingTime(value as number);
                }}
                sx={SLIDER_SX}
              />
            </div>
            <div className="duration-text">{durationConverter(duration)}</div>
          </div>
        </div>
        <div className="mp-right fj-center align-items-center">
          <svg className={`volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={() => setMute(!mute)}>
            <use href={`#volume-${volume === 0 ? 'mute' : volume < 30 ? 'min' : volume >= 30 && volume < 75 ? 'medium' : 'max'}`} />
          </svg>
          <Slider
            className="volume"
            aria-label="time-indicator"
            size="small"
            value={volume}
            min={0}
            step={1}
            max={100}
            onChange={(_, value) => onVolumeChange(value as number)}
            onWheel={(e) => onWheelChange(e)}
            sx={VOLUME_SX}
          />
        </div>
        <div className="info-nav">
          <div className="flex align-items-center info-detail" onClick={toggleDrawer(true)}>
            <div className="flex align-items-center texting">
              <div className="s-name">{crSong?.songName}</div>
            </div>
            <div className={`actions${crSong ? '' : ' disable-event-all'}`}>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
              >
                <svg style={{ transform: 'rotate(180deg)' }}>
                  <use href="#mb-np" />
                </svg>
              </ButtonBase>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaying();
                }}
              >
                <svg>
                  <use href={`#mb-${playSelector.playing ? 'pause' : 'play'}`} />
                </svg>
              </ButtonBase>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
              >
                <svg>
                  <use href="#mb-np" />
                </svg>
              </ButtonBase>
            </div>
          </div>
          <BottomNav />
        </div>
      </div>
      <SwipeableDrawer
        className="bottom-sheet-root"
        container={container}
        anchor="bottom"
        open={detailOfSong}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="bottom-sheet">
          <div className="touch-bar" onClick={() => setDetailOfSong(false)}></div>
          <div className="detail-sheet">
            <div className="heading-spacing"></div>
            <div
              ref={scrollContainerRef}
              onScroll={() => displayLyric && setCacheScrollPosition(scrollContainerRef.current?.scrollTop || 0)}
              className="body my-scrollbar scrollable-body"
            >
              <div className="sticky-heading">
                <div className={`current-song-detail relative${showBody ? ' display-lyric' : ''}`}>
                  <img
                    onClick={() => setDisplayLyric(!displayLyric)}
                    src={crSong?.artwork}
                    style={{
                      borderRadius: '10px',
                      transition: '.2s',
                      width: `${showBody ? 80 : deviceWidth - 24}px`,
                      height: `${showBody ? 80 : deviceWidth - 24}px`,
                    }}
                    alt=""
                  />
                  <div className={`current-playing-info${showBody ? ' show-lyrics' : ''}`}>
                    <div className="cur-sname">{crSong?.songName}</div>
                    <div className="ar-name">{nameConverter(crSong?.mainArtist.name || '')}</div>
                  </div>
                </div>
              </div>
              {!showBody ? (
                <>
                  <div className="cur-sname">{crSong?.songName}</div>
                  <div className="ar-name">{nameConverter(crSong?.mainArtist.name)}</div>
                </>
              ) : (
                <div className="lyric-list">
                  <div className={displayLyric ? 'd-block' : 'd-none'} style={{ padding: '6px 0 12px 0' }}>
                    {(crSong?.lyric || []).map((e, i) => (
                      <div
                        className={`lyric-line${(currentPlayingTime >= e.time && currentPlayingTime <= ((crSong?.lyric || [])[i + 1] || (crSong?.lyric || [])[i]).time) || 0 ? ' on-the-way' : ''}`}
                        key={i}
                      >
                        {e.text}
                      </div>
                    ))}
                  </div>
                  <div
                    className={`mb-t100 listened-list ${displayCurrentList ? 'd-block' : 'd-none'}`}
                    style={{ padding: `6px ${isAppleFk() ? 24 : 14}px 12px 0` }}
                  >
                    {crListSong.map((e) => (
                      <ListenedSongItem
                        isMobile={true}
                        ref={refs[e.id]}
                        key={e.id}
                        id={e.id}
                        artwork={e.artwork}
                        url={e.url}
                        mainArtist={e.mainArtist}
                        songName={e.songName}
                        onClick={(ev) => playThisSong(e, ev)}
                        isPlaying={playSelector.playing && e.id === crSong?.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bottom-actions">
              <div className="time-control">
                <div className="control-main inline-flex">
                  <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={currentPlayingTime}
                    min={0}
                    step={1}
                    max={duration}
                    onChange={(_, value) => {
                      mp3Audio.currentTime = value as number;
                      setCurrentPlayingTime(value as number);
                    }}
                    sx={SLIDER_SX}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="duration-text">{durationConverter(currentPlayingTime)}</div>
                  <div className="duration-text">{durationConverter(duration)}</div>
                </div>
              </div>
              <div
                style={{ paddingTop: `${isAppleFk() ? 30 : 6}px` }}
                className={`main-controller flex justify-content-center${crSong ? '' : ' disable-event-all'}`}
              >
                <ButtonBase style={{ width: '47px' }} className="action-button" centerRipple onClick={onPrev}>
                  <svg style={{ transform: 'rotate(180deg)' }}>
                    <use href="#mb-np" />
                  </svg>
                </ButtonBase>
                <ButtonBase className="action-button" centerRipple onClick={setPlaying}>
                  <svg>
                    <use href={`#mb-${playSelector.playing ? 'pause' : 'play'}`} />
                  </svg>
                </ButtonBase>
                <ButtonBase style={{ width: '47px' }} className="action-button" centerRipple onClick={onNext}>
                  <svg>
                    <use href="#mb-np" />
                  </svg>
                </ButtonBase>
              </div>
              {!isAppleFk() && (
                <div className="volume-control flex align-items-center">
                  <svg className="mn-vol-icon">
                    <use href="#mb-min-vol" />
                  </svg>
                  <Slider
                    style={{ marginRight: '12px' }}
                    aria-label="volume-indicator"
                    value={volume}
                    min={0}
                    step={1}
                    max={100}
                    onChange={(_, value) => onVolumeChange(value as number)}
                    onWheel={(e) => onWheelChange(e)}
                    sx={MB_VOLUME_SX}
                  />
                  <svg className="mn-vol-icon">
                    <use href="#mb-max-vol" />
                  </svg>
                </div>
              )}
              <div className="flex justify-between end-control" style={{ paddingTop: `${isAppleFk() ? 24 : 12}px` }}>
                <ButtonBase className="end-control-btn _1" onClick={() => setDisplayLyric(!displayLyric)}>
                  <svg>
                    <use href={`#lyric${displayLyric ? '-active' : ''}`} />
                  </svg>
                </ButtonBase>
                <div className="flex align-items-center">
                  <ButtonBase className={`end-action-control-btn ${mediaControlSelector.shuffle ? 'looped' : ''}`} onClick={setShuffleState}>
                    <svg className="">
                      <use href="#shuffle" />
                    </svg>
                  </ButtonBase>
                  <ButtonBase className={`end-action-control-btn relative ${mediaControlSelector.loop !== 0 ? 'looped' : ''}`} onClick={setLoopState}>
                    <svg className="">
                      <use href={`#loop${mediaControlSelector.loop === 1 ? '-1' : ''}`} />
                    </svg>
                    {mediaControlSelector.loop === 1 && <div className="loop-1-sym">1</div>}
                  </ButtonBase>
                </div>
                <ButtonBase className="end-control-btn" onClick={() => setDisplayCurrentList(!displayCurrentList)}>
                  <svg>
                    <use href={`#mb-list${displayCurrentList ? '-active' : ''}`} />
                  </svg>
                </ButtonBase>
              </div>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};
