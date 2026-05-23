import type { PathRouteProps } from 'react-router/dist/lib/components';

export interface Routes extends PathRouteProps {
  key: string;
  name: string;
  icon?: string;
}

export interface GalleryInfinity {
  id: string;
  name: string;
  release: string;
  artwork: string;
  newId?: string;
}
