import type { ReactElement, ReactNode, MouseEvent, Context, RefObject } from 'react';

declare global {
  export type PropsWithChildren<P> = P & {
    children?: ReactNode;
    className?: string | undefined;
  };

  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;

    displayName?: string | undefined;
  }

  export type FCC<P = {}> = FunctionComponent<P>;

  export type RMouseEvent<T> = MouseEvent<T>;
}

declare module 'react' {
  function createContext<T>(defaultValue: T): Context<T>;
  function createContext<T = undefined>(): Context<T>;

  function useRef<T>(): RefObject<T>;
}
