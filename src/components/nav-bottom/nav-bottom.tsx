import { ButtonBase } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { APP_ROUTING } from '@root-routes';
import './nav-bottom.css';
import XSvg from '@components/svg/svg';

export const NavBottom = () => {
  return (
    <div className="flex justify-between">
      {APP_ROUTING.map((e) => (
        <NavLink to={e.path!} key={e.key} className="bottom-nav-item w-1/3">
          <ButtonBase centerRipple className="nav-overlay-root h-nav-base">
            <XSvg className="h-10 w-10 icon-fill" src={e.icon!} />
          </ButtonBase>
        </NavLink>
      ))}
    </div>
  );
};
