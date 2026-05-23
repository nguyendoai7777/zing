import type { SvgIconSrc } from '@components/svg/svg-src.types';
import type { CastString } from '@typing';
import type { ComponentProps } from 'react';

export interface SvgProps extends ComponentProps<'svg'> {
  src: CastString<SvgIconSrc>;
}

const XSvg: FCC<SvgProps> = ({ src, ...props }) => {
  return (
    <svg {...props}>
      <use href={`#${src}`} />
    </svg>
  );
};

export default XSvg;
