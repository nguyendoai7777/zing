import { Button, type ButtonProps, styled } from '@mui/material';

interface CsButtonBaseProps {
  text: string;
  textTransform?:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'revert-layer'
    | 'unset'
    | 'capitalize'
    | 'full-size-kana'
    | 'full-width'
    | 'lowercase'
    | 'none'
    | 'uppercase';
}

export interface CustomButtonContainedProps extends CsButtonBaseProps {
  bgcolor?: string;
  hovercolor?: string;
  textcolor?: string;
}

export const CustomButtonContained = (props: ButtonProps & CustomButtonContainedProps) => {
  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: props.textcolor,
    backgroundColor: props.bgcolor,
    '&:hover': {
      backgroundColor: props.hovercolor,
    },
  }));
  return (
    <ColorButton className="hl-btn" variant="contained" {...props}>
      {props.text}
    </ColorButton>
  );
};

export interface CustomButtonOutlinedProps extends CsButtonBaseProps {
  hovercolor?: string;
  textcolor?: string;
}

export const CustomButtonOutlined = (props: ButtonProps & CustomButtonOutlinedProps) => {
  const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: props.textcolor,
    borderColor: props.textcolor,
    '&:hover': {
      backgroundColor: props.hovercolor,
      borderColor: props.textcolor,
    },
    '.MuiTouchRipple-root *': {
      color: 'var(--nav-active-detective)',
    },
  }));
  return (
    <ColorButton variant="outlined" {...props}>
      {props.text}
    </ColorButton>
  );
};
