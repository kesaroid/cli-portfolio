import React from 'react';

interface CommandTilesProps {
  onCommandClick: (command: string) => void;
}

const commands = [
  { name: 'sumfetch', description: 'Display summary', icon: '🦁' },
  { name: 'resume', description: 'View resume', icon: '📜' },
  { name: 'readme', description: 'About me', icon: '📁' },
  { name: 'projects', description: 'My projects', icon: '🚀' },
];

export const CommandTiles: React.FC<CommandTilesProps> = ({ onCommandClick }) => {
  return (
    <div className="mb-6 mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {commands.map((cmd) => (
          <button
            key={cmd.name}
            onClick={() => onCommandClick(cmd.name)}
            className="group relative overflow-hidden rounded-lg border-2 border-light-yellow dark:border-dark-yellow bg-light-background dark:bg-dark-background p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-light-yellow/10 dark:hover:bg-dark-yellow/10 focus:outline-none focus:ring-2 focus:ring-light-yellow dark:focus:ring-dark-yellow"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">{cmd.icon}</span>
              <span className="text-sm font-semibold text-light-foreground dark:text-dark-foreground">
                {cmd.name}
              </span>
              <span className="text-xs text-light-gray dark:text-dark-gray opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {cmd.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandTiles;

