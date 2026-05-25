import { Button, type ButtonProps, styled } from '@mui/material';
import type { Prettify } from '@typing';
import type { CustomButtonContainedProps, CustomButtonOutlinedProps } from '@components/button/button.types';

export const CustomButtonContained: FCC<Prettify<ButtonProps & CustomButtonContainedProps>> = (props) => {
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: props.textColor,
    backgroundColor: props.bgColor,
    '&:hover': {
      backgroundColor: props.hoverColor,
    },
  }));
  return (
    <ColorButton className="hl-btn" variant="contained" {...props}>
      {props.text}
    </ColorButton>
  );
};

const ColorButton = styled(Button)<CustomButtonOutlinedProps>((props) => ({
  color: props.textColor,
  borderColor: props.textColor,
  '&:hover': {
    backgroundColor: props.hoverColor,
    borderColor: props.textColor,
  },
  '.MuiTouchRipple-root *': {
    color: 'var(--nav-active-detective)',
  },
}));
export const CustomButtonOutlined: FCC<Prettify<ButtonProps & CustomButtonOutlinedProps>> = (props) => {
  return (
    <ColorButton variant="outlined" {...props}>
      {props.text}
    </ColorButton>
  );
};
