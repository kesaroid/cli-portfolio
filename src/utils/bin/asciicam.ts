import { isCommandEnabled } from '../commandConfig';

export const PORTFOLIO_LAUNCH_APP_EVENT = 'portfolio:launch-app' as const;

export const asciicam = async (): Promise<string> => {
  if (!isCommandEnabled('ascii-cam')) {
    return `shell: command not found: ascii-cam. Try 'help' to get started.`;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(PORTFOLIO_LAUNCH_APP_EVENT, {
        detail: { app: 'ascii-cam' as const },
      }),
    );
  }

  return `Launching ascii-cam… Press Esc or ✕ to exit.`;
};
