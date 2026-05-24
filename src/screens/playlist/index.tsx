import { useEffect, useState } from 'react';
import './playlist.css';
import { useParams } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import type { ListLayoutType } from '@typing';
import { StorageKey } from '@const';
import { PlayingDecorator } from '@components/playing-decorator';
import { SongInDetail } from '@components/song-in-dt';

export const PlaylistScreen = () => {
  const { playlistId } = useParams();
  const dispatch = useAppDispatch();
  const playlistSelector = useAppSelector(selectPlaylist);
  const { playing } = useAppSelector(selectPlayState);
  const { currentList, currentSong } = useAppSelector(selectMediaPlayer);
  const [playlist, setPlaylist] = useState<PlaylistState | undefined>();
  const [layout, setLayout] = useState<ListLayoutType>((localStorage.getItem(StorageKey.PlayListLayout) as ListLayoutType) || 'grid');

  useEffect(() => {
    const rawPlaylist = JSON.parse(localStorage.getItem(StorageKey.PlayList) || '[]') as PlaylistState[];
    const playlist = rawPlaylist.find((e) => e.id === playlistId);
    setPlaylist(playlist);
  }, [playlistSelector]);

  const changeLayout = (type: ListLayoutType) => {
    setLayout(type);
    localStorage.setItem(StorageKey.PlayListLayout, type);
  };

  useEffect(() => {}, []);

  return (
    <div className="body-cc60">
      {playlist ? (
        <>
          <div className="header-pai justify-between items-center">
            {playlist.name} <i className="text-xs opacity-65">{playlist.createAt}</i>
          </div>
          <div className="flex justify-content-end">
            <ButtonBase className={`change-layout-btn ${layout === 'grid' ? 'active' : ''}`} onClick={() => changeLayout('grid')}>
              <svg>
                <use href="#Grid" />
              </svg>
            </ButtonBase>
            <ButtonBase className={`change-layout-btn ${layout === 'list' ? 'active' : ''}`} onClick={() => changeLayout('list')}>
              <svg>
                <use href="#List" />
              </svg>
            </ButtonBase>
          </div>
          <div className={`flex playlist-list ${layout}`}>
            {layout === 'list' && <PlayingDecorator className="decorate-root" currentsong={currentSong} />}
            {playlist.songs.length > 0 ? (
              <div className="flex layout-controller">
                {playlist.songs.map((e) => (
                  <div className="relative sil-item" key={e.id}>
                    <SongInDetail
                      className={currentSong?.id === e.id ? 'playing' : ''}
                      isPlaying={playing && currentSong?.id === e.id}
                      subArtist={e.subArtist}
                      listenTimes={e.listenTimes}
                      songDuration={e.songDuration}
                      artwork={e.artwork}
                      url={e.url}
                      mainArtist={e.mainArtist}
                      songName={e.songName}
                      onDelete={() => dispatch(removeOneToPlaylist({ childId: e.id, parentId: playlistId! }))}
                      onClick={() => {
                        if (currentSong?.id === e.id) {
                          dispatch(playing ? pause() : play());
                        } else {
                          dispatch(pause());
                          dispatch(setCurrentSong(e));
                          dispatch(pushOne(e));
                          const delay = setTimeout(() => {
                            dispatch(play());
                            dispatch(setCurrentLists(playlist.songs));
                            clearTimeout(delay);
                          }, 101);
                        }
                      }}
                    >
                      <ButtonBase className="delete-button" onClick={() => dispatch(removeOneToPlaylist({ childId: e.id, parentId: playlistId! }))}>
                        <svg>
                          <use href="#Delete" />
                        </svg>
                      </ButtonBase>
                    </SongInDetail>
                  </div>
                ))}
              </div>
            ) : (
              <div>Trống</div>
            )}
          </div>
          <div style={{ height: '1000px' }}></div>
        </>
      ) : (
        <div>Something went wrong!</div>
      )}
    </div>
  );
};
