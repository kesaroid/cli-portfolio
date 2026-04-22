import React from 'react';

type ResumeNode = {
  id: string;
  label: string;
  children?: ResumeNode[];
  href?: string;
  details?: string[];
  // Two values only: [start, end]
  timeline?: [string, string];
};

export type ResumeData = {
  root: ResumeNode;
};

type Props = {
  data: ResumeData;
  resumeUrl?: string;
};

// Context that lets any Branch notify the whole tree to re-measure when a
// node opens or closes. A monotonically increasing `version` is used as a
// dependency in each Branch's layout effect.
type RGContextValue = {
  version: number;
  bump: () => void;
};
const RGContext = React.createContext<RGContextValue>({
  version: 0,
  bump: () => {},
});

const RGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [version, setVersion] = React.useState(0);
  const bump = React.useCallback(() => setVersion((v) => v + 1), []);
  const value = React.useMemo(() => ({ version, bump }), [version, bump]);
  return <RGContext.Provider value={value}>{children}</RGContext.Provider>;
};

const NodeBadge = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    clickable?: boolean;
    leaf?: boolean;
    expandable?: boolean;
    open?: boolean;
    onClick?: () => void;
    timeline?: [string, string];
    root?: boolean;
  }
>(({ label, clickable, leaf, expandable, open, onClick, timeline, root }, ref) => {
  const base =
    'relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground shadow-sm transition-colors duration-150 select-none whitespace-nowrap';
  const tone = root
    ? 'border-2 border-light-yellow dark:border-dark-yellow text-light-yellow dark:text-dark-yellow font-semibold'
    : clickable
    ? 'border-light-blue dark:border-dark-blue text-light-blue dark:text-dark-blue hover:bg-light-blue/10 dark:hover:bg-dark-blue/10'
    : leaf
    ? 'border-dashed border-light-gray/70 dark:border-dark-gray/70 opacity-90'
    : 'border-light-gray dark:border-dark-gray hover:bg-light-gray/5 dark:hover:bg-dark-gray/10';
  const cursor = expandable || clickable ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      ref={ref}
      data-rg-badge="1"
      className={`${base} ${tone} ${cursor}`}
      onClick={onClick}
    >
      {expandable && (
        <span
          className={`inline-block text-xs transition-transform duration-200 ease-out ${
            open ? 'rotate-90' : 'rotate-0'
          }`}
          aria-hidden
        >
          ▸
        </span>
      )}
      <span>{label}</span>
      {timeline && Array.isArray(timeline) && timeline.length === 2 && (
        <span className="ml-1 px-1.5 py-0.5 rounded-md border border-light-gray/60 dark:border-dark-gray/60 text-[10px] text-light-gray dark:text-dark-gray">
          {timeline[0]} — {timeline[1]}
        </span>
      )}
    </div>
  );
});
NodeBadge.displayName = 'NodeBadge';

type ConnectorPath = {
  key: string;
  d: string;
};

// Compute position of `el` relative to ancestor via the offsetParent chain.
// This is immune to CSS transforms, so ongoing animations won't shift the
// measured coordinates — the arrow always targets the final layout position.
const getRelativeOffset = (
  el: HTMLElement,
  ancestor: HTMLElement,
): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  let cur: HTMLElement | null = el;
  // Hard cap to avoid any pathological loop.
  for (let i = 0; i < 100 && cur && cur !== ancestor; i++) {
    x += cur.offsetLeft;
    y += cur.offsetTop;
    const next = cur.offsetParent as HTMLElement | null;
    if (!next) break;
    cur = next;
  }
  return { x, y };
};

const Branch: React.FC<{
  node: ResumeNode;
  depth: number;
}> = ({ node, depth }) => {
  const [open, setOpen] = React.useState<boolean>(depth === 0);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const hasDetails = (node.details?.length ?? 0) > 0;
  const expandable = hasChildren || hasDetails;
  const { version, bump } = React.useContext(RGContext);

  const allChildren: ResumeNode[] = React.useMemo(() => {
    const base = node.children ?? [];
    const detailNodes = (node.details ?? []).map((d, i) => ({
      id: `${node.id}-d-${i}`,
      label: d,
    }));
    return [...base, ...detailNodes];
  }, [node]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const childWrapperRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const [paths, setPaths] = React.useState<ConnectorPath[]>([]);
  const [size, setSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const recompute = React.useCallback(() => {
    const c = containerRef.current;
    const p = parentRef.current;
    if (!c || !p) return;

    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    const pRight = p.offsetLeft + p.offsetWidth;
    const pCenterY = p.offsetTop + p.offsetHeight / 2;

    const next: ConnectorPath[] = [];
    childWrapperRefs.current.forEach((wrapper, i) => {
      if (!wrapper) return;
      // The first badge inside this wrapper is the direct child Branch's
      // badge. We aim the arrow at that badge rather than at the wrapper
      // center, which would drift when the child's own subtree expands.
      const badge = wrapper.querySelector<HTMLElement>('[data-rg-badge="1"]');
      if (!badge) return;

      const pos = getRelativeOffset(badge, c);
      const ex = pos.x;
      const ey = pos.y + badge.offsetHeight / 2;
      const dx = Math.max(ex - pRight, 12);
      const c1x = pRight + dx * 0.55;
      const c2x = ex - dx * 0.55;
      const d = `M ${pRight} ${pCenterY} C ${c1x} ${pCenterY}, ${c2x} ${ey}, ${ex} ${ey}`;
      next.push({ key: allChildren[i]?.id ?? String(i), d });
    });

    setPaths(next);
    setSize({ w: cw, h: ch });
  }, [allChildren]);

  React.useLayoutEffect(() => {
    if (!open) {
      setPaths([]);
      return;
    }
    // Re-measure now and on the next frame to catch layout settling after
    // descendants finish mounting their own nested children.
    recompute();
    const raf = requestAnimationFrame(() => recompute());

    const ro = new ResizeObserver(() => recompute());
    if (containerRef.current) ro.observe(containerRef.current);
    if (parentRef.current) ro.observe(parentRef.current);
    childWrapperRefs.current.forEach((el) => {
      if (el) ro.observe(el);
    });

    const onResize = () => recompute();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
    // `version` is included so that any open/close anywhere in the tree
    // forces every Branch to re-measure — ancestors update even when the
    // resize observer misses a deep descendant's layout shift.
  }, [open, allChildren.length, recompute, version]);

  const onClick = () => {
    if (node.href) {
      window.open(node.href, '_blank');
    }
    if (expandable) {
      setOpen((v) => !v);
      bump();
    }
  };

  const markerId = `rg-arrow-${node.id}-${depth}`;

  return (
    <div ref={containerRef} className="relative flex items-center">
      <NodeBadge
        ref={parentRef}
        label={node.label}
        clickable={!!node.href}
        leaf={!expandable}
        expandable={expandable}
        open={open}
        onClick={onClick}
        timeline={node.timeline}
        root={depth === 0}
      />

      {open && allChildren.length > 0 && (
        <div className="ml-16 flex flex-col gap-3 py-1">
          {allChildren.map((child, i) => (
            <div
              key={child.id}
              ref={(el) => {
                childWrapperRefs.current[i] = el;
              }}
              className="rg-branch-enter"
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
            >
              <Branch node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}

      {open && paths.length > 0 && size.w > 0 && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          overflow="visible"
          className="absolute left-0 top-0 pointer-events-none text-light-gray dark:text-dark-gray"
          style={{ overflow: 'visible' }}
          aria-hidden
        >
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {paths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
              className="rg-path"
            />
          ))}
        </svg>
      )}
    </div>
  );
};

const DownloadButton: React.FC<{ resumeUrl: string }> = ({ resumeUrl }) => (
  <button
    onClick={() => window.open(resumeUrl, '_blank')}
    className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-light-blue dark:border-dark-blue text-light-blue dark:text-dark-blue hover:bg-light-blue/10 dark:hover:bg-dark-blue/10 flex items-center justify-center transition-colors cursor-pointer"
    title="Open resume"
    aria-label="Open resume"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  </button>
);

export const ResumeGraph: React.FC<Props> = ({ data, resumeUrl }) => {
  return (
    <div className="my-4 w-full overflow-x-auto">
      <div className="inline-flex items-center gap-4 pr-6 pb-2 align-top">
        {resumeUrl && <DownloadButton resumeUrl={resumeUrl} />}
        <RGProvider>
          <Branch node={data.root} depth={0} />
        </RGProvider>
      </div>
    </div>
  );
};

export default ResumeGraph;
