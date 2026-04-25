import React, { useLayoutEffect } from 'react';
import AsciiView from './AsciiView';
import {
  CHARACTER_SET_KEYS,
  type AsciiCamSettings,
  type CharacterSetKey,
} from './characterSets';

const DEFAULT_SETTINGS: AsciiCamSettings = {
  fontSize: 10,
  colorMode: false,
  characterSet: 'standard',
};

const controlBtnClass =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-light-yellow text-light-foreground transition-colors hover:bg-light-yellow/15 focus:outline-none focus:ring-2 focus:ring-light-yellow dark:border-dark-yellow dark:text-dark-foreground dark:hover:bg-dark-yellow/15 dark:focus:ring-dark-yellow';

const settingsBarClass =
  'absolute right-4 top-16 z-[70] flex max-w-[min(calc(100vw-2rem),42rem)] flex-wrap items-center gap-4 rounded-lg border-2 border-light-yellow bg-light-background/95 px-4 py-3 text-light-foreground shadow-md backdrop-blur-sm dark:border-dark-yellow dark:bg-dark-background/95 dark:text-dark-foreground';

export interface AsciiCamProps {
  onExit: () => void;
}

const AsciiCam: React.FC<AsciiCamProps> = ({ onExit }) => {
  const [settings, setSettings] =
    React.useState<AsciiCamSettings>(DEFAULT_SETTINGS);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [retryToken, setRetryToken] = React.useState(0);
  const canvasAreaRef = React.useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = React.useState({ width: 1, height: 1 });

  useLayoutEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;

    const sync = () => {
      setCanvasSize({
        width: Math.max(1, el.clientWidth),
        height: Math.max(1, el.clientHeight),
      });
    };

    sync();
    const ro = new ResizeObserver(() => sync());
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [settingsOpen]);

  React.useEffect(() => {
    let active = true;
    let currentStream: MediaStream | null = null;

    const start = async () => {
      setError(null);
      try {
        const video = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (!active) {
          video.getTracks().forEach((t) => t.stop());
          return;
        }
        currentStream = video;
        setStream(video);
      } catch {
        if (active) {
          setStream(null);
          setError(
            'Unable to access the camera. Grant permission and use HTTPS.',
          );
        }
      }
    };

    start();

    return () => {
      active = false;
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
      setStream(null);
    };
  }, [retryToken]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  const handleExit = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onExit();
  };

  const stopFocusSteal = (e: React.SyntheticEvent) => {
    // _app.tsx focuses the terminal input on any document click; that steals
    // focus from <select> and collapses the native dropdown before a choice lands.
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-light-background dark:bg-dark-background"
      role="dialog"
      aria-modal="true"
      aria-label="ASCII camera"
      onMouseDown={stopFocusSteal}
      onClick={stopFocusSteal}
    >
      <button
        type="button"
        className={`absolute left-4 top-4 z-[70] ${controlBtnClass}`}
        onClick={handleExit}
        aria-label="Exit ascii-cam"
      >
        ✕
      </button>
      <button
        type="button"
        className={`absolute right-4 top-4 z-[70] ${controlBtnClass}`}
        onClick={() => setSettingsOpen((o) => !o)}
        aria-expanded={settingsOpen}
        aria-label="ASCII camera settings"
      >
        ⚙
      </button>

      {settingsOpen && (
        <div className={settingsBarClass}>
          <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-medium uppercase tracking-wide text-light-gray dark:text-dark-gray">
            <span>Resolution</span>
            <span className="flex items-center gap-2 normal-case text-light-foreground dark:text-dark-foreground">
              <input
                type="range"
                min={6}
                max={30}
                step={1}
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    fontSize: Number(e.target.value),
                  }))
                }
                className="min-w-0 flex-1 accent-light-yellow dark:accent-dark-yellow"
              />
              <span className="w-10 shrink-0 tabular-nums">
                {settings.fontSize}px
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-light-foreground dark:text-dark-foreground">
            <input
              type="checkbox"
              checked={settings.colorMode}
              onChange={(e) =>
                setSettings((s) => ({ ...s, colorMode: e.target.checked }))
              }
              className="h-4 w-4 shrink-0 accent-light-yellow dark:accent-dark-yellow"
            />
            Color mode
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-light-gray dark:text-dark-gray">
            <span>Character set</span>
            <select
              value={settings.characterSet}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  characterSet: e.target.value as CharacterSetKey,
                }))
              }
              className="max-w-[14rem] rounded border-2 border-light-yellow bg-light-background px-2 py-1.5 text-sm font-normal normal-case text-light-foreground dark:border-dark-yellow dark:bg-dark-background dark:text-dark-foreground"
            >
              {CHARACTER_SET_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div
        ref={canvasAreaRef}
        className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 pb-4 pt-16"
      >
        {error ? (
          <div className="mx-4 max-w-md rounded-lg border-2 border-light-red bg-light-background/90 p-6 text-center dark:border-dark-red dark:bg-dark-background/90">
            <p className="mb-4 text-sm text-light-foreground dark:text-dark-foreground">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setRetryToken((t) => t + 1);
              }}
              className="rounded-md border-2 border-light-yellow px-4 py-2 text-sm font-semibold text-light-foreground transition-colors hover:bg-light-yellow/15 dark:border-dark-yellow dark:text-dark-foreground dark:hover:bg-dark-yellow/15"
            >
              Retry
            </button>
          </div>
        ) : stream ? (
          <AsciiView
            settings={settings}
            stream={stream}
            canvasSize={canvasSize}
          />
        ) : (
          <p className="text-sm text-light-foreground dark:text-dark-foreground">
            Requesting camera access…
          </p>
        )}
      </div>
    </div>
  );
};

export default AsciiCam;
