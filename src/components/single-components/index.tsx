import { Button } from '@mui/material';

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
    <Button color="inherit" className={`nav-button flex align-items-center ${className} ${reverse ? 'flex-reverse' : ''}`} onClick={onClick} style={{ color }}>
      {iconRef && (
        <svg className="nav-icon">
          <use href={`#${iconRef}`} />
        </svg>
      )}
      <div className="nav-text text-nowrap" style={{ color: textColor, textTransform: 'capitalize' }}>
        {text}
      </div>
    </Button>
  );
};
