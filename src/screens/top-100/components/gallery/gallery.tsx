import './gallery.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TOP_100_GALLERY_OBJ } from '@const';
import type { GalleryInfinity } from '@typing';
import { uuid } from '@utils';

export const Gallery = () => {
  const on = [...TOP_100_GALLERY_OBJ[1], ...TOP_100_GALLERY_OBJ[1]].map((e) => ({ ...e, newId: uuid() })) as GalleryInfinity[];
  const tw = [...TOP_100_GALLERY_OBJ[2], ...TOP_100_GALLERY_OBJ[2]].map((e) => ({ ...e, newId: uuid() })) as GalleryInfinity[];
  const th = [...TOP_100_GALLERY_OBJ[3], ...TOP_100_GALLERY_OBJ[3]].map((e) => ({ ...e, newId: uuid() })) as GalleryInfinity[];
  const [lineOne] = useState<GalleryInfinity[]>(on);
  const [lineTwo] = useState<GalleryInfinity[]>(tw);
  const [lineThree] = useState<GalleryInfinity[]>(th);

  return (
    <div className="gallery-root">
      <div className="gallery-animate">
        <div className="animate-line">
          {lineOne.map((e, i) => (
            <Link className={`gallery-nav ${i === 0 ? 'animate-entity' : ''}`} to={`album/${e.id}`} key={e.newId}>
              <img src={e.artwork} alt="" />
            </Link>
          ))}
        </div>
        <div className="animate-line">
          {lineTwo.map((e, i) => (
            <Link className={`gallery-nav ${i === 0 ? 'animate-entity' : ''}`} to={`album/${e.id}`} key={e.newId}>
              <img src={e.artwork} alt="" />
            </Link>
          ))}
        </div>
        <div className="animate-line">
          {lineThree.map((e, i) => (
            <Link className={`gallery-nav ${i === 0 ? 'animate-entity' : ''}`} to={`album/${e.id}`} key={e.newId}>
              <img src={e.artwork} alt="" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/*
<div className="gallery-auto-run">
  <div className="">
    <div className="line-box">
      {lineOne.map((e, i) => <Link className={`gallery-nav ${i === 0 ? 'auto-translate' : ''}`} to={`album/${e.id}`} key={uuid()}><img src={e.artwork} alt=""/></Link>)}
    </div>
  </div>
</div>;*/
