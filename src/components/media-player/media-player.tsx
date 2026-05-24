import './media-player.css';
import { Link } from 'react-router-dom';
import { ButtonBase, Slider, SwipeableDrawer } from '@mui/material';
import { MB_VOLUME_SX, SLIDER_SX, VOLUME_SX } from '@const';
import { durationConverter, dynamicVolumeIcon, isAppleFk, nameConverter } from '@utils';
import { NavBottom } from '@components/nav-bottom';
import { ListenedSongItem } from '@pages/personal/components/listened-song-item';
import { useMobileDrawer, useNameOverflow, useSongRefs } from './media-player.hook';
import XSvg from '@components/svg/svg';
import { useAudioStore } from '@zing/zstate/audio';
import { useEffect, useRef } from 'react';

export const MediaPlayer = () => {
  const currentSong = useAudioStore((state) => state.currentSong);
  const currentList = useAudioStore((state) => state.currentList);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const duration = useAudioStore((state) => state.duration);
  const currentTime = useAudioStore((state) => state.currentTime);
  const volume = useAudioStore((state) => state.volume);
  const loop = useAudioStore((state) => state.loop);
  const shuffle = useAudioStore((state) => state.shuffle);

  const togglePlaying = useAudioStore((state) => state.togglePlaying);
  const playThisSong = useAudioStore((state) => state.playThisSong);
  const onNext = useAudioStore((state) => state.onNext);
  const onPrev = useAudioStore((state) => state.onPrev);
  const seekTo = useAudioStore((state) => state.seekTo);
  const setVolume = useAudioStore((state) => state.setVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);
  const toggleLoop = useAudioStore((state) => state.toggleLoop);
  const toggleShuffle = useAudioStore((state) => state.toggleShuffle);
  const initEngine = useAudioStore((state) => state.initEngine);

  const volumeRef = useRef<HTMLDivElement>();

  // ─── CÁC UI HOOKS THUẦN DOM (GIỮ NGUYÊN) ──────────────────────────────
  const { nameWrapperRef, nameRef, needDoubleName } = useNameOverflow(currentSong);
  const { scrollContainerRef, refs } = useSongRefs(currentList);
  const { detailOfSong, deviceWidth, showBody, displayLyric, displayCurrentList, toggleDrawer, closeDrawer, toggleLyric, toggleCurrentList, onScrollCapture } =
    useMobileDrawer(currentSong, currentList, scrollContainerRef, refs);

  useEffect(() => {
    initEngine();
    const sliderTarget = volumeRef.current;
    if (!sliderTarget) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Chặn cuộn trang hợp lệ

      // 🔥 BÍ QUYẾT: Lấy trực tiếp volume mới nhất thẳng từ lõi Store, không qua React State
      const currentVolume = useAudioStore.getState().volume;
      const setVolume = useAudioStore.getState().setVolume;

      const delta = e.deltaY < 0 ? 2 : -2;
      setVolume(currentVolume + delta);
    };

    // Đăng ký sự kiện 1 lần duy nhất với passive: false
    sliderTarget.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      sliderTarget.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <>
      <div className="sticky bottom-0 media-player flex">
        <div className="mp-left flex items-center">
          {currentSong && (
            <>
              <img className="song-thumb" src="https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg" alt="" title="thumbnail" />
              <div className="info-group">
                <Link className="text-decoration-none w-fit" to={currentSong?.artistId}>
                  <div className="gb-artist-name whitespace-nowrap w-fit">{nameConverter(currentSong?.artistName)}</div>
                </Link>
                <div className={`name-wrapper ${needDoubleName ? 'auto-text' : ''}`} ref={nameWrapperRef}>
                  <Link to={`/s/${currentSong.id}`} className="text-decoration-none flex">
                    <div className="gb-song-name whitespace-nowrap w-fit" ref={nameRef}>
                      {currentSong?.name}
                    </div>
                    {needDoubleName && <div className="gb-song-name whitespace-nowrap w-fit">&nbsp;&nbsp;&nbsp;&nbsp;{currentSong?.name}</div>}
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mp-center">
          <div className={`control-head flex justify-center relative items-center${currentSong ? '' : ' disable-event-all'}`}>
            <ButtonBase className="mobile-vol-btn absolute">
              <div className="relative flex mobile-vol-root">
                <XSvg role="button" className={`volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={toggleMute} src={dynamicVolumeIcon(volume)} />
                <div className="mobile-volume absolute">
                  <div ref={volumeRef} className="mc-fv">
                    <Slider
                      orientation="vertical"
                      style={{ height: '100px' }}
                      size="medium"
                      value={volume}
                      min={0}
                      step={1}
                      max={100}
                      onChange={(_, value) => setVolume(value)}
                      sx={VOLUME_SX}
                    />
                  </div>
                </div>
              </div>
            </ButtonBase>
            <ButtonBase className={`RippleColorTheme circle-corners ctrl-btn ${shuffle ? 'looped' : ''}`} onClick={toggleShuffle}>
              <XSvg src="Shuffle" className="ctrl-icon" />
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={onPrev}>
              <XSvg src="Ctrl" className="ctrl-icon" />
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={togglePlaying}>
              <XSvg src={`Ctrl${isPlaying ? 'Playing' : 'Paused'}`} className="ctrl-icon" />
            </ButtonBase>
            <ButtonBase className="RippleColorTheme circle-corners ctrl-btn" onClick={onNext}>
              <XSvg src="Ctrl" className="ctrl-icon" />
            </ButtonBase>
            <ButtonBase className={`RippleColorTheme circle-corners ctrl-btn relative ${loop !== 0 ? 'looped' : ''}`} onClick={toggleLoop}>
              <XSvg className="ctrl-icon" src={`Loop${loop === 1 ? '1' : ''}`} />
              {loop === 1 && <div className="loop-1-sym">1</div>}
            </ButtonBase>
          </div>
          <div className="time-controller flex justify-center items-center">
            <div className="duration-text">{durationConverter(currentTime)}</div>
            <div className="control-main">
              <Slider
                aria-label="time-indicator"
                size="small"
                value={currentTime}
                min={0}
                step={1}
                max={duration}
                onChange={(_, value) => seekTo(value as number)}
                sx={SLIDER_SX}
              />
            </div>
            <div className="duration-text">{durationConverter(duration)}</div>
          </div>
        </div>
        <div ref={volumeRef} className="mp-right flex justify-center items-center">
          <XSvg role="button" className={`123 volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={toggleMute} src={dynamicVolumeIcon(volume)} />
          <Slider
            className="volume"
            aria-label="time-indicator"
            size="small"
            value={volume}
            min={0}
            step={1}
            max={100}
            onChange={(_, value) => setVolume(value)}
            sx={VOLUME_SX}
          />
        </div>
        <div className="info-nav">
          <div className="flex items-center info-detail" onClick={toggleDrawer(true)}>
            <div className="flex items-center texting">
              <div className="s-name">{currentSong?.name}</div>
            </div>
            <div className={`actions${currentSong ? '' : ' disable-event-all'}`}>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
              >
                <XSvg style={{ transform: 'rotate(180deg)' }} src="MbNp" />
              </ButtonBase>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlaying();
                }}
              >
                <XSvg src={`Mb${isPlaying ? 'Pause' : 'Play'}`} />
              </ButtonBase>
              <ButtonBase
                className="action-button"
                centerRipple
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
              >
                <XSvg style={{ transform: 'rotate(180deg)' }} src="MbNp" />
              </ButtonBase>
            </div>
          </div>
          <NavBottom />
        </div>
      </div>
      <SwipeableDrawer
        className="bottom-sheet-root"
        container={() => window.document.body}
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
          <div className="touch-bar" onClick={closeDrawer}></div>
          <div className="detail-sheet">
            <div className="heading-spacing"></div>
            <div ref={scrollContainerRef} onScroll={onScrollCapture} className="body my-scrollbar scrollable-body">
              <div className="sticky-heading">
                <div className={`current-song-detail relative${showBody ? ' display-lyric' : ''}`}>
                  <img
                    onClick={toggleLyric}
                    src="https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg"
                    style={{
                      borderRadius: '10px',
                      transition: '.2s',
                      width: `${showBody ? 80 : deviceWidth - 24}px`,
                      height: `${showBody ? 80 : deviceWidth - 24}px`,
                    }}
                    alt=""
                  />
                  <div className={`current-playing-info${showBody ? ' show-lyrics' : ''}`}>
                    <div className="cur-sname">{currentSong?.name}</div>
                    <div className="ar-name">{nameConverter(currentSong?.artistName || '')}</div>
                  </div>
                </div>
              </div>
              {!showBody ? (
                <>
                  <div className="cur-sname">{currentSong?.name}</div>
                  <div className="ar-name">{nameConverter(currentSong?.artistName || '')}</div>
                </>
              ) : (
                <div className="lyric-list">
                  <div
                    className={`mb-t100 listened-list ${displayCurrentList ? 'd-block' : 'd-none'}`}
                    style={{ padding: `6px ${isAppleFk() ? 24 : 14}px 12px 0` }}
                  >
                    {currentList.map((e) => (
                      <ListenedSongItem
                        isMobile={true}
                        ref={refs[e.id]}
                        key={e.id}
                        artwork="https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg"
                        {...e}
                        onClick={(ev) => playThisSong(e, currentList)}
                        isPlaying={isPlaying && e.id === currentSong?.id}
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
                    value={currentTime}
                    min={0}
                    step={1}
                    max={duration}
                    onChange={(_, value) => seekTo(value as number)}
                    sx={SLIDER_SX}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="duration-text">{durationConverter(currentTime)}</div>
                  <div className="duration-text">{durationConverter(duration)}</div>
                </div>
              </div>
              <div
                style={{ paddingTop: `${isAppleFk() ? 30 : 6}px` }}
                className={`main-controller flex justify-center${currentSong ? '' : ' disable-event-all'}`}
              >
                <ButtonBase style={{ width: '47px' }} className="action-button" centerRipple onClick={onPrev}>
                  <XSvg style={{ transform: 'rotate(180deg)' }} src="MbNp" />
                </ButtonBase>
                <ButtonBase className="action-button" centerRipple onClick={togglePlaying}>
                  <XSvg style={{ transform: 'rotate(180deg)' }} src={`Mb${isPlaying ? 'Pause' : 'Play'}`} />
                </ButtonBase>
                <ButtonBase style={{ width: '47px' }} className="action-button" centerRipple onClick={onNext}>
                  <XSvg src="MbNp" />
                </ButtonBase>
              </div>
              {!isAppleFk() && (
                <div className="volume-control flex items-center">
                  <XSvg className="mn-vol-icon" src="MbMinVol" />
                  <Slider
                    style={{ marginRight: '12px' }}
                    aria-label="volume-indicator"
                    value={volume}
                    min={0}
                    step={1}
                    max={100}
                    onChange={(_, value) => setVolume(value)}
                    sx={MB_VOLUME_SX}
                  />
                  <XSvg className="mn-vol-icon" src="MbMaxVol" />
                </div>
              )}
              <div className="flex justify-between end-control" style={{ paddingTop: `${isAppleFk() ? 24 : 12}px` }}>
                <ButtonBase className="end-control-btn _1" onClick={toggleLyric}>
                  <XSvg src={`Lyric${displayLyric ? 'Active' : ''}`} />
                </ButtonBase>
                <div className="flex items-center">
                  <ButtonBase className={`end-action-control-btn ${shuffle ? 'looped' : ''}`} onClick={toggleShuffle}>
                    <XSvg src="Shuffle" />
                  </ButtonBase>
                  <ButtonBase className={`end-action-control-btn relative ${loop !== 0 ? 'looped' : ''}`} onClick={toggleLoop}>
                    <XSvg src={`Loop${loop === 1 ? '1' : ''}`} />
                    {loop === 1 && <div className="loop-1-sym">1</div>}
                  </ButtonBase>
                </div>
                <ButtonBase className="end-control-btn" onClick={toggleCurrentList}>
                  <XSvg src={`MbList${displayCurrentList ? 'Active' : ''}`} />
                </ButtonBase>
              </div>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};
