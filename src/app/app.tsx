import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './app.css';

import { APP_ROUTING, NOT_NAV_ROUTING } from '@root-routes';
import { DEFAULT_THEME, StorageKey } from '@const';
import Navbar from '@components/navbar';
import LeftSidebar from '@components/left-sidebar';
import RightSidebar from '@components/right-sidebar';
import { MediaPlayer } from '@components/media-player';

export function App() {
  useEffect(() => {
    const ROOT = document.getElementById('root')!;
    ROOT.className = localStorage.getItem(StorageKey.SetBackground) || `${DEFAULT_THEME}-bg`;
    document.body.className = localStorage.getItem(StorageKey.SetTheme) || `${DEFAULT_THEME}-theme`;
  }, []);

  return (
    <>
      <div className="flex rx-content">
        <LeftSidebar />
        <div className="main">
          <Navbar />
          <div className="scrollable-body">
            <Routes>
              <Route path="*" element={<Navigate to="discovery" replace />} />
              <Route path="" element={<Navigate to="discovery" replace />} />
              {APP_ROUTING.map((route) => (
                <Route path={route.path} key={route.key} element={route.element} />
              ))}
              {NOT_NAV_ROUTING.map((route) => (
                <Route path={route.path} key={route.key} element={route.element} />
              ))}
            </Routes>
          </div>
        </div>
        <RightSidebar />
      </div>
      <MediaPlayer />
    </>
  );
}

export default App;
