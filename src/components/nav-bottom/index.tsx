import { ButtonBase } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { APP_ROUTING } from '@root-routes';
import './nav-bottom.css';

export const NavBottom = () => {
  return (
    <div className="flex justify-between">
      {APP_ROUTING.map((e) => (
        <NavLink to={e.path!} key={e.key} className="bottom-nav-item">
          <ButtonBase centerRipple className="nav-overlay-root">
            <svg>
              <use href={`#${e.icon}`} />
            </svg>
          </ButtonBase>
        </NavLink>
      ))}
    </div>
  );
};
