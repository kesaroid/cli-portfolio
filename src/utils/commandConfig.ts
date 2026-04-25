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

/** Maps config / user-facing command names to valid `bin` export keys (JS identifiers). */
export const COMMAND_ALIASES: Record<string, string> = {
  'ascii-cam': 'asciicam',
};

/**
 * Resolves a user-typed command (e.g. `ascii-cam`) to the `bin` module export name (`asciicam`).
 */
export const resolveCommandName = (userCommand: string): string => {
  const lower = userCommand.toLowerCase();
  return COMMAND_ALIASES[lower] ?? lower;
};

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
    .filter(
      ([, entry]) => (entry.enabled ?? false) && (entry.showInDock ?? false),
    )
    .map(([name, entry]) => ({
      name,
      icon: entry.dockIcon ?? '•',
      label: name,
    }));
};
