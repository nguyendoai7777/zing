import { Button } from '@mui/material';
import XSvg from '@components/svg/svg';

export interface NavButtonProps {
  id?: string;
  iconRef?: string;
  text: string;
  onClick?: () => void;
  color?: string;
  reverse?: boolean;
  textColor?: string;
}

export const NavButton: FCC<NavButtonProps> = ({ textColor, iconRef, text, onClick, className, color = '#fff', reverse = false }) => {
  return (
    <Button color="inherit" className={`nav-button flex items-center ${className} ${reverse ? 'flex-reverse' : ''}`} onClick={onClick} style={{ color }}>
      {iconRef && <XSvg className="nav-icon" src={iconRef} />}
      <div className="nav-text whitespace-nowrap" style={{ color: textColor, textTransform: 'capitalize' }}>
        {text}
      </div>
    </Button>
  );
};
