import { Button, type ButtonProps } from '@mui/material';
import type { IconButtonProps } from '@components/button/button.types';

export const DIconButton: FCC<ButtonProps & IconButtonProps> = (props) => {
  return (
    <Button
      color="inherit"
      className={`icon-button-self ${props.className}`}
      style={{
        borderRadius: props.shape === 'box' ? '3px' : '50%',
        minWidth: props.siz ? props.siz : '40px',
        maxWidth: props.siz ? props.siz : '40px',
        maxHeight: props.siz ? props.siz : '40px',
        minHeight: props.siz ? props.siz : '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: props.rippleColor || 'var(--nav-active-detective)',
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
