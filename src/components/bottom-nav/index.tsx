import { ButtonBase } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './bottom-nav.css';
import { APP_ROUTING } from '@root-routes';

export const BottomNav = () => {
  return (
    <div className="flex justify-between">
      {APP_ROUTING.map((e) => (
        <NavLink to={e.path!} key={e.key} className="bottom-nav-item">
          <ButtonBase centerRipple className="nav-overlay-root">
            <svg>
              <use href={`#${e.path}`} />
            </svg>
          </ButtonBase>
        </NavLink>
      ))}
    </div>
  );
};
