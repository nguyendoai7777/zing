import { useEffect, useState } from 'react';
import './playlist.css';
import { useParams } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import type { ListLayoutType } from '@typing';
import { StorageKey } from '@const';
import { PlayingDecorator } from '@components/playing-decorator';
import { SongInDetail } from '@components/song-in-dt';
import { useAudioStore } from '@zing/zstate';
import XSvg from '@components/svg/svg';

export const PlaylistScreen = () => {
  const { currentList, currentSong, isPlaying: playing, playThisSong, removeSongFromQueue } = useAudioStore((s) => s);

  const [playlist, setPlaylist] = useState();
  const [layout, setLayout] = useState<ListLayoutType>((localStorage.getItem(StorageKey.PlayListLayout) as ListLayoutType) || 'grid');

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
            PlaylistName
            {/*{playlist.name} <i className="text-xs opacity-65">{playlist.createAt}</i>*/}
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
            {layout === 'list' && currentSong && <PlayingDecorator className="decorate-root" currentSong={currentSong} />}
            {currentList.length > 0 ? (
              <div className="flex layout-controller">
                {currentList.map((song) => (
                  <div className="relative sil-item" key={song.id}>
                    <SongInDetail
                      className={currentSong?.id === song.id ? 'playing' : ''}
                      isPlaying={playing && currentSong?.id === song.id}
                      {...song}
                      onDelete={() => removeSongFromQueue(song)}
                      onClick={() => {
                        playThisSong(song);
                      }}
                    >
                      <ButtonBase className="delete-button" onClick={() => removeSongFromQueue(song)}>
                        <XSvg src="Delete" />
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
