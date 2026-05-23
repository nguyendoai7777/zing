import type { Routes } from '@typing';
import { createElement } from 'react';
import { DiscoveryScreen } from '@pages/dicovery';
import { Visualization } from '@pages/visualization';
import { Top100Album } from '@pages/top-100-album';
import { Profile } from '@pages/profile';
import { Top100Screen } from '@pages/top-100';
import { PersonalScreen } from '@pages/personal';
import { PlaylistScreen } from '@pages/playlist';

export const APP_ROUTING: Routes[] = [
  {
    name: 'Khám Phá',
    key: 'routes-id-1',
    path: 'discovery',
    icon: 'Discovery',
    element: createElement(DiscoveryScreen),
  },
  {
    name: 'Top 100',
    key: 'routes-id-5',
    path: 'top100',
    icon: 'Top100',
    element: createElement(Top100Screen),
  },
  {
    name: 'Cá Nhân',
    key: 'routes-id-2',
    path: 'personal',
    icon: 'Personal',
    element: createElement(PersonalScreen),
  },

  /* {
     name: '#zchart',
     key: 'routes-id-3',
     path: 'zchart',
     icon: 'Zchart',
     element: createElement(ZchartScreen),

   },

   {
     name: 'Radio',
     key: 'routes-id-4',
     path: 'radio',
     icon: 'Radio',
     element: createElement(RadioScreen),

   },



   {
     name: 'Thể Loại',
     key: 'routes-id-6',
     path: 'category',
     icon: 'Category',
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
