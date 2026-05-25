import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './app.css';

import { APP_ROUTING, NOT_NAV_ROUTING } from '@root-routes';
import { DEFAULT_THEME, StorageKey } from '@const';
import { Navbar } from '@components/navbar';
import { MediaPlayer } from '@components/media-player';
import { NavSidebar, PlaylistSidebar } from '@components/sidebar';

export function App() {
  useEffect(() => {
    const ROOT = document.getElementById('root')!;
    ROOT.className = localStorage.getItem(StorageKey.SetBackground) || `${DEFAULT_THEME}-bg`;
    document.body.className = localStorage.getItem(StorageKey.SetTheme) || `${DEFAULT_THEME}-theme`;
  }, []);

  return (
    <>
      <div className="flex rx-content">
        <NavSidebar />
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
        <PlaylistSidebar />
      </div>
      <MediaPlayer />
    </>
  );
}

export default App;
