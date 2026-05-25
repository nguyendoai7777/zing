export interface CsButtonBaseProps {
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

export interface CustomButtonOutlinedProps extends CsButtonBaseProps {
  hoverColor?: string;
  textColor?: string;
}

export interface CustomButtonContainedProps extends CsButtonBaseProps, CustomButtonOutlinedProps {
  bgColor?: string;
}

export interface IconButtonProps {
  siz?: string;
  ariaLabel?: string;
  shape?: 'circle' | 'box';
  rippleColor?: string;
}
