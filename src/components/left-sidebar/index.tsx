import './left-sidebar.css';
import { NavLink } from 'react-router-dom';
import { APP_ROUTING } from '@root-routes';
import { nameConverter } from '@utils';
import { NavButton } from '@components/single-components';

export const LeftSidebar = () => {
  const nav = () => {};
  return (
    <div className="lsb-r">
      <div className="logo"></div>
      {APP_ROUTING.map((e) => (
        <NavLink to={e.path!} key={e.key} className="text-decoration-none nav-link-routing">
          <NavButton className="cs-pointer" onClick={nav} iconRef={e.path!} text={nameConverter(e.name)} />
        </NavLink>
      ))}
    </div>
  );
};

export default LeftSidebar;
