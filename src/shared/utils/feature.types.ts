import { ThemeBase } from '@models/theme.model';
import { LOCAL_KEY } from '@constants/storage-key.const';
import { DEFAULT_VOLUME } from '@constants/mock.const';
export const setTheme = (theme: ThemeBase) => {
  document.body.className = `${theme.id}`;
  const root = document.querySelector('#root')! as HTMLDivElement;
  root.className = `${theme.name}-bg`;
  localStorage.setItem(LOCAL_KEY.SetTheme, `${theme.id}`);
  localStorage.setItem(LOCAL_KEY.SetBackground, `${theme.name}-bg`);
};

export const stopParentEvent = (event: any) => {
  event.stopPropagation();
};

export const flattenArray = (array: any[]) => {
  return array.reduce((accumulator, value) => accumulator.concat(value), []);
}

export const getDeviceType = () => {
  const detail = navigator.userAgent;
  const [, os, device] = (detail.split('(')[0]).split('/');
  const osDetail = {
    name: os.split('/'),
    version: os.split('/')
  }

}
export const isAppleFk = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
}

export const durationConverter = (duration: number) => {
  const hours = ('0' + Math.floor(duration / 3600));
  const ch = Number(hours);
  const minutes = ('0' + Math.floor((duration - ch * 3600) / 60)).slice(-2);
  const seconds = ('0' + Math.floor(duration - Math.floor(duration / 60) * 60)).slice(-2);
  return ch !== 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

export const saveVolumeToLocal = (val: number) => {
  localStorage.setItem(LOCAL_KEY.SetVolume, String(val));
  localStorage.setItem(LOCAL_KEY.SetCacheVolume, String(val !== 0 ? val : DEFAULT_VOLUME));
}

export const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob());
  const uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf('/') + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
}

export const DT = {
  now: {
    time: ((new Date()).toTimeString()).split(' ')[0],
    dateFull: (new Date()).toLocaleString('vi', {dateStyle: 'full'})
  }
}

export const nameConverter = (raw = "") => {
  return raw.replace(/-/g,' ');
}


export const randomHexColor = () => {
  const c = Math.floor(Math.random()*16777215).toString(16);
  return `#${c}`
}

export const injectHTML = (html?: string) => ({
  __html: html || ''
});
