import * as bin from './bin';
import { isCommandEnabled, resolveCommandName } from './commandConfig';

export const commandExists = (command: string) => {
  const name = command.split(' ')[0].toLowerCase();
  if (name === 'clear') {
    return isCommandEnabled('clear');
  }
  const binKey = resolveCommandName(name) as keyof typeof bin;
  return isCommandEnabled(name) && typeof bin[binKey] === 'function';
};
