import * as bin from './bin';
import {
  getEnabledCommandNamesInOrder,
  resolveCommandName,
} from './commandConfig';

export const handleTabCompletion = (
  command: string,
  setCommand: React.Dispatch<React.SetStateAction<string>>,
) => {
  const prefix = command.toLowerCase();
  const names = getEnabledCommandNamesInOrder().filter((entry) => {
    if (!entry.startsWith(prefix)) return false;
    if (entry === 'clear') return true;
    const binKey = resolveCommandName(entry) as keyof typeof bin;
    return typeof bin[binKey] === 'function';
  });

  if (names.length === 1) {
    setCommand(names[0]);
  }
};
