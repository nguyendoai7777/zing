import { styled, Tooltip, tooltipClasses, type TooltipProps } from '@mui/material';

export const ColourTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--tooltip-bg)',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--tooltip-bg)',
    color: 'var(--tooltip-text)',
  },
}));
