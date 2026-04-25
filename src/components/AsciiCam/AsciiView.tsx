import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import config from '../../../config.json';
import {
  adjustColor,
  createBrightnessMap,
  getChar,
  getLuminance,
} from './asciiUtils';
import { CHAR_SETS, type AsciiCamSettings } from './characterSets';

const CONTRAST = 1.2;
const BRIGHTNESS = 0;
const INVERT = false;

type Palette = { background: string; yellow: string };

function useAsciiPalette(): Palette {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return useMemo(() => {
    const c = dark ? config.colors.dark : config.colors.light;
    return {
      background: c.background,
      yellow: c.yellow,
    };
  }, [dark]);
}

export interface AsciiViewProps {
  settings: AsciiCamSettings;
  stream: MediaStream | null;
  canvasSize: { width: number; height: number };
}

const AsciiView: React.FC<AsciiViewProps> = ({
  settings,
  stream,
  canvasSize,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const palette = useAsciiPalette();

  const ramp = CHAR_SETS[settings.characterSet];

  const renderCanvas = useCallback(
    (_time: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !video) {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      const fontScale = settings.fontSize || 10;
      const srcW = Math.floor(canvasSize.width / fontScale);
      const srcH = Math.floor(canvasSize.height / fontScale);

      if (srcW <= 0 || srcH <= 0) {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      const hiddenCanvas = hiddenCanvasRef.current;
      if (!hiddenCanvas) {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      if (hiddenCanvas.width !== srcW || hiddenCanvas.height !== srcH) {
        hiddenCanvas.width = srcW;
        hiddenCanvas.height = srcH;
      }

      const hiddenCtx = hiddenCanvas.getContext('2d', {
        willReadFrequently: true,
      });
      if (!hiddenCtx) {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      try {
        hiddenCtx.drawImage(video, 0, 0, srcW, srcH);
      } catch {
        animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
        return;
      }

      const pixels = hiddenCtx.getImageData(0, 0, srcW, srcH).data;
      const brightnessMap = createBrightnessMap(ramp);
      const { colorMode } = settings;

      canvas.width = srcW * fontScale;
      canvas.height = srcH * fontScale;

      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontScale}px 'Hack', monospace`;
      ctx.textBaseline = 'top';

      const pixelCount = srcW * srcH;

      for (let i = 0; i < pixelCount; i++) {
        const r = pixels[i * 4];
        const g = pixels[i * 4 + 1];
        const b = pixels[i * 4 + 2];

        let l = getLuminance(r, g, b);
        l = adjustColor(l, CONTRAST, BRIGHTNESS);

        const char = getChar(l, brightnessMap, INVERT);
        const x = (i % srcW) * fontScale;
        const y = Math.floor(i / srcW) * fontScale;

        if (colorMode) {
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          ctx.fillStyle = palette.yellow;
        }

        ctx.fillText(char, x, y);
      }

      animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));
    },
    [
      settings,
      canvasSize.height,
      canvasSize.width,
      ramp,
      palette.background,
      palette.yellow,
    ],
  );

  useEffect(() => {
    if (!stream) return;

    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    video.play();

    animationIdRef.current = requestAnimationFrame((t) => renderCanvas(t));

    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [renderCanvas, stream]);

  return (
    <>
      <video
        ref={videoRef}
        className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
        playsInline
        muted
        aria-hidden
      />
      <canvas ref={hiddenCanvasRef} className="hidden" aria-hidden />
      <canvas
        ref={canvasRef}
        className="block max-h-full max-w-full"
        aria-hidden
      />
    </>
  );
};

export default memo(AsciiView);
