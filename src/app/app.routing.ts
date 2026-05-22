import type { Routes } from '@typing';
import { DiscoveryScreen } from '../screens/dicovery/discovery.tsx';
import { Top100Screen } from '../screens/top-100/top-100.tsx';
import { PersonalScreen } from '../screens/personal/personal.tsx';
import { PlaylistScreen } from '../screens/playlist/playlist.tsx';
import { Profile } from '../screens/profile/profile.tsx';
import { Top100Album } from '../screens/top-100-album/top-100-album.tsx';
import { Visualization } from '../screens/visualization/visualization.tsx';
import { createElement } from 'react';

export const APP_ROUTING: Routes[] = [
  {
    name: 'Khám Phá',
    key: 'routes-id-1',
    path: 'discovery',
    element: createElement(DiscoveryScreen),
  },
  {
    name: 'Top 100',
    key: 'routes-id-5',
    path: 'top100',
    element: createElement(Top100Screen),
  },
  {
    name: 'Cá Nhân',
    key: 'routes-id-2',
    path: 'personal',
    element: createElement(PersonalScreen),
  },

  /* {
     name: '#zchart',
     key: 'routes-id-3',
     path: 'zchart',
     element: createElement(ZchartScreen),

   },

   {
     name: 'Radio',
     key: 'routes-id-4',
     path: 'radio',
     element: createElement(RadioScreen),

   },



   {
     name: 'Thể Loại',
     key: 'routes-id-6',
     path: 'category',
     element: createElement(CategoryScreen),

   },*/
];

export const NOT_NAV_ROUTING: Routes[] = [
  {
    name: 'Playlist',
    key: 'routes-id-7',
    path: 'playlist/:playlistId',
    element: createElement(PlaylistScreen),
  },
  {
    name: 'Nghệ sĩ',
    key: 'routes-id-8',
    path: 'profile/:artistId',
    element: createElement(Profile),
  },
  {
    name: 'Top 100',
    key: 'routes-id-9',
    path: '/top100/album/:top100Id',
    element: createElement(Top100Album),
  },
  {
    name: 'Audio Visualizations',
    key: 'routes-id-10',
    path: '/s/:songId',
    element: createElement(Visualization),
  },
];
