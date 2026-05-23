import { type UIEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './visualization.css';
import type { SongBase } from '@typing';
import { analyser, barWidth, bufferLength, TOP_100_ALL } from '@const';
import { PlayingDecorator } from '@components/playing-decorator';

let recursive: undefined | number = 0;

export const Visualization = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D;
  let barHeight = 10;
  let x = 0;

  /*const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);*/
  const [info, setInfo] = useState<SongBase>();
  const [needColor, setNeedColor] = useState(false);
  const { songId } = useParams();

  let hue = 0;
  const getInfo = () => {
    const currentSong = TOP_100_ALL.find((e) => e.id === songId);
    setInfo(currentSong);
  };

  const animate = () => {
    x = 0;
    hue++;
    recursive = requestAnimationFrame(animate);
    if (ctx) {
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvasRef?.current?.width || 0, canvasRef?.current?.height || 0);
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(x, (canvasRef?.current?.height || barHeight) - barHeight - 2, barWidth, 5);
        ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
        ctx.fillRect(x, (canvasRef?.current?.height || barHeight) - dataArray[i], barWidth, canvasRef?.current?.height || barHeight);
        x += barWidth + 4;
      }
    }
  };

  const getScrollPos = (e: UIEvent<HTMLElement>) => {
    if (innerWidth >= 786) {
      if ((e.nativeEvent.target as HTMLElement).scrollTop > 300) {
        setNeedColor(true);
      } else {
        setNeedColor(false);
      }
    } else {
      if ((e.nativeEvent.target as HTMLElement).scrollTop > 560) {
        setNeedColor(true);
      } else {
        setNeedColor(false);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, [useLocation()]);

  useEffect(() => {
    getInfo();
    ctx = canvasRef!.current!.getContext('2d')!;
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = 881;
      canvasRef.current.height = 300;
    }
    /*audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration);
    });
    audioElement.addEventListener('timeupdate', () => {
      setCurrentTime(audioElement.currentTime);
    });*/
    if (innerWidth >= 600) {
      animate();
    }

    return () => {
      if (innerWidth >= 600) {
        cancelAnimationFrame(recursive as number);
        recursive = undefined;
      }
    };
  }, []);

  return (
    <div className="my-scrollbar flex s-detail justify-between blur-overlay" onScroll={getScrollPos}>
      <PlayingDecorator className="s-info sticky-top" style={{ minWidth: '300px' }} currentsong={info} />
      <div className="visualization relative  ml-scroll-right">
        <canvas
          style={{
            height: '300px',
            borderBottom: '1px solid var(--tooltip-bg)',
          }}
          ref={canvasRef}
        ></canvas>
        {/*<div className="duration" style={{ width: currentTime / duration * 100 + '%' }}></div>*/}
        <div className="lyrics-box">
          <div className={`header-pai sticky-top${needColor ? ' need-bg' : ''}`}>Lời bài hát</div>
          <div className="lyrics">
            {info?.lyric &&
              info?.lyric.map((e, i) => (
                <div className="lyric-line" key={i}>
                  {e.text}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
