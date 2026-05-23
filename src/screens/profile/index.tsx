import { type MouseEvent, useEffect, useState } from 'react';
import './profile.css';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@store/store';
import { setCurrentLists } from '@store/slices/media-player.slice';
import { addOneToPlaylist, type PlaylistState } from '@store/slices/playlist.slice';
import { Menu, MenuItem } from '@mui/material';
import type { ArtisProfile, SongBase } from '@typing';
import { PROFILES } from '@const';
import { nameConverter } from '@utils';
import { List100 } from '../top-100/components/list/list.tsx';
import { CreatePlaylistDialog } from '../personal/components/create-playlist-dialog/create-playlist-dialog.tsx';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const { artistId } = useParams();

  const [profile, setProfile] = useState<ArtisProfile>();
  const [hue, setHue] = useState(0);
  const [subOptionRef, setSubOptionRef] = useState<null | HTMLElement>(null);
  const [createPlaylist, setCreatePlaylist] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongBase | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistState[]>([]);

  const openSubOptionRef = Boolean(subOptionRef);

  const onSelectSong = (e: MouseEvent<HTMLElement>, currentSong: SongBase) => {
    setSubOptionRef(e.currentTarget);
    setSelectedSong(currentSong);
  };
  const closeOption = () => {
    setSubOptionRef(null);
    setSelectedSong(null);
  };

  const addOneSongToPlaylist = (song: SongBase, parentId: string) => {
    dispatch(addOneToPlaylist({ song, parentId }));
  };

  useEffect(() => {
    const data = PROFILES.find((e) => e.name === artistId);
    setProfile(data);
  }, [artistId]);

  useEffect(() => {
    const itv = setInterval(() => {
      setHue((hue) => hue + 4);
    }, 50);
    return () => {
      clearInterval(itv);
    };
  }, []);

  return (
    <>
      <div className="my-scrollbar np-ps flex detail-info">
        {profile ? (
          <>
            <div style={{ top: '15px' }} className="profile-col-left information sticky-top">
              <div className="artwork relative">
                <img src={profile?.artwork} alt="" />
                <div className="decorator-line-root" style={{ background: `linear-gradient(0deg, transparent 0%, hsl(${hue},90%,50%) 45%)` }}></div>
              </div>
              <div className="right-info">
                <div className="name text-center">{nameConverter(profile?.name)}</div>
                <div className="real-name text-center">
                  Tên thật: <i>{profile?.realName}</i>
                </div>
                <div className="real-name text-center">
                  Ngày sinh: <i className="specific-note">{profile?.birthdate}</i>
                </div>
              </div>
            </div>
            <div className="profile-col-right ml-scroll-right">
              <div className="description">{profile?.description}</div>
              <div className="profile-songs">
                <div className="sub-header-pai">Bài hát</div>
                {(profile?.songs.length || 0) > 0 &&
                  (profile?.songs || []).map((e) => (
                    <List100
                      isAtTop={false}
                      key={e.id}
                      song={e}
                      onPlay={() => dispatch(setCurrentLists(profile?.songs || []))}
                      onAdd={(ev) => onSelectSong(ev, e)}
                    />
                  ))}
              </div>
            </div>
            <div className="mb-personal">
              <div className="sub-header-pai">Bài hát</div>
              {(profile?.songs.length || 0) > 0 &&
                (profile?.songs || []).map((e) => (
                  <List100
                    isAtTop={false}
                    key={e.id}
                    song={e}
                    onPlay={() => dispatch(setCurrentLists(profile?.songs || []))}
                    onAdd={(ev) => onSelectSong(ev, e)}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="text-center">Chưa làm data cho ngệ sĩ này!</div>
        )}
      </div>
      <Menu
        className="option-ref"
        id="basic-menu"
        anchorEl={subOptionRef}
        open={openSubOptionRef}
        onClose={() => {
          setSubOptionRef(null);
          closeOption();
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem className="add-to-list relative" onClick={(e) => setCreatePlaylist(true)}>
          <svg className="ref-icon mr-df">
            <use href="#Add" />
          </svg>
          Tạo mới
        </MenuItem>
        {playlist.map((e) => (
          <MenuItem key={e.id} onClick={() => addOneSongToPlaylist(selectedSong!, e.id)}>
            <svg className="ref-icon mr-df">
              <use href="#Playlist" />
            </svg>
            {e.name}
          </MenuItem>
        ))}
      </Menu>
      <CreatePlaylistDialog
        currentSong={selectedSong}
        onClose={() => {
          setCreatePlaylist(false);
          setSubOptionRef(null);
          closeOption();
        }}
        open={createPlaylist}
      />
    </>
  );
};
