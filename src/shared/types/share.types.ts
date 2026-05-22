import { Gallery } from '@screens/top-100/components/gallery/gallery';
import { PathRouteProps } from 'react-router/dist/lib/components';

export interface Routes extends PathRouteProps {
  key: string;
  name: string;
}

export interface GalleryInfinity {
  id: string;
  name: string;
  release: string;
  artwork: string;
  newId?: string;
}
