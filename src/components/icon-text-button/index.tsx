import { ButtonBase, type ButtonProps } from '@mui/material';

export interface IconTextButtonProps {
  iconSlot?: 'start' | 'end';
}

export const IconTextButton = (pr: IconTextButtonProps & ButtonProps) => {
  return (
    <ButtonBase {...pr} className={pr.iconSlot && pr.iconSlot === 'end' ? 'flex-row-reverse' : ''}>
      <h3>IconTextButton</h3>
      {pr.children}
    </ButtonBase>
  );
};
