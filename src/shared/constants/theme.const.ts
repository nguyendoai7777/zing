export const DEFAULT_THEME = 'light';

export const ThemeOptions = {
  color: [
    {
      id: 'dark-theme',
      name: 'dark',
      ref: '#000',
    },
    {
      id: 'light-theme',
      name: 'light',
      ref: '#fff',
    },
    {
      id: 'pink-theme',
      name: 'pink',
      ref: '#ff1493',
    },
  ],
  chars: [
    {
      id: 'lisa-theme',
      name: 'lisa',
      bgRef: '/imgs/theme-background/lisa.jpg',
      avatarRef: '/imgs/theme-thumbnail/lisa.jpg',
    },
    {
      id: 'jisoo-theme',
      name: 'jisoo',
      bgRef: '/imgs/theme-background/jisoo.jpg',
      avatarRef: '/imgs/theme-thumbnail/jisoo.jpg',
    },
    {
      id: 'iu-theme',
      name: 'iu',
      bgRef: '/imgs/theme-background/iu.jpg',
      avatarRef: '/imgs/theme-thumbnail/iu.jpg',
    },
    {
      id: 'jennie-theme',
      name: 'jennie',
      bgRef: '/imgs/theme-background/jennie.jpg',
      avatarRef: '/imgs/theme-thumbnail/jennie.jpg',
    },
  ],
};
export const SLIDER_SX = {
  color: 'var(--slider-active-color)',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 10,
    height: 10,
    backgroundColor: 'var(--slider-active-color)',
    // transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 var(--slider-active-color)',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px  var(--slide-overlay)',
    },
    '&.Mui-active': {
      width: 15,
      height: 15,
    },
  },
  '& .MuiSlider-track': {
    backgroundColor: 'var(--slider-active-color)',
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
  },
};

export const VOLUME_SX = {
  color: 'var(--volume-fill)',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 10,
    height: 10,
    backgroundColor: 'var(--volume-fill)',
    // transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 var(--volume-fill)',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px  var(--slide-overlay)',
    },
    '&.Mui-active': {
      width: 15,
      height: 15,
    },
  },
  '& .MuiSlider-track': {
    backgroundColor: 'var(--volume-fill)',
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
  },
};

export const MB_VOLUME_SX = {
  color: 'var(--audio-control-fill)',
  height: 4,
  '& .MuiSlider-thumb': {
    width: 10,
    height: 10,
    backgroundColor: 'var(--audio-control-fill)',
    // transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 var(--audio-control-fill)',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px  var(--slide-overlay)',
    },
    '&.Mui-active': {
      width: 15,
      height: 15,
    },
  },
  '& .MuiSlider-track': {
    backgroundColor: 'var(--audio-control-fill)',
  },
  '& .MuiSlider-rail': {
    opacity: 0.2,
  },
};
