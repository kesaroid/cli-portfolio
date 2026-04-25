import React from 'react';
import { getDockCommands } from '../utils/commandConfig';

export interface AppDockProps {
  onCommandClick: (command: string) => void;
}

type AppItem = { name: string; icon: string; label?: string };

const dockSurface =
  'border-light-yellow dark:border-dark-yellow bg-light-background/95 dark:bg-dark-background/95 backdrop-blur-sm';

function DockButton({
  item,
  onCommandClick,
}: {
  item: AppItem;
  onCommandClick: (command: string) => void;
}) {
  const label = item.label ?? item.name;

  return (
    <div className="group relative flex shrink-0 items-center justify-center">
      <button
        type="button"
        onClick={() => onCommandClick(item.name)}
        title={label}
        aria-label={label}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-2xl transition-all duration-200 hover:bg-light-yellow/15 dark:hover:bg-dark-yellow/15 focus:outline-none focus:ring-2 focus:ring-light-yellow dark:focus:ring-dark-yellow"
      >
        <span aria-hidden>{item.icon}</span>
      </button>
      {/* Desktop tooltip — to the right */}
      <div
        className="pointer-events-none absolute left-full top-1/2 z-30 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-light-yellow/60 bg-light-background px-2.5 py-1 text-xs font-medium text-light-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-dark-yellow/60 dark:bg-dark-background dark:text-dark-foreground md:block"
        role="tooltip"
      >
        {label}
        <span className="absolute right-full top-1/2 mr-[-1px] h-0 w-0 -translate-y-1/2 border-y-[5px] border-r-[6px] border-y-transparent border-r-light-yellow/60 dark:border-r-dark-yellow/60" />
      </div>
      {/* Mobile / small screens — tooltip above */}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-light-yellow/60 bg-light-background px-2.5 py-1 text-xs font-medium text-light-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-dark-yellow/60 dark:bg-dark-background dark:text-dark-foreground md:hidden"
        role="tooltip"
      >
        {label}
        <span className="absolute left-1/2 top-full -mt-px h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-light-yellow/60 dark:border-t-dark-yellow/60" />
      </div>
    </div>
  );
}

export const AppDock: React.FC<AppDockProps> = ({ onCommandClick }) => {
  const [open, setOpen] = React.useState(false);
  const apps: AppItem[] = React.useMemo(() => getDockCommands(), []);

  return (
    <>
      {/* Desktop — vertical Unity-style dock */}
      <aside
        className={`fixed left-0 top-0 z-20 hidden h-full w-14 flex-col items-center gap-1 border-r-2 py-3 md:flex ${dockSurface}`}
        aria-label="Command shortcuts"
      >
        {apps.map((item) => (
          <DockButton
            key={item.name}
            item={item}
            onCommandClick={onCommandClick}
          />
        ))}
      </aside>

      {/* Mobile — bottom bar with expand toggle */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-20 flex flex-col border-t-2 md:hidden ${dockSurface}`}
        aria-label="Command shortcuts"
      >
        <div className="flex items-center justify-between border-b border-light-yellow/40 px-2 py-1 dark:border-dark-yellow/40">
          <span className="text-xs font-medium text-light-gray dark:text-dark-gray">
            Shortcuts
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded px-2 py-1 text-xs font-semibold text-light-foreground transition-colors hover:bg-light-yellow/15 dark:text-dark-foreground dark:hover:bg-dark-yellow/15 focus:outline-none focus:ring-2 focus:ring-light-yellow dark:focus:ring-dark-yellow"
            aria-expanded={open}
            aria-controls="app-dock-mobile-list"
          >
            {open ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <div
          id="app-dock-mobile-list"
          className={
            open
              ? 'flex max-h-[7.5rem] gap-1 overflow-x-auto overflow-y-hidden px-2 py-2'
              : 'hidden'
          }
        >
          {apps.map((item) => (
            <DockButton
              key={item.name}
              item={item}
              onCommandClick={onCommandClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AppDock;
