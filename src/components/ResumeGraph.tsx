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
};

const NodeBadge: React.FC<{ label: string; clickable?: boolean; leaf?: boolean }> = ({ label, clickable, leaf }) => {
  return (
    <div
      className={
        `inline-flex items-center px-3 py-1 rounded-md border-2 bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground shadow-sm ` +
        (leaf && !clickable
          ? 'border-dashed border-light-gray dark:border-dark-gray opacity-90'
          : clickable
          ? 'border-light-blue dark:border-dark-blue text-light-blue dark:text-dark-blue hover:bg-light-blue/10 dark:hover:bg-dark-blue/10'
          : 'border-light-gray dark:border-dark-gray')
      }
    >
      {label}
    </div>
  );
};

const EdgeArrow: React.FC = () => (
  <span className="mx-2 text-light-gray dark:text-dark-gray">➜</span>
);

const Branch: React.FC<{
  node: ResumeNode;
  depth: number;
}> = ({ node, depth }) => {
  const [open, setOpen] = React.useState<boolean>(depth === 0);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const hasDetails = (node.details?.length ?? 0) > 0;
  const hasTimeline = Array.isArray(node.timeline) && node.timeline.length === 2;

  const onClick = () => {
    if (node.href) {
      window.open(node.href, '_blank');
    }
    if (hasChildren || hasDetails) {
      setOpen((v) => !v);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center cursor-pointer group select-none" onClick={onClick}>
        <NodeBadge label={node.label} clickable={!!node.href} leaf={!hasChildren && !hasDetails} />
        {hasTimeline && open && (
          <span className="ml-2 px-2 py-0.5 rounded-full border border-light-gray dark:border-dark-gray text-xs text-light-gray dark:text-dark-gray bg-light-background dark:bg-dark-background">
            {node.timeline![0]} — {node.timeline![1]}
          </span>
        )}
      </div>

      {(hasChildren || hasDetails) && open && (
        <div className="mt-2 ml-9 flex flex-col space-y-2">
          {[...(node.children ?? []),
            ...((node.details ?? []).map((d, i) => ({ id: `${node.id}-detail-${i}`, label: d })) as ResumeNode[]),
          ].map((child) => (
            <div key={child.id} className="flex flex-row items-center">
              <EdgeArrow />
              <Branch node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}

      {false && hasTimeline}
    </div>
  );
};

export const ResumeGraph: React.FC<Props> = ({ data }) => {
  return (
    <div className="my-4">
      <div className="flex flex-row items-start">
        <Branch node={data.root} depth={0} />
      </div>
    </div>
  );
};

export default ResumeGraph;


