import { Button, type ButtonProps } from '@mui/material';

export interface IconButtonProps {
  siz?: string;
  ariaLabel?: string;
  cls?: string;
  shape?: 'circle' | 'box';
  ripplecolor?: string;
}

const DIconButton: FCC<ButtonProps & IconButtonProps> = (props) => {
  return (
    <Button
      color="inherit"
      className={`icon-button-self ${props.cls}`}
      style={{
        borderRadius: props.shape === 'box' ? '3px' : '50%',
        minWidth: props.siz ? props.siz : '40px',
        maxWidth: props.siz ? props.siz : '40px',
        maxHeight: props.siz ? props.siz : '40px',
        minHeight: props.siz ? props.siz : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: props.ripplecolor || 'var(--nav-active-detective)',
      }}
      aria-label={props.ariaLabel}
      variant="text"
      {...props}
    >
      <div style={{ width: '0' }}>&nbsp;</div>
      {props.children}
    </Button>
  );
};

export default DIconButton;
