import config from '../../config.json';

type CommandConfigEntry = {
  enabled?: boolean;
  description?: string;
  showInDock?: boolean;
  dockIcon?: string;
  category?: string;
};

type CommandsMap = Record<string, CommandConfigEntry>;

const commands = (config as { commands?: CommandsMap }).commands ?? {};

export const getCommandConfig = (commandName: string): CommandConfigEntry => {
  return commands[commandName] ?? {};
};

export const isCommandEnabled = (commandName: string): boolean => {
  const entry = getCommandConfig(commandName);
  return entry.enabled ?? false;
};

export const getCommandDescription = (commandName: string): string => {
  const entry = getCommandConfig(commandName);
  return entry.description ?? '';
};

export const getCommandCategory = (commandName: string): string => {
  const entry = getCommandConfig(commandName);
  return entry.category ?? 'misc';
};

export const getEnabledCommandNamesInOrder = (
  availableCommands?: string[],
): string[] => {
  const configuredNames = Object.keys(commands).filter((name) =>
    isCommandEnabled(name),
  );

  if (!availableCommands) {
    return configuredNames;
  }

  const availableSet = new Set(availableCommands);
  return configuredNames.filter((name) => availableSet.has(name));
};

export const getDockCommands = (): Array<{
  name: string;
  icon: string;
  label: string;
}> => {
  return Object.entries(commands)
    .filter(([, entry]) => (entry.enabled ?? false) && (entry.showInDock ?? false))
    .map(([name, entry]) => ({
      name,
      icon: entry.dockIcon ?? '•',
      label: name,
    }));
};

