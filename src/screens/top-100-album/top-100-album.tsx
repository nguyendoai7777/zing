import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { GalleryInfinity } from '@typing';
import { flattenArray } from '@utils';
import { TOP_100_GALLERY_OBJ } from '@const';

export const Top100Album = () => {
  const { top100Id } = useParams();
  const [detail, setDetail] = useState<GalleryInfinity>();

  useEffect(() => {
    const TOTAL_100 = flattenArray(Object.values(TOP_100_GALLERY_OBJ)) as GalleryInfinity[];
    const current = TOTAL_100.find((obj) => obj.id === top100Id);
    setDetail(current);
  }, []);
  return (
    <>
      {detail && <img src={detail.artwork} alt="" />}
      <h1>Demo là có route thôi, k rảnh làm</h1>
    </>
  );
};
