import './media-player.css';
import { Link } from 'react-router-dom';
import { ButtonBase, Slider, SwipeableDrawer } from '@mui/material';
import { MB_VOLUME_SX, SLIDER_SX, VOLUME_SX } from '@const';
import { durationConverter, isAppleFk, nameConverter } from '@utils';
import { NavBottom } from '@components/nav-bottom';
import { ListenedSongItem } from '@pages/personal/components/listened-song-item';
import { useAudioEngine, useMobileDrawer, useNameOverflow, usePlaybackControls, useSongRefs, useVolume } from './index.hook.ts';
import XSvg from '@components/svg/svg';

export const MediaPlayer = () => {
  const { volume, volumeIcon, toggleMute, onVolumeChange, onWheelChange } = useVolume();
  const { isPlaying, loop, shuffle, crSong, crListSong, togglePlaying, onNext, onPrev, playThisSong, toggleLoop, toggleShuffle } = usePlaybackControls();
  const { duration, currentPlayingTime, seekTo } = useAudioEngine(crSong, crListSong, loop, onNext);
  const { nameWrapperRef, nameRef, needDoubleName } = useNameOverflow(crSong);
  const { scrollContainerRef, refs } = useSongRefs(crListSong);
  const { detailOfSong, deviceWidth, showBody, displayLyric, displayCurrentList, toggleDrawer, closeDrawer, toggleLyric, toggleCurrentList, onScrollCapture } =
    useMobileDrawer(crSong, crListSong, scrollContainerRef, refs);

  return (
    <>
      <div className="sticky bottom-0 media-player flex">
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
                <XSvg role="button" className={`volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={toggleMute} src={volumeIcon} />
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
                onChange={(_, value) => seekTo(value as number)}
                sx={SLIDER_SX}
              />
            </div>
            <div className="duration-text">{durationConverter(duration)}</div>
          </div>
        </div>
        <div className="mp-right fj-center align-items-center">
          <XSvg role="button" className={`123 volume-icon cs-pointer ${volume >= 65 ? 'waring' : ''}`} onClick={toggleMute} src={volumeIcon} />
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
                        isPlaying={isPlaying && e.id === crSong?.id}
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
                    onChange={(_, value) => seekTo(value as number)}
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
                <div className="volume-control flex align-items-center">
                  <XSvg className="mn-vol-icon" src="MbMinVol" />
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
                  <XSvg className="mn-vol-icon" src="MbMaxVol" />
                </div>
              )}
              <div className="flex justify-between end-control" style={{ paddingTop: `${isAppleFk() ? 24 : 12}px` }}>
                <ButtonBase className="end-control-btn _1" onClick={toggleLyric}>
                  <XSvg src={`Lyric${displayLyric ? 'Active' : ''}`} />
                </ButtonBase>
                <div className="flex align-items-center">
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
