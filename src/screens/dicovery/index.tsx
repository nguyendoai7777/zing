import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types';
import 'swiper/css';
import './discovery.css';
import { useEffect, useState } from 'react';
import { ButtonBase, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Autoplay } from 'swiper/modules';
import { DIS_HISTORY_SEARCH, DIS_RECOMMENDED_ARTIST, SLIDE_LIST } from '@const';
import DIconButton from '@components/icon-button';
import { NavButton } from '@components/single-components';
import { StandoutMusic } from './components/standout-music/standout-music.tsx';
import { RecommendedArtist } from './components/recommended-artist/recommended-artist.tsx';
import { Scrollable } from 'rx-scrollable';

const SWIPER_OPTION: SwiperOptions = {
  autoplay: true,
  loop: true,
  zoom: true,
  modules: [Autoplay],
};

export const DiscoveryScreen = () => {
  const [gallery, setGallery] = useState<(typeof SLIDE_LIST)[0][]>([]);
  const [swiperController, setSwiperController] = useState<SwiperClass>();
  const [deviceWidth, setDeviceType] = useState(innerWidth);

  useEffect(() => {
    window.onresize = (e) => {
      setDeviceType(innerWidth);
    };
    window.onload = () => {
      setDeviceType(innerWidth);
    };
    setTimeout(() => {
      setGallery(SLIDE_LIST);
    }, 2000);
  }, []);
  return (
    <Scrollable options={{ scrollbars: { autoHide: 'scroll' } }} defer className="my-scrollbar">
      <div className="slide-gallery relative ml-scroll-left ml-scroll-right">
        {gallery.length > 0 ? (
          <>
            <DIconButton
              className="slide-controller-btn cs-pointer flex-center-center"
              style={{ left: `0` }}
              siz="60px"
              onClick={() => swiperController!.slidePrev()}
            >
              <svg>
                <use href="#SlidePrev" />
              </svg>
            </DIconButton>
            <DIconButton
              className="slide-controller-btn cs-pointer flex-center-center"
              style={{ right: `0` }}
              siz="60px"
              onClick={() => swiperController!.slideNext()}
            >
              <svg style={{ transform: 'rotate(-180deg)' }}>
                <use href="#SlidePrev" />
              </svg>
            </DIconButton>
            <Swiper
              spaceBetween={25}
              slidesPerView={deviceWidth <= 768 ? 1 : 3}
              style={{ borderRadius: '10px' }}
              {...SWIPER_OPTION}
              onSwiper={(swiper) => setSwiperController(swiper)}
            >
              {gallery!.map((e) => (
                <SwiperSlide className="slide-item" key={e.key}>
                  <img src={e.img} style={{ userSelect: 'none' }} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : deviceWidth <= 768 ? (
          <Skeleton className="skeleton-4-slide skeleton-1-slide" animation="wave" variant="rounded" />
        ) : (
          <div className="fj-between">
            <Skeleton className="skeleton-4-slide" animation="wave" variant="rounded" />
            <Skeleton className="skeleton-4-slide" animation="wave" variant="rounded" />
            <Skeleton className="skeleton-4-slide" animation="wave" variant="rounded" />
          </div>
        )}
      </div>
      <div className="body-cc60">
        <div className="g-body">
          <div className="header-pai fj-between align-items-center">
            Nhạc Nổi Bật
            <NavButton color="var(--scrollbar-color)" text="Xem Thêm" textColor="var(--normal-text-color)" />
          </div>
          <StandoutMusic />
        </div>
        <div className="g-body">
          <div className="header-pai">Nghệ Sĩ đang theo dõi</div>
          <div className="history-box-group flex flex-wrap">
            {DIS_HISTORY_SEARCH.map((e) => (
              <Link className="history-item" key={e.id} to={e.href}>
                <ButtonBase className="force-white-color">
                  <img src={e.img} alt="" />
                </ButtonBase>
              </Link>
            ))}
          </div>
        </div>
        <div className="g-body">
          <div className="header-pai fj-between">
            Nghệ Sĩ Đề Xuất
            <NavButton color="var(--scrollbar-color)" text="Xem Thêm" textColor="var(--normal-text-color)" />
          </div>
          <div className="artist-box-group grid grid-cols-4 md:grid-cols-5 gap-4">
            {DIS_RECOMMENDED_ARTIST.map((e) => (
              <RecommendedArtist img={e.img} href={e.href} name={e.name} key={e.id} />
            ))}
          </div>
        </div>
      </div>
    </Scrollable>
  );
};
