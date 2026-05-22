import './recommended-artist.css';
import { ButtonBase } from '@mui/material';
import { DIS_RECOMMENDED_ARTIST } from '@const';

export type RecommendedArtistPr = (typeof DIS_RECOMMENDED_ARTIST)[0];
export type RecommendedArtistProps = Omit<RecommendedArtistPr, 'id'>;

export const RecommendedArtist = (pr: RecommendedArtistProps) => {
  return (
    <>
      <ButtonBase className="recommended-item relative" color="#fff">
        <img src={pr.img} alt="" />
        <div className="backdrop absolute"></div>
        <div className="artist-name absolute text-nowrap">{pr.name}</div>
        <div className="artist-inkbar absolute"></div>
      </ButtonBase>
    </>
  );
};
